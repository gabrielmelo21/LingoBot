import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {PlaySoundService} from "../../services/play-sound.service";
import {MainAPIService} from "../../services/main-api.service";
import {TrilhaService} from "../../services/trilha.service";
import {Subscription} from "rxjs";


interface Desafio {
  ingles: string;
  portugues: string;
}


@Component({
  selector: 'app-step1-free',
  templateUrl: './step1-free.component.html',
  styleUrls: ['./step1-free.component.css']
})
export class Step1FreeComponent implements OnInit {



  constructor(private apiService: MainAPIService,
              private router: Router,
              private  playSound: PlaySoundService,
              private auth: AuthService,
              protected trilhaService: TrilhaService,
              ) {
    window.scrollTo(0, 0); // Faz o scroll para o topo ao carregar o componente
  }




  desafios: Desafio[] = [

    { ingles: 'apple', portugues: 'maçã' },
    { ingles: 'dog', portugues: 'cachorro' },
    { ingles: 'house', portugues: 'casa' },
    { ingles: 'car', portugues: 'carro' },
    { ingles: 'book', portugues: 'livro' },
    { ingles: 'chair', portugues: 'cadeira' },
    { ingles: 'table', portugues: 'mesa' },
    { ingles: 'water', portugues: 'água' },
    { ingles: 'sun', portugues: 'sol' },
    { ingles: 'moon', portugues: 'lua' },
    { ingles: 'computer', portugues: 'computador' },
    { ingles: 'tree', portugues: 'árvore' },
    { ingles: 'flower', portugues: 'flor' },
    { ingles: 'school', portugues: 'escola' },
    { ingles: 'friend', portugues: 'amigo' },
    { ingles: 'city', portugues: 'cidade' },
    { ingles: 'country', portugues: 'país' },
    { ingles: 'food', portugues: 'comida' },
    { ingles: 'money', portugues: 'dinheiro' },
    { ingles: 'time', portugues: 'tempo' },
    { ingles: 'phone', portugues: 'telefone' },
    { ingles: 'family', portugues: 'família' },
    { ingles: 'job', portugues: 'trabalho' },
    { ingles: 'love', portugues: 'amor' },
    { ingles: 'happiness', portugues: 'felicidade' },

    // Expressões simples
    { ingles: 'Good morning', portugues: 'Bom dia' },
    { ingles: 'Good night', portugues: 'Boa noite' },
    { ingles: 'Thank you', portugues: 'Obrigado' },
    { ingles: 'You are welcome', portugues: 'De nada' },
    { ingles: 'Excuse me', portugues: 'Com licença' },
    { ingles: 'I am sorry', portugues: 'Desculpe' },
    { ingles: 'No problem', portugues: 'Sem problema' },
    { ingles: 'See you later', portugues: 'Até mais tarde' },
    { ingles: 'How are you?', portugues: 'Como você está?' },
    { ingles: 'I am fine', portugues: 'Eu estou bem' },
    { ingles: 'Take care', portugues: 'Cuide-se' },
    { ingles: 'What is this?', portugues: 'O que é isso?' },
    { ingles: 'I don’t understand', portugues: 'Eu não entendo' },
    { ingles: 'Can you help me?', portugues: 'Você pode me ajudar?' },
    { ingles: 'What do you mean?', portugues: 'O que você quer dizer?' },
    { ingles: 'I don’t know', portugues: 'Eu não sei' },
    { ingles: 'Nice to meet you', portugues: 'Prazer em conhecê-lo' },
    { ingles: 'What’s your name?', portugues: 'Qual é o seu nome?' },
    { ingles: 'Where do you live?', portugues: 'Onde você mora?' },
    { ingles: 'I live in Brazil', portugues: 'Eu moro no Brasil' },
    { ingles: 'Do you speak English?', portugues: 'Você fala inglês?' },
    { ingles: 'Yes, a little', portugues: 'Sim, um pouco' },
    { ingles: 'I am learning English', portugues: 'Eu estou aprendendo inglês' },
    { ingles: 'Can you repeat that?', portugues: 'Você pode repetir isso?' },
    { ingles: 'Please speak slowly', portugues: 'Por favor, fale devagar' },
    { ingles: 'I am lost', portugues: 'Estou perdido' },
    { ingles: 'Where is the restroom?', portugues: 'Onde é o banheiro?' },
    { ingles: 'How much is this?', portugues: 'Quanto custa isso?' },
    { ingles: 'Can I have the bill, please?', portugues: 'Posso ter a conta, por favor?' },
    { ingles: 'I am hungry', portugues: 'Estou com fome' },
    { ingles: 'I am thirsty', portugues: 'Estou com sede' },
    { ingles: 'I am tired', portugues: 'Estou cansado' },
    { ingles: 'I need a doctor', portugues: 'Eu preciso de um médico' },
    { ingles: 'It is an emergency', portugues: 'É uma emergência' },
    { ingles: 'Let’s go!', portugues: 'Vamos!' },
    { ingles: 'Hurry up!', portugues: 'Apresse-se!' },
    { ingles: 'Stop!', portugues: 'Pare!' },
    { ingles: 'Go straight', portugues: 'Siga em frente' },
    { ingles: 'Turn left', portugues: 'Vire à esquerda' },
    { ingles: 'Turn right', portugues: 'Vire à direita' },
    { ingles: 'What time is it?', portugues: 'Que horas são?' },
    { ingles: 'It is ten o’clock', portugues: 'São dez horas' },
    { ingles: 'I will be back soon', portugues: 'Eu voltarei em breve' },
    { ingles: 'I like it', portugues: 'Eu gosto disso' },
    { ingles: 'I don’t like it', portugues: 'Eu não gosto disso' },
    { ingles: 'That is interesting', portugues: 'Isso é interessante' },
    { ingles: 'That is funny', portugues: 'Isso é engraçado' },
    { ingles: 'I am cold', portugues: 'Estou com frio' },
    { ingles: 'I am hot', portugues: 'Estou com calor' },
    { ingles: 'What are you doing?', portugues: 'O que você está fazendo?' },
    { ingles: 'I am working', portugues: 'Eu estou trabalhando' },
    { ingles: 'I am watching TV', portugues: 'Estou assistindo TV' },
    { ingles: 'I am listening to music', portugues: 'Estou ouvindo música' },
    { ingles: 'Can I sit here?', portugues: 'Posso sentar aqui?' },
    { ingles: 'Where are you going?', portugues: 'Para onde você está indo?' },
    { ingles: 'I am going home', portugues: 'Estou indo para casa' },
    { ingles: 'Do you need help?', portugues: 'Você precisa de ajuda?' },
    { ingles: 'I have an idea', portugues: 'Eu tenho uma ideia' },
    { ingles: 'Be careful', portugues: 'Tenha cuidado' },
    { ingles: 'Don’t worry', portugues: 'Não se preocupe' },
    { ingles: 'Have a good day', portugues: 'Tenha um bom dia' },
  ];



  desafioAtual!: Desafio;
  respostaUsuario: string = '';
  showSuccessMessage = false;
  showFailMessage = false;
  traduzirParaIngles = true;







  round_step2 = 0;
  rounds_needed = 10;
  trilhaSubscription!: Subscription;

  ngOnInit() {


      // Se inscreve no observable para atualizar automaticamente
      this.trilhaSubscription = this.trilhaService.trilha$.subscribe((trilha) => {
        if (trilha) {
          this.round_step2 = trilha.rounds_step2;

          // Se rounds_step1 atingiu 3, atualiza step1 automaticamente
          if (this.round_step2 == 10 && !trilha.step2) {
            this.trilhaService.updateTrilhaData({ step2: true });
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
      this.trilhaService.updateTrilhaData({ rounds_step2: 1 });
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









  respostaCorreta: any;
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
      this.trilhaService.updateTrilhaData({ rounds_step2: 1 });
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
