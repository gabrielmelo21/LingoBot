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
  audioUrl: string | null = null; // Para armazenar a URL do áudio gravado
  audioBlob: Blob | null = null; // Para armazenar o áudio gravado

  constructor(private api: MainAPIService) {}

  startRecording() {
    if (this.isRecording) return;

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
    if (!this.isRecording) return;

    this.isRecording = false;
    this.recordingStatus = 'Gravação finalizada. Você pode ouvir antes de enviar.';

    this.mediaRecorder.stop();
    this.mediaRecorder.onstop = () => {
      this.audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
      this.audioUrl = URL.createObjectURL(this.audioBlob); // Cria a URL para o player de áudio
    };
  }

  cancelRecording() {
    if (this.isRecording) {
      this.isRecording = false;
      this.recordingStatus = 'Gravação cancelada';
      this.mediaRecorder?.stop();
    }
  }

  sendAudio() {
    if (!this.audioBlob) {
      this.recordingStatus = 'Nenhum áudio gravado para enviar.';
      return;
    }

    this.recordingStatus = 'Enviando áudio...';

    // Converter o Blob para um arquivo MP3 ou WAV se necessário
    const audioFile = new File([this.audioBlob], 'audio.mp3', { type: 'audio/mp3' });

    // Criar FormData e garantir que a chave seja 'file'
    const formData = new FormData();
    formData.append('file', audioFile, 'audio.mp3'); // Mudando 'audio' para 'file'

    this.api.uploadAudio(formData).subscribe(
      (response) => {
        this.recordingStatus = 'Transcrição: ' + response.text;
      },
      (error) => {
        this.recordingStatus = 'Erro ao transcrever áudio';
      }
    );
  }

}
