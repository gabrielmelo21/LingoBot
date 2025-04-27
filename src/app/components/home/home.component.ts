import {Component, HostListener, OnInit} from '@angular/core';
import {PlaySoundService} from "../../services/play-sound.service";
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {TrilhaService} from "../../services/trilha.service";
import {Subscription} from "rxjs";
import {animate, state, style, transition, trigger} from "@angular/animations";




@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    // Animação para a nuvem da esquerda
    trigger('nuvemEsquerdaAnimation', [
      state('hidden', style({
        opacity: 0,
        transform: 'translateX(-100%)' // Fora da tela à esquerda
      })),
      state('visible', style({
        opacity: 1,
        transform: 'translateX(-80%)' // No centro
      })),
      transition('hidden => visible', [
        animate('2.5s ease-in') // Movimento para o centro
      ]),
      transition('visible => hidden', [
        animate('2.5s ease-in') // Movimento de volta para a esquerda
      ])
    ]),

    // Animação para a nuvem da direita
    trigger('nuvemDireitaAnimation', [
      state('hidden', style({
        opacity: 0,
        transform: 'translateX(100%)' // Fora da tela à direita
      })),
      state('visible', style({
        opacity: 1,
        transform: 'translateX(-25%)' // No centro
      })),
      transition('hidden => visible', [
        animate('2.5s ease-in') // Movimento para o centro
      ]),
      transition('visible => hidden', [
        animate('2.5s ease-in') // Movimento de volta para a direita
      ])
    ])
  ]
})
export class HomeComponent implements OnInit {

  user: any;
  userDifficulty: any;

  // Variáveis para os caminhos dos arquivos
  staticSceneSrc: string = '';
  video1Src: string = '';
  video2Src: string = '';




  constructor(private playSound: PlaySoundService,
              private router: Router,
              private auth: AuthService,
              private trilhaService: TrilhaService) {
    window.scrollTo(0, 0); // Faz o scroll para o topo ao carregar o componente

    setTimeout(() => {
        this.mudarCena(1)
    }, 50);


  }

  cena: number = 1; // Cena atual

  // Função para mudar de cena
  mudarCena(novaCena: number) {
    setTimeout(() => {
      this.cena = novaCena;
    }, 100);
  }


  ngOnInit() {
    setTimeout(() => {
      this.mudarCena(1)
      this.playSound.playCitySoundTrack()
    }, 50);





      this.auth.user$.subscribe(userData => {
        if (!userData) return;
        this.user = userData;
        this.userDifficulty = userData.difficulty;
        this.setSceneSources();
      });



  }




  setSceneSources(): void {
    switch (this.userDifficulty) {
      case 'easy':
        this.staticSceneSrc = 'assets/lingobot/cenas_on_city/default-cena.png';
        this.video1Src = 'assets/lingobot/cenas_on_city/city-waiting-animation.mp4';
        this.video2Src = 'assets/lingobot/cenas_on_city/animation-going-to-tower.mp4';
        break;

      case 'medium':
        this.staticSceneSrc = 'assets/lingobot/cenas_on_city/medium-static.png';
        this.video1Src = 'assets/lingobot/cenas_on_city/medium-scene-1.mp4';
        this.video2Src = 'assets/lingobot/cenas_on_city/medium-scene-2.mp4';
        break;

      case 'hard':
        this.staticSceneSrc = 'assets/lingobot/cenas_on_city/hard-static.png';
        this.video1Src = 'assets/lingobot/cenas_on_city/hard-scene-1.mp4';
        this.video2Src = 'assets/lingobot/cenas_on_city/hard-scene-2.mp4';
        break;

      case 'elder':
        this.staticSceneSrc = 'assets/lingobot/cenas_on_city/elder-static.png';
        this.video1Src = 'assets/lingobot/cenas_on_city/elder-scene-1.mp4';
        this.video2Src = 'assets/lingobot/cenas_on_city/elder-scene-2.mp4';
        break;

      default:
        this.staticSceneSrc = 'assets/lingobot/cenas_on_city/default-cena.png';
        this.video1Src = 'assets/lingobot/cenas_on_city/city-waiting-animation.mp4';
        this.video2Src = 'assets/lingobot/cenas_on_city/animation-going-to-tower.mp4';
    }


  }










  nuvemState = 'hidden'; // Estado inicial da animação

  startAnimation() {
    this.nuvemState = 'visible'; // Inicia a animação
    setTimeout(() => {
      this.nuvemState = 'hidden'; // Volta ao estado inicial após 3 segundos
    }, 3000);
  }





  goto() {
    this.router.navigate(['/babel-tower']);
  }







  blockAction: boolean = false;


  command(cmd: string) {
    // Verifica se uma ação já está em andamento
    if (this.blockAction) {
      console.log("Uma ação já está em andamento. Aguarde...");
      return; // Sai da função se blockAction for true
    }

    // Bloqueia novas ações
    this.blockAction = true;

    // Toca o som
    this.playSound.playCleanSound();

    // Lógica para cada comando
    if (cmd === 'up') {


      // Animação para subir
      this.mudarCena(2);

      setTimeout(() => {
        // Animação de nuvens
        this.startAnimation();
      }, 3000);


      setTimeout(() => {
        // ir para torre
        this.router.navigate(['/babel-tower']);
      }, 6000);

    }
  }

  neonStates = new Set<string>(); // Mantém os estados dos botões ativados

  ativarNeon(command: string) {
    this.neonStates.add(command);
    setTimeout(() => {
      this.desativarNeon(command);
    }, 5000); // Mantém o efeito por 5 segundos
  }

  desativarNeon(command: string) {
    this.neonStates.delete(command);
  }

  isNeonActive(command: string): boolean {
    return this.neonStates.has(command);
  }
}
