import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {PlaySoundService} from "../../services/play-sound.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-referral',
  templateUrl: './referral.component.html',
  styleUrls: ['./referral.component.css']
})
export class ReferralComponent implements OnInit {
  user: any;
  referralLink: string = '';
  totalLingoTokens: number = 0;
  showSuccessMessage = false;

  constructor(private router: Router, private auth: AuthService, private playSound: PlaySoundService) {
    window.scrollTo(0, 0); // Faz o scroll para o topo ao carregar o componente

  }

  ngOnInit(): void {
    this.auth.user$.subscribe(userData => {
      if (!userData) return;
      this.user = userData;
      const hostname = window.location.origin; // Obtém "http://localhost:4200" ou domínio real
      this.referralLink = `${hostname}/login?referral=${this.user.referal_code}`;
      this.totalLingoTokens = this.user.tokens_by_referral

    });
  }

  copiarLink() {
    navigator.clipboard.writeText(this.referralLink).then(() => {
      this.playSound.playCleanSound();
      this.showSuccessMessage = true;
      setTimeout(() => {
        this.showSuccessMessage = false; // Oculta a mensagem após 3 segundos
      }, 3000);
    });
  }


  navigate_to() {
    this.playSound.playCleanSound()
    this.router.navigate(['/home']);
  }


}

