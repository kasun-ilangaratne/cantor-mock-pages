import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Dimension, CreateDimensionRequest, UpdateDimensionRequest } from './models';
import { DimensionsService } from './dimensions.service';
import { DimensionDialogComponent, DimensionDialogData } from './dialogs/dimension-dialog.component';
import { ConfirmDialogComponent, ConfirmDialogData } from './dialogs/confirm-dialog.component';

@Component({
  selector: 'app-dimension-list',
  templateUrl: './dimension-list.component.html',
  styleUrls: ['./dimension-list.component.scss']
})
export class DimensionListComponent implements OnInit {
  @Output() select = new EventEmitter<number>();
  
  dimensions: Dimension[] = [];
  selectedId: number | null = null;
  loading = false;
  canAddDimension = true;

  constructor(
    private dimensionsService: DimensionsService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadDimensions();
    this.checkCanAddDimension();
  }

  loadDimensions(): void {
    this.loading = true;
    this.dimensionsService.getDimensions().subscribe({
      next: (dimensions) => {
        this.dimensions = dimensions;
        if (dimensions.length > 0 && !this.selectedId) {
          this.selectDimension(dimensions[0].id);
        }
        this.loading = false;
      },
      error: (error) => {
        this.showError('Failed to load dimensions');
        this.loading = false;
      }
    });
  }

  selectDimension(id: number): void {
    this.selectedId = id;
    this.select.emit(id);
  }

  createDimension(): void {
    const dialogRef = this.dialog.open(DimensionDialogComponent, {
      width: '500px',
      data: { mode: 'create' } as DimensionDialogData
    });

    dialogRef.afterClosed().subscribe((result: CreateDimensionRequest | undefined) => {
      if (result) {
        this.dimensionsService.addDimension(result).subscribe({
          next: (newDimension) => {
            this.dimensions.push(newDimension);
            this.selectDimension(newDimension.id);
            this.checkCanAddDimension();
            this.showSuccess('Dimension created successfully');
          },
          error: (error) => {
            this.showError(error.message || 'Failed to create dimension');
          }
        });
      }
    });
  }

  editDimension(dimension: Dimension): void {
    const dialogRef = this.dialog.open(DimensionDialogComponent, {
      width: '500px',
      data: { mode: 'edit', dimension } as DimensionDialogData
    });

    dialogRef.afterClosed().subscribe((result: UpdateDimensionRequest | undefined) => {
      if (result) {
        this.dimensionsService.updateDimension(result).subscribe({
          next: (updatedDimension) => {
            const index = this.dimensions.findIndex(d => d.id === updatedDimension.id);
            if (index !== -1) {
              this.dimensions[index] = updatedDimension;
            }
            this.showSuccess('Dimension updated successfully');
          },
          error: (error) => {
            this.showError(error.message || 'Failed to update dimension');
          }
        });
      }
    });
  }

  deleteDimension(dimension: Dimension): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Dimension',
        message: `Are you sure you want to delete "${dimension.name}"? This action cannot be undone.`,
        confirmText: 'Delete',
        cancelText: 'Cancel',
        type: 'danger'
      } as ConfirmDialogData
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.dimensionsService.deleteDimension(dimension.id).subscribe({
          next: () => {
            const index = this.dimensions.findIndex(d => d.id === dimension.id);
            if (index !== -1) {
              this.dimensions.splice(index, 1);
              if (this.selectedId === dimension.id) {
                this.selectedId = null;
                if (this.dimensions.length > 0) {
                  this.selectDimension(this.dimensions[0].id);
                }
              }
            }
            this.checkCanAddDimension();
            this.showSuccess('Dimension deleted successfully');
          },
          error: (error) => {
            this.showError(error.message || 'Failed to delete dimension');
          }
        });
      }
    });
  }

  private checkCanAddDimension(): void {
    this.dimensionsService.canAddDimension().subscribe({
      next: (canAdd) => {
        this.canAddDimension = canAdd;
      }
    });
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