import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {ModalService} from "../../services/modal.service";
import {PlaySoundService} from "../../services/play-sound.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.css']
})
export class AccountSettingsComponent implements OnInit, OnDestroy{

  isLoginRoute = false;
  expPercentage: number = 0; // Inicializa a porcentagem
  expNeeded: number = 10000; // Valor padrão inicial
  userName: string =  '';
  userLevel: string =  '';
  userLingoEXP: string =  '';


  private sub!: Subscription;
  modal: boolean = false;
  isClosing: boolean = false;
  animandoSaida = false;
  animandoEntrada = false;


  openUserStats() {
    if (this.modal) {
      this.animandoSaida = true;
      this.isClosing = true;
      this.playSoundService.playHologram();
    } else {
      this.animandoEntrada = true;
      this.isClosing = false;
      this.modalService.toggleUserInfosModal(); // exibe o modal
    }
  }

  onAnimationEnd(event: AnimationEvent) {
    const { animationName } = event;

    if (animationName === 'entrarDaEsquerda') {
      this.animandoEntrada = false;
    }

    if (animationName === 'sairParaEsquerda') {
      this.animandoSaida = false;
      this.modalService.toggleUserInfosModal(); // oculta o modal após a saída
      this.isClosing = false;
    }
  }








  constructor(private router: Router,
              private auth: AuthService,
              private modalService: ModalService,
              private playSoundService: PlaySoundService,
  ) {
    this.router.events.subscribe(() => {
      this.isLoginRoute = this.router.url === '/login';
    });
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


  userDifficulty: string = ''; // Ex: 'easy', 'medium'...
  selectedDifficulty: any;
  ranking: number = 0;


  ngOnInit(): void {

    this.sub = this.modalService.showUserInfosModal$.subscribe(show => {

      this.modal = show;
    });




      this.ranking =  this.auth.getRanking();
      this.userName = this.auth.getUserName();
      this.userLevel = this.auth.getUserLevel();
      this.userLingoEXP = this.auth.getLingoEXP();


      this.expNeeded = this.auth.getExpNeededForNextLevel();
      this.expPercentage = this.auth.getExpPercentage();
      this.userDifficulty = this.auth.getDifficulty();
      this.selectedDifficulty = this.difficulties.find(d => d.id === this.userDifficulty);

  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }


}
