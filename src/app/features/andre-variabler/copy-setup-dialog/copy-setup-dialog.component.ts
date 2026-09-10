import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-copy-setup-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule],
  templateUrl: './copy-setup-dialog.component.html',
  styleUrls: ['./copy-setup-dialog.component.scss']
})
export class CopySetupDialogComponent {
  copyMode: 'add' | 'replace' = 'add';
  selectedCompanies: string[] = ['Nordlys Drift AS'];
  companyOptions = ['Nordlys Drift AS', 'Fjord Kapital AS', 'Havn Holding AS', 'Alpin Eiendom AS'];
  variables = {
    generelle: false,
    kontantstrom: false,
    regnskapsanalyse: false,
    grafvariabler: false,
    notevariabler: false
  };

  constructor(private dialogRef: MatDialogRef<CopySetupDialogComponent>) {}

  toggleCompany(company: string, checked: boolean): void {
    if (checked && !this.selectedCompanies.includes(company)) {
      this.selectedCompanies.push(company);
      return;
    }
    this.selectedCompanies = this.selectedCompanies.filter((item) => item !== company);
  }

  isSelected(company: string): boolean {
    return this.selectedCompanies.includes(company);
  }

  selectAllCompanies(): void {
    this.selectedCompanies = this.companyOptions.slice();
  }

  onApply(): void {
    this.dialogRef.close({
      applied: true,
      copyMode: this.copyMode,
      variables: { ...this.variables },
      companies: [...this.selectedCompanies]
    });
  }

  onCancel(): void {
    this.dialogRef.close({ applied: false });
  }
}
