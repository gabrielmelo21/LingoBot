import {ChangeDetectorRef, Component, HostListener, OnInit} from '@angular/core';
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
  pedagioStatus: any;
  checkQuestModal: boolean = false;
  rechargeValue: number = 0;


  blockAction: boolean = false;
  resultadoPedagio: {
    precisaPagar: boolean;
    podeSubir: boolean;
    mensagem: string;
    requisitos: { nome: string; completo: boolean }[];
  } = {
    precisaPagar: false,
    podeSubir: false,
    mensagem: '',
    requisitos: []
  };



  currentBattery: number = 0;
  batteryArray = Array(10).fill(0);
  energyImagePath: string = '';
  rechargeModal: boolean = false ;


  constructor(private playSound: PlaySoundService,
              private router: Router,
              protected auth: AuthService,
              private trilhaService: TrilhaService,
              private cdr: ChangeDetectorRef) {
    window.scrollTo(0, 0); // Faz o scroll para o topo ao carregar o componente

    setTimeout(() => {
      this.mudarCena(1)
      this.playSound.playTowerSoundTrack()
    }, 50);


  }




  verificarPedagio() {


  }


  renderizar(){
    this.cdr.detectChanges();
  }



  // Função para mudar de cena
  mudarCena(novaCena: number) {
    setTimeout(() => {
      this.cena = novaCena;
      this.renderizar();
    }, 100);
  }

  torreSubscription!: Subscription;
  andarAtual: number = 0; // Variável para armazenar o andar atual
  exercise1: boolean = false; // Variável para o exercício 1
  exercise2: boolean = false; // Variável para o exercício 2

  andar_inicial_conjunto: number = 0;
  andar_final_conjunto: number = 0;





  pagarPedagio() {
    // Deduzir os valores e avançar o andar
   // this.auth.pagarPedagio(); // você pode criar esse método depois
    this.closeModal();
  }


checkQuest(){
  this.resultadoPedagio = this.auth.checkQuest(4);
  this.checkQuestModal = !this.checkQuestModal;
  this.renderizar();
}

  closeQuestModal() {
    this.checkQuestModal = !this.checkQuestModal;
    this.renderizar();
  }

  rechargeBattery() {

     this.rechargeModal = !this.rechargeModal;
     this.loadBattery()
     this.renderizar();
     console.log(this.rechargeValue);


  }




  getRequisitoIcon(index: number): string {
    const icons = [
      'assets/lingobot/itens/gemas.png',
      'assets/lingobot/itens/gold.png',
      'assets/lingobot/menu-icons/level.png',
      'assets/lingobot/skills/listening.png',
      'assets/lingobot/skills/speaking.png',
      'assets/lingobot/skills/reading.png',
      'assets/lingobot/skills/writing.png'
    ];
    return icons[index];
  }





  setEnergyImage() {
    this.energyImagePath = this.currentBattery > 0
      ? 'assets/lingobot/menu-icons/lingobot-energy-on.png'
      : 'assets/lingobot/menu-icons/lingobot-energy-off.png';
  }

  loadBattery() {
    this.setEnergyImage();
    this.rechargeValue = Math.abs(this.currentBattery - 10);
    this.renderizar()
  }

  // Exemplo: chamada após consumir ou recarregar
  addBattery() {
    this.playSound.playCleanSound2()
    this.auth.addBatteryEnergy(1);
    this.auth.decreaseLocalUserData( {gemas: 1 });
    this.loadBattery();
  }


  rechargeAll(){
    this.playSound.playCleanSound2()
    this.auth.addBatteryEnergy(this.rechargeValue);
    this.auth.decreaseLocalUserData( {gemas: this.rechargeValue });
    this.loadBattery();
  }

  removeBattery() {
    this.auth.removeBatteryEnergy();
    this.loadBattery();
  }


  ngOnInit() {
    this.loadBattery();

    this.auth.user$.subscribe(userData => {
      if (!userData) return;

      this.userDifficulty = userData.difficulty;
      this.currentBattery = userData.battery;
      console.log("Currenty battery -> ", this.currentBattery);
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

      // tem que ter feito o exercicio 1 2 3 4 do conjunto , vao ser marcados com true e false

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
         this. verificarPedagio()
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
      if(this.currentBattery > 0){
      // Animação para entrar na missão
      this.mudarCena(2);
      this.removeBattery();
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
    }else{
        // Bloqueia novas ações
        this.blockAction = false;
        this.  rechargeBattery()

      }

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
