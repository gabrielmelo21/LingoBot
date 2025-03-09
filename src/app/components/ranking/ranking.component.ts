import {Component, OnInit} from '@angular/core';
import {PlaySoundService} from "../../services/play-sound.service";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {MainAPIService} from "../../services/main-api.service";

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.css']
})
export class RankingComponent implements OnInit {
  ranking: any[] = [];
  user: any;
  isLoading: boolean = false;

  constructor(private mainApiService: MainAPIService, private playSoundService: PlaySoundService, private auth: AuthService, router: Router) {
    window.scrollTo(0, 0); // Faz o scroll para o topo ao carregar o componente
  }


  ngOnInit(): void {
    // Pegando os dados do usuário logado
    this.auth.user$.subscribe(userData => {
      if (!userData) return;
      this.user = userData;
    });

    this.getRanking();

  }

  getRanking(): void {
    this.isLoading = true;
    this.mainApiService.getRanking().subscribe(
      (data: any[]) => {
        this.ranking = data;
        console.log('Ranking obtido.');
        this.isLoading = false;
      },
      (error: any) => {
        console.error('Erro ao obter ranking:', error);
        this.isLoading = false;
      }
    );
  }





}
