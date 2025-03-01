import {ChangeDetectorRef, Component, EventEmitter, Output} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {PlaySoundService} from "../../services/play-sound.service";


interface Flashcard {
  id: number;
  word: string;
  explanation: string;
  how_to_use: string;
  translation: string;
}



@Component({
  selector: 'app-create-flashcard',
  templateUrl: './create-flashcard.component.html',
  styleUrls: ['./create-flashcard.component.css']
})



export class CreateFlashcardComponent {
  constructor(private playSound: PlaySoundService, private auth: AuthService) {

  }

  newFlashcard: Flashcard = {
  id: 0,
  word: '',
  explanation: '',
  how_to_use: '',
  translation: ''
};

  @Output() closeModal = new EventEmitter<unknown>();
  showSuccessMessage = false;

  saveFlashcard() {
    if (!this.newFlashcard.word.trim()) {
      alert('A palavra principal (word) é obrigatória!');
      return;
    }


    this.newFlashcard.id = new Date().getTime(); // Gera um ID único
    const storedFlashcards = localStorage.getItem('flashcards');
    const flashcards: Flashcard[] = storedFlashcards ? JSON.parse(storedFlashcards) : [];

    flashcards.push({ ...this.newFlashcard });
    localStorage.setItem('flashcards', JSON.stringify(flashcards));

    this.showSuccessMessage = true; // Exibe a mensagem de sucesso

    setTimeout(() => {
      this.showSuccessMessage = false; // Oculta a mensagem após 3 segundos
    }, 3000);

    this.auth.updateMetaUser({ meta7: true });
    this.playSound.playCleanSound()
    this.resetForm();
  }

  resetForm() {
    this.newFlashcard = { id: 0, word: '', explanation: '', how_to_use: '', translation: '' };
  }
}
