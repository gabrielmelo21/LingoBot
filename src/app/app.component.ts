import {Component, HostListener, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, NavigationStart, Router} from "@angular/router";
import {AuthService} from "./services/auth.service";
import {PlaySoundService} from "./services/play-sound.service";

import {Subscription} from "rxjs";
import {ModalService} from "./services/modal.service";



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit{
  title = 'LingoBot';
  user: any;
  showLevelUpModal = false;


  isLoginRoute: any;
  referralCode: string = '';

  isHomeRoute = false;
  isBabelTower: boolean = false;

  showRankingModal: boolean = false;

  showItensModal: boolean = false; //bolsa com itens do usuario
  showNewItemModal = false; // quando ganha um novo item
  userLevel: any;
  newItem: any;

  constructor(  private router: Router,
                private auth: AuthService,
                private playSound: PlaySoundService,
                 private modalService: ModalService
  ) {

    this.modalService.showItensModal$.subscribe(state => {
      this.showItensModal = state;
    });


    this.modalService.showLevelUpModal$.subscribe(state => {
      this.showLevelUpModal = state;
    });


    this.modalService.showNewItemsModal$.subscribe(state => {
      this.showNewItemModal = state;
    });


this.router.events.subscribe(event => {
  if (event instanceof NavigationStart) {
  this.playSound.stopAudio(); // Para qualquer som em execução ao mudar de página
}
});


    this.router.events.subscribe(() => {
      this.isLoginRoute = this.router.url === '/login';
      this.isHomeRoute = this.router.url === '/home';
      this.isBabelTower = this.router.url === '/babel-tower';

    });

  }



  ngOnInit() {

    this.modalService.showNewItemsModal$.subscribe(state => {
      this.showNewItemModal = state;
    });

    this.modalService.newItem$.subscribe(item => {
      this.newItem = item;
    });




    // Pega os últimos 6 caracteres da URL
    const referralCode = window.location.href.slice(-6);

    // Verifica se o código é um número de 6 dígitos
    if (/^\d{6}$/.test(referralCode)) {
      // Armazena o código de referral no localStorage
      localStorage.setItem('referralCode', referralCode);

      // Redireciona para a página de login
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 100);
      return;  // Evita executar a lógica de token se já redirecionou
    }

    const token = localStorage.getItem('token');

    if (!token) {
      this.router.navigate(['/login']);
    } else {
    //this.router.navigate(['/home']);
     // this.router.navigate(['/babel-tower']);
    }


    // Assina o BehaviorSubject para obter os dados do usuário de forma reativa
    this.auth.user$.subscribe(userData => {
      this.user = userData;
      //  console.log(JSON.stringify(this.user));

      this.userLevel = userData.Level;

    });

  }



}
