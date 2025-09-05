import { Injectable } from '@angular/core';
import { RewardService } from './reward.service';
import { AuthService } from './auth.service';
import {JackpotService} from "./jackpot.service";





interface MenuItens{
  free?: boolean;
  icon?: string;
  questTitle?: string;
  questDescription?: string;
  questXpReward?: string;
  questGoldReward?: string;
  questJackpotPercentage?: string;
  questStudyGoal?: string;
  questSubject?: string;
}



@Injectable({
  providedIn: 'root',
})
export class MenuItemsService {
  constructor(
    private rewardService: RewardService,
    private authService: AuthService,
    private jackpotService: JackpotService
  ) {}

  getMenuItems(subject: string): MenuItens[] {
    const isPremium = this.authService.getPlano(); // 'free' ou 'premium'
    const addNumberGold = isPremium === 'free' ? this.rewardService.getGoldDifference() : 0;
    const addNumberXP = isPremium === 'free' ? this.rewardService.getXPDifference() : 0;

    switch (subject) {
      case 'writing':
        return [
          {
            free: true,
            icon: 'assets/lingobot/quests-icons/writing-free.webp',
            questTitle: 'The Correct Word',
            questDescription: 'Escolha a palavra certa tanto inglês/português ',
            questXpReward: this.rewardService.getCurrentXPReward() + 'XP',
            questGoldReward: this.rewardService.getCurrentGoldReward() + 'G',
            questJackpotPercentage: this.jackpotService.getJackpotChanceLabel(),
            questStudyGoal: "Aumentar Vocabulário",
            questSubject: "writing"
          },
          {
            free: false,
            icon: 'assets/lingobot/quests-icons/theo-quest-premium.webp',
            questTitle: "Theo Quest Writing",
            questDescription: 'Alimente o Theo com maçãs e ganhe o báu com prêmios.',
            questXpReward: this.rewardService.getCurrentXPReward() + addNumberXP + 'XP',
            questGoldReward: this.rewardService.getCurrentGoldReward() + addNumberGold + 'G',
            questJackpotPercentage: this.jackpotService.getJackpotChanceLabel(true),
            questStudyGoal: "Aumentar Vocabulário",
            questSubject: "writing"
          },
          {
            free: false,
            icon: 'assets/lingobot/quests-icons/the-doors-secret.webp',
            questTitle: "The Door's Secret",
            questDescription: 'Descubra o Phrasal Verb correto para abrir as portas e ganhar prêmios',
            questXpReward: this.rewardService.getCurrentXPReward() + addNumberXP + 'XP',
            questGoldReward: this.rewardService.getCurrentGoldReward() + addNumberGold + 'G',
            questJackpotPercentage: this.jackpotService.getJackpotChanceLabel(true),
            questStudyGoal: "Aprenda Phrsal Verbs",
            questSubject: "writing"
          },
        ];

      case 'reading':
        return [
          {
            free: true,
            icon: 'assets/lingobot/quests-icons/reading-free.webp',
            questTitle: 'The Secret Word',
            questDescription: 'Descubra a palavra passe para abrir o báu com prêmios.',
            questXpReward: this.rewardService.getCurrentXPReward() + 'XP',
            questGoldReward: this.rewardService.getCurrentGoldReward() + 'G',
            questJackpotPercentage: this.jackpotService.getJackpotChanceLabel(),
            questStudyGoal: "Interpretação Textual",
            questSubject: "reading"
          },
          {
            free: false,
            icon: 'assets/lingobot/quests-icons/theo-quest-premium.webp',
            questTitle: "Theo Quest Reading",
            questDescription: 'Alimente o Theo com maçãs e ganhe o báu com prêmios.',
            questXpReward: this.rewardService.getCurrentXPReward() + addNumberXP + 'XP',
            questGoldReward: this.rewardService.getCurrentGoldReward() + addNumberGold + 'G',
            questJackpotPercentage: this.jackpotService.getJackpotChanceLabel(true),
            questStudyGoal: "Aumentar Vocabulário",
            questSubject: "reading"
          },
          {
            free: false,
            icon: 'assets/lingobot/quests-icons/the-doors-secret.webp',
            questTitle: "The Door's Secret",
            questDescription: 'Descubra o Phrasal Verb correto para abrir as portas e ganhar prêmios',
            questXpReward: this.rewardService.getCurrentXPReward() + addNumberXP + 'XP',
            questGoldReward: this.rewardService.getCurrentGoldReward() + addNumberGold + 'G',
            questJackpotPercentage: this.jackpotService.getJackpotChanceLabel(true),
            questStudyGoal: "Aprenda Phrsal Verbs",
            questSubject: "reading"
          },
        ];

      case 'listening':
        return [
          {
            free: true,
            icon: 'assets/lingobot/quests-icons/listening-free.webp',
            questTitle: 'Magic Gramophone',
            questDescription: 'Escute as frases do gramofone para abrir o portão',
            questXpReward: this.rewardService.getCurrentXPReward() + 'XP',
            questGoldReward: this.rewardService.getCurrentGoldReward() + 'G',
            questJackpotPercentage: this.jackpotService.getJackpotChanceLabel(),
            questStudyGoal: "Compreensão Auditiva",
            questSubject: "listening"
          },
          {
            free: false,
            icon: 'assets/lingobot/quests-icons/theo-quest-premium.webp',
            questTitle: "Theo Quest Listening",
            questDescription: 'Alimente o Theo com maçãs e ganhe o báu com prêmios.',
            questXpReward: this.rewardService.getCurrentXPReward() + addNumberXP + 'XP',
            questGoldReward: this.rewardService.getCurrentGoldReward() + addNumberGold + 'G',
            questJackpotPercentage: this.jackpotService.getJackpotChanceLabel(true),
            questStudyGoal: "Aumentar Vocabulário",
            questSubject: "listening"
          },
          {
            free: false,
            icon: 'assets/lingobot/quests-icons/the-doors-secret.webp',
            questTitle: "The Door's Secret",
            questDescription: 'Descubra o Phrasal Verb correto para abrir as portas e ganhar prêmios',
            questXpReward: this.rewardService.getCurrentXPReward() + addNumberXP + 'XP',
            questGoldReward: this.rewardService.getCurrentGoldReward() + addNumberGold + 'G',
            questJackpotPercentage: this.jackpotService.getJackpotChanceLabel(true),
            questStudyGoal: "Aprenda Phrsal Verbs",
            questSubject: "listening"
          },
        ];

      case 'speaking':
        return [
          {
            free: true,
            icon: 'assets/lingobot/quests-icons/speaking-free.webp',
            questTitle: 'The right way to speak',
            questDescription: 'Escolha entre duas cartas a maneira correta de falar',
            questXpReward: this.rewardService.getCurrentXPReward() + 'XP',
            questGoldReward: this.rewardService.getCurrentGoldReward() + 'G',
            questJackpotPercentage: this.jackpotService.getJackpotChanceLabel(),
            questStudyGoal: "Construção de Frases da forma certa",
            questSubject: "speaking"
          },
          {
            free: false,
            icon: 'assets/lingobot/quests-icons/theo-quest-premium.webp',
            questTitle: "Theo Quest Speaking",
            questDescription: 'Alimente o Theo com maçãs e ganhe o báu com prêmios.',
            questXpReward: this.rewardService.getCurrentXPReward() + addNumberXP + 'XP',
            questGoldReward: this.rewardService.getCurrentGoldReward() + addNumberGold + 'G',
            questJackpotPercentage: this.jackpotService.getJackpotChanceLabel(true),
            questStudyGoal: "Aumentar Vocabulário",
            questSubject: "speaking"
          },
          {
            free: false,
            icon: 'assets/lingobot/quests-icons/the-doors-secret.webp',
            questTitle: "The Door's Secret",
            questDescription: 'Descubra o Phrasal Verb correto para abrir as portas e ganhar prêmios',
            questXpReward: this.rewardService.getCurrentXPReward() + addNumberXP + 'XP',
            questGoldReward: this.rewardService.getCurrentGoldReward() + addNumberGold + 'G',
            questJackpotPercentage: this.jackpotService.getJackpotChanceLabel(true),
            questStudyGoal: "Aprenda Phrsal Verbs",
            questSubject: "speaking"
          },
        ];

      default:
        return [];
    }
  }
}
