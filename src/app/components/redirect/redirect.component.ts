import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {MainAPIService} from "../../services/main-api.service";

@Component({
  selector: 'app-redirect',
  templateUrl: './redirect.component.html',
  styleUrls: ['./redirect.component.css']
})
export class RedirectComponent {

  constructor(private mainAPI: MainAPIService, private router: Router) {





   if(localStorage.getItem("refresh_pos_login") == "false"){
     this.getUserData();
   }
    if(localStorage.getItem("refresh_pos_login") == "true"){
      this.redirectToHome()
    }

   if(localStorage.getItem("logged") == "false"){
     this.redirectToLogin()
   }
  }


  getUserData(){
    if(localStorage.getItem("UserId") !== ""){
      this.mainAPI.updateUserData(localStorage.getItem("UserId")+"")

      setTimeout(() =>{
          this.reloadMethod()
        localStorage.setItem("refresh_pos_login", "true")
      }, 1000)
    }

  }

   reloadMethod(){
     window.location.reload();
   }

  redirectToLogin() {
    this.router.navigate(['/login']);
  }


  redirectToHome() {
    this.router.navigate(['/videos']);
  }

}
