import { Injectable } from '@angular/core';
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class JackpotService {
  isPremium: string = this.authService.getPlano(); // 'free' ou 'premium'

  constructor(private authService: AuthService) {}

  private chances: { [key: string]: { [key: string]: number } } = {
    free: {
      easy: 0.10,    // 10%
      medium: 0.20,  // 20%
      hard: 0.25,    // 25%
      elder: 0.30    // 30%
    },
    premium: {
      easy: 0.20,    // 20%
      medium: 0.30,  // 30%
      hard: 0.40,    // 40%
      elder: 0.50    // 50%
    }
  };

  isJackpot(): boolean {
    const difficulty = this.authService.getDifficulty();
    const userType = this.isPremium === 'premium' ? 'premium' : 'free';
    const chance = this.chances[userType]?.[difficulty] ?? 0.1;
    return Math.random() < chance;
  }



  getJackpotChanceLabel(premiumView?: boolean): string {
    const difficulty = this.authService.getDifficulty();
    const userType = premiumView ? 'premium' : (this.isPremium === 'premium' ? 'premium' : 'free');
    const chance = this.chances[userType]?.[difficulty] ?? 0.1;

    return `${Math.round(chance * 100)}%`;
  }

}
