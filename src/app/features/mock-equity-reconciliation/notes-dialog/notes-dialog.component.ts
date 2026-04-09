import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

export interface NotesRow {
  label: string;
  aksjekapital: number;
  annenEgenkapital: number;
  sum: number;
}

export interface NotesDialogData {
  year?: number;
  month?: number;
}

@Component({
  selector: 'app-notes-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './notes-dialog.component.html',
  styleUrls: ['./notes-dialog.component.scss']
})
export class NotesDialogComponent implements OnInit {
  year: number = 2025;
  month: number = 11;

  // Table rows with calculated values (read-only)
  rows: NotesRow[] = [
    {
      label: 'Egenkapital 01.01.',
      aksjekapital: 5000000,
      annenEgenkapital: 3000000,
      sum: 8000000
    },
    {
      label: 'Årets resultat',
      aksjekapital: 0,
      annenEgenkapital: 2500000,
      sum: 2500000
    },
    {
      label: 'Avsatt utbytte',
      aksjekapital: -1000000,
      annenEgenkapital: 0,
      sum: -1000000
    },
    {
      label: 'Egenkapital 31.12.',
      aksjekapital: 4000000,
      annenEgenkapital: 5500000,
      sum: 9500000
    }
  ];

  constructor(
    public dialogRef: MatDialogRef<NotesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: NotesDialogData
  ) {
    if (data?.year) this.year = data.year;
    if (data?.month) this.month = data.month;
  }

  ngOnInit(): void {
    // Calculate sums if needed (values would come from backend)
    this.calculateSums();
  }

  calculateSums(): void {
    // Sum column is already calculated, but we can recalculate if needed
    this.rows.forEach(row => {
      row.sum = row.aksjekapital + row.annenEgenkapital;
    });
  }

  formatNumber(value: number): string {
    return new Intl.NumberFormat('no-NO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value).replace(/,/g, ' ');
  }

  onClose(): void {
    this.dialogRef.close();
  }
}

