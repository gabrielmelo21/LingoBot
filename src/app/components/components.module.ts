import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HomeComponent} from "./home/home.component";
import {ComponentRoutingModule} from "./component-routing.module";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {PainelModule} from "./painel/painel.module";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatSelectModule} from '@angular/material/select';
import {MatRippleModule} from "@angular/material/core";
import {MatCardModule} from "@angular/material/card";
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from "@angular/material/input";
import { ExpressionGeneratorComponent } from './expression-generator/expression-generator.component';
import {MatGridListModule} from "@angular/material/grid-list";
import { PracticeComponent } from './practice/practice.component';
import { TradutorComponent } from './tradutor/tradutor.component';
import { PhrsalVerbsComponent } from './phrsal-verbs/phrsal-verbs.component';
import { VideosComponent } from './videos/videos.component';
import {MatToolbarModule} from "@angular/material/toolbar";
import {YouTubePlayerModule} from "@angular/youtube-player";
import { LoginComponent } from './login/login.component';
import { RedirectComponent } from './redirect/redirect.component';
import { TeacherComponent } from './teacher/teacher.component';
import { FooterLinksComponent } from './footer-links/footer-links.component';
import { FlashcardsComponent } from './flashcards/flashcards.component';
import { HeaderComponent } from './header/header.component';
import { DiscoverExpressionsComponent } from './discover-expressions/discover-expressions.component';
import { LingobotCardComponent } from './lingobot-card/lingobot-card.component'


@NgModule({
  declarations: [
    HomeComponent,
    ExpressionGeneratorComponent,
    PracticeComponent,
    TradutorComponent,
    PhrsalVerbsComponent,
    VideosComponent,
    LoginComponent,
    RedirectComponent,
    TeacherComponent,
    FooterLinksComponent,
    FlashcardsComponent,
    HeaderComponent,
    DiscoverExpressionsComponent,
    LingobotCardComponent

  ],
    exports: [
        HeaderComponent,
        FooterLinksComponent
    ],
  imports: [
    CommonModule,
    ComponentRoutingModule,
    MatButtonModule,
    MatIconModule,
    PainelModule,
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
