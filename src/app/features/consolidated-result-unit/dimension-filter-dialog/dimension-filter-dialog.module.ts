import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { DimensionFilterDialogComponent } from './dimension-filter-dialog.component';

@NgModule({
  declarations: [
    DimensionFilterDialogComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatCheckboxModule
  ],
  exports: [
    DimensionFilterDialogComponent
  ]
})
export class DimensionFilterDialogModule { } 