import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DimensionsService } from './dimensions.service';
import { ConfirmDialogComponent, ConfirmDialogData } from './dialogs/confirm-dialog.component';

@Component({
  selector: 'app-dimensions',
  templateUrl: './dimensions.component.html',
  styleUrls: ['./dimensions.component.scss']
})
export class DimensionsComponent {
  selectedId: number | null = null;

  constructor(
    private dimensionsService: DimensionsService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  onDimensionSelect(id: number): void {
    this.selectedId = id;
  }

  exportToPDF(): void {
    this.dimensionsService.exportToPDF().subscribe({
      next: (filename) => {
        this.showSuccess(`PDF exported as ${filename}`);
        // In a real app, this would trigger a download
      },
      error: (error) => {
        this.showError('Failed to export PDF');
      }
    });
  }

  exportToExcel(): void {
    this.dimensionsService.exportToExcel().subscribe({
      next: (filename) => {
        this.showSuccess(`Excel file exported as ${filename}`);
        // In a real app, this would trigger a download
      },
      error: (error) => {
        this.showError('Failed to export Excel file');
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