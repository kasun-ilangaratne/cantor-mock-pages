import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

export interface ChangeRow {
  id: number;
  date: string;
  share: string;
  isNew: boolean;
}

@Component({
  selector: 'app-change-dialog',
  templateUrl: './change-dialog.component.html',
  styleUrls: ['./change-dialog.component.scss']
})
export class ChangeDialogComponent implements OnInit {
  form: FormGroup;
  dataSource: { data: ChangeRow[] } = { data: [] };
  displayedColumns: string[] = ['date', 'share', 'actions'];

  constructor(
    public dialogRef: MatDialogRef<ChangeDialogComponent>,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({});
  }

  ngOnInit(): void {
    this.initializeData();
  }

  initializeData(): void {
    this.dataSource.data = [
      {
        id: 1,
        date: '2023-01-15',
        share: '25.50',
        isNew: false
      },
      {
        id: 2,
        date: '2023-06-20',
        share: '30.00',
        isNew: false
      }
    ];
  }

  addNewRow(): void {
    const newRow: ChangeRow = {
      id: Date.now(),
      date: '',
      share: '',
      isNew: true
    };
    this.dataSource.data.push(newRow);
  }

  deleteRow(index: number): void {
    this.dataSource.data.splice(index, 1);
  }

  onDateChange(element: ChangeRow, event: any): void {
    element.date = event.target.value;
  }

  onShareChange(element: ChangeRow, event: any): void {
    element.share = event.target.value;
  }

  close(): void {
    this.dialogRef.close();
  }

  save(): void {
    const result = {
      changes: this.dataSource.data
    };
    this.dialogRef.close(result);
  }
} 