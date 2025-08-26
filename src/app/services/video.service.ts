import { Injectable } from '@angular/core';
import { Filesystem, Directory } from '@capacitor/filesystem';

@Injectable({ providedIn: 'root' })
export class VideoService {

  private baseUrl = 'https://lingobot-api.onrender.com/static/videos'; // seu endpoint

  constructor() {
    console.log('VideoService inicializado!');
  }

  async getVideo(videoName: string): Promise<string> {
    const fileName = `${videoName}.mp4`;

    try {
      // Tenta pegar o arquivo local
      const file = await Filesystem.readFile({
        path: fileName,
        directory: Directory.Data
      });

      console.log('Vídeo lido localmente (base64)');

      // Retorna direto a base64
      return `data:video/mp4;base64,${file.data}`;
    } catch {
      console.log('Vídeo não encontrado localmente, baixando do backend...');

      const url = `${this.baseUrl}/${fileName}`;
      const response = await fetch(url);
      const blob = await response.blob();
      const base64Data = await this.blobToBase64(blob);

      // Salva local
      await Filesystem.writeFile({
        path: fileName,
        data: (base64Data as string).split(',')[1], // salva sem o prefixo data:video/mp4;base64,
        directory: Directory.Data,
      });

      console.log('Vídeo baixado e salvo localmente');

      return base64Data as string; // retorna completo com data:video/mp4;base64,...
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
}
