import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {PlaySoundService} from "../../services/play-sound.service";
import {TrilhaService} from "../../services/trilha.service";

@Component({
  selector: 'app-trilha-de-estudos-active',
  templateUrl: './trilha-de-estudos-active.component.html',
  styleUrls: ['./trilha-de-estudos-active.component.css']
})
export class TrilhaDeEstudosActiveComponent implements OnInit {

  trilhaAtual: any;
  trilhaPaid: any;
  final_lxp_bounty: any;
  step1: any;
  step2: any;
  step3: any;
  step4: any;
  step5: any;
  step6: any;

  constructor(
    private trilhaService: TrilhaService,
    private router: Router,
    private playSound: PlaySoundService
  ) {
    window.scrollTo(0, 0); // Faz o scroll para o topo ao carregar o componente
  }

  ngOnInit(): void {
    // Assinando ao observable para manter os dados atualizados
    this.trilhaService.trilha$.subscribe(trilha => {
      this.trilhaAtual = trilha.trilha_on;
      this.trilhaPaid = trilha.paid;
      this.final_lxp_bounty = trilha.final_lxp_bounty;
      this.step1 = trilha.step1;
      this.step2 = trilha.step2;
      this.step3 = trilha.step3;
      this.step4 = trilha.step4;
      this.step5 = trilha.step5;
      this.step6 = trilha.step6;
    });
  }


  todasEtapasConcluidas(): boolean {
    return this.step1 && this.step2 && this.step3 && this.step4 && this.step5 && this.step6;
  }

  navigate_to_exercise(number: number): void {
    switch (number) {
      case 1:
        this.playSound.playCleanSound2();
        this.router.navigate(['/step1']);
        break;
      case 2:
        this.playSound.playCleanSound2();
        this.router.navigate(['/step2']);
        break;
      case 3:
        this.playSound.playCleanSound2();
        this.router.navigate(['/step3']);
        break;
      case 4:
        this.playSound.playCleanSound2();
        this.router.navigate(['/step4']);
        break;
      case 5:
        this.playSound.playCleanSound2();
        this.router.navigate(['/step5']);
        break;
      case 6:
        this.playSound.playCleanSound2();
        this.router.navigate(['/step6']);
        break;
    }
  }
}
