import {ChangeDetectorRef, Component} from '@angular/core';
import {PlaySoundService} from "../../services/play-sound.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NavigationEnd, Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";

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
  formValidated: boolean = false;
  interval: any;
   videoCarregado: boolean | undefined;


  constructor(private auth: AuthService, private router: Router, private playSound: PlaySoundService, private formBuilder: FormBuilder, private cdr: ChangeDetectorRef) {
   //this.playSound.playEstudarVideos()
    window.scrollTo(0, 0); // Faz o scroll para o topo ao carregar o componente

    const scriptTag = document.createElement("script")
    scriptTag.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(scriptTag)

    this.formulario = this.formBuilder.group({
      url_youtube: ['', Validators.required],
    });


    // Assina as mudanças de rota para parar o intervalo quando sair da rota /videos
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (this.router.url !== '/videos') {
          this.stopXPInterval();
        } else {
          this.startXPInterval();
        }
      }
    });


  }
  userChoice(choice: string) {
    this.playSound.playCleanNavigationSound()
    this.userChoiceStatus = choice;

    if (choice == "video_aleatorio"){

      if (this.router.url == '/videos') {
        this.loadVideo()
      }

    }
    if (this.userChoiceStatus == "youtube"){
   //   this.playSound.playEstudarVideos2()
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



  // Método para começar o XP
  startXPInterval() {
    if (this.videoCarregado) { // Só começa o XP se o vídeo foi carregado
      const xpPerSecond = 3;

      if (!this.interval) {
        this.interval = setInterval(() => {
          if (document.visibilityState === "visible") {
            this.auth.checkLevelUp(xpPerSecond); // Adiciona XP
          }
        }, 1000); // Executa a cada segundo
      }
    }
  }

  // Método para parar o XP
  stopXPInterval() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  // Carregar o vídeo
  public loadVideo() {
    this.playSound.playCleanNavigationSound();
    this.isLoading = true;

    this.auth.updateMetaUser({ meta5: true });


    let videoFromUser = '';
    if (this.userChoiceStatus == "youtube") {
      videoFromUser = this.formulario.get('url_youtube')?.value;
      let startIndex = videoFromUser.indexOf("v=") + 2;
      this.videoURL_youtube = videoFromUser.substr(startIndex, 11);
    } else {
      this.videoURL_youtube = this.getRandomVideo(); // Escolhe um aleatório
    }

    this.cdr.detectChanges(); // Força a detecção de mudanças

    // Marca que o vídeo foi carregado
    this.videoCarregado = true;

    // Começa a soma de XP, mas só se estiver na rota /videos
    if (this.router.url === '/videos') {
      this.startXPInterval();
    }
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
