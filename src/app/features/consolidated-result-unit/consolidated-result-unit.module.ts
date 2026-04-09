import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';

// Shared Module
import { SharedModule } from '../../shared/shared.module';

import { ConsolidatedResultUnitComponent } from './consolidated-result-unit.component';
import { CounterpartyDialogModule } from './counterparty-dialog/counterparty-dialog.module';
import { DimensionFilterDialogModule } from './dimension-filter-dialog/dimension-filter-dialog.module';
import { EliminationsDialogModule } from './eliminations-dialog/eliminations-dialog.module';
import { AlternativeCalculationDialogModule } from './alternative-calculation-dialog/alternative-calculation-dialog.module';
import { ExceptionDialogModule } from './exception-dialog/exception-dialog.module';
import { HistoricalCostDialogModule } from './historical-cost-dialog/historical-cost-dialog.module';
import { ChangeDialogModule } from './change-dialog/change-dialog.module';

const routes: Routes = [
  { path: '', component: ConsolidatedResultUnitComponent }
];

@NgModule({
  declarations: [ConsolidatedResultUnitComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,

    SharedModule,

    AlternativeCalculationDialogModule,
    ChangeDialogModule,
    CounterpartyDialogModule,
    DimensionFilterDialogModule,
    EliminationsDialogModule,
    ExceptionDialogModule,
    HistoricalCostDialogModule,
  ],
  exports: [ConsolidatedResultUnitComponent]
})
export class ConsolidatedResultUnitModule {} 