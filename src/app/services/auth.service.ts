import {Injectable} from '@angular/core';
import {jwtDecode} from "jwt-decode";
import {BehaviorSubject, catchError, Observable, Subject, tap, throwError} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {PlaySoundService} from "./play-sound.service";
import {ModalService} from "./modal.service";
import {TimersService} from "./timers.service";


export interface UserItem {
  itemName: string;
  dropRate: number;
  gemsValue: number;
  quant: number;
  rarity: string;
  itemSrc: string;
  describe: string;
}

export interface DailyMissionData {
  writing: boolean;
  reading: boolean;
  listening: boolean;
  speaking: boolean;
  chestWasOpen1: boolean;
  chestWasOpen2: boolean;
  chestWasOpen3: boolean;
  chestWasOpen4: boolean;
  strikes: number;
  rewardPerChest: number;
  chestsOpenedAt: number;
  refreshTimeAt: number;
  [key: `chestWasOpen${number}`]: boolean;
}



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'token';
  private refreshTokenKey = 'refreshToken';
  private userKey = 'userData';
  private apiUrl = 'https://lingobot-api.onrender.com/'; // Ajuste para o URL real do seu backend
  // private readonly  apiUrl = "http://127.0.0.1:5000/" //aqui tem a barra, no outro arquivo não, pq nao padroniza seu FDP!!!

  private userSubject = new BehaviorSubject<any>(this.getUserData()); // Inicializa com os dados do localStorage
  user$ = this.userSubject.asObservable(); // Observable para observar as mudanças no usuário
  levelUpEvent = new Subject<void>();
  tokenEvent = new Subject<void>();
  savingStarted = new Subject<void>();
  savingFinished = new Subject<void>();

  constructor(private http: HttpClient,
              private playSound: PlaySoundService,
              private modalService: ModalService) {

    //console.log("User data atual é ", JSON.stringify(this.getUserData()))

    //this.updateDailyMission({ writing: true });

  }


  showUserData(){
     console.log(JSON.stringify(this.getUserData()));
  }

  saveLocalDataOnBackend() {
    this.modalService.showFloppyDisk();

    const token = localStorage.getItem('token');
    if (!token) {
      this.modalService.hideFloppyDisk(); // Hide if no token
      return;
    }

//   console.log("Data sended...");
    const body = this.getUserData();
    //    console.log("Dados atuais do usuário ->", JSON.stringify(body));

    this.http.post(`${this.apiUrl}generate-new-jwt`, body, {
      headers: {'Content-Type': 'application/json'}
    }).subscribe({
      next: (response: any) => {
        if (response.access_token) {
          localStorage.setItem("access_token", response.access_token);
          console.log("Novo JWT salvo:", response.access_token);
        } else {
          console.error("Resposta do servidor não contém access_token:", response);
        }
        this.modalService.hideFloppyDisk();
      },
      error: (error) => {
        console.error("Erro ao gerar novo JWT:", error);
        this.modalService.hideFloppyDisk();
      }
    });

  }


  getDailyData(): DailyMissionData {
    const userData = this.getUserData();

    // If userData is null or undefined, return a default DailyMissionData
    if (!userData) {
      return {
        writing: false,
        reading: false,
        listening: false,
        speaking: false,
        chestWasOpen1: false,
        chestWasOpen2: false,
        chestWasOpen3: false,
        chestWasOpen4: false,
        strikes: 0,
        rewardPerChest: 5,
        chestsOpenedAt: 0,
        refreshTimeAt: 0
      };
    }

    // Existing logic for parsing dailyMissions if it's a string
    if (typeof userData.dailyMissions === 'string') {
      try {
        return JSON.parse(userData.dailyMissions);
      } catch (e) {
        console.error('Error parsing dailyMissions from string:', e);
        // Fallback to default or handle error appropriately
        return {
          writing: false,
          reading: false,
          listening: false,
          speaking: false,
          chestWasOpen1: false,
          chestWasOpen2: false,
          chestWasOpen3: false,
          chestWasOpen4: false,
          strikes: 0,
          rewardPerChest: 5,
          chestsOpenedAt: 0,
          refreshTimeAt: 0
        };
      }
    }
    // If userData exists and dailyMissions is not a string, return it directly
    return userData.dailyMissions;
  }

  updateDailyMission(updates: Partial<DailyMissionData>): void {
    const userData = this.getUserData();
    if (!userData) { // Check for userData being null
      console.error('User data not found.');
      return;
    }

    // Get the current dailyMissions, ensuring it's a proper object
    const currentDailyMissions = this.getDailyData(); // This will handle parsing if it's a string

    const updatedDailyMissions = {
      ...currentDailyMissions, // Now this will spread a proper object
      ...updates
    };

    // Update the dailyMissions property within the main user data
    const updatedUser = {
      ...userData,
      dailyMissions: updatedDailyMissions
    };

    localStorage.setItem(this.userKey, JSON.stringify(updatedUser));
    this.userSubject.next(updatedUser); // Notify subscribers of the change
  }

  resetDailyMissions(): void {
    const defaultDailyData: DailyMissionData = {
      writing: false,
      reading: false,
      listening: false,
      speaking: false,
      chestWasOpen1: false,
      chestWasOpen2: false,
      chestWasOpen3: false,
      chestWasOpen4: false,
      strikes: 0,
      rewardPerChest: 5,
      chestsOpenedAt: 0,
      refreshTimeAt: 0
    };
    this.updateDailyMission(defaultDailyData);
  }


  getLearning(){
    const userData = this.getUserData();
    return userData.learning;
  }

  getPlano(){
     const userData = this.getUserData();
     return userData.plano;
  }

  getUserLevel(){
     const userData = this.getUserData();
     return userData.Level;
  }

  getDifficulty(){
    const userData = this.getUserData();
    return  userData.difficulty;
  }


  getRanking(){
    const userData = this.getUserData();
    return  userData.ranking
  }
  getUserName(){
    const userData = this.getUserData();
    return  userData.nome;
  }
  getLingoEXP(){
    const userData = this.getUserData();
    return  userData.LingoEXP;
  }


  /**
  getAndarUser(){
    const userData = this.getUserData();
    return  userData.ranking
  }

  checkAndUpdateRanking(novoAndar: number) {
    const userData = this.getUserData();

    console.log("Novo andar:", novoAndar);
    console.log("Ranking atual:", userData.ranking);

    // Se não tiver ranking definido, já inicia com o novoAndar
    if (!userData || typeof userData.ranking !== 'number') {
      this.updateLocalUserData({ ranking: novoAndar });
      return;
    }

    // Só atualiza se o novoAndar for maior que o ranking atual
    if (novoAndar > userData.ranking) {
      this.updateLocalUserData({ ranking: novoAndar });
    }

  }

**/


  saveUserData(token: string): void {
    localStorage.setItem('token', token);
    try {
      const decoded: any = jwtDecode(token);  // Decodifica o token
      localStorage.setItem(this.userKey, JSON.stringify(decoded)); // Salva no localStorage
      this.userSubject.next(decoded); // Atualiza o BehaviorSubject com os dados do usuário
     // console.log("saveUserData ativado (contem id?)-> " + localStorage.getItem(this.userKey));
    } catch (error) {
      console.error('Erro ao decodificar o token:', error);
    }
  }

  getUserData(): any {
    const userData = localStorage.getItem(this.userKey);
    return userData ? JSON.parse(userData) : null;
  }




updateLocalUserData(changes: any): void {
  const userData = this.getUserData();
  if (!userData) return;

  const updatedUser = {
    ...userData,
    ...Object.keys(changes).reduce((acc, key) => {
      const isRankingKey = key === "ranking";
      const isBatteryKey = key === "battery";
      const isNum = typeof changes[key] === "number" && typeof userData[key] === "number";

      // ----------- Lógica para bateria -----------
      if (isBatteryKey) {
        const currentBattery = userData[key];
        const newBattery = currentBattery + changes[key];

        if (currentBattery >= 10) {
          alert("A bateria já está cheia (10). Nenhuma mudança será aplicada.");
          acc[key] = currentBattery;
          return acc;
        }

        if (changes[key] > 10) {
          alert(`${changes[key]} é maior que 10. Mudança recusada.`);
          acc[key] = currentBattery;
          return acc;
        }

        acc[key] = Math.max(0, Math.min(10, newBattery));
        return acc;
      }

      // ----------- Tokens e gemas -----------
      if ((key === "tokens" || key === "gemas") && typeof changes[key] === "number") {
        const currentValue = userData[key] || 0;
        acc[key] = Math.max(0, currentValue + changes[key]);
        return acc;
      }

      // ----------- XP sempre soma -----------
      if (key === "LingoEXP" && typeof changes[key] === "number") {
        const currentValue = userData[key] || 0;
        acc[key] = currentValue + changes[key];
        return acc;
      }

      // ----------- Level sempre soma -----------
      if (key === "Level" && typeof changes[key] === "number") {
        const currentValue = userData[key] || 0;
        acc[key] = currentValue + changes[key];
        return acc;
      }

      // ----------- Outros números (subtração) -----------
      if (isNum && !isRankingKey) {
        acc[key] = userData[key] >= changes[key] ? userData[key] + changes[key] : 0;
      } else {
        acc[key] = changes[key];
      }

      return acc;
    }, {} as any),
  };

  localStorage.setItem(this.userKey, JSON.stringify(updatedUser));
  this.userSubject.next(updatedUser);
}




  decreaseLocalUserData(changes: any): void {
    const userData = this.getUserData();
    if (!userData) return;

    // Aplica a subtração nos tokens, evitando que o número fique negativo
    const updatedUser = {
      ...userData,
      ...Object.keys(changes).reduce((acc, key) => {
        if (typeof changes[key] === "number" && typeof userData[key] === "number") {
          // Verifica se a subtração não resultará em valor negativo
          acc[key] = userData[key] >= changes[key] ? userData[key] - changes[key] : 0; // Garante que não ficará negativo
        } else {
          acc[key] = changes[key]; // Substitui os demais valores normalmente
        }
        return acc;
      }, {} as any),
    };

    // Salva a alteração no localStorage
    localStorage.setItem(this.userKey, JSON.stringify(updatedUser));
    this.userSubject.next(updatedUser); // Atualiza o BehaviorSubject
  }





  getUserItems(): UserItem[] {
    const userData = this.getUserData();

    if (!userData || !userData.items) {
      return [];
    }

    try {
      // Faz o parse da string JSON
      const items: UserItem[] = JSON.parse(userData.items);
      return items;
    } catch (e) {
      console.error('Erro ao parsear os itens do usuário:', e);
      return [];
    }
  }




  sellUserItem(itemToSell: UserItem): boolean {
    const userData = this.getUserData();

    if (!userData || !userData.items) return false;

    try {
      const items: UserItem[] = JSON.parse(userData.items);

      const index = items.findIndex(i =>
        i.itemName === itemToSell.itemName &&
        i.rarity === itemToSell.rarity &&
        i.itemSrc === itemToSell.itemSrc
      );

      if (index === -1 || items[index].quant <= 0) return false;

      // Reduz 1 da quantidade
      items[index].quant -= 1;

      // Remove se acabou
      if (items[index].quant === 0) {
        items.splice(index, 1);
      }

      // Define o valor com base na raridade
      const reward = itemToSell.gemsValue || itemToSell || 0;

      if (['common', 'uncommon', 'rare'].includes(itemToSell.rarity)) {
        this.updateLocalUserData({ tokens: reward });
      } else if (['epic', 'legendary'].includes(itemToSell.rarity)) {
        this.updateLocalUserData({ gemas: reward });
      }

      // Atualiza o localStorage
      userData.items = JSON.stringify(items);
      // Salva os itens atualizados
      this.updateLocalUserData({ items: JSON.stringify(items) });

      return true;

    } catch (e) {
      console.error('Erro ao vender item:', e);
      return false;
    }
  }




  addRandomItemToUser(): void {
    this.playSound.playItemDrop()
    this.http.get<any[]>('assets/lingobot/json/itens/itens.json').subscribe((itemPool) => {
      const userData = this.getUserData();
      if (!userData) return;

      const totalRate = itemPool.reduce((sum, item) => sum + item.dropRate, 0);
      const rand = Math.random() * totalRate;

      let cumulative = 0;
      let selectedItem = itemPool[0];
      for (let item of itemPool) {
        cumulative += item.dropRate;
        if (rand <= cumulative) {
          selectedItem = item;
          break;
        }
      }

      const currentItems: any[] = userData.items ? JSON.parse(userData.items) : [];
      const index = currentItems.findIndex(i =>
        i.itemName === selectedItem.itemName &&
        i.rarity === selectedItem.rarity &&
        i.itemSrc === selectedItem.itemSrc
      );

      if (index !== -1) {
        currentItems[index].quant += 1;
      } else {
        currentItems.push({ ...selectedItem, quant: 1 });
      }

      this.updateLocalUserData({ items: JSON.stringify(currentItems) });

     // console.log("Item adicionado ao inventário:", selectedItem.itemName);

      // MOSTRA O MODAL COM O ITEM
      this.modalService.toggleNewItemsModal(true, selectedItem);
    });
  }





calcularSkillsMinimas(index: number): number {
    let total = 5; // Começa com 5 no primeiro pedágio (andar 4)
    let incremento = 6;
    for (let i = 1; i <= index; i++) {
      total += incremento;
      incremento++;
    }
    return total;
  }



  checkQuest(): any {
    const andar = this.getRanking();

//    console.log('[checkQuest] Andar:', andar);

    const userData = this.getUserData();

    const precisaPagar = andar % 4 === 0;

  //  console.log('[checkQuest] precisaPagar:', precisaPagar);

    if (!precisaPagar) {
    //  console.log('[checkQuest] Nenhum pedágio necessário.');
      return {
        precisaPagar: false,
        mensagem: 'Nenhum pedágio necessário neste andar.',
      };
    }

    const indexPedagio = Math.floor((andar - 1) / 4);
    //console.log('[checkQuest] indexPedagio:', indexPedagio);

    const base = {
      tokens: 100,
      gemas: 20,
      level: 10,
      skills: 5,
      multiplicador: 1.5
    };

    const custoTokens = Math.floor(base.tokens * Math.pow(base.multiplicador, indexPedagio));
    const custoGemas = Math.floor(base.gemas * Math.pow(base.multiplicador, indexPedagio));
    const levelMinimo = base.level + indexPedagio * 5;
    const skillsMinimas = this.calcularSkillsMinimas(indexPedagio);

    const requisitos = [
      {
        nome: `Ter ${custoGemas} Gemas`,
        completo: userData.gemas >= custoGemas
      },
      {
        nome: `Ter ${custoTokens} Gold Coins`,
        completo: userData.tokens >= custoTokens
      },
      {
        nome: `Level ${levelMinimo}`,
        completo: userData.Level >= levelMinimo
      },
      {
        nome: `Level ${skillsMinimas} em Listening`,
        completo: userData.listening >= skillsMinimas
      },
      {
        nome: `Level ${skillsMinimas} em Speaking`,
        completo: userData.speaking >= skillsMinimas
      },
      {
        nome: `Level ${skillsMinimas} em Reading`,
        completo: userData.reading >= skillsMinimas
      },
      {
        nome: `Level ${skillsMinimas} em Writing`,
        completo: userData.writing >= skillsMinimas
      }
    ];


    requisitos.forEach((r, i) => {
      console.log(`[checkQuest] Requisito ${i + 1}: ${r.nome} - ${r.completo ? 'OK' : 'FALHOU'}`);
    });

    const podeSubir = requisitos.every(r => r.completo);
    console.log('[checkQuest] podeSubir:', podeSubir);

    return {
      precisaPagar: true,
      podeSubir,
      mensagem: podeSubir
        ? 'Você pode subir para o próximo andar!'
        : 'Você não possui os recursos suficientes para subir.',
      requisitos
    };
  }





















/**

  updateMetaUser(changes: Record<string, boolean>): void {
    const userData = this.getUserData();
    if (!userData || !userData.metasDiarias) return;

    const currentDate = new Date().toISOString().split('T')[0]; // Data no formato YYYY-MM-DD

    // Verifica se já foi feito o claim para a meta hoje
    const updatedMetas = { ...userData.metasDiarias };

    // Loop pelas metas recebidas
    Object.keys(changes).forEach((key) => {
      // Verifica se o usuário já fez claim da meta hoje
      const lastClaimDate = localStorage.getItem(`${key}_claim_date`);
      if (lastClaimDate === currentDate && changes[key] === true) {
        console.log(`Já foi feito claim para ${key} hoje.`);
        return; // Não permite fazer claim se já foi feito hoje
      }

      // Atualiza o estado da meta
      updatedMetas[key] = changes[key];

      // Se o usuário fez claim, armazena a data do claim
      if (changes[key] === true) {
        localStorage.setItem(`${key}_claim_date`, currentDate);
      }
    });

    // Atualiza os dados do usuário
    const updatedUser = { ...userData, metasDiarias: updatedMetas };

    // Salva no localStorage
    localStorage.setItem(this.userKey, JSON.stringify(updatedUser));
    this.userSubject.next(updatedUser); // Atualiza o BehaviorSubject

    //console.log("MetasDiarias atualizadas ->", updatedMetas);
  }


**/




  public getJWT_Token(): string {
    return <string>localStorage.getItem("token");
  }


 public getAuthHeaders(): HttpHeaders {
    const token = this.getJWT_Token();
   return new HttpHeaders({Authorization: `Bearer ${token}`});
  }


  fazerCheckin() {
    const userData = this.getUserData();  // Supondo que tenha uma função para obter os dados do usuário

    if (!userData) {
      console.error('Erro: Usuário não encontrado no localStorage');
      return;
    }

    // O ID do usuário é obtido a partir dos dados de usuário
    this.http.post(`${this.apiUrl}checkin/${userData.id}`, { checkIn: true })
      .subscribe((res: any) => {
        console.log(res.mensagem); // Mensagem de sucesso

        this.updateLocalUserData({ checkIn: true });
        this.updateLocalUserData({   nextCheckinTime: new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString()  });


      }, err => {
        console.error('Erro no check-in:', err);
      });
  }




  getGemas(){
     const userData = this.getUserData();
     return userData.gemas;
  }

  getBattery(){
    const userData = this.getUserData();
    return userData.battery;
  }


  addBatteryEnergy(number: number){
     // Verifica se a bateria já está cheia
     if (this.getBattery() >= 10) {
       console.log(this.getBattery());
       return;
     }

     // Verifica se o usuário tem gemas suficientes
     if (this.getGemas() < number) {
       this.showGemasWarning();
       return;
     }

     // Se tem gemas suficientes, adiciona bateria e remove as gemas
     if (this.getBattery() < 10) {
       this.updateLocalUserData({ battery : number});
       this.decreaseLocalUserData({ gemas : number });
     }
  }
  removeBatteryEnergy(){
    if (this.getBattery() >= 0){
      this.decreaseLocalUserData({ battery : 1 })
    }
  }







  addXpSkills(skill: string){
    switch (skill) {
       case 'reading':
         this.updateLocalUserData({ reading: 1 });
         break;
       case 'speaking':
         this.updateLocalUserData({ speaking: 1 });
         break;
       case 'listening':
         this.updateLocalUserData({ listening: 1 });
         break;
       case 'writing':
         this.updateLocalUserData({ writing: 1 });
         break;
     }
  }






  /** 🔹 Obtém o XP necessário para o próximo nível */
  getExpNeededForNextLevel(): number {
    const userData = this.getUserData();
    if (!userData || !userData.Level) return 10000; // Valor base se não houver dados

    const level = userData.Level;
    const xpBase = 10000; // XP necessário para o primeiro nível
    const growthRate = 1.05; // Aumento de 1,05 a cada nível

    return Math.floor(xpBase * Math.pow(growthRate, level - 1));
  }




  /** 🔹 Atualiza a porcentagem de XP da barra de progresso */
  getExpPercentage(): number {
    const userData = this.getUserData();
    if (!userData || !userData.LingoEXP) return 0;

    const expNeeded = this.getExpNeededForNextLevel();
    return Math.min((userData.LingoEXP / expNeeded) * 100, 100);
  }

  /** 🔹 Reseta o XP do usuário */
  resetLingoEXP(): void {
    this.updateLocalUserData({ LingoEXP: -this.getUserData().LingoEXP });
  }

  /** 🔹 Verifica se o usuário subiu de nível*/

  checkLevelUp(newExp: number): void {
    this.updateLocalUserData({ LingoEXP: newExp });


    let userData = this.getUserData();
    let expNeeded = this.getExpNeededForNextLevel();

    while (userData.LingoEXP >= expNeeded) {
      const excessExp = userData.LingoEXP - expNeeded; // Calcula o XP extra que sobra após upar

      this.updateLocalUserData({ Level: 1 }); // Sobe de nível
     // this.updateLocalUserData({ tokens: 25 });
      this.resetLingoEXP(); // Reseta o XP

      if (excessExp > 0) {
        this.updateLocalUserData({ LingoEXP: excessExp }); // Adiciona o XP excedente
      }

      //this.levelUpEvent.next();
      this.modalService.toggleLevelUpModal();

      this.playSound.playLevelUp();

      // Atualiza os dados para a próxima iteração do loop
      userData = this.getUserData();
      expNeeded = this.getExpNeededForNextLevel();
    }
  }



/**

  decreseToken(tokensToSubtract: number): void {
    let userData = this.getUserData();

    // Se o usuário tiver tokens suficientes
    if (userData.tokens >= tokensToSubtract) {
      // Subtrai os tokens
      this.decreaseLocalUserData({ tokens: tokensToSubtract });

      // Verifica se os tokens atingiram 0 após a subtração
      this.checkTokens(); // Chama para verificar se há ações a serem tomadas, como bloqueio

    } else {
      // Caso o usuário não tenha tokens suficientes
      this.playSound.playTokenZero();
      console.log('Tokens insuficientes!');
    }
  }

  getUserTokens(){
    let userData = this.getUserData();
    return userData.tokens;
  }







  checkTokens(): void {
    let userData = this.getUserData();

    // Verifica se o número de tokens chegou a 0 e emite um evento
    if (userData.tokens <= 0) {
      // Chama o evento quando os tokens atingem 0
      this.tokenEvent.next();
      this.playSound.playTokenZero(); // Exemplo de som quando os tokens chegam a zero (caso tenha um som específico)
    }

    // Outras verificações podem ser adicionadas, como quando os tokens atingem determinados marcos
    if (userData.tokens > 1000) {
      // Realiza alguma ação quando os tokens são acima de 1000, por exemplo
      this.tokenEvent.next();
    }
  }

  getToken(): string | null {
  return localStorage.getItem(this.tokenKey);
  }



  isTokenExpired(token: string): boolean {
  try {
  const decoded: any = jwtDecode(token);
  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.exp < currentTime;
  } catch (error) {
  return true;
  }
  }
**/









  setToken(token: string, refreshToken: string): void {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.refreshTokenKey, refreshToken);
    this.saveUserData(token); // Chamando a função corrigida
  }


  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey);
  }

  clearTokens(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    localStorage.removeItem(this.userKey);
    this.userSubject.next(null); // Emite null para o BehaviorSubject
  }



  refreshToken(): Observable<any> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) return throwError(() => new Error('Nenhum refresh token disponível'));

    return this.http.post(`${this.apiUrl}/refresh`, {}, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${refreshToken}`
      })
    }).pipe(
      tap((response: any) => {
        if (response.access_token) {
          localStorage.setItem(this.tokenKey, response.access_token);
          this.saveUserData(response.access_token);
        }
      }),
      catchError(error => {
        this.clearTokens();
        return throwError(() => error);
      })
    );
  }




  showGemasWarning() {
    this.modalService.toggleGemasWarningModal();
  }


}
