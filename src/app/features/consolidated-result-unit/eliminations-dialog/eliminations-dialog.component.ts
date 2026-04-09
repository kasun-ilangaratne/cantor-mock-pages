import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

export interface EliminationData {
  id: number;
  fromAccount: string;
  text: string;
  fromAccountName: string;
  company: string;
  toAccount: string;
  toAccountName: string;
}

export interface EliminationsDialogData {
  parentData?: any;
}

@Component({
  selector: 'app-eliminations-dialog',
  templateUrl: './eliminations-dialog.component.html',
  styleUrls: ['./eliminations-dialog.component.scss']
})
export class EliminationsDialogComponent implements OnInit {
  form: FormGroup;
  dataSource = new MatTableDataSource<any>([
    {
      id: 1,
      fromAccount: '1001',
      text: 'Intercompany elimination',
      fromAccountName: 'Revenue Account',
      company: 'Subsidiary A',
      toAccount: '1002',
      toAccountName: 'Cost of Sales',
      showContextMenu: false
    },
    {
      id: 2,
      fromAccount: '2000',
      text: 'Dividend elimination',
      fromAccountName: 'Share Capital',
      company: 'Subsidiary B',
      toAccount: '4000',
      toAccountName: 'Dividend Income',
      showContextMenu: false
    }
  ]);

  restrictPostings = false;
  eliminationType = 'eliminations'; // Default to eliminations
  Math = Math;
  currentPage = 0;
  pageSize = 10;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EliminationsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EliminationsDialogData
  ) {
    this.form = this.fb.group({
      restrictPostings: [false],
      eliminationType: ['eliminations'] // Default to 'eliminations' radio button
    });

    this.dataSource.data = [
      { 
        id: 1, 
        fromAccount: '2000', 
        text: 'Eliminering Selskapskapital', 
        fromAccountName: 'Share Capital', 
        company: '359928', 
        toAccount: '2050', 
        toAccountName: 'Annen egenkapital',
        showContextMenu: false,
        isNew: false,
        sharePercentage: '',
        fromPeriod: '',
        fromYear: '',
        toPeriod: '',
        toYear: '',
        // Recurring properties
        nr: '1',
        per: '12',
        belop: '100000',
        debet: '2000',
        debetSelskap: '359928',
        kredit: '2050',
        kreditSelskap: '359928',
        tekst: 'Eliminering Selskapskapital',
        // Dimension elimination properties
        fraKonto: '2000',
        fraKontoName: 'Share Capital',
        tilKonto: '2050',
        tilKontoName: 'Annen egenkapital',
        dim: 'DIM001',
        id1: 'ID001',
        dim2: 'DIM2_001',
        id2: 'ID2_001',
        dim3: 'DIM3_001',
        id3: 'ID3_001',
        eliminationId: 'ELIM001',
        navn: 'Share Capital',
        konto: '2050',
        kontoName: 'Annen egenkapital',
        selskap: '359928',
        navnTo: 'Annen egenkapital',
        dim2To: 'DIM2_TO_001',
        id2To: 'ID2_TO_001',
        dim3To: 'DIM3_TO_001',
        id3To: 'ID3_TO_001'
      },
      { 
        id: 2, 
        fromAccount: '3000', 
        text: 'Eliminering Intercompany', 
        fromAccountName: 'Intercompany Receivable', 
        company: '359929', 
        toAccount: '3050', 
        toAccountName: 'Intercompany Payable',
        showContextMenu: false,
        isNew: false,
        sharePercentage: '',
        fromPeriod: '',
        fromYear: '',
        toPeriod: '',
        toYear: '',
        // Recurring properties
        nr: '2',
        per: '12',
        belop: '50000',
        debet: '3000',
        debetSelskap: '359929',
        kredit: '3050',
        kreditSelskap: '359929',
        tekst: 'Eliminering Intercompany',
        // Dimension elimination properties
        fraKonto: '3000',
        fraKontoName: 'Intercompany Receivable',
        tilKonto: '3050',
        tilKontoName: 'Intercompany Payable',
        dim: 'DIM002',
        id1: 'ID002',
        dim2: 'DIM2_002',
        id2: 'ID2_002',
        dim3: 'DIM3_002',
        id3: 'ID3_002',
        eliminationId: 'ELIM002',
        navn: 'Intercompany Receivable',
        konto: '3050',
        kontoName: 'Intercompany Payable',
        selskap: '359929',
        navnTo: 'Intercompany Payable',
        dim2To: 'DIM2_TO_002',
        id2To: 'ID2_TO_002',
        dim3To: 'DIM3_TO_002',
        id3To: 'ID3_TO_002'
      },
      { 
        id: 3, 
        fromAccount: '4000', 
        text: 'Eliminering Dividends', 
        fromAccountName: 'Dividend Income', 
        company: '359930', 
        toAccount: '4050', 
        toAccountName: 'Dividend Expense',
        showContextMenu: false,
        isNew: false,
        sharePercentage: '',
        fromPeriod: '',
        fromYear: '',
        toPeriod: '',
        toYear: '',
        // Recurring properties
        nr: '3',
        per: '12',
        belop: '75000',
        debet: '4000',
        debetSelskap: '359930',
        kredit: '4050',
        kreditSelskap: '359930',
        tekst: 'Eliminering Dividends',
        // Dimension elimination properties
        fraKonto: '4000',
        fraKontoName: 'Dividend Income',
        tilKonto: '4050',
        tilKontoName: 'Dividend Expense',
        dim: 'DIM003',
        id1: 'ID003',
        dim2: 'DIM2_003',
        id2: 'ID2_003',
        dim3: 'DIM3_003',
        id3: 'ID3_003',
        eliminationId: 'ELIM003',
        navn: 'Dividend Income',
        konto: '4050',
        kontoName: 'Dividend Expense',
        selskap: '359930',
        navnTo: 'Dividend Expense',
        dim2To: 'DIM2_TO_003',
        id2To: 'ID2_TO_003',
        dim3To: 'DIM3_TO_003',
        id3To: 'ID3_TO_003'
      },
      { 
        id: 4, 
        fromAccount: '5000', 
        text: 'Eliminering Sales', 
        fromAccountName: 'Sales Revenue', 
        company: '359931', 
        toAccount: '5050', 
        toAccountName: 'Cost of Sales',
        showContextMenu: false,
        isNew: false,
        sharePercentage: '',
        fromPeriod: '',
        fromYear: '',
        toPeriod: '',
        toYear: '',
        // Recurring properties
        nr: '4',
        per: '12',
        belop: '200000',
        debet: '5000',
        debetSelskap: '359931',
        kredit: '5050',
        kreditSelskap: '359931',
        tekst: 'Eliminering Sales',
        // Dimension elimination properties
        fraKonto: '5000',
        fraKontoName: 'Sales Revenue',
        tilKonto: '5050',
        tilKontoName: 'Cost of Sales',
        dim: 'DIM004',
        id1: 'ID004',
        dim2: 'DIM2_004',
        id2: 'ID2_004',
        dim3: 'DIM3_004',
        id3: 'ID3_004',
        eliminationId: 'ELIM004',
        navn: 'Sales Revenue',
        konto: '5050',
        kontoName: 'Cost of Sales',
        selskap: '359931',
        navnTo: 'Cost of Sales',
        dim2To: 'DIM2_TO_004',
        id2To: 'ID2_TO_004',
        dim3To: 'DIM3_TO_004',
        id3To: 'ID3_TO_004'
      },
      { 
        id: 5, 
        fromAccount: '6000', 
        text: 'Eliminering Management Fee', 
        fromAccountName: 'Management Fee Income', 
        company: '359932', 
        toAccount: '6050', 
        toAccountName: 'Management Fee Expense',
        showContextMenu: false,
        isNew: false,
        sharePercentage: '',
        fromPeriod: '',
        fromYear: '',
        toPeriod: '',
        toYear: '',
        // Recurring properties
        nr: '5',
        per: '12',
        belop: '25000',
        debet: '6000',
        debetSelskap: '359932',
        kredit: '6050',
        kreditSelskap: '359932',
        tekst: 'Eliminering Management Fee',
        // Dimension elimination properties
        fraKonto: '6000',
        fraKontoName: 'Management Fee Income',
        tilKonto: '6050',
        tilKontoName: 'Management Fee Expense',
        dim: 'DIM005',
        id1: 'ID005',
        dim2: 'DIM2_005',
        id2: 'ID2_005',
        dim3: 'DIM3_005',
        id3: 'ID3_005',
        eliminationId: 'ELIM005',
        navn: 'Management Fee Income',
        konto: '6050',
        kontoName: 'Management Fee Expense',
        selskap: '359932',
        navnTo: 'Management Fee Expense',
        dim2To: 'DIM2_TO_005',
        id2To: 'ID2_TO_005',
        dim3To: 'DIM3_TO_005',
        id3To: 'ID3_TO_005'
      }
    ];
  }

  ngOnInit(): void { }

  onRestrictPostingsChange(): void {
    if (this.restrictPostings) {
      this.setDefaultValues();
    }
  }

  setDefaultValues(): void {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // getMonth() returns 0-11
    const currentYear = currentDate.getFullYear();
    
    this.dataSource.data.forEach(row => {
      if (!row.sharePercentage) {
        row.sharePercentage = '100.00';
      }
      if (!row.fromPeriod) {
        row.fromPeriod = currentMonth.toString();
      }
      if (!row.fromYear) {
        row.fromYear = currentYear.toString();
      }
      if (!row.toPeriod) {
        row.toPeriod = currentMonth.toString();
      }
      if (!row.toYear) {
        row.toYear = currentYear.toString();
      }
    });
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    const maxPage = Math.ceil(this.dataSource.data.length / this.pageSize) - 1;
    if (this.currentPage < maxPage) {
      this.currentPage++;
    }
  }

  applyFilter(event: any): void {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    if (filterValue) {
      this.dataSource.data = this.dataSource.data.filter((item: any) =>
        item.fromAccount.toLowerCase().includes(filterValue) ||
        item.text.toLowerCase().includes(filterValue) ||
        item.fromAccountName.toLowerCase().includes(filterValue) ||
        item.company.toLowerCase().includes(filterValue) ||
        item.toAccount.toLowerCase().includes(filterValue) ||
        item.toAccountName.toLowerCase().includes(filterValue)
      );
    } else {
      // Reset to original data
      this.dataSource.data = [
        { 
          id: 1, 
          fromAccount: '2000', 
          text: 'Eliminering Selskapskapital', 
          fromAccountName: 'Share Capital', 
          company: '359928', 
          toAccount: '2050', 
          toAccountName: 'Annen egenkapital' 
        },
        { 
          id: 2, 
          fromAccount: '3000', 
          text: 'Eliminering Intercompany', 
          fromAccountName: 'Intercompany Receivable', 
          company: '359929', 
          toAccount: '3050', 
          toAccountName: 'Intercompany Payable' 
        },
        { 
          id: 3, 
          fromAccount: '4000', 
          text: 'Eliminering Dividends', 
          fromAccountName: 'Dividend Income', 
          company: '359930', 
          toAccount: '4050', 
          toAccountName: 'Dividend Expense' 
        },
        { 
          id: 4, 
          fromAccount: '5000', 
          text: 'Eliminering Sales', 
          fromAccountName: 'Sales Revenue', 
          company: '359931', 
          toAccount: '5050', 
          toAccountName: 'Cost of Sales' 
        },
        { 
          id: 5, 
          fromAccount: '6000', 
          text: 'Eliminering Management Fee', 
          fromAccountName: 'Management Fee Income', 
          company: '359932', 
          toAccount: '6050', 
          toAccountName: 'Management Fee Expense' 
        }
      ];
    }
  }

  onSave(): void {
    if (this.form.valid) {
      console.log('Eliminations form submitted:', this.form.value);
      this.dialogRef.close(this.form.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  addNewRow(): void {
    const newRow = {
      id: this.dataSource.data.length + 1,
      fromAccount: '',
      text: '',
      fromAccountName: '',
      company: '',
      toAccount: '',
      toAccountName: '',
      showContextMenu: false,
      isNew: true,
      sharePercentage: '',
      fromPeriod: '',
      fromYear: '',
      toPeriod: '',
      toYear: '',
      // Recurring properties
      nr: (this.dataSource.data.length + 1).toString(),
      per: '12',
      belop: '',
      debet: '',
      debetSelskap: '',
      kredit: '',
      kreditSelskap: '',
      tekst: '',
      // Dimension elimination properties
      fraKonto: '',
      fraKontoName: '',
      tilKonto: '',
      tilKontoName: '',
      dim: '',
      id1: '',
      dim2: '',
      id2: '',
      dim3: '',
      id3: '',
      eliminationId: '',
      navn: '',
      konto: '',
      kontoName: '',
      selskap: '',
      navnTo: '',
      dim2To: '',
      id2To: '',
      dim3To: '',
      id3To: ''
    };
    this.dataSource.data.push(newRow);
    console.log('Added new elimination row');
  }

  insertRow(): void {
    const newRow = {
      id: this.dataSource.data.length + 1,
      fromAccount: '',
      text: '',
      fromAccountName: '',
      company: '',
      toAccount: '',
      toAccountName: '',
      showContextMenu: false,
      isNew: true,
      sharePercentage: '',
      fromPeriod: '',
      fromYear: '',
      toPeriod: '',
      toYear: '',
      // Recurring properties
      nr: (this.dataSource.data.length + 1).toString(),
      per: '12',
      belop: '',
      debet: '',
      debetSelskap: '',
      kredit: '',
      kreditSelskap: '',
      tekst: '',
      // Dimension elimination properties
      fraKonto: '',
      fraKontoName: '',
      tilKonto: '',
      tilKontoName: '',
      dim: '',
      id1: '',
      dim2: '',
      id2: '',
      dim3: '',
      id3: '',
      eliminationId: '',
      navn: '',
      konto: '',
      kontoName: '',
      selskap: '',
      navnTo: '',
      dim2To: '',
      id2To: '',
      dim3To: '',
      id3To: ''
    };
    this.dataSource.data.unshift(newRow);
    console.log('Inserted new elimination row at the top');
  }

  closeAllContextMenus(): void {
    this.dataSource.data.forEach((item: any) => {
      item.showContextMenu = false;
    });
  }

  toggleContextMenu(index: number): void {
    console.log(`Toggle context menu for row ${index}`);
    console.log('Current data:', this.dataSource.data);
    
    // Close all other context menus
    this.dataSource.data.forEach((item: any, i: number) => {
      if (i !== index) {
        item.showContextMenu = false;
      }
    });
    
    // Toggle the clicked context menu
    this.dataSource.data[index].showContextMenu = !this.dataSource.data[index].showContextMenu;
    console.log(`Context menu for row ${index} is now: ${this.dataSource.data[index].showContextMenu}`);
    console.log('Updated data:', this.dataSource.data);
  }

  deleteRow(index: number): void {
    this.dataSource.data.splice(index, 1);
    console.log(`Deleted elimination row at index ${index}`);
  }

  copyToMultipleCompanies(index: number): void {
    console.log(`Copy to multiple companies for row ${index}`);
    // This would typically open a dialog to select companies
    this.dataSource.data[index].showContextMenu = false;
  }

  copyToAllGroupCompanies(index: number): void {
    console.log(`Copy to all group companies for row ${index}`);
    // This would copy the selected row to all companies in the group
    this.dataSource.data[index].showContextMenu = false;
  }
} 