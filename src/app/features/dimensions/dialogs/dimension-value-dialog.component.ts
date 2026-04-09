import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DimensionValue, CreateDimensionValueRequest, UpdateDimensionValueRequest } from '../models';

export interface DimensionValueDialogData {
  value?: DimensionValue;
  dimensionId: number;
  mode: 'create' | 'edit';
}

@Component({
  selector: 'app-dimension-value-dialog',
  template: `
    <h2 mat-dialog-title>{{ data.mode === 'create' ? 'Add Value' : 'Edit Value' }}</h2>
    
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <mat-dialog-content>
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Value Text</mat-label>
          <input matInput formControlName="text" placeholder="Enter value text" />
          <mat-error *ngIf="form.get('text')?.hasError('required')">
            Value text is required
          </mat-error>
          <mat-error *ngIf="form.get('text')?.hasError('minlength')">
            Value text must be at least 2 characters
          </mat-error>
          <mat-error *ngIf="form.get('text')?.hasError('maxlength')">
            Value text cannot exceed 100 characters
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
export class DimensionValueDialogComponent implements OnInit {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<DimensionValueDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DimensionValueDialogData
  ) {
    this.form = this.fb.group({
      text: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]]
    });
  }

  ngOnInit(): void {
    if (this.data.mode === 'edit' && this.data.value) {
      this.form.patchValue({
        text: this.data.value.text
      });
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formValue = this.form.value;
      
      if (this.data.mode === 'create') {
        const request: CreateDimensionValueRequest = {
          dimensionId: this.data.dimensionId,
          text: formValue.text
        };
        this.dialogRef.close(request);
      } else {
        const request: UpdateDimensionValueRequest = {
          id: this.data.value!.id,
          dimensionId: this.data.dimensionId,
          text: formValue.text
        };
        this.dialogRef.close(request);
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
} 