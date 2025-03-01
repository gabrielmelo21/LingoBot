import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';  // Ajuste o caminho do seu serviço
import { Router } from '@angular/router';
import {PlaySoundService} from "../../services/play-sound.service";

@Component({
  selector: 'app-missoes-diarias',
  templateUrl: './missoes-diarias.component.html',
  styleUrls: ['./missoes-diarias.component.css'] // Adicione ou ajuste o caminho do CSS
})

export class MissoesDiariasComponent implements OnInit {


  constructor( private cdRef: ChangeDetectorRef, private auth: AuthService, private router: Router, private playSound: PlaySoundService) {
    window.scrollTo(0, 0); // Faz o scroll para o topo ao carregar o componente
  }
  user: any;


  metasNomes: { [key: string]: string } = {
    meta1: "Complete um Desafio de Listening",
    meta2: "Complete um Desafio de Writing",
    meta3: "Complete um Desafio de Reading",
    meta4: "Use a função 'Desvendar expressões'",
    meta5: "Estude com Vídeo",
    meta6: "Faça o Check-in Diário",
    meta7: "Crie um Flashcard",
    meta8: "Complete qualquer Desafio no modo Hard",
    meta9: "Gaste todos seus LingoTokens",
    meta10: "Convide um amigo para o LinboBot"
  };

  metasLXP: { [key: string]: number } = {
    meta1: 2000,
    meta2: 2000,
    meta3: 2000,
    meta4: 2000,
    meta5: 2000,
    meta6: 2000,
    meta7: 2000,
    meta8: 5000,
    meta9: 10000,
    meta10: 10000
  };

  metasKeys: string[] = [];

  ngOnInit(): void {
    this.auth.user$.subscribe((userData: { metasDiarias: {}; }) => {
      if (!userData) return;

      this.user = userData;
      this.metasKeys = Object.keys(userData.metasDiarias);
    });
  }

  claimMeta(key: string): void {
    this.playSound.playCleanSound2()

    if (!this.user || !this.user.metasDiarias) return;

    // Se já foi claimado, não faz nada
    if (this.user.metasDiarias[key] === false) return;

    // Atualiza a meta para "false" (indicando que foi claimada)
    const updatedMetas = { ...this.user.metasDiarias }; // Cria um novo objeto
    updatedMetas[key] = false;
    this.user = { ...this.user, metasDiarias: updatedMetas }; // Atualiza o usuário

    // Obtém a LXP da meta
    const earnedLXP = this.metasLXP[key] || 0;

    // Adiciona LXP e verifica nível
    this.auth.checkLevelUp(earnedLXP);

    // Salva no localStorage
    this.auth.updateLocalUserData({ metasDiarias: updatedMetas });

    // Força a detecção de mudanças
    this.cdRef.detectChanges();
  }
  isClaimDisabled(key: string): boolean {
    return this.user?.metasDiarias[key] === false || this.user?.metasDiarias[key] === undefined;
  }

  navigate_to() {
    this.playSound.playCleanSound()
    this.router.navigate(['/home']);
  }
}

