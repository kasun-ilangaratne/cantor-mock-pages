import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';

export interface SharesRiskEntry {
  id: string;
  år: number;
  riskBeløp: number;
}

export interface SharesRiskDetailsDialogData {
  riskEntries: SharesRiskEntry[];
}

@Component({
  selector: 'app-shares-risk-details-dialog',
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
export class SharesRiskDetailsDialogComponent implements OnInit {
  riskEntries: SharesRiskEntry[] = [];

  years: number[] = [];
  totalRisk: number = 0;

  constructor(
    public dialogRef: MatDialogRef<SharesRiskDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SharesRiskDetailsDialogData
  ) {
    this.riskEntries = data.riskEntries.map((entry) => ({ ...entry }));
    this.initializeYears();
    this.calculateTotal();
  }

  ngOnInit(): void {}

  initializeYears(): void {
    const currentYear = new Date().getFullYear();
    for (let i = currentYear - 10; i <= currentYear + 10; i++) {
      this.years.push(i);
    }
  }

  addRiskEntry(): void {
    const usedYears = new Set(this.riskEntries.map((e) => e.år));
    const nextYear =
      this.years.find((y) => !usedYears.has(y)) ?? (new Date().getFullYear() + usedYears.size);

    if (!this.years.includes(nextYear)) {
      this.years.push(nextYear);
      this.years.sort((a, b) => a - b);
    }

    const newEntry: SharesRiskEntry = {
      id: `risk-${Date.now()}`,
      år: nextYear,
      riskBeløp: 0
    };

    this.riskEntries.push(newEntry);
    this.riskEntries.sort((a, b) => (a as any)['år'] - (b as any)['år']);
    this.calculateTotal();
  }

  onYearChange(entry: SharesRiskEntry, newYear: number): void {
    const parsed = Number(newYear);
    entry.år = Number.isFinite(parsed) ? parsed : entry.år;
    this.calculateTotal();
  }

  trackById(_: number, item: SharesRiskEntry): string {
    return item.id;
  }

  deleteRiskEntry(entry: SharesRiskEntry): void {
    const index = this.riskEntries.findIndex((e) => e.id === entry.id);
    if (index !== -1) {
      this.riskEntries.splice(index, 1);
      this.calculateTotal();
    }
  }

  updateRiskEntry(entry: SharesRiskEntry, value: number): void {
    const parsed = Number(value);
    entry.riskBeløp = Number.isFinite(parsed) ? parsed : 0;
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

