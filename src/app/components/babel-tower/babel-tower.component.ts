import {Component, HostListener, OnInit} from '@angular/core';
import {PlaySoundService} from "../../services/play-sound.service";
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {TrilhaService} from "../../services/trilha.service";
import {Subscription} from "rxjs";
import {animate, state, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-babel-tower',
  templateUrl: './babel-tower.component.html',
  styleUrls: ['./babel-tower.component.css'],
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
export class BabelTowerComponent  implements OnInit {
  cena: number = 1;
  userDifficulty: string = '';
  staticSceneSrc: string = '';
  video1Src: string = '';
  video2Src: string = '';
  video3Src: string = '';
  video4Src: string = '';

  constructor(private playSound: PlaySoundService,
              private router: Router,
              private auth: AuthService,
              private trilhaService: TrilhaService) {
    window.scrollTo(0, 0); // Faz o scroll para o topo ao carregar o componente

    setTimeout(() => {
      this.mudarCena(1)
      this.playSound.playTowerSoundTrack()
    }, 50);


  }




  // Função para mudar de cena
  mudarCena(novaCena: number) {
    setTimeout(() => {
      this.cena = novaCena;
    }, 100);
  }

  torreSubscription!: Subscription;
  andarAtual: number = 0; // Variável para armazenar o andar atual
  exercise1: boolean = false; // Variável para o exercício 1
  exercise2: boolean = false; // Variável para o exercício 2

  andar_inicial_conjunto: number = 0;
  andar_final_conjunto: number = 0;


  orbView: boolean = true;







  ngOnInit() {

    this.auth.user$.subscribe(userData => {
      if (!userData) return;

      this.userDifficulty = userData.difficulty;
      this.setTowerSceneSources();
    });


    setTimeout(() => {
      this.mudarCena(1)
    }, 50);

    // Se inscreve no observable para atualizar automaticamente
    this.torreSubscription = this.trilhaService.torre$.subscribe((torre) => {

      this.andarAtual = torre.andar_atual;
      this.andar_inicial_conjunto = torre.andar_inicial_conjunto;
      this.andar_final_conjunto = torre.andar_final_conjunto;
      this.exercise1 = torre.exercise1;
      this.exercise2 = torre.exercise2;

      this.auth.checkAndUpdateRanking(this.andarAtual);

    });

  }


  setTowerSceneSources(): void {
    switch (this.userDifficulty) {
      case 'easy':
        this.staticSceneSrc = 'assets/lingobot/cenas_on_out_tower/torre_ground.png';
        this.video1Src = 'assets/lingobot/cenas_on_out_tower/waiting_animation_tower.mp4';
        this.video2Src = 'assets/lingobot/cenas_on_out_tower/entrando-na-torre.mp4';
        this.video3Src = 'assets/lingobot/cenas_on_out_tower/teletransporte.mp4';
        this.video4Src = 'assets/lingobot/cenas_on_out_tower/teletransporte_back.mp4';
        break;

      case 'medium':
        this.staticSceneSrc = 'assets/lingobot/cenas_on_out_tower/medium-static.png';
        this.video1Src = 'assets/lingobot/cenas_on_out_tower/medium/waiting_animation_tower.mp4'; // não tem
        this.video2Src = 'assets/lingobot/cenas_on_out_tower/medium-scene-2.mp4'; // temos
        this.video3Src = 'assets/lingobot/cenas_on_out_tower/medium/teletransporte.mp4'; //nao tem
        this.video4Src = 'assets/lingobot/cenas_on_out_tower/medium/teletransporte_back.mp4'; // nao tem
        break;

      case 'hard':
        this.staticSceneSrc = 'assets/lingobot/cenas_on_out_tower/hard-static.png';
        this.video1Src = 'assets/lingobot/cenas_on_out_tower/hard/waiting_animation_tower.mp4';
        this.video2Src = 'assets/lingobot/cenas_on_out_tower/hard-scene.mp4';
        this.video3Src = 'assets/lingobot/cenas_on_out_tower/hard/teletransporte.mp4';
        this.video4Src = 'assets/lingobot/cenas_on_out_tower/hard/teletransporte_back.mp4';
        break;

      case 'elder':
        this.staticSceneSrc = 'assets/lingobot/cenas_on_out_tower/elder-static.png';
        this.video1Src = 'assets/lingobot/cenas_on_out_tower/elder/waiting_animation_tower.mp4';
        this.video2Src = 'assets/lingobot/cenas_on_out_tower/elder-scene.mp4';
        this.video3Src = 'assets/lingobot/cenas_on_out_tower/elder/teletransporte.mp4';
        this.video4Src = 'assets/lingobot/cenas_on_out_tower/elder/teletransporte_back.mp4';
        break;

      default:
        this.staticSceneSrc = 'assets/lingobot/cenas_on_out_tower/torre_ground.png';
        this.video1Src = 'assets/lingobot/cenas_on_out_tower/waiting_animation_tower.mp4';
        this.video2Src = 'assets/lingobot/cenas_on_out_tower/entrando-na-torre.mp4';
        this.video3Src = 'assets/lingobot/cenas_on_out_tower/teletransporte.mp4';
        this.video4Src = 'assets/lingobot/cenas_on_out_tower/teletransporte_back.mp4';
        break;
    }
  }
























  // Lógica para determinar qual imagem exibir
  getTextoPorAndar(): string {
    // Calcula a posição do andar dentro do conjunto de 4
    const andarNoConjunto = (this.andarAtual - 1) % 4;  // Faz a divisão inteira para achar o resto

    switch (andarNoConjunto) {
      case 0:
        return "Writing";  // Andar 1, 5, 9, 13, ...
      case 1:
        return "Reading";  // Andar 2, 6, 10, 14, ...
      case 2:
        return "Listening";  // Andar 3, 7, 11, 15, ...
      case 3:
        return "Speaking";  // Andar 4, 8, 12, 16, ...
      default:
        return "";  // Caso não encontre
    }
  }






  nuvemState = 'hidden'; // Estado inicial da animação

  startAnimation() {
    this.nuvemState = 'visible'; // Inicia a animação
    setTimeout(() => {
      this.nuvemState = 'hidden'; // Volta ao estado inicial após 3 segundos
    }, 3000);
  }




  deferredPrompt: any;


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




  showPedagioModal: boolean = false;
  closeModal() {

    this.showPedagioModal = false;

  }





  neonStates = new Set<string>(); // Mantém os estados dos botões ativados

  ativarNeon(command: string) {
    this.neonStates.add(command);
    setTimeout(() => {
      this.desativarNeon(command);
    }, 5000); // Mantém o efeito por 4 segundos
  }

  desativarNeon(command: string) {
    this.neonStates.delete(command);
  }

  isNeonActive(command: string): boolean {
    return this.neonStates.has(command);
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
      this.auth.checkAndUpdateRanking(this.andarAtual);


      if (this.andarAtual == this.andar_final_conjunto) {

        this.showPedagioModal = true;
        this.blockAction = false; // Libera após concluir
      } else {
        // Animação para subir
        this.mudarCena(3);


        if (this.userDifficulty == "easy"){
          setTimeout(() => {
            // Animação de nuvens
            this.startAnimation();
          }, 3000);


          setTimeout(() => {
            this.mudarCena(4);
          }, 5000);


          setTimeout(() => {
            // Atualiza os dados da torre e volta para a cena inicial
            this.trilhaService.updateTorreData({ andar_atual: 1 });
            this.mudarCena(1);
            this.blockAction = false; // Libera após concluir
          }, 9000);
        }else{

            // Animação de nuvens
            this.startAnimation();


          setTimeout(() => {
            // Atualiza os dados da torre e volta para a cena inicial
            this.trilhaService.updateTorreData({ andar_atual: 1 });
            this.mudarCena(1);
            this.blockAction = false; // Libera após concluir
          }, 4000);


        }








      }
    } else if (cmd === 'in') {
      // Animação para entrar na missão
      this.mudarCena(2);

      setTimeout(() => {
        // Animação de nuvens
        this.startAnimation();
      }, 2000);


      setTimeout(() => {
        this.blockAction = false; // Libera após concluir

         switch (this.getTextoPorAndar()){
             case "Writing":
               this.router.navigate(['/writing']);
             break;
           case "Listening":
             this.router.navigate(['/listening']);
             break;
           case "Reading":
             this.router.navigate(['/reading']);
             break;

           case "Speaking":
             this.router.navigate(['/speaking']);
             break;

         }


      }, 5000); // Ajuste o tempo conforme necessário


    } else if (cmd === 'down') {
      const t = this.trilhaService.getTorreData();

      if (t.andar_atual > 1) {

        // Animação para subir
        this.mudarCena(3);



        if (this.userDifficulty == "easy"){
          setTimeout(() => {
            // Animação de nuvens
            this.startAnimation();
          }, 3000);


          setTimeout(() => {
            this.mudarCena(4);
          }, 5000);

          setTimeout(() => {
            // Atualiza os dados da torre e muda para a cena de descida
            this.trilhaService.updateTorreData({ andar_atual: -1 });
            this.mudarCena(1);
            this.blockAction = false; // Libera após concluir
          }, 9000);
        }else{


          // Animação de nuvens
          this.startAnimation();


          setTimeout(() => {
            // Atualiza os dados da torre e volta para a cena inicial
            this.trilhaService.updateTorreData({ andar_atual: -1 });
            this.mudarCena(1);
            this.blockAction = false; // Libera após concluir
          }, 4000);


        }









      } else {
        alert("Não é possível descer abaixo do primeiro andar.");
        this.blockAction = false; // Libera após exibir o alerta
      }
    }
  }
}
