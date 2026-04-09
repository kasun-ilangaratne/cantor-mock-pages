import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

export interface AddShareClassDialogData {
  // No initial data needed
}

@Component({
  selector: 'app-add-share-class-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule
  ],
  templateUrl: './add-share-class-dialog.component.html',
  styleUrls: ['./add-share-class-dialog.component.scss']
})
export class AddShareClassDialogComponent implements OnInit {
  navn: string = '';
  antallAksjer: number = 0;
  pålydende: number = 0; // Using Norwegian character
  innbetaltOverkurs: number = 0;
  formuesverdiPerAksje: number = 0;
  isdn: string = '';

  get parValue(): number {
    return this.pålydende;
  }

  set parValue(value: number) {
    this.pålydende = value;
  }

  constructor(
    public dialogRef: MatDialogRef<AddShareClassDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AddShareClassDialogData
  ) {}

  ngOnInit(): void {
    // Initialize dialog
  }

  onSave(): void {
    if (!this.navn.trim()) {
      alert('Aksjeklasse navn er påkrevd');
      return;
    }

    this.dialogRef.close({
      saved: true,
      navn: this.navn,
      antallAksjer: this.antallAksjer,
      pålydende: this.pålydende,
      innbetaltOverkurs: this.innbetaltOverkurs,
      formuesverdiPerAksje: this.formuesverdiPerAksje,
      isdn: this.isdn
    });
  }

  onCancel(): void {
    this.dialogRef.close({
      saved: false
    });
  }
}

