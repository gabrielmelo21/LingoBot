import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {PlaySoundService} from "../../services/play-sound.service";
import {TrilhaService} from "../../services/trilha.service";

@Component({
  selector: 'app-trilha-de-estudos',
  templateUrl: './trilha-de-estudos.component.html',
  styleUrls: ['./trilha-de-estudos.component.css']
})
export class TrilhaDeEstudosComponent  implements OnInit {
   user: any;
   trilhaAtual: string = "";
   showSuccessMessage = false;
   trilhaPaid: any;
   showFailMessage: boolean = false;
    final_lxp_bounty: any;

  constructor(private trilhaService: TrilhaService, private authService: AuthService ,  private router: Router, private playSound: PlaySoundService) {
    window.scrollTo(0, 0); // Faz o scroll para o topo ao carregar o componente
    const trilha = this.trilhaService.getTrilhaData();
    this.trilhaAtual = trilha.trilha_on
    this.trilhaPaid = trilha.paid;
    this.final_lxp_bounty = trilha.final_lxp_bounty;

  }


  ngOnInit() {
    if (!this.trilhaService.getTrilhaData()) {
     // alert("trilha iniciada");
      this.trilhaService.initializeTrilhaData();
    }else{
     //  alert("trilha base ja foi iniciada")
    }




    this.authService.user$.subscribe(userData => {
      if (!userData) return;
      this.user = userData;
     // alert(this.user.Level)
    });


  }

  selectTrilha(number: number) {

    if (this.authService.getUserTokens() >=500){

      this.playSound.playWin2()
      this.authService.decreseToken(500)

      switch (number) {
        case 1:
          this.trilhaAtual = "Level 1"
          this.final_lxp_bounty = 10000
          this.trilhaService.updateTrilhaData({  trilha_on: "Level 1" });
          this.trilhaService.updateTrilhaData({  trilha_paid: "true" });
          this.trilhaService.updateTrilhaData({  final_lxp_bounty: "10000" });
          break;
        case 10:
          this.trilhaAtual = "Level 10"
          this.final_lxp_bounty = 10000
          this.trilhaService.updateTrilhaData({  trilha_on: "Level 10" });
          this.trilhaService.updateTrilhaData({  trilha_paid: "true" });
          this.trilhaService.updateTrilhaData({  final_lxp_bounty: "20000" });
          break;

        default:
          break;
      }



      this.showSuccessMessage = true; // Exibe a mensagem de sucesso

      setTimeout(() => {
        this.showSuccessMessage = false; // Oculta a mensagem após 3 segundos
      }, 3000);




    }else{
      this.playSound.playTokenZero()
      this.showFailMessage = true; // Exibe a mensagem
      setTimeout(() => {
        this.showFailMessage = false; // Oculta após 3 segundos
      }, 3000);


    }



  }


  onMouseEnter() {

  }

  navigate_to() {
    this.playSound.playCleanSound2()
    this.router.navigate(['/trilha-active']);
  }

}

