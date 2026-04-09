import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// Angular Material imports
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

// Shared Module
import { SharedModule } from '../../../shared/shared.module';

// Component
import { ExceptionDialogComponent } from './exception-dialog.component';

@NgModule({
  declarations: [
    ExceptionDialogComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    SharedModule
  ],
  exports: [
    ExceptionDialogComponent
  ]
})
export class ExceptionDialogModule { } 