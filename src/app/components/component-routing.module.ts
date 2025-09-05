import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {BabelTowerComponent} from "./babel-tower/babel-tower.component";

const routes: Routes = [
  {path: '', component: BabelTowerComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComponentRoutingModule { }
