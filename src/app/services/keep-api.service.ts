import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { interval, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class KeepAPIService {
  private readonly API = 'https://lingobot-api.onrender.com';
  private pingSubscription?: Subscription;
  private readonly WAKE_THRESHOLD = 10 * 60 * 1000; // 10 minutos

  constructor(private http: HttpClient) {


  }

  async ensureApiAwake(): Promise<void> {
    const lastPing = localStorage.getItem('lastPingTime');
    const now = Date.now();

    if (lastPing && now - Number(lastPing) < this.WAKE_THRESHOLD) return;

    return new Promise((resolve) => {
      const tryPing = () => {
        const start = performance.now(); // cada tentativa tem seu próprio start
        this.http.get(this.API + '/', { responseType: 'text' }).subscribe({
          next: () => {
            const duration = performance.now() - start; // agora mede apenas esse ping
            console.log(`⏱️ API ping levou ${duration.toFixed(0)} ms`);

            localStorage.setItem('lastPingTime', Date.now().toString());

            if (duration < 1000) {
              resolve();
            } else {
              setTimeout(tryPing, 3000); // tenta de novo só depois
            }
          },
          error: () => setTimeout(tryPing, 3000)
        });
      };

      tryPing();
    });
  }


  /** Mantém a API acordada em background a cada 30s (opcional) */
  keepApiAwakeInBackground() {
    // dispara o primeiro ping de cara
    this.ensureApiAwake();

    // continua pingando a cada 30s
    this.pingSubscription = interval(30000).subscribe(() => {
      this.ensureApiAwake();
    });
  }

  stopBackgroundPings() {
    if (this.pingSubscription) {
      this.pingSubscription.unsubscribe();
      this.pingSubscription = undefined;
    }
  }
}
