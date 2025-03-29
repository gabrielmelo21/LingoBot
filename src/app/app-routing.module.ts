import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {LoginComponent} from "./components/login/login.component";
import {DiscoverExpressionsComponent} from "./components/discover-expressions/discover-expressions.component";
import {FlashcardsComponent} from "./components/flashcards/flashcards.component";
import {QuestsComponent} from "./components/quests/quests.component";
import {PlanosComponent} from "./components/planos/planos.component";
import {MissoesDiariasComponent} from "./components/missoes-diarias/missoes-diarias.component";
import {ReferralComponent} from "./components/referral/referral.component";
import {DesafiosInicianteComponent} from "./components/desafios-iniciante/desafios-iniciante.component";
import {RankingComponent} from "./components/ranking/ranking.component";
import {TrilhaDeEstudosComponent} from "./components/trilha-de-estudos/trilha-de-estudos.component";
import {TrilhaDeEstudosActiveComponent} from "./components/trilha-de-estudos-active/trilha-de-estudos-active.component";
import {Step2Component} from "./components/step2/step2.component";
import {Step3Component} from "./components/step3/step3.component";
import {Step4Component} from "./components/step4/step4.component";
import {Step1FreeComponent} from "./components/step1-free/step1-free.component";
import {Step2FreeComponent} from "./components/step2-free/step2-free.component";
import {Step3FreeComponent} from "./components/step3-free/step3-free.component";
import {ZExerciseListening1Component} from "./components/z-exercise-listening1/z-exercise-listening1.component";
import {SkillsComponent} from "./components/skills/skills.component";


const routes: Routes = [
  //{ path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'home',
    loadChildren: () => import('./components/components.module').then(m => m.ComponentsModule),
  },
  { path: 'login', component: LoginComponent },
  { path: "discoverExpressions", component: DiscoverExpressionsComponent },
  { path: "flashcards", component: FlashcardsComponent },
  { path: "quests", component: QuestsComponent },
  { path: "planos", component: PlanosComponent },
  { path: "missoes-diarias", component: MissoesDiariasComponent },
  { path: "referral", component: ReferralComponent },
  { path: "desafios-iniciante", component: DesafiosInicianteComponent },
  { path: "ranking", component: RankingComponent },
  { path: "trilha", component: TrilhaDeEstudosComponent },
  { path: "trilha-active", component: TrilhaDeEstudosActiveComponent  },
  { path: "step2", component: Step2Component  },
  { path: "step3", component: Step3Component  },
  { path: "step4", component: Step4Component  },
  { path: "step1_free", component: Step1FreeComponent },
  { path: "step2_free", component: Step2FreeComponent },
  { path: "step3_free", component: Step3FreeComponent },


  { path: "skills", component: SkillsComponent  },

  { path: "listening_exercise1", component: ZExerciseListening1Component  },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
