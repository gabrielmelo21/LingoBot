import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {PlaySoundService} from "../../services/play-sound.service";
import {ModalService} from "../../services/modal.service";
import {AuthService} from "../../services/auth.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit, OnDestroy {

  selectedDifficult: string = '';
  user: any;

  constructor(private playSound: PlaySoundService,
              private modalService: ModalService,
              private authService: AuthService,
              private cdr: ChangeDetectorRef) {

    this.selectedDifficult = this.authService. getDifficulty();

  }


  ngOnInit(): void {
    this.sub = this.modalService.showSettingsModal$.subscribe(show => {
      this.modal = show;
    });
  }
  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }



  private sub!: Subscription;
  modal: boolean = false;
  isClosing: boolean = false;


  animandoSaida = false;
  animandoEntrada = false;


  openSettings() {
    if (this.modal) {
      this.animandoSaida = true;
      this.isClosing = true;
      this.playSound.playHologram();
    } else {
      this.animandoEntrada = true;
      this.isClosing = false;
      this.modalService.toggleSettingsModal(); // exibe o modal
    }
  }

  onAnimationEnd(event: AnimationEvent) {
    const { animationName } = event;

    if (animationName === 'entrarDaEsquerda') {
      this.animandoEntrada = false;
    }

    if (animationName === 'sairParaEsquerda') {
      this.animandoSaida = false;
      this.modalService.toggleSettingsModal(); // oculta o modal após a saída
      this.isClosing = false;
    }
  }





  difficulties = [
    {
      id: 'easy',
      img: 'assets/lingobot/dificuldades/baby_bot.png',
      title: 'Baby Bot',
      description: 'Ideal para iniciantes, exercícios com inglês básico.'
    },
    {
      id: 'medium',
      img: 'assets/lingobot/dificuldades/young_bot.png',
      title: 'Young Bot',
      description: 'Um bom desafio. exercícios com inglês nível médio.'
    },
    {
      id: 'hard',
      img: 'assets/lingobot/dificuldades/adult_bot.png',
      title: 'Adult Bot',
      description: 'Requer habilidade. exercícios com inglês intermediário e expressões'
    },
    {
      id: 'elder',
      img: 'assets/lingobot/dificuldades/elder_bot.png',
      title: 'Elder Bot',
      description: 'Apenas para os Anciões. exercícios com inglês nativo.'
    },
  ];
  changeDifficult(newDifficulty: string) {
    this.selectedDifficult = newDifficulty;
    this.authService.updateLocalUserData({ difficulty : newDifficulty})
    this.playSound.playCleanSound()
    console.log('Dificuldade selecionada:', newDifficulty);
    this.cdr.detectChanges();

  }

}
