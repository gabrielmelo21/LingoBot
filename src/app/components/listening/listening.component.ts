import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {PlaySoundService} from "../../services/play-sound.service";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {MainAPIService} from "../../services/main-api.service";
import {JackpotService} from "../../services/jackpot.service";
import {VideoControllerService} from "../../services/video-controller.service";
import {DialogService} from "../../services/dialog.service";
import {TimersService} from "../../services/timers.service";
import {EldersRoomGuardiamService} from "../../services/elders-room-guardiam.service";
import {LifeBarComponent} from "../life-bar/life-bar.component";
import {RewardService} from "../../services/reward.service";
import {VideoService} from "../../services/video.service";


export interface ListeningExercise {
  phrase: string;
  translate: string;
  p1: string;
  p2: string;
}



@Component({
  selector: 'app-listening',
  templateUrl: './listening.component.html',
  styleUrls: ['./listening.component.css']
})
export class ListeningComponent implements AfterViewInit {


  @ViewChild(LifeBarComponent) lifeBarComponent!: LifeBarComponent;



  loading: boolean = false;
  finishButton: boolean = false;
  hidePosWin: boolean = false;



  @ViewChild('videoPlayer', { static: false }) videoPlayer!: ElementRef<HTMLVideoElement>;




  ngAfterViewInit() {
    this.videoController.setup(this.videoPlayer);

    const video = this.videoPlayer.nativeElement;

    // Carrega o vídeo local
    this.videoService.getVideoForPlayer('listening-compress.mp4').then((src) => {
      if (src) {
        video.src = src;
        video.load();
      }
    });

    video.addEventListener('playing', () => {
      this.loading = false;
    });

    this.gateController(0);
    this.muteOrUnmute(true);
  }


  muteOrUnmute(boolean: boolean) {
    return boolean?this.videoController.mute():this.videoController.unmute();
  }


 gateController(number: number) {
    switch (number) {
      case 0:

        this.videoController.pauseAt("00:00");

      break;
      case 1:
        // executa efeito do 0:01 ao 0:02, e fixa no 0:02

        this.videoController.playSegment("0:01", "0:02", () => {

          this.videoController.pauseAt("00:02");

        });
        break;
      case 2:

        this.videoController.playSegment("0:03", "0:04", () => {

                this.videoController.pauseAt("00:04");
        });
        break;
      case 3:

        this.muteOrUnmute(false);
        this.videoController.playSegment("0:04", "0:05", () => {

               this.videoController.pauseAt("00:05");


          //executa animação de win ou jackpot
          this.victoryAnimation();
        });
        break;

    }
 }

 victoryAnimation(){

   if(!this.jackpot){
      this.videoController.playSegment("0:05", "0:13", () => {
        this.videoController.pauseAt("00:13");
        this.giveUserReward();
        this.finishButton = true;
        this.muteOrUnmute(true);
      });
    }else{
      this.videoController.playSegment("0:13", "0:21", () => {
        this.videoController.pauseAt("00:21");
        this.giveUserReward();
        this.finishButton = true;
        this.muteOrUnmute(true);
      });
    }
 }


  dialog: number = 0;
  cenarioCount: number = 0;
  audioUrl: string | null = null;
  isPlaying: boolean = false;
  audioElement: HTMLAudioElement | null = null;
  isLoading: boolean = false;
  elder: string = "assets/lingobot/elders/listening/focado.webp";
  srcExercises: string = '';
  exercises: ListeningExercise[] = [];
  currentExercise!: ListeningExercise;
  currentStep: number = 0; // 0 = p1, 1 = p2, 2 = phrase
  playCount: number = 0;
  tipsCount: number = 0;
  tipsMax: number = 0;



  jackpot: boolean = this.jackpotService.isJackpot();
  finalGoldReward: number = this.jackpot?this.rewardService.getCurrentGoldReward()*2:this.rewardService.getCurrentGoldReward();
  finalXpReward: number = this.jackpot?this.rewardService.getCurrentXPReward()*2:this.rewardService.getCurrentXPReward();


  constructor(private playSoundService: PlaySoundService,
              private http: HttpClient,
              private router: Router,
              private authService: AuthService,
              private apiService: MainAPIService,
              private jackpotService: JackpotService,
              private videoController: VideoControllerService,
              protected dialogService: DialogService,
              private timerService: TimersService,
              private eldersRoomGuardiamService: EldersRoomGuardiamService,
              private rewardService: RewardService,
              private videoService: VideoService) {
             // this.getAudioTTS("eu sou um audio gerado pelo python, i am audio from python")


    const allowed = this.eldersRoomGuardiamService.verifyAccessOrRedirect('listening_was_paid');
    if (!allowed) return;


          this.playSoundService.playListeningSoundTrack()


    this.dialogService.startDialog([
      { text: 'Olá, aventureiro. Eu sou o Ancião da Compreensão Auditiva, ou Listening Elder, e preciso da sua ajuda.',
        expression: "assets/lingobot/elders/listening/parado.webp" },
      { text: 'Através daquele portão existe um tesouro, que acredito conter muitas moedas de ouro.',
      expression: "assets/lingobot/elders/listening/explicando.webp" },
      { text: 'Perceba que há 3 espaços vazios. Para abrir o portão, é preciso preenchê-los com as esferas de poder.',
        expression: "assets/lingobot/elders/listening/explicando.webp" },
      { text: 'Porém, para isso, é necessário descobrir o que a Vitrola diz — e ela só fala em inglês.',
        expression: "assets/lingobot/elders/listening/error.webp" },
      { text: 'Cada palavra que ela disser, você deve entender e responder o que ouviu.',
      expression: "assets/lingobot/elders/listening/focado.webp" },
      { text: 'Ao final, terá a palavra-passe que coloca uma esfera de poder. Repita até o portão se abrir.',
      expression: "assets/lingobot/elders/listening/parado.webp" },
    ]);


    switch (this.authService.getDifficulty()) {
      case 'easy':
        this.srcExercises = 'assets/lingobot/json/listening/easy.json';
        this.tipsMax = 3;
        break;

      case 'medium':
        this.srcExercises = 'assets/lingobot/json/listening/medium.json';
        this.tipsMax = 4;
        break;

      case 'hard':
        this.srcExercises = 'assets/lingobot/json/listening/hard.json';
        this.tipsMax = 6;
        break;

      case 'elder':
        this.srcExercises = 'assets/lingobot/json/listening/elder.json';
        this.tipsMax = 10;
        break;

      default:
        // Fallback caso o valor seja inesperado
        console.warn(`Dificuldade desconhecida: ${this.authService.getDifficulty()}`);
        this.srcExercises = 'assets/lingobot/json/listening/easy.json';
        break;
    }

  }


  loadExercises(): void {
    this.http.get<ListeningExercise[]>(this.srcExercises).subscribe(data => {
      this.exercises = data;
      this.getRandomExercise();
    });
  }
  getRandomExercise(): void {
    if (!this.exercises || this.exercises.length === 0) return;

    const randomIndex = Math.floor(Math.random() * this.exercises.length);
    this.currentExercise = this.exercises[randomIndex];
    this.currentStep = 0;
    this.playCount = 0;
    this.playNextAudio();
  }

  next() {
    this.playSoundService.playCleanSound2();
    this.dialogService.nextDialog();
    if (!this.dialogService.isActive){
        this.loadExercises();
    }
  }

  prev() {
    this.playSoundService.playCleanSound2();
    this.dialogService.prevDialog();
  }

  close() {

    this.playSoundService.playCleanSound2();
    this.dialogService.endDialog();
  }



giveUserReward(): void {
  this.rewardService.giveUserRewards(this.jackpot, 'listening');
}

eldersBackToFocus(){
  setTimeout(() => {
    this.elder = "assets/lingobot/elders/listening/focado.webp";
  },1500)
}


eldersExpressions(number: number){

  switch (number) {
      case 1: // correct answer
        this.elder = "assets/lingobot/elders/listening/parado.webp";
        this.playSoundService.playWin2()
        this.eldersBackToFocus();
      break;
      case 2: // incorrect answer
        this.elder = "assets/lingobot/elders/listening/error.webp";
        this.playSoundService.playErrorQuestion()
        this.eldersBackToFocus();
      break;
      case 3:


        this.elder = "assets/lingobot/elders/listening/win.webp";
        this.playSoundService.playWin2()
      break;
    }
}



  playNextAudio(): void {
    this.isLoading = true;

    let textToPlay = '';
    if (this.currentStep === 0) {
      textToPlay = this.currentExercise.p1;
    } else if (this.currentStep === 1) {
      textToPlay = this.currentExercise.p2;
    } else {
      textToPlay = this.currentExercise.phrase;
    }

    this.getAudioTTS(textToPlay);
  }
  enviarResposta(resposta: string, inputElement: HTMLTextAreaElement): void {
    const esperado = this.currentStep === 0
      ? this.currentExercise.p1
      : this.currentStep === 1
        ? this.currentExercise.p2
        : this.currentExercise.phrase;

    if (resposta.trim().toLowerCase() === esperado.trim().toLowerCase()) {
      this.eldersExpressions(1)
      console.log("✅ Resposta correta:", resposta);
      inputElement.value = '';

      if (this.currentStep < 2) {
       // if (this.cenarioCount < 3){ }
        this.currentStep++;
        this.playNextAudio();
      } else {
        this.playSoundService.playWinSound()
        this.cenarioCount++;
        console.log(this.cenarioCount + " cenarioCount");
        this.gateController(this.cenarioCount);
        console.log("🎉 Exercício completo!");
        if (this.cenarioCount !== 3){
          this.eldersExpressions(3);
          setTimeout(() => this.getRandomExercise(), 2000);
        }else{
        // FINAL

          this.timerService.updateMission('listening');
          this.hidePosWin = true;
          this.eldersExpressions(3);
                //this.giveUserReward();

        }// END cenarios

      }
    } else {
      this.lifeBarComponent.onWrongAnswer();
      this.eldersExpressions(2);
      console.log("❌ Resposta incorreta.");
      //this.tipsCount++;
    }
  }
  getAudioTTS(text: string) {
    this.apiService.getTTS(text , 0).subscribe(audioBlob => {
      try {
        this.audioUrl = URL.createObjectURL(audioBlob);
        this.playAudio();
        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
        console.error("Erro ao processar o áudio:", error);
      }
    });
  }

  playAudio() {
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.currentTime = 0;
    }

    this.audioElement = new Audio(this.audioUrl!);
    this.isPlaying = true;
    this.audioElement.play();

    this.audioElement.onended = () => {
      this.isPlaying = false;
      this.playCount++;
    };
  }



  back() {
    this.router.navigate(['/babel-tower']);
  }
}
