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
  final_lxp_bounty: any;
  final_tokens_bounty: any;
  step1: any;
  step2: any;
  step3: any;
  step4: any;
  step5: any;
  step6: any;
  exerciseDescrption1: any;
  exerciseDescrption2: any;
  exerciseDescrption3: any;
  exerciseDescrption4: any;
  exerciseDescrption5: any;
  exerciseDescrption6: any;


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
      this.final_lxp_bounty = trilha.final_lxp_bounty;
      this.final_tokens_bounty = trilha.final_tokens_bounty;
      this.step1 = trilha.step1;
      this.step2 = trilha.step2;
      this.step3 = trilha.step3;
      this.step4 = trilha.step4;
      this.step5 = trilha.step5;
      this.step6 = trilha.step6;
    });

    //this.step1 = true;

    //se for LEVEL 1 exerciseDescrption1 vai ter X e assim por diante.

    if(this.trilhaAtual == ''){
        // senao tiver trilha ativa redireciona para o trilha
        this.router.navigate(["/trilha"]);
    }
    if (this.trilhaAtual == "Level 1") {
       //atualize o 6 para true automaticamente

      this.exerciseDescrption1 = "Listening personalizado";
      this.exerciseDescrption2 = "Aprenda novas palavras";
      this.exerciseDescrption3 = "Aprenda Phrasal verbs";
      this.exerciseDescrption4 = "Aprenda Expressões";
      this.exerciseDescrption5 = "Aprenda e pratique";
      this.exerciseDescrption6 = ""; // Vazio por enquanto
    }

  }






  todasEtapasConcluidas(): boolean {
    return this.step1 && this.step2 && this.step3 && this.step4 && this.step5 && this.step6;
  }

  navigate_to_exercise(number: number): void {

     //redirecionamento com base no level

    // step1 = listening personalizado   (premium mas tera na trilha gratis)     -> vai ter no free
    // step1_free = traduzir vice-versa palavras em ingles      -> vai ter no free
    // step2_free = traduzir vice-versa phrsal verbs            -> vai ter no free
    // step3_free = traduzir vice-versa idiomatics expressions  -> vai ter no free
    // step2 = conversa personalizada escrita
    // step 3 = conversa escrita guiada ensinando -> vai ter no free



    switch (number) {
      case 1:
        // step1 = listening personalizado   -> vai ter no free
        this.playSound.playCleanSound2();
        this.router.navigate(['/step1']);
        break;
      case 2:
        // step1_free = traduzir vice-versa palavras em ingles      -> vai ter no free

        this.playSound.playCleanSound2();

        if(this.trilhaAtual == "Level 1"){
          this.router.navigate(['/step1_free']);
        }else{
          this.router.navigate(['/step2']);
        }

        break;
      case 3:
        this.playSound.playCleanSound2();


        if(this.trilhaAtual == "Level 1"){
          this.router.navigate(['/step2_free']);
        }else{
          this.router.navigate(['/step3']);
        }


        break;
      case 4:
        this.playSound.playCleanSound2();
        if(this.trilhaAtual == "Level 1"){
          this.router.navigate(['/step3_free']);
        }else{
          this.router.navigate(['/step4']);
        }
        break;
      case 5:
        this.playSound.playCleanSound2();

        if (this.trilhaAtual == "Level 1"){
          this.router.navigate(['/step3']);
        }

        //    this.router.navigate(['/step5']);


        break;
      case 6:
        this.playSound.playCleanSound2();
        this.router.navigate(['/step6']);
        break;
    }
  }
}
