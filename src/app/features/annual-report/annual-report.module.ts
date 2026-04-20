import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { AnnualReportComponent } from './annual-report.component';

const routes: Routes = [{ path: '', component: AnnualReportComponent }];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), AnnualReportComponent]
})
export class AnnualReportModule {}

