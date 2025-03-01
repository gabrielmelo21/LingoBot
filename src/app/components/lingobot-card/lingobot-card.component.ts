import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {PlaySoundService} from "../../services/play-sound.service";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MainAPIService} from "../../services/main-api.service";
import {catchError, finalize, tap} from "rxjs";
import {AuthService} from "../../services/auth.service";




interface Flashcard {
  id: number;
  word: string;
  explanation: string;
  how_to_use: string;
  translation: string;
}




@Component({
  selector: 'app-lingobot-card',
  templateUrl: './lingobot-card.component.html',
  styleUrls: ['./lingobot-card.component.css']
})
export class LingobotCardComponent {

  newFlashcard: Flashcard = {
    id: 0,
    word: '',
    explanation: '',
    how_to_use: '',
    translation: ''
  };





  formulario: FormGroup;
  buttonGPT: boolean = false;
  isLoading: boolean = false;
  expressaoAleatoria: string = "";



  constructor(private auth: AuthService, private apiService: MainAPIService, private playSound: PlaySoundService,  private router: Router, private formBuilder: FormBuilder, private _snackBar: MatSnackBar) {

    let expressoesEmIngles: string[] = [
      "A piece of cake", // Algo muito fácil
      "Bite the bullet", // Enfrentar uma situação difícil
      "Hit the hay", // Ir dormir
      "Cost an arm and a leg", // Custar muito caro
      "Kick the bucket", // Morrer
      "Let the cat out of the bag", // Revelar um segredo
      "Under the weather", // Se sentir mal/doente
      "Speak of the devil", // Falando do diabo (quando a pessoa aparece quando você está falando dela)
      "Bite off more than you can chew", // Tentar fazer algo além das suas capacidades
      "Break the ice", // Quebrar o gelo (iniciar uma conversa)
      "Spill the beans", // Revelar segredos
      "Burn the midnight oil", // Trabalhar até tarde da noite
      "Hit the nail on the head", // Acertar em cheio
      "Cut corners", // Fazer algo de forma mais fácil ou barata, mas não necessariamente correta
      "Throw in the towel", // Desistir
      "Cry over spilled milk", // Chorar pelo leite derramado (se lamentar por algo que já aconteceu)
      "Beat around the bush", // Enrolar, não ir direto ao ponto
      "On the ball", // Ser competente ou estar alerta
      "Pull someone's leg", // Brincar com alguém
      "Sit tight", // Esperar com paciência
      "Steal someone's thunder", // Roubar a cena de alguém
      "Take it with a grain of salt", // Não levar algo tão a sério
      "The ball is in your court", // A decisão é sua
      "You can't judge a book by its cover", // Não julgar pela aparência
      "A dime a dozen", // Algo muito comum
      "Barking up the wrong tree", // Procurar no lugar errado
      "Break a leg", // Boa sorte (usado antes de apresentações)
      "Cut to the chase", // Ir direto ao ponto
      "Get out of hand", // Fugir do controle
      "Go the extra mile", // Fazer mais do que o necessário
      "Hit the sack", // Ir dormir
      "It's not rocket science", // Não é complicado
      "Let sleeping dogs lie", // Deixar as coisas como estão
      "Miss the boat", // Perder uma oportunidade
      "No pain, no gain", // Sem esforço, não há recompensa
      "On the fence", // Indeciso
      "Piece of the pie", // Parte de algo (geralmente lucro ou benefício)
      "See eye to eye", // Concordar com alguém
      "Throw someone under the bus", // Sacrificar alguém para se salvar
      "When pigs fly", // Quando os porcos voarem (algo que nunca vai acontecer)
      "You can say that again", // Concordo plenamente
      "A blessing in disguise", // Algo bom que parece ruim no início
      "A snowball's chance in hell", // Uma chance muito pequena
      "A storm in a teacup", // Tempestade em copo d'água
      "Against the clock", // Correndo contra o tempo
      "All ears", // Todo ouvidos (prestando atenção)
      "At the drop of a hat", // Sem hesitação
      "Back to the drawing board", // Voltar ao início
      "Bite your tongue", // Segurar a língua (não dizer algo)
      "Blow off steam", // Desabafar ou relaxar
      "Burn bridges", // Queimar pontes
      "By the skin of your teeth", // Por pouco
      "Caught red-handed", // Pegar em flagrante
      "Come rain or shine", // Aconteça o que acontecer
      "Curiosity killed the cat", // A curiosidade matou o gato
      "Cut the mustard", // Dar conta do recado
      "Don't count your chickens before they hatch", // Não cante vitória antes da hora
      "Down to earth", // Pé no chão
      "Drastic times call for drastic measures", // Momentos difíceis exigem medidas drásticas
      "Elvis has left the building", // O show acabou
      "Fit as a fiddle", // Em boa forma física
      "Get a taste of your own medicine", // Experimentar o próprio veneno
      "Give the benefit of the doubt", // Dar o benefício da dúvida
      "Go down in flames", // Fracassar espetacularmente
      "Have your head in the clouds", // Estar distraído
      "Heard it through the grapevine", // Ouvir algo por meio de fofocas
      "Hit the road", // Cair na estrada (ir embora)
      "It takes two to tango", // São precisos dois para dançar (ambos são responsáveis)
      "Jump on the bandwagon", // Entrar na moda
      "Keep your chin up", // Manter a cabeça erguida (não desanimar)
      "Kill two birds with one stone", // Matar dois coelhos com uma cajadada só
      "Let bygones be bygones", // Deixar o passado para trás
      "Make a long story short", // Resumindo
      "Method to the madness", // Há um método na loucura
      "Out of the blue", // Do nada
      "Play devil's advocate", // Fazer o papel de advogado do diabo
      "Put a sock in it", // Ficar quieto
      "Put all your eggs in one basket", // Colocar todos os ovos em uma cesta (arriscar tudo em uma coisa só)
      "Read between the lines", // Ler nas entrelinhas
      "Ring a bell", // Parecer familiar
      "Rule of thumb", // Regra geral
      "Shoot the breeze", // Conversar sobre coisas triviais
      "Straight from the horse's mouth", // Direto da fonte
      "The best of both worlds", // O melhor dos dois mundos
      "The last straw", // A gota d'água
      "The whole nine yards", // Tudo, até o fim
      "Through thick and thin", // Na alegria e na tristeza
      "Turn a blind eye", // Fazer vista grossa
      "Water under the bridge", // Água passada
      "Wear your heart on your sleeve", // Mostrar os sentimentos abertamente
      "Wild goose chase", // Perseguir algo impossível
      "Wrap your head around something", // Conseguir entender algo
      "You can't have your cake and eat it too", // Não se pode ter tudo
      "Your guess is as good as mine", // Eu não faço ideia

    ];

    this.expressaoAleatoria = expressoesEmIngles[Math.floor(Math.random() * expressoesEmIngles.length)];

    this.formulario = this.formBuilder.group({
      english: ['', Validators.required],
      portugues: ['', Validators.required],
      explain: [''],
      owner: [localStorage.getItem("UserId")+""]
    });

  }

  navigate_to() {
    this.playSound.playCleanNavigationSound()
    this.router.navigate(['/home']);
  }


  cleanString(input: string): string {
    const regex = /[^a-zA-Z0-9 ]/g;
    return input.replace(regex, '');
  }



  /** notification126 é usado quando conclui a resposta da IA **/
  explanation: string = '';
  usage: string = '';
  translation: string = '';


  preventEnter(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    keyboardEvent.preventDefault();
  }
  voltar(){
    this.sendQuestion = false;
  }



  getLingoBotExplanation() {
    if(this.auth.getUserTokens() >= 50){

      this.isLoading = true;
    this.playSound.playCleanNavigationSound();
    const userText = this.formulario.get('english')?.value;




    this.apiService.GPT("", userText, "ExplainExpression").subscribe(response => {
      console.log('Resposta bruta da API:', response); // 🔍 Debug

       this.auth.decreseToken(50);
      this.auth.updateMetaUser({ meta4: true });

      try {
        // Primeiro parse: para acessar o campo 'response'
        const parsedResponse = JSON.parse(response);  // Agora temos o JSON da resposta

        // A resposta verdadeira está dentro do campo 'response' como uma string
        const responseData = JSON.parse(parsedResponse.response); // Fazendo o parse novamente para acessar os dados

        // Agora extraímos os valores de explicacao, uso e traducao
        if (responseData && responseData.explicacao && responseData.uso && responseData.traducao) {
          this.explanation = responseData.explicacao;
          this.usage = responseData.uso;
          this.translation = responseData.traducao;

          this.newFlashcard.word = userText;
          this.newFlashcard.explanation = this.explanation;
          this.newFlashcard.how_to_use = this.usage;
          this.newFlashcard.translation = this.translation;

          // Ativa a visualização do card
          this.sendQuestion = true;
          this.playSound.playNotification()
          this.isLoading = false;
        }
      } catch (error) {
        console.error('Erro ao parsear a resposta da API:', error);
      }
    });

     }else{
       // ativar modal
      this.auth.checkTokens()
      this.playSound.playErrorQuestion()
       console.log("Tokens insuficientes")
     }


  }




  translation2: string = '';
  getTranslation() {
    const userText = this.formulario.get('english')?.value;

    this.isLoading = true;
    this.playSound.playCleanNavigationSound();


    this.apiService.translateText(userText).subscribe(response => {
      console.log('Resposta da API:', response); // Debug
      if (response.text) {
        this.translation2 = response.text;
        this.isLoading = false;
      } else {
        this.translation2 = 'Erro ao traduzir.';
      }
    }, error => {
      console.error('Erro na requisição:', error);
      this.translation2 = 'Erro ao conectar com o servidor.';
    });
  }


  public verifyIsNotNull() {
    const englishControl = this.formulario.get('english');
    //faz aparecer o botão caso tenha conteudo no input
    if (englishControl) {
      const englishExpression = englishControl.value;
      this.buttonGPT = !!englishExpression; // Ativa o botão se houver algum conteúdo em 'englishExpression'

    } else {
      this.buttonGPT = false;
    }
  }

  showInputs: boolean = false;

  lingoBotBobble: string = "Digite uma <B>expressão,phrsal verb, gíria ou frase que você não compreendeu</B>\n" +
    "          e eu irei explicar para você! caso queira também posso apenas traduzir. <br>\n"


  fakeText: string = "A expressão \"beat around the bush\" significa \"enrolar\" ou \"não ir direto ao ponto\". É usada quando alguém evita falar sobre algo importante ou difícil, em vez de ser direto e claro.\n" +
    "\n" +
    "Exemplos de uso:\n" +
    "\"Stop beating around the bush and tell me what happened!\"\n" +
    "(Pare de enrolar e me diga o que aconteceu!)\n" +
    "\n" +
    "\"He kept beating around the bush instead of giving a straight answer.\"\n" +
    "(Ele ficou enrolando em vez de dar uma resposta direta.)";

  sendQuestion: boolean = false;
  simulation(){
    this.lingoBotBobble = ""
    this.sendQuestion = true;
    this.isLoading = true;
    // começa a carregar a messagem no balão
    setTimeout((): void => {
      this.isLoading = false;
      this.lingoBotBobble = this.fakeText
      //toca som de concluido
      this.playSound.playNotification1()


      //sumir caixa de texto
      //sumir buttons, colocar voltar ou salvar flashcard

    }, 5000)
  }




  showSuccessMessage = false;

  saveFlashcard() {
    if (!this.newFlashcard.word.trim()) {
      alert('A palavra principal (word) é obrigatória!');
      return;
    }


    this.newFlashcard.id = new Date().getTime(); // Gera um ID único
    const storedFlashcards = localStorage.getItem('flashcards');
    const flashcards: Flashcard[] = storedFlashcards ? JSON.parse(storedFlashcards) : [];

    flashcards.push({ ...this.newFlashcard });
    localStorage.setItem('flashcards', JSON.stringify(flashcards));

    this.showSuccessMessage = true; // Exibe a mensagem de sucesso

    setTimeout(() => {
      this.showSuccessMessage = false; // Oculta a mensagem após 3 segundos
    }, 3000);

    this.playSound.playCleanSound()
    this.auth.updateMetaUser({ meta7: true });

  }





/**


  public completeGPT() {

    const englishControlValue = this.formulario.get('english') ? this.formulario.get('english')?.value : '';
    const englishControl = this.cleanString(englishControlValue);

    const explainControl = this.formulario.get('explain');  // explicação do GPT
    const portugueseControl = this.formulario.get('portugues'); //tradução em pt-br

    if (englishControl && portugueseControl) {
      const englishExpression = englishControl;
      this.isLoading = true;

      // precisamos limpar a expressão enviada, se houver caracteres especiais nos tiramos. como o " /


      // TRADUZINDO A EXPRESSÃO
      this.mainAPI.transalateWithGPT(englishExpression)
        .pipe(
          tap((response) => {

            if (portugueseControl) {
              portugueseControl.setValue(response);
            }


          }),
          catchError((error) => {
            console.error('Erro na chamada API:', error);
            throw error;

          }),
          finalize(() => {
            this.isLoading = false;
            console.log('Processamento do servidor concluído.');
          })
        )
        .subscribe();



      this.mainAPI.completeWithGPT(englishExpression).pipe(
        tap((response) => {

          console.log('Resposta do servidor:', response);

          if (explainControl) {
            explainControl.setValue(response);
          }

        }),
        catchError((error) => {
          console.error('Erro na chamada API:', error);
          throw error;

        }),
        finalize(() => {
          this.isLoading = false;
          this.showInputs = true;
          console.log('Processamento do servidor concluído.');
        })
      )
        .subscribe();
    }
  }

  openSnackBar(mensagem: string, acao: string) {
    this._snackBar.open(mensagem, acao, {
      duration: 2500,
    });
  }


  onSubmit() {

    this.mainAPI.addWords(this.formulario.value).subscribe(

      response => {
        console.log(response);
        this.formulario.reset();
        this.openSnackBar("Smartcard salvo com Sucesso!", "close");
      },

      error => {
        console.error('Erro ao enviar a mensagem:', error);
        this.openSnackBar("Erro ao enviar.", "close");
      }


    );





  }


**/






}
