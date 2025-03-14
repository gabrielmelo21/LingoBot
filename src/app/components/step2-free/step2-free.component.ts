import {Component, OnInit} from '@angular/core';
import {MainAPIService} from "../../services/main-api.service";
import {Router} from "@angular/router";
import {PlaySoundService} from "../../services/play-sound.service";
import {AuthService} from "../../services/auth.service";
import {TrilhaService} from "../../services/trilha.service";
import {Subscription} from "rxjs";



interface Desafio {
  ingles: string;
  portugues: string;
}



@Component({
  selector: 'app-step2-free',
  templateUrl: './step2-free.component.html',
  styleUrls: ['./step2-free.component.css']
})
export class Step2FreeComponent implements OnInit {
  respostaCorreta: any;


  constructor(private apiService: MainAPIService,
              private router: Router,
              private  playSound: PlaySoundService,
              private auth: AuthService,
              protected trilhaService: TrilhaService,
  ) {
    window.scrollTo(0, 0); // Faz o scroll para o topo ao carregar o componente
  }




  desafios: Desafio[] = [
    // Entradas existentes mantidas
    { ingles: 'give up', portugues: 'desistir' },
    { ingles: 'look after', portugues: 'cuidar' }, // [[1]][[2]][[7]]
    { ingles: 'put off', portugues: 'adiar' },
    { ingles: 'run into', portugues: 'encontrar' },
    { ingles: 'turn down', portugues: 'recusar' },
    { ingles: 'carry on', portugues: 'continuar' },
    { ingles: 'get along', portugues: 'conviver' },
    { ingles: 'find out', portugues: 'descobrir' },
    { ingles: 'break down', portugues: 'quebrar' },
    { ingles: 'set up', portugues: 'configurar' },
    { ingles: 'bring up', portugues: 'mencionar' },
    { ingles: 'call off', portugues: 'cancelar' },
    { ingles: 'check out', portugues: 'verificar' },
    { ingles: 'come across', portugues: 'achar' },
    { ingles: 'come up with', portugues: 'sugerir' },
    { ingles: 'cut down on', portugues: 'reduzir' },
    { ingles: 'drop out', portugues: 'abandonar' },
    { ingles: 'end up', portugues: 'acabar' },
    { ingles: 'figure out', portugues: 'entender' },
    { ingles: 'get rid of', portugues: 'livrar-se' },
    { ingles: 'give in', portugues: 'ceder' },
    { ingles: 'go after', portugues: 'perseguir' },
    { ingles: 'go over', portugues: 'revisar' },
    { ingles: 'hold on', portugues: 'esperar' },
    { ingles: 'keep up', portugues: 'manter' },
    { ingles: 'let down', portugues: 'decepcionar' },
    { ingles: 'look forward to', portugues: 'aguardar' },
    { ingles: 'make up', portugues: 'inventar' },
    { ingles: 'pass out', portugues: 'desmaiar' },
    { ingles: 'pick up', portugues: 'pegar' },
    { ingles: 'point out', portugues: 'destacar' },
    { ingles: 'put up with', portugues: 'tolerar' },
    { ingles: 'run out of', portugues: 'esgotar' },
    { ingles: 'show up', portugues: 'aparecer' },
    { ingles: 'take after', portugues: 'parecer' },
    { ingles: 'take over', portugues: 'assumir' },
    { ingles: 'throw away', portugues: 'jogar fora' },
    { ingles: 'turn up', portugues: 'aumentar' },
    { ingles: 'work out', portugues: 'resolver' },

    // Novas entradas adicionadas
    { ingles: 'look up', portugues: 'procurar' }, // Buscar informação [[3]]
    { ingles: 'take off', portugues: 'tirar' }, // Remover (ex.: roupa) ou "descolar" (avião)
    { ingles: 'look into', portugues: 'investigar' },
    { ingles: 'hand in', portugues: 'entregar' }, // Ex.: entregar trabalho
    { ingles: 'fill out', portugues: 'preencher' }, // Preencher formulário
    { ingles: 'look out', portugues: 'cuidado' }, // Aviso de perigo
    { ingles: 'wake up', portugues: 'acordar' },
    { ingles: 'log in', portugues: 'entrar' }, // Em sistemas
    { ingles: 'sign up', portugues: 'inscrever-se' },
    { ingles: 'back up', portugues: 'fazer backup' },
    { ingles: 'turn off', portugues: 'desligar' },
    { ingles: 'turn on', portugues: 'ligar' },
    { ingles: 'put on', portugues: 'colocar' }, // Ex.: roupa
    { ingles: 'take out', portugues: 'tirar' }, // Ex.: extrair algo
    { ingles: 'look down on', portugues: 'desprezar' }
  ];




  desafioAtual!: Desafio;
  respostaUsuario: string = '';
  showSuccessMessage = false;
  showFailMessage = false;
  traduzirParaIngles = true;







  round_step3 = 0;
  rounds_needed = 10;
  trilhaSubscription!: Subscription;

  ngOnInit() {
    this.novoDesafio();

    // Se inscreve no observable para atualizar automaticamente
    this.trilhaSubscription = this.trilhaService.trilha$.subscribe((trilha) => {
      if (trilha) {
        this.round_step3 = trilha.rounds_step3;

        // Se rounds_step1 atingiu 3, atualiza step1 automaticamente
        if (this.round_step3 == 10 && !trilha.step3) {
          this.trilhaService.updateTrilhaData({ step3: true });
        }
      }
    });

  }

  novoDesafio() {
    this.desafioAtual = this.desafios[Math.floor(Math.random() * this.desafios.length)];
    this.traduzirParaIngles = Math.random() > 0.5;
    this.respostaUsuario = '';
    this.showSuccessMessage = false;
    this.showFailMessage = false;

    // Se for um desafio de inglês para português, chama o TTS com o texto em inglês
    if (!this.traduzirParaIngles) {
      this.getAudioTTS(this.desafioAtual.ingles);
    }
  }


  verificarResposta() {

    const normalizarTexto = (texto: string): string => {
      return texto
        .toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Remove acentos
        .trim();
    };

    // Expande contrações para suas formas completas
    const expandirContracoes = (texto: string): string => {
      return texto
        .replace(/he's/g, "he is")
        .replace(/it's/g, "it is")
        .replace(/I'm/g, "I am")
        .replace(/i'm/g, "I am")
        .replace(/you're/g, "you are")
        .replace(/they're/g, "they are")
        .replace(/we're/g, "we are")
        .replace(/what's/g, "what is")
        .replace(/don't/g, "do not")
        .replace(/doesn't/g, "does not")
        .replace(/didn't/g, "did not")
        .replace(/can't/g, "cannot")
        .replace(/won't/g, "will not");
    };

    // Contrai formas completas para contrações comuns
    const contrairExpansoes = (texto: string): string => {
      return texto
        .replace(/he is/g, "he's")
        .replace(/it is/g, "it's")
        .replace(/I am/g, "I'm")
        .replace(/i am/g, "I'm")
        .replace(/you are/g, "you're")
        .replace(/they are/g, "they're")
        .replace(/we are/g, "we're")
        .replace(/what is/g, "what's")
        .replace(/do not/g, "don't")
        .replace(/does not/g, "doesn't")
        .replace(/did not/g, "didn't")
        .replace(/cannot/g, "can't")
        .replace(/will not/g, "won't");
    };

    const respostaCorretaOriginal = this.traduzirParaIngles ? this.desafioAtual.ingles : this.desafioAtual.portugues;
    const respostaDigitada = this.respostaUsuario;

    const respostaNormalizada = normalizarTexto(respostaCorretaOriginal);
    const respostaExpandida = normalizarTexto(expandirContracoes(respostaCorretaOriginal));
    const respostaContraida = normalizarTexto(contrairExpansoes(respostaCorretaOriginal));
    const respostaUsuarioNormalizada = normalizarTexto(respostaDigitada);

    if (
      respostaUsuarioNormalizada === respostaNormalizada ||
      respostaUsuarioNormalizada === respostaExpandida ||
      respostaUsuarioNormalizada === respostaContraida
    ) {
      this.auth.checkLevelUp(500);
      this.trilhaService.updateTrilhaData({ rounds_step3: 1 });
      this.playSound.playWin2();
      this.showSuccessMessage = true;

      setTimeout(() => {
        this.showSuccessMessage = false;
        this.novoDesafio();
      }, 3000);
    } else {
      this.playSound.playErrorQuestion();
      this.showFailMessage = true;
      this.respostaCorreta = this.desafioAtual[this.traduzirParaIngles ? 'ingles' : 'portugues']; // Mostra a resposta correta

      setTimeout(() => {
        this.showFailMessage = false;
      }, 3000);
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
      } catch (error) {
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





  navigate_to() {
    this.playSound.playCleanSound()
    this.router.navigate(['/trilha-active']);
  }

}
