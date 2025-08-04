import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {TimersService} from "../../services/timers.service";
import {PlaySoundService} from "../../services/play-sound.service";
import {Subscription} from "rxjs";
import {ModalService} from "../../services/modal.service";

@Component({
  selector: 'app-daily-mission',
  templateUrl: './daily-mission.component.html',
  styleUrls: ['./daily-mission.component.css']
})
export class DailyMissionComponent implements OnInit, OnDestroy {
  modal: boolean = false;
  private sub!: Subscription;

  constructor(protected timersService : TimersService,
              private playSound: PlaySoundService,
              private modalService: ModalService) {
  }



  missoesDiarias: { nome: string; completo: boolean }[] = [];
  private missionsSubscription?: Subscription;

  recompensaReivindicada = this.timersService.isRewardClaimed();





  isClosing: boolean = false;
  animandoSaida = false;
  animandoEntrada = false;

  openQuestModal() {
    if (this.modal) {
      this.animandoSaida = true;
      this.isClosing = true;
      this.playSound.playHologram();
    } else {
      this.animandoEntrada = true;
      this.isClosing = false;
      this.modalService.toggleDailyModal();
    }
  }

  onAnimationEnd(event: AnimationEvent) {
    const { animationName } = event;

    if (animationName === 'entrarDaEsquerda') {
      this.animandoEntrada = false;
    }

    if (animationName === 'sairParaEsquerda') {
      this.animandoSaida = false;
      this.modalService.toggleDailyModal();
      this.isClosing = false;
    }
  }





  ngOnInit() {

    this.sub = this.modalService.showDailyModal$.subscribe(show => {
      this.modal = show;
    });


    // Se inscreve para mudanças automáticas
    this.missionsSubscription = this.timersService.missionsUpdated$.subscribe(
      (updated) => {
        if (updated) {
          console.log('Atualizando display das missões...');
          this.updateMissionsDisplay();
        }
      }
    );


    this.atualizarMissoes();
    // this.recompensaReivindicada = this.timersService.isRewardClaimed();
    // this.timersService.setTomorrowMissionLiberationForTesting('10/06/2025 14:48:00');
    console.log("recompensa revindicada: ", this.recompensaReivindicada)

  }
  ngOnDestroy() {
    if (this.sub){
      this.sub.unsubscribe();
    }
    if (this.missionsSubscription) {
      this.missionsSubscription.unsubscribe();
    }
  }










  getIconeMissao(nome: string): string {
    return `assets/lingobot/skills/${nome.toLowerCase()}.png`;
  }

  // Métodos de teste
  marcarComoFeita(missao: string) {
    this.timersService.updateMission(missao.toLowerCase());
    this.atualizarMissoes();
  }



  // Método para atualizar todas as variáveis do display
  private updateMissionsDisplay(): void {
    // Atualiza recompensaReivindicada
    this.recompensaReivindicada = this.timersService.isRewardClaimed();

    // Atualiza status das missões individuais (se você tiver essa variável)
    if (this.missoesDiarias) {
      this.missoesDiarias = this.missoesDiarias.map(missao => ({
        ...missao,
        completo: this.timersService.isMissionComplete(missao.nome)
      }));
    }
    //  console.log('Display atualizado - recompensaReivindicada:', this.recompensaReivindicada);
  }




  atualizarMissoes() {
    const data = this.timersService.getMissionsData();
    this.missoesDiarias = [
      { nome: 'Writing', completo: data.writing === 'true' },
      { nome: 'Reading', completo: data.reading === 'true' },
      { nome: 'Listening', completo: data.listening === 'true' },
      { nome: 'Speaking', completo: data.speaking === 'true' }
    ];
    // this.recompensaReivindicada = data.claimed_reward_today === 'true';
  }

  todasFeitas(): boolean {
    return this.missoesDiarias.every(m => m.completo);
  }


  resetarMissoes() {
    this.timersService.resetAllMissionsForTesting();
    this.atualizarMissoes();
  }

  checkQuest(){
    this.playSound.playCleanSound2();
    this.modal = !this.modal;

  }

  get todasMissoesCompletas(): boolean {
    return this.missoesDiarias.every(missao => missao.completo);
  }

  claimReward(): void {
    this.playSound.playWin2()
    this.timersService. claimReward();

    this.recompensaReivindicada = this.timersService.getClaimedRewardStatus();

    console.log('Recompensa coletada!');
    // Aqui você pode desativar o modal, adicionar recompensa ao jogador etc.
    //this.checkMissoesModal = false;
  }



}
