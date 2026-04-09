import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DimensionValue, CreateDimensionValueRequest, UpdateDimensionValueRequest, GROUP_OF_COMPANIES_ID } from './models';
import { DimensionsService } from './dimensions.service';
import { DimensionValueDialogComponent, DimensionValueDialogData } from './dialogs/dimension-value-dialog.component';
import { ConfirmDialogComponent, ConfirmDialogData } from './dialogs/confirm-dialog.component';

@Component({
  selector: 'app-dimension-values',
  templateUrl: './dimension-values.component.html',
  styleUrls: ['./dimension-values.component.scss']
})
export class DimensionValuesComponent implements OnInit, OnChanges {
  @Input() dimensionId: number | null = null;
  
  dimensionValues: DimensionValue[] = [];
  loading = false;

  constructor(
    private dimensionsService: DimensionsService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    if (this.dimensionId) {
      this.loadDimensionValues();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dimensionId'] && this.dimensionId) {
      this.loadDimensionValues();
    }
  }

  loadDimensionValues(): void {
    if (!this.dimensionId) return;
    
    this.loading = true;
    this.dimensionsService.getValues(this.dimensionId).subscribe({
      next: (values) => {
        this.dimensionValues = values;
        this.loading = false;
      },
      error: (error) => {
        this.showError('Failed to load dimension values');
        this.loading = false;
      }
    });
  }

  createValue(): void {
    if (!this.dimensionId) return;

    const dialogRef = this.dialog.open(DimensionValueDialogComponent, {
      width: '500px',
      data: { mode: 'create', dimensionId: this.dimensionId } as DimensionValueDialogData
    });

    dialogRef.afterClosed().subscribe((result: CreateDimensionValueRequest | undefined) => {
      if (result) {
        this.dimensionsService.addValue(result).subscribe({
          next: (newValue) => {
            this.dimensionValues.push(newValue);
            this.showSuccess('Value created successfully');
          },
          error: (error) => {
            this.showError(error.message || 'Failed to create value');
          }
        });
      }
    });
  }

  editValue(value: DimensionValue): void {
    if (!this.dimensionId) return;

    const dialogRef = this.dialog.open(DimensionValueDialogComponent, {
      width: '500px',
      data: { mode: 'edit', value, dimensionId: this.dimensionId } as DimensionValueDialogData
    });

    dialogRef.afterClosed().subscribe((result: UpdateDimensionValueRequest | undefined) => {
      if (result) {
        this.dimensionsService.updateValue(result).subscribe({
          next: (updatedValue) => {
            const index = this.dimensionValues.findIndex(v => v.id === updatedValue.id);
            if (index !== -1) {
              this.dimensionValues[index] = updatedValue;
            }
            this.showSuccess('Value updated successfully');
          },
          error: (error) => {
            this.showError(error.message || 'Failed to update value');
          }
        });
      }
    });
  }

  deleteValue(value: DimensionValue): void {
    // Prevent deletion of Group of Companies
    if (this.dimensionsService.isGroupOfCompanies(value)) {
      this.showError('Cannot delete "Group of Companies" value');
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Value',
        message: `Are you sure you want to delete "${value.text}"? This action cannot be undone.`,
        confirmText: 'Delete',
        cancelText: 'Cancel',
        type: 'danger'
      } as ConfirmDialogData
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.dimensionsService.deleteValue(value.id).subscribe({
          next: () => {
            const index = this.dimensionValues.findIndex(v => v.id === value.id);
            if (index !== -1) {
              this.dimensionValues.splice(index, 1);
            }
            this.showSuccess('Value deleted successfully');
          },
          error: (error) => {
            this.showError(error.message || 'Failed to delete value');
          }
        });
      }
    });
  }

  isGroupOfCompanies(value: DimensionValue): boolean {
    return this.dimensionsService.isGroupOfCompanies(value);
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['success-snackbar']
    });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['error-snackbar']
    });
  }
} 