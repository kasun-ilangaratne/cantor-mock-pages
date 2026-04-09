import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { SharesService } from './shares.service';

@Component({
  selector: 'app-share-import-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatIconModule],
  templateUrl: './share-import-dialog.component.html',
  styleUrls: ['./share-import-dialog.component.scss']
})
export class ShareImportDialogComponent {
  selectedFileName = '';
  importSummary = '';
  deleteExistingPosts = false;
  readonly sampleFileUrl = '#';

  constructor(
    @Inject(MAT_DIALOG_DATA) public readonly data: { year: number },
    private readonly dialogRef: MatDialogRef<ShareImportDialogComponent>,
    private readonly sharesService: SharesService
  ) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedFileName = input.files?.[0]?.name ?? '';
    this.importSummary = '';
  }

  import(): void {
    if (!this.selectedFileName) {
      alert('Please choose an Excel file first.');
      return;
    }

    const result = this.sharesService.importFromExcel(
      this.data.year,
      this.selectedFileName,
      this.deleteExistingPosts
    );
    this.importSummary = `${result.importedCount} share records imported from ${result.fileName}.`;
  }

  close(): void {
    this.dialogRef.close(!!this.importSummary);
  }
}
