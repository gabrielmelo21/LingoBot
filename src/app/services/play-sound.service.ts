import { Injectable, OnDestroy } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PlaySoundService implements OnDestroy {
  private currentAudio: HTMLAudioElement | null = null;
  private activeAudios: HTMLAudioElement[] = [];
  private defaultVolume: number = 0.5;

  constructor() { }

  // SOUNDTRACK METHODS
  playBossFight(loop: boolean = true, volume: string = '10%') {
    this.playAudio("soundtrack/boss_fight2.mp3", false, loop, volume);
  }

  playBossFight2(loop: boolean = true, volume: string = '10%') {
    this.playAudio("soundtrack/boss_fight1.mp3", false, loop, volume);
  }

  playCitySoundTrack(loop: boolean = true, volume: string = '2%') {
    this.playAudio("soundtrack/city_theme.mp3", false, loop, volume);
  }

  playSpeakingFreeSoundTrack(loop: boolean = true, volume: string = '5%') {
    this.playAudio("soundtrack/bass-JRPG-FF7-like-02.mp3", false, loop, volume);
  }

  playReadingTheme(loop: boolean = true, volume: string = '13%') {
    this.playAudio("soundtrack/reading_theme2.mp3", false, loop, volume);
  }

  playTowerSoundTrack(loop: boolean = true, volume: string = '15%') {
    this.playAudio("soundtrack/tower_theme2.mp3", false, loop, volume);
  }

  playPuzzleSolve(loop: boolean = true, volume: string = '13%') {
    this.playAudio("soundtrack/puzzle_solving.mp3", false, loop, volume);
  }

  playListeningSoundTrack(loop: boolean = true, volume: string = '2%') {
    this.playAudio("soundtrack/listening_soundtrack.mp3", false, loop, volume);
  }



  playItemDrop(loop: boolean = false, volume: string = '50%') {
    this.playAudio("item-drop.mp3", false, loop, volume);
  }

  playLevelUp(loop: boolean = false, volume: string = '50%') {
    this.playAudio("level-up.mp3", false, loop, volume);
  }



  // UI SOUNDS
  playCoinDrop(loop: boolean = false, volume: string = '50%') {
    this.playAudio('coin-drop.mp3', true, loop, volume);
  }

  playCleanSound(loop: boolean = false, volume: string = '50%') {
    this.playAudio('clean sound.mp3', true, loop, volume);
  }

  playCleanSound2(loop: boolean = false, volume: string = '50%') {
    this.playAudio('clean sound 2.mp3', true, loop, volume);
  }

  playCleanNavigationSound(loop: boolean = false, volume: string = '50%') {
    this.playAudio('clean-navigation-sound.mp3', true, loop, volume);
  }

  playError(loop: boolean = false, volume: string = '50%') {
    this.playAudio('error.mp3', true, loop, volume);
  }

  playErrorQuestion(loop: boolean = false, volume: string = '50%') {
    this.playAudio('error-question.mp3', true, loop, volume);
  }



 playHologram(loop: boolean = false, volume: string = '50%'){
   this.playAudio('hologram.mp3', true, loop, volume);
 }

  playPop(loop: boolean = false, volume: string = '50%') {
    this.playAudio('pop.mp3', true, loop, volume);
  }

  playWinSound(loop: boolean = false, volume: string = '50%') {
    this.playAudio('win sound.mp3', true, loop, volume);
  }

  playWin2(loop: boolean = false, volume: string = '50%') {
    this.playAudio('win2.mp3', true, loop, volume);
  }

  playSwipe(loop: boolean = false, volume: string = '50%') {
    this.playAudio('swipe.mp3', true, loop, volume);
  }

  playOpenChest(loop: boolean = false, volume: string = '50%') {
    this.playAudio('open-chest.mp3', false, loop, volume);
  }



  // PRIVATE METHODS
  private convertVolumeToNumber(volume: string): number {
    const numericValue = parseFloat(volume.replace('%', ''));
    return Math.max(0, Math.min(100, numericValue)) / 100;
  }

  private playAudio(filename: string, allowOverlap: boolean, loop: boolean = false, volume: string = '50%'): void {
    if (!allowOverlap && this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
    }

    const audio = new Audio(`assets/lingobot/audio-pack/${filename}`);
    audio.volume = this.convertVolumeToNumber(volume);
    audio.loop = loop;

    this.activeAudios.push(audio);

    if (!allowOverlap) {
      this.currentAudio = audio;
    }

    if (!audio.loop) {
      audio.addEventListener('ended', () => {
        this.activeAudios = this.activeAudios.filter(a => a !== audio);
      });
    }

    audio.play().catch(error => console.error('Erro ao tocar som:', error));
  }

  // CONTROL METHODS
  stopAllAudio(): void {
    this.activeAudios.forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });
    this.activeAudios = [];
    this.currentAudio = null;
  }

  stopAudio(): void {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
    }
  }

  ngOnDestroy(): void {
    this.stopAllAudio();
  }
}
