import { Component, Inject, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { AccountOption } from '../../../shared/components/account-dropdown/account-dropdown.component';

export interface ExceptionData {
  id: number;
  accountNo: string;
  accountName: string;
  isNew?: boolean;
}

export interface ExceptionDialogData {
  parentData?: any;
}

@Component({
  selector: 'app-exception-dialog',
  templateUrl: './exception-dialog.component.html',
  styleUrls: ['./exception-dialog.component.scss']
})
export class ExceptionDialogComponent implements OnInit {
  form: FormGroup;
  dataSource = new MatTableDataSource<ExceptionData>([]);
  showConfirmDialog = false;
  elementToDelete: ExceptionData | null = null;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ExceptionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ExceptionDialogData
  ) {
    this.form = this.fb.group({
      // Form controls if needed
    });

    // Initialize sample exception data
    this.dataSource.data = [
      { id: 1, accountNo: '1001', accountName: 'Revenue Account Alpha' },
      { id: 2, accountNo: '1002', accountName: 'Cost of Sales Beta' },
      { id: 3, accountNo: '1003', accountName: 'Operating Expenses Gamma' },
      { id: 4, accountNo: '1004', accountName: 'Financial Income Delta' },
      { id: 5, accountNo: '1005', accountName: 'Financial Expenses Epsilon' },
    ];
  }

  ngOnInit(): void {
    // Initialize component
  }

  onAddAccount(): void {
    const newRow: ExceptionData = {
      id: this.dataSource.data.length + 1,
      accountNo: '',
      accountName: '',
      isNew: true
    };
    this.dataSource.data.push(newRow);
    this.dataSource._updateChangeSubscription();
  }

  onAccountChange(element: ExceptionData, accountOption: AccountOption): void {
    element.accountNo = accountOption.value;
    element.accountName = accountOption.label.split(' - ')[1]; // Extract account name from label
  }

  onRemoveAccount(element: ExceptionData): void {
    this.elementToDelete = element;
    this.showConfirmDialog = true;
  }

  onConfirmDelete(): void {
    if (this.elementToDelete) {
      const index = this.dataSource.data.findIndex(item => item.id === this.elementToDelete!.id);
      if (index !== -1) {
        this.dataSource.data.splice(index, 1);
        this.dataSource._updateChangeSubscription();
      }
      this.elementToDelete = null;
      this.showConfirmDialog = false;
    }
  }

  onCancelDelete(): void {
    this.elementToDelete = null;
    this.showConfirmDialog = false;
  }

  onCancel(): void {
    this.dialogRef.close();
  }
} 