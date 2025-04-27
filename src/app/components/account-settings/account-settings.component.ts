import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {ModalService} from "../../services/modal.service";
import {PlaySoundService} from "../../services/play-sound.service";

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.css']
})
export class AccountSettingsComponent implements OnInit{
  isLoginRoute = false;
  expPercentage: number = 0; // Inicializa a porcentagem
  expNeeded: number = 10000; // Valor padrão inicial
  user: any;  // Variável para armazenar os dados do usuário

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
    this.auth.user$.subscribe(userData => {
      if (!userData) return;
      this.user = userData;
      this.ranking = userData.ranking;

      this.expNeeded = this.auth.getExpNeededForNextLevel();
      this.expPercentage = this.auth.getExpPercentage();

      this.userDifficulty = userData.difficulty;
      this.selectedDifficulty = this.difficulties.find(d => d.id === this.userDifficulty);
    });
  }


  toggleCelularModal() {
    this.playSoundService.playCleanSound2();
    this.modalService.toggleCelularModal();
  }
}
