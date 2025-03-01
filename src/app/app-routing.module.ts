import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {VideosComponent} from "./components/videos/videos.component";
import {LoginComponent} from "./components/login/login.component";
import {DiscoverExpressionsComponent} from "./components/discover-expressions/discover-expressions.component";
import {FlashcardsComponent} from "./components/flashcards/flashcards.component";
import {QuestsComponent} from "./components/quests/quests.component";
import {CheckInComponent} from "./components/check-in/check-in.component";
import {PlanosComponent} from "./components/planos/planos.component";
import {MissoesDiariasComponent} from "./components/missoes-diarias/missoes-diarias.component";
import {ReferralComponent} from "./components/referral/referral.component";
import {DesafiosInicianteComponent} from "./components/desafios-iniciante/desafios-iniciante.component";
import {RankingComponent} from "./components/ranking/ranking.component";


const routes: Routes = [
  //{ path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'home',
    loadChildren: () => import('./components/components.module').then(m => m.ComponentsModule),
  },
  { path: 'videos', component: VideosComponent },
  { path: 'login', component: LoginComponent },
  { path: "discoverExpressions", component: DiscoverExpressionsComponent },
  { path: "flashcards", component: FlashcardsComponent },
  { path: "quests", component: QuestsComponent },
  { path: "check-in", component: CheckInComponent },
  { path: "planos", component: PlanosComponent },
  { path: "missoes-diarias", component: MissoesDiariasComponent },
  { path: "referral", component: ReferralComponent },
  { path: "desafios-iniciante", component: DesafiosInicianteComponent },
  { path: "ranking", component: RankingComponent },



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
