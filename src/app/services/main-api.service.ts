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
  private readonly API = 'http://localhost:8085/api';
  private readonly API3 = "http://127.0.0.1:5000/ask"

  /**
   * http://localhost:8085/gpt
   *   private readonly API = 'https://flashcards-ai-java-api.onrender.com/api';
   *   private readonly API2 = "https://flashcards-ai-java-api.onrender.com/frequency"
   *
   * @param http
   */
  constructor(private http: HttpClient) { }


  public completeWithGPT(prompt: any) {
    const prompt1 = "Explique de forma resumida a expressão '" + prompt + "'";
    const data = {
      "prompt": prompt1
    };

    return this.http.post(this.API3, data, { responseType: 'text' as 'json' });
  }


  public transalateWithGPT(prompt: any){
    const prompt1 = "apenas Traduza para pt-br: '" + prompt + "'";
    const data = {
      "prompt": prompt1
    };

    return this.http.post(this.API3, data, { responseType: 'text' as 'json' });
  }


  public talkWithGPT(prompt: any) {
    const prompt1 = "(English) " + prompt + "";
    const data = {
      "prompt": prompt1
    };

    return this.http.post(this.API3, data, { responseType: 'text' as 'json' });
  }



  public phrasalVerbWithGPT(){
    const prompt1 = "Me ensine um Phrsal Verb";
    const data = {
      "prompt": prompt1
    };

    return this.http.post(this.API3, data, { responseType: 'text' as 'json' });
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
