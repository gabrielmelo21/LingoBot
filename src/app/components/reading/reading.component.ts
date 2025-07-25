import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, ViewChild} from '@angular/core';
import {PlaySoundService} from "../../services/play-sound.service";
import {HttpClient} from "@angular/common/http";
import {VocabEntry} from "../writing/writing.component";
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {VideoControllerService} from "../../services/video-controller.service";
import {DialogService} from "../../services/dialog.service";
import {JackpotService} from "../../services/jackpot.service";
import {EldersRoomGuardiamService} from "../../services/elders-room-guardiam.service";
import {TimersService} from "../../services/timers.service";
import {LifeBarComponent} from "../life-bar/life-bar.component";
import {RewardService} from "../../services/reward.service";


export interface PuzzelText {
  text: string;
  password: string;
  tip: string;
  translate: string;
}
interface SentencePair {
  en: string;
  pt: string;
  show: boolean;
}



@Component({
  selector: 'app-reading',
  templateUrl: './reading.component.html',
  styleUrls: ['./reading.component.css']
})
export class ReadingComponent implements AfterViewInit{

  @ViewChild(LifeBarComponent) lifeBarComponent!: LifeBarComponent;



  tabletModal: boolean = false;
  jackpot: boolean = this.jackpotService.isJackpot();
  hidePosWin: boolean = false;


  constructor(
              private playSoundService: PlaySoundService,
              private http: HttpClient,
              private router: Router,
              private authService: AuthService,
              private videoController: VideoControllerService,
              protected dialogService: DialogService,
              private jackpotService: JackpotService,
              private eldersRoomGuardiamService: EldersRoomGuardiamService,
              private timerService: TimersService,
              private rewardService: RewardService
) {

  const allowed = this.eldersRoomGuardiamService.verifyAccessOrRedirect('reading_was_paid');
  if (!allowed) return;


    this.playSoundService.playReadingTheme()


    this.dialogService.startDialog([
      { text: 'Olá, Lingobot. Eu sou o Ancião da Leitura. Ainda bem que chegou, preciso de sua Ajuda.' },
      { text: 'Em minha sala, tenho baús misteriosos, que para serem abertos é necessário Desvendar seu Segredo.' },
      { text: 'Para abrir esse baú é necessário ler o texto que enviei para seu Tablet e descobrir a palavra-passe, que está nesse texto' },
      { text: 'O texto está em inglês então você precisa estuda-lo, toque nas palavras e será mostrado a tradução.' },
      { text: 'A resposta é apenas uma palavra em inglês, descubra ela e ganhe Moedas e XP  ' },
    ]);


    switch (this.authService.getDifficulty()) {
      case 'easy':
        this.srcExercises = 'assets/lingobot/json/reading/easy.json';
        this.finalGoldReward = this.jackpot ? 50 : 25;
        this.finalXpReward = 20000;
        this.tipLimit = 3;  // se errar 3 vezes aparece a ajuda
        break;

      case 'medium':
        this.srcExercises = 'assets/lingobot/json/reading/medium.json';
        // Recompensa 1,5× da easy
        this.finalGoldReward = this.jackpot ? 60 : 30;
        this.finalXpReward = 25000;
        this.tipLimit = 4;
        break;

      case 'hard':
        this.srcExercises = 'assets/lingobot/json/reading/hard.json';
        // Recompensa 2× da easy
        this.finalGoldReward = this.jackpot ? 70 : 35;
        this.finalXpReward = 30000;
        this.tipLimit = 5;
        break;

      case 'elder':
        this.srcExercises = 'assets/lingobot/json/reading/elder.json';
        // Recompensa 3× da easy
        this.finalGoldReward = this.jackpot ? 80 : 40;
        this.finalXpReward = 35000;
        this.tipLimit = 7;
        break;

      default:
        // Fallback caso o valor seja inesperado
        console.warn(`Dificuldade desconhecida: ${this.authService.getDifficulty()}`);
        this.srcExercises = 'assets/lingobot/json/reading/easy.json';
        this.finalGoldReward = 10;
        this.finalXpReward = 10000;
        break;
    }
    this.loadExercises()
  }


  next() {
    this.playSoundService.playCleanSound2();
    this.dialogService.nextDialog();
  }

  prev() {
    this.playSoundService.playCleanSound2();
    this.dialogService.prevDialog();
  }

  close() {

    this.playSoundService.playCleanSound2();
    this.dialogService.endDialog();
  }








  loading: boolean = true;

  @ViewChild('videoPlayer', { static: false }) videoPlayer!: ElementRef<HTMLVideoElement>;


  ngAfterViewInit() {
    this.videoController.setup(this.videoPlayer);
    const video = this.videoPlayer.nativeElement;
    video.addEventListener('playing', () => {
      this.loading = false;
    });
    this.staticPadlock();
  }


  staticPadlock() {
    this.videoController.setStaticLoop(0.8, 0.9);
  }


  shakePadLock() {
    this.videoController.playSegment(0.1, 0.85, () => {
      this.staticPadlock(); // volta ao loop padrão
      console.log('Shake finalizado e loop restaurado');
    });
  }

 commonWinAnimation(){
   this.videoController.playSegment("0:01", "0:08", () => {
     this.giveRewards()
     this.videoController.playSegment("0:08", "0:08", () => {
       this.videoController.mute();
       this.hidePosWin = true;
     });
   });

 }

  jackpotWinAnimation(){
    this.videoController.playSegment("0:09", "0:17", () => {
      this.giveRewards()
      this.videoController.playSegment("0:08", "0:08", () => {
        this.videoController.mute();
        this.hidePosWin = true;
      });

    });

  }


  giveRewards(){
    this.rewardService.giveUserRewards(this.finalXpReward, this.finalGoldReward, 'reading');
  }






  openTabletModal(){

    this.tabletModal = !this.tabletModal;
  }






  puzzleText: PuzzelText[] = [];
  currentText: string = '';
  currentPassword: string = '';
  currentTip: string = '';
  currentTranslate: string = '';
  sentencePairs: SentencePair[] = [];
  dialog: number = 0 ;
  elder: string = "assets/lingobot/elders/reading/parado.png";
  srcExercises: string = '';
  finalGoldReward: number = 10;
  finalXpReward: number = 10000;
  tipCounts: number = 0;
  tipLimit: number = 3;




  private loadExercises(): void {
    this.http.get<PuzzelText[]>(this.srcExercises)
      .subscribe(data => {
        this.puzzleText = data;
        this.getRandomExercise();
      });
  }

  private getRandomExercise(): void {
    if (!this.puzzleText || this.puzzleText.length === 0) return;

    const randomIndex = Math.floor(Math.random() * this.puzzleText.length);
    const selected = this.puzzleText[randomIndex];

    this.currentText = selected.text;
    this.currentPassword = selected.password;
    this.currentTip = selected.tip;
    this.currentTranslate = selected.translate;

    this.buildSentencePairs(this.currentText, this.currentTranslate);
  }

  private buildSentencePairs(en: string, pt: string): void {
    const enSentences = en.split('.').map(s => s.trim()).filter(s => s);
    const ptSentences = pt.split('.').map(s => s.trim()).filter(s => s);

    this.sentencePairs = enSentences.map((sentence, i) => ({
      en: sentence + '.',
      pt: ptSentences[i] ? ptSentences[i] + '.' : '',
      show: false
    }));
  }

  toggleTranslation(index: number): void {
    this.sentencePairs[index].show = !this.sentencePairs[index].show;
  }


hideOnWin: boolean = false;
  enviarResposta(texto: string) {
    if (texto != this.currentPassword){
      this.lifeBarComponent.onWrongAnswer();
       this.shakePadLock();
       this.tipCounts++;
    }
    if (texto.toLowerCase() === this.currentPassword.toLowerCase()) {
      this.hideOnWin = true;
     this.timerService.updateMission('reading');
      this.playSoundService.playOpenChest()
      if (this.jackpot){
        this.jackpotWinAnimation();
      }else{
        this.commonWinAnimation();
      }
    }
  }




  back() {
    this.router.navigate(['/babel-tower']);
  }
}
