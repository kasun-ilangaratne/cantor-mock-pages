import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DimensionFilterData {
  dimnr: string;
  dimId: string;
  invertert: boolean;
}

export interface DimensionFilterDialogData {
  parentData?: any;
}

@Component({
  selector: 'app-dimension-filter-dialog',
  templateUrl: './dimension-filter-dialog.component.html',
  styleUrls: ['./dimension-filter-dialog.component.scss']
})
export class DimensionFilterDialogComponent implements OnInit {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DimensionFilterDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DimensionFilterDialogData
  ) {
    this.form = this.fb.group({
      dimnr: [''],
      dimId: [''],
      invertert: [false]
    });
  }

  ngOnInit(): void { }

  onSave(): void {
    if (this.form.valid) {
      console.log('Dimension Filter form submitted:', this.form.value);
      this.dialogRef.close(this.form.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
} 