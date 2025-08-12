import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {Subscription} from "rxjs";
import {PlaySoundService} from "../../services/play-sound.service";
import {ModalService} from "../../services/modal.service";
import {animate, transition, trigger} from "@angular/animations";
import {RewardService} from "../../services/reward.service";
import {AuthService} from "../../services/auth.service";
import {MenuItemsService} from "../../services/menu-items.service";
import { EldersRoomGuardiamService } from 'src/app/services/elders-room-guardiam.service';
import {Router} from "@angular/router";


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


@Component({
  selector: 'app-select-quest-modal',
  templateUrl: './select-quest-modal.component.html',
  styleUrls: ['./select-quest-modal.component.css'],
  animations: [
    trigger('iconTransition', [
      transition('* => *', [
        animate('300ms ease')
      ])
    ])
  ]
})
export class SelectQuestModalComponent implements OnInit , OnDestroy, OnChanges{
  isPremium: string = this.authService.getPlano(); //free ou premium
  addNumberGold: number = 0;
  addNumberXP: number = 0;

  private sub!: Subscription;
  modal: boolean = false;
  isClosing: boolean = false;
  animandoSaida = false;
  animandoEntrada = false;
  @Input() currentSubject: string = 'Nenhuma materia definida';

  isButtonDisabled: boolean = false;
  isBouncing: boolean = false; 


  constructor(private playSoundService: PlaySoundService,
              private modalService: ModalService,
              private rewardService: RewardService,
              private authService: AuthService,
              private menuItemService: MenuItemsService,
              private eldersRoomGuardiamService: EldersRoomGuardiamService,
              private router: Router) {

    if (this.isPremium == 'free'){
         this.addNumberGold = 30;
         this.addNumberXP = 30000;
    }


  }


 

 async startMission(questName: any, questSubject: any) {
  if (this.isBouncing) return;
  this.isBouncing = true;

  const isPremiumUser = this.authService.getPlano() === 'premium';
  const battery = this.authService.getBattery();

  interface QuestConfig {
    subject: 'writing' | 'reading' | 'speaking' | 'listening';
    type: 'free' | 'premium';
    route: string;
  }

  const questMap: Record<string, QuestConfig> = {
    'The Correct Word':        { subject: 'writing',  type: 'free',    route: 'writing' },
    'The Secret Word':         { subject: 'reading',  type: 'free',    route: 'reading' },
    'Magic Gramophone':        { subject: 'listening',type: 'free',    route: 'listening' },
    'The right way to speak':  { subject: 'speaking', type: 'free',    route: 'speaking' },

    'Theos Room Writing':      { subject: 'writing',  type: 'premium', route: 'theos_room_writing' },
    'Theos Room Reading':      { subject: 'reading',  type: 'premium', route: 'theos_room_reading' },
    'Theos Room Listening':    { subject: 'listening',type: 'premium', route: 'theos_room_listening' },
    'Theos Room Speaking':     { subject: 'speaking', type: 'premium', route: 'theos_room_speaking' },

    'Doors Secret Writing':    { subject: 'writing',  type: 'premium', route: 'doors_secret_writing' },
    'Doors Secret Reading':    { subject: 'reading',  type: 'premium', route: 'doors_secret_reading' },
    'Doors Secret Listening':  { subject: 'listening',type: 'premium', route: 'doors_secret_listening' },
    'Doors Secret Speaking':   { subject: 'speaking', type: 'premium', route: 'doors_secret_speaking' }
  };

  const quest = questMap[questName];
  if (!quest) {
    console.warn('Missão desconhecida:', questName);
    this.isBouncing = false;
    return;
  }

  if (battery <= 0) {
    console.warn('Sem bateria para acessar a missão');
    this.isBouncing = false;
    return;
  }

  if (quest.type === 'premium' && !isPremiumUser) {
    console.warn('Usuário free tentando acessar missão premium');
    this.isBouncing = false;
    return;
  }

  this.eldersRoomGuardiamService.markAsPaid(quest.subject);
  this.authService.removeBatteryEnergy();
 
 await this.router.navigate([`/${quest.route}`], { skipLocationChange: false });
  
  this.isBouncing = false;
}









  openSelectQuest() {
    if (this.modal) {
      this.animandoSaida = true;
      this.isClosing = true;
      this.playSoundService.playHologram();
    } else {
      this.animandoEntrada = true;
      this.isClosing = false;
      this.modalService.toggleSelectQuestModal();
    }
  }
  onAnimationEnd(event: AnimationEvent) {
    const { animationName } = event;

    if (animationName === 'entrarDaEsquerda') {
      this.animandoEntrada = false;
    }

    if (animationName === 'sairParaEsquerda') {
      this.animandoSaida = false;
      this.modalService.toggleSelectQuestModal();
      this.isClosing = false;
    }
  }
  ngOnInit(): void {
    this.sub = this.modalService.showSelectQuestModal$.subscribe(show => {
      this.modal = show;
    });
    
    // Verificar a bateria quando o componente inicializar
    this.checkBatteryAndUpdateButton();
  }

  // Método para verificar a bateria e atualizar a classe do botão
  checkBatteryAndUpdateButton() {
    const battery = this.authService.getBattery();
    const currentQuest = this.menuItems[this.selectedIndex];
    
    // Verificar se há bateria
    if (battery === 0) {
      this.isButtonDisabled = true;
      return;
    }
    
    // Verificar se o usuário é free e a atividade é premium
    if (this.isPremium === 'free' && currentQuest && currentQuest.free === false) {
      this.isButtonDisabled = true;
      return;
    }
    
    // Se passou por todas as verificações, pode usar o botão normal
    this.isButtonDisabled = false;
  }
  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }





  menuItems: MenuItens[] = [];



  ngOnChanges(changes: SimpleChanges) {
    if (changes['currentSubject']) {
      this.menuItems = this.menuItemService.getMenuItems(this.currentSubject);
      // Verificar bateria e tipo de usuário após carregar novos itens
      this.checkBatteryAndUpdateButton();
    }
  }


















  selectedIndex = 0;
  private touchStartX = 0;
  private touchEndX = 0;

  onTouchStart(event: TouchEvent) {
    this.touchStartX = event.changedTouches[0].screenX;

  }

  onTouchEnd(event: TouchEvent) {
    this.touchEndX = event.changedTouches[0].screenX;
    this.handleSwipe();
  }

  handleSwipe() {
    const swipeDistance = this.touchStartX - this.touchEndX;

    if (Math.abs(swipeDistance) < 30) return; // Ignora toques muito curtos

    if (swipeDistance > 0) {
      // Swipe para a esquerda
      this.swipeLeft();
      this.playSoundService.playPop();
    } else {
      // Swipe para a direita
      this.swipeRight();
      this.playSoundService.playPop();
    }
  }

  swipeLeft() {
    if (this.selectedIndex < this.menuItems.length - 1) {
      this.selectedIndex++;
      // Verificar bateria e tipo de usuário após mudar de atividade
      this.checkBatteryAndUpdateButton();
    }
  }

  swipeRight() {
    if (this.selectedIndex > 0) {
      this.selectedIndex--;
      // Verificar bateria e tipo de usuário após mudar de atividade
      this.checkBatteryAndUpdateButton();
    }
  }

  getItemStyle(index: number) {
    const offset = index - this.selectedIndex;

    const scale = offset === 0 ? 1.5 : 1 - Math.abs(offset) * 0.2;
    const translateX = offset * 80;
    const rotateY = offset * -35;
    const opacity = Math.abs(offset) > 2 ? 0 : 1;
    const zIndex = 10 - Math.abs(offset);

    const blur = Math.abs(offset) === 2 ? '2px' : '0';

    return {
      transform: `
      perspective(1000px)
      translateX(${translateX}px)
      scale(${scale})
      rotateY(${rotateY}deg)
    `,
      opacity,
      zIndex,
      filter: `blur(${blur})`,
      transition: 'transform 0.4s ease, opacity 0.4s ease, filter 0.4s ease'
    };
  }


  selectedQuest: MenuItens | null = null;

  selectQuest(item: MenuItens) {

  }

 
}
