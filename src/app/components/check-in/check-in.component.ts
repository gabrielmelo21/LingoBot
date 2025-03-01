import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {PlaySoundService} from "../../services/play-sound.service";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-check-in',
  templateUrl: './check-in.component.html',
  styleUrls: ['./check-in.component.css']
})
export class CheckInComponent implements OnInit{
  user: any; // Armazena os dados do usuário
  tempoRestante: string = 'Carregando...'; // Variável para armazenar o tempo restante
  timerInterval: any; // Para armazenar o intervalo que será usado para atualizar o tempo
  tempoRestanteMs: number = 0; // Em milissegundos (tempo restante até o próximo check-in)

  constructor(
    private auth: AuthService,
    private router: Router,
    private playSound: PlaySoundService,

  ) {}

  async ngOnInit() {
    // Assumindo que user$ é um Observable de dados do usuário
    window.scrollTo(0, 0); // Faz o scroll para o topo ao carregar o componente
    this.auth.user$.subscribe(async (userData) => {
      if (!userData) return;
      this.user = userData;
     // alert(JSON.stringify(this.user))

      if (this.user && this.user.nextCheckinTime) {

        this.tempoRestanteMs = new Date(this.user.nextCheckinTime).getTime() - new Date().getTime();

        if (this.tempoRestanteMs > 0) {
          // Atualiza a cada segundo
          this.timerInterval = setInterval(() => {
            this.atualizarTempoRestante();
          }, 1000);
        } else {
          this.tempoRestante = '';
          this.auth.updateLocalUserData({ checkIn : false})
        }
      }else{
      //   alert("Erro ao carregar proximo checkin")
      }
    });
  }

  ngOnDestroy() {
    // Limpa o intervalo quando o componente for destruído
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  atualizarTempoRestante() {
    // Calcula a diferença em segundos, minutos, horas e dias
    if (this.tempoRestanteMs > 0) {
      this.tempoRestanteMs -= 1000; // Subtrai 1 segundo
      const dias = Math.floor(this.tempoRestanteMs / (1000 * 60 * 60 * 24));
      const horas = Math.floor((this.tempoRestanteMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutos = Math.floor((this.tempoRestanteMs % (1000 * 60 * 60)) / (1000 * 60));
      const segundos = Math.floor((this.tempoRestanteMs % (1000 * 60)) / 1000);

      // Formata o tempo restante
      this.tempoRestante = `${dias}d ${horas}h ${minutos}m ${segundos}s`;
    } else {
      this.tempoRestante = 'Próximo check-in disponível!';
      this.auth.updateLocalUserData({ checkIn : false})
      clearInterval(this.timerInterval); // Limpa o intervalo após o contador terminar
    }
  }

  fazerCheckIn() {
      this.auth.fazerCheckin();
      this.playSound.playWin2();
      this.auth.checkLevelUp(5000);
      this.auth.updateLocalUserData({ tokens: 1000 });
      this.auth.updateMetaUser({ meta6: true });
  }

  navigate_to() {
    this.playSound.playCleanNavigationSound();
    this.router.navigate(['/home']);
  }
}
