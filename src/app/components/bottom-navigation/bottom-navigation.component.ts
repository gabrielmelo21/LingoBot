import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {PlaySoundService} from "../../services/play-sound.service";

@Component({
  selector: 'app-bottom-navigation',
  templateUrl: './bottom-navigation.component.html',
  styleUrls: ['./bottom-navigation.component.css']
})
export class BottomNavigationComponent  {


  constructor(private _router: Router, private playSound: PlaySoundService) {}




  navigate_to(route: string) {
    this.playSound.playSwipe()
    switch (route) {
      case 'home':
        this._router.navigate(['/home']);
        break;
      case 'missoes-diarias':
        this._router.navigate(['/missoes-diarias']);
        break;
      case 'trilha':
        this._router.navigate(['/trilha']);
        break;

      case 'ranking':
        this._router.navigate(['/ranking']);
        break;

      case 'referral':
        this._router.navigate(['/referral']);
        break;

      default:
        this._router.navigate(['/home']);  // Caso padrão
        break;
    }
  }
}
