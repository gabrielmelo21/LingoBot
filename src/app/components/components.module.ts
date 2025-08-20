import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HomeComponent} from "./home/home.component";
import {ComponentRoutingModule} from "./component-routing.module";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatSelectModule} from '@angular/material/select';
import {MatRippleModule} from "@angular/material/core";
import {MatCardModule} from "@angular/material/card";
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from "@angular/material/input";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatToolbarModule} from "@angular/material/toolbar";
import {YouTubePlayerModule} from "@angular/youtube-player";
import { LoginComponent } from './login/login.component';
import { HeaderComponent } from './header/header.component';
import { ModalFeedbackComponent } from './modal-feedback/modal-feedback.component';
import { MissoesDiariasComponent } from './missoes-diarias/missoes-diarias.component';
import { ReferralComponent } from './referral/referral.component';

import { BugReportComponent } from './bug-report/bug-report.component';
import { RankingComponent } from './ranking/ranking.component';

import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { SkillsComponent } from './skills/skills.component';
import { BabelTowerComponent } from './babel-tower/babel-tower.component';
import { MugTranslateComponent } from './mug-translate/mug-translate.component';
import { NotebookComponent } from './notebook/notebook.component';
import { WritingComponent } from './writing/writing.component';
import { ReadingComponent } from './reading/reading.component';
import { SpeakingComponent } from './speaking/speaking.component';
import { ListeningComponent } from './listening/listening.component';
import { SettingsComponent } from './settings/settings.component';
import { ItensComponent } from './itens/itens.component';
import { LevelUpComponent } from './level-up/level-up.component';
import { NewItemModalComponent } from './new-item-modal/new-item-modal.component';
import { UpgradeTowerVideoComponent } from './upgrade-tower-video/upgrade-tower-video.component';
import { WritingPremium1Component } from './writing-premium1/writing-premium1.component';
import { ReadingPremium1Component } from './reading-premium1/reading-premium1.component';
import { ListeningPremium1Component } from './listening-premium1/listening-premium1.component';
import { SpeakingPremium1Component } from './speaking-premium1/speaking-premium1.component';

import { AfterWinDialogComponent } from './after-win-dialog/after-win-dialog.component';
import { LifeBarComponent } from './life-bar/life-bar.component';
import { DailyMissionComponent } from './daily-mission/daily-mission.component';
import { ItemModalComponent } from './item-modal/item-modal.component';
import {AppModule} from "../app.module";
import { SelectQuestModalComponent } from './select-quest-modal/select-quest-modal.component';
import { BatteryComponent } from './battery/battery.component';
import { GemasWarningComponent } from './gemas-warning/gemas-warning.component';
import { TheosRoomWritingComponent } from './questsPremium/theos-room-writing/theos-room-writing.component';
import { DoorsSecretWritingComponent } from './questsPremium/doors-secret-writing/doors-secret-writing.component';
import { TheosRoomReadingComponent } from './questsPremium/theos-room-reading/theos-room-reading.component';
import { TheosRoomListeningComponent } from './questsPremium/theos-room-listening/theos-room-listening.component';
import { TheosRoomSpeakingComponent } from './questsPremium/theos-room-speaking/theos-room-speaking.component';
import { DoorsSecretReadingComponent } from './questsPremium/doors-secret-reading/doors-secret-reading.component';
import { DoorsSecretListeningComponent } from './questsPremium/doors-secret-listening/doors-secret-listening.component';
import { DoorsSecretSpeakingComponent } from './questsPremium/doors-secret-speaking/doors-secret-speaking.component';



@NgModule({
  declarations: [
    HomeComponent,
    LoginComponent,
    HeaderComponent,
    ModalFeedbackComponent,
    MissoesDiariasComponent,
    ReferralComponent,
    BugReportComponent,
    RankingComponent,
    AccountSettingsComponent,
    SkillsComponent,
    BabelTowerComponent,
    MugTranslateComponent,
    NotebookComponent,
    WritingComponent,
    ReadingComponent,
    SpeakingComponent,
    ListeningComponent,
    SettingsComponent,
    ItensComponent,
    LevelUpComponent,
    NewItemModalComponent,
    UpgradeTowerVideoComponent,
    WritingPremium1Component,
    ReadingPremium1Component,
    ListeningPremium1Component,
    SpeakingPremium1Component,

    AfterWinDialogComponent,
    LifeBarComponent,
    DailyMissionComponent,
    ItemModalComponent,
    SelectQuestModalComponent,
    BatteryComponent,
    GemasWarningComponent,
    TheosRoomWritingComponent,
    DoorsSecretWritingComponent,
    TheosRoomReadingComponent,
    TheosRoomListeningComponent,
    TheosRoomSpeakingComponent,
    DoorsSecretReadingComponent,
    DoorsSecretListeningComponent,
    DoorsSecretSpeakingComponent,



  ],
  exports: [
    HeaderComponent,
    AccountSettingsComponent,
    RankingComponent,
    MugTranslateComponent,
    NotebookComponent,
    SettingsComponent,
    ItensComponent,
    LevelUpComponent,
    NewItemModalComponent,
    GemasWarningComponent
  ],
    imports: [
        CommonModule,
        ComponentRoutingModule,
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatSelectModule,
        MatRippleModule,
        MatCardModule,
        FormsModule,
        MatInputModule,
        ReactiveFormsModule,
        MatGridListModule,
        MatToolbarModule,
        YouTubePlayerModule,


    ]
})
export class ComponentsModule { }
