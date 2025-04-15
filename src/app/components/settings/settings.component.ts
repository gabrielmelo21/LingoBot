import {Component, OnInit} from '@angular/core';
import {PlaySoundService} from "../../services/play-sound.service";
import {ModalService} from "../../services/modal.service";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  selectedDifficult: number = 0;
  selectedOption: string = '';
//'Conta',
  options = [ 'Dificuldade', 'Personalização', 'Fechar Settings'];
  campos = [
    { key: 'comida', label: 'Comida favorita', exemplo: 'Pizza, Sushi, Feijoada' },
    { key: 'filme', label: 'Filme favorito', exemplo: 'Toy Story, Vingadores, Carros' },
    { key: 'carro', label: 'Carro favorito', exemplo: 'Lamborghini, Fusca, Fórmula 1' },
    { key: 'banda', label: 'Cantor(a)/banda favorita', exemplo: 'BTS, Taylor Swift, Iron Maiden' },
    { key: 'desenho', label: 'Desenho favorito', exemplo: 'Ben 10, Bob Esponja, Naruto' },
    { key: 'animal', label: 'Animal favorito', exemplo: 'Gato, Leão, Golfinho' },
    { key: 'heroi', label: 'Super-herói favorito', exemplo: 'Homem-Aranha, Mulher-Maravilha' },
    { key: 'cor', label: 'Cor favorita', exemplo: 'Azul, Vermelho, Preto' },
    { key: 'hobby', label: 'Hobby ou passatempo favorito', exemplo: 'Jogar futebol, desenhar, tocar violão' },
    { key: 'personagem', label: 'Personagem favorito de jogo', exemplo: 'Mario, Sonic, Steve (Minecraft)' }
  ];

  preferencias: { [key: string]: string[] } = {};

  constructor(private playSound: PlaySoundService, private modalService: ModalService) {
  }


  ngOnInit(): void {
    const dados = localStorage.getItem('preferencias');
    if (dados) {
      this.preferencias = JSON.parse(dados);
    }
  }

  salvarPreferencia(valor: string, key: string): void {
    if (!valor.trim()) return;

    const valoresSeparados = valor
      .split(',')
      .map(v => v.trim())
      .filter(v => v !== '');

    this.preferencias[key] = valoresSeparados;

    localStorage.setItem('preferencias', JSON.stringify(this.preferencias));
    console.log(this.preferencias);
  }

  selectOption(option: string) {
    this.playSound.playCleanSound2()
    this.selectedOption = option;

    if (this.selectedOption === 'Fechar Settings') {
        this.modalService.toggleSettingsModal();
    }

  }

  difficulties = [
    { id: 1, img: 'assets/lingobot/dificuldades/baby_bot.png', title: 'Baby Bot', description: 'Ideal para iniciantes, exercícios com inglês básico.' },
    { id: 2, img: 'assets/lingobot/dificuldades/young_bot.png', title: 'Young Bot', description: 'Um bom desafio. exercícios com inglês nível médio.' },
    { id: 3,  img: 'assets/lingobot/dificuldades/adult_bot.png' , title: 'Adult Bot', description: 'Requer habilidade. exercícios com inglês intermediário e expressões' },
    { id: 4, img: 'assets/lingobot/dificuldades/elder_bot.png' , title: 'Elder Bot', description: 'Apenas para os Anciões. exercícios com inglês nátivo.' },
  ];




  changeDifficult(level: number) {
    this.playSound.playCleanSound()
    this.selectedDifficult = level;
    console.log('Dificuldade selecionada:', level);
  }



}
