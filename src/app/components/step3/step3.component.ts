import {Component, OnInit} from '@angular/core';
import {MainAPIService} from "../../services/main-api.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {PlaySoundService} from "../../services/play-sound.service";
import {AuthService} from "../../services/auth.service";
import {Subscription} from "rxjs";
import {TrilhaService} from "../../services/trilha.service";
import {Router} from "@angular/router";


interface ConversationExercise {
  asking: string;
  expected_answer: string;
}

interface Theme {
  id: number;
  theme: string;
  useful_phrases: string[];
  conversation_exercise: ConversationExercise[];
}


@Component({
  selector: 'app-step3',
  templateUrl: './step3.component.html',
  styleUrls: ['./step3.component.css']
})
export class Step3Component implements OnInit {
  temas: Theme[] = [];
  temaAtual: Theme | null = null;
  isLoading: boolean = false;
  temaSelecionado: any;

  formulario: FormGroup;
  userChoice: string = '';
  feedbackUsuario: any;


  // Variáveis para controlar as perguntas e as dicas
  indicePerguntaAtual: number = 0;  // Índice da pergunta atual
  perguntaAtual: string = '';       // Pergunta que será exibida
  dicasAtuais: string = '';         // Dica relacionada à pergunta (expected_answer)
  respostasUsuario: any = []; // Lista que salvará as perguntas e respostas do usuário

  testeTamanhoDaConversa: any;

  constructor(
              private formBuilder: FormBuilder,
              private apiService: MainAPIService,
              private playSound: PlaySoundService,
              private auth: AuthService,
              protected trilhaService: TrilhaService,
              private router: Router
              ) {
    window.scrollTo(0, 0);

    this.formulario = this.formBuilder.group({
      mainTheme: ['', Validators.required], // Campo do tema
      respostaUsuario: [''] // Resposta do usuário
    });



  }


  round_step3 = 0;
  rounds_needed = 3;
  trilhaSubscription!: Subscription;

  ngOnInit(): void {
    this.carregarTemas();


    // Se inscreve no observable para atualizar automaticamente
    this.trilhaSubscription = this.trilhaService.trilha$.subscribe((trilha) => {
      if (trilha) {
        this.round_step3 = trilha.rounds_step3;

        // Se rounds_step1 atingiu 3, atualiza step1 automaticamente
        if (this.round_step3 >= 3 && !trilha.step3) {
          this.trilhaService.updateTrilhaData({ step3: true });
          setTimeout( () => {
               this.router.navigate(["/trilha-active"])
          }, 2000)
        }
      }
    });
  }








  carregarTemas(): void {
    this.isLoading = true;
    this.apiService.getTemas().subscribe((data: Theme[]) => {
      this.temas = data;
      this.isLoading = false;
    });
  }

  // Seleciona um tema e carrega as perguntas do exercício
  selecionarTema(id: number): void {
    window.scrollTo(0, 0);
    this.playSound.playCleanSound2()
    this.isLoading = true;
    this.userChoice = 'lingobot-teaching';  // Muda para a visão de "ensino"
    this.temaAtual = this.temas.find(tema => tema.id === id) || null;
    this.isLoading = false;
    if (this.temaAtual) {
      this.carregarPerguntaAtual();
    }
  }

  // Carrega a primeira pergunta e dica do exercício
  carregarPerguntaAtual(): void {
    if (this.temaAtual && this.temaAtual.conversation_exercise.length > 0) {
      const pergunta = this.temaAtual.conversation_exercise[this.indicePerguntaAtual];
      this.perguntaAtual = pergunta.asking;
      this.dicasAtuais = pergunta.expected_answer;

    }
  }

  // Avançar para a próxima pergunta
  proximaPergunta(): void {
    if (this.temaAtual && this.indicePerguntaAtual < this.temaAtual.conversation_exercise.length - 1) {
      this.indicePerguntaAtual++;
      this.carregarPerguntaAtual();
      this.getAudioTTS(this.perguntaAtual);
    } else {
       //this.gerarAvaliacao()
       this.playSound.playWin2()
       this.auth.checkLevelUp(3000)
       this.userChoice = 'congrats';
    }
  }

  voltarTema() {
    this.userChoice = ''; // Retorna para a lista de temas
  }

  praticar() {
    this.playSound.playCleanSound2()
    window.scrollTo(0, 0);
    this.userChoice = 'lingobot-pratica';


    this.getAudioTTS(this.perguntaAtual);

  }

  enviarResposta() {

    if (this.formulario.controls['respostaUsuario'].valid
      && this.formulario.controls['respostaUsuario'].value!==''
      && this.formulario.controls['respostaUsuario'].value !== null) {

      this.playSound.playCleanSound2()
      const respostaUsuario = this.formulario.controls['respostaUsuario'].value;


      // Salva a pergunta e a resposta em um formato mais organizado
      this.respostasUsuario.push({
        quest: this.perguntaAtual,
        userResp: respostaUsuario
      });

      console.log("Respostas até agora:", this.respostasUsuario);

      this.proximaPergunta();

      this.formulario.controls['respostaUsuario'].reset(); // Limpa o campo de resposta

    }else{
       this.playSound.playErrorQuestion()
    }


  }





  audioUrl: string | null = null;
  isPlaying: boolean = false;
  audioElement: HTMLAudioElement | null = null;

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






  hideForm: boolean = false;
  gerarAvaliacao() {
    this.playSound.playNotification()

    this.isLoading = true;
    this.perguntaAtual = "Espere um pouco, estou fazendo sua avaliação...";
    this.hideForm = true;

// 🔹 Converte as respostas para um formato de texto organizado
    const respostasUsuarioTexto = this.respostasUsuario.map((res: { quest: string; userResp: string }, index: number) =>
      `Pergunta ${index + 1}: ${res.quest}\nResposta ${index + 1}: ${res.userResp}`
    ).join("\n\n");

    console.log("Respostas do usuario -> ", respostasUsuarioTexto);

    // 🔹 Envia para o ChatGPT a avaliação do inglês
    this.apiService.GPT(respostasUsuarioTexto, "", "ConversationExerciseStep2_avaliation")
      .subscribe(response => {
        try {
          console.log("Resposta bruta da IA:", response);

          // Primeiro parse do JSON recebido
          const parsedResponse = JSON.parse(response);

          // Segundo parse para garantir que a estrutura está correta
          const avaliacaoFinal = JSON.parse(parsedResponse.response);
          this.perguntaAtual = ''


          //trilha step2 = true

          //this.trilhaService.updateTrilhaData({ step2: true });


          console.log("Avaliação final:", avaliacaoFinal);

          // 🔹 Armazena os dados processados na variável para exibição no HTML
          this.feedbackUsuario = avaliacaoFinal.respostas;



          this.isLoading = false; // Finaliza o loading
        } catch (error) {
          this.isLoading = false;
          console.error("Erro ao fazer o parse da resposta JSON:", error);
        }
      });


  }


  continuar() {
    this.trilhaService.updateTrilhaData({ rounds_step3: 1 });
    this.indicePerguntaAtual = 0;
    window.scrollTo(0, 0);
    this.userChoice = '';

  }

  voltar() {

  }
}
