import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ExceptionDialogComponent } from '../exception-dialog/exception-dialog.component';

export interface CounterpartyData {
  companyNo: string;
  companyName: string;
  id: string;
}

export interface DialogData {
  dim: number;
}

@Component({
  selector: 'app-counterparty-dialog',
  templateUrl: './counterparty-dialog.component.html',
  styleUrls: ['./counterparty-dialog.component.scss']
})
export class CounterpartyDialogComponent implements OnInit {
  form: FormGroup;
  dataSource: any;
  Math = Math;
  currentPage = 0;
  pageSize = 10;

  dimensions = [
    { value: 'Dim 1', label: 'Dim 1' },
    { value: 'Dim 2', label: 'Dim 2' },
    { value: 'Dim 3', label: 'Dim 3' },
    { value: 'Dim 4', label: 'Dim 4' },
    { value: 'Dim 5', label: 'Dim 5' },
    { value: 'Dim 6', label: 'Dim 6' },
    { value: 'Dim 7', label: 'Dim 7' },
    { value: 'Dim 8', label: 'Dim 8' }
  ];

  additionalDimensions = [
    { value: '', label: '(None)' },
    { value: 'Dim 1', label: 'Dim 1' },
    { value: 'Dim 2', label: 'Dim 2' },
    { value: 'Dim 3', label: 'Dim 3' },
    { value: 'Dim 4', label: 'Dim 4' },
    { value: 'Dim 5', label: 'Dim 5' },
    { value: 'Dim 6', label: 'Dim 6' },
    { value: 'Dim 7', label: 'Dim 7' },
    { value: 'Dim 8', label: 'Dim 8' }
  ];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CounterpartyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dialog: MatDialog
  ) {
    this.form = this.fb.group({
      dimension: ['Dim 5', Validators.required],
      unilateral: [false],
      additionalDimension: [''],
      additionalDimension2: ['']
    });

    // Initialize table data
    this.dataSource = {
      data: [
        { companyNo: '1001', companyName: 'Company Alpha AS', id: 'ALP001' },
        { companyNo: '1002', companyName: 'Beta Corporation', id: 'BET002' },
        { companyNo: '1003', companyName: 'Gamma Industries', id: 'GAM003' },
        { companyNo: '1004', companyName: 'Delta Solutions', id: 'DEL004' },
        { companyNo: '1005', companyName: 'Epsilon Enterprises', id: 'EPS005' },
        { companyNo: '1006', companyName: 'Zeta Holdings', id: 'ZET006' },
        { companyNo: '1007', companyName: 'Eta Partners', id: 'ETA007' },
        { companyNo: '1008', companyName: 'Theta Group', id: 'THE008' },
        { companyNo: '1009', companyName: 'Iota International', id: 'IOT009' },
        { companyNo: '1010', companyName: 'Kappa Limited', id: 'KAP010' }
      ],
      paginator: { pageIndex: 0, pageSize: 10 }
    };
  }

  ngOnInit(): void {
    // Set initial dimension value from dialog data
    if (this.data?.dim) {
      this.form.patchValue({
        dimension: `Dim ${this.data.dim}`
      });
    }
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    // Simple filter implementation
    const filteredData = this.dataSource.data.filter((item: CounterpartyData) => 
      item.companyNo.toLowerCase().includes(filterValue.toLowerCase()) ||
      item.companyName.toLowerCase().includes(filterValue.toLowerCase()) ||
      item.id.toLowerCase().includes(filterValue.toLowerCase())
    );
    this.dataSource.data = filteredData;
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.dataSource.paginator.pageIndex = this.currentPage;
    }
  }

  nextPage(): void {
    const maxPage = Math.ceil(this.dataSource.data.length / this.pageSize) - 1;
    if (this.currentPage < maxPage) {
      this.currentPage++;
      this.dataSource.paginator.pageIndex = this.currentPage;
    }
  }

  onException(): void {
    const exceptionDialogRef = this.dialog.open(ExceptionDialogComponent, {
      width: '600px',
      data: { parentData: this.form.value },
      position: { top: '50px', right: '50px' },
      panelClass: 'exception-dialog-overlay'
    });

    exceptionDialogRef.afterClosed().subscribe(result => {
      if (result === 'delete') {
        console.log('Exceptions deleted');
        // Handle delete action
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }
} 