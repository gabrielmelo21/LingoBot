import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  OnDestroy
} from '@angular/core';
import { Router } from "@angular/router";
import { VideoService } from "../../services/video.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  @ViewChild('videoRef') videoElement!: ElementRef<HTMLVideoElement>;
  loading: boolean = true;
  private loadingTimeout: any;

  constructor(
    private router: Router,
    private videoService: VideoService
  ) {}

  ngAfterViewInit(): void {
    const video = this.videoElement.nativeElement;

    console.log('Video readyState inicial:', video.readyState);

    // Definir timeout para redirecionar caso o vídeo não carregue
    this.loadingTimeout = setTimeout(() => {
      if (this.loading) {
        console.log('Video não carregou no tempo esperado, redirecionando...');
        this.router.navigate(['/babel-tower']);
      }
    }, 10000);

    // Carregar o vídeo local (opening.mp4)
    this.videoService.getVideoForPlayer('opening.mp4').then((src) => {
      if (src) {
        video.src = src;
        video.load();

        // Forçar play manualmente
        video.play().catch(err => {
          console.error('Erro ao tentar iniciar o vídeo:', err);
          this.router.navigate(['/babel-tower']);
        });
      } else {
        console.error('Não foi possível carregar o vídeo opening.mp4');
        this.router.navigate(['/babel-tower']);
      }
    });

    // Eventos de carregamento
    video.addEventListener('loadstart', () => {
      console.log('Video começou a carregar');
    });

    video.addEventListener('loadeddata', () => {
      console.log('Video dados carregados');
    });

    video.addEventListener('canplay', () => {
      console.log('Video pronto para tocar');
    });

    video.addEventListener('playing', () => {
      console.log('Video playing');
      this.loading = false;
      this.clearLoadingTimeout();
    });

    video.addEventListener('ended', () => {
      this.router.navigate(['/babel-tower']);
    });

    // Eventos de erro
    video.addEventListener('error', (e) => {
      console.error('Erro no vídeo:', e);
      this.router.navigate(['/babel-tower']);
    });

    video.addEventListener('stalled', () => {
      console.log('Video travado/stalled');
    });
  }

  private clearLoadingTimeout(): void {
    if (this.loadingTimeout) {
      clearTimeout(this.loadingTimeout);
      this.loadingTimeout = null;
    }
  }

  ngOnDestroy(): void {
    this.clearLoadingTimeout();
  }
}
