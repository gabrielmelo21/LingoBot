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
import {TrilhaService} from "../../services/trilha.service";
import {Subscription} from "rxjs";
import {TimersService} from "../../services/timers.service";
import {EldersRoomGuardiamService} from "../../services/elders-room-guardiam.service";




@Component({
  selector: 'app-babel-tower',
  templateUrl: './babel-tower.component.html',
  styleUrls: ['./babel-tower.component.css'],
})
export class BabelTowerComponent  implements OnInit, AfterViewInit, OnDestroy{


  currentElderImage: string = "";
  userDifficulty: string = '';
  checkQuestModal: boolean = false;
  rechargeValue: number = 0;

  showPedagioModal: boolean = false;

  currentBattery: number = 0;
  batteryArray = Array(10).fill(0);
  energyImagePath: string = '';
  rechargeModal: boolean = false ;


  andarAtual: number = 0;





  constructor(private playSound: PlaySoundService,
              private router: Router,
              protected auth: AuthService,
              private trilhaService: TrilhaService,
              private cdr: ChangeDetectorRef,
              protected timersService: TimersService,
              private eldersRoomGuardiamService:  EldersRoomGuardiamService) {
    window.scrollTo(0, 0);
   // this.playSound.playTowerSoundTrack()




  }
  checkMissoesModal: boolean = false;
  missoesDiarias: { nome: string; completo: boolean }[] = [];


  private missionsSubscription?: Subscription;
  recompensaReivindicada = this.timersService.isRewardClaimed();

  getIconeMissao(nome: string): string {
    return `assets/lingobot/skills/${nome.toLowerCase()}.png`;
  }

  // Métodos de teste
  marcarComoFeita(missao: string) {
    this.timersService.updateMission(missao.toLowerCase());
    this.atualizarMissoes();
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
    this.checkMissoesModal = !this.checkMissoesModal;
    this.renderizar();
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



  subirAndar(){
     this.andarAtual++;
     localStorage.setItem("andarAtual", this.andarAtual.toString());
  }
  descerAndar(){
     this.andarAtual--;
     localStorage.setItem("andarAtual", this.andarAtual.toString());
  }

  ngOnInit() {


 //this.auth.updateLocalUserData({ ranking: 4})
 //localStorage.setItem("andarAtual", "1");


    if (!localStorage.getItem("andarAtual")) {localStorage.setItem("andarAtual", "1");}
    this.andarAtual = parseInt(localStorage.getItem("andarAtual") || "1", 10);



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


  ngOnDestroy() {
    // Limpa a subscription para evitar memory leaks
    if (this.missionsSubscription) {
      this.missionsSubscription.unsubscribe();
    }
  }
  verificarPedagio() {}
  renderizar(){this.cdr.detectChanges();}


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
  closeModal() {
    this.showPedagioModal = false;
  }




  async command(cmd: string) {
    this.playSound.playCleanSound();

    if (cmd === 'up') {

      if (this.getTextoPorAndar().toLowerCase() !== "speaking") {
        this.subirAndar()
        this.loadVideoByAndar();
      }



    } else if (cmd === 'in') {


      try {
        if (this.currentBattery > 0) {
          this.playEnterAnimation()


          setTimeout( () => {
            const destino = this.getTextoPorAndar().toLowerCase();
            if (["writing", "listening", "reading", "speaking"].includes(destino)) {
              this.removeBattery();
              this.eldersRoomGuardiamService.markAsPaid(destino);


              this.router.navigate([`/${destino}`]); // espera navegação
            }
          }, this.waitAnimationTime +100)



        } else {
          this.rechargeBattery();
        }
      } finally {

      }

    } else if (cmd === 'down') {
      if (this.andarAtual > 1) {
         this.descerAndar();
         this.loadVideoByAndar();
      } else {

        alert("Não é possível descer abaixo do primeiro andar.");
      }
    }
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
