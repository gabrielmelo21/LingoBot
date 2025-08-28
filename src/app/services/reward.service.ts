  import { Injectable } from '@angular/core';
  import {AuthService} from "./auth.service";
  import {TimersService} from "./timers.service";
  import {PlaySoundService} from "./play-sound.service";


  type Difficulty = 'easy' | 'medium' | 'hard' | 'elder';
  type PremiumStatus = 'free' | 'premium';


  @Injectable({
    providedIn: 'root'
  })
  export class RewardService {
     isPremium: PremiumStatus = this.authService.getPlano(); //free ou premium


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
      this.authService.saveLocalDataOnBackend();

    }

     giveUserItem(){
       this.playSound.playItemDrop();
      this.authService.addRandomItemToUser();
       this.authService.saveLocalDataOnBackend();
     }

    // Multiplicador do premium em relação ao free
    private premiumMultiplier = 5;

    private getMultiplierByRanking(ranking: number): number {
      if (ranking < 4) return 1; // abaixo de 4 não aplica bônus
      const steps = (ranking / 4) - 1; // 4 = step0, 8 = step1, 12 = step2...
      return 1 + (steps * 0.3);
    }

  // Valores base (free)
    private freeRewards: {
      gold: Record<Difficulty, number>,
      xp: Record<Difficulty, number>
    } = {
      gold: { easy: 10, medium: 20, hard: 30, elder: 40 },
      xp: { easy: 2500, medium: 5000, hard: 7500, elder: 10000 }

    };

    private getDifficulty(): Difficulty {
      return this.authService.getDifficulty() as Difficulty;
    }

    private getRankingMultiplier(): number {
      const ranking = this.authService.getRanking();
      return this.getMultiplierByRanking(ranking);
    }

  // Gold atual
    getCurrentGoldReward(): number {
      const diff = this.getDifficulty();
      const base = this.freeRewards.gold[diff] * this.getRankingMultiplier();
      return this.isPremium === 'premium' ? base * this.premiumMultiplier : base;
    }

  // XP atual
    getCurrentXPReward(): number {
      const diff = this.getDifficulty();
      const base = this.freeRewards.xp[diff] * this.getRankingMultiplier();
      return this.isPremium === 'premium' ? base * this.premiumMultiplier : base;
    }

  // Diferença premium - free
    getGoldDifference(): number {
      const diff = this.getDifficulty();
      return this.freeRewards.gold[diff] * this.getRankingMultiplier() * (this.premiumMultiplier - 1);
    }

    getXPDifference(): number {
      const diff = this.getDifficulty();
      return this.freeRewards.xp[diff] * this.getRankingMultiplier() * (this.premiumMultiplier - 1);
    }









    compareCurrentAndNextRewards(
      isPremium: 'free' | 'premium',
      difficulty: Difficulty,
      currentRanking: number
    ): {
      current: { gold: number; xp: number; ranking: number },
      next: { gold: number; xp: number; ranking: number }
    } {
      // pega multiplicador premium
      const premiumMult = isPremium === 'premium' ? this.premiumMultiplier : 1;

      // multiplicador atual
      const currentMult = this.getMultiplierByRanking(currentRanking);
      const currentGold = this.freeRewards.gold[difficulty] * currentMult * premiumMult;
      const currentXP = this.freeRewards.xp[difficulty] * currentMult * premiumMult;

      // próximo ranking
      const nextRanking = currentRanking + 4;
      const nextMult = this.getMultiplierByRanking(nextRanking);
      const nextGold = this.freeRewards.gold[difficulty] * nextMult * premiumMult;
      const nextXP = this.freeRewards.xp[difficulty] * nextMult * premiumMult;

      return {
        current: { gold: Math.floor(currentGold), xp: Math.floor(currentXP), ranking: currentRanking },
        next: { gold: Math.floor(nextGold), xp: Math.floor(nextXP), ranking: nextRanking }
      };
    }


  }
