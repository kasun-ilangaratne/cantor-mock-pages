import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';

// Shared Module
import { SharedModule } from '../../../shared/shared.module';

import { AlternativeCalculationDialogComponent } from './alternative-calculation-dialog.component';

@NgModule({
  declarations: [AlternativeCalculationDialogComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    SharedModule
  ],
  exports: [AlternativeCalculationDialogComponent]
})
export class AlternativeCalculationDialogModule {} 