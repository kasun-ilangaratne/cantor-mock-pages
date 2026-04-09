import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';

export interface ValutaomregningRow {
  nr: number;
  selskap: string;
  valuta: string;
  date0101: number | null;
  ek: number | null;
  res: number;
  date3011: number;
}

export interface ValutaomregningDialogData {
  // Add any data needed for the dialog
}

@Component({
  selector: 'app-valutaomregninger-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatTableModule
  ],
  templateUrl: './valutaomregninger-dialog.component.html',
  styleUrls: ['./valutaomregninger-dialog.component.scss']
})
export class ValutaomregningerDialogComponent implements OnInit {
  displayedColumns: string[] = ['nr', 'selskap', 'valuta', 'date0101', 'ek', 'res', 'date3011'];
  
  dataSource: ValutaomregningRow[] = [
    { nr: 10032, selskap: 'Shiba Manchester Ltd', valuta: 'GBP', date0101: null, ek: null, res: 1309045, date3011: 1309045 },
    { nr: 10035, selskap: 'Shiba Houston Inc', valuta: 'USD', date0101: null, ek: null, res: 20697707, date3011: 20697707 },
    { nr: 10205, selskap: 'Inter SA', valuta: 'EUR', date0101: null, ek: null, res: 1090187, date3011: 1090187 },
    { nr: 10206, selskap: 'Gregart Stockholm AB', valuta: 'SEK', date0101: null, ek: null, res: 40708, date3011: 40708 }
  ];

  totalRes: number = 0;
  totalDate3011: number = 0;

  constructor(
    public dialogRef: MatDialogRef<ValutaomregningerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ValutaomregningDialogData
  ) {
    this.calculateTotals();
  }

  ngOnInit(): void {
    // Initialize dialog
  }

  calculateTotals(): void {
    this.totalRes = this.dataSource.reduce((sum, row) => sum + row.res, 0);
    this.totalDate3011 = this.dataSource.reduce((sum, row) => sum + row.date3011, 0);
  }

  formatNumber(value: number | null): string {
    if (value === null) return '';
    return new Intl.NumberFormat('no-NO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value).replace(/,/g, ' ');
  }

  onClose(): void {
    this.dialogRef.close();
  }
}

