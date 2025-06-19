// src/app/services/missao-timer.service.ts
import { Injectable } from '@angular/core';
import {AuthService} from "./auth.service";
import {Subscription, interval, BehaviorSubject} from "rxjs";

@Injectable({ providedIn: 'root' })
export class TimersService {
  private storageKey = 'missoesDiarias';
  private timerSubscription?: Subscription;
  private checkInterval = 5000; // Verifica a cada 30 segundos (ajuste conforme necessário)

  // Subject para emitir mudanças nas missões
  private missionsUpdated = new BehaviorSubject<boolean>(false);

  // Observable público para componentes se inscreverem
  public missionsUpdated$ = this.missionsUpdated.asObservable();



  private defaultData = {
    writing: 'false',
    reading: 'false',
    listening: 'false',
    speaking: 'false',
    claimed_reward_today: 'false',
    tomorrow_missions_liberation: '',
    strikes: 0,
    reward: 20
  };

  constructor(private authService: AuthService) {
    //this.updateReward(20)
    //this.resetStrikes();
    this.initData();
    this.startPeriodicCheck(); // Inicia a verificação automática
  }

  initData(): void {
    const saved = localStorage.getItem(this.storageKey);
    if (!saved) {
      console.log("missions start")
      const nextReset = this.getTomorrowAtNoon();
      const data = { ...this.defaultData, tomorrow_missions_liberation: nextReset };
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } else {
      console.log(localStorage.getItem(this.storageKey));
      // Verifica se os novos campos existem, se não, adiciona com valores padrão
      const existingData = JSON.parse(saved);
      if (existingData.strikes === undefined) {
        existingData.strikes = 0;
      }
      if (existingData.reward === undefined) {
        existingData.reward = 20;
      }
      localStorage.setItem(this.storageKey, JSON.stringify(existingData));
      this.resetMissionsIfExpired();
    }
  }

  // Método para iniciar verificação periódica
  startPeriodicCheck(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }

    this.timerSubscription = interval(this.checkInterval).subscribe(() => {
      console.log('Verificação automática de reset das missões...');
      this.resetMissionsIfExpired();
      this.stopPeriodicCheck();
    });
  }
  stopPeriodicCheck(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
      this.timerSubscription = undefined;
    }
  }








  // Método para converter data brasileira para Date
  private parseBrazilianDate(dateString: string): Date {
    // Verifica se está no formato brasileiro DD/MM/YYYY HH:mm:ss
    const brazilianFormat = /^(\d{2})\/(\d{2})\/(\d{4})\s(\d{2}):(\d{2}):(\d{2})$/;
    const match = dateString.match(brazilianFormat);

    if (match) {
      const [, day, month, year, hour, minute, second] = match;
      // Cria a data no formato correto (ano, mês-1, dia, hora, minuto, segundo)
      return new Date(parseInt(year), parseInt(month) - 1, parseInt(day),
        parseInt(hour), parseInt(minute), parseInt(second));
    }

    // Se não estiver no formato brasileiro, tenta parse normal
    return new Date(dateString);
  }



// Método auxiliar melhorado para gerar data de amanhã ao meio-dia
  private getTomorrowAtNoon(): string {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(12, 0, 0, 0);

    // Retorna no formato ISO para melhor compatibilidade
    return tomorrow.toISOString();
  }

  getMissionsData(): any {
    const data = localStorage.getItem(this.storageKey);
    const parsedData = data ? JSON.parse(data) : { ...this.defaultData };

    // Garante que os novos campos existam
    if (parsedData.strikes === undefined) {
      parsedData.strikes = 0;
    }
    if (parsedData.reward === undefined) {
      parsedData.reward = 20;
    }

    return parsedData;
  }

  updateMission(missao: string): void {
    const data = this.getMissionsData();
    data[missao] = 'true';

    if (this.allMissionsComplete(data)) {
      data.claimed_reward_today = 'true';
      data.tomorrow_missions_liberation = this.getTomorrowAtNoon();
    }

    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  private allMissionsComplete(data: any): boolean {
    return data.writing === 'true' && data.reading === 'true' &&
      data.listening === 'true' && data.speaking === 'true';
  }

// Método corrigido para resetar missões expiradas
  resetMissionsIfExpired(): void {
    const data = this.getMissionsData();
    const now = new Date();

    // Usa o parser brasileiro
    let resetTime: Date;
    try {
      resetTime = this.parseBrazilianDate(data.tomorrow_missions_liberation);

      // Verifica se a data é válida
      if (isNaN(resetTime.getTime())) {
        console.warn('Data de reset inválida, forçando reset das missões');
        this.resetAllMissionsForTesting();
        return;
      }
    } catch (error) {
      console.warn('Erro ao processar data de reset, forçando reset das missões');
      this.resetAllMissionsForTesting();
      return;
    }

    console.log(`Verificando reset: Agora=${now.toLocaleString('pt-BR')}, Reset programado=${resetTime.toLocaleString('pt-BR')}`);
    console.log(`Comparação: ${now.getTime()} > ${resetTime.getTime()} = ${now > resetTime}`);

    if (now > resetTime) {
      console.log('Tempo de reset atingido, resetando missões...');
      this.resetAllMissionsForTesting();
    } else {
      console.log('Reset ainda não necessário');
    }
  }






  getClaimedRewardStatus(): boolean {
    const data = this.getMissionsData();
    return data.claimed_reward_today === 'true';
  }

  claimReward(): void {

    const data = this.getMissionsData();
    data.claimed_reward_today = 'true';
    this.updateMissionsData(data);

    // Adiciona gemas baseado no valor reward atual
    this.authService.updateLocalUserData({ gemas: data.reward });



  }


  private updateMissionsData(data: any): void {
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }



  isRewardClaimed(): boolean {
    const data = this.getMissionsData();
    return data.claimed_reward_today === 'true';
  }

  isMissionComplete(missao: string): boolean {
    const data = this.getMissionsData();
    return data[missao] === 'true';
  }



  resetAllMissionsForTesting() {


    const currentData = this.getMissionsData();


    // Verifica se todas as missões foram completadas antes do reset
    const allCompleted = this.allMissionsComplete(currentData);


    if(allCompleted){
      this.incrementStrikes();
      this.updateReward(this.getStrikes() + 20);
    }else{
      this.resetStrikes();
      this.updateReward(20);
    }

    const data = {
      writing: 'false',
      reading: 'false',
      listening: 'false',
      speaking: 'false',
      claimed_reward_today: 'false',
      tomorrow_missions_liberation: this.getTomorrowAtNoon(),
      strikes: this.getStrikes(), // Incrementa strikes se completou, reseta se não
      reward: this.getReward(),
    };

    localStorage.setItem(this.storageKey, JSON.stringify(data));

    // Emite evento de atualização
    this.missionsUpdated.next(true);
    console.log('Missões resetadas e DOM será atualizado');
    console.log(`Strikes atualizados para: ${data.strikes}`);
  }





// Método de teste melhorado para aceitar formato brasileiro
  setTomorrowMissionLiberationForTesting(customDateTime: string): void {
    // Testa se a data pode ser interpretada
    const testDate = this.parseBrazilianDate(customDateTime);
    if (isNaN(testDate.getTime())) {
      console.error('Data inválida fornecida:', customDateTime);
      return;
    }

    const data = this.getMissionsData();
    data.tomorrow_missions_liberation = customDateTime;
    localStorage.setItem(this.storageKey, JSON.stringify(data));
    console.log(`tomorrow_missions_liberation alterado para: ${customDateTime}`);
    console.log(`Data interpretada como: ${testDate.toLocaleString('pt-BR')}`);
  }


  getNextResetTime(){
    const data = this.getMissionsData();
    const resetTime = this.parseBrazilianDate(data.tomorrow_missions_liberation);
    return resetTime.toLocaleString('pt-BR');
  }










  // ===== NOVOS MÉTODOS PARA STRIKES E REWARD =====

  /**
   * Obtém o valor atual de strikes
   */
  getStrikes(): number {
    const data = this.getMissionsData();
    return data.strikes || 0;
  }

  /**
   * Obtém o valor atual de reward
   */
  getReward(): number {
    const data = this.getMissionsData();
    return data.reward || 20;
  }

  /**
   * Atualiza o valor de strikes
   * @param newStrikes - Novo valor de strikes
   */
  updateStrikes(newStrikes: number): void {
    if (newStrikes < 0) {
      console.warn('Strikes não pode ser menor que 0');
      return;
    }

    const data = this.getMissionsData();
    data.strikes = newStrikes;
    this.updateMissionsData(data);

    // Emite evento de atualização
    this.missionsUpdated.next(true);
    console.log(`Strikes atualizado para: ${newStrikes}`);
  }

  /**
   * Atualiza o valor de reward
   * @param newReward - Novo valor de reward
   */
  updateReward(newReward: number): void {
    if (newReward < 0) {
      console.warn('Reward não pode ser menor que 0');
      return;
    }

    const data = this.getMissionsData();
    data.reward = newReward;
    this.updateMissionsData(data);

    // Emite evento de atualização
    this.missionsUpdated.next(true);
    console.log(`Reward atualizado para: ${newReward}`);
  }

  /**
   * Incrementa strikes em 1
   */
  incrementStrikes(): void {
    const currentStrikes = this.getStrikes();
    this.updateStrikes(currentStrikes + 1);
  }

  /**
   * Decrementa strikes em 1 (não permite valores negativos)
   */
  decrementStrikes(): void {
    const currentStrikes = this.getStrikes();
    if (currentStrikes > 0) {
      this.updateStrikes(currentStrikes - 1);
    }
  }



  /**
   * Reseta strikes para 0
   */
  resetStrikes(): void {
    this.updateStrikes(0);
  }

  /**
   * Calcula e atualiza reward baseado em strikes (exemplo de lógica)
   * Você pode personalizar esta lógica conforme sua necessidade
   */
  calculateRewardByStrikes(): void {
    const strikes = this.getStrikes();
    let newReward = 20; // Base reward

    // Exemplo: cada strike adiciona 5 gemas de bônus
    newReward += strikes;

    this.updateReward(newReward);

    console.log(`Reward atualizado para: ${newReward}`);
  }




}
