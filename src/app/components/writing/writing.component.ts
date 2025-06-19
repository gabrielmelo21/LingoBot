import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {PlaySoundService} from "../../services/play-sound.service";
import {HttpClient} from "@angular/common/http";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {AuthService} from "../../services/auth.service";
import {TimersService} from "../../services/timers.service";
import {EldersRoomGuardiamService} from "../../services/elders-room-guardiam.service";


export interface VocabEntry {
  portugues: string;
  ingles: string;
}


@Component({
  selector: 'app-writing',
  templateUrl: './writing.component.html',
  styleUrls: ['./writing.component.css'],


})
export class WritingComponent   {



  private exercicios: VocabEntry[] = [];
  cena: number = 1;
  dialog: number = 1;
  respostaCorreta: string = ''; // essa vem da chamada do `randomExercise()`
  optionIsSelected: boolean = false;
  selectedOption: number | null = null;
  enunciado: any;
  alternativas: string[] = [];
  progress: number = 0; // de 0 a 100
  rightOrWrongAnswer: boolean = false;
  quizSession: boolean = false;
  caminhoImagem: string = 'assets/lingobot/elders/writing/pensando.png';
  postMission: boolean = false;
  questionTitle: string = '';
  srcExercises: string = '';
  finalGoldReward: number = 10;
  finalXpReward: number = 10000;
  maxHp: number = 5;
  currentHp: number = 5;
  hpArray: number[] = [];

  bloquearScroll(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' }); // ou behavior: 'auto' se não quiser animação
    document.body.style.overflow = 'hidden !important';
  }

  constructor(private router: Router,
               private playSoundService: PlaySoundService,
               private http: HttpClient,
               private authService: AuthService,
               private cdr: ChangeDetectorRef,
               private timersService: TimersService,
              private eldersRoomGuardiamService: EldersRoomGuardiamService
  ) {

    const allowed = this.eldersRoomGuardiamService.verifyAccessOrRedirect('writing_was_paid');
    if (!allowed) return;



    this.bloquearScroll();


     setTimeout(() =>{
         this.cena = 2;
       this.playSoundService.playPuzzleSolve()
     }, 10) // 13000


    this.setupHpByDifficulty();



   // console.log(this.authService.getDifficulty())

    switch (this.authService.getDifficulty()) {
      case 'easy':
        this.srcExercises = 'assets/lingobot/json/writing/easy.json';
        this.finalGoldReward = 10;
        this.finalXpReward = 10000;
        break;

      case 'medium':
        this.srcExercises = 'assets/lingobot/json/writing/medium.json';
        // Recompensa 1,5× da easy
        this.finalGoldReward = 15;
        this.finalXpReward = 15000;
        break;

      case 'hard':
        this.srcExercises = 'assets/lingobot/json/writing/hard.json';
        // Recompensa 2× da easy
        this.finalGoldReward = 20;
        this.finalXpReward = 20000;
        break;

      case 'elder':
        this.srcExercises = 'assets/lingobot/json/writing/elder.json';
        // Recompensa 3× da easy
        this.finalGoldReward = 30;
        this.finalXpReward = 30000;
        break;

      default:
        // Fallback caso o valor seja inesperado
        console.warn(`Dificuldade desconhecida: ${this.authService.getDifficulty()}`);
        this.srcExercises = 'assets/lingobot/json/writing/easy.json';
        this.finalGoldReward = 10;
        this.finalXpReward = 10000;
        break;
    }


  // console.log(this.srcExercises);
    this.loadExercises();


   } // end constructor








  renderizar(){
    this.cdr.detectChanges();
  }



  private setupHpByDifficulty() {
    switch (this.authService.getDifficulty()) {
      case 'easy':
        this.maxHp = 9; break;
      case 'medium':
        this.maxHp = 7; break;
      case 'hard':
        this.maxHp = 5; break;
      case 'elder':
        this.maxHp = 3; break;
      default:
        this.maxHp = 5; break;
    }
    this.currentHp = this.maxHp;
    this.hpArray = Array(this.maxHp).fill(0);
  }



  private updateHpBar() {
    this.currentHp = Math.max(this.currentHp - 1, 0);
  }

  onWrongAnswer() {
    if (this.currentHp > 0) {
      this.updateHpBar();
      if (this.currentHp === 0) {
        this.handleDeath();
      }
    }
  }

  handleDeath() {
    // lógica de “game over”
    this.router.navigate(['/babel-tower']);
  }




  isAnimating = false;

  startAnimation() {
    // Reseta a animação
    this.isAnimating = false;

    // Força um recálculo do DOM
    setTimeout(() => {
      this.isAnimating = true;
    }, 10);
  }






  private loadExercises(): void {
    this.http.get<VocabEntry[]>(this.srcExercises)
      .subscribe(data => {
        this.exercicios = data;
      });

  }


  public randomExercise() {
    if (this.exercicios.length === 0) return null;

    // Seleciona um item aleatório
    const item = this.exercicios[Math.floor(Math.random() * this.exercicios.length)];

    // Decide aleatoriamente se será em inglês ou português
    const perguntaEmIngles = Math.random() < 0.5;

    let enunciado = '';
    let correta = '';
    let alternativas: string[] = [];

    if (perguntaEmIngles) {
      this. questionTitle = "O que significa:";
      enunciado = `'${item.ingles}'`;
      correta = item.portugues;

      const opcoesErradas = this.exercicios
        .filter(e => e.portugues !== correta)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .map(e => e.portugues);

      alternativas = [...opcoesErradas, correta];
    } else {
      this. questionTitle = "Como se diz:";
      enunciado = `'${item.portugues}'`;
      correta = item.ingles;

      const opcoesErradas = this.exercicios
        .filter(e => e.ingles !== correta)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .map(e => e.ingles);

      alternativas = [...opcoesErradas, correta];
    }

    // Embaralha alternativas
    alternativas = this.shuffleArray(alternativas);

    // Retorna exercício montado
    console.log(enunciado, alternativas, correta);
    return {
      enunciado,
      alternativas,
      correta
    };
  }

  private shuffleArray<T>(array: T[]): T[] {
    return array
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  }



  corrigir(): boolean {
    if (this.selectedOption === null || !this.optionIsSelected) {
      return false; // Nenhuma opção selecionada
    }

    this.rightOrWrongAnswer = true;

    const opcaoSelecionada = this.alternativas[this.selectedOption];
    const resultado = opcaoSelecionada === this.respostaCorreta;

    console.log('Selecionada:', opcaoSelecionada);
    console.log('Correta:', this.respostaCorreta);
    console.log('Acertou?', resultado);

    if (resultado){
      this.playSoundService.playWin2()
      this.progress += 10;
      this.updateProgress(this.progress,100)
      this.caminhoImagem = 'assets/lingobot/elders/writing/acertou.png';
      this.dialog = 5;
      this.startAnimation()

    }else{
      this.onWrongAnswer()
      this.playSoundService.playErrorQuestion();
      this.caminhoImagem = 'assets/lingobot/elders/writing/explicando.png';
      this.dialog = 6;
      this.startAnimation()
    }

    this.renderizar();
    return resultado;
  }





  letra(index: number): string {
    return ['A', 'B', 'C', 'D'][index];
  }

  estadoDoElemento = 'hidden';

  mostrarElemento() {
    this.estadoDoElemento = 'middleRight';

    // Depois de alguns segundos, ele volta a sair
    setTimeout(() => {
      this.estadoDoElemento = 'hidden';
    }, 4000); // tempo visível no centro-direita
  }




  chooseOption(number: number) {
     this.playSoundService.playCleanSound2()


    switch (number) {
      case  0:
        this.dialog = 1;

      break;
       case 1:
         //Muito bem, vou te ajudar a aumentar seu vocabulário na língua inglesa.
         this.dialog = 2;
       break;
       case 2:
         // voltar
         this.router.navigate(['/babel-tower']);
       break;
        case 3:
          this.dialog = 3;
        break;
      case 4:
        this.dialog = 4;
        this.quizSession = true;

         this.newExercise();


        break;
    }




  }


  selectOption(index: number): void {
    this.playSoundService.playCleanSound2();
    this.selectedOption = index;
    this.optionIsSelected = true;
  }
  resetSelectedOption(): void {
    this.optionIsSelected = false;
    this.selectedOption = null;
  }



  newExercise(): void {
    this.  resetSelectedOption();
    if(this.progress >= 100) {
      this.startAnimation();
      this.playSoundService.playWinSound()
      this.postMission = true;
      this.dialog = 7
      this.caminhoImagem = 'assets/lingobot/elders/writing/finish.png';
      this.authService.checkLevelUp(this.finalXpReward)
      this.authService.updateLocalUserData( { tokens: this.finalGoldReward})
      this.authService.addXpSkills('writing');
      this.timersService.updateMission('writing');

      setTimeout(() => {
           this.playSoundService.playItemDrop()
           this.authService.addRandomItemToUser();
      }, 2000)

    }else{
    this.caminhoImagem = 'assets/lingobot/elders/writing/pensando.png';
    this.rightOrWrongAnswer = false;
    this.dialog = 4
    const exercicio = this.randomExercise();
    if (exercicio && exercicio.alternativas && exercicio.correta) {
      this.enunciado = exercicio?.enunciado;
      this.alternativas = exercicio!.alternativas!;
      this.respostaCorreta = exercicio!.correta!;

      console.log("O cxercicio é", exercicio);
    }
  }

    this.renderizar();
  }



// Você pode alterar dinamicamente com lógica de etapas, por exemplo:

  updateProgress(etapa: number, total: number) {
    this.progress = (etapa / total) * 100;
  }


  goHome() {
    this.playSoundService.playCleanSound()
    this.router.navigate(['/babel-tower']);
  }



}
