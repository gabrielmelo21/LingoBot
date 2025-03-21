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
  selector: 'app-step3-free',
  templateUrl: './step3-free.component.html',
  styleUrls: ['./step3-free.component.css']
})
export class Step3FreeComponent implements OnInit {
  respostaCorreta: any;


  constructor(private apiService: MainAPIService,
              private router: Router,
              private  playSound: PlaySoundService,
              private auth: AuthService,
              protected trilhaService: TrilhaService,
  ) {
    window.scrollTo(0, 0); // Faz o scroll para o topo ao carregar o componente
  }


/**
  desafios: Desafio[] = [
    { ingles: "Break a leg", portugues: "Boa sorte" },
    { ingles: "Hit the sack", portugues: "Ir dormir" },
    { ingles: "Let the cat out of the bag", portugues: "Deixar escapar um segredo" },
    { ingles: "Bite the bullet", portugues: "Enfrentar uma situação difícil" },
    { ingles: "Burn the midnight oil", portugues: "Virar a noite estudando ou trabalhando" },
    { ingles: "Spill the beans", portugues: "Revelar um segredo" },
    { ingles: "Under the weather", portugues: "Estar doente" },
    { ingles: "Cut to the chase", portugues: "Ir direto ao ponto" },
    { ingles: "Costs an arm and a leg", portugues: "Custar os olhos da cara" },
    { ingles: "Piece of cake", portugues: "Muito fácil" }
  ];
**/


desafios: Desafio[] = [
  { ingles: "What's up?", portugues: "E aí?" },
  { ingles: "No big deal", portugues: "Nada demais" },
  { ingles: "Piece of cake", portugues: "Moleza" },
  { ingles: "Chill out", portugues: "Relaxa" },
  { ingles: "Bail", portugues: "Dar o fora" },
  { ingles: "Throw shade", portugues: "Falar mal de alguém" },
  { ingles: "Slay", portugues: "Mandar muito bem" },
  { ingles: "GOAT (Greatest of All Time)", portugues: "O melhor de todos os tempos" },
  { ingles: "Salty", portugues: "Estar ressentido ou irritado" },
  { ingles: "Flex", portugues: "Se exibir" }
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
      this.auth.checkLevelUp(750);
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




















  selectExerciseType(b: string){
    this.playSound.playCleanSound();
    this.userChoiceStatus =  b;

    if(this.userChoiceStatus == 'conversation'){
      this.novoDesafio();
    }
    if (this.userChoiceStatus == "multi-choice"){
      this.novaQuestao();
    }
  }









  userChoiceStatus: string = '';
  opcaoSelecionada: string | null = null;

  selecionarOpcao(opcao: string) {
    this.playSound.playNotification()
    this.opcaoSelecionada = opcao;
  }



  palavraPrincipal: string = '';
  opcoes: string[] = [];
  isIngles: boolean = false;
  respostaCorreta2: string = ''; // Renomeando para "respostaCorreta"

  novaQuestao(): void {
    const desafio = this.sorteiaDesafio();
    this.palavraPrincipal = desafio.palavraPrincipal;
    this.isIngles = desafio.isIngles;
    this.opcoes = desafio.opcoes;
    this.respostaCorreta2 = this.isIngles ? desafio.portugues : desafio.ingles; // Correção para garantir a tradução correta
  }

  sorteiaDesafio(): {
    ingles: string;
    portugues: string;
    palavraPrincipal: string;
    isIngles: boolean;
    opcoes: string[];
  } {
    const desafio = this.desafios[Math.floor(Math.random() * this.desafios.length)];
    const isIngles = Math.random() < 0.5;
    const palavraPrincipal = isIngles ? desafio.ingles : desafio.portugues;
    const opcoes = this.geraOpcoes(palavraPrincipal, isIngles, desafio);

    return { ingles: desafio.ingles, portugues: desafio.portugues, palavraPrincipal, isIngles, opcoes };
  }

  private geraOpcoes(palavraPrincipal: string, isIngles: boolean, desafio: Desafio): string[] {
    // Se a palavra principal for em inglês, as opções precisam ser em português
    const opcoesErradas = this.desafios
      .filter(d => (isIngles ? d.portugues : d.ingles) !== palavraPrincipal)
      .map(d => (isIngles ? d.portugues : d.ingles));

    // Seleciona aleatoriamente 3 opções erradas
    const opcoesSelecionadas = this.embaralha(opcoesErradas).slice(0, 3);

    // Adiciona a resposta correta (sempre no idioma oposto)
    const respostaCorreta = isIngles ? desafio.portugues : desafio.ingles;
    opcoesSelecionadas.push(respostaCorreta);

    // Embaralha as opções finais
    return this.embaralha(opcoesSelecionadas);
  }

  private embaralha(array: string[]): string[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // Troca de lugar
    }
    return array;
  }

  verificarResposta2(resposta: string | null): void {
    if (resposta === this.respostaCorreta2) {

      this.auth.checkLevelUp(500);
      this.trilhaService.updateTrilhaData({ rounds_step3: 1 });
      this.playSound.playWin2();
      this.showSuccessMessage = true;

      setTimeout(() => {
        this.showSuccessMessage = false;
        this.novaQuestao();
      }, 3000);


    } else {
      this.playSound.playErrorQuestion();
      this.showFailMessage = true;
      setTimeout(() => {
        this.showFailMessage = false;
        this.novaQuestao();
      }, 3000);
    }

  }




}
