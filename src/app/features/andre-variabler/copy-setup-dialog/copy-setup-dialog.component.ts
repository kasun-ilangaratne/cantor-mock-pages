import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import {
  CompanyOption,
  CompanyPickerDialogComponent
} from '../company-picker-dialog/company-picker-dialog.component';

@Component({
  selector: 'app-copy-setup-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule],
  templateUrl: './copy-setup-dialog.component.html',
  styleUrls: ['./copy-setup-dialog.component.scss']
})
export class CopySetupDialogComponent {
  copyMode: 'add' | 'replace' = 'add';
  selectedCompanies: CompanyOption[] = [];
  variables = {
    generelle: false,
    kontantstrom: false,
    regnskapsanalyse: false,
    grafvariabler: false,
    notevariabler: false
  };

  constructor(
    private dialogRef: MatDialogRef<CopySetupDialogComponent>,
    private dialog: MatDialog
  ) {}

  removeCompany(nr: number): void {
    this.selectedCompanies = this.selectedCompanies.filter((item) => item.nr !== nr);
  }

  openCompanyPicker(): void {
    this.dialogRef.addPanelClass('copy-dialog-hidden');
    this.dialog.open(CompanyPickerDialogComponent, {
      width: '460px',
      maxWidth: '95vw',
      autoFocus: false,
      panelClass: 'company-picker-overlay',
      backdropClass: 'company-picker-backdrop',
      data: {
        selectedNumbers: this.selectedCompanies.map((item) => item.nr)
      }
    }).afterClosed().subscribe((result) => {
      this.dialogRef.removePanelClass('copy-dialog-hidden');
      if (!result?.confirmed) {
        return;
      }
      this.selectedCompanies = result.companies ?? [];
    });
  }

  onApply(): void {
    this.dialogRef.close({
      applied: true,
      copyMode: this.copyMode,
      variables: { ...this.variables },
      companies: this.selectedCompanies.map((item) => item.name)
    });
  }

  onCancel(): void {
    this.dialogRef.close({ applied: false });
  }
}
