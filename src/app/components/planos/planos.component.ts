import { Component } from '@angular/core';
import {PlaySoundService} from "../../services/play-sound.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-planos',
  templateUrl: './planos.component.html',
  styleUrls: ['./planos.component.css']
})
export class PlanosComponent {

  constructor(private playSound: PlaySoundService, private router : Router) {
  }

  navigate_to() {
    this.playSound.playCleanSound()
    this.router.navigate(['/home']);
  }

}
