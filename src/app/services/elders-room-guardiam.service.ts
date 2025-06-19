import { Injectable } from '@angular/core';
import {Router} from "@angular/router";

export interface EldersRoomStatus {
  writing_was_paid: boolean;
  reading_was_paid: boolean;
  speaking_was_paid: boolean;
  listening_was_paid: boolean;
}

const STORAGE_KEY = 'elders_room_status';


@Injectable({ providedIn: 'root' })




export class EldersRoomGuardiamService {

  constructor(private router: Router) {
    this.initializeStatus(); // garante que o localStorage tenha algo ao iniciar
  }


  private initializeStatus(): void {
    console.log("guardiam initializado..")
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      this.resetAll();
    }
  }

  private getStatus(): EldersRoomStatus {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) as EldersRoomStatus : {
      writing_was_paid: false,
      reading_was_paid: false,
      speaking_was_paid: false,
      listening_was_paid: false,
    };
  }

  private setStatus(status: EldersRoomStatus): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(status));
  }


  /** Reseta todos os desafios para "não pago" */
  resetAll(): void {
    console.log("guardiam reset..")
    this.setStatus({
      writing_was_paid: false,
      reading_was_paid: false,
      speaking_was_paid: false,
      listening_was_paid: false,
    });
  }

  /** Marca um desafio como pago usando o nome base (writing, reading, etc) */
  markAsPaid(section: string): void {
    const key = `${section}_was_paid` as keyof EldersRoomStatus;
    const status = this.getStatus();
    status[key] = true;
    this.setStatus(status);
  }

  /** Faz a verificação de acesso com base na rota */
  verifyAccessOrRedirect(route: keyof EldersRoomStatus): boolean {
    const status = this.getStatus();

    if (status[route]) {
      // Se pago, zera o flag (pra pagar de novo depois)
      status[route] = false;
      this.setStatus(status);
      return true;
    }

    // Se não pago, redireciona e nega o acesso
    this.router.navigate(['/babel-tower']);
    return false;
  }




}
