import {
  AfterViewInit,
  ChangeDetectorRef,
  Component, ElementRef,
  HostListener, OnDestroy,
  OnInit,
  QueryList, ViewChild,
  ViewChildren
} from '@angular/core';
import {PlaySoundService} from "../../services/play-sound.service";
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {Subscription} from "rxjs";
import {TimersService} from "../../services/timers.service";
import {EldersRoomGuardiamService} from "../../services/elders-room-guardiam.service";
import {animate, transition, trigger} from "@angular/animations";
import {ModalService} from "../../services/modal.service";
import {VideoControllerService} from "../../services/video-controller.service";
import {VideoService} from "../../services/video.service";
import {RewardService} from "../../services/reward.service";







@Component({
  selector: 'app-babel-tower',
  templateUrl: './babel-tower.component.html',
  styleUrls: ['./babel-tower.component.css'],
  animations: [
    trigger('iconTransition', [
      transition('* => *', [
        animate('300ms ease')
      ])
    ])
  ]
})
export class BabelTowerComponent  implements OnInit, AfterViewInit{
  loading: boolean = false;
  @ViewChild('videoPlayer', {static: false}) videoPlayer!: ElementRef<HTMLVideoElement>;

  isDownArrowDisabled: boolean = false;
  isUpArrowDisabled: boolean = false;
  currentElderImage: string = "";
  andarAtual: number = 0;
  planoUsuario: string = '';

  ngAfterViewInit() {
    setTimeout(() => this.loading = true);
    this.videoController.setup(this.videoPlayer);

    // Só pede o vídeo para o service
    this.videoService.getVideoForPlayer('mainVideo-compress.mp4').then((src) => {
      if (src) {
        this.videoPlayer.nativeElement.src = src;
        this.videoPlayer.nativeElement.load();
        this.loadVideoByAndar();
      }
    });

    this.videoPlayer.nativeElement.addEventListener('playing', () => {
      setTimeout(() => this.loading = false);
    });
  }


  loadVideoByAndar() {


    const andarNoConjunto = (this.andarAtual - 1) % 4;

    switch (andarNoConjunto) {
      case 0:
        // WRITING

        this.videoController.setLoop("0:00", "00:12");

        break;
      case 1:
        // READING
        this.videoController.setLoop("00:13", "00:24");
        break;
      case 2:
        // LISTENING
        this.videoController.setLoop("00:26", "00:39");
        break;
      case 3:
        // SPEAKING
        this.videoController.setLoop("00:40", "00:52");
        break;
    }
  }

  ngOnInit() {
    // this.auth.syncData();
    this.auth.showUserData();

    if (!localStorage.getItem("andarAtual")) {localStorage.setItem("andarAtual", "1");}
    this.andarAtual = parseInt(localStorage.getItem("andarAtual") || "1", 10);
    this.renderizar();
  }

  constructor(private playSound: PlaySoundService,
              private router: Router,
              protected auth: AuthService,
              private cdr: ChangeDetectorRef,
              protected timersService: TimersService,
              private eldersRoomGuardiamService:  EldersRoomGuardiamService,
              protected modalService: ModalService,
              private videoController: VideoControllerService,
              private videoService: VideoService,
              private rewardService: RewardService) {

    const result = this.rewardService.compareCurrentAndNextRewards('free', 'medium', 4);

    console.log(result);


    window.scrollTo(0, 0);
    // this.playSound.playTowerSoundTrack()
    this.playSound.playMainTheme(true, "15%");
    //
    this.planoUsuario = this.auth.getPlano();

    /**      for (let index = 0; index < 10; index++) {
     this.auth.removeBatteryEnergy();
     }
     this.auth.addXpSkills('writing');
     this.auth.checkLevelUp(800) **/


    //  this.auth.addRandomItemToUser();


  }


  subirAndar(){
    this.andarAtual++;
    localStorage.setItem("andarAtual", this.andarAtual.toString());
  }
  descerAndar(){
    this.andarAtual--;
    localStorage.setItem("andarAtual", this.andarAtual.toString());
  }

  renderizar(){
    this.cdr.detectChanges();
    // Update arrow disabled states
    this.isDownArrowDisabled = this.andarAtual === 1; // Disable down arrow if on floor 1 (Writing)
    this.isUpArrowDisabled = this.getTextoPorAndar().toLowerCase() === 'speaking'; // Disable up arrow if on Speaking floor
  }


  getTextoPorAndar(): string {
    // Calcula a posição do andar dentro do conjunto de 4
    const andarNoConjunto = (this.andarAtual - 1) % 4;  // Faz a divisão inteira para achar o resto

    switch (andarNoConjunto) {
      case 0:
        this.currentElderImage = "assets/lingobot/skills/writing.webp";
        return "Writing";  // Andar 1, 5, 9, 13, ...
      case 1:
        this.currentElderImage = "assets/lingobot/skills/reading.webp";
        return "Reading";  // Andar 2, 6, 10, 14, ...
      case 2:
        this.currentElderImage = "assets/lingobot/skills/listening.webp";
        return "Listening";  // Andar 3, 7, 11, 15, ...
      case 3:
        this.currentElderImage = "assets/lingobot/skills/speaking.webp";
        return "Speaking";  // Andar 4, 8, 12, 16, ...
      default:
        return "";  // Caso não encontre
    }
  }



  loadComponent: boolean = false;

  changeLoadComponentToFalse(){
    this.loadComponent = !this.loadComponent;
  }

  async command(cmd: string) {
    this.playSound.playCleanSound();

    if (cmd === 'up') {
      if (this.isUpArrowDisabled) { // Check if up arrow is disabled
        return; // Do nothing if disabled
      }
      if (this.getTextoPorAndar().toLowerCase() !== "speaking") {
        this.subirAndar()
        this.loadVideoByAndar();
      }
    } else if (cmd === 'in') {
      this.loadComponent = true;
      this.modalService.toggleSelectQuestModal();
    } else if (cmd === 'down') {
      if (this.isDownArrowDisabled) { // Check if down arrow is disabled
        return; // Do nothing if disabled
      }
      if (this.andarAtual > 1) {
        this.descerAndar();
        this.loadVideoByAndar();
      }
    }
    this.renderizar(); // Call renderizar to update arrow states after command
  }
  goToTower() {
    this.playSound.playCleanSound2();
    this.router.navigate(['/tower']);
  }


  openModal(icon: any){
    switch (icon) {

      case 'assets/lingobot/menu-icons/compass.webp':
        this.playSound.playHologram();
        this.modalService.toggleDailyModal();
        break;
      case 'assets/lingobot/menu-icons/holograma-icon.webp':
        this.playSound.playHologram();
        this.modalService.toggleUserInfosModal();
        break;
      case 'assets/lingobot/menu-icons/icone-home.webp':
        this.goToTower();
        break;
      case 'assets/lingobot/menu-icons/bag-icon.webp':
        this.playSound.playHologram();
        this.modalService.toggleItemsModal();
        break;
      case 'assets/lingobot/menu-icons/gear_icon.webp':
        this.playSound.playHologram();
        this.modalService.toggleSettingsModal();
        break;
    }
  }





  menuItems = [
    { icon: 'assets/lingobot/menu-icons/icone-home.webp' },
    { icon: 'assets/lingobot/menu-icons/bag-icon.webp' },
    { icon: 'assets/lingobot/menu-icons/compass.webp' },
    { icon: 'assets/lingobot/menu-icons/holograma-icon.webp' },
    { icon: 'assets/lingobot/menu-icons/gear_icon.webp' },
  ];

  selectedIndex = 2;

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

    if (Math.abs(swipeDistance) < 30) return; // Ignora toques muito curtos

    if (swipeDistance > 0) {
      // Swipe para a esquerda
      this.swipeLeft();
      this.playSound.playPop();
    } else {
      // Swipe para a direita
      this.swipeRight();
      this.playSound.playPop();
    }
  }

  swipeLeft() {
    if (this.selectedIndex < this.menuItems.length - 1) {
      this.selectedIndex++;
    }
  }

  swipeRight() {
    if (this.selectedIndex > 0) {
      this.selectedIndex--;
    }
  }

  getItemStyle(index: number) {
    const offset = index - this.selectedIndex;

    const scale = offset === 0 ? 1.5 : 1 - Math.abs(offset) * 0.2;
    const translateX = offset * 80;
    const rotateY = offset * -35;
    const opacity = Math.abs(offset) > 2 ? 0 : 1;
    const zIndex = 10 - Math.abs(offset);

    const blur = Math.abs(offset) === 2 ? '2px' : '0';

    return {
      transform: `
      perspective(1000px)
      translateX(${translateX}px)
      scale(${scale})
      rotateY(${rotateY}deg)
    `,
      opacity,
      zIndex,
      filter: `blur(${blur})`,
      transition: 'transform 0.4s ease, opacity 0.4s ease, filter 0.4s ease'
    };
  }



}
