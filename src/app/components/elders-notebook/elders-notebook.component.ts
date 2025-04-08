import {Component, OnInit} from '@angular/core';
import {PlaySoundService} from "../../services/play-sound.service";
import {MainAPIService} from "../../services/main-api.service";

@Component({
  selector: 'app-elders-notebook',
  templateUrl: './elders-notebook.component.html',
  styleUrls: ['./elders-notebook.component.css']
})
export class EldersNotebookComponent implements OnInit {

  constructor(private playSoundService: PlaySoundService,
              private apiService: MainAPIService) {
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
    const saved = localStorage.getItem('elders_pages');
    if (saved) {
      this.pages = JSON.parse(saved);
    } else {
      // Página de exemplo
      this.pages = [{
        title: 'Elders Book - Livro Mágico dos Anciões',
        subtitle: 'Como esse livro funciona?',
        text: 'Diferente do Livro de Anotações comum, esse é mágico, e contem conhecimento infinito de Línguas,' +
          ' quando você coloca o titulo fazendo um pergunta, por exemplo *Como usar o verbo GET?* e clica em salvar página, o ' +
          'livro por ter todo conhecimento linguístico do mundo irá fazer um resumo para você de como usar o GET por exemplo. Então escreva sua pergunta no título da página e deixa o livro dos anciões fazer sua Magia!!!'
      }];
      this.saveToLocalStorage();
    }
  }


  saveToLocalStorage() {
    localStorage.setItem('elders_pages', JSON.stringify(this.pages));
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
    const savedPages = localStorage.getItem('elders_pages');

    if (savedPages) {
      let pagesArray = JSON.parse(savedPages);

      // Protege a página principal
      if (title === 'Elders Book - Livro Mágico dos Anciões') {
        console.warn('Esta página não pode ser removida.');
        return;
      }

      // Remove a página com o título correspondente
      pagesArray = pagesArray.filter((page: any) => page.title !== title);

      localStorage.setItem('elders_pages', JSON.stringify(pagesArray));
    }
  }




 isLoading: boolean = false;

  createPage() {
    this.isLoading = true;


    /**
    this.playSoundService.setVolume(0.1);
    this.playSoundService.playMagic();
     **/

    if (!this.newPage.title) {
      alert("O título não pode estar vazio.");
      this.isLoading = false; // evita ficar preso no loading
      return;
    }




    this.apiService.GPT(this.newPage.title, "", "EldersBook").subscribe(response => {
      console.log('Resposta bruta da API:', response);

      const parsed = JSON.parse(response);
      console.log('Texto extraído:', parsed.response);

      this.newPage.text = parsed.response;

      this.pages.push({ ...this.newPage });

      // 👇 Redireciona para a nova página
      this.currentPage = this.pages.length - 1;

      this.saveToLocalStorage();

      this.newPage = { title: '', subtitle: '', text: '' };
      this.formStep = 1;
      this.isLoading = false;
      this.playSoundService.playCleanSound2();
    });
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
