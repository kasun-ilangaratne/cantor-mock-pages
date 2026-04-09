import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BankAccount } from '../shareholder-modal/shareholder-modal.component';

export interface BankAccountsDialogData {
  bankAccounts: BankAccount[];
}

@Component({
  selector: 'app-bank-accounts-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule
  ],
  templateUrl: './bank-accounts-dialog.component.html',
  styleUrls: ['./bank-accounts-dialog.component.scss']
})
export class BankAccountsDialogComponent implements OnInit {
  bankAccounts: BankAccount[] = [];

  constructor(
    public dialogRef: MatDialogRef<BankAccountsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: BankAccountsDialogData
  ) {
    // Create a copy of the bank accounts array
    this.bankAccounts = data.bankAccounts.map(account => ({ ...account }));
  }

  ngOnInit(): void {
    // Ensure we always have exactly 3 rows
    while (this.bankAccounts.length < 3) {
      this.bankAccounts.push({ valuta: '', bankkonto: '', iban: '', swift: '' });
    }
  }

  getBankAccountsCount(): number {
    return this.bankAccounts.filter(ba => 
      ba.valuta || ba.bankkonto || ba.iban || ba.swift
    ).length;
  }

  onSave(): void {
    this.dialogRef.close({
      saved: true,
      bankAccounts: this.bankAccounts
    });
  }

  onCancel(): void {
    this.dialogRef.close({
      saved: false
    });
  }
}
