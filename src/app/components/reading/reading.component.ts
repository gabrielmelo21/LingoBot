import { Component } from '@angular/core';
import {PlaySoundService} from "../../services/play-sound.service";
import {HttpClient} from "@angular/common/http";
import {VocabEntry} from "../writing/writing.component";
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";


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
export class ReadingComponent {
  cena: number = 1;
  isShaking = false;
  puzzleText: PuzzelText[] = [];
  currentText: string = '';
  currentPassword: string = '';
  currentTip: string = '';
  currentTranslate: string = '';
  sentencePairs: SentencePair[] = [];
  dialog: number = 0 ;
  elder: string = "assets/lingobot/elders/reading/parado.png";
  readingScroll: boolean = false;
  srcExercises: string = '';
  finalGoldReward: number = 10;
  finalXpReward: number = 10000;
  tipCounts: number = 0;
  tipLimit: number = 3;





  constructor(private playSoundService: PlaySoundService,
              private http: HttpClient,
              private router: Router,
              private authService: AuthService) {

    this.playSoundService.playReadingTheme()



    console.log(this.authService.getDifficulty())

    switch (this.authService.getDifficulty()) {
      case 'easy':
        this.srcExercises = 'assets/lingobot/json/reading/easy.json';
        this.finalGoldReward = 10;
        this.finalXpReward = 10000;
        this.tipLimit = 3;  // se errar 3 vezes aparece a ajuda
        break;

      case 'medium':
        this.srcExercises = 'assets/lingobot/json/reading/medium.json';
        // Recompensa 1,5× da easy
        this.finalGoldReward = 15;
        this.finalXpReward = 15000;
        this.tipLimit = 4;
        break;

      case 'hard':
        this.srcExercises = 'assets/lingobot/json/reading/hard.json';
        // Recompensa 2× da easy
        this.finalGoldReward = 20;
        this.finalXpReward = 20000;
        this.tipLimit = 5;
        break;

      case 'elder':
        this.srcExercises = 'assets/lingobot/json/reading/elder.json';
        // Recompensa 3× da easy
        this.finalGoldReward = 30;
        this.finalXpReward = 30000;
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


    console.log(this.srcExercises);
    this.loadExercises()

  }


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




  shakePadlock() {
    this.isShaking = true;
    this.playSoundService.playPadlockLocked()
    setTimeout(() => {
      this.isShaking = false;
    }, 500); // mesma duração da animação
  }

  glowActive: boolean = false;

  toggleGlow() {
    this.glowActive = !this.glowActive;
  }



  chooseOption(number: number) {
    this.playSoundService.playCleanSound2()


    switch (number) {
      case  1:
        this.dialog = 1;

        break;
      case 2:
        // voltar
        this.router.navigate(['/babel-tower']);
        break;
      case 3:
        this.dialog = 3;

        break;
      case 4:
        this.dialog = 4;
        break;
      case 5:
        this.dialog = 5;
        break;
      case 6:
        this.dialog = 6;
        this.elder = "assets/lingobot/elders/reading/pensando.png"


        break;

      case 10:
          this.router.navigate(['/babel-tower']);
        break;


    }


  }



  mudarCena(number: number): void {
    this.playSoundService.playCleanSound2()
    this.cena = number;

    if (number===3){
      this.readingScroll = true;
    }else{
       this.readingScroll = false;
    }
  }


  askTip(){
    if (this.tipCounts >= this.tipLimit) {
       this.playSoundService.playCleanSound2();
       this.dialog = 15;
       this.glowActive = false;
       this.tipCounts = 0;
    }
  }





  enviarResposta(texto: string) {

    if (texto != this.currentPassword){
      this.shakePadlock()
      this.tipCounts++;
      console.log(this.tipCounts);

      if (this.tipCounts >= this.tipLimit) {
         this.toggleGlow()
         this.elder = "assets/lingobot/elders/reading/parado.png"
      }

    }

    if (texto.toLowerCase() === this.currentPassword.toLowerCase()) {
      // Senha correta, independente de maiúsculas/minúsculase3

       this.playSoundService.playOpenChest()
      this.cena = 2;
       this.elder = "assets/lingobot/elders/reading/opening_the_chest.png"
      setTimeout(() => {
        this.playSoundService. playChestWin()
        this.elder = "assets/lingobot/elders/reading/win.png"

        this.dialog = 10;
        console.log("Moedas de ouro ganho: ", this.finalGoldReward);
        this.authService.updateLocalUserData({ tokens :this.finalGoldReward });
        this.authService.checkLevelUp(this.finalXpReward)

      },3000)



      // dialogo elder final e premios
    }



  }

}
