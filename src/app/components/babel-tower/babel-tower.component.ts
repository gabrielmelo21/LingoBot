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

  cena: number = 1; // Cena atual
  mostrarImagem: boolean = false; // Controla a exibição da imagem

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
    setTimeout(() => {
      this.mudarCena(1)
    }, 50);

    // Se inscreve no observable para atualizar automaticamente
    this.torreSubscription = this.trilhaService.torre$.subscribe((torre) => {
      // Atualize as variáveis com os dados da torre
      this.andarAtual = torre.andar_atual;
      this.andar_inicial_conjunto = torre.andar_inicial_conjunto;
      this.andar_final_conjunto = torre.andar_final_conjunto;
      this.exercise1 = torre.exercise1;
      this.exercise2 = torre.exercise2;



    });

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





  onMouseEnter() {
    this.playSound.playCleanSound();
  }


  appFeatures = [
    {
      title: 'Desvendar expressões, girías, contrações etc.',
      details: 'Tire dúvidas con LingoBot sobre expressões em inglês que não tem tradução direta',
      icon: 'assets/lingobot/lingobot-desafios.png'
    },
    {
      title: 'Desafios do LingoBot',
      details: 'Resolva desafios propostos pelo LingoBot e acumule LingoEXP',
      icon: 'assets/lingobot/lingobot-livro-na-mao.png'
    },
    {
      title: 'Estudar com Vídeos',
      details: 'Estude com vídeos de canais recomendados e crie Flashcards e descubra expressões e significados.',
      icon: 'assets/lingobot/lingobot-assistindo.png'
    },
    {
      title: 'Meus Flashcards (Coming Soon)',
      details: 'Crie e salve flashcards de novas expressões que você aprender',
      icon: 'assets/lingobot/lingobot-flashcards.png'
    },
    {
      title: 'Ranking (Coming Soon)',
      details: 'Acumule LingoEXP e suba no Ranking Global',
      icon: 'assets/lingobot/lingobot-competindo.png'
    },
    {
      title: 'Check-In Diário',
      details: 'Visite o LingoBot diáriamente e ganhe LXP e LingoTokens',
      icon: 'assets/lingobot/lingobot-calendario.png'
    }
  ];

  /**
   *  Mais opções que deve ter
   *  Configurações de conta
   *  Assinatura - se é a versão free
   */

  tirarMoedas() {
    //this.auth.decreseToken(1000)
    this.auth.decreaseLocalUserData({ tokens: 1000 });
    this.auth.checkTokens()

  }

  colocarMoedas() {
    this.auth.updateLocalUserData({ tokens: 1000 });
  }

  goto_step3() {
    this.router.navigate(['/step3']);
  }

  goto_step4() {
    this.router.navigate(['/step4']);
  }

  goto() {
    this.router.navigate(['/skills']);
  }









  // NEW



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
      if (this.andarAtual == this.andar_final_conjunto) {

        this.showPedagioModal = true;
        this.blockAction = false; // Libera após concluir
      } else {
        // Animação para subir
        this.mudarCena(3);


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
      }
    } else if (cmd === 'in') {
      // Animação para entrar na missão
      this.mudarCena(2);

      setTimeout(() => {
        this.blockAction = false; // Libera após concluir
      }, 3000); // Ajuste o tempo conforme necessário
    } else if (cmd === 'down') {
      const t = this.trilhaService.getTorreData();

      if (t.andar_atual > 1) {

        // Animação para subir
        this.mudarCena(3);


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


      } else {
        alert("Não pode descer abaixo de 1");
        this.blockAction = false; // Libera após exibir o alerta
      }
    }
  }
}
