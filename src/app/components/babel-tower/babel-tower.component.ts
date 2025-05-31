import {
  AfterViewInit,
  ChangeDetectorRef,
  Component, ElementRef,
  HostListener,
  OnInit,
  QueryList, ViewChild,
  ViewChildren
} from '@angular/core';
import {PlaySoundService} from "../../services/play-sound.service";
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {TrilhaService} from "../../services/trilha.service";
import {Subscription} from "rxjs";
import {animate, state, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-babel-tower',
  templateUrl: './babel-tower.component.html',
  styleUrls: ['./babel-tower.component.css'],
})
export class BabelTowerComponent  implements OnInit, AfterViewInit{
  userDifficulty: string = '';
  checkQuestModal: boolean = false;
  rechargeValue: number = 0;
  blockAction: boolean = false;
  resultadoPedagio: {
    precisaPagar: boolean;
    podeSubir: boolean;
    mensagem: string;
    requisitos: { nome: string; completo: boolean }[];
  } = {
    precisaPagar: false,
    podeSubir: false,
    mensagem: '',
    requisitos: []
  };
  showPedagioModal: boolean = false;

  currentBattery: number = 0;
  batteryArray = Array(10).fill(0);
  energyImagePath: string = '';
  rechargeModal: boolean = false ;




  torreSubscription!: Subscription;
  andarAtual: number = 0; // Variável para armazenar o andar atual
  exercise1: boolean = false; // Variável para o exercício 1
  exercise2: boolean = false; // Variável para o exercício 2
  andar_inicial_conjunto: number = 0;
  andar_final_conjunto: number = 0;

  constructor(private playSound: PlaySoundService,
              private router: Router,
              protected auth: AuthService,
              private trilhaService: TrilhaService,
              private cdr: ChangeDetectorRef) {window.scrollTo(0, 0);this.playSound.playTowerSoundTrack()}

  ngOnInit() {
    this.loadBattery();
    this.auth.user$.subscribe(userData => {
      if (!userData) return;
      this.userDifficulty = userData.difficulty;
      this.currentBattery = userData.battery;
      this.setEnergyImage()
    });



    this.torreSubscription = this.trilhaService.torre$.subscribe((torre) => {
      this.andarAtual = torre.andar_atual;
      this.andar_inicial_conjunto = torre.andar_inicial_conjunto;
      this.andar_final_conjunto = torre.andar_final_conjunto;
      this.exercise1 = torre.exercise1;
      this.exercise2 = torre.exercise2;
      this.auth.checkAndUpdateRanking(this.andarAtual);
    });


    this.loadVideoByAndar();
  }
  verificarPedagio() {}
  renderizar(){this.cdr.detectChanges();}
  pagarPedagio() {
    // Deduzir os valores e avançar o andar
   // this.auth.pagarPedagio(); // você pode criar esse método depois
    this.closeModal();
  }
  checkQuest(){
  this.resultadoPedagio = this.auth.checkQuest(4);
  this.checkQuestModal = !this.checkQuestModal;
  this.renderizar();
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
  getRequisitoIcon(index: number): string {
    const icons = [
      'assets/lingobot/itens/gemas.png',
      'assets/lingobot/itens/gold.png',
      'assets/lingobot/menu-icons/level.png',
      'assets/lingobot/skills/listening.png',
      'assets/lingobot/skills/speaking.png',
      'assets/lingobot/skills/reading.png',
      'assets/lingobot/skills/writing.png'
    ];
    return icons[index];
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
        return "Writing";  // Andar 1, 5, 9, 13, ...
      case 1:
        return "Reading";  // Andar 2, 6, 10, 14, ...
      case 2:
        return "Listening";  // Andar 3, 7, 11, 15, ...
      case 3:
        return "Speaking";  // Andar 4, 8, 12, 16, ...
      default:
        return "";  // Caso não encontre
    }
  }
  closeModal() {
    this.showPedagioModal = false;
  }




  private cooldownInProgress = false;
  private inCommandRunning = false; // usado apenas para 'in'

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async command(cmd: string) {
    if (this.cooldownInProgress) {
      console.warn("Cooldown global em andamento.");
      return;
    }

    // trava 'in' se já estiver em execução
    if (cmd === 'in' && this.inCommandRunning) {
      console.warn("Comando 'in' já está em execução.");
      return;
    }

    // inicia cooldown global
    this.cooldownInProgress = true;
    setTimeout(() => {
      this.cooldownInProgress = false;
    }, 3000);

    this.playSound.playCleanSound();

    if (cmd === 'up') {
      this.auth.checkAndUpdateRanking(this.andarAtual);

      if (this.andarAtual === this.andar_final_conjunto) {
        this.verificarPedagio();
        this.showPedagioModal = true;
      } else {
        this.trilhaService.updateTorreData({ andar_atual: 1 });
        this.mudarCena(this.transitionUp, true);
        await this.delay(1500);
        this.loadVideoByAndar();
      }

    } else if (cmd === 'in') {
      this.inCommandRunning = true; // trava aqui

      try {
        if (this.currentBattery > 0) {
          this.mudarCena(this.roomActive, true);

          // se quiser delay da animação da sala, ative aqui
           await this.delay(5600);

          const destino = this.getTextoPorAndar().toLowerCase();
          if (["writing", "listening", "reading", "speaking"].includes(destino)) {
            this.removeBattery();
            await this.router.navigate([`/${destino}`]); // espera navegação
          }
        } else {
          this.rechargeBattery();
        }
      } finally {
        this.inCommandRunning = false; // libera só depois que tudo for feito
      }

    } else if (cmd === 'down') {
      const t = this.trilhaService.getTorreData();

      if (t.andar_atual > 1) {
        this.trilhaService.updateTorreData({ andar_atual: -1 });
        this.mudarCena(this.transitionDown, true);
        await this.delay(1500);
        this.loadVideoByAndar();
      } else {
        alert("Não é possível descer abaixo do primeiro andar.");
      }
    }
  }







  roomActive: number = 0;
  transitionUp: number = 0;
  transitionDown: number = 0;

  loadVideoByAndar() {
    const andarNoConjunto = (this.andarAtual - 1) % 4;
    switch (andarNoConjunto) {
      case 0:
        // WRITING
        this.transitionUp = 2;
        this.transitionDown = 3;

        setTimeout(() => {
          this.mudarCena(10, false); //cena de writing static
          this.roomActive = 10;

        }, 1500);

        break;
      case 1:
        // READING
        this.transitionUp = 4; // ok
        this.transitionDown = 3; // ok

        setTimeout(() => {
          this.mudarCena(11, false); //cena de writing static
          this.roomActive = 11;

        }, 1500);
        break;
      case 2:
        // LISTENING
        this.transitionUp = 6; // ok
        this.transitionDown = 5; // ok

        setTimeout(() => {
          this.mudarCena(12, false);
          this.roomActive = 12;

        }, 1500);
        break;
      case 3:
        // SPEAKING
        this.transitionUp = 8; // ok
        this.transitionDown = 7; // ok

        setTimeout(() => {
          this.mudarCena(13, false);
          this.roomActive = 13;

        }, 1500);
        break;
    }

    this.renderizar();
  }























  @ViewChildren('video') videosRefs!: QueryList<ElementRef<HTMLVideoElement>>;
  cena: number = 0;

  ngAfterViewInit() {
    // Aguarda um pequeno tempo para garantir que o Angular já aplicou os bindings
    setTimeout(() => {
      this.videosRefs.forEach(ref => {
        const video = ref.nativeElement;
        video.muted = true;
        video.pause();
        video.currentTime = 0;
      });
    }, 0);
  }

  mudarCena(novaCena: number, playVideo: boolean = true) {
    this.videosRefs.forEach(videoRef => {
      const video = videoRef.nativeElement;
      video.pause();
      video.currentTime = 0;
      video.muted = true;
    });

    this.cena = novaCena;

    if (!playVideo) return;

    setTimeout(() => {
      const videoRef = this.videosRefs.find(ref => {
        const video = ref.nativeElement;
        return !video.hidden;
      });

      if (videoRef) {
        const video = videoRef.nativeElement;
        video.muted = false;
        video.play().catch(e => {
          console.warn('Erro ao dar play no vídeo:', e);
        });
      }
    }, 50);
  }
}
