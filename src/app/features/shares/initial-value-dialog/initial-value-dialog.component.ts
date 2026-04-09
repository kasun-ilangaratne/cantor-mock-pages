import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

export interface SharesInitialValueDialogData {
  taxableAssetValue: number;
  appraisedValue: number;
  accountingValue: number;
  listedCompanyStatedInitialValue: number;
}

@Component({
  selector: 'app-shares-initial-value-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatButtonModule, MatInputModule],
  templateUrl: './initial-value-dialog.component.html',
  styleUrls: ['./initial-value-dialog.component.scss']
})
export class SharesInitialValueDialogComponent {
  taxableAssetValue = 0;
  appraisedValue = 0;
  accountingValue = 0;
  listedCompanyStatedInitialValue = 0;

  constructor(
    public dialogRef: MatDialogRef<SharesInitialValueDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SharesInitialValueDialogData
  ) {
    this.taxableAssetValue = Number(data?.taxableAssetValue) || 0;
    this.appraisedValue = Number(data?.appraisedValue) || 0;
    this.accountingValue = Number(data?.accountingValue) || 0;
    this.listedCompanyStatedInitialValue = Number(data?.listedCompanyStatedInitialValue) || 0;
  }

  onCancel(): void {
    this.dialogRef.close({ saved: false });
  }

  onSave(): void {
    this.dialogRef.close({
      saved: true,
      taxableAssetValue: this.taxableAssetValue,
      appraisedValue: this.appraisedValue,
      accountingValue: this.accountingValue,
      listedCompanyStatedInitialValue: this.listedCompanyStatedInitialValue
    });
  }
}

