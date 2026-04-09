import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Dimension, CreateDimensionRequest, UpdateDimensionRequest } from '../models';

export interface DimensionDialogData {
  dimension?: Dimension;
  mode: 'create' | 'edit';
}

@Component({
  selector: 'app-dimension-dialog',
  template: `
    <h2 mat-dialog-title>{{ data.mode === 'create' ? 'Add Dimension' : 'Edit Dimension' }}</h2>
    
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <mat-dialog-content>
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Dimension Name</mat-label>
          <input matInput formControlName="name" placeholder="Enter dimension name" />
          <mat-error *ngIf="form.get('name')?.hasError('required')">
            Dimension name is required
          </mat-error>
          <mat-error *ngIf="form.get('name')?.hasError('minlength')">
            Dimension name must be at least 2 characters
          </mat-error>
          <mat-error *ngIf="form.get('name')?.hasError('maxlength')">
            Dimension name cannot exceed 50 characters
          </mat-error>
        </mat-form-field>
      </mat-dialog-content>
      
      <mat-dialog-actions align="end">
        <button mat-button type="button" (click)="onCancel()">Cancel</button>
        <button 
          mat-raised-button 
          color="primary" 
          type="submit"
          [disabled]="form.invalid || form.pristine">
          {{ data.mode === 'create' ? 'Create' : 'Update' }}
        </button>
      </mat-dialog-actions>
    </form>
  `,
  styles: [`
    mat-dialog-content {
      min-width: 400px;
    }
  `]
})
export class DimensionDialogComponent implements OnInit {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<DimensionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DimensionDialogData
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]]
    });
  }

  ngOnInit(): void {
    if (this.data.mode === 'edit' && this.data.dimension) {
      this.form.patchValue({
        name: this.data.dimension.name
      });
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formValue = this.form.value;
      
      if (this.data.mode === 'create') {
        const request: CreateDimensionRequest = {
          name: formValue.name
        };
        this.dialogRef.close(request);
      } else {
        const request: UpdateDimensionRequest = {
          id: this.data.dimension!.id,
          name: formValue.name
        };
        this.dialogRef.close(request);
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
} 