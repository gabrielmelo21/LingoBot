import { Component } from '@angular/core';
import {MainAPIService} from "../../services/main-api.service";

@Component({
  selector: 'app-step3',
  templateUrl: './step3.component.html',
  styleUrls: ['./step3.component.css']
})
export class Step3Component {
  isRecording = false;
  recordingStatus = 'Pronto para gravar';
  mediaRecorder!: MediaRecorder;
  audioChunks: Blob[] = [];

  constructor(private api: MainAPIService) {}

  startRecording() {
    this.isRecording = true;
    this.recordingStatus = 'Gravando...';

    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      this.mediaRecorder = new MediaRecorder(stream);
      this.audioChunks = [];

      this.mediaRecorder.ondataavailable = (event) => {
        this.audioChunks.push(event.data);
      };

      this.mediaRecorder.start();
    });
  }

  stopRecording() {
    if (this.isRecording && this.mediaRecorder) {
      this.isRecording = false;
      this.recordingStatus = 'Gravação finalizada. Enviando...';

      this.mediaRecorder.stop();
      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        this.confirmAndSend(audioBlob);
      };
    }
  }

  cancelRecording() {
    if (this.isRecording) {
      this.isRecording = false;
      this.recordingStatus = 'Gravação cancelada';
      this.mediaRecorder?.stop();
    }
  }

  confirmAndSend(audioBlob: Blob) {
    const confirmSend = confirm('Deseja enviar este áudio para transcrição?');

    if (confirmSend) {
      const audioFile = new File([audioBlob], 'audio.webm', {
        type: 'audio/webm',
      });

      this.api.uploadAudio(audioFile).subscribe(
        (response) => {
          this.recordingStatus = 'Transcrição concluída: ' + response.text;
        },
        (error) => {
          this.recordingStatus = 'Erro ao transcrever áudio';
        }
      );
    } else {
      this.recordingStatus = 'Envio cancelado';
    }
  }
}

