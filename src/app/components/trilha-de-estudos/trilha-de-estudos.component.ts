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
   final_tokens_bounty: any;

  constructor(private trilhaService: TrilhaService, private authService: AuthService ,  private router: Router, private playSound: PlaySoundService) {
    window.scrollTo(0, 0); // Faz o scroll para o topo ao carregar o componente
    const trilha = this.trilhaService.getTrilhaData();
    this.trilhaAtual = trilha.trilha_on
    this.trilhaPaid = trilha.paid;
    this.final_lxp_bounty = trilha.final_lxp_bounty;
    this.final_tokens_bounty = trilha.final_tokens_bounty

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

   alertMsg: string = ""

  selectTrilha(number: number) {
//this.user.Level >= 40


    //       criar variavel com msg personalizada
    //       this.showFailMessage = true; // Exibe a mensagem
    //       setTimeout(() => {
    //         this.showFailMessage = false; // Oculta após 3 segundos
    //       }, 3000);

     // this.playSound.playWin2()
     // this.authService.decreseToken(500)

      switch (number) {
        case 1:
          if(this.user.Level >= 1){
            this.playSound.playCleanSound2()
            this.trilhaAtual = "Level 1"
            this.final_lxp_bounty = 10000
            this.final_tokens_bounty = 250
            this.trilhaService.updateTrilhaData({  trilha_on: "Level 1" });
            this.trilhaService.updateTrilhaData({  final_lxp_bounty: 10000 });
            this.trilhaService.updateTrilhaData({  final_tokens_bounty: 250 });
            this.alertMsg = "Trilha liberada com sucesso!"
            this.showSuccessMessage = true; // Exibe a mensagem
            setTimeout(() => {
              this.showSuccessMessage = false; // Oculta após 3 segundos
              this.alertMsg = ""
            }, 3000);
          }

          break;
        case 20:
          if(this.user.Level >= 20 && this.authService.getUserTokens() >=2000) {
            this.playSound.playCleanSound2()
            this.authService.decreseToken(2000)
            this.trilhaAtual = "Level 20"
            this.final_lxp_bounty = 20000
            this.final_tokens_bounty = 500
            this.trilhaService.updateTrilhaData({trilha_on: "Level 20"});
            this.trilhaService.updateTrilhaData({final_lxp_bounty: 20000});
            this.trilhaService.updateTrilhaData({final_tokens_bounty: 500});

            this.alertMsg = "Trilha liberada com sucesso!"
            this.showSuccessMessage = true; // Exibe a mensagem
            setTimeout(() => {
              this.showSuccessMessage = false; // Oculta após 3 segundos
              this.alertMsg = ""
            }, 3000);

          }else{

            this.playSound.playTokenZero()
            if(this.user.Level < 20){
              this.alertMsg = "Atinja o Level 20 para desbloquear essa trilha"
              this.showFailMessage = true; // Exibe a mensagem
              setTimeout(() => {
                this.showFailMessage = false; // Oculta após 3 segundos
                this.alertMsg = ""
              }, 3000);
            }else if(this.authService.getUserTokens() < 2000){

              this.alertMsg = "Você precisa de pelo menos 2000 Tokens"
              this.showFailMessage = true; // Exibe a mensagem
              setTimeout(() => {
                this.showFailMessage = false; // Oculta após 3 segundos
                this.alertMsg = ""
              }, 3000);
            }


          }

          break;




        case 40:
          if(this.user.Level >= 40 && this.authService.getUserTokens() >=5000) {
            this.playSound.playCleanSound2()
            this.authService.decreseToken(5000)
            this.trilhaAtual = "Level 40"
            this.final_lxp_bounty = 100000
            this.final_tokens_bounty = 750
            this.trilhaService.updateTrilhaData({trilha_on: "Level 50"});
            this.trilhaService.updateTrilhaData({final_lxp_bounty: 100000});
            this.trilhaService.updateTrilhaData({final_tokens_bounty: 750});

            this.alertMsg = "Trilha liberada com sucesso!"
            this.showSuccessMessage = true; // Exibe a mensagem
            setTimeout(() => {
              this.showSuccessMessage = false; // Oculta após 3 segundos
              this.alertMsg = ""
            }, 3000);

          }else{

            this.playSound.playTokenZero()
            if(this.user.Level < 40){
              this.alertMsg = "Atinja o Level 40 para desbloquear essa trilha"
              this.showFailMessage = true; // Exibe a mensagem
              setTimeout(() => {
                this.showFailMessage = false; // Oculta após 3 segundos
                this.alertMsg = ""
              }, 3000);
            }else if(this.authService.getUserTokens() < 5000){

              this.alertMsg = "Você precisa de pelo menos 5000 Tokens"
              this.showFailMessage = true; // Exibe a mensagem
              setTimeout(() => {
                this.showFailMessage = false; // Oculta após 3 segundos
                this.alertMsg = ""
              }, 3000);
            }




          }

          break;

        default:
          break;
      }


  }


  onMouseEnter() {

  }

  navigate_to() {
    this.playSound.playCleanSound2()
    this.router.navigate(['/trilha-active']);
  }

}

