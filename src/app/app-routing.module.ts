import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {ExpressionGeneratorComponent} from "./components/expression-generator/expression-generator.component";
import {PracticeComponent} from "./components/practice/practice.component";
import {TradutorComponent} from "./components/tradutor/tradutor.component";
import {VideosComponent} from "./components/videos/videos.component";
import {LoginComponent} from "./components/login/login.component";
import {AppComponent} from "./app.component";
import {RedirectComponent} from "./components/redirect/redirect.component";
import {TeacherComponent} from "./components/teacher/teacher.component";
import {DiscoverExpressionsComponent} from "./components/discover-expressions/discover-expressions.component";
import {FlashcardsComponent} from "./components/flashcards/flashcards.component";


const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'home',
    loadChildren: () => import('./components/components.module').then(m => m.ComponentsModule)
  },
  { path: 'practice', component: PracticeComponent },
  { path: 'expressionGenerator', component: ExpressionGeneratorComponent },
  { path: 'tradutor', component: TradutorComponent },
  { path: 'videos', component: VideosComponent },
  { path: 'login', component: LoginComponent },
  { path: "redirect", component: RedirectComponent},
  { path: "teacher", component: TeacherComponent},
  { path: "discoverExpressions", component: DiscoverExpressionsComponent },
  { path: "flashcards", component: FlashcardsComponent },



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
