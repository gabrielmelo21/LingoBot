import {Component, OnInit} from '@angular/core';
import {PlaySoundService} from "../../services/play-sound.service";

@Component({
  selector: 'app-notebook',
  templateUrl: './notebook.component.html',
  styleUrls: ['./notebook.component.css']
})
export class NotebookComponent implements OnInit {

   constructor(private playSoundService: PlaySoundService) {
   }
  pages: any[] = [];
  currentPage = 0;

  // Controle do formulário por etapas
  formStep = 1;
  newPage = {
    title: '',
    subtitle: '',
    text: ''
  };




  ngOnInit() {
    const saved = localStorage.getItem('pages');
    if (saved) {
      this.pages = JSON.parse(saved);
    } else {
      // Página de exemplo
      this.pages = [{
        title: 'Página Exemplo de Anotação',
        subtitle: 'Como criar anotações eficientes?',
        text: 'Aqui você deve anotar oque você quer lembrar e fixar'
      }];
      this.saveToLocalStorage();
    }
  }


  saveToLocalStorage() {
    localStorage.setItem('pages', JSON.stringify(this.pages));
  }

  deleteClicks: number = 0;

  confirmDelete() {
    this.deleteClicks++;

    if (this.deleteClicks >= 3) {
      const deletedPage = this.pages[this.currentPage];

      this.pages.splice(this.currentPage, 1);
      this.deletePageFromLocalStorage(deletedPage.title); // Remove do localStorage também
      this.currentPage = Math.max(0, this.currentPage - 1);
      this.deleteClicks = 0;
      this.playSoundService.playCleanSound()
    }
  }




  deletePageFromLocalStorage(title: string) {
    const savedPages = localStorage.getItem('pages');

    if (savedPages) {
      let pagesArray = JSON.parse(savedPages);

      // Remove a página com o título correspondente
      pagesArray = pagesArray.filter((page: any) => page.title !== title);

      localStorage.setItem('pages', JSON.stringify(pagesArray));
    }
  }




  nextStep() {
    if (this.formStep < 3) this.formStep++;
    this.deleteClicks = 0;
  }

  prevStep() {
    if (this.formStep > 1) this.formStep--;
    this.deleteClicks = 0;
  }

  createPage() {
    this.playSoundService.playCleanSound2()
    this.pages.push({ ...this.newPage });
    this.newPage = { title: '', subtitle: '', text: '' };
    this.formStep = 1;
    this.saveToLocalStorage();
  }




  nextPage() {
    this.playSoundService.playSwipe()
    if (this.currentPage < this.pages.length) this.currentPage++;

  }

  prevPage() {
    this.playSoundService.playSwipe()
    if (this.currentPage > 0) this.currentPage--;
  }
}
