import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TrilhaService {
  private trilhaKey = 'trilhaData'; // Chave do localStorage para os dados da trilha
  private trilhaSubject: BehaviorSubject<any>; // Declara o BehaviorSubject
  trilha$: Observable<any>; // Observable para a trilha

  constructor() {
    const trilhaInicial = this.getTrilhaData() || this.initializeTrilhaData();
    this.trilhaSubject = new BehaviorSubject(trilhaInicial); // Inicializa o BehaviorSubject
    this.trilha$ = this.trilhaSubject.asObservable(); // Cria o Observable a partir do BehaviorSubject
  }

  // Método para obter os dados da trilha do localStorage
  getTrilhaData(): any {
    const trilhaData = localStorage.getItem(this.trilhaKey);
    return trilhaData ? JSON.parse(trilhaData) : null;
  }

  // Método para salvar a estrutura inicial da trilha
  initializeTrilhaData(): any {
    const defaultTrilha = {
      trilha_on: '',
      step1: false,
      rounds_step1: 0,
      step2: false,
      rounds_step2: 0,
      step3: false,
      rounds_step3: 0,
      step4: false,
      rounds_step4: 0,
      step5: false,
      rounds_step5: 0,
      step6: false,
      rounds_step6: 0,
      final_lxp_bounty: 0,
      final_tokens_bounty: 0,
    };


    localStorage.setItem(this.trilhaKey, JSON.stringify(defaultTrilha));
    return defaultTrilha;
  }

  // Método para atualizar os dados da trilha
  updateTrilhaData(changes: any): void {
    const trilhaData = this.getTrilhaData();
    if (!trilhaData) return;

    const updatedTrilha = {
      ...trilhaData,
      ...Object.keys(changes).reduce((acc, key) => {
        acc[key] =
          typeof changes[key] === 'number' && typeof trilhaData[key] === 'number'
            ? trilhaData[key] + changes[key] // Soma os valores numéricos
            : changes[key]; // Substitui os outros valores normalmente
        return acc;
      }, {} as any),
    };

    localStorage.setItem(this.trilhaKey, JSON.stringify(updatedTrilha));
    this.trilhaSubject.next(updatedTrilha); // Atualiza o BehaviorSubject
  }

  // Método para resetar os dados da trilha
  resetTrilhaData(): void {
    localStorage.removeItem(this.trilhaKey);
    const trilhaInicial = this.initializeTrilhaData();
    this.trilhaSubject.next(trilhaInicial); // Atualiza o BehaviorSubject com os dados iniciais
  }
}
