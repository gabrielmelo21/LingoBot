import {Component, HostListener, OnInit} from '@angular/core';
import {PlaySoundService} from "../../services/play-sound.service";
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {TrilhaService} from "../../services/trilha.service";


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent  {



  constructor(private playSound: PlaySoundService,
              private router: Router,
              private auth: AuthService,
              private trilhaService: TrilhaService) {
    setTimeout(() => {
          this.router.navigate(['/babel-tower']);
    }, 17000)
  }


}
