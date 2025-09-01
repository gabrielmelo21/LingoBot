import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { VideoService } from '../../services/video.service';

@Component({
  selector: 'app-upgrade-tower-video',
  templateUrl: './upgrade-tower-video.component.html',
  styleUrls: ['./upgrade-tower-video.component.css']
})
export class UpgradeTowerVideoComponent implements AfterViewInit {
  @ViewChild('videoRef') videoElement!: ElementRef<HTMLVideoElement>;
  loading: boolean = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private videoService: VideoService
  ) {}

  ngAfterViewInit(): void {
    // Verifica a flag de animação no momento certo
    const upgradeAnimation = localStorage.getItem("upgradeAnimation");

    if (upgradeAnimation !== null && upgradeAnimation === "true") {
      localStorage.setItem("upgradeAnimation", "false");
      localStorage.setItem("newFloorAnimation", "true");

      const currentRanking = this.authService.getRanking();
      const newRanking = currentRanking + 4;
      const firstNewFloor = Math.abs(newRanking - 3);

      this.authService.updateLocalUserData({ ranking: newRanking });
      console.log("novo ranking -> " + this.authService.getRanking());
      localStorage.setItem("andarAtual", firstNewFloor.toString());

      const video = this.videoElement.nativeElement;

      // Carregar o vídeo local
      this.videoService.getVideoForPlayer('up_tower-compress.mp4').then((src) => {
        if (src) {
          video.src = src;
          video.load();

          // Força play manualmente
          video.play().catch(err => {
            console.error('Erro ao tentar iniciar o vídeo:', err);
            this.router.navigate(['/tower']);
          });
        } else {
          console.error('Não foi possível carregar o vídeo up_tower-compress.mp4');
          this.router.navigate(['/tower']);
        }
      });

      // Eventos de vídeo
      video.addEventListener('playing', () => {
        this.loading = false;
      });

      video.addEventListener('ended', () => {
        this.router.navigate(['/tower']);
      });

      video.addEventListener('error', (e) => {
        console.error('Erro no vídeo:', e);
        this.router.navigate(['/tower']);
      });

    } else if (upgradeAnimation === "false") {
      this.router.navigate(['/tower']);
    }
  }
}
