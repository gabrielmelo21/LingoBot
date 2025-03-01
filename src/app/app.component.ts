import {Component, HostListener, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, NavigationStart, Router} from "@angular/router";
import {AuthService} from "./services/auth.service";
import {PlaySoundService} from "./services/play-sound.service";



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit{
  title = 'LingoBot';
  user: any;  // Variável para armazenar os dados do usuário
  showLevelUpModal = false;
  showTokensModal = false;
  isLoginRoute: any;
  referralCode: string = '';


  isFlashcardsRoute = false;
  showLingoBotModal = false;
  showFlashcardModal = false;








  constructor(
                private router: Router,
                private auth: AuthService,
                private playSound: PlaySoundService
  ) {




this.router.events.subscribe(event => {
  if (event instanceof NavigationStart) {
  this.playSound.stopAudio(); // Para qualquer som em execução ao mudar de página
}
});




    this.router.events.subscribe(() => {
      this.isLoginRoute = this.router.url === '/login';
      this.isFlashcardsRoute = this.router.url === '/flashcards';
    });



    this.auth.levelUpEvent.subscribe(() => {
      this.showLevelUpModal = true;
    });

    this.auth.tokenEvent.subscribe(() => {
      this.showTokensModal = true;
    });



  }
  closeModal() {
    this.showLevelUpModal = false;
  }
  closeModal2() {
    this.showTokensModal = false;
    //redirecionar para o planos
    this.router.navigate(['/planos']);
  }


  ngOnInit() {
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
      this.router.navigate(['/home']);
    }


    // Assina o BehaviorSubject para obter os dados do usuário de forma reativa
    this.auth.user$.subscribe(userData => {
      this.user = userData;
      //  console.log(JSON.stringify(this.user));
    });

  }



  isModalOpen = false;





  toggleFlashcardModal() {
    this.playSound.playCleanSound2();
    this.showFlashcardModal = !this.showFlashcardModal;
  }

  toggleLingoBot() {
    this.playSound.playCleanSound2();
    this.showLingoBotModal = !this.showLingoBotModal;
  }

}
