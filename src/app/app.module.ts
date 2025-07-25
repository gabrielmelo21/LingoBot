import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {RouterLink, RouterOutlet} from "@angular/router";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {HttpClientModule} from '@angular/common/http';
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatToolbarModule} from "@angular/material/toolbar";
import {ComponentsModule} from "./components/components.module";
import {MatTabsModule} from "@angular/material/tabs";
import { ServiceWorkerModule } from '@angular/service-worker';
import {environment} from "../environments/environment";



@NgModule({
  declarations: [
    AppComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterOutlet,
    RouterLink,
    BrowserAnimationsModule,
    MatIconModule,
    MatButtonModule,
    MatIconModule,
    MatButtonModule,
    HttpClientModule,
    MatSnackBarModule,
    MatToolbarModule,
    ComponentsModule,
    MatIconModule,
    MatTabsModule,



  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
