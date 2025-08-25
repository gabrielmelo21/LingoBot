import { Injectable } from '@angular/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '../firebase.config';

@Injectable({ providedIn: 'root' })
export class VideoService {

  constructor() {
    console.log('VideoService inicializado!');
  }

  async getVideo(videoName: string): Promise<string> {
    console.log('getVideo chamado para:', videoName);

    const fileName = `${videoName}.mp4`;

    try {
      // tenta ler local
      const uriResult = await Filesystem.getUri({
        path: fileName,
        directory: Directory.Data,
      });

      console.log('Vídeo encontrado localmente:', uriResult.uri);
      return uriResult.uri;
    } catch (err) {
      console.log('Vídeo não encontrado localmente, baixando do Firebase...');

      const url = await getDownloadURL(ref(storage, `videos/${fileName}`));
      console.log('URL do Firebase:', url);

      const response = await fetch(url);
      const blob = await response.blob();
      console.log('Blob do vídeo baixado, tamanho:', blob.size);

      const base64Data = await this.blobToBase64(blob);
      console.log('Vídeo convertido para base64 (primeiros 100 chars):',
        (base64Data as string).substring(0, 100));

      await Filesystem.writeFile({
        path: fileName,
        data: base64Data as string,
        directory: Directory.Data,
      });
      console.log('Vídeo salvo localmente!');

      const uriResult = await Filesystem.getUri({
        path: fileName,
        directory: Directory.Data,
      });

      console.log('Caminho final do vídeo local:', uriResult.uri);
      return uriResult.uri;
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
