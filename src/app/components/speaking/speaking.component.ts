import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {PlaySoundService} from "../../services/play-sound.service";
import {AuthService} from "../../services/auth.service";

import {VideoControllerService} from "../../services/video-controller.service";
import {DialogService} from "../../services/dialog.service";
import {JackpotService} from "../../services/jackpot.service";
import {EldersRoomGuardiamService} from "../../services/elders-room-guardiam.service";
import {TimersService} from "../../services/timers.service";

import {VideoService} from "../../services/video.service";
import {RewardService} from "../../services/reward.service";

export interface MiniGameStep {
  question: string;
  options: string[];
  correctIndex: number;
}

export interface MiniGameJson {
  character: string;
  blocks: MiniGameStep[][];
}

@Component({
  selector: 'app-speaking',
  templateUrl: './speaking.component.html',
  styleUrls: ['./speaking.component.css'],
})
export class SpeakingComponent implements AfterViewInit {

  showBaloon: boolean = true;
  hidePosWin: boolean = false;
  jackpot: boolean = this.jackpotService.isJackpot();
  finalGoldReward: number = 0;
  finalXpReward: number = 0;


  dialogLines = [];
  currentStep: MiniGameStep | null = null;
  selectedIndex: number | null = null;



  // Novas propriedades para controlar o bloco atual
  currentBlock: MiniGameStep[] = [];
  currentQuestionIndex: number = 0;
  currentExercise: number = 1;

  // Variáveis para relatório de erros
  wrongAnswers: Array<{
    exercise: number;
    questionNumber: number;
    question: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
  }> = [];

  currentExerciseErrors: Array<{
    questionNumber: number;
    question: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
  }> = [];

  // Controle do modal de relatório
  showReportModal: boolean = false;
  currentReportData: {
    exerciseName: string;
    totalQuestions: number;
    correctAnswers: number;
    errors: Array<{
      questionNumber: number;
      question: string;
      userAnswer: string;
      correctAnswer: string;
    }>;
  } | null = null;

  startStep(step: MiniGameStep): void {
    this.currentStep = step;
    this.selectedIndex = null;
  }

  isCardSelected: boolean = false;

  selectOption(index: number): void {
    this.isCardSelected = true;
    this.playSoundService.playSwipe();
    this.selectedIndex = index;

    this.dialogService.activeDialogId;
    this.dialogService.fullDialog;
  }

  confirmSelection(): void {
    this.isCardSelected = false;
    if (this.selectedIndex === null || !this.currentStep) return;
    this.playSoundService.playCleanSound2();

    const isCorrect = this.selectedIndex === this.currentStep.correctIndex;
    console.log(isCorrect ? '✅ Acertou!' : '❌ Errou!');

    // Registra a resposta para o relatório
    this.recordAnswer(isCorrect);

    // Avança para próxima pergunta
    this.nextQuestion();
  }

  nextQuestion(): void {
    this.currentQuestionIndex++;

    // Verifica se ainda há perguntas no bloco atual
    if (this.currentQuestionIndex < this.currentBlock.length) {
      // Atualiza para próxima pergunta
      this.currentStep = this.currentBlock[this.currentQuestionIndex];
      this.selectedIndex = null;

      // Atualiza o diálogo para mostrar a próxima pergunta
      this.dialogService.nextDialog();

      console.log(`📝 Pergunta ${this.currentQuestionIndex + 1}/${this.currentBlock.length}:`, this.currentStep.question);
    } else {
      // Acabaram as perguntas do bloco atual
      console.log("🎉 Bloco concluído!");

      // Mostra modal de relatório em vez de avançar diretamente
      this.showExerciseReport();
    }
  }

  loading: boolean = true;
  @ViewChild('videoPlayer', {static: false}) videoPlayer!: ElementRef<HTMLVideoElement>;

  ngAfterViewInit() {
    this.videoController.setup(this.videoPlayer);

    const video = this.videoPlayer.nativeElement;

    // Carrega o vídeo local
    this.videoService.getVideoForPlayer('speaking-free-compress.mp4').then((src) => {
      if (src) {
        video.src = src;
        video.load();
        video.play();
      }
    });


    video.addEventListener('playing', () => {
      this.loading = false;
    });


    this.playFirstDialog();
    this.dialogService.activeDialogId;
    this.dialogService.fullDialog;
  }


  constructor(
    private playSoundService: PlaySoundService,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private videoController: VideoControllerService,
    protected dialogService: DialogService,
    private jackpotService: JackpotService,
    private eldersRoomGuardiamService: EldersRoomGuardiamService,
    private timerService: TimersService,
    private rewardService: RewardService,
    private cdr: ChangeDetectorRef,
    private videoService: VideoService
  ) {
    this.playSoundService.playSpeakingFreeSoundTrack();

    this.dialogService.startDialog({
      id: 'elder_intro',
      lines: [
        {text: 'Olá, Lingobot! Sou o Speaking Elder.'},
        {text: 'Neste desafio, você aprenderá a se comunicar em diversas situações.'},
        {text: 'Usarei minhas magias para simular papéis como atendente, médico e gerente de RH.'},
        {text: 'Escolha a resposta correta entre duas cartas. Pense bem!'},
        {text: 'Se fizer boas escolhas até o fim... ganhará moedas de ouro!'}
      ]
    });
  }

  playFirstDialog() {
    this.videoController.playSegment("00:00", "00:09", () => {
      this.playFirstDialog();
    });
  }

  playHrMiniGame() {
    this.videoController.playSegment("00:11", "00:16", () => {
      this.playHrMiniGame();
    });
  }

  playMcMiniGame() {
    // Implemente o segmento de vídeo para o segundo exercício
    this.videoController.playSegment("00:18", "00:26", () => {
      this.playMcMiniGame();
    });
  }

  playAirportCheckinMiniGame() {
    // Implemente o segmento de vídeo para o segundo exercício
    this.videoController.playSegment("00:28", "00:36", () => {
      this.playAirportCheckinMiniGame()
    });
  }

  playHotelCheckinMiniGame() {
    // Implemente o segmento de vídeo para o segundo exercício
    this.videoController.playSegment("00:38", "00:46", () => {
      this.playHotelCheckinMiniGame();
    });
  }


  playDoctorMiniGame() {
    // Implemente o segmento de vídeo para o segundo exercício
    this.videoController.playSegment("00:48", "00:56", () => {
      this.playDoctorMiniGame();
    });
  }



  playJackpot() {
    // Implemente o segmento de vídeo para o segundo exercício
    this.videoController.playSegment("00:57", "01:04", () => {
      this.videoController.pauseAt("01:04");
      this.playSoundService.playSpeakingFreeSoundTrack(true);
      this.hidePosWin = true;
      this.rewardService.giveUserRewards(this.jackpot, "speaking", this.finalGoldReward, this.finalXpReward);


    });
  }

  playWin(){
    this.videoController.playSegment("01:05", "01:13", () => {
      this.videoController.pauseAt("01:13");
      this.playSoundService.playSpeakingFreeSoundTrack(true);
      this.hidePosWin = true;
      this.rewardService.giveUserRewards(this.jackpot, "speaking", this.finalGoldReward, this.finalXpReward);


    });
  }


  back() {
    this.router.navigate(['/babel-tower']);
  }

  firstDialog: boolean = true;

  nextDialog() {
    this.dialogService.nextDialog();
  }

  next() {
    this.playSoundService.playCleanSound2();
    this.dialogService.nextDialog();

    if (!this.dialogService.isActive) {
      this.firstDialog = false;
      console.log("first dialog finish");

      this.loadMiniGameJson(1);
      this.playHrMiniGame();
    }
  }

  prev() {
    this.playSoundService.playCleanSound2();
    this.dialogService.prevDialog();
  }

  close() {
    this.playSoundService.playCleanSound2();
    this.dialogService.endDialog();
  }

  loadMiniGameJson(exercise: number): void {
    let id_dialog_name = '';
    switch (exercise) {
      case 1:
        id_dialog_name = "HR";
        break;
      case 2:
        id_dialog_name = "MC";
        break;
      case 3:
        id_dialog_name = "Hotel Checkin";
        break;
    }

    const url = `assets/lingobot/json/minigames/speaking_minigame${exercise}.json`;

    this.http.get<MiniGameJson>(url)
      .subscribe(data => {
        const character = data.character;

        // Sorteia um bloco
        const randomBlockIndex = Math.floor(Math.random() * data.blocks.length);
        const originalBlock = data.blocks[randomBlockIndex];

        // Embaralha as opções de cada pergunta
        const shuffledBlock: MiniGameStep[] = originalBlock.map(step => {
          const optionsCopy = [...step.options];
          const correctAnswer = optionsCopy[step.correctIndex];

          // Embaralha as opções
          for (let i = optionsCopy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [optionsCopy[i], optionsCopy[j]] = [optionsCopy[j], optionsCopy[i]];
          }

          // Atualiza o índice correto após o embaralhamento
          const newCorrectIndex = optionsCopy.indexOf(correctAnswer);

          return {
            question: step.question,
            options: optionsCopy,
            correctIndex: newCorrectIndex
          };
        });

        // Armazena o bloco atual e reseta o índice
        this.currentBlock = shuffledBlock;
        this.currentQuestionIndex = 0;

        // Limpa os erros do exercício anterior
        this.currentExerciseErrors = [];

        // Extrai as perguntas para o diálogo
        const questions = shuffledBlock.map(step => step.question);

        // Inicia o diálogo com todas as perguntas do bloco
        this.dialogService.startDialog({
          id: id_dialog_name,
          lines: questions.map(q => ({text: q}))
        });

        // Inicia com a primeira pergunta
        this.startStep(shuffledBlock[0]);

        console.log('🧠 Character:', character);
        console.log('🎲 Bloco sorteado:', shuffledBlock);
        console.log('❓ Perguntas:', questions);
      });
  }

  // Método para registrar respostas
  recordAnswer(isCorrect: boolean): void {
    if (!this.currentStep) return;

    const userAnswer = this.currentStep.options[this.selectedIndex!];
    const correctAnswer = this.currentStep.options[this.currentStep.correctIndex];

    const answerRecord = {
      questionNumber: this.currentQuestionIndex + 1,
      question: this.currentStep.question,
      userAnswer: userAnswer,
      correctAnswer: correctAnswer,
      isCorrect: isCorrect
    };

    // Adiciona no relatório do exercício atual
    this.currentExerciseErrors.push(answerRecord);

    // Se errou, adiciona no relatório geral de erros
    if (!isCorrect) {
      this.wrongAnswers.push({
        exercise: this.currentExercise,
        ...answerRecord
      });
    }

    console.log('📊 Resposta registrada:', answerRecord);
  }

  // Método para mostrar relatório do exercício atual
  showExerciseReport(): void {
    const exerciseName = this.currentExercise === 1 ? 'HR Interview' : 'Medical Consultation';
    const errors = this.currentExerciseErrors.filter(answer => !answer.isCorrect);
    const totalQuestions = this.currentExerciseErrors.length;
    const correctAnswers = totalQuestions - errors.length;

    this.currentReportData = {
      exerciseName: exerciseName,
      totalQuestions: totalQuestions,
      correctAnswers: correctAnswers,
      errors: errors.map(error => ({
        questionNumber: error.questionNumber,
        question: error.question,
        userAnswer: error.userAnswer,
        correctAnswer: error.correctAnswer
      }))
    };

    this.showReportModal = true;
    console.log('📊 Exibindo modal de relatório:', this.currentReportData);
  }

  // Método para fechar modal e avançar para próximo exercício
  closeReportAndContinue(): void {
    console.log(this.currentExercise);
    this.playSoundService.playCleanSound2();
    this.showReportModal = false;
    this.currentReportData = null;

    // Avança para próximo exercício ou finaliza
    this.currentExercise++;

    if (this.currentExercise <= 5) {
      this.loadMiniGameJson(this.currentExercise);

     switch (this.currentExercise) {
       case 2:
         this.playMcMiniGame();
       break;
       case 3:
         this.playAirportCheckinMiniGame();
        break;

       case 4:
         this.playHotelCheckinMiniGame();
         break;

       case 5:
         this.playDoctorMiniGame();
         break;

     }


    } else {


      this.currentStep = null;

// Finaliza o mini-game com relatório completo
      this.finalizeMiniGame();

// Chama animação de fim (jackpot ou vitória)
      if (this.jackpot){
        this.playJackpot();
      }else{
        this.playWin();
      }

    }
  }
  perfection: boolean = false;
  // Método para gerar relatório final completo
  generateFinalReport(): void {
    const totalQuestions = this.wrongAnswers.length + this.getTotalCorrectAnswers();
    const totalErrors = this.wrongAnswers.length;
    const totalCorrect = totalQuestions - totalErrors;

    console.log('📊 RELATÓRIO FINAL COMPLETO:');
    console.log(`✅ Total de acertos: ${totalCorrect}/${totalQuestions}`);
    console.log(`❌ Total de erros: ${totalErrors}/${totalQuestions}`);

    if (this.wrongAnswers.length > 0) {
      console.log('📝 Resumo de todos os erros:');
      this.wrongAnswers.forEach((error, index) => {
        const exerciseName = error.exercise === 1 ? 'HR' : 'MC';
        console.log(`${index + 1}. [${exerciseName}] Pergunta ${error.questionNumber}: "${error.question}"`);
        console.log(`   Sua resposta: "${error.userAnswer}"`);
        console.log(`   Resposta correta: "${error.correctAnswer}"`);
        console.log('---');
      });




    } else {
      this.perfection = true; // bonus de xp e coins
      console.log('🎉 PERFEITO! Você acertou todas as perguntas de todos os exercícios!');
    }






    // BASICAMENTE, temos que usar dialogservice para criar o ultimo dialogo , mostrando quantidade de erros
    // acertos e oque errou sublinhado de vermelho e o correto em verde,
    // no final mostra a XP e gold, porem devo definir uma valor X por acerto  ,  acertos * X

/**
    const dialogFinal1 = this.perfection?
      "Perfeito!! Você acertou todas as "+totalQuestions+" questões!":
      "Muito bem! Você acertou  "+totalCorrect+" de "+totalQuestions+"";

    this.dialogService.startDialog({
    id: 'final',
    lines: [
    {text: dialogFinal1, isFinal: true},
    ]
    });
**/



    this.finalXpReward = 300 * totalCorrect;
    this.finalGoldReward =  5 * totalCorrect;


  }

  // Método auxiliar para calcular total de acertos
  getTotalCorrectAnswers(): number {
    // Assumindo 3 perguntas por exercício e 5 exercícios
    const totalQuestions = 3 * 5;
    return totalQuestions - this.wrongAnswers.length;
  }

  finalizeMiniGame(): void {
    this.playSoundService.playSpeakingFreeSoundTrack(false, '0%');
    this.showBaloon = false;

    console.log("🎉 Mini-game finalizado!");
    this.cdr.detectChanges();


    // Gera relatório final completo
    this.generateFinalReport();

    // Aqui você pode implementar a lógica de finalização
    // Por exemplo: mostrar pontuação, dar recompensas, etc.

    // Exemplo de diálogo de finalização

  }
}
