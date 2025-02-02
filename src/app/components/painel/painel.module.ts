import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PainelComponent } from './painel.component';
import {RouterLink, RouterLinkActive} from "@angular/router";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatIconModule} from "@angular/material/icon";



@NgModule({
  declarations: [
    PainelComponent
  ],
    imports: [
        CommonModule,
        RouterLink,
        RouterLinkActive,
        MatButtonModule,
        MatCardModule,
        MatProgressSpinnerModule,
        MatTooltipModule,
        MatIconModule
    ],
  exports: [PainelComponent]
})
export class PainelModule { }
