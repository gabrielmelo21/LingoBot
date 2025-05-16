import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {PlaySoundService} from "../../services/play-sound.service";
import {AuthService} from "../../services/auth.service";
import {MainAPIService} from "../../services/main-api.service";
import {interval, map, startWith, take, tap} from "rxjs";


export interface SpeakingExercise {
  skill1: string;
  skill2: string;
  skill3: string;
  skill4: string;
}



@Component({
  selector: 'app-speaking',
  templateUrl: './speaking.component.html',
  styleUrls: ['./speaking.component.css']
})
export class SpeakingComponent implements OnInit {

   cena = 1;

  currentBattery: number = 5;
  batteryArray = Array(7).fill(0);
  srcExercises: string = '';
  finalGoldReward: number = 0;
  finalXpReward: number = 0;
  exercises: SpeakingExercise[] = [];
  skill1: string = '';
  skill2: string = '';
  skill3: string = '';
  skill4: string = '';


  skill_selected: boolean = false;
  skill_selected_src: string = '';
  skill_selected_title: string = '';
  skill_selected_description: string = '';
  skill_phrase: string = '';


  magic_book_modal: boolean = false;
  buttonEffect: boolean = false;
  transcriptionText: string = "Walking around the world";
  userResponseStatus: string = "";




  constructor(private http: HttpClient,
             private router: Router,
             private playSoundService: PlaySoundService,
              private authService: AuthService,
              private mainAPIService: MainAPIService,
              private cdr: ChangeDetectorRef) {
          //     this.playSoundService.playBossFight();
    switch (this.authService.getDifficulty()) {
      case 'easy':
        this.srcExercises = 'assets/lingobot/json/speaking/easy.json';
        this.finalGoldReward = 15;
        this.finalXpReward = 10000;
        break;
      case 'medium':
        this.srcExercises = 'assets/lingobot/json/speaking/medium.json';
        this.finalGoldReward = 20;
        this.finalXpReward = 15000;
        break;
      case 'hard':
        this.srcExercises = 'assets/lingobot/json/speaking/hard.json';
        this.finalGoldReward = 25;
        this.finalXpReward = 20000;
        break;
      case 'elder':
        this.srcExercises = 'assets/lingobot/json/speaking/elder.json';
        this.finalGoldReward = 35;
        this.finalXpReward = 30000;
        break;
      default:
        console.warn(`Dificuldade desconhecida: ${this.authService.getDifficulty()}`);
        this.srcExercises = 'assets/lingobot/json/speaking/easy.json';
        this.finalGoldReward = 15;
        this.finalXpReward = 10000;
        break;
    }
    this.loadExercises();
  } // END CONSTRUCTOR

  ngOnInit() {
     this.mudarCena(1);
  }


  // METODO PARA DEBUG
   logMessages: string[] = [];
   logToMobileConsole(message: string) {
    this.logMessages.push(`[${new Date().toLocaleTimeString()}] ${message}`);
    console.log(`[${new Date().toLocaleTimeString()}] ${message}`);
    const consoleDiv = document.getElementById('mobile-console');
    if (consoleDiv) {
      consoleDiv.innerText = this.logMessages.slice(-20).join('\n'); // Últimas 20 mensagens
    }
  }
   mudarCena(number: number) {
      this.cena = number;
      this.renderizar()
  }
   renderizar(){
    this.cdr.detectChanges();
  }
   loadExercises(): void {
    this.http.get<SpeakingExercise[]>(this.srcExercises).subscribe(data => {
      this.exercises = data;
      console.log(data);
      this.getRandomExercise();
    });
  }
   getRandomExercise(): void {
    if (!this.exercises || this.exercises.length === 0) return;

    const randomIndex = Math.floor(Math.random() * this.exercises.length);
    const selected = this.exercises[randomIndex];

    this.skill1 = selected.skill1;
    this.skill2 = selected.skill2;
    this.skill3 = selected.skill3;
    this.skill4 = selected.skill4;


  }



  openMagicBook() {
      this.playSoundService.playCleanSound2();
      this.magic_book_modal = !this.magic_book_modal;
      this.logToMobileConsole("Magic Book: " + this.magic_book_modal);
      this.renderizar();
  }


  //escolher uma nova habilidade - volta para opõções de habilidade
  chooseAnotherSkill() {
    this.playSoundService.playCleanSound();

    this.skill_selected = false;
    this.logToMobileConsole("skill_selected: " + this.skill_selected);

    this.skill_selected_src = '';
    this.logToMobileConsole("skill_selected_src: " + this.skill_selected_src);

    this.skill_selected_title = '';
    this.logToMobileConsole("skill_selected_title: " + this.skill_selected_title);

    this.skill_selected_description = '';
    this.logToMobileConsole("skill_selected_description: " + this.skill_selected_description);

    this.skill_phrase = '';
    this.logToMobileConsole("skill_phrase: " + this.skill_phrase);

    this.renderizar();
  }

  //escolher habilidade - aparece no modal
  chooseSkill(number: number): void {
    this.playSoundService.playCleanSound2();

    this.skill_selected = true;
    this.logToMobileConsole("skill_selected: " + this.skill_selected);

    switch (number) {
      case 1:
        this.skill_selected_src = 'assets/lingobot/cenas_na_masmorra/speaking/eletric-atack.png';
        this.logToMobileConsole("skill_selected_src: " + this.skill_selected_src);

        this.skill_selected_title = 'Electric Attack';
        this.logToMobileConsole("skill_selected_title: " + this.skill_selected_title);

        this.skill_selected_description = 'Strike enemies with a bolt of lightning.';
        this.logToMobileConsole("skill_selected_description: " + this.skill_selected_description);

        this.skill_phrase = this.skill1;
        this.logToMobileConsole("skill_phrase: " + this.skill_phrase);
        break;

      case 2:
        this.skill_selected_src = 'assets/lingobot/cenas_na_masmorra/speaking/eletric-atack2.png';
        this.logToMobileConsole("skill_selected_src: " + this.skill_selected_src);

        this.skill_selected_title = 'Thunder Strike';
        this.logToMobileConsole("skill_selected_title: " + this.skill_selected_title);

        this.skill_selected_description = 'Unleash a wave of energy that stuns foes.';
        this.logToMobileConsole("skill_selected_description: " + this.skill_selected_description);

        this.skill_phrase = this.skill2;
        this.logToMobileConsole("skill_phrase: " + this.skill_phrase);
        break;

      case 3:
        this.skill_selected_src = 'assets/lingobot/cenas_na_masmorra/speaking/heal.png';
        this.logToMobileConsole("skill_selected_src: " + this.skill_selected_src);

        this.skill_selected_title = 'Healing Light';
        this.logToMobileConsole("skill_selected_title: " + this.skill_selected_title);

        this.skill_selected_description = 'Restore your vitality using green energy.';
        this.logToMobileConsole("skill_selected_description: " + this.skill_selected_description);

        this.skill_phrase = this.skill3;
        this.logToMobileConsole("skill_phrase: " + this.skill_phrase);
        break;

      case 4:
        this.skill_selected_src = 'assets/lingobot/cenas_na_masmorra/speaking/dodge.png';
        this.logToMobileConsole("skill_selected_src: " + this.skill_selected_src);

        this.skill_selected_title = 'Quick Dodge';
        this.logToMobileConsole("skill_selected_title: " + this.skill_selected_title);

        this.skill_selected_description = 'Swiftly avoid incoming attacks.';
        this.logToMobileConsole("skill_selected_description: " + this.skill_selected_description);

        this.skill_phrase = this.skill4;
        this.logToMobileConsole("skill_phrase: " + this.skill_phrase);
        break;

      default:
        console.warn('Habilidade inválida:', number);
        break;
    }

    this. aparcerMic()
    this.renderizar();
  }

  mic: boolean = false;
 aparcerMic(){
   this.mic = true;
   this.logToMobileConsole("mic: " + this.mic);
 }

 sumirMic(){
    this.mic = false;
    this.logToMobileConsole("mic: " + this.mic);
    this.renderizar()
 }
 micPulsing(){
   this.buttonEffect = true;
 }
 stopMicPulsing(){
   this.buttonEffect = false;
 }

  iniciarGracavaoContagem() {
   this.renderizar()
    if ( this.buttonEffect ) { // Mic pulsing = gravando
      this.logToMobileConsole('⚠️ Já está gravando ou contando, clique ignorado');
      return;
    }
    this.sumirMic(); // sua função
    this.startCountdown(); // iniciar contagem regressiva 3 2 1 - gravando
    this.micPulsing() // mic pulsing - true
    this.logToMobileConsole('🎬 Iniciando contagem regressiva');


  }



  countdownValue: number = 3;
  showCountdown: boolean = false;
  private countdownTimer: any;

  startCountdown() {
    this.sumirMic(); // esconde o mic
    this.countdownValue = 3;
    this.showCountdown = true;
    this.renderizar(); // força renderização inicial para exibir o 3
    this.logToMobileConsole(`⏳ Countdown: ${this.countdownValue}`);

    if (this.countdownTimer) {
      clearInterval(this.countdownTimer); // evita múltiplos timers
    }

    this.countdownTimer = setInterval(() => {
      this.countdownValue--;
      this.renderizar(); // força atualização do número no HTML

      if (this.countdownValue > 0) {
        this.logToMobileConsole(`⏳ Countdown: ${this.countdownValue}`);
      } else {
        clearInterval(this.countdownTimer);
        this.countdownValue = 0;
        this.renderizar(); // força mostrar "🎤 Fale!"
        this.logToMobileConsole('🎤 Comece a falar!');

        this.startAudioRecording();

        setTimeout(() => {
          this.aparcerMic(); // exibe o ícone do mic
          this.micPulsing() // efeito pulsing no mic
          this.showCountdown = false;
          this.renderizar(); // força sumir o countdown
        }, 1000);
      }
    }, 1000);
  }





















  mediaRecorder: MediaRecorder | null = null;
  recordedChunks: Blob[] = [];
  elapsedTime: number = 0;
  recordingTimer: any = null;
  recording = false;
  recordStatus: string = '';
  recordedAudioUrl: string = '';

  maxRecordingTime: number = 6;
  isRecording(){
      this.recording = !this.recording;
  }


  startAudioRecording() {

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      this.logToMobileConsole('❌ Navegador não suporta getUserMedia');
      return;
    }

    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        this.mediaRecorder = new MediaRecorder(stream);
        this.recordedChunks = [];
        this.mediaRecorder.start();
        this.isRecording() //status de recording é true
        this.logToMobileConsole('🎙️ recording -> ' + this.recording);
        this.logToMobileConsole('recordingTimer' + this.recordingTimer);
        this.elapsedTime = 0;


        this.recordingTimer = setInterval(() => {
          this.elapsedTime++;
          this.recordStatus = `🎙️ Gravando (${this.elapsedTime}s/${this.maxRecordingTime}s)`;

          this.logToMobileConsole(`⌛ Tempo: ${this.elapsedTime}s`);

          if (this.elapsedTime >= this.maxRecordingTime) {
            this.stopAudioRecording();
          }
        }, 1000); // a cada 1 segundo o elapsedTime +1

        this.mediaRecorder.ondataavailable = (event) => {
          this.recordedChunks.push(event.data);
          this.logToMobileConsole('🔹 Chunk gravado');


        };

        this.mediaRecorder.onstop = () => {
          clearInterval(this.recordingTimer);

          const audioBlob = new Blob(this.recordedChunks, { type: 'audio/wav' });
          this.recordedAudioUrl = URL.createObjectURL(audioBlob);
          this.logToMobileConsole("recordedAudioUrl: " + this.recording);





          this.recordStatus = '🛑 Enviando gravação...';
          this.logToMobileConsole('🛑 Gravação parada e enviada');

          this.audioUrl = URL.createObjectURL(audioBlob);
          const previewAudio = new Audio(this.audioUrl);
          previewAudio.play();


         this.sendAudioToAPI(audioBlob);

          stream.getTracks().forEach(track => track.stop());
        };



      })
      .catch(error => {
        this.buttonEffect = false;
        this.logToMobileConsole('❌ Erro ao acessar microfone: ' + error.message);
      });
  }







  stopAudioRecording() {
    this.stopMicPulsing()

    this.logToMobileConsole("recordingTimer" + this.recordingTimer);

    if (this.mediaRecorder) {
      if (this.recordingTimer) {
        clearInterval(this.recordingTimer);
        this.logToMobileConsole("ClearInterval -> recordingTimer" + this.recordingTimer);
      }
      this.mediaRecorder.stop();
      this.logToMobileConsole('📥 stopAudioRecording() chamado');
    }


    this.api_loading() // inicia loading  (CHAMADO APOS OCORRER O STOP)
    this.renderizar()

  }


 apiLoading: boolean = false;
  api_loading(){
    this.apiLoading = true;
  this.logToMobileConsole('API Loading...' + this.apiLoading);
  }

  stop_api_loading(){
    this.apiLoading = false;
    this.logToMobileConsole('API Loading...' + this.apiLoading);
  }


/**
  sendAudioToAPI(blob: Blob) {
    // chama o loading de api


    this.logToMobileConsole("Simulando API.. 5 seg")
     setTimeout(() => {
       this.stop_api_loading();
       // aparecer errado, ou o certo
       //this.showCorrect()
       this.showError()
       this.renderizar()
     },5000)
  }
**/


  sendAudioToAPI(audioBlob: Blob) {
    const formData = new FormData();
    formData.append('file', audioBlob, 'recording.wav');
    this.logToMobileConsole('📤 Enviando áudio para API...');
    const minProcessingTime = 1000;
    const startTime = Date.now();
    this.mainAPIService.uploadAudio(formData).subscribe({
      next: (response) => {
        const elapsed = Date.now() - startTime;
        const waitTime = Math.max(0, minProcessingTime - elapsed);

        setTimeout(() => {
          this.transcriptionText = response.text || '⚠️ Sem texto detectado.';

          this.stop_api_loading();
          // aparecer errado, ou o certo
          //this.showCorrect()
          this.showError()
          this.logToMobileConsole("transcrisção - " + this.transcriptionText);
          this.renderizar()


        }, waitTime);
      },
      error: (error: any) => {
        this.logToMobileConsole('❌ Erro ao enviar áudio: ' + error.message);
      }
    });
  }
















  showCorrect(){
   this.userResponseStatus = 'correct';

   // fechar o modal , e executar uma animação
    this.openMagicBook();

    this.mudarCena(2);

    setTimeout(() =>{
        this.mudarCena(1)
        this.chooseAnotherSkill()
        this.resetAll()
    },4400)

  }
  showError(){
   this.userResponseStatus = 'error';

   // aparecer a messagem de erro, e depois ativar animação de elder atack

    // fechar o modal , e executar uma animação
    this.openMagicBook();

    this.mudarCena(3);

    setTimeout(() =>{
      this.mudarCena(1)
      this.chooseAnotherSkill()
      this.resetAll()
    },4400)



  }




  resetAll() {

    // Limpa gravação, timers e estados
    if (this.mediaRecorder) {
      this.mediaRecorder.stop();
    }

    if (this.recordingTimer) {
      clearInterval(this.recordingTimer);
      this.recordingTimer = null;
    }
    this.mic = false;
    this.userResponseStatus = '';
    this.skill_selected = false;
    this.skill_selected_src = '';
    this.skill_selected_title = '';
    this.skill_selected_description = '';
    this.skill_phrase = '';
    //this.magic_book = false;
    this.mediaRecorder = null;
    this.recordedChunks = [];
    this.recordedAudioUrl = '';
    this.recordStatus = '';
    this.buttonEffect = false;

    this.recording = false;
    this.elapsedTime = 0;
    this.recordingTimer && clearInterval(this.recordingTimer);
    this.recordingTimer = null;
    this.showCountdown = false;
    this.transcriptionText = '';
    this.countdownValue = 3;

    this.apiLoading = false;

    this.logToMobileConsole('🔄 Estado geral resetado');
    this.renderizar();
  }



  // DISPARAR AUDIO DO TEXTO
  audioUrl: string | null = null;
  isPlaying: boolean = false;
  audioElement: HTMLAudioElement | null = null;
  isLoading: boolean = false;



  getAudioTTS(text: string) {
    this.isLoading = true;

    this.mainAPIService.getTTS(text).subscribe({
      next: (audioBlob) => {
        try {
          this.audioUrl = URL.createObjectURL(audioBlob);
          this.playAudio();
        } catch (error) {
          console.error("Erro ao processar o áudio:", error);
        } finally {
          this.isLoading = false;
        }
      },
      error: (err) => {
        console.error("Erro ao obter TTS:", err);
        this.isLoading = false;
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


}
