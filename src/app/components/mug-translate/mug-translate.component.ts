import { Component } from '@angular/core';
import {MainAPIService} from "../../services/main-api.service";
import {PlaySoundService} from "../../services/play-sound.service";
import {Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-mug-translate',
  templateUrl: './mug-translate.component.html',
  styleUrls: ['./mug-translate.component.css']
})
export class MugTranslateComponent {
  formulario: FormGroup;
  isLoading: boolean = false;

  constructor(private apiService: MainAPIService,
              private playSound: PlaySoundService,
              private formBuilder: FormBuilder) {

    this.formulario = this.formBuilder.group({
      english: ['', Validators.required],
    });


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









  translation: string = '';
  getTranslation() {
    this.mudarCena(0)
    setTimeout(() => {
      // out
          this.mudarCena(2)
    }, 2500)

    setTimeout(() => {
      //only blackboard
      this.mudarCena(5)
    }, 6000)

    const userText = this.formulario.get('english')?.value;

    this.isLoading = true;
    this.playSound.playCleanNavigationSound();


    this.apiService.translateText(userText).subscribe(response => {
      console.log('Resposta da API:', response); // Debug
      if (response.text) {
        this.translation = response.text;
        this.isLoading = false;
      } else {
        this.translation = 'Erro ao traduzir.';
      }
    }, error => {
      console.error('Erro na requisição:', error);
      this.translation = 'Erro ao conectar com o servidor.';
    });
  }


}
