import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { AndreEndringerEditDialogComponent } from './andre-endringer-edit-dialog/andre-endringer-edit-dialog.component';
import { ValutaomregningerDialogComponent } from './valutaomregninger-dialog/valutaomregninger-dialog.component';
import { EgenkapitalGruppeDialogComponent } from './egenkapital-gruppe-dialog/egenkapital-gruppe-dialog.component';
import { DatterselskapDialogComponent } from './datterselskap-dialog/datterselskap-dialog.component';
import { NotesDialogComponent } from './notes-dialog/notes-dialog.component';

export interface ReconciliationRow {
  id: string;
  label: string;
  priorPeriod: number;
  changeDuringPeriod: number;
  currentPeriod: number;
  expanded: boolean;
  expandable: boolean;
}

export interface DetailRow {
  kontonr: string;
  kontonavn: string;
  ub3011: number;
  endring: number;
  ib0101: number;
  type: string;
}

export interface AndreEndringerRow {
  nr: number;
  beskrivelse: string;
  ub3011: number;
  endring: number;
  ib0101: number;
  isEditing?: boolean;
  originalValues?: {
    ub3011: number;
    endring: number;
    ib0101: number;
  };
}

@Component({
  selector: 'app-equity-reconciliation',
  templateUrl: './equity-reconciliation.component.html',
  styleUrls: ['./equity-reconciliation.component.scss']
})
export class EquityReconciliationComponent implements OnInit {
  // Header data
  company: string = 'Shiba Group AS';
  year: number = 2025;
  month: number = 11;
  view: string = 'View';

  // Year and month options for dropdowns
  years: number[] = [2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030];
  months: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  monthNames: string[] = ['Januar', 'Februar', 'Mars', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Desember'];

  // Checkbox states
  ibFraSelskap: boolean = false;
  inkluderUdisponertResultat: boolean = false;

  // Main reconciliation table rows
  reconciliationRows: ReconciliationRow[] = [
    { id: 'ib-egenkapital', label: 'IB egenkapital', priorPeriod: 1000000, changeDuringPeriod: 0, currentPeriod: 1000000, expanded: false, expandable: true },
    { id: 'resultat', label: 'Resultat', priorPeriod: 0, changeDuringPeriod: 250000, currentPeriod: 250000, expanded: false, expandable: false },
    { id: 'andre-endringer', label: 'Andre endringer', priorPeriod: 0, changeDuringPeriod: 50000, currentPeriod: 50000, expanded: false, expandable: true },
    { id: 'ub-egenkapital', label: 'UB egenkapital', priorPeriod: 1000000, changeDuringPeriod: 300000, currentPeriod: 1300000, expanded: false, expandable: true },
    { id: 'differanse', label: 'Differanse', priorPeriod: 0, changeDuringPeriod: 0, currentPeriod: 0, expanded: false, expandable: false }
  ];

  // Selected row for detail panel
  selectedRowId: string | null = null;

  // Detail table data - this would be loaded based on selected row
  detailRows: DetailRow[] = [];
  detailColumns: string[] = ['kontonr', 'kontonavn', 'ub3011', 'endring', 'ib0101', 'type'];

  // Andre endringer detail rows
  andreEndringerRows: AndreEndringerRow[] = [];
  selectedAndreEndringerRow: AndreEndringerRow | null = null;

  // Available type options for dropdown
  typeOptions: string[] = ['Egenkapital', 'Resultat', 'Endring', 'Annet'];

  // Prior period date for display (first day of selected year)
  get priorPeriod(): string {
    return `01.01.${this.year}`;
  }

  // Current period date for display (last day of selected month)
  get currentPeriod(): string {
    const day = 30; // Last day of month (assuming 30 for now, could be calculated based on month)
    const month = this.month.toString().padStart(2, '0');
    return `${day}.${month}.${this.year}`;
  }

  get formattedMonth(): string {
    return this.month.toString().padStart(2, '0');
  }

  // Active tab/button - null means no selection
  activeTab: number | null = null;

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    // Initialize component
  }

  setActiveTab(index: number): void {
    // Toggle: if clicking the same button, deselect it
    if (this.activeTab === index) {
      this.activeTab = null;
    } else {
      this.activeTab = index;
    }
    // Here you can add logic to handle tab/button selection
    console.log('Active tab:', this.activeTab);
  }

  openValutaomregningerDialog(): void {
    const dialogRef = this.dialog.open(ValutaomregningerDialogComponent, {
      width: '1000px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      disableClose: false,
      hasBackdrop: true,
      backdropClass: 'dialog-backdrop',
      panelClass: 'valutaomregning-dialog',
      autoFocus: true,
      data: {}
    });

    dialogRef.afterClosed().subscribe(() => {
      // Handle dialog close if needed
    });
  }

  openEgenkapitalGruppeDialog(): void {
    const dialogRef = this.dialog.open(EgenkapitalGruppeDialogComponent, {
      width: '600px',
      maxWidth: '90vw',
      maxHeight: '90vh',
      disableClose: false,
      hasBackdrop: true,
      backdropClass: 'dialog-backdrop',
      panelClass: 'egenkapital-gruppe-dialog',
      autoFocus: true,
      data: {}
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result && result.saved) {
        // Handle saved groups if needed
        console.log('Saved groups:', result.groups);
      }
    });
  }

  openDatterselskapDialog(): void {
    const dialogRef = this.dialog.open(DatterselskapDialogComponent, {
      width: '1200px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      disableClose: false,
      hasBackdrop: true,
      backdropClass: 'dialog-backdrop',
      panelClass: 'datterselskap-dialog',
      autoFocus: true,
      data: {
        year: this.year,
        month: this.month
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result && result.saved) {
        // Handle saved changes if needed
        console.log('Saved changes:', result.changes);
      }
    });
  }

  openNotesDialog(): void {
    const dialogRef = this.dialog.open(NotesDialogComponent, {
      width: '700px',
      maxWidth: '90vw',
      maxHeight: '90vh',
      disableClose: false,
      hasBackdrop: true,
      backdropClass: 'dialog-backdrop',
      panelClass: 'notes-dialog',
      autoFocus: true,
      data: {
        year: this.year,
        month: this.month
      }
    });

    dialogRef.afterClosed().subscribe(() => {
      // Notes dialog is read-only, no action needed on close
    });
  }

  toggleRow(row: ReconciliationRow): void {
    // Only allow toggling for expandable rows
    if (!row.expandable) {
      return;
    }

    if (row.expanded) {
      // Collapse: hide detail panel
      row.expanded = false;
      this.selectedRowId = null;
      this.detailRows = [];
      this.andreEndringerRows = [];
      this.selectedAndreEndringerRow = null;
    } else {
      // Expand: show detail panel
      // First, collapse any other expanded row
      this.reconciliationRows.forEach(r => {
        if (r.id !== row.id) {
          r.expanded = false;
        }
      });
      
      row.expanded = true;
      this.selectedRowId = row.id;
      this.loadDetailData(row.id);
    }
  }

  loadDetailData(rowId: string): void {
    // Clear previous data
    this.detailRows = [];
    this.andreEndringerRows = [];
    this.selectedAndreEndringerRow = null;

    switch (rowId) {
      case 'ib-egenkapital':
        this.detailRows = [
          { kontonr: '2000', kontonavn: 'Egenkapital', ub3011: 500000, endring: 0, ib0101: 500000, type: 'Egenkapital' },
          { kontonr: '2100', kontonavn: 'Aksjekapital', ub3011: 300000, endring: 0, ib0101: 300000, type: 'Egenkapital' },
          { kontonr: '2200', kontonavn: 'Overkursfond', ub3011: 200000, endring: 0, ib0101: 200000, type: 'Egenkapital' }
        ];
        break;
      case 'ub-egenkapital':
        this.detailRows = [
          { kontonr: '2000', kontonavn: 'Egenkapital', ub3011: 1300000, endring: 300000, ib0101: 1000000, type: 'Egenkapital' },
          { kontonr: '2100', kontonavn: 'Aksjekapital', ub3011: 300000, endring: 0, ib0101: 300000, type: 'Egenkapital' },
          { kontonr: '2200', kontonavn: 'Overkursfond', ub3011: 200000, endring: 0, ib0101: 200000, type: 'Egenkapital' },
          { kontonr: '3000', kontonavn: 'Resultat', ub3011: 250000, endring: 250000, ib0101: 0, type: 'Resultat' },
          { kontonr: '4000', kontonavn: 'Andre endringer', ub3011: 50000, endring: 50000, ib0101: 0, type: 'Endring' }
        ];
        break;
      case 'andre-endringer':
        // Load Andre endringer detail rows
        this.andreEndringerRows = [
          { nr: 1, beskrivelse: 'Årets resultat', ub3011: 0, endring: 0, ib0101: 0 },
          { nr: 2, beskrivelse: 'Mottatt konsernbidrag', ub3011: 10000, endring: 10000, ib0101: 0 },
          { nr: 3, beskrivelse: 'Avgitt konsernbidrag', ub3011: -5000, endring: -5000, ib0101: 0 },
          { nr: 4, beskrivelse: 'Avsatt utbytte', ub3011: -15000, endring: -15000, ib0101: 0 },
          { nr: 5, beskrivelse: 'Tilleggutbytte', ub3011: 0, endring: 0, ib0101: 0 },
          { nr: 6, beskrivelse: 'Kapitalforhøyelse', ub3011: 20000, endring: 20000, ib0101: 0 },
          { nr: 7, beskrivelse: 'Kapitalnedsettelse', ub3011: 0, endring: 0, ib0101: 0 },
          { nr: 8, beskrivelse: 'Stiftelse', ub3011: 0, endring: 0, ib0101: 0 },
          { nr: 9, beskrivelse: 'Fusjon', ub3011: 0, endring: 0, ib0101: 0 },
          { nr: 10, beskrivelse: 'Fisjon', ub3011: 0, endring: 0, ib0101: 0 },
          { nr: 11, beskrivelse: 'Nedskrivning', ub3011: 0, endring: 0, ib0101: 0 },
          { nr: 12, beskrivelse: 'Kjøp av selskap', ub3011: 0, endring: 0, ib0101: 0 },
          { nr: 13, beskrivelse: 'Salg av selskap', ub3011: 0, endring: 0, ib0101: 0 },
          { nr: 14, beskrivelse: 'Valutaomregninger', ub3011: 30000, endring: 30000, ib0101: 0 },
          { nr: 15, beskrivelse: 'Andre endringer', ub3011: 0, endring: 0, ib0101: 0 }
        ];
        break;
      default:
        this.detailRows = [];
        this.andreEndringerRows = [];
    }
  }

  getSelectedRowLabel(): string {
    const row = this.reconciliationRows.find(r => r.id === this.selectedRowId);
    return row ? row.label : '';
  }

  getSelectedRow(): ReconciliationRow | null {
    if (!this.selectedRowId) return null;
    return this.reconciliationRows.find(r => r.id === this.selectedRowId) || null;
  }

  closeDetailPanel(): void {
    const row = this.getSelectedRow();
    if (row) {
      this.toggleRow(row);
    }
  }

  exportToExcel(): void {
    // Implement Excel export
    console.log('Export to Excel');
  }

  save(): void {
    // Implement save functionality
    console.log('Save');
  }

  formatNumber(value: number): string {
    return new Intl.NumberFormat('nb-NO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }

  onTypeChange(detailRow: DetailRow, newType: string): void {
    detailRow.type = newType;
    // Here you could add logic to save the change or update other data
    console.log('Type changed:', detailRow.kontonr, 'to', newType);
  }

  // Check if current detail view is Andre endringer
  isAndreEndringerView(): boolean {
    return this.selectedRowId === 'andre-endringer';
  }

  // Select Andre endringer row
  selectAndreEndringerRow(row: AndreEndringerRow): void {
    this.selectedAndreEndringerRow = row;
  }

  // Start editing Andre endringer row - opens dialog
  startEditAndreEndringer(row: AndreEndringerRow): void {
    const dialogRef = this.dialog.open(AndreEndringerEditDialogComponent, {
      width: '700px',
      maxWidth: '90vw',
      maxHeight: '90vh',
      disableClose: false,
      hasBackdrop: true,
      backdropClass: 'dialog-backdrop',
      panelClass: 'andre-endringer-edit-dialog',
      autoFocus: true,
      data: { row: { ...row } } // Pass a copy of the row
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result && result.saved) {
        // Update the row with edited values
        const index = this.andreEndringerRows.findIndex(r => r.nr === row.nr);
        if (index !== -1) {
          this.andreEndringerRows[index] = result.row;
          // Recalculate totals and update main table
          this.updateAndreEndringerTotals();
        }
      }
    });
  }


  // Calculate totals for Andre endringer
  getAndreEndringerTotals(): { ub3011: number; endring: number; ib0101: number } {
    return this.andreEndringerRows.reduce((totals, row) => {
      totals.ub3011 += row.ub3011;
      totals.endring += row.endring;
      totals.ib0101 += row.ib0101;
      return totals;
    }, { ub3011: 0, endring: 0, ib0101: 0 });
  }

  // Update main table totals when Andre endringer changes
  updateAndreEndringerTotals(): void {
    const totals = this.getAndreEndringerTotals();
    const andreEndringerRow = this.reconciliationRows.find(r => r.id === 'andre-endringer');
    
    if (andreEndringerRow) {
      // Update the change during period (endring total)
      andreEndringerRow.changeDuringPeriod = totals.endring;
      // Update current period (UB 30.11 total)
      andreEndringerRow.currentPeriod = totals.ub3011;
      // Prior period remains IB 01.01 total
      andreEndringerRow.priorPeriod = totals.ib0101;
    }
  }
}

