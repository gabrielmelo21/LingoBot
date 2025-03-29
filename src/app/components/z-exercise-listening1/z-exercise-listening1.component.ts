import {Component, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {TrilhaService} from "../../services/trilha.service";
import {AuthService} from "../../services/auth.service";
import {PlaySoundService} from "../../services/play-sound.service";
import {MainAPIService} from "../../services/main-api.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-z-exercise-listening1',
  templateUrl: './z-exercise-listening1.component.html',
  styleUrls: ['./z-exercise-listening1.component.css']
})
export class ZExerciseListening1Component implements OnInit {


  /**
   *  LEMBRETE
   *   conforme o level da trilha aumenta, deve aumentar o tamanho das sentences pra 2,3,4,5....
   *   a dificuldade do texto, com mais expressões
   *   quantidade minima de exercicios para ir para proxima etapa, no level 1 é 3, no level 10 pode ser 5 e aumente.
   *
   *
   */

  round_step1 = 0;
  rounds_needed = 3;
  trilhaSubscription!: Subscription;



  ngOnInit(): void {
    // Se inscreve no observable para atualizar automaticamente
    this.trilhaSubscription = this.trilhaService.trilha$.subscribe((trilha) => {
      if (trilha) {
        this.round_step1 = trilha.rounds_step1;

        // Se rounds_step1 atingiu 3, atualiza step1 automaticamente
        if (this.round_step1 >= 3 && !trilha.step1) {
          this.trilhaService.updateTrilhaData({ step1: true });
        }
      }
    });
  }



  userChoiceStatus: string = "listening";


  formulario: FormGroup;
  formulario2: FormGroup;
  audioUrl: string | null = null;
  isPlaying: boolean = false;
  audioElement: HTMLAudioElement | null = null;
  exerciseText: string = '';
  isLoading: boolean = false;
  isLoading2: boolean = false;
  listeningExerciseGPTresponse: any;
  showSuccessMessage = false;
  showFailMessage: boolean = false;
  disableResponseButtons: boolean = true;







  constructor(
    protected trilhaService: TrilhaService,
    private auth: AuthService,
    private formBuilder: FormBuilder,
    private playSound: PlaySoundService,
    private apiService: MainAPIService,
    private router: Router) {
    window.scrollTo(0, 0);


    this.formulario = this.formBuilder.group({
      mainTheme: ['', Validators.required],
    });


    this.formulario2 = this.formBuilder.group({
      userResponse: ['', Validators.required],
    });



  }



  enviarTema() {
    if (this.formulario.valid) {
      this.isLoading = true;
      this.userChoiceStatus = "listening_exercise";
      const temaDoUsuario = this.formulario.controls['mainTheme'].value;
      console.log("Tema escolhido:", temaDoUsuario);

      this.apiService.GPT(temaDoUsuario, "", "ListeningExerciseStep1").subscribe(response => {
        try {
          // Fazendo o parse da string JSON
          const parsedResponse = JSON.parse(response);

          // Acessando a resposta gerada pelo GPT
          this.exerciseText = parsedResponse.response;
          console.log("Texto gerado:", this.exerciseText);

          // Chamando o TTS (Text-to-Speech) após receber a resposta
          this.getAudioTTS(this.exerciseText);
        } catch (error) {
          this.isLoading = false;
          console.error("Erro ao fazer o parse da resposta:", error);
        }
      });
    } else {
      console.warn("Preencha o campo corretamente!");
    }
  }

  getAudioTTS(texto: string) {
    this.apiService.getTTS(texto).subscribe(audioBlob => {
      try {
        this.audioUrl = URL.createObjectURL(audioBlob);
        console.log("Áudio gerado com sucesso!");
        this.playAudio();
        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
        console.error("Erro ao processar o áudio:", error);
      }
    });
  }





  exibirFormulario: boolean = false;

  selecionarTema(escolhaTema: boolean) {
    this.playSound.playCleanSound()


    if (escolhaTema) {
      this.exibirFormulario = true; // Mostra o input para escolher o tema
    } else {
      this.exibirFormulario = false; // Tema aleatório

      //carregar tema aleatorio = request nos textos aleatorios que temos

      this.apiService.getText("medium").subscribe(response => {
        this.exerciseText = response.text;
        this.userChoiceStatus = "listening_exercise";
        this.getAudioTTS(this.exerciseText)
      });

    }
  }







  playCount: number = 0;


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


  enviarResposta(): void {
    this.isLoading2 = true;
    if (this.formulario2.valid) {
      this.disableResponseButtons = false;

      const userResponse = this.formulario2.value.userResponse;
      console.log('Resposta do usuário:', userResponse);



      this.apiService.GPT(this.exerciseText, userResponse, "ListeningChecking").subscribe(response => {
        try {
          // Fazendo o parse da string JSON
          const parsedResponse = JSON.parse(response);

          // Agora você pode acessar parsedResponse.response
          this.listeningExerciseGPTresponse = parsedResponse.response;

          // Exibe o valor que você quer
          console.log('Resposta da API: ' + this.listeningExerciseGPTresponse);

          this.isLoading2 = false;

        } catch (error) {
          this.isLoading2 = false;
          console.log('Erro ao fazer o parse da resposta: ' + error);
        }


        if (this.listeningExerciseGPTresponse == "True" || this.listeningExerciseGPTresponse == "true"){
          this.playSound.playWin2()
          this.auth.checkLevelUp(3000)

          this.auth.updateLocalUserData({listening: 3000})

          this.showSuccessMessage = true; // Exibe a mensagem de sucesso

          this.trilhaService.updateTrilhaData({ rounds_step1: 1 });

          setTimeout(() => {
            this.formulario.reset();
            this.formulario2.reset();
            this.disableResponseButtons = true;
            this.playCount = 0;
            this.showSuccessMessage = false;
            this.userChoiceStatus = "listening";
            this.playSound.playCleanSound2()
          }, 3000);

        }

        if (this.listeningExerciseGPTresponse == "False" || this.listeningExerciseGPTresponse == "false"){
          this.playSound.playErrorQuestion()
          this.showFailMessage = true; // Exibe a mensagem



          setTimeout(() => {
            this.formulario.reset();
            this.formulario2.reset();
            this.playCount = 0;
            this. disableResponseButtons = true;
            this.showFailMessage = false; // Oculta após 3 segundos
            this.userChoiceStatus = "listening";
            this.playSound.playCleanSound2()
          }, 3000);

        }



      });


      // Aqui você pode fazer a lógica para enviar a resposta ou processar o que for necessário
    } else {
      console.log('Por favor, preencha a resposta.');
    }
  }












  voltar() {
    this.router.navigate(["/trilha-active"]);
  }

  userChoice(listening: string) {

  }


}
