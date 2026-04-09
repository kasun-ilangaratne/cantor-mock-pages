import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AccountOption } from '../../../shared/components/account-dropdown/account-dropdown.component';

@Component({
  selector: 'app-alternative-calculation-dialog',
  templateUrl: './alternative-calculation-dialog.component.html',
  styleUrls: ['./alternative-calculation-dialog.component.scss']
})
export class AlternativeCalculationDialogComponent {
  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<AlternativeCalculationDialogComponent>,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      resultFrom: [''],
      resultTo: [''],
      resultAccount: [''],
      investmentFrom: [''],
      investmentTo: [''],
      investmentAccount: [''],
      equityFrom: [''],
      equityTo: [''],
      equityAccount: [''],
      alternativeCalculation: [false],
      periodFromMonth: [''],
      periodFromYear: [''],
      periodToMonth: [''],
      periodToYear: ['']
    });
  }

  onAccountSelected(fieldName: string, accountOption: AccountOption): void {
    this.form.get(fieldName)?.setValue(accountOption.value);
  }

  close() {
    this.dialogRef.close();
  }
} 