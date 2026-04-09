import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';

export interface DatterselskapRow {
  id: string;
  navn: string;
  hasFormula: boolean;
  formula?: string;
  companies: { [companyId: string]: number };
  eliminering: number;
  sum: number;
  isEditing?: { [companyId: string]: boolean };
  originalValues?: { [companyId: string]: number; eliminering: number };
}

export interface DatterselskapDialogData {
  year?: number;
  month?: number;
  companies?: string[];
}

@Component({
  selector: 'app-datterselskap-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule
  ],
  templateUrl: './datterselskap-dialog.component.html',
  styleUrls: ['./datterselskap-dialog.component.scss']
})
export class DatterselskapDialogComponent implements OnInit {
  year: number = 2025;
  month: number = 11;
  
  // Companies from Dim0 (example data - would come from backend)
  companies: string[] = ['Shiba AS', 'Shiba Holding AS', 'Shiba Manchester Ltd', 'Shiba Houston Inc'];
  
  // Table rows - includes all Andre endringer line items plus calculated lines
  rows: DatterselskapRow[] = [
    {
      id: '1',
      navn: 'Årets resultat',
      hasFormula: true,
      formula: 'SALDOV(3000:8399)*-1',
      companies: { 'Shiba AS': 100000, 'Shiba Holding AS': 50000, 'Shiba Manchester Ltd': 30000, 'Shiba Houston Inc': 20000 },
      eliminering: 0,
      sum: 200000
    },
    {
      id: '2',
      navn: 'Mottatt konsernbidrag',
      hasFormula: false,
      companies: { 'Shiba AS': 0, 'Shiba Holding AS': 25000, 'Shiba Manchester Ltd': 0, 'Shiba Houston Inc': 0 },
      eliminering: -25000,
      sum: 0
    },
    {
      id: '3',
      navn: 'Avgitt konsernbidrag',
      hasFormula: false,
      companies: { 'Shiba AS': -25000, 'Shiba Holding AS': 0, 'Shiba Manchester Ltd': 0, 'Shiba Houston Inc': 0 },
      eliminering: 25000,
      sum: 0
    },
    {
      id: '4',
      navn: 'Avsatt utbytte',
      hasFormula: false,
      companies: { 'Shiba AS': -50000, 'Shiba Holding AS': 0, 'Shiba Manchester Ltd': 0, 'Shiba Houston Inc': 0 },
      eliminering: 0,
      sum: -50000
    },
    {
      id: '5',
      navn: 'Tilleggutbytte',
      hasFormula: false,
      companies: { 'Shiba AS': 0, 'Shiba Holding AS': 0, 'Shiba Manchester Ltd': 0, 'Shiba Houston Inc': 0 },
      eliminering: 0,
      sum: 0
    },
    {
      id: '6',
      navn: 'Kapitalforhøyelse',
      hasFormula: false,
      companies: { 'Shiba AS': 20000, 'Shiba Holding AS': 0, 'Shiba Manchester Ltd': 0, 'Shiba Houston Inc': 0 },
      eliminering: 0,
      sum: 20000
    },
    {
      id: '7',
      navn: 'Kapitalnedsettelse',
      hasFormula: false,
      companies: { 'Shiba AS': 0, 'Shiba Holding AS': 0, 'Shiba Manchester Ltd': 0, 'Shiba Houston Inc': 0 },
      eliminering: 0,
      sum: 0
    },
    {
      id: '8',
      navn: 'Stiftelse',
      hasFormula: false,
      companies: { 'Shiba AS': 0, 'Shiba Holding AS': 0, 'Shiba Manchester Ltd': 0, 'Shiba Houston Inc': 0 },
      eliminering: 0,
      sum: 0
    },
    {
      id: '9',
      navn: 'Fusjon',
      hasFormula: false,
      companies: { 'Shiba AS': 0, 'Shiba Holding AS': 0, 'Shiba Manchester Ltd': 0, 'Shiba Houston Inc': 0 },
      eliminering: 0,
      sum: 0
    },
    {
      id: '10',
      navn: 'Fisjon',
      hasFormula: false,
      companies: { 'Shiba AS': 0, 'Shiba Holding AS': 0, 'Shiba Manchester Ltd': 0, 'Shiba Houston Inc': 0 },
      eliminering: 0,
      sum: 0
    },
    {
      id: '11',
      navn: 'Nedskrivning',
      hasFormula: false,
      companies: { 'Shiba AS': 0, 'Shiba Holding AS': 0, 'Shiba Manchester Ltd': 0, 'Shiba Houston Inc': 0 },
      eliminering: 0,
      sum: 0
    },
    {
      id: '12',
      navn: 'Kjøp av selskap',
      hasFormula: false,
      companies: { 'Shiba AS': 0, 'Shiba Holding AS': 0, 'Shiba Manchester Ltd': 0, 'Shiba Houston Inc': 0 },
      eliminering: 0,
      sum: 0
    },
    {
      id: '13',
      navn: 'Salg av selskap',
      hasFormula: false,
      companies: { 'Shiba AS': 0, 'Shiba Holding AS': 0, 'Shiba Manchester Ltd': 0, 'Shiba Houston Inc': 0 },
      eliminering: 0,
      sum: 0
    },
    {
      id: '14',
      navn: 'Valutaomregninger',
      hasFormula: false,
      companies: { 'Shiba AS': 30000, 'Shiba Holding AS': 0, 'Shiba Manchester Ltd': 0, 'Shiba Houston Inc': 0 },
      eliminering: 0,
      sum: 30000
    },
    {
      id: '15',
      navn: 'Andre endringer',
      hasFormula: false,
      companies: { 'Shiba AS': 0, 'Shiba Holding AS': 0, 'Shiba Manchester Ltd': 0, 'Shiba Houston Inc': 0 },
      eliminering: 0,
      sum: 0
    },
    {
      id: '16',
      navn: 'IB egenkapital',
      hasFormula: true,
      formula: 'SUM(...)',
      companies: { 'Shiba AS': 1000000, 'Shiba Holding AS': 500000, 'Shiba Manchester Ltd': 300000, 'Shiba Houston Inc': 200000 },
      eliminering: 0,
      sum: 2000000
    },
    {
      id: '17',
      navn: 'UB egenkapital',
      hasFormula: true,
      formula: 'SUM(...)',
      companies: { 'Shiba AS': 1025000, 'Shiba Holding AS': 525000, 'Shiba Manchester Ltd': 330000, 'Shiba Houston Inc': 220000 },
      eliminering: 0,
      sum: 2100000
    }
  ];

  displayedColumns: string[] = [];

  constructor(
    public dialogRef: MatDialogRef<DatterselskapDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DatterselskapDialogData
  ) {
    if (data?.year) this.year = data.year;
    if (data?.month) this.month = data.month;
    if (data?.companies && data.companies.length > 0) {
      this.companies = data.companies;
    }
    this.updateDisplayedColumns();
  }

  ngOnInit(): void {
    this.calculateSums();
  }

  updateDisplayedColumns(): void {
    this.displayedColumns = ['navn', ...this.companies, 'eliminering', 'sum'];
  }

  formatNumber(value: number): string {
    return new Intl.NumberFormat('no-NO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value).replace(/,/g, ' ');
  }

  isEditable(row: DatterselskapRow, column: string): boolean {
    if (column === 'navn' || column === 'sum') {
      return false; // Navn and Sum are always read-only
    }
    return !row.hasFormula; // Editable only if row has no formula
  }

  startEdit(row: DatterselskapRow, column: string): void {
    if (!this.isEditable(row, column)) return;
    
    if (!row.isEditing) {
      row.isEditing = {};
      row.originalValues = {
        ...row.companies,
        eliminering: row.eliminering
      };
    }
    row.isEditing[column] = true;
  }

  saveEdit(row: DatterselskapRow, column: string): void {
    if (row.isEditing && row.isEditing[column]) {
      row.isEditing[column] = false;
      this.calculateRowSum(row);
    }
  }

  cancelEdit(row: DatterselskapRow, column: string): void {
    if (row.isEditing && row.isEditing[column] && row.originalValues) {
      if (column === 'eliminering') {
        row.eliminering = row.originalValues.eliminering;
      } else {
        row.companies[column] = row.originalValues[column] || 0;
      }
      row.isEditing[column] = false;
    }
  }

  calculateRowSum(row: DatterselskapRow): void {
    const companySum = this.companies.reduce((sum, company) => {
      return sum + (row.companies[company] || 0);
    }, 0);
    row.sum = companySum + row.eliminering;
  }

  calculateSums(): void {
    this.rows.forEach(row => {
      this.calculateRowSum(row);
    });
  }

  onCellValueChange(row: DatterselskapRow, column: string, value: number): void {
    if (column === 'eliminering') {
      row.eliminering = value;
    } else {
      row.companies[column] = value;
    }
    this.calculateRowSum(row);
  }

  exportToExcel(): void {
    // Create CSV content
    let csv = 'Navn';
    this.companies.forEach(company => {
      csv += `,${company}`;
    });
    csv += ',Eliminering,Sum\n';

    this.rows.forEach(row => {
      csv += `"${row.navn}"`;
      this.companies.forEach(company => {
        csv += `,${row.companies[company] || 0}`;
      });
      csv += `,${row.eliminering},${row.sum}\n`;
    });

    // Create blob and download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `Datterselskap_${this.year}_${this.month.toString().padStart(2, '0')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  onSave(): void {
    // Filter only editable rows and their changed values
    const changes: any[] = [];
    this.rows.forEach(row => {
      if (!row.hasFormula) {
        const rowChanges: any = {
          id: row.id,
          navn: row.navn,
          companies: { ...row.companies },
          eliminering: row.eliminering
        };
        changes.push(rowChanges);
      }
    });

    this.dialogRef.close({
      saved: true,
      changes: changes
    });
  }

  onCancel(): void {
    this.dialogRef.close({
      saved: false
    });
  }

  get formattedMonth(): string {
    return this.month.toString().padStart(2, '0');
  }
}

