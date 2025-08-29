import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { interval, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class KeepAPIService {
  private readonly API = 'https://lingobot-api.onrender.com';
  private pingSubscription?: Subscription;
  private readonly PING_INTERVAL_COLD = 5000; // 5 segundos quando API está fria/warming
  private readonly PING_INTERVAL_WARM = 10 * 60 * 1000; // 10 minutos quando API está ready
  private clientId: string;
  private isApiReady = false;
  private currentInterval = this.PING_INTERVAL_COLD;

  constructor(private http: HttpClient) {
    // Gera um ID único para este cliente
    this.clientId = this.generateClientId();
  }

  private generateClientId(): string {
    return 'client_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Assegura que a API está acordada - agora muito mais simples
   * A lógica complexa foi movida para o backend
   */
  async ensureApiAwake(): Promise<void> {
    return new Promise((resolve, reject) => {
      const tryPing = () => {
        const start = performance.now();

        this.http.get(`${this.API}/ping?client_id=${this.clientId}`)
          .subscribe({
            next: (response: any) => {
              const duration = performance.now() - start;

              console.log(`🔄 Ping response:`, response);
              console.log(`⏱️ Request took ${duration.toFixed(0)} ms`);

              // Verifica o status da resposta
              switch (response.status) {
                case 'ready':
                case 'warmed_up':
                  console.log('✅ API is ready!');
                  this.isApiReady = true;
                  this.updatePingInterval(this.PING_INTERVAL_WARM);
                  resolve();
                  break;

                case 'warming':
                  console.log(`🔄 API warming in progress by ${response.warming_started_by}`);
                  console.log(`⏳ ${response.waiting_clients} clients waiting`);
                  this.isApiReady = false;
                  this.updatePingInterval(this.PING_INTERVAL_COLD);
                  setTimeout(tryPing, response.retry_after_ms || 5000);
                  break;

                case 'warming_failed':
                  console.log('❌ Previous warming failed, retrying...');
                  this.isApiReady = false;
                  this.updatePingInterval(this.PING_INTERVAL_COLD);
                  setTimeout(tryPing, response.retry_after_ms || 3000);
                  break;

                default:
                  console.log('⚠️ Unknown status, retrying...');
                  this.isApiReady = false;
                  this.updatePingInterval(this.PING_INTERVAL_COLD);
                  setTimeout(tryPing, 5000);
              }
            },
            error: (error) => {
              console.error('❌ Ping error:', error);
              this.isApiReady = false;
              this.updatePingInterval(this.PING_INTERVAL_COLD);
              setTimeout(tryPing, 5000);
            }
          });
      };

      tryPing();
    });
  }

  /**
   * Atualiza o intervalo de ping dinamicamente
   */
  private updatePingInterval(newInterval: number) {
    if (this.currentInterval === newInterval) {
      return; // Já está no intervalo correto
    }

    console.log(`🔄 Changing ping interval from ${this.currentInterval/1000}s to ${newInterval/1000}s`);
    this.currentInterval = newInterval;

    // Se já existe uma subscription ativa, recria com novo intervalo
    if (this.pingSubscription && !this.pingSubscription.closed) {
      this.pingSubscription.unsubscribe();
      this.startBackgroundPings();
    }
  }

  /**
   * Inicia os pings em background (método auxiliar)
   */
  private startBackgroundPings() {
    this.pingSubscription = interval(this.currentInterval).subscribe(() => {
      // Se a API estiver ready, faz ping menos agressivo
      if (this.isApiReady) {
        console.log(`🔄 Maintenance ping (API ready) - interval: ${this.currentInterval/1000}s`);
      } else {
        console.log(`🔄 Checking API status - interval: ${this.currentInterval/1000}s`);
      }

      this.ensureApiAwake().catch(console.error);
    });
  }

  /**
   * Mantém a API acordada em background
   * Agora com intervalos dinâmicos baseados no status da API
   */
  keepApiAwakeInBackground() {
    console.log('🚀 Starting intelligent background API keep-alive...');

    // Para qualquer ping anterior
    this.stopBackgroundPings();

    // Faz o primeiro ping imediatamente
    this.ensureApiAwake()
      .then(() => {
        console.log(`📊 Initial ping completed. API ready: ${this.isApiReady}`);
        // Inicia os pings periódicos com o intervalo apropriado
        this.startBackgroundPings();
      })
      .catch((error) => {
        console.error('❌ Initial ping failed:', error);
        // Mesmo com erro, inicia os pings para tentar recuperar
        this.startBackgroundPings();
      });
  }

  /**
   * Para os pings em background
   */
  stopBackgroundPings() {
    if (this.pingSubscription) {
      console.log('🛑 Stopping background pings...');
      this.pingSubscription.unsubscribe();
      this.pingSubscription = undefined;
    }
  }

  /**
   * Força uma verificação imediata do status da API
   * Útil quando você suspeita que a API pode ter "esfriado"
   */
  forceApiCheck() {
    console.log('🔍 Force checking API status...');
    this.isApiReady = false;
    this.updatePingInterval(this.PING_INTERVAL_COLD);
    return this.ensureApiAwake();
  }

  /**
   * Método auxiliar para verificar o status do sistema de ping (para debug)
   */
  async checkPingStatus(): Promise<any> {
    try {
      return this.http.get(`${this.API}/ping/status`).toPromise();
    } catch (error) {
      console.error('Error checking ping status:', error);
      throw error;
    }
  }

  /**
   * Força reset do estado de ping no servidor (para admin/debug)
   */
  async forceResetPingState(): Promise<any> {
    try {
      return this.http.post(`${this.API}/ping/force-reset`, {}).toPromise();
    } catch (error) {
      console.error('Error resetting ping state:', error);
      throw error;
    }
  }
}
