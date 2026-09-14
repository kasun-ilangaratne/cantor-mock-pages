import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

export interface CompanyOption {
  nr: number;
  name: string;
  type: string;
}

export interface CompanyPickerDialogData {
  selectedNumbers?: number[];
}

@Component({
  selector: 'app-company-picker-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule],
  templateUrl: './company-picker-dialog.component.html',
  styleUrls: ['./company-picker-dialog.component.scss']
})
export class CompanyPickerDialogComponent {
  typeFilter = '';
  typeOptions = ['Konsern', 'AS', 'Annet'];
  showSelectedOnly = false;
  sortKey: 'nr' | 'name' = 'nr';
  sortDir: 'asc' | 'desc' = 'asc';
  selected = new Set<number>();

  companies: CompanyOption[] = [
    { nr: 1, name: 'Cantor Konsernfirma', type: 'Konsern' },
    { nr: 5, name: 'Shiba Likvid AS', type: 'AS' },
    { nr: 52, name: 'Regnskapskunden AS', type: 'AS' },
    { nr: 53, name: 'GALGEBERG BORETTSLAG A', type: 'Annet' },
    { nr: 11143, name: 'Lentusgruppen Konsern', type: 'Konsern' },
    { nr: 21100, name: 'Bara Eiendom Konsern', type: 'Konsern' },
    { nr: 22222, name: 'Cantor AS', type: 'AS' },
    { nr: 25222, name: 'Shiba Dimkompetanse AS', type: 'AS' },
    { nr: 40606, name: 'Shiba 2 AS', type: 'AS' },
    { nr: 98404, name: 'LCD Konsern', type: 'Konsern' },
    { nr: 100000, name: 'Buss AS', type: 'AS' },
    { nr: 99991, name: 'Budsjettversjon ND2022 v.1', type: 'Annet' },
    { nr: 99995, name: 'VY BUSS AS', type: 'AS' },
    { nr: 100022, name: 'Shiba AS', type: 'AS' }
  ];

  constructor(
    private dialogRef: MatDialogRef<CompanyPickerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CompanyPickerDialogData
  ) {
    const initial = data?.selectedNumbers?.length
      ? data.selectedNumbers
      : [40606, 100022];
    initial.forEach((nr) => this.selected.add(nr));
  }

  get visibleCompanies(): CompanyOption[] {
    let rows = this.companies.slice();
    if (this.typeFilter) {
      rows = rows.filter((row) => row.type === this.typeFilter);
    }
    if (this.showSelectedOnly) {
      rows = rows.filter((row) => this.selected.has(row.nr));
    }
    const direction = this.sortDir === 'asc' ? 1 : -1;
    return rows.sort((a, b) => {
      if (this.sortKey === 'nr') {
        return (a.nr - b.nr) * direction;
      }
      return a.name.localeCompare(b.name, 'nb') * direction;
    });
  }

  get allVisibleSelected(): boolean {
    const rows = this.visibleCompanies;
    return rows.length > 0 && rows.every((row) => this.selected.has(row.nr));
  }

  toggleSort(key: 'nr' | 'name'): void {
    if (this.sortKey === key) {
      this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
      return;
    }
    this.sortKey = key;
    this.sortDir = 'asc';
  }

  toggleAllVisible(checked: boolean): void {
    this.visibleCompanies.forEach((row) => {
      if (checked) {
        this.selected.add(row.nr);
      } else {
        this.selected.delete(row.nr);
      }
    });
  }

  toggleCompany(nr: number, checked: boolean): void {
    if (checked) {
      this.selected.add(nr);
      return;
    }
    this.selected.delete(nr);
  }

  isSelected(nr: number): boolean {
    return this.selected.has(nr);
  }

  onOk(): void {
    const companies = this.companies.filter((row) => this.selected.has(row.nr));
    this.dialogRef.close({
      confirmed: true,
      companies
    });
  }

  onCancel(): void {
    this.dialogRef.close({ confirmed: false });
  }
}
