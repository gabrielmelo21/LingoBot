import {Component, OnInit} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {VideoService} from "../../services/video.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-premium-content-download',
  templateUrl: './premium-content-download.component.html',
  styleUrls: ['./premium-content-download.component.css']
})
export class PremiumContentDownloadComponent  implements OnInit {

  constructor(private videoService: VideoService, private router: Router) {
  }

  currentYear: number = new Date().getFullYear();
  loadingProgress = 0;
  isLoaded = false;
  videos = [
    'theo-quest.mp4',

  ];


  async ngOnInit() {

    const redirect = "/"+localStorage.getItem("redirect_route_after_download");


    let completed = 0;
    const totalVideos = this.videos.length;

    for (const video of this.videos) {
      await this.videoService.downloadVideoWithProgress(video, (progress) => {
        // progress individual de cada vídeo
        this.loadingProgress = Math.round(
          ((completed + progress / 100) / totalVideos) * 100
        );
      });
      completed++;
    }

    this.isLoaded = true;
    console.log('Todos os vídeos foram baixados!');
    this.router.navigate([redirect]);
  }






}
