import {AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {PlaySoundService} from "../../services/play-sound.service";
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {TrilhaService} from "../../services/trilha.service";


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent  implements AfterViewInit {
  @ViewChild('videoRef') videoElement!: ElementRef<HTMLVideoElement>;
  loading: boolean = true;

  constructor(private router: Router) {}

  ngAfterViewInit(): void {
    const video = this.videoElement.nativeElement;

    // Esconde o loading quando o vídeo começar a tocar
    video.addEventListener('playing', () => {
      this.loading = false;
    });

    // Redireciona quando o vídeo terminar
    video.addEventListener('ended', () => {
      this.router.navigate(['/babel-tower']);
    });
  }
}
