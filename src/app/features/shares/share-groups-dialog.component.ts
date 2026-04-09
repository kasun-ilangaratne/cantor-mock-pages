import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { ShareGroup } from './shares.models';
import { SharesService } from './shares.service';

@Component({
  selector: 'app-share-groups-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatIconModule],
  templateUrl: './share-groups-dialog.component.html',
  styleUrls: ['./share-groups-dialog.component.scss']
})
export class ShareGroupsDialogComponent {
  groups: ShareGroup[] = [];
  editableGroups: Array<{ id?: string; name: string; description: string }> = [];

  constructor(
    private readonly dialogRef: MatDialogRef<ShareGroupsDialogComponent>,
    private readonly sharesService: SharesService
  ) {
    this.reload();
  }

  addGroup(): void {
    this.editableGroups.push({
      name: '',
      description: ''
    });
  }

  deleteGroup(index: number): void {
    this.editableGroups.splice(index, 1);
  }

  save(): void {
    const cleanedGroups = this.editableGroups
      .map((group) => ({
        ...group,
        name: group.name.trim(),
        description: group.description.trim()
      }))
      .filter((group) => group.name);

    if (cleanedGroups.length === 0) {
      alert('Please add at least one group.');
      return;
    }

    const originalIds = new Set(this.groups.map((group) => group.id));
    const keptIds = new Set(cleanedGroups.map((group) => group.id).filter(Boolean) as string[]);

    originalIds.forEach((id) => {
      if (!keptIds.has(id)) {
        this.sharesService.deleteGroup(id);
      }
    });

    cleanedGroups.forEach((group) => {
      this.sharesService.saveGroup({
        id: group.id,
        name: group.name,
        description: group.description
      });
    });

    this.dialogRef.close(true);
  }

  close(): void {
    this.dialogRef.close(false);
  }

  private reload(): void {
    this.groups = this.sharesService.getGroups();
    this.editableGroups = this.groups.map((group) => ({
      id: group.id,
      name: group.name,
      description: group.description
    }));
  }
}
