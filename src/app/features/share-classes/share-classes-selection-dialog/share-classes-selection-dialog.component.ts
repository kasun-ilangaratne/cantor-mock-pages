import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';

export interface ShareClassSelection {
  name: string;
  checked: boolean;
}

export interface ShareClassesSelectionDialogData {
  selectedClasses?: string[];
}

@Component({
  selector: 'app-share-classes-selection-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatCheckboxModule
  ],
  templateUrl: './share-classes-selection-dialog.component.html',
  styleUrls: ['./share-classes-selection-dialog.component.scss']
})
export class ShareClassesSelectionDialogComponent implements OnInit {
  shareClasses: ShareClassSelection[] = [
    { name: 'Ordinære', checked: true },
    { name: 'A', checked: true },
    { name: 'B', checked: true },
    { name: 'C', checked: false },
    { name: 'D', checked: false },
    { name: 'Preference', checked: false },
    { name: 'Extraordinary', checked: false },
    { name: 'E', checked: false },
    { name: 'F', checked: false },
    { name: 'G', checked: false },
    { name: 'H', checked: false },
    { name: 'I', checked: false },
    { name: 'J', checked: false }
  ];

  constructor(
    public dialogRef: MatDialogRef<ShareClassesSelectionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ShareClassesSelectionDialogData
  ) {
    // Initialize with selected classes if provided
    if (data?.selectedClasses) {
      this.shareClasses.forEach(sc => {
        sc.checked = data.selectedClasses!.includes(sc.name);
      });
    }
  }

  ngOnInit(): void {
    // Initialize dialog
  }

  onSave(): void {
    const selectedClasses = this.shareClasses
      .filter(sc => sc.checked)
      .map(sc => sc.name);
    
    this.dialogRef.close({
      saved: true,
      selectedClasses: selectedClasses
    });
  }

  onCancel(): void {
    this.dialogRef.close({
      saved: false
    });
  }
}

