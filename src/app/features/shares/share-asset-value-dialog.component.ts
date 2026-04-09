import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { Shareholding } from './shares.models';
import { SharesService } from './shares.service';

@Component({
  selector: 'app-share-asset-value-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatIconModule],
  templateUrl: './share-asset-value-dialog.component.html',
  styleUrls: ['./share-asset-value-dialog.component.scss']
})
export class ShareAssetValueDialogComponent {
  summary = '';

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public readonly data: { year: number; shareholdings: Shareholding[] },
    private readonly dialogRef: MatDialogRef<ShareAssetValueDialogComponent>,
    private readonly sharesService: SharesService
  ) {}

  get activeCount(): number {
    return this.data.shareholdings.filter((item) => item.activeAtYearEnd).length;
  }

  updateValues(): void {
    const result = this.sharesService.updateAssetValues(this.data.year);
    this.summary = `Updated asset values for ${result.updatedCount} shareholdings on ${new Date(result.updatedAt).toLocaleString()}.`;
  }

  close(): void {
    this.dialogRef.close(!!this.summary);
  }
}
