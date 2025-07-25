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

  // SOUND EFFECTS
  playPadlockLocked(loop: boolean = false, volume: string = '50%') {
    this.playAudio("padlock-locked.mp3", true, loop, volume);
  }

  playDiscoverExpression(loop: boolean = false, volume: string = '50%') {
    this.playAudio("discover-expression.mp3", false, loop, volume);
  }

  playDesafios(loop: boolean = false, volume: string = '50%') {
    this.playAudio("desafios.mp3", false, loop, volume);
  }

  playEstudarVideos(loop: boolean = false, volume: string = '50%') {
    this.playAudio("estudar-com-videos.mp3", false, loop, volume);
  }

  playEstudarVideos2(loop: boolean = false, volume: string = '50%') {
    this.playAudio("estudar-com-videos2.mp3", false, loop, volume);
  }

  playItemDrop(loop: boolean = false, volume: string = '50%') {
    this.playAudio("item-drop.mp3", false, loop, volume);
  }

  playLevelUp(loop: boolean = false, volume: string = '50%') {
    this.playAudio("level-up.mp3", false, loop, volume);
  }

  playTokenZero(loop: boolean = false, volume: string = '50%') {
    this.playAudio("error2.mp3", false, loop, volume);
  }

  playMagic(loop: boolean = false, volume: string = '50%') {
    this.playAudio('magic-sound-effect.mp3', true, loop, volume);
  }

  playPunch(loop: boolean = false, volume: string = '50%') {
    this.playAudio('punch.mp3', true, loop, volume);
  }

  // LINGOBOT TALK
  playLingobotTalkToSlow(loop: boolean = false, volume: string = '50%') {
    this.playAudio("talks/lingobot/too_slow.mp3", true, loop, volume);
  }

  playLingobotTalk1(loop: boolean = false, volume: string = '50%') {
    this.playAudio("talks/lingobot/boom_take_that.mp3", true, loop, volume);
  }

  playLingobotTalk2(loop: boolean = false, volume: string = '50%') {
    this.playAudio("talks/lingobot/i_will_finish_this_quickly.mp3", true, loop, volume);
  }

  playLingobotTalk3(loop: boolean = false, volume: string = '50%') {
    this.playAudio("talks/lingobot/lets_get_this_over_with.mp3", true, loop, volume);
  }

  playLingobotTalk4(loop: boolean = false, volume: string = '50%') {
    this.playAudio("talks/lingobot/take_that.mp3", true, loop, volume);
  }

  playLingobotTalk5(loop: boolean = false, volume: string = '50%') {
    this.playAudio("talks/lingobot/there_you_go.mp3", true, loop, volume);
  }

  playLingobotTalk6(loop: boolean = false, volume: string = '50%') {
    this.playAudio("talks/lingobot/time_to_put_an_end_to_this.mp3", true, loop, volume);
  }

  // ELDERS TALK
  playElderTalkFinal(loop: boolean = false, volume: string = '50%') {
    this.playAudio("talks/elders_talks/finish_talk.mp3", true, loop, volume);
  }

  playElderTalk0(loop: boolean = false, volume: string = '50%') {
    this.playAudio("talks/elders_talks/do_you_wanna_fight.mp3", true, loop, volume);
  }

  playElderTalk1(loop: boolean = false, volume: string = '50%') {
    this.playAudio("talks/elders_talks/fire_on_face.mp3", true, loop, volume);
  }

  playElderTalk2(loop: boolean = false, volume: string = '50%') {
    this.playAudio("talks/elders_talks/i_will_finish_this.mp3", true, loop, volume);
  }

  playElderTalk3(loop: boolean = false, volume: string = '50%') {
    this.playAudio("talks/elders_talks/melt.mp3", true, loop, volume);
  }

  playElderTalk4(loop: boolean = false, volume: string = '50%') {
    this.playAudio("talks/elders_talks/melt_melt.mp3", true, loop, volume);
  }

  playElderTalk5(loop: boolean = false, volume: string = '50%') {
    this.playAudio("talks/elders_talks/take_this.mp3", true, loop, volume);
  }

  // SESSION SOUNDS
  playSessionDefeat(loop: boolean = false, volume: string = '50%') {
    this.playAudio("talks/session/defeat.mp3", true, loop, volume);
  }

  playSessionEldersTurn(loop: boolean = false, volume: string = '50%') {
    this.playAudio("talks/session/elders_turn.mp3", true, loop, volume);
  }

  playSessionVictory(loop: boolean = false, volume: string = '50%') {
    this.playAudio("talks/session/victory2.mp3", true, loop, volume);
  }

  playSessionYourTurn(loop: boolean = false, volume: string = '50%') {
    this.playAudio("talks/session/your_turn.mp3", true, loop, volume);
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

  playIntroSound2(loop: boolean = false, volume: string = '50%') {
    this.playAudio('intro-sound-2-269294.mp3', true, loop, volume);
  }

  playMessage(loop: boolean = false, volume: string = '50%') {
    this.playAudio('message.mp3', true, loop, volume);
  }

  playNavigation(loop: boolean = false, volume: string = '50%') {
    this.playAudio('navigation.mp3', true, loop, volume);
  }

  playNotification(loop: boolean = false, volume: string = '50%') {
    this.playAudio('notification.mp3', true, loop, volume);
  }

  playNotification1(loop: boolean = false, volume: string = '50%') {
    this.playAudio('notification-1-269296.mp3', true, loop, volume);
  }

  playNotificationOff(loop: boolean = false, volume: string = '50%') {
    this.playAudio('notification-off-269282.mp3', true, loop, volume);
  }

  playNotificationPluckOff(loop: boolean = false, volume: string = '50%') {
    this.playAudio('notification-pluck-off-269290.mp3', true, loop, volume);
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

  playChestWin(loop: boolean = false, volume: string = '50%') {
    this.playAudio('chest-win.mp3', true, loop, volume);
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
