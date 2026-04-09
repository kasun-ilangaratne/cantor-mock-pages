import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { ShareholderTransactionsModalComponent } from '../shareholder-transactions-modal/shareholder-transactions-modal.component';

export interface BankAccount {
  valuta: string;
  bankkonto: string;
  iban: string;
  swift: string;
}

export interface ShareClassBalance {
  shareClassName: string;
  antallIB: number; // Editable
  andelIB: number; // Read-only, calculated
  antallUB: number; // Read-only, calculated
  andelUB: number; // Read-only, calculated
  selected: boolean;
}

export interface ShareholderModalData {
  shareholder: {
    id?: string;
    navn: string;
    personnrOrgNr: string;
    status: 'Aktiv' | 'Inaktiv';
    shareholderType: 'Selskap' | 'Personlig';
    adresse: string;
    postnummer: string;
    poststed: string;
    kommune: string;
    telefon: string;
    epost: string;
    landkode: string;
    bankAccounts: BankAccount[];
    shareClassBalances: ShareClassBalance[];
  } | null;
  isEdit: boolean;
  availableShareClasses: string[]; // From parent component
}

@Component({
  selector: 'app-shareholder-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatCheckboxModule
  ],
  templateUrl: './shareholder-modal.component.html',
  styleUrls: ['./shareholder-modal.component.scss']
})
export class ShareholderModalComponent implements OnInit {
  shareholderType: 'Selskap' | 'Personlig' = 'Selskap';
  personnrOrgNr: string = '';
  navn: string = '';
  adresse: string = '';
  postnummer: string = '';
  poststed: string = '';
  kommune: string = '';
  telefon: string = '';
  epost: string = '';
  landkode: string = 'NO';
  
  bankAccounts: BankAccount[] = [
    { valuta: '', bankkonto: '', iban: '', swift: '' },
    { valuta: '', bankkonto: '', iban: '', swift: '' },
    { valuta: '', bankkonto: '', iban: '', swift: '' }
  ];
  
  bankAccountsExpanded: boolean = true;
  
  shareClassBalances: ShareClassBalance[] = [];
  
  // Mock data for dropdowns
  kommuner: string[] = ['Oslo', 'Bergen', 'Trondheim', 'Stavanger', 'Bærum', 'Kristiansand'];
  landkoder: string[] = ['NO - Norge', 'LK - Sri Lanka', 'SE - Sverige', 'DK - Danmark', 'FI - Finland'];
  
  constructor(
    public dialogRef: MatDialogRef<ShareholderModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ShareholderModalData,
    private dialog: MatDialog
  ) {
    // Initialize share classes from available share classes
    const availableClasses = data.availableShareClasses || ['Ordinære', 'A', 'B'];
    this.shareClassBalances = availableClasses.map(className => ({
      shareClassName: className,
      antallIB: 0,
      andelIB: 0,
      antallUB: 0,
      andelUB: 0,
      selected: false
    }));
    
    if (data.shareholder) {
      this.shareholderType = data.shareholder.shareholderType || 'Selskap';
      this.personnrOrgNr = data.shareholder.personnrOrgNr || '';
      this.navn = data.shareholder.navn || '';
      this.adresse = data.shareholder.adresse || '';
      this.postnummer = data.shareholder.postnummer || '';
      this.poststed = data.shareholder.poststed || '';
      this.kommune = data.shareholder.kommune || '';
      this.telefon = data.shareholder.telefon || '';
      this.epost = data.shareholder.epost || '';
      this.landkode = data.shareholder.landkode || 'NO';
      
      if (data.shareholder.bankAccounts && data.shareholder.bankAccounts.length > 0) {
        this.bankAccounts = [...data.shareholder.bankAccounts];
        // Ensure exactly 3 accounts
        while (this.bankAccounts.length < 3) {
          this.bankAccounts.push({ valuta: '', bankkonto: '', iban: '', swift: '' });
        }
        this.bankAccounts = this.bankAccounts.slice(0, 3);
      }
      
      if (data.shareholder.shareClassBalances && data.shareholder.shareClassBalances.length > 0) {
        this.shareClassBalances = data.shareholder.shareClassBalances.map(balance => ({ ...balance }));
      }
    }
  }

  ngOnInit(): void {
    // Initialize
  }

  getDialogTitle(): string {
    return this.navn ? `Aksjonær – ${this.navn}` : 'Aksjonær – Navn på aksjonæren';
  }

  getBankAccountsCount(): number {
    return this.bankAccounts.filter(ba => ba.valuta || ba.bankkonto || ba.iban || ba.swift).length;
  }

  onLookupCompany(): void {
    // TODO: Implement company lookup
    alert('Company lookup functionality to be implemented');
  }

  onShareClassChange(shareClass: ShareClassBalance): void {
    // Recalculate totals when share class is changed
    this.calculateShareClassTotals();
  }

  calculateShareClassTotals(): void {
    // Calculate totals - this would normally come from backend
    // For now, we'll just update the selected share classes
    const totalIB = this.shareClassBalances
      .filter(sc => sc.selected)
      .reduce((sum, sc) => sum + sc.antallIB, 0);
    
    // Mock calculation - in real app, backend would provide these
    this.shareClassBalances.forEach(sc => {
      if (sc.selected && totalIB > 0) {
        sc.andelIB = (sc.antallIB / totalIB) * 100;
        sc.antallUB = sc.antallIB; // Mock: UB = IB for now
        sc.andelUB = sc.andelIB; // Mock: same percentage
      } else {
        sc.andelIB = 0;
        sc.antallUB = 0;
        sc.andelUB = 0;
      }
    });
  }

  getTotalRow(): ShareClassBalance {
    const selected = this.shareClassBalances.filter(sc => sc.selected);
    const totalIB = selected.reduce((sum, sc) => sum + sc.antallIB, 0);
    const totalUB = selected.reduce((sum, sc) => sum + sc.antallUB, 0);
    const totalAndelIB = selected.reduce((sum, sc) => sum + sc.andelIB, 0);
    const totalAndelUB = selected.reduce((sum, sc) => sum + sc.andelUB, 0);
    
    return {
      shareClassName: 'Total',
      antallIB: totalIB,
      andelIB: totalAndelIB,
      antallUB: totalUB,
      andelUB: totalAndelUB,
      selected: false
    };
  }

  onTransactions(): void {
    const transactionsDialogRef = this.dialog.open(ShareholderTransactionsModalComponent, {
      width: '1200px',
      maxWidth: '95vw',
      height: 'auto',
      maxHeight: '90vh',
      disableClose: false,
      hasBackdrop: true,
      backdropClass: 'dialog-backdrop',
      panelClass: 'shareholder-transactions-modal',
      autoFocus: true,
      data: {
        shareholderName: this.navn || 'Navn på aksjonæren',
        year: 2025,
        availableShareClasses: this.data.availableShareClasses || ['Ordinære', 'A', 'B'],
        selectedShareClasses: this.data.availableShareClasses || ['Ordinære', 'A']
      }
    });
  }

  onSave(): void {
    if (!this.navn.trim()) {
      alert('Navn er påkrevd');
      return;
    }

    this.dialogRef.close({
      saved: true,
      shareholderType: this.shareholderType,
      personnrOrgNr: this.personnrOrgNr,
      navn: this.navn,
      adresse: this.adresse,
      postnummer: this.postnummer,
      poststed: this.poststed,
      kommune: this.kommune,
      telefon: this.telefon,
      epost: this.epost,
      landkode: this.landkode,
      bankAccounts: this.bankAccounts,
      shareClassBalances: this.shareClassBalances
    });
  }

  onCancel(): void {
    this.dialogRef.close({
      saved: false
    });
  }
}
