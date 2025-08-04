import { Injectable } from '@angular/core';
import { RewardService } from './reward.service';
import { AuthService } from './auth.service';





interface MenuItens{
  free?: boolean;
  icon?: string;
  questTitle?: string;
  questDescription?: string;
  questXpReward?: string;
  questGoldReward?: string;
  questJackpotPercentage?: string;
  questStudyGoal?: string;
}



@Injectable({
  providedIn: 'root',
})
export class MenuItemsService {
  constructor(
    private rewardService: RewardService,
    private authService: AuthService
  ) {}

  getMenuItems(subject: string): MenuItens[] {
    const isPremium = this.authService.getPlano(); // 'free' ou 'premium'
    const addNumberGold = isPremium === 'free' ? 30 : 0;
    const addNumberXP = isPremium === 'free' ? 30000 : 0;

    switch (subject) {
      case 'writing':
        return [
          {
            free: true,
            icon: 'assets/lingobot/quests-icons/writing-free.png',
            questTitle: 'A palavra certa?',
            questDescription: 'escolha a opção correta, ',
            questXpReward: this.rewardService.getCurrentXPReward() + 'XP',
            questGoldReward: this.rewardService.getCurrentGoldReward() + 'G',
            questJackpotPercentage: '10%',
            questStudyGoal: "Aumentar Vocabulário"
          },
        ];

      case 'reading':
        return [
          {
            free: true,
            icon: 'assets/lingobot/quests-icons/reading-free.png',
            questTitle: 'The Secret Word',
            questDescription: 'Descubra a palavra passe para abrir o báu com prêmios.',
            questXpReward: this.rewardService.getCurrentXPReward() + 'XP',
            questGoldReward: this.rewardService.getCurrentGoldReward() + 'G',
            questJackpotPercentage: '8%',
            questStudyGoal: "Interpretação Textual"
          },
          {
            free: false,
            icon: 'assets/lingobot/quests-icons/theos-room-premium.png',
            questTitle: "Theos' Room",
            questDescription: 'Alimente o Theo com brocolis e ganhe o báu com prêmios.',
            questXpReward: this.rewardService.getCurrentXPReward() + addNumberXP + 'XP',
            questGoldReward: this.rewardService.getCurrentGoldReward() + addNumberGold + 'G',
            questJackpotPercentage: '50%',
            questStudyGoal: "Aumentar Vocabulário"
          },
        ];

      case 'listening':
        return [
          {
            free: false,
            icon: 'assets/lingobot/quests-icons/listening-free.png',
            questTitle: 'Magic Gramophone',
            questDescription: 'Escute as frases do gramofone para abrir o portão',
            questXpReward: this.rewardService.getCurrentXPReward() + 'XP',
            questGoldReward: this.rewardService.getCurrentGoldReward() + 'G',
            questJackpotPercentage: '9%',
            questStudyGoal: "Compreensão Auditiva",
          },
        ];

      case 'speaking':
        return [
          {
            free: false,
            icon: 'assets/lingobot/quests-icons/speaking-free.png',
            questTitle: 'Pronunciation Practice',
            questDescription: 'Repeat 10 phrases to practice pronunciation.',
            questXpReward: this.rewardService.getCurrentXPReward() + 'XP',
            questGoldReward: this.rewardService.getCurrentGoldReward() + 'G',
            questJackpotPercentage: '12%',
            questStudyGoal: "Construção de Frases da forma certa",
          },
        ];

      default:
        return [];
    }
  }
}
