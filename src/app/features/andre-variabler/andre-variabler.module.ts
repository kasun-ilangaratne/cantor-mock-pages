import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AndreVariablerComponent } from './andre-variabler.component';

const routes: Routes = [{ path: '', component: AndreVariablerComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes), AndreVariablerComponent]
})
export class AndreVariablerModule {}
