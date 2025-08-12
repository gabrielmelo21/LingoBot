import { Injectable } from '@angular/core';
import {AuthService} from "./auth.service";
import {TimersService} from "./timers.service";
import {PlaySoundService} from "./play-sound.service";

@Injectable({
  providedIn: 'root'
})
export class RewardService {
   isPremium: string = this.authService.getPlano(); //free ou premium


  constructor(
    private authService: AuthService,
    private timersService: TimersService,
    private playSound: PlaySoundService
  ) {

  }

  giveUserRewards(isJackpot: boolean, materia: string, gold?: number, xp?: number) {
    const multiplier = isJackpot ? 2 : 1;

    if (gold == null || xp == null) {
      this.authService.checkLevelUp(this.getCurrentXPReward() * multiplier);
      this.authService.updateLocalUserData({ tokens: this.getCurrentGoldReward() * multiplier });
    } else {
      this.authService.checkLevelUp(xp * multiplier);
      this.authService.updateLocalUserData({ tokens: gold * multiplier });
    }






    this.authService.addXpSkills(materia);
    this.timersService.updateMission(materia);

  }

   giveUserItem(){ 
     this.playSound.playItemDrop();
    this.authService.addRandomItemToUser();
   }




  getCurrentGoldReward(): any{
   if (this.isPremium === 'free'){
     switch (this.authService.getDifficulty()) {
       case 'easy':
         return 10
       case 'medium':
         return 20
       case 'hard':
         return 30
       case 'elder':
         return 40
     }
   }
   if (this.isPremium === 'premium'){
     switch (this.authService.getDifficulty()) {
       case 'easy':
         return 40
       case 'medium':
         return 50
       case 'hard':
         return 60
       case 'elder':
         return 70
     }
   }
  }

  getCurrentXPReward(): any {
    if (this.isPremium === 'free') {
      switch (this.authService.getDifficulty()) {
        case 'easy':
          return 10000;
        case 'medium':
          return 20000;
        case 'hard':
          return 30000;
        case 'elder':
          return 40000;
      }
    }
    if (this.isPremium === 'premium') {
      switch (this.authService.getDifficulty()) {
        case 'easy':
          return 40000;
        case 'medium':
          return 50000;
        case 'hard':
          return 60000;
        case 'elder':
          return 70000;
      }
    }
  }


  showQuestXPReward() {

  }
  showQuestGoldReward() {

  }


}
