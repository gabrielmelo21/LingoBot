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
import { TheosRoomWritingComponent } from "./components/questsPremium/theos-room-writing/theos-room-writing.component";
import { TheosRoomReadingComponent } from "./components/questsPremium/theos-room-reading/theos-room-reading.component";
import { TheosRoomListeningComponent } from "./components/questsPremium/theos-room-listening/theos-room-listening.component";
import { TheosRoomSpeakingComponent } from "./components/questsPremium/theos-room-speaking/theos-room-speaking.component";
import { DoorsSecretWritingComponent } from "./components/questsPremium/doors-secret-writing/doors-secret-writing.component";
import { DoorsSecretReadingComponent } from "./components/questsPremium/doors-secret-reading/doors-secret-reading.component";
import { DoorsSecretListeningComponent } from "./components/questsPremium/doors-secret-listening/doors-secret-listening.component";
import { DoorsSecretSpeakingComponent } from "./components/questsPremium/doors-secret-speaking/doors-secret-speaking.component";
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
  { path: "theos_room_writing", component: TheosRoomWritingComponent },
  { path: "theos_room_reading", component: TheosRoomReadingComponent },
  { path: "theos_room_listening", component: TheosRoomListeningComponent },
  { path: "theos_room_speaking", component: TheosRoomSpeakingComponent },
  { path: "doors_secret_writing", component: DoorsSecretWritingComponent },
  { path: "doors_secret_reading", component: DoorsSecretReadingComponent },
  { path: "doors_secret_listening", component: DoorsSecretListeningComponent },
  { path: "doors_secret_speaking", component: DoorsSecretSpeakingComponent },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
