import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upgrade-tower-video',
  templateUrl: './upgrade-tower-video.component.html',
  styleUrls: ['./upgrade-tower-video.component.css']
})
export class UpgradeTowerVideoComponent implements AfterViewInit {
  @ViewChild('videoRef') videoElement!: ElementRef<HTMLVideoElement>;
  loading: boolean = true;

  constructor(private authService: AuthService, private router: Router) {}

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

      // Adiciona eventos corretamente
      video.addEventListener('playing', () => {
        this.loading = false;
      });

      video.addEventListener('ended', () => {
        this.router.navigate(['/tower']);
      });

      // Força a reprodução caso o autoplay falhe (em alguns navegadores)
      video.play().catch(err => {
        console.error('Erro ao tentar dar play no vídeo:', err);
      });

    } else if (upgradeAnimation === "false") {
      this.router.navigate(['/tower']);
    }
  }
}
