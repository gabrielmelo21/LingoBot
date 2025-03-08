import {Component, OnInit} from '@angular/core';
import {PlaySoundService} from "../../services/play-sound.service";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
interface Desafio {
  ingles: string;
  portugues: string;
}

@Component({
  selector: 'app-desafios-iniciante',
  templateUrl: './desafios-iniciante.component.html',
  styleUrls: ['./desafios-iniciante.component.css']
})
export class DesafiosInicianteComponent implements OnInit {
  respostaCorreta: any;


  constructor(private router: Router, private  playSound: PlaySoundService, private auth: AuthService) {
  }


  desafios: Desafio[] = [
    // Palavras soltas (ampliado)
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


  ngOnInit() {
    this.novoDesafio();
  }

  novoDesafio() {

    this.desafioAtual = this.desafios[Math.floor(Math.random() * this.desafios.length)];
    this.traduzirParaIngles = Math.random() > 0.5;
    this.respostaUsuario = '';
    this.showSuccessMessage = false;
    this.showFailMessage = false;
  }

  verificarResposta() {
    // Função para normalizar contrações
    const normalizarContracoes = (texto: string): string => {
      return texto
        .toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Remove acentos
        .trim()
        .replace(/he's/g, "he is")
        .replace(/it's/g, "it is")
        .replace(/I'm/g, "I am")
        .replace(/i'm/g, "I am")
        .replace(/you're/g, "you are")
        .replace(/they're/g, "they are")
        .replace(/we're/g, "we are")
        .replace(/what's/g, "what is")
    };

    // Resposta correta e digitada, ambas normalizadas
    const respostaCorreta = normalizarContracoes(this.traduzirParaIngles ? this.desafioAtual.ingles : this.desafioAtual.portugues);
    const respostaDigitada = normalizarContracoes(this.respostaUsuario);

    if (respostaDigitada === respostaCorreta) {
      this.auth.checkLevelUp(500);

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


  navigate_to() {
    this.playSound.playCleanSound()
    this.router.navigate(['/home']);
  }

}
