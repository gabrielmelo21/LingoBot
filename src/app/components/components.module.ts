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
import { CheckInComponent } from './check-in/check-in.component';
import { PlanosComponent } from './planos/planos.component';
import { CreateFlashcardComponent } from './create-flashcard/create-flashcard.component';
import { MissoesDiariasComponent } from './missoes-diarias/missoes-diarias.component';
import { ReferralComponent } from './referral/referral.component';
import { DesafiosInicianteComponent } from './desafios-iniciante/desafios-iniciante.component';
import { BugReportComponent } from './bug-report/bug-report.component';
import { RankingComponent } from './ranking/ranking.component';
import { TrilhaDeEstudosComponent } from './trilha-de-estudos/trilha-de-estudos.component';
import { TrilhaDeEstudosActiveComponent } from './trilha-de-estudos-active/trilha-de-estudos-active.component';
import { Step1Component } from './step1/step1.component';
import { Step2Component } from './step2/step2.component';
import { Step3Component } from './step3/step3.component';
import { Step4Component } from './step4/step4.component'


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
    CheckInComponent,
    PlanosComponent,
    CreateFlashcardComponent,
    MissoesDiariasComponent,
    ReferralComponent,
    DesafiosInicianteComponent,
    BugReportComponent,
    RankingComponent,
    TrilhaDeEstudosComponent,
    TrilhaDeEstudosActiveComponent,
    Step1Component,
    Step2Component,
    Step3Component,
    Step4Component

  ],
    exports: [
        HeaderComponent,
        FooterLinksComponent,
        CreateFlashcardComponent,
        LingobotCardComponent
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
