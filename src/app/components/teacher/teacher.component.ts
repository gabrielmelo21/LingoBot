import { Component } from '@angular/core';
import {catchError, finalize, Observable, tap} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {MainAPIService} from "../../services/main-api.service";

@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.css']
})
export class TeacherComponent {
  text: string = '';
  isLoading: boolean = false;

  meetings: string = 'Hello, I am your English teacher, and you can ask me your questions,' +
    ' learn new things, and practice your listening with me, and more, Please only speak in English.';

  isPlaying: boolean = false;
  sended: boolean = false;

  responseAI: any;

  private apiUrl = 'http://127.0.0.1:5000/tts';

  constructor(private http: HttpClient, private mainAPI: MainAPIService) {
    this.responseAI = this.meetings
     this.speak(this.meetings)
  }

  getAudio(text: string): Observable<Blob> {
    return this.http.post(this.apiUrl, { text }, { responseType: 'blob' });
  }

  speak(text: string) {
    this.sended = true;
    this.getAudio(text).subscribe(response => {
      const audioUrl = URL.createObjectURL(response);
      const audio = new Audio(audioUrl);

      audio.onplay = () => {
        this.isPlaying = true;
        console.log('O áudio está tocando');
      };

      audio.onpause = () => {
        this.isPlaying = false;
        console.log('O áudio não está tocando');
      };

      audio.onended = () => {
        this.isPlaying = false;
        this.sended = false;
        console.log('O áudio não está tocando');
      };

      audio.play();
    });
  }



  sendToAI(text: string){
    this.isLoading = true;
    this.sended = true;
    this.mainAPI.talkWithGPT(text).pipe(
      tap((response) => {

        console.log('Resposta do servidor:', response);

          this.responseAI = response


      }),
      catchError((error) => {
        console.error('Erro na chamada API:', error);
        throw error;

      }),
      finalize(() => {
       this.isLoading = false;
       this.sended = false;
        this.text = ""

        this.speak(this.responseAI)


        console.log('Processamento do servidor concluído.');
      })
    )
      .subscribe();


  }


}
