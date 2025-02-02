import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PlaySoundService {

  constructor() { }

  playCleanSound(): void {
    this.playAudio('clean sound.mp3');
  }

  playCleanSound2(): void {
    this.playAudio('clean sound 2.mp3');
  }

  playCleanNavigationSound(): void {
    this.playAudio('clean-navigation-sound.mp3');
  }

  playError(): void {
    this.playAudio('error.mp3');
  }

  playErrorQuestion(): void {
    this.playAudio('error-question.mp3');
  }

  playIntroSound2(): void {
    this.playAudio('intro-sound-2-269294.mp3');
  }

  playMessage(): void {
    this.playAudio('message.mp3');
  }

  playNavigation(): void {
    this.playAudio('navigation.mp3');
  }

  playNotification(): void {
    this.playAudio('notification.mp3');
  }

  playNotification1(): void {
    this.playAudio('notification-1-269296.mp3');
  }

  playNotificationOff(): void {
    this.playAudio('notification-off-269282.mp3');
  }

  playNotificationPluckOff(): void {
    this.playAudio('notification-pluck-off-269290.mp3');
  }

  playPop(): void {
    this.playAudio('pop.mp3');
  }

  playWinSound(): void {
    this.playAudio('win sound.mp3');
  }

  playWin2(): void {
    this.playAudio('win2.mp3');
  }

  playSwipe(){
    this.playAudio('swipe.mp3');
  }
  private playAudio(filename: string): void {
    const audio = new Audio(`assets/lingobot/audio-pack/${filename}`);
    audio.play().catch(error => console.error('Error playing sound:', error));
  }
}
