import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModalService } from '../../services/modal.service'; // Importar o ModalService
import { Subscription } from 'rxjs';
import {AuthService} from "../../services/auth.service"; // Importar Subscription



interface Achievement {
  id: number;
  title: string;
  description: string;
  towerLevel: number;
  isUnlocked: boolean;
  isOpened: boolean;
}



@Component({
  selector: 'app-achievements',
  templateUrl: './achievements.component.html',
  styleUrls: ['./achievements.component.css']
})
export class AchievementsComponent implements OnInit, OnDestroy {



  currentTowerLevel: number = 0;
  achievements: Achievement[] = [];
  achievementsStatus: any = [];



  modal: boolean = false;
  isClosing: boolean = false;
  animandoSaida = false;
  animandoEntrada = false;
  private modalSubscription!: Subscription; // Para gerenciar a inscrição



  constructor(private modalService: ModalService,
              private authService: AuthService,
              ) { } // Injetar o ModalService



  loadData() {
    this.currentTowerLevel = this.authService.getTowerLevel();
    this.achievementsStatus = this.authService.getAchievements();
  }

  ngOnInit(): void {

    this.loadData();
    this.generateAchievements();


    // Inscrever-se no Observable do ModalService para controlar a visibilidade
    this.modalSubscription = this.modalService.showAchievementsModal$.subscribe(show => {
      this.modal = show;
    });
  }

  ngOnDestroy(): void {
    // Cancelar a inscrição para evitar vazamento de memória
    if (this.modalSubscription) {
      this.modalSubscription.unsubscribe();
    }
  }

  closeAchievementsModal() {
    this.animandoSaida = true;
    this.isClosing = true;
    // Não chame toggleAchievementsModal aqui, pois onAnimationEnd fará isso
  }

  onAnimationEnd(event: AnimationEvent) {
    const { animationName } = event;

    if (animationName === 'entrarDaEsquerda') {
      this.animandoEntrada = false;
    }

    if (animationName === 'sairParaEsquerda') {
      this.animandoSaida = false;
      this.modalService.toggleAchievementsModal(); // Oculta o modal após a saída
      this.isClosing = false;
    }
  }
















  generateAchievements() {
    this.achievements = [];

    // Gerar todos os 55 achievements (começando do level 2)
    for (let i = 0; i < 55; i++) {
      const towerLevel = i + 2; // Começa do level 2
      const achievement: Achievement = {
        id: i,
        title: `Upgrade Tower to Level ${towerLevel}`,
        description: 'Desbloqueie este baú ao atingir o Level necessário!',
        towerLevel: towerLevel,
        isUnlocked: this.currentTowerLevel >= towerLevel,
        isOpened: this.achievementsStatus.achievements[i] || false // Usar o status do authService
      };
      this.achievements.push(achievement);
      console.log(`Achievement ${i}: isUnlocked = ${achievement.isUnlocked}, isOpened = ${achievement.isOpened}`);
    }
  }

  getChestImage(achievement: Achievement): string {
    if (achievement.isOpened) {
      return 'assets/lingobot/itens/chest-open.webp';
    } else {
      return 'assets/lingobot/itens/chest-closed.webp';
    }
  }

  canOpenChest(achievement: Achievement): boolean {
    return achievement.isUnlocked && !achievement.isOpened;
  }

  openChest(achievement: Achievement) {
    if (this.canOpenChest(achievement)) {
      // Marca o achievement como aberto
      this.authService.setAchievements(achievement.id);
      achievement.isOpened = true;

      // Aqui você pode adicionar a lógica para mostrar os efeitos do baú
      // ou chamar o component que já tem os efeitos
    }
  }

  isChestAnimated(achievement: Achievement): boolean {
    return achievement.isUnlocked && !achievement.isOpened;
  }
}
