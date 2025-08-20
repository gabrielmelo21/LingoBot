import { ElementRef, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VideoControllerService {
  private video!: HTMLVideoElement;
  private loopStart = 0;
  private loopEnd = 0;
  private finalEnd = 0;
  private isLooping = false;
  private previousTime = 0;
  private currentActionListener: (() => void) | null = null;

  setup(videoElementRef: ElementRef<HTMLVideoElement>) {
    this.video = videoElementRef.nativeElement;
  }

  setLoop(start: number | string, end: number | string) {
    this.loopStart = this.convertToSeconds(start);
    this.loopEnd = this.convertToSeconds(end);
    this.isLooping = true;

    this.removeCurrentListener();

    this.currentActionListener = () => {
      if (this.isLooping && this.video.currentTime >= this.loopEnd) {
        this.video.currentTime = this.loopStart;
        this.video.play();
      }
    };

    this.video.addEventListener('timeupdate', this.currentActionListener);
    this.video.currentTime = this.loopStart;
    this.video.play();
  }

  setStaticLoop(start: number | string, end: number | string) {
    this.mute();
    this.clearLoop();
    this.setLoop(start, end);
  }

  clearLoop() {
    this.isLooping = false;
    this.removeCurrentListener();
  }

  playSegment(start: number | string, end: number | string, callback?: () => void) {
    this.loopStart = this.convertToSeconds(start);
    this.finalEnd = this.convertToSeconds(end);
    this.previousTime = this.video.currentTime;

    this.clearLoop();
    this.removeCurrentListener();

    this.currentActionListener = () => {
      if (this.video.currentTime >= this.finalEnd) {
        this.video.pause();
        this.video.removeEventListener('timeupdate', this.currentActionListener!);

        this.video.currentTime = this.previousTime;
        this.video.play();

        this.isLooping = true;
        if (callback) callback();
      }
    };

    this.video.addEventListener('timeupdate', this.currentActionListener);

    this.video.currentTime = this.loopStart;
    this.video.play();
  }

  goTo(time: number | string) {
    const timeInSeconds = this.convertToSeconds(time);
    this.video.currentTime = timeInSeconds;
    this.video.play();
  }

  // ✅ Novo método para pausar no tempo exato
  pauseAt(time: number | string) {
    const timeInSeconds = this.convertToSeconds(time);
    this.clearLoop(); // para garantir que não tem loop ativo
    this.removeCurrentListener();
    this.video.currentTime = timeInSeconds;
    this.video.pause();
  }

  mute() {
    if (this.video) {
      this.video.muted = true;
      console.log("video muted", this.video.muted);
    }
  }

  unmute() {
    if (this.video) {
      this.video.muted = false;
      console.log("video muted", this.video.muted);
    }
  }

  private toSeconds(time: string): number {
    const [minStr, secStr] = time.split(':');
    const min = Number(minStr);
    const sec = Number(secStr);
    return min * 60 + sec;
  }

  private convertToSeconds(value: number | string): number {
    return typeof value === 'string' ? this.toSeconds(value) : value;
  }

  private removeCurrentListener() {
    if (this.currentActionListener) {
      this.video.removeEventListener('timeupdate', this.currentActionListener);
      this.currentActionListener = null;
    }
  }
}
