import {AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild, OnDestroy} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  @ViewChild('videoRef') videoElement!: ElementRef<HTMLVideoElement>;
  loading: boolean = true;
  private loadingTimeout: any;

  constructor(private router: Router) {}

  ngAfterViewInit(): void {
    const video = this.videoElement.nativeElement;

    console.log('Video readyState:', video.readyState);

    // Definir timeout para redirecionar caso o vídeo não carregue
    this.loadingTimeout = setTimeout(() => {
      if (this.loading) {
        console.log('Video não carregou no tempo esperado, redirecionando...');
        this.router.navigate(['/babel-tower']);
      }
    }, 10000); // 10 segundos - ajuste conforme necessário

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
      // Opcional: redirecionar imediatamente ou esperar um pouco mais
    });

    // Forçar play manualmente
    video.play().catch(err => {
      console.error('Erro ao tentar iniciar o vídeo:', err);
      this.router.navigate(['/babel-tower']);
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
