import { Component } from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-life-bar',
  templateUrl: './life-bar.component.html',
  styleUrls: ['./life-bar.component.css']
})
export class LifeBarComponent {
  maxHp: number = 1;
  currentHp: number = 1;
  hpArray: number[] = [];

  constructor(public authService: AuthService, public router: Router) {
    this.setupHpByDifficulty();
  }


  private setupHpByDifficulty() {
    switch (this.authService.getDifficulty()) {
      case 'easy':
        this.maxHp = 9; break;
      case 'medium':
        this.maxHp = 7; break;
      case 'hard':
        this.maxHp = 5; break;
      case 'elder':
        this.maxHp = 3; break;
      default:
        this.maxHp = 5; break;
    }
    this.currentHp = this.maxHp;
    this.hpArray = Array(this.maxHp).fill(0);
  }



  private updateHpBar() {
    this.currentHp = Math.max(this.currentHp - 1, 0);
  }

  onWrongAnswer() {
    if (this.currentHp > 0) {
      this.updateHpBar();
      if (this.currentHp === 0) {
       this.router.navigate(['/babel-tower']);
      }
    }
  }




}
