import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TranslationService {


  private apiUrl = 'http://127.0.0.1:5000/translate';

  constructor(private http: HttpClient) {}

  translate(text: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = {
      text: text,
    };

    return this.http.post<any>(this.apiUrl, body, { headers });
  }


}
