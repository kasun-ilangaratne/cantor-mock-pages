import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import {
  AmountSeries,
  GrafSeries,
  InputLine,
  MONTH_KEYS,
  MONTH_LABELS,
  MonthlyAmounts,
  OtherVariable,
  VariableType,
  emptyAmounts,
  emptyGrafAmounts,
  monthTotal
} from '../andre-variabler.models';

export interface VariableDetailDialogData {
  variable: OtherVariable;
  isNew: boolean;
  isGraf: boolean;
}

interface AmountRow {
  key: keyof AmountSeries;
  label: string;
  radio?: boolean;
  radioValue?: InputLine;
}

interface GrafRow {
  key: keyof GrafSeries;
  label: string;
}

@Component({
  selector: 'app-variable-detail-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule],
  templateUrl: './variable-detail-dialog.component.html',
  styleUrls: ['./variable-detail-dialog.component.scss']
})
export class VariableDetailDialogComponent {
  draft: OtherVariable;
  typeOptions: VariableType[] = ['E', 'G', 'I', 'K'];
  grafTypeOptions = ['Virkelig', 'Bud/prognose', 'Eiendeler', 'Gjeld'];
  grafIdOptions = ['Dim0', 'Dim1', 'Dim2', 'Dim3'];
  dimensionOptions = ['Dimension dim0', 'Dimension dim1', 'Dimension dim2'];
  dimensionValueOptions = ['Dimensjonsverdi', '100 Hovedkontor', '200 Salg', '300 Produksjon'];
  selectedDimension = 'Dimension dim0';
  selectedDimensionValue = 'Dimensjonsverdi';
  monthKeys = MONTH_KEYS;
  monthLabels = MONTH_LABELS;

  amountRows: AmountRow[] = [
    { key: 'virkeligPeriode', label: 'Virkelig - periode', radio: true, radioValue: 'periode' },
    { key: 'virkeligHittil', label: 'Virkelig - hittil', radio: true, radioValue: 'hittil' },
    { key: 'budsjett', label: 'Budsjett' },
    { key: 'prognose', label: 'Prognose' }
  ];

  grafRows: GrafRow[] = [
    { key: 'bidrag', label: 'Bidrag' },
    { key: 'variabelLonn', label: 'Variabel lønn' },
    { key: 'variabelLonnBudsjett', label: 'Variabel lønn - budsjett' },
    { key: 'andreVariableKostnader', label: 'Andre variable kostnader' }
  ];

  constructor(
    private dialogRef: MatDialogRef<VariableDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: VariableDetailDialogData
  ) {
    const source = data?.variable;
    this.draft = {
      id: source?.id ?? 'new',
      nr: source?.nr ?? '',
      name: source?.name ?? '',
      language: source?.language ?? '',
      type: source?.type ?? 'K',
      konsKonto: source?.konsKonto ?? '',
      category: source?.category ?? 'generelle',
      yearCurrent: source?.yearCurrent ?? 0,
      yearPrior: source?.yearPrior ?? 0,
      hasFormula: source?.hasFormula ?? false,
      allowManualInput: source?.allowManualInput ?? false,
      formula: source?.formula ?? '',
      inputLine: source?.inputLine ?? 'hittil',
      amounts: this.cloneAmounts(source?.amounts),
      grafType: source?.grafType ?? 'Virkelig',
      grafId: source?.grafId ?? 'Dim0',
      grafAmounts: this.cloneGrafAmounts(source?.grafAmounts)
    };
  }

  get amountsReadOnly(): boolean {
    return !!this.data?.isGraf || (this.draft.hasFormula && !this.draft.allowManualInput);
  }

  get title(): string {
    if (this.data?.isNew) {
      return 'Ny variabel';
    }
    return this.data?.isGraf ? 'Rediger grafvariabel' : 'Rediger variabel';
  }

  getAmount(rowKey: keyof AmountSeries, month: keyof MonthlyAmounts): number {
    return this.draft.amounts?.[rowKey]?.[month] ?? 0;
  }

  setAmount(rowKey: keyof AmountSeries, month: keyof MonthlyAmounts, value: number | string): void {
    if (this.amountsReadOnly || !this.canEditCell(rowKey)) {
      return;
    }
    const parsed = Number(value);
    this.draft.amounts[rowKey][month] = Number.isFinite(parsed) ? parsed : 0;
  }

  getGrafAmount(rowKey: keyof GrafSeries, month: keyof MonthlyAmounts): number {
    return this.draft.grafAmounts?.[rowKey]?.[month] ?? 0;
  }

  formatTotal(months: MonthlyAmounts | undefined): string {
    return this.formatNumber(monthTotal(months ?? emptyAmounts().virkeligPeriode));
  }

  amountRowTotal(rowKey: keyof AmountSeries): string {
    return this.formatTotal(this.draft.amounts[rowKey]);
  }

  grafRowTotal(rowKey: keyof GrafSeries): string {
    return this.formatTotal(this.draft.grafAmounts[rowKey]);
  }

  isInputLine(key: keyof AmountSeries): boolean {
    return (key === 'virkeligPeriode' && this.draft.inputLine === 'periode')
      || (key === 'virkeligHittil' && this.draft.inputLine === 'hittil');
  }

  canEditCell(key: keyof AmountSeries): boolean {
    if (this.amountsReadOnly) {
      return false;
    }
    if (key === 'virkeligPeriode' || key === 'virkeligHittil') {
      return this.isInputLine(key);
    }
    return true;
  }

  onSave(): void {
    this.dialogRef.close({ saved: true, variable: this.draft });
  }

  onCancel(): void {
    this.dialogRef.close({ saved: false });
  }

  private formatNumber(value: number): string {
    const safe = Number.isFinite(value) ? value : 0;
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(safe);
  }

  private cloneAmounts(source?: AmountSeries): AmountSeries {
    const clone = emptyAmounts();
    if (!source) {
      return clone;
    }
    (Object.keys(clone) as (keyof AmountSeries)[]).forEach((row) => {
      MONTH_KEYS.forEach((month) => {
        clone[row][month] = source[row]?.[month] ?? 0;
      });
    });
    return clone;
  }

  private cloneGrafAmounts(source?: GrafSeries): GrafSeries {
    const clone = emptyGrafAmounts();
    if (!source) {
      return clone;
    }
    (Object.keys(clone) as (keyof GrafSeries)[]).forEach((row) => {
      MONTH_KEYS.forEach((month) => {
        clone[row][month] = source[row]?.[month] ?? 0;
      });
    });
    return clone;
  }
}
