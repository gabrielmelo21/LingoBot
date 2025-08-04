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

  currentElderImage: string = "";
  userDifficulty: string = '';
  checkQuestModal: boolean = false;
  rechargeValue: number = 0;
  currentBattery: number = 0;
  batteryArray = Array(10).fill(0);
  energyImagePath: string = '';
  rechargeModal: boolean = false ;
  andarAtual: number = 0;
  choseActivityModal: boolean = false;
  selectedActivity: string | null = null;
  activities: { name: string; type: 'free' | 'premium' }[] = [];
  planoUsuario: string = '';

  constructor(private playSound: PlaySoundService,
              private router: Router,
              protected auth: AuthService,
              private cdr: ChangeDetectorRef,
              protected timersService: TimersService,
              private eldersRoomGuardiamService:  EldersRoomGuardiamService,
              protected modalService: ModalService) {
    window.scrollTo(0, 0);
  // this.playSound.playTowerSoundTrack()
  //  this.auth.addRandomItemToUser();
    this.planoUsuario = this.auth.getPlano();
  }


  selectActivity(activityName: string) {
    this.playSound.playCleanSound2();
    this.selectedActivity = activityName;
    console.log(this.selectedActivity);
  }
  confirmActivity() {
    //console.log('Atividade confirmada:', this.selectedActivity);

    switch (this.selectedActivity) {

      /** WRITING **/
      case 'Writing - Aumente seu vocabulário':
        this.enterActivity("writing");
        break;
      case 'Writing - Criação e correção textual':
        this.enterActivity("writing_premium1");
        break;

      /** READING **/
      case 'Reading - Descubra a senha do Báu!':
        this.enterActivity("reading");
        break;
      case 'Reading - Vocabulário em contexto':
        this.enterActivity("reading_premium1");
        break;

      /** LISTENING **/
      case 'Listening - Escute e forme frases e abra o portão!':
        this.enterActivity("listening");
        break;
      case 'Listening - Entrevistas':
        this.enterActivity("listening_premium1");
        break;

      /** SPEAKING ROOM **/
      case 'Speaking - Converse com o Speaking Elder':
           this.enterActivity("speaking");
      break;
      case 'Speaking - Epic Boss Battle':
        this.enterActivity("speaking_premium1");
        break;


    }

   this.ActivityModal();
  }
  enterActivity(redirectTo: string) {
      if (this.currentBattery > 0) {
        this.playEnterAnimation()
        setTimeout( () => {
          const destino = this.getTextoPorAndar().toLowerCase();
            this.removeBattery();
            this.eldersRoomGuardiamService.markAsPaid(destino);
            this.router.navigate([`/${redirectTo}`]); // espera navegação

        }, this.waitAnimationTime +100)
   } else {
     this.rechargeBattery();
      }
  }
  ActivityModal() {
    //this.choseActivityModal = !this.choseActivityModal;

    if (this.choseActivityModal) {
      const materia = this.getTextoPorAndar().toLowerCase();
    //  this.activities = this.getActivitiesBySubject(materia);

    }else{
      this.selectedActivity = '';
    }
  }
  getActivitiesBySubject(subject: string): { name: string; type: 'free' | 'premium' }[]  {
    switch (subject) {
      case 'writing':
        return [
          { name: 'Writing - Aumente seu vocabulário', type: 'free' },
          { name: 'Writing - Criação e correção textual', type: 'premium' },
        ];
      case 'reading':
        return [
          { name: 'Reading - Descubra a senha do Báu!', type: 'free' },
          { name: 'Reading - Vocabulário em contexto', type: 'premium' },
        ];
      case 'listening':
        return [
          { name: 'Listening - Escute e forme frases e abra o portão!', type: 'free' },
          { name: 'Listening - Entrevistas', type: 'premium' },
        ];
      case 'speaking':
        return [
          { name: 'Speaking - Converse com o Speaking Elder', type: 'free' },
          { name: 'Speaking - Epic Boss Battle', type: 'premium' },
        ];
      default:
        return [];
    }
  }
  canConfirmSelectedActivity(): boolean {
    if (!this.selectedActivity) return false;


    const atividade = this.activities.find(
      (a) => a.name === this.selectedActivity
    );

    if (!atividade) return false;

    return this.planoUsuario === 'premium' || atividade.type === 'free';
  }
  subirAndar(){
     this.andarAtual++;
     localStorage.setItem("andarAtual", this.andarAtual.toString());
  }
  descerAndar(){
     this.andarAtual--;
     localStorage.setItem("andarAtual", this.andarAtual.toString());
  }
  ngOnInit() {

    if (!localStorage.getItem("andarAtual")) {localStorage.setItem("andarAtual", "1");}
    this.andarAtual = parseInt(localStorage.getItem("andarAtual") || "1", 10);





    this.loadBattery();
    this.auth.user$.subscribe(userData => {
      if (!userData) return;
      this.userDifficulty = userData.difficulty;
      this.currentBattery = userData.battery;
      this.setEnergyImage()
    });




    this.loadVideoByAndar();




    if (localStorage.getItem("newFloorAnimation")  !== null && localStorage.getItem("newFloorAnimation") === "true") {
      localStorage.setItem("newFloorAnimation", "false");
      this.playCongratsScene();
      setTimeout(() => {
        this.loadVideoByAndar();
      }, 21900)
    }




  }
  renderizar(){
    this.cdr.detectChanges();
  }
  closeQuestModal() {
    this.checkQuestModal = !this.checkQuestModal;
    this.renderizar();
  }
  rechargeBattery() {
     this.rechargeModal = !this.rechargeModal;
     this.loadBattery()
     this.renderizar();
  }
  setEnergyImage() {
    this.energyImagePath = this.currentBattery > 0
      ? 'assets/lingobot/menu-icons/lingobot-energy-on.png'
      : 'assets/lingobot/menu-icons/lingobot-energy-off.png';
  }
  loadBattery() {
    this.setEnergyImage();
    this.rechargeValue = Math.abs(this.currentBattery - 10);
    this.renderizar()
  }
  addBattery() {
    this.playSound.playCleanSound2()
    this.auth.addBatteryEnergy(1);
    this.auth.decreaseLocalUserData( {gemas: 1 });
    this.loadBattery();
  }
  rechargeAll(){
    this.playSound.playCleanSound2()
    this.auth.addBatteryEnergy(this.rechargeValue);
    this.auth.decreaseLocalUserData( {gemas: this.rechargeValue });
    this.loadBattery();
  }
  removeBattery() {
    this.auth.removeBatteryEnergy();
    this.loadBattery();
  }
  getTextoPorAndar(): string {
    // Calcula a posição do andar dentro do conjunto de 4
    const andarNoConjunto = (this.andarAtual - 1) % 4;  // Faz a divisão inteira para achar o resto

    switch (andarNoConjunto) {
      case 0:
        this.currentElderImage = "assets/lingobot/elders/writing/parado.png";
        return "Writing";  // Andar 1, 5, 9, 13, ...
      case 1:
        this.currentElderImage = "assets/lingobot/elders/reading/parado.png";
        return "Reading";  // Andar 2, 6, 10, 14, ...
      case 2:
        this.currentElderImage = "assets/lingobot/elders/listening/focado.png";
        return "Listening";  // Andar 3, 7, 11, 15, ...
      case 3:
        this.currentElderImage = "assets/lingobot/elders/speaking/speaking.png";
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

      if (this.getTextoPorAndar().toLowerCase() !== "speaking") {
        this.subirAndar()
        this.loadVideoByAndar();
      }



    } else if (cmd === 'in') {
      this.ActivityModal();

           this.loadComponent = true;
           this.modalService.toggleSelectQuestModal();


    } else if (cmd === 'down') {
      if (this.andarAtual > 1) {
         this.descerAndar();
         this.loadVideoByAndar();
      } else {

        alert("Não é possível descer abaixo do primeiro andar.");
      }
    }
  }
  goToTower() {
    this.playSound.playCleanSound2();
    this.router.navigate(['/tower']);
  }


openModal(icon: any){
    switch (icon) {

      case 'assets/lingobot/menu-icons/bussula.png':
        this.playSound.playHologram();
        this.modalService.toggleDailyModal();
        break;
      case 'assets/lingobot/menu-icons/holograma-icon.png':
        this.playSound.playHologram();
        this.modalService.toggleUserInfosModal();
        break;
      case 'assets/lingobot/menu-icons/icone-home.png':
        this.goToTower();
       break;
      case 'assets/lingobot/menu-icons/bag-icon.png':
        this.playSound.playHologram();
        this.modalService.toggleItemsModal();
       break;
      case 'assets/lingobot/menu-icons/gear_icon.png':
        this.playSound.playHologram();
        this.modalService.toggleSettingsModal();
        break;
    }
}





  menuItems = [
    { icon: 'assets/lingobot/menu-icons/icone-home.png' },
    { icon: 'assets/lingobot/menu-icons/bag-icon.png' },
    { icon: 'assets/lingobot/menu-icons/bussula.png' },
    { icon: 'assets/lingobot/menu-icons/holograma-icon.png' },
    { icon: 'assets/lingobot/menu-icons/gear_icon.png' },
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






  loopStart = 0;
  loopEnd = 0;
  finalEnd = 0;
  isLooping = true;
  waitAnimationTime: number = 0;
  private onVideoPlaying = () => {};


  loadingTransition() {
    const video = this.videoPlayer.nativeElement;

    // Ativa loading
    this.loading = true;

    // Remove listeners antigos para evitar acumulo
    video.removeEventListener('playing', this.onVideoPlaying);

    // Cria função handler para 'playing'
    this.onVideoPlaying = () => {
      this.loading = false;
      video.removeEventListener('playing', this.onVideoPlaying);
    };

    // Adiciona o listener para quando o vídeo começar a tocar
    video.addEventListener('playing', this.onVideoPlaying);
  }


  @ViewChild('videoPlayer', { static: false }) videoPlayer!: ElementRef<HTMLVideoElement>;
  loading: boolean = true;







  ngAfterViewInit() {




















    const video = this.videoPlayer.nativeElement;


    // Esconde o loading quando começar a tocar
    video.addEventListener('playing', () => {
      this.loading = false;
    });


    video.addEventListener('timeupdate', () => {
      if (this.isLooping && video.currentTime >= this.loopEnd) {
        video.currentTime = this.loopStart;
        video.play();
      }

      if (!this.isLooping && video.currentTime >= this.finalEnd) {
        video.pause();
      }
    });

    // Quando o vídeo estiver pronto, inicia a reprodução
    video.addEventListener('loadedmetadata', () => {
      video.currentTime = this.loopStart;
      video.playbackRate = 1;
      video.play().catch(err => console.error('Erro ao dar play no vídeo:', err));
    });

  }

  loadVideoByAndar() {
    this.loadingTransition();

    const andarNoConjunto = (this.andarAtual - 1) % 4;

    switch (andarNoConjunto) {
      case 0:
        // WRITING
        this.loopStart = 0;
        this.loopEnd = 12.0;
        this.finalEnd = 17.21;
        break;
      case 1:
        // READING
        this.loopStart = 17.80;
        this.loopEnd = 25.0;
        this.finalEnd = 29.0;
        break;
      case 2:
        // LISTENING
        this.loopStart = 32.0;
        this.loopEnd = 42.5;
        this.finalEnd = 51.0;
        break;
      case 3:
        // SPEAKING
        this.loopStart = 51.8;
        this.loopEnd = 63.0;
        this.finalEnd = 68.0;
        break;
    }

    this.waitAnimationTime = Math.abs(this.loopEnd - this.finalEnd) * 1000;

    const video = this.videoPlayer.nativeElement;
    this.isLooping = true;

    if (video.readyState >= 2) {
      video.currentTime = this.loopStart;
      video.play();
    } else {
      video.addEventListener('loadedmetadata', () => {
        video.currentTime = this.loopStart;
        video.play();
      }, { once: true });
    }
  }



  playEnterAnimation() {
    const video = this.videoPlayer.nativeElement;
    this.isLooping = false;

    if (video.readyState >= 2) {
      video.currentTime = this.loopEnd;
      video.play();
    } else {
      video.addEventListener('loadedmetadata', () => {
        video.currentTime = this.loopEnd;
        video.play();
      }, { once: true });
    }
  }


  playCongratsScene() {
    const video = this.videoPlayer.nativeElement;
    this.loopStart = 69.5;
    this.loopEnd = 90.0;
    this.finalEnd = 90.0;
    this.isLooping = false;

    video.playbackRate = 1;

    if (video.readyState >= 2) {
      video.currentTime = 69.5;
      video.play();
    } else {
      video.addEventListener('loadedmetadata', () => {
        video.currentTime = 69.5;
        video.play();
      }, { once: true });
    }
  }


  addXpSpeaking() {
    this.auth.addXpSkills('speaking');
  }


}
