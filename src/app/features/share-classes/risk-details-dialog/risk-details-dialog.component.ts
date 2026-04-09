import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';

export interface RiskEntry {
  id: string;
  år: number;
  riskBeløp: number;
}

export interface RiskDetailsDialogData {
  riskEntries: RiskEntry[];
}

@Component({
  selector: 'app-risk-details-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatTableModule
  ],
  templateUrl: './risk-details-dialog.component.html',
  styleUrls: ['./risk-details-dialog.component.scss']
})
export class RiskDetailsDialogComponent implements OnInit {
  riskEntries: RiskEntry[] = [];
  newYear: number = new Date().getFullYear();
  newRiskBeløp: number = 0; // Using Norwegian character
  
  years: number[] = [];
  totalRisk: number = 0;

  get newRiskAmount(): number {
    return this.newRiskBeløp;
  }

  set newRiskAmount(value: number) {
    this.newRiskBeløp = value;
  }

  constructor(
    public dialogRef: MatDialogRef<RiskDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RiskDetailsDialogData
  ) {
    this.riskEntries = data.riskEntries.map(entry => ({ ...entry }));
    this.initializeYears();
    this.calculateTotal();
  }

  ngOnInit(): void {
    // Initialize dialog
  }

  initializeYears(): void {
    const currentYear = new Date().getFullYear();
    for (let i = currentYear - 10; i <= currentYear + 10; i++) {
      this.years.push(i);
    }
  }

  addRiskEntry(): void {
    // Check if year already exists
    if (this.riskEntries.some(e => (e as any)['år'] === this.newYear)) {
      alert('Det finnes allerede en RISK-post for dette året');
      return;
    }

    if (this.newRiskBeløp < 0) {
      alert('RISK-beløp må være større enn eller lik 0');
      return;
    }

    const newEntry: RiskEntry = {
      id: `risk-${Date.now()}`,
      år: this.newYear,
      riskBeløp: this.newRiskBeløp
    };

    this.riskEntries.push(newEntry);
    this.riskEntries.sort((a, b) => (a as any)['år'] - (b as any)['år']);
    this.newYear = new Date().getFullYear();
    this.newRiskBeløp = 0;
    this.calculateTotal();
  }

  deleteRiskEntry(entry: RiskEntry): void {
    const index = this.riskEntries.findIndex(e => e.id === entry.id);
    if (index !== -1) {
      this.riskEntries.splice(index, 1);
      this.calculateTotal();
    }
  }

  updateRiskEntry(entry: RiskEntry, value: number): void {
    if (value < 0) {
      alert('RISK-beløp må være større enn eller lik 0');
      return;
    }
    entry.riskBeløp = value;
    this.calculateTotal();
  }

  calculateTotal(): void {
    this.totalRisk = this.riskEntries.reduce((sum, entry) => sum + (entry as any)['riskBeløp'], 0);
  }

  formatNumber(value: number): string {
    return new Intl.NumberFormat('no-NO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value).replace(/,/g, ' ');
  }

  onSave(): void {
    this.dialogRef.close({
      saved: true,
      riskEntries: this.riskEntries
    });
  }

  onCancel(): void {
    this.dialogRef.close({
      saved: false
    });
  }
}

