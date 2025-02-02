import {Component} from '@angular/core';
import {PlaySoundService} from "../../services/play-sound.service";
import {Router} from "@angular/router";




@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {

  constructor(private playSound: PlaySoundService,  private router: Router) {
  }


  navigate_to(number: number) { // Certificar que é number
    this.playSound.playCleanNavigationSound()

    switch (number) {
      case 0: // Ajustado para começar do 0
        this.router.navigate(['/discoverExpressions']);
        break;
      case 1:
        this.router.navigate(['/flashcards']);
        break;
      case 2:
        this.router.navigate(['/videos']);
        break;
      case 3:
        this.router.navigate(['/quests']);
        break;

      default:
        console.warn("Nenhuma rota definida para este índice:", number);
    }
  }



  playHover() {
    this.playSound.playCleanSound();
  }
  playClickSound(){
    this.playSound.playCleanNavigationSound();
  }

  appFeatures = [
    {
      title: 'Desvendar expressões, girías, contrações etc.',
      details: 'Tire dúvidas con LingoBot sobre expressões em inglês que não tem tradução direta',
      icon: 'assets/lingobot/lingobot-livro-na-mao.png'
    },
    {
      title: 'Meus Flashcards',
      details: 'Crie e salve flashcards de novas expressões que você aprender',
      icon: 'assets/lingobot/lingobot-flashcards.png'
    },
    {
      title: 'Estudar com Vídeos',
      details: 'Estude com vídeos de canais recomendados e crie Flashcards e descubra expressões e significados.',
      icon: 'assets/lingobot/lingobot-assistindo.png'
    },
    {
      title: 'Desafios do LingoBot',
      details: 'Resolva desafios propostos pelo LingoBot e acumule LingoPoints',
      icon: 'assets/lingobot/lingobot-desafios.png'
    },
    {
      title: 'Tire suas dúvidas com LingoBot',
      details: 'Converse com LingoBot e tire suas dúvidas e questões',
      icon: 'assets/lingobot/lingo-bot-walking-transparent.png'
    },
    {
      title: 'Check-In Diário',
      details: 'Visite o LingoBot diáriamente e ganhe LingoPoints',
      icon: 'assets/lingobot/lingobot-calendario.png'
    }
  ];

}
