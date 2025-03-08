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
import {TrilhaDeEstudosComponent} from "./components/trilha-de-estudos/trilha-de-estudos.component";
import {TrilhaDeEstudosActiveComponent} from "./components/trilha-de-estudos-active/trilha-de-estudos-active.component";
import {Step1Component} from "./components/step1/step1.component";
import {Step2Component} from "./components/step2/step2.component";
import {Step3Component} from "./components/step3/step3.component";


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
  { path: "trilha", component: TrilhaDeEstudosComponent },
  { path: "trilha-active", component: TrilhaDeEstudosActiveComponent  },
  { path: "step1", component: Step1Component  },
  { path: "step2", component: Step2Component  },
  { path: "step3", component: Step3Component  },



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
