import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {TrilhaService} from "../../services/trilha.service";
import {PlaySoundService} from "../../services/play-sound.service";
import {MainAPIService} from "../../services/main-api.service";
import {Route, Router} from "@angular/router";

@Component({
  selector: 'app-step2',
  templateUrl: './step2.component.html',
  styleUrls: ['./step2.component.css']
})
export class Step2Component {
  formulario: FormGroup;
  perguntasGeradas: any = {}; // Armazena as perguntas geradas
  respostasUsuario: any = []; // Lista que salvará as perguntas e respostas do usuário
  indicePerguntaAtual: number = 1; // Começamos na primeira pergunta
  isLoading: boolean = false;
  perguntaAtual: string = ""; // Armazena a pergunta a ser exibida
   feedbackUsuario: any;


  constructor(private formBuilder: FormBuilder,
              private trilhaService: TrilhaService,
              private playSound: PlaySoundService,
              private apiService: MainAPIService,
              private router: Router) {
    window.scrollTo(0, 0);
 //   this.playSound. playConversationBegin()

    this.formulario = this.formBuilder.group({
      mainTheme: ['', Validators.required], // Campo do tema
      respostaUsuario: [''] // Resposta do usuário
    });


  }




  // Chamando o TTS (Text-to-Speech) após receber a resposta
  // this.getAudioTTS(this.exerciseText);





  enviarResposta() {
    this.playSound.playCleanSound2()
    if (this.indicePerguntaAtual === 1) {
      // Gera perguntas no primeiro envio
      this.gerarPerguntas();
    } else {
      // Salva resposta e avança para próxima pergunta
      this.salvarRespostaEAvancar();
    }
  }




  gerarPerguntas() {
    if (this.formulario.valid) {
      this.isLoading = true;
      const assuntoDoUsuario = this.formulario.controls['mainTheme'].value;
      console.log("Assunto escolhido:", assuntoDoUsuario);

      this.apiService.GPT(assuntoDoUsuario, "", "ConversationExerciseStep2").subscribe(response => {
        try {
          console.log("Resposta bruta da API:", response);

          const parsedResponse = JSON.parse(response);
          const finalData = JSON.parse(parsedResponse.response);

          this.perguntasGeradas = finalData.questions;
          this.indicePerguntaAtual++;
          this.perguntaAtual = this.perguntasGeradas.quest1; // Exibe a primeira pergunta
          this.getAudioTTS(this.perguntaAtual)
          this.isLoading = false;
          this.formulario.reset(); // Reseta o campo de entrada

          console.log("Perguntas geradas:", this.perguntasGeradas);
        } catch (error) {
          this.isLoading = false;
          console.error("Erro ao fazer o parse da resposta JSON:", error);
        }
      });
    }
  }


  salvarRespostaEAvancar() {
    if (this.formulario.controls['respostaUsuario'].valid) {
      const respostaUsuario = this.formulario.controls['respostaUsuario'].value;

      // Salva a pergunta e a resposta em um formato mais organizado
      this.respostasUsuario.push({
        quest: this.perguntaAtual,
        userResp: respostaUsuario
      });

      console.log("Respostas até agora:", this.respostasUsuario);

      // Avança para a próxima pergunta
      this.indicePerguntaAtual++;

      // Se ainda houver perguntas, exibe a próxima
      if (this.indicePerguntaAtual <= 5) {
        this.perguntaAtual = this.perguntasGeradas[`quest${this.indicePerguntaAtual}`];
        this.formulario.controls['respostaUsuario'].reset(); // Limpa o campo de resposta
        this.getAudioTTS(this.perguntaAtual);
      } else {
        this.gerarAvaliacao();
        console.log("Todas as perguntas foram respondidas!", this.respostasUsuario);
        // Aqui você pode processar as respostas ou gerar um relatório
      }
    }
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

          this.trilhaService.updateTrilhaData({ step2: true });


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



  voltar() {
    this.playSound.playCleanSound2()
    this.router.navigate(["/trilha-active"]);
  }







}
