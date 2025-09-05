import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {VideoService} from "../../../services/video.service";
import {Router} from "@angular/router";
import {VideoControllerService} from "../../../services/video-controller.service";

@Component({
  selector: 'app-theo-quest',
  templateUrl: './theo-quest.component.html',
  styleUrls: ['./theo-quest.component.css']
})
export class TheoQuestComponent implements AfterViewInit{
  loading: boolean = false;
  @ViewChild('videoPlayer', {static: false}) videoPlayer!: ElementRef<HTMLVideoElement>;


  constructor(private videoService: VideoService,
              private router: Router,
              private videoController: VideoControllerService) {

    console.log("quest type:", localStorage.getItem("quest-subject") )


  }


  ngAfterViewInit() {

    setTimeout(() => this.loading = true);
    this.videoController.setup(this.videoPlayer);

    // Só pede o vídeo para o service
    this.videoService.getVideoForPlayer('theo-quest.mp4').then((src) => {
      if (src) {
        this.videoPlayer.nativeElement.src = src;
        this.videoPlayer.nativeElement.load();
        this.setVideoTime("0:00", "00:12");
      }
    });

    this.videoPlayer.nativeElement.addEventListener('playing', () => {
      setTimeout(() => this.loading = false);
    });
  }

 /** VIDEO CONTROLLER **/

 setVideoTime(start: string, end: string) {
   this.videoController.setLoop(start, end);
 }

}
