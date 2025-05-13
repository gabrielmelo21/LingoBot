import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.css']
})
export class SkillsComponent implements OnInit {
  user: any;
  listening: any;
  reading: any;
  writing: any;
  speaking: any;


  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    this.auth.user$.subscribe(userData => {
      if (userData) {
        this.user = userData;
        this.listening = userData.listening;
        this.reading = userData.reading;
        this.speaking = userData.speaking;
        this.writing = userData.writing;
      }
    });
  }


}

