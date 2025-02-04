import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";

interface UserData {
  id: string;
  nome: string;
  sobrenome: string;
  email: string;
  picture: string;
  credits: number;
  vip: boolean;
  checkin: boolean;
  password: string;
}


@Injectable({
  providedIn: 'root'
})
export class MainAPIService {
  //private readonly API = 'http://localhost:8085/api';
  private readonly API = "http://127.0.0.1:5000/"

  /**
   * http://localhost:8085/gpt
   *   private readonly API = 'https://flashcards-ai-java-api.onrender.com/api';
   *   private readonly API2 = "https://flashcards-ai-java-api.onrender.com/frequency"
   *
   * @param http
   */
  constructor(private http: HttpClient) { }


  //const prompt0 = "Explique de forma resumida a expressão '" + prompt + "'";


  public GPT(prompt: string, userText: string, type: string): Observable<any> {
    let prompt0 = '';

    switch (type) {
      case "ListeningChecking":
        prompt0 = `o texto "${userText}" fala sobre o tema disso "${prompt}". é relacionado ou próximo? Responda apenas com True ou False.`;
        break;
      case "WritingChecking":
        prompt0 = `Avalie o seguinte texto em inglês e forneça um JSON com a pontuação de gramática, coerência e vocabulário (0 a 1000 cada), além de erros e sugestões de melhoria. Retorne apenas o JSON, sem explicações extras.
Texto: "${userText}"
Tema: "${prompt}"
Formato de resposta esperado:
{
  "gramatica": 1000,
  "coerencia": 1000,
  "vocabulario": 1000,
  "erros": "Descreva erros aqui",
  "melhorias": "Sugira melhorias aqui",
  "notaFinal": 3000
}`;
        break;

      default:
        throw new Error("Tipo inválido fornecido para GPT.");
    }

    const data = { "prompt": prompt0 };

    return this.http.post(this.API + "/chat", data, { responseType: 'text' as 'json' });
  }



  getText(difficulty: string) {
    const data = { "difficulty": difficulty };
    return this.http.post<any>(this.API + "/get-text",  data );
  }

  getTema(difficulty: string) {
    const data = { "difficulty": difficulty };
    return this.http.post<any>(this.API + "/get-temas",  data );
  }




  //gerar texto para audio
  getTTS(text: string) {
    return this.http.post(`${this.API}/tts`, { text }, { responseType: 'blob' });
  }




  public transalateWithGPT(prompt: any){
    const prompt1 = "apenas Traduza para pt-br: '" + prompt + "'";
    const data = {
      "prompt": prompt1
    };

    return this.http.post(this.API, data, { responseType: 'text' as 'json' });
  }


  public talkWithGPT(prompt: any) {
    const prompt1 = "(English) " + prompt + "";
    const data = {
      "prompt": prompt1
    };

    return this.http.post(this.API, data, { responseType: 'text' as 'json' });
  }



  public phrasalVerbWithGPT(){
    const prompt1 = "Me ensine um Phrsal Verb";
    const data = {
      "prompt": prompt1
    };

    return this.http.post(this.API, data, { responseType: 'text' as 'json' });
  }




  public listAllWords(uuid: string){ //parametro ID do user
    return this.http.get<any>(this.API+"/smartcards_owner/"+uuid);

  }

  public updateMemo(id: number){
    return this.http.put(this.API + "/updateMemo/"+id, '');
  }

  public deleteSmartcard(id: number){
     return this.http.delete(this.API +"/"+ id, { responseType: 'text' as 'json' });
  }


  public addWords(data: any) {
    return this.http.post<any>(this.API, data);
  }


  /**
  public update(){
   return this.http.put<any>(this.API2, '')
  }

  **/

  public random(){
    return this.http.get(this.API + "/random/"+localStorage.getItem("UserId"))
  }


  public login(data: any){
     return this.http.post<any>("http://localhost:8085/basicLogin", data)
  }




  public getUserInfoById(id: string) : Observable<UserData>{
     return this.http.get<UserData>(this.API + "/users/"+id)
  }


  public saveNewUser(data: any){
    return this.http.post<any>(this.API+"/users", data,  { responseType: 'text' as 'json' });
  }


  updateUserData(id: string) {
    this.getUserInfoById(id).pipe(
      map((userInfo: UserData) => {
        if (userInfo) {
          // Armazenando os dados no localStorage, verificando se cada propriedade existe
           localStorage.setItem('nome', userInfo.nome);
           localStorage.setItem('sobrenome', userInfo.sobrenome);
           localStorage.setItem('email', userInfo.email);
           localStorage.setItem('picture', userInfo.picture);
           localStorage.setItem('credits', userInfo.credits.toString());
           localStorage.setItem('vip', JSON.stringify(userInfo.vip));
           localStorage.setItem('checkin', JSON.stringify(userInfo.checkin));
           localStorage.setItem('password', userInfo.password);
        }

      })
    ).subscribe();
  }


}
