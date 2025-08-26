import { Injectable } from '@angular/core';
import { Filesystem, Directory } from '@capacitor/filesystem';

@Injectable({ providedIn: 'root' })
export class VideoService {
  private apiBase = 'https://lingobot-api.onrender.com/static/videos/';

  constructor() {
    console.log('VideoService inicializado!');
  }

  async downloadVideoWithProgress(
    videoName: string,
    onProgress: (progress: number) => void
  ): Promise<void> {
    const url = `${this.apiBase}${videoName}`;
    console.log('Baixando:', url);

    const response = await fetch(url);
    const reader = response.body?.getReader();
    if (!reader) throw new Error('Não foi possível ler o stream do vídeo.');

    const contentLength = Number(response.headers.get('Content-Length')) || 0;
    let receivedLength = 0;
    let chunks: Uint8Array[] = [];

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) {
        chunks.push(value);
        receivedLength += value.length;
        if (contentLength) {
          const progress = Math.round((receivedLength / contentLength) * 100);
          onProgress(progress);
        }
      }
    }

    // Junta os chunks em um único Uint8Array
    const blob = new Blob(chunks, { type: 'video/mp4' });
    const base64Data = await this.blobToBase64(blob);

    // Salva localmente
    await Filesystem.writeFile({
      path: videoName,
      data: (base64Data as string).split(',')[1],
      directory: Directory.Data,
    });

    console.log(`Vídeo ${videoName} baixado e salvo!`);
  }

  async getLocalVideo(videoName: string): Promise<string | null> {
    try {
      const file = await Filesystem.readFile({
        path: videoName,
        directory: Directory.Data,
      });
      return `data:video/mp4;base64,${file.data}`;
    } catch {
      return null;
    }
  }

  private blobToBase64(blob: Blob): Promise<string | ArrayBuffer | null> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  }




  /**
   * Retorna a URL do vídeo pronta para o player, baixando se necessário
   */
  async getVideoForPlayer(videoName: string): Promise<string | null> {
    // Tenta pegar local
    let videoSrc = await this.getLocalVideo(videoName);

    // Se não existir, baixa primeiro
    if (!videoSrc) {
      await this.downloadVideoWithProgress(videoName, (progress) => {
        console.log(`Progresso do download ${videoName}: ${progress}%`);
      });
      videoSrc = await this.getLocalVideo(videoName);
    }

    return videoSrc;
  }


}
