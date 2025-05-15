import {ChangeDetectorRef, Component} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {PlaySoundService} from "../../services/play-sound.service";
import {AuthService} from "../../services/auth.service";
import {MainAPIService} from "../../services/main-api.service";


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
export class SpeakingComponent {
  cena: number = 1;
  magic_book: boolean = false;
  currentBattery: number = 5;
  batteryArray = Array(7).fill(0);
  skill_selected: boolean = false;
  skill_selected_src: string = '';
  skill_selected_title: string = '';
  skill_selected_description: string = '';
  skill_phrase: string = '';
  srcExercises: string = '';
  finalGoldReward: number = 0;
  finalXpReward: number = 0;
  exercises: SpeakingExercise[] = [];
  skill1: string = '';
  skill2: string = '';
  skill3: string = '';
  skill4: string = '';



  constructor(private http: HttpClient,
             private router: Router,
             private playSoundService: PlaySoundService,
              private authService: AuthService,
              private mainAPIService: MainAPIService,
              private cdr: ChangeDetectorRef) {
          //     this.playSoundService.playBossFight();


    this.logToMobileConsole(`VERSÃO 19:37`);



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





  changeCena() {
    this.cena  = 2;

  }

  openMagicBook() {
    this.playSoundService.playCleanSound2()
    this.magic_book = !this.magic_book;
  }



  chooseAnotherSkill(){
    this.playSoundService.playCleanSound()
    this.skill_selected = false;
    this.skill_selected_src = '';
    this.skill_selected_title = '';
    this.skill_selected_description = '';
    this.skill_phrase = '';
  }

  chooseSkill(number: number): void {
    this.playSoundService.playCleanSound2();
    this.skill_selected = true;

    switch (number) {
      case 1:
        this.skill_selected_src = 'assets/lingobot/cenas_na_masmorra/speaking/eletric-atack.png';
        this.skill_selected_title = 'Electric Attack';
        this.skill_selected_description = 'Strike enemies with a bolt of lightning.';
        this.skill_phrase = this.skill1;

        break;
      case 2:

        this.skill_selected_src = 'assets/lingobot/cenas_na_masmorra/speaking/eletric-atack2.png';
        this.skill_selected_title = 'Thunder Strike';
        this.skill_selected_description = 'Unleash a wave of energy that stuns foes.';
        this.skill_phrase = this.skill2;
        break;
      case 3:
        this.skill_selected_src = 'assets/lingobot/cenas_na_masmorra/speaking/heal.png';
        this.skill_selected_title = 'Healing Light';
        this.skill_selected_description = 'Restore your vitality using green energy.';
        this.skill_phrase = this.skill3;
        break;
      case 4:
        this.skill_selected_src = 'assets/lingobot/cenas_na_masmorra/speaking/dodge.png';
        this.skill_selected_title = 'Quick Dodge';
        this.skill_selected_description = 'Swiftly avoid incoming attacks.';
        this.skill_phrase = this.skill4;
        break;
      default:
        console.warn('Habilidade inválida:', number);
        break;
    }
  }






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







  mediaRecorder: MediaRecorder | null = null;
  recordedChunks: Blob[] = [];
  recordedAudioUrl: string | null = null;
  recordStatus: string = '';
  buttonEffect: boolean = false;
  isMicActive = false;
  isPaused = false;
  recordingTimer: any = null;
  elapsedTime: number = 0;
  maxRecordingTime = 7;
  countdown: number = 3;
  showCountdown: boolean = false;
  transcriptionResult: string = '';
  isProcessing: boolean = false;
  isRecording: boolean = false;
  transcriptionText: string = '';
  showResult = false;
  userResponse: boolean = false;
  countdownValue = 3;



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
        this.buttonEffect = true;
        this.isRecording = true;
        this.isMicActive = true;
        this.isPaused = false;
        this.elapsedTime = 0;

        this.recordStatus = '🎙️ Gravação iniciada (0s/7s)';
        this.logToMobileConsole('🎙️ Gravação iniciada');

        this.recordingTimer = setInterval(() => {
          this.elapsedTime++;
          this.recordStatus = `🎙️ Gravando (${this.elapsedTime}s/${this.maxRecordingTime}s)`;

          this.logToMobileConsole(`⌛ Tempo: ${this.elapsedTime}s`);

          if (this.elapsedTime >= this.maxRecordingTime) {
            this.stopAudioRecording();
          }
        }, 1000);

        this.mediaRecorder.ondataavailable = (event) => {
          this.recordedChunks.push(event.data);
          this.logToMobileConsole('🔹 Chunk gravado');
        };

        this.mediaRecorder.onstop = () => {
          clearInterval(this.recordingTimer);

          const audioBlob = new Blob(this.recordedChunks, { type: 'audio/wav' });
          this.recordedAudioUrl = URL.createObjectURL(audioBlob);
          this.buttonEffect = false;
          this.isRecording = false;
          this.isMicActive = false;
          this.isPaused = false;

          this.recordStatus = '🛑 Enviando gravação...';
          this.logToMobileConsole('🛑 Gravação parada e enviada');

          this.audioUrl = URL.createObjectURL(audioBlob);
          const previewAudio = new Audio(this.audioUrl);
          previewAudio.play();

          this.sendAudioToAPI(audioBlob);

          stream.getTracks().forEach(track => track.stop());
        };

        this.mediaRecorder.onpause = () => {
          this.buttonEffect = false;
          this.isPaused = true;
          this.recordStatus = '⏸️ Gravação pausada';
          this.logToMobileConsole('⏸️ Gravação pausada');
        };

        this.mediaRecorder.onresume = () => {
          this.buttonEffect = true;
          this.isPaused = false;
          this.recordStatus = '▶️ Gravação retomada';
          this.logToMobileConsole('▶️ Gravação retomada');
        };
      })
      .catch(error => {
        this.buttonEffect = false;
        this.logToMobileConsole('❌ Erro ao acessar microfone: ' + error.message);
      });
  }

  stopAudioRecording() {
    this.buttonEffect = false;
    if (this.mediaRecorder && this.isRecording) {
      if (this.recordingTimer) {
        clearInterval(this.recordingTimer);
      }
      this.mediaRecorder.stop();
      this.logToMobileConsole('📥 stopAudioRecording() chamado');
    }
  }

  handleMicClick() {
    if (!this.isRecording) {
      this.logToMobileConsole('🎬 Iniciando contagem regressiva');
      this.startCountdown();
    }
  }

  startCountdown() {
    this.showCountdown = true;
    this.countdownValue = 3;

    const countdownInterval = setInterval(() => {
      this.countdownValue--;
      this.logToMobileConsole(`⏳ Countdown: ${this.countdownValue}`);

      if (this.countdownValue === 1) {
        this.startAudioRecording();
      }

      if (this.countdownValue < 0) {
        clearInterval(countdownInterval);
        this.showCountdown = false;
        this.logToMobileConsole('✅ Fim do countdown');
      }
    }, 1000);
  }

  sendAudioToAPI(audioBlob: Blob) {
    const formData = new FormData();
    formData.append('file', audioBlob, 'recording.wav');

    this.isProcessing = true;
    this.transcriptionResult = '';
    this.recordStatus = '⏳ Processando...';
    this.logToMobileConsole('📤 Enviando áudio para API...');
    const minProcessingTime = 1000;
    const startTime = Date.now();
    this.mainAPIService.uploadAudio(formData).subscribe({
      next: (response) => {
        const elapsed = Date.now() - startTime;
        const waitTime = Math.max(0, minProcessingTime - elapsed);

        setTimeout(() => {
          this.isProcessing = false;
          this.cdr.detectChanges();

          this.transcriptionText = response.text || '⚠️ Sem texto detectado.';
          this.checkUserResponse();

          this.showResult = true;
          this.cdr.detectChanges();

          setTimeout(() => {
            this.showResult = false;
            this.transcriptionText = '';
          }, 3000);
        }, waitTime);
      },
      error: (error: any) => {
        this.isProcessing = false;
        this.recordStatus = '❌ Erro na transcrição';
        this.logToMobileConsole('❌ Erro ao enviar áudio: ' + error.message);
      }
    });
  }

  normalizeText(text: string): string {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9 ]/g, "")
      .trim();
  }

  checkUserResponse(): void {
    const user = this.normalizeText(this.transcriptionText);
    const correct = this.normalizeText(this.skill_phrase);
    this.userResponse = user === correct;

    this.logToMobileConsole(`🧠 Checando resposta do usuário: ${user} vs ${correct}`);
    this.logToMobileConsole(this.userResponse ? '✅ Correto!' : '❌ Incorreto.');





      if (this.userResponse) {
        this.openMagicBook(); // muda para false, para fechar o modal
        this.logToMobileConsole("Magic Book: " + this.magic_book)

        this.skill_selected = false; // faz aparecer o botão de abrir modal
        this.logToMobileConsole("Skill Selected var  (deve ser false) -> " + this.skill_selected)



          this.cena = 2;


        setTimeout(() => {
          this.cena = 1;
        },4400)

      }
  }















  logMessages: string[] = [];

  logToMobileConsole(message: string) {
    this.logMessages.push(`[${new Date().toLocaleTimeString()}] ${message}`);
    const consoleDiv = document.getElementById('mobile-console');
    if (consoleDiv) {
      consoleDiv.innerText = this.logMessages.slice(-20).join('\n'); // Últimas 20 mensagens
    }
  }

}
