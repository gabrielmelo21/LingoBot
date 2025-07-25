import { Injectable } from '@angular/core';
import {AuthService} from "./auth.service";
import {TimersService} from "./timers.service";
import {PlaySoundService} from "./play-sound.service";

@Injectable({
  providedIn: 'root'
})
export class RewardService {

  constructor(
    private authService: AuthService,
    private timersService: TimersService,
    private playSound: PlaySoundService
  ) {}

  giveUserRewards(finalXpReward: number, finalGoldReward: number, materia: string) {
    this.authService.checkLevelUp(finalXpReward);
    this.authService.updateLocalUserData({ tokens: finalGoldReward });
    this.authService.addXpSkills(materia);
    this.timersService.updateMission(materia);
    this.playSound.playItemDrop();
    this.authService.addRandomItemToUser();
  }

}
