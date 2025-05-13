import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TrilhaService {
  private torreKey = 'torreData'; // Chave do localStorage para os dados da torre
  private torreSubject: BehaviorSubject<any>; // Declara o BehaviorSubject
  torre$: Observable<any>; // Observable para a torre

  constructor() {
    const torreInicial = this.getTorreData() || this.initializeTorreData();
    this.torreSubject = new BehaviorSubject(torreInicial); // Inicializa o BehaviorSubject
    this.torre$ = this.torreSubject.asObservable(); // Cria o Observable a partir do BehaviorSubject
  }

// Método para obter os dados da torre do localStorage
  getTorreData(): any {
    const torreData = localStorage.getItem(this.torreKey);
    return torreData ? JSON.parse(torreData) : null;
  }


// Método para salvar a estrutura inicial da torre
  initializeTorreData(): any {
    const defaultTorre = {
      andar_atual: 1,
      andar_inicial_conjunto: 1,
      andar_final_conjunto: 4,
      exercise1: false,
      exercise2: false,
      exercise3: false,
      exercise4: false,
      pedagio_pago: false, // Para indicar se o pedágio foi pago antes de avançar
    };

    localStorage.setItem(this.torreKey, JSON.stringify(defaultTorre));
    return defaultTorre;
  }

// Método para atualizar os dados da torre
  updateTorreData(changes: any): void {
    const torreData = this.getTorreData();
    if (!torreData) return;

    const updatedTorre = {
      ...torreData,
      ...Object.keys(changes).reduce((acc, key) => {
        acc[key] =
          typeof changes[key] === 'number' && typeof torreData[key] === 'number'
            ? torreData[key] + changes[key] // Soma valores numéricos (andar, etc.)
            : changes[key]; // Substitui os outros valores normalmente
        return acc;
      }, {} as any),
    };

    localStorage.setItem(this.torreKey, JSON.stringify(updatedTorre));
    this.torreSubject.next(updatedTorre); // Atualiza o BehaviorSubject
  }


/**
  resetTorreData(): void {
    localStorage.removeItem(this.torreKey);
    const torreInicial = this.initializeTorreData();
    this.torreSubject.next(torreInicial); // Atualiza o BehaviorSubject com os dados iniciais
  }

**/

}
