import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Subject, takeUntil } from 'rxjs';
import { AccountOption } from '../../../shared/components/account-dropdown/account-dropdown.component';

export interface HistoricalCostRow {
  id: number;
  account: string;
  accountName: string;
  amount?: string;
  rate: string;
  date: Date | null;
  comment: string;
  yearRes: boolean;
  prevRes: boolean;
  yearBal: boolean;
  prevBal: boolean;
  isNew: boolean;
}

@Component({
  selector: 'app-historical-cost-dialog',
  templateUrl: './historical-cost-dialog.component.html',
  styleUrls: ['./historical-cost-dialog.component.scss']
})
export class HistoricalCostDialogComponent implements OnInit, OnDestroy {
  form: FormGroup;
  dataSource = new MatTableDataSource<HistoricalCostRow>([]);
  perTransactionMode = false;
  private destroy$ = new Subject<void>();

  constructor(
    public dialogRef: MatDialogRef<HistoricalCostDialogComponent>,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      mode: ['resultat'],
      altCalc: [false],
      perTransaction: [false]
    });
  }

  ngOnInit(): void {
    this.initializeData();
    this.setupFormSubscription();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setupFormSubscription(): void {
    this.form.get('perTransaction')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        this.perTransactionMode = value;
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      });
  }

  get perTransaction(): boolean {
    return this.perTransactionMode;
  }

  get altCalcValue(): boolean {
    return this.form.get('altCalc')?.value || false;
  }

  set altCalcValue(value: boolean) {
    this.form.get('altCalc')?.setValue(value);
  }

  get perTransactionValue(): boolean {
    return this.form.get('perTransaction')?.value || false;
  }

  set perTransactionValue(value: boolean) {
    this.form.get('perTransaction')?.setValue(value);
  }

  getDateString(date: Date | null): string {
    if (!date) return '';
    return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD format
  }

  onDateChange(element: HistoricalCostRow, event: any): void {
    const dateValue = event.target.value;
    if (dateValue) {
      element.date = new Date(dateValue);
    } else {
      element.date = null;
    }
  }

  initializeData(): void {
    const initialData: HistoricalCostRow[] = [
      {
        id: 1,
        account: '1001',
        accountName: 'Revenue Account',
        amount: '',
        rate: '1.25',
        date: new Date('2023-01-15'),
        comment: 'Initial rate setup',
        yearRes: true,
        prevRes: false,
        yearBal: false,
        prevBal: false,
        isNew: false
      },
      {
        id: 2,
        account: '2000',
        accountName: 'Share Capital',
        amount: '',
        rate: '1.30',
        date: new Date('2023-02-20'),
        comment: 'Updated rate',
        yearRes: false,
        prevRes: false,
        yearBal: true,
        prevBal: false,
        isNew: false
      }
    ];

    this.dataSource.data = initialData;
  }

  get rows(): FormArray {
    return this.form.get('rows') as FormArray;
  }

  addRow(): void {
    const newRow: HistoricalCostRow = {
      id: Date.now(),
      account: '',
      accountName: '',
      amount: '',
      rate: '',
      date: null,
      comment: '',
      yearRes: false,
      prevRes: false,
      yearBal: false,
      prevBal: false,
      isNew: true
    };

    this.dataSource.data = [...this.dataSource.data, newRow];
  }

  deleteRow(index: number): void {
    this.dataSource.data.splice(index, 1);
    this.dataSource.data = [...this.dataSource.data];
  }



  onAccountChange(element: HistoricalCostRow, accountOption: AccountOption): void {
    element.account = accountOption.value;
    element.accountName = accountOption.label.split(' - ')[1]; // Extract account name from label
  }

  onRadioChange(element: HistoricalCostRow, selectedOption: string): void {
    // Reset all radio buttons for this row
    element.yearRes = false;
    element.prevRes = false;
    element.yearBal = false;
    element.prevBal = false;
    
    // Set the selected option
    switch(selectedOption) {
      case 'yearRes':
        element.yearRes = true;
        break;
      case 'prevRes':
        element.prevRes = true;
        break;
      case 'yearBal':
        element.yearBal = true;
        break;
      case 'prevBal':
        element.prevBal = true;
        break;
    }
  }

  close(): void {
    this.dialogRef.close();
  }

  save(): void {
    if (this.form.valid) {
      const result = {
        mode: this.form.get('mode')?.value,
        altCalc: this.form.get('altCalc')?.value,
        perTransaction: this.form.get('perTransaction')?.value,
        rows: this.dataSource.data
      };
      this.dialogRef.close(result);
    }
  }
} 