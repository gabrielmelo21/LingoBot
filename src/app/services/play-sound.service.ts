import {Injectable, OnDestroy} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PlaySoundService implements OnDestroy {
  private currentAudio: HTMLAudioElement | null = null; // Mantém referência ao áudio longo
  private activeAudios: HTMLAudioElement[] = [];


  constructor() { }


  playBossFight() {
    this.playAudio("soundtrack/boss_fight2.mp3", false);
  }
  playBossFight2() {
    this.playAudio("soundtrack/boss_fight1.mp3", false);
  }


  playCitySoundTrack() {
    this.playAudio("soundtrack/city_theme.mp3", false);
  }
  playReadingTheme(){
    this.playAudio("soundtrack/reading_theme.mp3", false);
  }
  playTowerSoundTrack() {
    this.playAudio("soundtrack/tower_theme2.mp3", false);
  }

  playPuzzleSolve() {
    this.playAudio("soundtrack/puzzle_solving.mp3", false);
  }

  playListeningSoundTrack() {
    this.playAudio("soundtrack/listening_soundtrack.mp3", false);
  }



  playPadlockLocked(){
    this.playAudio("padlock-locked.mp3", true);
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









  playItemDrop(){
    this.playAudio("item-drop.mp3", false);
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


  playPunch(): void {
    this.playAudio('punch.mp3', true);
  }






  // LINGOBOT TALK

   playLingobotTalkToSlow(){
     this.playAudio("talks/lingobot/too_slow.mp3", true);
   }

  playLingobotTalk1() {
    this.playAudio("talks/lingobot/boom_take_that.mp3", true);
  }

  playLingobotTalk2() {
    this.playAudio("talks/lingobot/i_will_finish_this_quickly.mp3", true);
  }

  playLingobotTalk3() {
    this.playAudio("talks/lingobot/lets_get_this_over_with.mp3", true);
  }

  playLingobotTalk4() {
    this.playAudio("talks/lingobot/take_that.mp3", true);
  }

  playLingobotTalk5() {
    this.playAudio("talks/lingobot/there_you_go.mp3", true);
  }

  playLingobotTalk6() {
    this.playAudio("talks/lingobot/time_to_put_an_end_to_this.mp3", true);
  }






//ELDERS TALK
  playElderTalkFinal(){
    this.playAudio("talks/elders_talks/finish_talk.mp3", true);
  }
  playElderTalk0(){
     this.playAudio("talks/elders_talks/do_you_wanna_fight.mp3", true);
  }
  playElderTalk1() {
    this.playAudio("talks/elders_talks/fire_on_face.mp3", true);
  }

  playElderTalk2() {
    this.playAudio("talks/elders_talks/i_will_finish_this.mp3", true);
  }

  playElderTalk3() {
    this.playAudio("talks/elders_talks/melt.mp3", true);
  }

  playElderTalk4() {
    this.playAudio("talks/elders_talks/melt_melt.mp3", true);
  }

  playElderTalk5() {
    this.playAudio("talks/elders_talks/take_this.mp3", true);
  }

  // SESSION

  playSessionDefeat() {
    this.playAudio("talks/session/defeat.mp3", true);
  }

  playSessionEldersTurn() {
    this.playAudio("talks/session/elders_turn.mp3", true);
  }

  playSessionVictory() {
    this.playAudio("talks/session/victory2.mp3", true);
  }

  playSessionYourTurn() {
    this.playAudio("talks/session/your_turn.mp3", true);
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

  playOpenChest(){
     this.playAudio('open-chest.mp3', false);
  }
  playChestWin(){
     this.playAudio('chest-win.mp3', true);
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

    if (filename === "soundtrack/tower_theme2.mp3") {
      audio.volume = 0.15;
      audio.loop = true;
    }

    if (filename === "soundtrack/city_theme.mp3"
      || filename === "soundtrack/listening_soundtrack.mp3") {
      audio.volume = 0.02;
      audio.loop = true;
    } else if (filename === "soundtrack/puzzle_solving.mp3"
      || filename === "soundtrack/reading_theme.mp3") {
      audio.volume = 0.13;
      audio.loop = true;
    } else if (filename === "soundtrack/boss_fight2.mp3") {
      audio.volume = 0.10;
      audio.loop = true;
    } else {
      audio.volume = this.volume;
    }

    // Armazena o áudio para parar depois
    this.activeAudios.push(audio);

    // Define currentAudio apenas se não permite sobreposição
    if (!allowOverlap) {
      this.currentAudio = audio;
    }

    // Remove da lista quando o áudio termina (se não for loop)
    if (!audio.loop) {
      audio.addEventListener('ended', () => {
        this.activeAudios = this.activeAudios.filter(a => a !== audio);
      });
    }

    audio.play().catch(error => console.error('Erro ao tocar som:', error));
  }

  stopAllAudio(): void {
    this.activeAudios.forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });
    this.activeAudios = [];
    this.currentAudio = null;
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
