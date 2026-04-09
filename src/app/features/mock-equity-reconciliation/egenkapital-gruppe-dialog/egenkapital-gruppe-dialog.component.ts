import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

export interface EgenkapitalGruppe {
  id: string;
  name: string;
  isEditing?: boolean;
  isNew?: boolean;
}

export interface EgenkapitalGruppeDialogData {
  groups?: EgenkapitalGruppe[];
}

@Component({
  selector: 'app-egenkapital-gruppe-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule
  ],
  templateUrl: './egenkapital-gruppe-dialog.component.html',
  styleUrls: ['./egenkapital-gruppe-dialog.component.scss']
})
export class EgenkapitalGruppeDialogComponent implements OnInit {
  groups: EgenkapitalGruppe[] = [];
  private originalGroups: EgenkapitalGruppe[] = [];

  constructor(
    public dialogRef: MatDialogRef<EgenkapitalGruppeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EgenkapitalGruppeDialogData
  ) {
    // Initialize with default groups or data from parent
    if (data?.groups && data.groups.length > 0) {
      this.groups = data.groups.map(g => ({ ...g }));
    } else {
      // Default equity groups
      this.groups = [
        { id: '1', name: 'Aksjekapital' },
        { id: '2', name: 'Annen innskutt egenkapital' },
        { id: '3', name: 'Overkurs' },
        { id: '4', name: 'Annen egenkapital' },
        { id: '5', name: 'Udekket tap' }
      ];
    }
    this.originalGroups = this.groups.map(g => ({ ...g }));
  }

  ngOnInit(): void {
    // Initialize dialog
  }

  addGroup(): void {
    const newGroup: EgenkapitalGruppe = {
      id: `new-${Date.now()}`,
      name: '',
      isEditing: true,
      isNew: true
    };
    this.groups.push(newGroup);
  }

  deleteGroup(group: EgenkapitalGruppe): void {
    const index = this.groups.findIndex(g => g.id === group.id);
    if (index !== -1) {
      this.groups.splice(index, 1);
    }
  }

  saveGroup(group: EgenkapitalGruppe): void {
    if (group.name.trim()) {
      group.isEditing = false;
      group.isNew = false;
    }
  }

  cancelEdit(group: EgenkapitalGruppe): void {
    if (group.isNew) {
      // Remove new group if canceling
      const index = this.groups.findIndex(g => g.id === group.id);
      if (index !== -1) {
        this.groups.splice(index, 1);
      }
    } else {
      // Restore original name
      const original = this.originalGroups.find(g => g.id === group.id);
      if (original) {
        group.name = original.name;
        group.isEditing = false;
      }
    }
  }

  startEdit(group: EgenkapitalGruppe): void {
    group.isEditing = true;
  }

  onSave(): void {
    // Filter out empty new groups
    const validGroups = this.groups.filter(g => g.name.trim());
    this.dialogRef.close({
      saved: true,
      groups: validGroups
    });
  }

  onCancel(): void {
    this.dialogRef.close({
      saved: false
    });
  }
}

