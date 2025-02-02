import {ChangeDetectorRef, Component} from '@angular/core';
import {PlaySoundService} from "../../services/play-sound.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";

interface VideoData {
  videoID: string; // URL do vídeo
  banner: string; // URL do banner do vídeo
}
@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.css']
})
export class VideosComponent {

  isLoading = false;
  userChoiceStatus: string = "";
  videoURL_fromUser: string = "";
  videoURL_youtube: string = "";
  formulario: FormGroup;


  constructor( private router: Router, private playSound: PlaySoundService, private formBuilder: FormBuilder, private cdr: ChangeDetectorRef) {
    const scriptTag = document.createElement("script")
    scriptTag.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(scriptTag)

    this.formulario = this.formBuilder.group({
      url_youtube: ['', Validators.required],
    });


  }
  userChoice(choice: string) {
    this.playSound.playCleanNavigationSound()
    this.userChoiceStatus = choice;

    if (choice == "video_aleatorio"){
      this.loadVideo()
    }


  }

// Lista de vídeos do YouTube
  videoList: string[] = [
    "pKoH9GkEKxQ", "OyNA4FA47do", "LWibnPsZhxA", "19fxN2lXQXU",
    "IsaFWkazo1A", "JxWEAP0aAJQ", "-0g8d2A-nYA", "UpQF2gdw5RY",
    "B6O50rwHkX0", "DHHCoIYOtGA", "BJ2VqM1V_hQ", "uQ2rJKiiRiU",
    "Wn8X5JMgBAk", "DgErOR4eJEI", "H3hEp79RS6k", "IIhWbZk2B3o",
    "Bkp2tArah3o"
  ];

// Função para pegar um vídeo aleatório
  getRandomVideo(): string {
    const randomIndex = Math.floor(Math.random() * this.videoList.length);
    return this.videoList[randomIndex];
  }



  public loadVideo() {
    this.playSound.playCleanNavigationSound()
    this.isLoading = true;


    let videoFromUser = '';
    if (this.userChoiceStatus == "youtube") {
      videoFromUser = this.formulario.get('url_youtube')?.value;
      let startIndex = videoFromUser.indexOf("v=") + 2;
      this.videoURL_youtube = videoFromUser.substr(startIndex, 11);
    }else{
      this.videoURL_youtube = this.getRandomVideo(); // Escolhe um aleatório
    }




    this.cdr.detectChanges(); // Força a detecção de mudanças


  }






  public onPlayerReady() {
    this.playSound.playWin2() //another sound
    this.isLoading = false; // Desativa o loading quando o player estiver pronto
    this.cdr.detectChanges(); // Atualiza a interface
  }


  carregarOutroVideo() {
    this.playSound.playCleanNavigationSound()
    this.videoURL_fromUser = "";
    this.videoURL_youtube = "";
    this.userChoiceStatus = "";
  }

  navigate_to() {
    this.playSound.playCleanNavigationSound()
    this.router.navigate(['/home']);
  }
}
