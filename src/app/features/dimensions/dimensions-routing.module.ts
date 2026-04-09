import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DimensionsComponent } from './dimensions.component';

const routes: Routes = [
  { path: '', component: DimensionsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DimensionsRoutingModule { } 