import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {RouterLink, RouterOutlet} from "@angular/router";
import {BottomNavigationModule} from "./components/bottom-navigation/bottom-navigation.module";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";

import {PainelModule} from "./components/painel/painel.module";
import { HttpClientModule } from '@angular/common/http';
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatToolbarModule} from "@angular/material/toolbar";
import {ComponentsModule} from "./components/components.module";



@NgModule({
  declarations: [
    AppComponent,


  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterOutlet,
    RouterLink,
    BottomNavigationModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatButtonModule,
    MatIconModule,
    MatButtonModule,
    PainelModule,
    HttpClientModule,
    MatSnackBarModule,
    MatToolbarModule,
    ComponentsModule


  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
