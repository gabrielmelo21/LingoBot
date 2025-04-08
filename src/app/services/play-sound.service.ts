import {Injectable, OnDestroy} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PlaySoundService implements OnDestroy {
  private currentAudio: HTMLAudioElement | null = null; // Mantém referência ao áudio longo


  constructor() { }


  playCitySoundTrack() {
    this.playAudio("soundtrack/city_theme.mp3", false);
  }
  playTowerSoundTrack() {
    this.playAudio("soundtrack/tower_theme.mp3", false);
  }


  playDiscoverExpression() {
    this.playAudio("discover-expression.mp3", false);
  }

  playDesafios() {
    this.playAudio("desafios.mp3", false);
  }

  playDesafiosListening() {
 //   this.playAudio("desafios-listening.mp3", false);
  }

  playDesafiosWriting() {
   // this.playAudio("desafios-writing.mp3", false);
  }

  playDesafiosReading() {
  //  this.playAudio("desafios-reading.mp3", false);
  }

  playEstudarVideos() {
    this.playAudio("estudar-com-videos.mp3", false);
  }

  playEstudarVideos2() {
    this.playAudio("estudar-com-videos2.mp3", false);
  }














  playLevelUp(){
    this.playAudio("level-up.mp3", false);
  }

  playTokenZero(){
    this.playAudio("error2.mp3", false);
  }

  playMagic(): void {
    this.playAudio('magic-sound-effect.mp3', true);
  }


  playCleanSound(): void {
    this.playAudio('clean sound.mp3', true);
  }

  playCleanSound2(): void {
    this.playAudio('clean sound 2.mp3', true);
  }

  playCleanNavigationSound(): void {
    this.playAudio('clean-navigation-sound.mp3', true);
  }

  playError(): void {
    this.playAudio('error.mp3', true);
  }

  playErrorQuestion(): void {
    this.playAudio('error-question.mp3', true);
  }

  playIntroSound2(): void {
    this.playAudio('intro-sound-2-269294.mp3', true);
  }

  playMessage(): void {
    this.playAudio('message.mp3', true);
  }

  playNavigation(): void {
    this.playAudio('navigation.mp3', true);
  }

  playNotification(): void {
    this.playAudio('notification.mp3', true);
  }

  playNotification1(): void {
    this.playAudio('notification-1-269296.mp3', true);
  }

  playNotificationOff(): void {
    this.playAudio('notification-off-269282.mp3', true);
  }

  playNotificationPluckOff(): void {
    this.playAudio('notification-pluck-off-269290.mp3', true);
  }

  playPop(): void {
    this.playAudio('pop.mp3', true);
  }

  playWinSound(): void {
    this.playAudio('win sound.mp3', true);
  }

  playWin2(): void {
    this.playAudio('win2.mp3', true);
  }

  playSwipe() {
    this.playAudio('swipe.mp3', true);
  }

  setVolume(value: number): void {
    if (typeof value === 'number' && isFinite(value)) {
      this.volume = Math.max(0, Math.min(1, value)); // garante que fique entre 0 e 1
      if (this.currentAudio) {
        this.currentAudio.volume = this.volume;
      }
    }
  }

  getVolume(): number {
    return this.volume;
  }





  private volume: number = 0.5; // ajuste aqui o volume padrão entre 0.0 e 1.0

  private playAudio(filename: string, allowOverlap: boolean): void {

    if (!allowOverlap && this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
    }

    const audio = new Audio(`assets/lingobot/audio-pack/${filename}`);
    console.log(`volume from ${filename}: ${audio.volume}`);


     if (filename == "soundtrack/city_theme.mp3" || filename == "soundtrack/tower_theme.mp3") {
       audio.volume = 0.03;
       audio.loop = true; // se for som contínuo
       console.log(`volume: ${audio.volume}`);
     }




    if (!allowOverlap) {
      this.currentAudio = audio;
    }

    audio.play().catch(error => console.error('Erro ao tocar som:', error));
  }



  ngOnDestroy(): void {
    // Para o áudio longo quando o serviço for destruído (ex: mudança de página)
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
    }
  }

  stopAudio(): void {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
    }
  }



}
