import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { ConfirmDialogComponent } from '../share-classes/confirm-dialog/confirm-dialog.component';
import { createSampleVariables } from './andre-variabler.sample-data';
import {
  AmountFormat,
  OtherVariable,
  VariableCategory,
  emptyAmounts,
  emptyGrafAmounts
} from './andre-variabler.models';
import { CopySetupDialogComponent } from './copy-setup-dialog/copy-setup-dialog.component';
import { EstablishCashflowDialogComponent } from './establish-cashflow-dialog/establish-cashflow-dialog.component';
import { FormulaDialogComponent } from './formula-dialog/formula-dialog.component';
import { VariableDetailDialogComponent } from './variable-detail-dialog/variable-detail-dialog.component';

interface CategoryTab {
  id: VariableCategory;
  label: string;
}

@Component({
  selector: 'app-andre-variabler',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatIconModule, MatMenuModule],
  templateUrl: './andre-variabler.component.html',
  styleUrls: ['./andre-variabler.component.scss']
})
export class AndreVariablerComponent {
  company = 'Shiba Group AS';
  year = 2026;
  month = 7;
  years = [2023, 2024, 2025, 2026, 2027];
  months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  monthNames = [
    'Januar', 'Februar', 'Mars', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Desember'
  ];

  amountFormat: AmountFormat = 'thousands';
  amountFormatOptions: { value: AmountFormat; label: string }[] = [
    { value: 'units', label: 'Heltall' },
    { value: 'two-decimals', label: '2 desimaler' },
    { value: 'thousands', label: 'Tusen' },
    { value: 'millions', label: 'Millioner' }
  ];

  tabs: CategoryTab[] = [
    { id: 'generelle', label: 'Generelle' },
    { id: 'kontantstrom', label: 'Kontantstrøm' },
    { id: 'regnskapsanalyse', label: 'Regnskapsanalyse' },
    { id: 'notevariabler', label: 'Notevariabler' },
    { id: 'grafvariabler', label: 'Grafvariabler' }
  ];

  selectedCategory: VariableCategory = 'regnskapsanalyse';
  selectedRowId: string | null = null;
  flashMessage = '';
  grafTypeOptions = ['Virkelig', 'Bud/prognose', 'Eiendeler', 'Gjeld'];
  grafIdOptions = ['Dim0', 'Dim1', 'Dim2', 'Dim3'];
  variables: OtherVariable[] = createSampleVariables();

  constructor(private dialog: MatDialog) {}

  get priorYear(): number {
    return this.year - 1;
  }

  get isGrafTab(): boolean {
    return this.selectedCategory === 'grafvariabler';
  }

  get visibleVariables(): OtherVariable[] {
    return this.variables.filter((item) => item.category === this.selectedCategory);
  }

  selectCategory(category: VariableCategory): void {
    this.selectedCategory = category;
    this.selectedRowId = null;
  }

  isAmountEditable(row: OtherVariable): boolean {
    if (this.isGrafTab) {
      return false;
    }
    return !row.hasFormula || row.allowManualInput;
  }

  formatAmount(value: number): string {
    const scaled = this.scaleAmount(value);
    const decimals = this.amountFormat === 'two-decimals' || Math.abs(scaled) < 100 && scaled % 1 !== 0 ? 2 : 0;
    return new Intl.NumberFormat('nb-NO', {
      minimumFractionDigits: this.amountFormat === 'two-decimals' ? 2 : decimals,
      maximumFractionDigits: 2
    }).format(scaled);
  }

  openAddDialog(): void {
    const next = this.nextNumber();
    const created: OtherVariable = {
      id: `${this.selectedCategory}-${next}`,
      nr: next,
      name: '',
      language: '',
      type: 'K',
      konsKonto: '',
      category: this.selectedCategory,
      yearCurrent: 0,
      yearPrior: 0,
      hasFormula: this.isGrafTab,
      allowManualInput: false,
      formula: '',
      inputLine: 'hittil',
      amounts: emptyAmounts(),
      grafType: 'Virkelig',
      grafId: 'Dim0',
      grafAmounts: emptyGrafAmounts()
    };

    this.openDetailDialog(created, true);
  }

  openEditDialog(row: OtherVariable): void {
    this.selectedRowId = row.id;
    this.openDetailDialog(row, false);
  }

  openFormulaDialog(row: OtherVariable): void {
    this.selectedRowId = row.id;
    const dialogRef = this.dialog.open(FormulaDialogComponent, {
      width: '860px',
      maxWidth: '95vw',
      data: { variable: row }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result?.saved) {
        return;
      }
      row.formula = result.formula;
      row.hasFormula = result.hasFormula;
      this.showFlash(`Formel oppdatert for ${row.nr} ${row.name}`);
    });
  }

  deleteVariable(row: OtherVariable): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '420px',
      data: {
        title: 'Slett variabel',
        message: `Vil du slette ${row.nr} ${row.name}?`
      }
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (!confirmed) {
        return;
      }
      this.variables = this.variables.filter((item) => item.id !== row.id);
      this.showFlash(`${row.nr} ${row.name} er slettet`);
    });
  }

  openHamburgerAction(action: 'cashflow' | 'copy'): void {
    if (action === 'cashflow') {
      this.dialog.open(EstablishCashflowDialogComponent, { width: '640px', maxWidth: '95vw' })
        .afterClosed()
        .subscribe((ok) => {
          if (ok) {
            this.showFlash('Kontantstrømanalyse er etablert for Shiba Group AS');
          }
        });
      return;
    }

    this.dialog.open(CopySetupDialogComponent, { width: '720px', maxWidth: '95vw' })
      .afterClosed()
      .subscribe((result) => {
        if (result?.applied) {
          const count = result.companies?.length ?? 0;
          this.showFlash(`Rapportoppsett kopiert til ${count} firma`);
        }
      });
  }

  savePage(): void {
    this.showFlash('Andre variabler er lagret');
  }

  private openDetailDialog(variable: OtherVariable, isNew: boolean): void {
    const dialogRef = this.dialog.open(VariableDetailDialogComponent, {
      width: '1100px',
      maxWidth: '96vw',
      maxHeight: '92vh',
      autoFocus: false,
      restoreFocus: false,
      panelClass: 'variable-detail-dialog-panel',
      data: {
        variable: { ...variable },
        isNew,
        isGraf: this.isGrafTab
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result?.saved) {
        return;
      }
      const saved = result.variable as OtherVariable;
      const index = this.variables.findIndex((item) => item.id === saved.id);
      if (index >= 0) {
        this.variables[index] = saved;
      } else {
        this.variables = [...this.variables, saved];
      }
      this.showFlash(isNew ? `Ny variabel ${saved.nr} er opprettet` : `${saved.nr} ${saved.name} er oppdatert`);
    });
  }

  private nextNumber(): string {
    const rows = this.visibleVariables;
    const max = rows.reduce((highest, row) => Math.max(highest, Number(row.nr) || 0), this.baseNumber() - 2);
    return String(max + 2).padStart(4, '0');
  }

  private baseNumber(): number {
    switch (this.selectedCategory) {
      case 'generelle':
        return 2;
      case 'kontantstrom':
        return 200;
      case 'regnskapsanalyse':
        return 100;
      case 'notevariabler':
        return 300;
      case 'grafvariabler':
        return 400;
    }
  }

  private scaleAmount(value: number): number {
    if (this.amountFormat === 'thousands') {
      return value / 1000;
    }
    if (this.amountFormat === 'millions') {
      return value / 1000000;
    }
    return value;
  }

  private showFlash(message: string): void {
    this.flashMessage = message;
    setTimeout(() => {
      if (this.flashMessage === message) {
        this.flashMessage = '';
      }
    }, 2800);
  }
}
