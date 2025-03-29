import {Component, HostListener} from '@angular/core';
import {PlaySoundService} from "../../services/play-sound.service";
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";




@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  animateImage = false; // Controla a animação

  // Método que ativa a animação
  startAnimation() {
    this.animateImage = true; // Define animateImage como true para ativar a animação
  }








  deferredPrompt: any;

  cena: number = 0; // img static

  @HostListener('window:beforeinstallprompt', ['$event'])
  onBeforeInstallPrompt(event: Event) {
    event.preventDefault();
    this.deferredPrompt = event;
  }

  installPWA() {
    if (this.deferredPrompt) {
      this.deferredPrompt.prompt();
      this.deferredPrompt.userChoice.then((choiceResult: { outcome: string }) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('Usuário aceitou a instalação');
        } else {
          console.log('Usuário recusou a instalação');
        }
        this.deferredPrompt = null;
      });
    }
  }

  constructor(private playSound: PlaySoundService,  private router: Router, private auth: AuthService) {
  }


  checkLevelUp(newExp: number): void {
    this.auth.checkLevelUp(newExp);
    this.auth.getExpPercentage();
  }


  navigate_to(number: number) { // Certificar que é number
    this.playSound.playCleanNavigationSound()

    switch (number) {
      case 0: // Ajustado para começar do 0
        this.router.navigate(['/discoverExpressions']);
        break;
      case 1:
        this.router.navigate(['/quests']);

        break;
      case 2:
        this.router.navigate(['/videos']);
        break;
      case 31:
     this.router.navigate(['/flashcards']);
        break;
      case 4:
        this.router.navigate(['/ranking']);
        break;
      case 5:
        this.router.navigate(['/check-in']);
        break;
      case 6:
        this.router.navigate(['/planos']);
        break;
      case 71:
        this.router.navigate(['/referral']);
        break;
      case 8:
        this.router.navigate(['/settings']);
        break;
      case 81:
        this.router.navigate(['/missoes-diarias']);
        break;
      case 132:
        this.router.navigate(['/desafios-iniciante']);
        break;
      case 432:
        this.router.navigate(['/trilha']);
       break;


      default:
        console.warn("Nenhuma rota definida para este índice:", number);
    }
  }





  onMouseEnter() {
    this.playSound.playCleanSound();
  }


  appFeatures = [
    {
      title: 'Desvendar expressões, girías, contrações etc.',
      details: 'Tire dúvidas con LingoBot sobre expressões em inglês que não tem tradução direta',
      icon: 'assets/lingobot/lingobot-desafios.png'
    },
    {
      title: 'Desafios do LingoBot',
      details: 'Resolva desafios propostos pelo LingoBot e acumule LingoEXP',
      icon: 'assets/lingobot/lingobot-livro-na-mao.png'
    },
    {
      title: 'Estudar com Vídeos',
      details: 'Estude com vídeos de canais recomendados e crie Flashcards e descubra expressões e significados.',
      icon: 'assets/lingobot/lingobot-assistindo.png'
    },
    {
      title: 'Meus Flashcards (Coming Soon)',
      details: 'Crie e salve flashcards de novas expressões que você aprender',
      icon: 'assets/lingobot/lingobot-flashcards.png'
    },
    {
      title: 'Ranking (Coming Soon)',
      details: 'Acumule LingoEXP e suba no Ranking Global',
      icon: 'assets/lingobot/lingobot-competindo.png'
    },
    {
      title: 'Check-In Diário',
      details: 'Visite o LingoBot diáriamente e ganhe LXP e LingoTokens',
      icon: 'assets/lingobot/lingobot-calendario.png'
    }
  ];

  /**
   *  Mais opções que deve ter
   *  Configurações de conta
   *  Assinatura - se é a versão free
   */

  tirarMoedas() {
    //this.auth.decreseToken(1000)
    this.auth.decreaseLocalUserData({ tokens: 1000 });
    this.auth.checkTokens()

  }

  colocarMoedas() {
    this.auth.updateLocalUserData({ tokens: 1000 });
  }

  goto_step3() {
    this.router.navigate(['/step3']);
  }

  goto_step4() {
    this.router.navigate(['/step4']);
  }

  goto() {
    this.router.navigate(['/skills']);
  }
}
