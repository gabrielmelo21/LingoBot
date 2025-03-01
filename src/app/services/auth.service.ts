import {Injectable} from '@angular/core';
import {jwtDecode} from "jwt-decode";
import {BehaviorSubject, catchError, Observable, Subject, tap, throwError} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {PlaySoundService} from "./play-sound.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'token';
  private refreshTokenKey = 'refreshToken';
  private userKey = 'userData';
  private apiUrl = 'https://lingobot-api.onrender.com/'; // Ajuste para o URL real do seu backend
  private userSubject = new BehaviorSubject<any>(this.getUserData()); // Inicializa com os dados do localStorage
  user$ = this.userSubject.asObservable(); // Observable para observar as mudanças no usuário
  levelUpEvent = new Subject<void>();
  tokenEvent = new Subject<void>();



  private readonly refreshInterval = 60 * 400 ; //              60   60 * 1000 = 1 minuto
  private readonly localStorageKeys = {
    user: 'userData',
    backup: 'backupUserKey',
    lastRefresh: 'lastRefreshTime'
  };


  constructor(private http: HttpClient, private playSound: PlaySoundService) {

      this.startAutoRefresh();


    //console.log("User data atual é ", JSON.stringify(this.getUserData()))
  }

  private setBackupData(data: any): void {
    localStorage.setItem(this.localStorageKeys.backup, JSON.stringify(data));
    localStorage.setItem(this.localStorageKeys.lastRefresh, Date.now().toString());
  }

  private hasUserDataChanged(): boolean {
    const currentData = this.getUserData();
    const backupData = localStorage.getItem(this.localStorageKeys.backup);

    return !backupData || JSON.stringify(currentData) !== backupData;
  }

  regenerateJWT(): void {
    const token = localStorage.getItem('token');
    if (!token) return;
    if (!this.hasUserDataChanged()) return; // Só regenera se houver mudanças

   console.log("Data sended...");
    const body = this.getUserData();
   // console.log("Dados atuais do usuário ->", JSON.stringify(body));

    this.http.post(`${this.apiUrl}/generate-new-jwt`, body, {
      headers: { 'Content-Type': 'application/json' }
    }).subscribe({
      next: (response: any) => {
        if (response.access_token) {
          localStorage.setItem("access_token", response.access_token);
          this.setBackupData(this.getUserData()); // Atualiza o backup
          //console.log("Novo JWT salvo:", response.access_token);
        } else {
          console.error("Resposta do servidor não contém access_token:", response);
        }
      },
      error: (error) => console.error("Erro ao gerar novo JWT:", error)
    });
  }

  private startAutoRefresh(): void {
    setInterval(() => this.regenerateJWT(), this.refreshInterval);
  }



























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

    // Aplica as mudanças ao JSON do usuário, somando os valores numéricos
    const updatedUser = {
      ...userData,
      ...Object.keys(changes).reduce((acc, key) => {
        acc[key] =
          typeof changes[key] === "number" && typeof userData[key] === "number"
            ? userData[key] + changes[key] // Soma os valores numéricos
            : changes[key]; // Substitui os demais valores normalmente
        return acc;
      }, {} as any),
    };

    // Salva no localStorage
    localStorage.setItem(this.userKey, JSON.stringify(updatedUser));
    this.userSubject.next(updatedUser); // Atualiza o BehaviorSubject
   // console.log("userKey foi atualizado -> " + localStorage.getItem(this.userKey));
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

    console.log("MetasDiarias atualizadas ->", updatedMetas);
  }







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
    this.updateLocalUserData({ ranking: newExp });


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

      this.levelUpEvent.next();
      this.playSound.playLevelUp();

      // Atualiza os dados para a próxima iteração do loop
      userData = this.getUserData();
      expNeeded = this.getExpNeededForNextLevel();
    }
  }





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








  setToken(token: string, refreshToken: string): void {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.refreshTokenKey, refreshToken);
    this.saveUserData(token); // Chamando a função corrigida
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
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

  isTokenExpired(token: string): boolean {
    try {
      const decoded: any = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp < currentTime;
    } catch (error) {
      return true;
    }
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

}
