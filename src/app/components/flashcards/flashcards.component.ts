import { Component } from '@angular/core';
import {finalize, map, Observable, of} from "rxjs";
import {MainAPIService} from "../../services/main-api.service";
import {PlaySoundService} from "../../services/play-sound.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-flashcards',
  templateUrl: './flashcards.component.html',
  styleUrls: ['./flashcards.component.css']
})
export class FlashcardsComponent {


  public listWords$: Observable<any> | undefined;
  public isLoading = false;


  constructor(private playSound: PlaySoundService,  private router: Router, private mainAPI: MainAPIService) {

    const words = [
      { id: 1, english: 'Hello', portugues: 'Olá', explain: 'Saudação comum em inglês.' },
      { id: 2, english: 'Goodbye', portugues: 'Adeus', explain: 'Expressão de despedida.' },
      { id: 3, english: 'Thank you', portugues: 'Obrigado', explain: 'Expressão de gratidão.' },
      { id: 4, english: 'Please', portugues: 'Por favor', explain: 'Expressão de cortesia ao fazer um pedido.' },
      { id: 4, english: 'Please', portugues: 'Por favor', explain: 'Expressão de cortesia ao fazer um pedido.' },
      { id: 4, english: 'Please', portugues: 'Por favor', explain: 'Expressão de cortesia ao fazer um pedido.' },
      { id: 4, english: 'Please', portugues: 'Por favor', explain: 'Expressão de cortesia ao fazer um pedido.' },
      { id: 4, english: 'Please', portugues: 'Por favor', explain: 'Expressão de cortesia ao fazer um pedido.' },
      { id: 4, english: 'Please', portugues: 'Por favor', explain: 'Expressão de cortesia ao fazer um pedido.' }

    ];

    // Convertendo o array para um Observable
    this.listWords$ = of(words);


  //  this.listWords();

  }











  navigate_to() {
    this.playSound.playCleanNavigationSound()
    this.router.navigate(['/home']);
  }
  playHover() {
    this.playSound.playSwipe();
  }



  emptyList: boolean = false;
  public listWords(){
    this.isLoading = true;
    this.listWords$ = this.mainAPI.listAllWords(localStorage.getItem("UserId")+"").pipe(
      map(resp => {
        if(resp.length === 0){
          this.emptyList = true;
        }else{
          this.emptyList = false;
        }
        return resp.reverse();
      }),
      finalize(() => this.isLoading = false)

    );
  }


  delete_smartcard(id: number) {
    this.mainAPI.deleteSmartcard(id).pipe(
      map(resp => {
        alert(JSON.stringify(resp))
        this.listWords();
      })
    ).subscribe();
  }

}
