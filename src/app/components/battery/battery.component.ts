import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {PlaySoundService} from "../../services/play-sound.service";

@Component({
  selector: 'app-battery',
  templateUrl: './battery.component.html',
  styleUrls: ['./battery.component.css']
})
export class BatteryComponent implements OnInit{

  modal: boolean = false;
  isClosing: boolean = false;
  animandoSaida = false;
  animandoEntrada = false;
  isBouncing = false;




  rechargeValue: number = 0;
  currentBattery: number = 0;
  batteryArray = Array(10).fill(0);
  energyImagePath: string = '';
  rechargeModal: boolean = false ;






  constructor(
              private authService: AuthService,
              private playSoundService: PlaySoundService,
              private cdr: ChangeDetectorRef
             ) {

  }

 ngOnInit() {
   this.loadBattery();
   this.authService.user$.subscribe(userData => {
     if (!userData) return;
     this.currentBattery = userData.battery;
     this.setEnergyImage();
     
     // Monitora se a bateria atingiu 0 e ativa o modal automaticamente
     if (this.currentBattery === 0 && !this.modal) {
       this.rechangeBatteryModal();
     }
   });
 }

  renderizar(){
    this.cdr.detectChanges();
  }


  rechargeBattery() {
    this.rechargeModal = !this.rechargeModal;
    this.loadBattery()

  }
  setEnergyImage() {
    this.energyImagePath = this.currentBattery > 0
      ? 'assets/lingobot/menu-icons/lingobot-energy-on.png'
      : 'assets/lingobot/menu-icons/lingobot-energy-off.png';
  }


  loadBattery() {
    const diff = 10 - this.currentBattery;
    this.rechargeValue = diff > 0 ? diff : 0;
    this.setEnergyImage();
    this.renderizar();
  }


  addBattery() {
    if (this.currentBattery >= 10) return;

    this.playSoundService.playCleanSound2();
    this.authService.addBatteryEnergy(1);
    this.loadBattery();
  }

  rechargeAll() {
    if (this.currentBattery >= 10) return;


    this.playSoundService.playCleanSound2();
    this.authService.decreaseLocalUserData({ gemas: this.rechargeValue });
    this.loadBattery();
  }


  removeBattery() {
    if (this.currentBattery >= 10 || this.currentBattery<=0) return;

    this.playSoundService.playCleanSound2();
    this.authService.removeBatteryEnergy();
    this.loadBattery();
    this.renderizar()
  }


  onBounceClick() {
    if (!this.isBouncing && this.currentBattery < 10) {
      this.isBouncing = true;
      this.addBattery();
    }
  }


  rechangeBatteryModal() {
    this.playSoundService.playHologram();
    if (this.modal) {
      this.animandoSaida = true;
      this.isClosing = true;
    } else {
      this.modal = true;
      this.animandoEntrada = true;
      this.isClosing = false;
    }
  }
  onAnimationEnd(event: AnimationEvent) {
    const { animationName } = event;

    if (animationName === 'entrarDaEsquerda') {
      this.animandoEntrada = false;
    }

    if (animationName === 'sairParaEsquerda') {
      this.animandoSaida = false;
      this.isClosing = false;
      this.modal = false;
    }
  }

  getBatteryClass(): string {
    if (this.currentBattery >= 0 && this.currentBattery <= 3) {
      return 'battery-low';
    } else if (this.currentBattery >= 4 && this.currentBattery <= 7) {
      return 'battery-medium';
    } else if (this.currentBattery >= 8 && this.currentBattery <= 10) {
      return 'battery-high';
    }
    return 'battery-low'; // padrão
  }

}
