import {Component, HostListener, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, NavigationStart, Router} from "@angular/router";
import {AuthService} from "./services/auth.service";
import {PlaySoundService} from "./services/play-sound.service";
import {TrilhaService} from "./services/trilha.service";
import {Subscription} from "rxjs";
import {ModalService} from "./services/modal.service";



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
  showOpenTools = false;
  showPedagioModal: boolean = false;
  showCelularModal: boolean = false;
  showRankingModal: boolean = false;
  showMugModal: boolean = false;
  showBookModal: boolean = false;
  showEldersBookModal: boolean = false;






  constructor(   private trilhaService: TrilhaService,
                private router: Router,
                private auth: AuthService,
                private playSound: PlaySoundService,
                 private modalService: ModalService
  ) {

    //localStorage.clear();



    this.modalService.showCelularModal$.subscribe(state => {
      this.showCelularModal = state;
    });

    this.modalService.showRankingModal$.subscribe(state => {
      this.showRankingModal = state;
    });


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



  closeModal3() {
    this.showPedagioModal = false;
  }







  torreSubscription!: Subscription;
  andarAtual: number = 0; // Variável para armazenar o andar atual
  andar_inicial_conjunto: number = 0;
  andar_final_conjunto: number = 0;



  ngOnInit() {


    //INICIALIZA JSON TORRE
    if (!this.trilhaService.getTorreData()) {
     console.log("trilha iniciada");
      this.trilhaService.initializeTorreData();
    }else{
     console.log("torre base ja foi iniciada - " + localStorage.getItem("torreData"))
    }








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


  voltarAndar(){

  }






  toggleFlashcardModal() {
    this.playSound.playCleanSound2();
    this.showFlashcardModal = !this.showFlashcardModal;
  }

  toggleLingoBot() {
    this.playSound.playCleanSound2();
    this.showLingoBotModal = !this.showLingoBotModal;
  }

  openTools() {

    this.playSound.playCleanSound2();
    this.showOpenTools = !this.showOpenTools;
  }


  toggleMug() {
    this.playSound.playCleanSound2();
    this.showMugModal = !this.showMugModal;
  }

  toggleBook() {
    this.playSound.playCleanSound2();
    this.showBookModal = !this.showBookModal;
  }

  toggleEldersBook() {
    this.playSound.playCleanSound2();
    this.showEldersBookModal = !this.showEldersBookModal;
  }
}
