import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.css']
})
export class SkillsComponent implements OnInit {
  user: any;

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    this.auth.user$.subscribe(userData => {
      if (userData) {
        this.user = userData;
      }
    });
  }

  getLevelAndProgress(xp: number) {
    const level = Math.floor(xp / 1000) + 1;  // Calcula o nível
    const progress = (xp % 1000) / 10; // Calcula a porcentagem de progresso

    return { level, progress };
  }

  get listening() {
    return this.user ? this.getLevelAndProgress(this.user.listening) : { level: 0, progress: 0 };
  }

  get reading() {
    return this.user ? this.getLevelAndProgress(this.user.reading) : { level: 0, progress: 0 };
  }

  get writing() {
    return this.user ? this.getLevelAndProgress(this.user.writing) : { level: 0, progress: 0 };
  }

  get speaking() {
    return this.user ? this.getLevelAndProgress(this.user.speaking) : { level: 0, progress: 0 };
  }
}

