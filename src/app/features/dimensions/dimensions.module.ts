import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

import { DimensionsRoutingModule } from './dimensions-routing.module';
import { DimensionsComponent } from './dimensions.component';
import { DimensionListComponent } from './dimension-list.component';
import { DimensionValuesComponent } from './dimension-values.component';
import { PageHeaderComponent } from '../../shared/page-header.component';
import { DimensionDialogComponent } from './dialogs/dimension-dialog.component';
import { DimensionValueDialogComponent } from './dialogs/dimension-value-dialog.component';
import { ConfirmDialogComponent } from './dialogs/confirm-dialog.component';

@NgModule({
  declarations: [
    DimensionsComponent,
    DimensionListComponent,
    DimensionValuesComponent,
    PageHeaderComponent,
    DimensionDialogComponent,
    DimensionValueDialogComponent,
    ConfirmDialogComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    DimensionsRoutingModule
  ]
})
export class DimensionsModule { } 