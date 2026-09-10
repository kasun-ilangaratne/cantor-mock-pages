import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { OtherVariable } from '../andre-variabler.models';

export interface FormulaDialogData {
  variable: OtherVariable;
}

@Component({
  selector: 'app-formula-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule],
  templateUrl: './formula-dialog.component.html',
  styleUrls: ['./formula-dialog.component.scss']
})
export class FormulaDialogComponent {
  formula: string;
  functions = ['HVIS', 'VENSTRE', 'DELTEKST', 'KJEDE.SAMMEN', 'TEKST', 'FINN.RAD', 'MÅNED'];
  selectedFunction1 = 'HVIS';
  selectedFunction2 = 'HVIS';
  calculateDimension = true;
  dimension = 'Dimension dim0';
  dimensionValue = '';
  setDimensionEqualToTotal = false;
  accumulateDimension = false;
  reports: string[] = ['', '', '', '', '', '', '', '0408', '', ''];
  reference = '-';
  referenceOptions = ['-', 'RR-0001', 'RR-0002', 'RR-0003'];

  constructor(
    private dialogRef: MatDialogRef<FormulaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FormulaDialogData
  ) {
    this.formula = data.variable.formula || '';
  }

  insertFunction(func: string): void {
    if (!func) {
      return;
    }
    this.formula = this.formula ? `${this.formula}${func}()` : `${func}()`;
  }

  onSave(): void {
    this.dialogRef.close({
      saved: true,
      formula: this.formula,
      hasFormula: !!this.formula.trim()
    });
  }

  onCancel(): void {
    this.dialogRef.close({ saved: false });
  }
}
