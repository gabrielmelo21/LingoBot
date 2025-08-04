import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {LoginComponent} from "./components/login/login.component";
import {MissoesDiariasComponent} from "./components/missoes-diarias/missoes-diarias.component";
import {ReferralComponent} from "./components/referral/referral.component";
import {RankingComponent} from "./components/ranking/ranking.component";


import {SkillsComponent} from "./components/skills/skills.component";
import {BabelTowerComponent} from "./components/babel-tower/babel-tower.component";
import {WritingComponent} from "./components/writing/writing.component";
import {ReadingComponent} from "./components/reading/reading.component";
import {ListeningComponent} from "./components/listening/listening.component";
import {SpeakingComponent} from "./components/speaking/speaking.component";
import {TowerComponent} from "./tower/tower.component";
import {UpgradeTowerVideoComponent} from "./components/upgrade-tower-video/upgrade-tower-video.component";
import {WritingPremium1Component} from "./components/writing-premium1/writing-premium1.component";
import {ReadingPremium1Component} from "./components/reading-premium1/reading-premium1.component";
import {ListeningPremium1Component} from "./components/listening-premium1/listening-premium1.component";
import {SpeakingPremium1Component} from "./components/speaking-premium1/speaking-premium1.component";
import {LevelUpComponent} from "./components/level-up/level-up.component";



const routes: Routes = [
  //{ path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'home',
    loadChildren: () => import('./components/components.module').then(m => m.ComponentsModule),
  },
  { path: 'babel-tower', component: BabelTowerComponent },
  { path: 'login', component: LoginComponent },
  { path: "missoes-diarias", component: MissoesDiariasComponent },
  { path: "referral", component: ReferralComponent },
  { path: "ranking", component: RankingComponent },

  { path: "skills", component: SkillsComponent  },
  { path: "tower", component: TowerComponent },
  { path: "upgradeTowerVideo", component: UpgradeTowerVideoComponent },

  { path: "level", component: LevelUpComponent },

  // FREE
  { path: "writing", component: WritingComponent  },
  { path: "reading", component: ReadingComponent },
  { path: "listening", component: ListeningComponent },
  { path: "speaking", component: SpeakingComponent },

  // PREMIUM
  { path: "writing_premium1", component: WritingPremium1Component  },
  { path: "reading_premium1", component: ReadingPremium1Component },
  { path: "listening_premium1", component: ListeningPremium1Component },
  { path: "speaking_premium1", component: SpeakingPremium1Component},


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
