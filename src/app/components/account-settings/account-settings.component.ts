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

  ngOnInit(): void {
    this.auth.user$.subscribe(userData => {
      if (!userData) return;
      this.user = userData;

      this.expNeeded = this.auth.getExpNeededForNextLevel();
      this.expPercentage = this.auth.getExpPercentage();
    });
  }


  toggleCelularModal() {
    this.playSoundService.playCleanSound2();
    this.modalService.toggleCelularModal();
  }
}
