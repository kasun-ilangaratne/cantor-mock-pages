import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

export interface AlternativeCurrencyValues {
  currency: string;
  shareCapital2025: number;
  shareCapital2024: number;
  uncalled2025: number;
  uncalled2024: number;
}

export interface AlternativeCurrencyDialogData {
  values: AlternativeCurrencyValues;
}

@Component({
  selector: 'app-alternative-currency-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule],
  templateUrl: './alternative-currency-dialog.component.html',
  styleUrls: ['./alternative-currency-dialog.component.scss']
})
export class AlternativeCurrencyDialogComponent {
  readonly currencies = ['EUR', 'USD', 'SEK', 'DKK', 'NOK', 'GBP'];
  form: AlternativeCurrencyValues = {
    currency: 'EUR',
    shareCapital2025: 0,
    shareCapital2024: 0,
    uncalled2025: 0,
    uncalled2024: 0
  };

  constructor(
    public dialogRef: MatDialogRef<AlternativeCurrencyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AlternativeCurrencyDialogData
  ) {
    this.form = { ...this.form, ...(data?.values ?? {}) };
  }

  onSave(): void {
    this.dialogRef.close({
      saved: true,
      values: {
        currency: this.form.currency,
        shareCapital2025: Number(this.form.shareCapital2025) || 0,
        shareCapital2024: Number(this.form.shareCapital2024) || 0,
        uncalled2025: Number(this.form.uncalled2025) || 0,
        uncalled2024: Number(this.form.uncalled2024) || 0
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close({ saved: false });
  }
}

