import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {catchError, map, Observable, tap, throwError} from "rxjs";
import {error} from "@angular/compiler-cli/src/transformers/util";
import {jwtDecode} from "jwt-decode";

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
  private readonly API = 'https://lingobot-api.onrender.com';
 // private readonly API = "http://127.0.0.1:5000/"

  /**
   * http://localhost:8085/gpt
   *   private readonly API = 'https://flashcards-ai-java-api.onrender.com/api';
   *   private readonly API2 = "https://flashcards-ai-java-api.onrender.com/frequency"
   *
   * @param http
   */
  constructor(private http: HttpClient) { }


  // Método para criar o usuário
  criarUsuario(usuario: any): Observable<any> {
    return this.http.post(this.API + "/usuarios", usuario);
  }




  login(email: string, password: string) {
    const data = {
      "email": email,
      "password": password
    };
    return this.http.post<any>(`${this.API}/login`, data).pipe(
      tap(response => {
         //console.log('Login Response:', response); // Verifique o retorno do backend aqui
      }),
      catchError(error => {
        console.error('Erro no login:', error); // Verifique os erros aqui
        return throwError(() => new Error(error));
      })
    );
  }




  public GPT(prompt: string, userText: string, type: string): Observable<any> {
    let prompt0 = '';

    switch (type) {
      case "ListeningChecking":
        prompt0 = `o texto "${userText}" fala sobre o tema disso "${prompt}". é relacionado ou próximo? Responda apenas com True ou False.`;
        break;
      case "WritingChecking":
        prompt0 = `Avalie o seguinte texto em inglês e forneça um JSON com a pontuação de gramática, coerência e vocabulário (0 a 3000 cada, pode ser rígido), além de erros e sugestões de melhoria. Retorne apenas o JSON, sem explicações extras.
Texto: "${userText}"
Tema: "${prompt}"
Formato de resposta esperado:
{
  "gramatica": 3000,
  "coerencia": 3000,
  "vocabulario": 3000,
  "erros": "Descreva erros aqui (Explique em PT-BR)",
  "melhorias": "Sugira melhorias aqui (Explique em PT-BR)",
  "notaFinal": 9000
}`;
        break;

        case "ReadingGenerateExerciseOptions":
          prompt0 = `Gere quatro alternativas de múltipla escolha sobre o tema central do seguinte texto de leitura. Uma delas deve ser correta e as outras três erradas. O objetivo é testar a compreensão do texto.

Texto: "${prompt}"
Regras: Deixe a resposta certa em qualquer uma das letras, o json abaixo é apenas um exemplo
Formato de resposta esperado (apenas JSON, sem explicações adicionais):
{
  "options": [
    { "text": "A)  [Alternativa errada ou correta]", "right": [true ou false] },
    { "text": "B) [Alternativa errada ou correta]", "right": [true ou false] },
    { "text": "C) [Alternativa errada ou correta]", "right": [true ou false] },
    { "text": "D) [Alternativa errada ou correta]", "right": [true ou false] }
  ]
}`;
        break;
      case "ExplainExpression":
        prompt0 = `Explique o significado da expressão, phrasal verb, gíria ou frase fornecida, como ela é usada e forneça a tradução para o português. Retorne apenas o JSON com os seguintes campos:
 - "explicacao": a explicação em português do significado.
- "uso": como a expressão é usada no contexto.
- "traducao": tradução da expressão para o português.
Exemplo de resposta esperada (somente o JSON):
{
  "explicacao": "Significa ficar muito animado ou empolgado com algo.",
  "uso": "Ela ficou *over the moon* quando soube que passou no concurso.",
  "traducao": "Extremamente feliz ou animada."
}
Texto: "${userText}"
`;
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

  getLongText(difficulty: string) {
    const data = { "difficulty": difficulty };
    return this.http.post<any>(this.API + "/get-long-texts",  data );
  }






  //gerar texto para audio
  getTTS(text: string) {
    return this.http.post(`${this.API}/tts`, { text }, { responseType: 'blob' });
  }

  translateText(text: string): Observable<any> {
    const data = { "text": text };
    return this.http.post<any>(`${this.API}/translate`, data);
  }



  // Método para obter o ranking
  getRanking(): Observable<any> {
    return this.http.get<any>(`${this.API}/ranking`);
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
