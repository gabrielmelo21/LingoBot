import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {PlaySoundService} from "../../services/play-sound.service";
import {MainAPIService} from "../../services/main-api.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";



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


  constructor(  private auth: AuthService,  private formBuilder: FormBuilder, private router: Router, private playSound: PlaySoundService, private apiService: MainAPIService){
    window.scrollTo(0, 0); // Faz o scroll para o topo ao carregar o componente

    this.formulario = this.formBuilder.group({
      mainTheme: ['', Validators.required],
    });


    this.teaxtareaWriting = this.formBuilder.group({
      userText: ['', Validators.required],
    });


  // this.playSound.playDesafios()

  }



  retiraMoedas(){
   this.auth.decreseToken(300)
  }
  colocarMoedas(){
    this.auth.updateLocalUserData({tokens: 300})
  }


  checkLevelUp(newExp: number): void {
    this.auth.checkLevelUp(newExp);
    this.auth.getExpPercentage();
  }



  userChoice(choice: string) {
    this.playSound.playCleanNavigationSound()
    this.playSound.stopAudio();
    this.userChoiceStatus = choice;

    if (this.userChoiceStatus == "listening"){
      this.playSound.playDesafiosListening()
      // limpa configurações
      this.calculatedPoints = 0;
      this.selectedDifficulty = ''
      this.formulario.get('mainTheme')?.reset();
    }

    if (this.userChoiceStatus == "writing"){

      // se ja tocou não ficar tocando novamente.... ? nao sei ainda acho que depois de fazer exercicios não
      this.playSound.playDesafiosWriting()
      // limpa configurações
      this.calculatedPoints = 0;
      this.selectedDifficulty = ''
      this.teaxtareaWriting.get('userText')?.reset();
    }

    if (this.userChoiceStatus == "reading"){
      this.playSound.playDesafiosReading()
      // limpa configurações
      this.calculatedPoints = 0;
      this.selectedDifficulty = ''
    }

  }





  exerciseText: string = '';
  exerciseWriting: string = '';
  exerciseReading: string = '';
  isLoading: boolean = false;



  options = [
    { text: "A) Loading...", right: false },
    { text: "B) Loading...", right: true },
    { text: "C) Loading...", right: false },
    { text: "D) Loading...", right: false }
  ];

  selectedOption: number | null = null;


  selectOption(index: number): void {
    this.playSound.playNotification();
    this.selectedOption = index;
  }


  gerarExercicio(type: string) {


    if(  this.auth.getUserTokens() >= 100){

    this.auth.decreseToken(100);



    if(this.selectedDifficulty == "hard"){
      this.auth.updateMetaUser({ meta8: true });
    }

    this.playSound.stopAudio();
    this.isLoading = true;

    if (type === 'listening') {
      this.auth.updateMetaUser({ meta1: true });
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
      this.auth.updateMetaUser({ meta2: true });
      this.apiService.getTema(this.selectedDifficulty).subscribe(response => {
            this.playSound.playNotification();
            this.exerciseWriting = response.text;
            this.isLoading = false;
            this.userChoiceStatus = "writing_exercise";

      });

    }

    if (type === 'reading') {
      this.auth.updateMetaUser({ meta3: true });
      this.apiService.getLongText(this.selectedDifficulty).subscribe(response1 => {
        this.playSound.playNotification();
        this.exerciseReading = response1.text;
        this.isLoading = false;
        this.userChoiceStatus = "reading_exercise";

        this.apiService.GPT(this.exerciseReading, "", "ReadingGenerateExerciseOptions").subscribe(response => {
          console.log('Resposta bruta da API:', response); // 🔍 Debug

          try {
            // Primeiro parse
            const parsedResponse = JSON.parse(response);

            // Segundo parse (pois `parsedResponse.response` ainda pode ser uma string JSON)
            const finalData = JSON.parse(parsedResponse.response);

            console.log('JSON final parseado:', finalData); // Debug do JSON correto

            // Atribuindo as opções geradas pela API à variável options
            this.options = finalData.options;

          } catch (error) {
            console.error('Erro ao fazer o parse da resposta JSON:', error);
          }
        });





      });
    }



    }else{
      this.auth.checkTokens()
      this.playSound.playTokenZero()
      this.showFailMessage = true;
      setTimeout(() => {
        this.showFailMessage = false;
      }, 3000);


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
         this.checkAnswer(true, "listening")
      }

      if (this.listeningExerciseGPTresponse == "False" || this.listeningExerciseGPTresponse == "false"){
        this.hideMainPage = true;
        this.checkAnswer(false, "listening")
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
  bonusXP_writing: number = 0;
  writing_lingoEXP_final: number = 0;


  verifyWritingExercise() {
    this.isLoading = true;
    const textoUser = this.teaxtareaWriting.get("userText")?.value + "";

    this.playSound.playCleanNavigationSound()




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


        // DANDO OS PONTOS
         switch (this.selectedDifficulty){
           case "easy":
             this.bonusXP_writing = 1000;
           break;
           case "medium":
             this.bonusXP_writing = 2000;
             break;
           case "hard":
             this.bonusXP_writing = 3000;
             break;
           default:
             this.bonusXP_writing = 0;
             break;
         }

        this.writing_lingoEXP_final = Number(this.bonusXP_writing) + Number(this.writingFinalScore);


          this.checkLevelUp(this.writing_lingoEXP_final)

        this.isLoading = false;


      } catch (error) {
        console.error('Erro ao fazer o parse da resposta JSON:', error);
      }

    });


  }














  isCorrectAnswer: boolean = false;
  isWrongAnswer: boolean = false;
  continueButton: string = "";

  isCorrect: boolean | null = null; // Para armazenar o resultado da correção
  showFailMessage: any;

  checkAnswerReadingExercise(): void {
    if (this.selectedOption !== null) {
      const isCorrect = this.options[this.selectedOption].right;
      this.checkAnswer(isCorrect, "reading")
    }
  }



  checkAnswer(isCorrect: boolean, type: string) {


    if (isCorrect) {


      if (this.userChoiceStatus == "reading_exercise"){
        switch (this.selectedDifficulty){
          case "easy":
            this.calculatedPoints = 4000;
            this.checkLevelUp(this.calculatedPoints)
            break;
          case "medium":
            this.calculatedPoints = 6000;
            this.checkLevelUp(this.calculatedPoints)
            break;
          case "hard":
            this.calculatedPoints = 8000;
            this.checkLevelUp(this.calculatedPoints)
            break;
          default:
            this.calculatedPoints = 0;
            break;
        }

      }


        if (this.calculatedPoints){
            this.checkLevelUp(this.calculatedPoints)
        }


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
    if (this.userChoiceStatus == "writing_feedback"){
      this.userChoiceStatus = "writing"

    }
    if(this.userChoiceStatus == "listening_exercise"){
      this.isCorrectAnswer = false;
      this.isWrongAnswer = false;
      this.hideMainPage = false;
      this.userChoiceStatus = "listening"
    }

    if (this.userChoiceStatus == "reading_exercise"){
      this.isCorrectAnswer = false;
      this.isWrongAnswer = false;
      this.hideMainPage = false;
      this.userChoiceStatus = "reading"
      this.selectedOption = null
      this.options = [
        { text: "A) Loading...", right: false },
        { text: "B) Loading...", right: true },
        { text: "C) Loading...", right: false },
        { text: "D) Loading...", right: false }
      ]


    }



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


  onMouseEnter() {
    this.playSound.playCleanSound();
  }

}

