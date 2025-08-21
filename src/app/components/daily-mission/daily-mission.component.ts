import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {TimersService} from "../../services/timers.service";
import {PlaySoundService} from "../../services/play-sound.service";
import {Subscription} from "rxjs";
import {DailyMissionData} from "../../services/auth.service";
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

  showRewardAlert: boolean = false;
  currentRewardAmount: number = 0;
  rewardAlertClass: string = '';



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

    // Call atualizarMissoes to populate missoesDiarias on init
    this.atualizarMissoes();

    // Subscribe to missions$ to update missoesDiarias when data changes
    this.missionsSubscription = this.timersService.missions$.subscribe(
      (updatedData: DailyMissionData) => { // Use DailyMissionData for type safety
        console.log('Missions data updated:', updatedData);
        this.atualizarMissoes(); // Re-populate missoesDiarias with new data
      }
    );
  }
  ngOnDestroy() {
    if (this.sub){
      this.sub.unsubscribe();
    }
    if (this.missionsSubscription) {
      this.missionsSubscription.unsubscribe();
    }
  }

  getChestImage(missao: { nome: string; completo: boolean }): string {
    const dailyData = this.timersService.getMissionsData();
    let chestOpenStatus = false;

    // Map mission name to chestWasOpenX property
    switch (missao.nome.toLowerCase()) {
      case 'writing':
        chestOpenStatus = dailyData.chestWasOpen1;
        break;
      case 'reading':
        chestOpenStatus = dailyData.chestWasOpen2;
        break;
      case 'listening':
        chestOpenStatus = dailyData.chestWasOpen3;
        break;
      case 'speaking':
        chestOpenStatus = dailyData.chestWasOpen4;
        break;
    }

    if (chestOpenStatus) {
      return 'assets/lingobot/itens/chest-open.png';
    } else {
      return 'assets/lingobot/itens/chest-closed.png';
    }
  }

  isChestOpen(missao: { nome: string; completo: boolean }): boolean {
    const dailyData = this.timersService.getMissionsData();
    let chestOpenStatus = false;

    switch (missao.nome.toLowerCase()) {
      case 'writing':
        chestOpenStatus = dailyData.chestWasOpen1;
        break;
      case 'reading':
        chestOpenStatus = dailyData.chestWasOpen2;
        break;
      case 'listening':
        chestOpenStatus = dailyData.chestWasOpen3;
        break;
      case 'speaking':
        chestOpenStatus = dailyData.chestWasOpen4;
        break;
    }
    return chestOpenStatus;
  }


  getIconeMissao(nome: string): string {
    return `assets/lingobot/skills/${nome.toLowerCase()}.png`;
  }

  atualizarMissoes() {
    const data = this.timersService.getMissionsData();
    this.missoesDiarias = [
      { nome: 'Writing', completo: data.writing },
      { nome: 'Reading', completo: data.reading },
      { nome: 'Listening', completo: data.listening },
      { nome: 'Speaking', completo: data.speaking }
    ];
  }

  openChest(missao: { nome: string; completo: boolean }) {
    if (this.isChestOpen(missao)) { // Add this check
      console.log('Chest already open, cannot claim reward again.');
      return; // Exit the function if chest is already open
    }

    if (missao.completo) {
      const chestNumber = this.getChestNumber(missao.nome);
      if (chestNumber > 0) {
        this.timersService.markChestAsOpen(chestNumber);
        this.timersService.claimChestReward(); // Call to give gems and reset strikes
        this.playSound.playCoinDrop(); // Play sound for coin drop

        // Show reward alert with class-based animation
        const gemsToGive = this.timersService.giveUserGems(); // Get the amount of gems
        this.currentRewardAmount = gemsToGive;
        this.showRewardAlert = true; // Make element visible in DOM

        this.rewardAlertClass = 'show'; // Trigger show animation

        setTimeout(() => {
          this.rewardAlertClass = 'hide'; // Trigger hide animation
          setTimeout(() => {
            this.showRewardAlert = false; // Remove from DOM after hide animation
          }, 500); // Duration of fadeOutSlideUp animation
        }, 1500); // Duration of show animation + display time (e.g., 0.5s + 1s)

        // Assuming playSound has a method for chest opening
        // this.playSound.playChestOpen(); // Need to confirm this method exists
        this.timersService.checkAllChestsOpened();
        this.atualizarMissoes(); // Update display after opening chest
      }
    } else {
      console.log('Mission not complete, cannot open chest.');
      // Optionally, play a sound or show a message indicating mission is not complete
    }
  }

  private getChestNumber(missionName: string): number {
    switch (missionName.toLowerCase()) {
      case 'writing': return 1;
      case 'reading': return 2;
      case 'listening': return 3;
      case 'speaking': return 4;
      default: return 0; // Should not happen with valid mission names
    }
  }

















  selectedIndex = 0; // começa no primeiro baú

  private touchStartX = 0;
  private touchEndX = 0;

  onTouchStart(event: TouchEvent) {
    this.touchStartX = event.changedTouches[0].screenX;
  }

  onTouchEnd(event: TouchEvent) {
    this.touchEndX = event.changedTouches[0].screenX;
    this.handleSwipe();
  }

  handleSwipe() {
    const swipeDistance = this.touchStartX - this.touchEndX;

    if (Math.abs(swipeDistance) < 30) return; // Ignora toques curtos

    if (swipeDistance > 0) {
      this.swipeLeft();
    } else {
      this.swipeRight();
    }
  }

  swipeLeft() {
    if (this.selectedIndex < this.missoesDiarias.length - 1) {
      this.selectedIndex++;
    }
  }

  swipeRight() {
    if (this.selectedIndex > 0) {
      this.selectedIndex--;
    }
  }

  /**
   * Define estilo baseado no índice
   */
  getItemStyle(index: number) {
    const offset = index - this.selectedIndex;
    const baseScale = 1 - Math.abs(offset) * 0.2;
    const translateX = offset * 240; // espaçamento entre cards

    return {
      transform: `translateX(${translateX}px) scale(${baseScale})`,
      opacity: Math.abs(offset) > 2 ? 0 : 1,
      zIndex: 100 - Math.abs(offset),
    };
  }

}
