import {Component, Input} from '@angular/core';
import { MainAPIService } from "../../services/main-api.service";
import { PlaySoundService } from "../../services/play-sound.service";

import { FormBuilder, FormGroup, Validators } from "@angular/forms";


@Component({
  selector: 'app-mug-translate',
  templateUrl: './mug-translate.component.html',
  styleUrls: ['./mug-translate.component.css']
})
export class MugTranslateComponent {

  @Input() top: string = 'auto';
  @Input() left: string = 'auto';
  @Input() right: string = 'auto';
  @Input() bottom: string = 'auto';
  @Input() zIndex: string = '9999';



  constructor(private mainAPI: MainAPIService, private playSoundService: PlaySoundService) { }

  translatedWord = '';

  translationResult: {
    significado?: string;
    exemplo?: string;
    categoria?: string;
    error?: string;
  } | null = null;

  isTabletOpen = false;
  inputText = ''; // Esta é a variável ligada ao input no HTML
  translatedText = 'Translate Everything...'; // Texto inicial exibido
  isLoading = false;

  openTablet() {
    this.playSoundService.playSwipe();
    this.isTabletOpen = !this.isTabletOpen;
  }

  closeTablet() {
    this.isTabletOpen = false;
    this.resetTranslationState(); // Usa o novo método para limpar ao fechar
    this.translatedText = 'Translate Everything...'; // Restaura o texto inicial
  }

  /**
   * Limpa as variáveis relacionadas à tradução para preparar uma nova pesquisa.
   */
  resetTranslationState() {
    this.inputText = ''; // Limpa o campo de input
    this.translationResult = null; // Limpa o resultado da tradução
    this.translatedWord = ''; // Limpa a palavra que foi traduzida
    this.isLoading = false; // Garante que o estado de carregamento esteja desativado
  }

  async translate() {
    if (!this.inputText.trim()) {
      this.translationResult = { error: 'Por favor, digite uma palavra para traduzir.' };
      return;
    }

    this.translationResult = null;
    this.isLoading = true;

    const prompt = `
Responda SOMENTE com um JSON válido e diretamente no seguinte formato:

{
  "significado": "tradução mais comum em português",
  "categoria": "phrasal verb, expression, adjetivo, verbo, etc",
  "exemplo": "frase com a palavra em inglês"
}

Palavra: "${this.inputText}"

⚠️ NÃO escreva nenhuma explicação ou texto fora do JSON. Apenas o objeto JSON.
`;


    try {
      const result = await this.mainAPI.callGeminiStructured(prompt);

      const isValidResult = result &&
        typeof result.significado === 'string' &&
        typeof result.categoria === 'string' &&
        typeof result.exemplo === 'string';

      if (!isValidResult) {
        this.translationResult = { error: 'Não foi possível obter uma tradução válida. Tente outra palavra.' };
      } else {
        this.translationResult = result;
        this.translatedWord = this.inputText;
        this.inputText = '';
      }
    } catch (error) {
      console.error('Erro durante a tradução:', error);
      this.translationResult = { error: 'Erro inesperado. Verifique o console.' };
    } finally {
      this.isLoading = false;
    }
  }

}
