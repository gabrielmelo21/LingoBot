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
import { FooterLinksComponent } from './footer-links/footer-links.component';
import { FlashcardsComponent } from './flashcards/flashcards.component';
import { HeaderComponent } from './header/header.component';
import { DiscoverExpressionsComponent } from './discover-expressions/discover-expressions.component';
import { LingobotCardComponent } from './lingobot-card/lingobot-card.component';
import { QuestsComponent } from './quests/quests.component';
import { ModalFeedbackComponent } from './modal-feedback/modal-feedback.component';
import { PlanosComponent } from './planos/planos.component';
import { CreateFlashcardComponent } from './create-flashcard/create-flashcard.component';
import { MissoesDiariasComponent } from './missoes-diarias/missoes-diarias.component';
import { ReferralComponent } from './referral/referral.component';
import { DesafiosInicianteComponent } from './desafios-iniciante/desafios-iniciante.component';
import { BugReportComponent } from './bug-report/bug-report.component';
import { RankingComponent } from './ranking/ranking.component';

import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { SkillsComponent } from './skills/skills.component';
import { BabelTowerComponent } from './babel-tower/babel-tower.component';
import { MugTranslateComponent } from './mug-translate/mug-translate.component';
import { NotebookComponent } from './notebook/notebook.component';
import { EldersNotebookComponent } from './elders-notebook/elders-notebook.component';

/**
 *
 * import { TrilhaDeEstudosComponent } from './trilha-de-estudos/trilha-de-estudos.component';
 * import { TrilhaDeEstudosActiveComponent } from './trilha-de-estudos-active/trilha-de-estudos-active.component';
 * import { Step2Component } from './step2/step2.component';
 * import { Step3Component } from './step3/step3.component';
 * import { Step4Component } from './step4/step4.component';
 * import { Step1FreeComponent } from './step1-free/step1-free.component';
 * import { Step2FreeComponent } from './step2-free/step2-free.component';
 * import { Step3FreeComponent } from './step3-free/step3-free.component';
 * import { ZExerciseListening1Component } from './z-exercise-listening1/z-exercise-listening1.component';
 * import { ZExerciseWriting1Component } from './z-exercise-writing1/z-exercise-writing1.component';
 * import { ZExerciseReading1Component } from './z-exercise-reading1/z-exercise-reading1.component';
 * import { ZExerciseSpeaking1Component } from './z-exercise-speaking1/z-exercise-speaking1.component';
 *     TrilhaDeEstudosComponent,
 *     TrilhaDeEstudosActiveComponent,
 *     Step2Component,
 *     Step3Component,
 *     Step4Component,
 *     Step1FreeComponent,
 *     Step2FreeComponent,
 *     Step3FreeComponent,
 *     ZExerciseListening1Component,
 *     ZExerciseWriting1Component,
 *     ZExerciseReading1Component,
 *     ZExerciseSpeaking1Component,
 */

@NgModule({
  declarations: [
    HomeComponent,
    LoginComponent,
    FooterLinksComponent,
    FlashcardsComponent,
    HeaderComponent,
    DiscoverExpressionsComponent,
    LingobotCardComponent,
    QuestsComponent,
    ModalFeedbackComponent,
    PlanosComponent,
    CreateFlashcardComponent,
    MissoesDiariasComponent,
    ReferralComponent,
    DesafiosInicianteComponent,
    BugReportComponent,
    RankingComponent,
    AccountSettingsComponent,
    SkillsComponent,
    BabelTowerComponent,
    MugTranslateComponent,
    NotebookComponent,
    EldersNotebookComponent,

  ],
    exports: [
        HeaderComponent,
        FooterLinksComponent,
        CreateFlashcardComponent,
        LingobotCardComponent,
        AccountSettingsComponent,
        RankingComponent,
        MugTranslateComponent,
        NotebookComponent,
        EldersNotebookComponent
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
    YouTubePlayerModule

  ]
})
export class ComponentsModule { }
