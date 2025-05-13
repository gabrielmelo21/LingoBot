import { Component } from '@angular/core';
import {PlaySoundService} from "../../services/play-sound.service";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {MainAPIService} from "../../services/main-api.service";


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
export class ListeningComponent {
  dialog: number = 0;
  cena: number = 1;
  cenario: string = "assets/lingobot/cenas_na_masmorra/listening/listening_gate0.jpg";
  cenarioCount: number = 0;
  cenarioFinal: boolean = false;
  finalChestAnimation: boolean = false;
  audioUrl: string | null = null;
  isPlaying: boolean = false;
  audioElement: HTMLAudioElement | null = null;
  isLoading: boolean = false;
  elder: string = "assets/lingobot/elders/listening/parado.png";
  srcExercises: string = '';
  finalGoldReward: number = 10;
  finalXpReward: number = 10000;
  exercises: ListeningExercise[] = [];
  currentExercise!: ListeningExercise;
  currentStep: number = 0; // 0 = p1, 1 = p2, 2 = phrase
  playCount: number = 0;


  constructor(private playSoundService: PlaySoundService,
              private http: HttpClient,
              private router: Router,
              private authService: AuthService,
              private apiService: MainAPIService) {
             // this.getAudioTTS("eu sou um audio gerado pelo python, i am audio from python")

               this.playSoundService.playListeningSoundTrack()

                // this.cenarioCount = 6



    switch (this.authService.getDifficulty()) {
      case 'easy':
        this.srcExercises = 'assets/lingobot/json/listening/easy.json';
        this.finalGoldReward = 15;
        this.finalXpReward = 10000;
        break;

      case 'medium':
        this.srcExercises = 'assets/lingobot/json/listening/medium.json';
        // Recompensa 1,5× da easy
        this.finalGoldReward = 20;
        this.finalXpReward = 15000;
        break;

      case 'hard':
        this.srcExercises = 'assets/lingobot/json/listening/hard.json';
        // Recompensa 2× da easy
        this.finalGoldReward = 25;
        this.finalXpReward = 20000;
        break;

      case 'elder':
        this.srcExercises = 'assets/lingobot/json/listening/elder.json';
        // Recompensa 3× da easy
        this.finalGoldReward = 35;
        this.finalXpReward = 30000;
        break;

      default:
        // Fallback caso o valor seja inesperado
        console.warn(`Dificuldade desconhecida: ${this.authService.getDifficulty()}`);
        this.srcExercises = 'assets/lingobot/json/listening/easy.json';
        this.finalGoldReward = 15;
        this.finalXpReward = 10000;
        break;
    }



  }


  private loadExercises(): void {
    this.http.get<ListeningExercise[]>(this.srcExercises).subscribe(data => {
      this.exercises = data;
      this.getRandomExercise();
    });
  }
  private getRandomExercise(): void {
    if (!this.exercises || this.exercises.length === 0) return;

    const randomIndex = Math.floor(Math.random() * this.exercises.length);
    this.currentExercise = this.exercises[randomIndex];
    this.currentStep = 0;
    this.playCount = 0;
    this.playNextAudio();
  }


  private playNextAudio(): void {
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
      console.log("✅ Resposta correta:", resposta);

      // limpar textarea
      inputElement.value = '';



      if (this.currentStep < 2) {

        if (this.cenarioCount < 7){
          this.elder = "assets/lingobot/elders/listening/parado.png";
          this.playSoundService.playWin2()

          setTimeout(() => {
            this.elder = "assets/lingobot/elders/listening/focado.png";
          },1500)
        }


        this.currentStep++;
        this.playNextAudio();
      } else {
        this.playSoundService.playWinSound()


        this.cenarioCount++;
        this.changeCenario(this.cenarioCount)

        console.log(this.cenarioCount + " cenarioCount");

        console.log("🎉 Exercício completo!");
        // Aqui pode-se exibir feedback e/ou iniciar novo exercício
        if (this.cenarioCount !== 7){

          this.elder = "assets/lingobot/elders/listening/win.png";
          setTimeout(() => {
            this.elder = "assets/lingobot/elders/listening/focado.png";
          },2000)



          setTimeout(() => this.getRandomExercise(), 2000); // espera 2s e gera novo
        }else{
          // ação final abrir portao  e animação de win é após abrir o portão e o ancição impressionado com bau de ouro
          this.playSoundService.playOpenChest()
          this.cenarioFinal = true;
          this.elder = "assets/lingobot/elders/listening/opening-chest.png";

          setTimeout(() => {
            this.playSoundService. playChestWin()
            this.cenarioFinal = false;
            this.finalChestAnimation = true;
            this.elder = "assets/lingobot/elders/listening/win.png";
          },5000)

          setTimeout(() =>  {
               // velho flaando e dando o premio

            this.dialog = 7;
            console.log("Moedas de ouro ganho: ", this.finalGoldReward);
            this.authService.updateLocalUserData({ tokens :this.finalGoldReward });
            this.authService.checkLevelUp(this.finalXpReward)
            this.authService.addXpSkills('listening');


          }, 7000);


        }



      }
    } else {
      this.playSoundService.playErrorQuestion()
      this.elder = "assets/lingobot/elders/listening/error.png";

      setTimeout(() => {
        this.elder = "assets/lingobot/elders/listening/focado.png";
      },1500)


      console.log("❌ Resposta incorreta.");
    }
  }



  getAudioTTS(text: string) {
    this.apiService.getTTS(text).subscribe(audioBlob => {
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



  changeCenario(number: number) {
     switch (number) {
       case 1:
       this.cenario = "assets/lingobot/cenas_na_masmorra/listening/gate_listening1.png";
       break;
       case 2:
         this.cenario = "assets/lingobot/cenas_na_masmorra/listening/gate_listening2.png";
        break;
       case 3:
         this.cenario = "assets/lingobot/cenas_na_masmorra/listening/gate_listening3.png";
         break;
       case 4:
         this.cenario = "assets/lingobot/cenas_na_masmorra/listening/gate_listening4.png";
         break;
       case 5:
         this.cenario = "assets/lingobot/cenas_na_masmorra/listening/gate_listening5.png";
         break;
       case 6:
         this.cenario = "assets/lingobot/cenas_na_masmorra/listening/gate_listening6.png";
         break;
       case 7:
         this.cenario = "assets/lingobot/cenas_na_masmorra/listening/gate_listening7.png";
         break;
     }
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
  chooseOption(number: number) {
    this.playSoundService.playCleanSound2()


    switch (number) {
      case  1:
        this.dialog = 1;
        this.elder = "assets/lingobot/elders/listening/explicando.png"
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
        this.loadExercises();
        this.dialog = 6;
        this.elder = "assets/lingobot/elders/listening/focado.png"
        break;
      case 7:
        this.router.navigate(['/babel-tower']);
        break;


    }


  }

}
