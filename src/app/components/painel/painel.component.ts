import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {MainAPIService} from "../../services/main-api.service";


@Component({
  selector: 'app-painel',
  templateUrl: './painel.component.html',
  styleUrls: ['./painel.component.css']
})
export class PainelComponent {

  picture: any;
  nome: any;
  credits: any;
  vip: any;
  isLoading: boolean = true;



  loadPicture(): void {
    this.isLoading = false;
    this.picture = localStorage.getItem("picture");
    this.nome = localStorage.getItem("nome");
    this.vip = localStorage.getItem("vip");
    this.credits = localStorage.getItem("credits");
    this.credits.toFixed(2);
    if (!this.picture) {
      console.error("Nenhuma imagem encontrada no localStorage!");
    }
  }

constructor(private mainAPI: MainAPIService) {


 // PRIMEIRO VEM ESSE carregando os dados do usuario
 // var userId = localStorage.getItem("UserId");
 // this.mainAPI.updateUserData(userId+"")

// DEPOIS VEM ESSE
  setTimeout(() => {
    this.loadPicture();
  }, 1000); // 100 ms deve ser suficiente, ajuste se necessário





  // FORMATAÇÃO DO CREDITS



}


  selectedOption: string | null = 'home';

  selectOption(option: string) {
    this.selectedOption = option;
  }


  protected readonly localStorage = localStorage;
}
