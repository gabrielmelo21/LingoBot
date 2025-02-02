import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {PlaySoundService} from "../../services/play-sound.service";

@Component({
  selector: 'app-quests',
  templateUrl: './quests.component.html',
  styleUrls: ['./quests.component.css']
})
export class QuestsComponent {
  userChoiceStatus: string = "";
  constructor( private router: Router, private playSound: PlaySoundService){

  }

  userChoice(choice: string) {
    this.playSound.playCleanNavigationSound()
    this.userChoiceStatus = choice;

    if (choice == "listening"){

    }


  }


  navigate_to() {
    this.playSound.playCleanNavigationSound()
    this.router.navigate(['/home']);
  }
}
