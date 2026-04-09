import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { AndreEndringerRow } from '../equity-reconciliation.component';

export interface AndreEndringerEditDialogData {
  row: AndreEndringerRow;
}

@Component({
  selector: 'app-andre-endringer-edit-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatCheckboxModule,
    MatInputModule
  ],
  templateUrl: './andre-endringer-edit-dialog.component.html',
  styleUrls: ['./andre-endringer-edit-dialog.component.scss']
})
export class AndreEndringerEditDialogComponent implements OnInit {
  editedRow: AndreEndringerRow;
  
  // Formula input
  formula: string = 'SALDOV(3000:8399)*-1';
  accountNumber: string = '0400';
  selectedTab: string = 'Formel';
  
  // Function dropdowns
  functions: string[] = [
    'HVIS',
    'VENSTRE',
    'DELTEKST',
    'KJEDE.SAMMEN',
    'TEKST',
    'FINN.RAD',
    'MÅNED'
  ];
  
  selectedFunction1: string = '';
  selectedFunction2: string = '';
  
  // Dimension options
  calculateDimension: boolean = true;
  dimensionValue: string = 'Dim 0';
  setDimensionEqualToTotal: boolean = false;
  accumulateDimension: boolean = false;
  
  // Reports - all empty initially
  reports: string[] = ['', '', '', '', '', '', '', '', '', ''];
  
  // Reference
  reference: string = 'RR-0002';

  constructor(
    public dialogRef: MatDialogRef<AndreEndringerEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AndreEndringerEditDialogData
  ) {
    // Create a copy of the row for editing
    this.editedRow = {
      ...data.row,
      originalValues: {
        ub3011: data.row.ub3011,
        endring: data.row.endring,
        ib0101: data.row.ib0101
      }
    };
  }

  ngOnInit(): void {
    // Initialize dialog
  }

  onSave(): void {
    // Return the edited row data
    this.dialogRef.close({
      saved: true,
      row: this.editedRow
    });
  }

  onCancel(): void {
    this.dialogRef.close({
      saved: false
    });
  }

  selectTab(tab: string): void {
    this.selectedTab = tab;
  }
}

