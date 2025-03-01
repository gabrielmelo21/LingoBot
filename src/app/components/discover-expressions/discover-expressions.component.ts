import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {PlaySoundService} from "../../services/play-sound.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MainAPIService} from "../../services/main-api.service";
import {catchError, finalize, tap} from "rxjs";

@Component({
  selector: 'app-discover-expressions',
  templateUrl: './discover-expressions.component.html',
  styleUrls: ['./discover-expressions.component.css']
})
export class DiscoverExpressionsComponent {
  isLoading: boolean = false;
  constructor(private playSound: PlaySoundService,
              private router: Router) {
    window.scrollTo(0, 0); // Faz o scroll para o topo ao carregar o componente



    //this.playSound.playDiscoverExpression();  -> opção para o user


  }

  navigate_to() {
    this.playSound.playCleanNavigationSound()
    this.router.navigate(['/home']);
  }


}
