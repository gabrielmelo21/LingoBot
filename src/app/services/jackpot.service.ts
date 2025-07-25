import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JackpotService {

  // Sorteia um número de 1 a 10 e retorna se deu jackpot
  isJackpot(): boolean {
    const sorteio = Math.floor(Math.random() * 10) + 1;
    const resultado = sorteio >= 7;
    console.log('Número sorteado:', sorteio);
    console.log('Jackpot:', resultado);
    return resultado;
  }

  // Se quiser, pode retornar também o número sorteado:
  getJackpotResult(): { jackpot: boolean; numero: number } {
    const sorteio = Math.floor(Math.random() * 10) + 1;
    const jackpot = sorteio >= 7;
    return { jackpot, numero: sorteio };
  }
}
