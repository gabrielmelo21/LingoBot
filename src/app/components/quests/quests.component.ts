import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {PlaySoundService} from "../../services/play-sound.service";
import {MainAPIService} from "../../services/main-api.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";



@Component({
  selector: 'app-quests',
  templateUrl: './quests.component.html',
  styleUrls: ['./quests.component.css']
})
export class QuestsComponent {
  userChoiceStatus: string = "";
  formulario: FormGroup;
  teaxtareaWriting: FormGroup;
  selectedDifficulty: string = '';
  selectedChoice: boolean | null = null;
  points: number = 0;
  calculatedPoints: number = 0;
  audio = new Audio();
  audioUrl: string | null = null;
  isPlaying: boolean = false;
  audioElement: HTMLAudioElement | null = null;




  //Sempre que o user atingir 50 mil pontos ele upa.


  constructor(  private formBuilder: FormBuilder, private router: Router, private playSound: PlaySoundService, private apiService: MainAPIService){
    this.formulario = this.formBuilder.group({
      mainTheme: ['', Validators.required],
    });


    this.teaxtareaWriting = this.formBuilder.group({
      userText: ['', Validators.required],
    });


  }


  userChoice(choice: string) {
    this.playSound.playCleanNavigationSound()
    this.userChoiceStatus = choice;

    if (this.userChoiceStatus == "listening"){
      // limpa configurações
      this.calculatedPoints = 0;
      this.selectedDifficulty = ''
    }

    if (this.userChoiceStatus == "writing"){
      // limpa configurações
      this.calculatedPoints = 0;
      this.selectedDifficulty = ''
    }

    if (this.userChoiceStatus == "reading"){
      // limpa configurações
      this.calculatedPoints = 0;
      this.selectedDifficulty = ''
    }

  }





  exerciseText: string = '';
  exerciseWriting: string = '';
  isLoading: boolean = false;

  gerarExercicio(type: string) {
    this.isLoading = true;

    if (type === 'listening') {
      this.apiService.getText(this.selectedDifficulty).subscribe(response => {
        this.exerciseText = response.text;

        this.apiService.getTTS(response.text).subscribe(audioBlob => {
          this.audioUrl = URL.createObjectURL(audioBlob);
          this.userChoiceStatus = "listening_exercise";
          this.isLoading = false;
          this.playSound.playNotification();

          // Criar e tocar áudio automaticamente
          this.playAudio();
        });
      });
    }


    if (type === 'writing') {
      this.apiService.getTema(this.selectedDifficulty).subscribe(response => {
            this.playSound.playNotification();
            this.exerciseWriting = response.text;
            this.isLoading = false;
            this.userChoiceStatus = "writing_exercise";

      });

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
    };
  }



  listeningExerciseGPTresponse: string = '';
  hideMainPage: boolean = false;
  verifyListeningExercise(){
    const textoUser = this.formulario.get("mainTheme")?.value + "";


    this.apiService.GPT(this.exerciseText, textoUser, "ListeningChecking").subscribe(response => {
      try {
        // Fazendo o parse da string JSON
        const parsedResponse = JSON.parse(response);

        // Agora você pode acessar parsedResponse.response
        this.listeningExerciseGPTresponse = parsedResponse.response;

        // Exibe o valor que você quer
       console.log('Resposta da API: ' + this.listeningExerciseGPTresponse);

      } catch (error) {
        console.log('Erro ao fazer o parse da resposta: ' + error);
      }


      if (this.listeningExerciseGPTresponse == "True" || this.listeningExerciseGPTresponse == "true"){
         this.hideMainPage = true;
         this.checkAnswer(true)
      }

      if (this.listeningExerciseGPTresponse == "False" || this.listeningExerciseGPTresponse == "false"){
        this.hideMainPage = true;
        this.checkAnswer(false)
      }

    });


  }




  writingExerciseGPTresponse: string = '';

  // Definição das variáveis para armazenar os valores do JSON
  writingGrammarScore: number = 0;
  writingCoherenceScore: number = 0;
  writingVocabularyScore: number = 0;
  writingErrors: string = '';
  writingImprovements: string = '';
  writingFinalScore: number = 0;

  verifyWritingExercise() {
    const textoUser = this.teaxtareaWriting.get("userText")?.value + "";

    this.playSound.playCleanNavigationSound()
    console.log(prompt);



    this.apiService.GPT(this.exerciseWriting, textoUser, "WritingChecking").subscribe(response => {
      console.log('Resposta bruta da API:', response); // 🔍 Debug
      this.userChoiceStatus = "writing_feedback"
      this.playSound.playWinSound()
      try {
        // Primeiro parse
        const parsedResponse = JSON.parse(response);

        // Segundo parse (pois `parsedResponse.response` ainda é uma string JSON)
        const finalData = JSON.parse(parsedResponse.response);

        console.log('JSON final parseado:', finalData); // Debug do JSON correto

        // Agora os valores podem ser atribuídos corretamente
        this.writingGrammarScore = finalData.gramatica;
        this.writingCoherenceScore = finalData.coerencia;
        this.writingVocabularyScore = finalData.vocabulario;
        this.writingErrors = finalData.erros;
        this.writingImprovements = finalData.melhorias;
        this.writingFinalScore = finalData.notaFinal;

      } catch (error) {
        console.error('Erro ao fazer o parse da resposta JSON:', error);
      }

    });


  }














  isCorrectAnswer: boolean = false;
  isWrongAnswer: boolean = false;

  checkAnswer(isCorrect: boolean) {
    if (isCorrect) {
      this.playSound.playWinSound()
      this.isCorrectAnswer = true;
      this.isWrongAnswer = false;
    } else {
      this.playSound.playErrorQuestion()
      this.isCorrectAnswer = false;
      this.isWrongAnswer = true;
    }
  }

  continue() {
    this.playSound.playCleanNavigationSound()
    this.isCorrectAnswer = false;
    this.isWrongAnswer = false;
    this.hideMainPage = false;
    this.userChoiceStatus = "listening"

    // Lógica para carregar a próxima questão...
  }















  generateAudio(text: string) {
    this.apiService.getTTS(text).subscribe(blob => {
      const audioBlob = new Blob([blob], { type: 'audio/mp3' });
      this.audioUrl = URL.createObjectURL(audioBlob);
    });
  }



  navigate_to() {
    this.playSound.playCleanNavigationSound()
    this.router.navigate(['/home']);
  }

  selectDifficulty(difficulty: string) {
    this.playSound.playCleanNavigationSound()
    this.selectedDifficulty = difficulty;
    this.calculatePointsListening();
  }


  isActive(difficulty: string): boolean {
    return this.selectedDifficulty === difficulty; // Verifica se o botão está ativo
  }


  selectTextOnOrNot(choice: boolean) {
    this.playSound.playCleanNavigationSound()
    this.selectedChoice = choice; // Define a escolha (Sim ou Não)

    this.calculatePointsListening();

  }

  isActive2(choice: boolean): boolean {
    return this.selectedChoice === choice; // Verifica se o botão está ativo
  }



  calculatePointsListening() {
    if (this.selectedDifficulty === 'easy') {

      if (this.selectedChoice === true) {
        this.calculatedPoints = 3000; // 2000 + 1000 bônus
      } else {
        this.calculatedPoints = 2000; // Sem bônus
      }
    }

    if (this.selectedDifficulty === 'medium') {


      if (this.selectedChoice === true) {
        this.calculatedPoints = 5000; // 4000 + 1000 bônus
      } else {
        this.calculatedPoints = 4000; // Sem bônus
      }
    }

    if (this.selectedDifficulty === 'hard') {
      if (this.selectedChoice === true) {
        this.calculatedPoints = 7000; // 6000 + 1000 bônus
      } else {
        this.calculatedPoints = 6000; // Sem bônus
      }
    }
  }






  calculatePointsWriting() {
    if (this.selectedDifficulty === 'easy') {

      if (this.selectedChoice === true) {
        this.calculatedPoints = 3000; // 2000 + 1000 bônus
      } else {
        this.calculatedPoints = 2000; // Sem bônus
      }
    }

    if (this.selectedDifficulty === 'medium') {


      if (this.selectedChoice === true) {
        this.calculatedPoints = 5000; // 4000 + 1000 bônus
      } else {
        this.calculatedPoints = 4000; // Sem bônus
      }
    }

    if (this.selectedDifficulty === 'hard') {
      if (this.selectedChoice === true) {
        this.calculatedPoints = 7000; // 6000 + 1000 bônus
      } else {
        this.calculatedPoints = 6000; // Sem bônus
      }
    }
  }



}
