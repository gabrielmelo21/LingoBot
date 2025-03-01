import {Component, OnInit} from '@angular/core';
import {BehaviorSubject, finalize, map, Observable, of, tap} from "rxjs";
import {MainAPIService} from "../../services/main-api.service";
import {PlaySoundService} from "../../services/play-sound.service";
import {Router} from "@angular/router";


interface Flashcard {
  id: number;
  owner: string;
  word: string;
  explanation: string;
  how_to_use: string;
  translation: string;
}


@Component({
  selector: 'app-flashcards',
  templateUrl: './flashcards.component.html',
  styleUrls: ['./flashcards.component.css']
})



export class FlashcardsComponent  implements OnInit {



  constructor(private playSound: PlaySoundService, private router: Router) {
    window.scrollTo(0, 0); // Faz o scroll para o topo ao carregar o componente
  }
  flashcards: Flashcard[] = []; // Lista de flashcards
  isEmpty: boolean = true; // Estado para verificar se a lista está vazia

  ngOnInit() {
    this.loadFlashcards();
  }

  loadFlashcards() {
    const storedFlashcards = localStorage.getItem('flashcards');
    this.flashcards = storedFlashcards ? JSON.parse(storedFlashcards) : [];
    this.isEmpty = this.flashcards.length === 0; // Atualiza o estado
  }

  delete_smartcard(id: number) {
    this.flashcards = this.flashcards.filter(flashcard => flashcard.id !== id);
    localStorage.setItem('flashcards', JSON.stringify(this.flashcards));
    this.isEmpty = this.flashcards.length === 0; // Atualiza o estado
  }




  navigate_to() {
    this.playSound.playCleanNavigationSound()
    this.router.navigate(['/home']);
  }
  playHover() {
    this.playSound.playSwipe();
  }





}
