import { Component } from '@angular/core';
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
  isRecording: boolean = false;
  transcription: string = '';



  constructor(private http: HttpClient,
             private router: Router,
             private playSoundService: PlaySoundService,
              private authService: AuthService,
              private mainAPIService: MainAPIService) {
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
  maxRecordingTime: number = 10; // 10 segundos

  startAudioRecording() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.error('Navegador não suporta getUserMedia');
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

        this.recordStatus = '🎙️ Gravação iniciada (0/10s)';
        console.log('🎙️ Gravação iniciada');

        // Inicia o timer para contar o tempo
        this.recordingTimer = setInterval(() => {
          this.elapsedTime++;
          this.recordStatus = `🎙️ Gravando (${this.elapsedTime}s/${this.maxRecordingTime}s)`;

          // Para a gravação automaticamente quando atingir o tempo máximo
          if (this.elapsedTime >= this.maxRecordingTime) {
            this.stopAudioRecording();
          }
        }, 1000);

        this.mediaRecorder.ondataavailable = (event) => {
          this.recordedChunks.push(event.data);
        };

        this.mediaRecorder.onstop = () => {
          // Limpa o timer
          clearInterval(this.recordingTimer);

          const audioBlob = new Blob(this.recordedChunks, { type: 'audio/wav' });
          this.recordedAudioUrl = URL.createObjectURL(audioBlob);
          this.buttonEffect = false;
          this.isRecording = false;
          this.isMicActive = false;
          this.isPaused = false;

          this.recordStatus = '🛑 Enviando gravação...';

          // Prévia automática do áudio gravado
          this.audioUrl = URL.createObjectURL(audioBlob);
          const previewAudio = new Audio(this.audioUrl);
          previewAudio.play();

          console.log('🛑 Enviando gravação...');

          // Enviar o áudio para a API
          this.sendAudioToAPI(audioBlob);


          // Para todas as tracks do stream
          stream.getTracks().forEach(track => track.stop());
        };

        this.mediaRecorder.onpause = () => {
          this.buttonEffect = false;
          this.isPaused = true;
          this.recordStatus = '⏸️ Gravação pausada';
          console.log('⏸️ Gravação pausada');
        };

        this.mediaRecorder.onresume = () => {
          this.buttonEffect = true;
          this.isPaused = false;
          this.recordStatus = '▶️ Gravação retomada';
          console.log('▶️ Gravação retomada');
        };
      })
      .catch(error => {
        this.buttonEffect = false;
        console.error('Erro ao acessar o microfone:', error);
      });
  }

  stopAudioRecording() {
    this.buttonEffect = false;
    if (this.mediaRecorder && this.isRecording) {
      // Limpa o timer se estiver ativo
      if (this.recordingTimer) {
        clearInterval(this.recordingTimer);
      }
      this.mediaRecorder.stop();
    }
  }

  handleMicClick() {
    if (!this.isRecording) {
      this.startAudioRecording();
    } else {
      this.stopAudioRecording();
    }
  }


  // Novo método para enviar o áudio
  sendAudioToAPI(audioBlob: Blob) {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.wav');

    this.mainAPIService.uploadAudio(formData).subscribe({
      next: (response: { text: any; }) => {
        this.recordStatus = '✅ Transcrição recebida';
        console.log('Transcrição:', response.text);
        // Aqui você pode fazer algo com a transcrição, como exibir na tela
        // Exemplo: this.transcription = response.text;
      },
      error: (error: any) => {
        this.recordStatus = '❌ Erro na transcrição';
        console.error('Erro ao enviar áudio:', error);
      }
    });
  }



}
