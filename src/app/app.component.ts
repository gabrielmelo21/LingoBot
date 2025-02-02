import { Component } from '@angular/core';

import {animate, style, transition, trigger} from "@angular/animations";
import {Router} from "@angular/router";
import {MainAPIService} from "./services/main-api.service";
import {map} from "rxjs";


interface User {
  id: string;
}

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


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = ' ';
  loggedStatus: any;


  constructor(private router: Router, private mainAPI: MainAPIService) {

    var urlParamsGoogle = new URLSearchParams(window.location.search);


    if (urlParamsGoogle.has('googleLogin')) {
      var googleLoginId = urlParamsGoogle.get('googleLogin');
      localStorage.setItem("UserId", googleLoginId+"");
      localStorage.setItem('logged', "true");
      this.router.navigate(['/redirect']);
    }








    // Verifica se a variável 'loggedIn' já foi criada no localStorage
    if (!localStorage.getItem('logged')) {
      // Se não foi criada, define-a como 'false'
      localStorage.setItem('logged', 'false');
      //this.redirectToLogin();
    }



    if(localStorage.getItem('logged') == "false"){
        this.loggedStatus = false;
    }else{
       this.loggedStatus = true;
    }


    if(localStorage.getItem("logged") == "false"){
  //    this.redirectToLogin();
    }else{
      this.redirectToHome();
    }





  }


  redirectToLogin() {
    this.router.navigate(['/login']);
  }


  redirectToHome() {
    this.router.navigate(['/videos']);
  }



}
