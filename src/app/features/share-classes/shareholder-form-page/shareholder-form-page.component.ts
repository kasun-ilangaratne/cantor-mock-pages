import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BankAccountsDialogComponent } from '../bank-accounts-dialog/bank-accounts-dialog.component';
import { ShareholderTransactionsModalComponent, DividendPayment, Transaction } from '../shareholder-transactions-modal/shareholder-transactions-modal.component';
import { BankAccount, ShareClassBalance } from '../shareholder-modal/shareholder-modal.component';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';

export interface ShareholderOption {
  id: string;
  navn: string;
  personnrOrgNr: string;
  status: 'Aktiv' | 'Inaktiv';
}

@Component({
  selector: 'app-shareholder-form-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatCheckboxModule,
    MatSelectModule,
    MatChipsModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatFormFieldModule
  ],
  templateUrl: './shareholder-form-page.component.html',
  styleUrls: ['./shareholder-form-page.component.scss']
})
export class ShareholderFormPageComponent implements OnInit {
  shareholderId: string | null = null;
  isEdit: boolean = false;
  activeTab: 'basic' | 'transaksjoner' = 'basic';
  
  // Shareholder selector
  @ViewChild('trigger') autocompleteTrigger!: MatAutocompleteTrigger;
  allShareholders: ShareholderOption[] = [];
  filteredShareholders: ShareholderOption[] = [];
  selectedShareholder: ShareholderOption | null = null;
  shareholderSearchControl: string = '';
  
  shareholderType: 'Selskap' | 'Personlig' = 'Selskap';
  personnrOrgNr: string = '';
  navn: string = '';
  status: 'Aktiv' | 'Inaktiv' = 'Aktiv';
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
  
  availableShareClasses: string[] = ['Ordinære', 'A', 'B', 'C'];
  
  kommuner: string[] = ['Oslo', 'Bergen', 'Trondheim', 'Stavanger', 'Bærum'];
  landkoder: string[] = ['NO', 'SE', 'DK', 'FI', 'LK'];

  // Transaction-related properties
  year: number = 2025;
  selectedShareClass: string = 'Ordinære';
  selectedShareClasses: string[] = []; // Will be initialized with all available share classes
  
  // Balance summary
  incomingBalance: number = 15;
  changesBalance: number = 5;
  outgoingBalance: number = 20;
  
  // Utbytte og tilbakebetaling
  dividendPayments: DividendPayment[] = [
    {
      id: '1',
      aksjeklasse: 'Ordinære',
      type: 'Utbytte',
      transaksjonstype: '',
      dato: '2025-01-15',
      belop: 50000
    },
    {
      id: '2',
      aksjeklasse: 'A',
      type: 'Tilbakebetaling',
      transaksjonstype: 'Kjøp',
      dato: '2025-02-20',
      belop: 25000
    }
  ];
  
  showDividendAddOptions: boolean = false;
  
  // Transaksjoner
  transactions: Transaction[] = [
    // Post 23: Aksjer i tilgang
    {
      id: 't1',
      aksjeklasse: 'Ordinære',
      transaksjon: 'Kjøp',
      transaksjonstype: 'Kjøp',
      dato: '2025-03-01',
      antall: 100
    } as any,
    {
      id: 't2',
      aksjeklasse: 'A',
      transaksjon: 'Kjøp',
      transaksjonstype: 'Kjøp',
      dato: '2025-04-01',
      antall: 200
    } as any,
    // Post 24: Aksjer i tilgang ved omfordeling
    {
      id: 't3',
      aksjeklasse: 'Ordinære',
      transaksjon: 'Omfordeling',
      transaksjonstype: 'Kjøp',
      dato: '2025-05-10',
      antall: 50
    } as any,
    // Post 25: Aksjer i avgang
    {
      id: 't4',
      aksjeklasse: 'Ordinære',
      transaksjon: 'Salg',
      transaksjonstype: 'Salg',
      dato: '2025-03-15',
      antall: -50
    } as any,
    {
      id: 't5',
      aksjeklasse: 'Ordinære',
      transaksjon: 'Salg',
      transaksjonstype: 'Salg',
      dato: '2025-03-20',
      antall: -30
    } as any,
    // Post 26: Aksjer i avgang ved omfordeling
    {
      id: 't6',
      aksjeklasse: 'A',
      transaksjon: 'Omfordeling',
      transaksjonstype: 'Salg',
      dato: '2025-06-05',
      antall: -25
    } as any
  ];
  
  expandedParentIds: Set<string> = new Set();
  expandedTransactionGroups: Set<string> = new Set(); // For grouping by Transaksjon
  
  isDirty: boolean = false;

  // Posting types
  showTransactionAddOptions: boolean = false;
  selectedPostingType: string | null = null;
  postingTypes = [
    { id: '23', name: 'Aksjer i tilgang', shortName: 'Aksjer i tilgang' },
    { id: '24', name: 'Aksjer i tilgang ved omfordeling', shortName: 'Aksjer i tilgang ved omfordeling' },
    { id: '25', name: 'Aksjer i avgang', shortName: 'Aksjer i avgang' },
    { id: '26', name: 'Aksjer i avgang ved omfordeling', shortName: 'Aksjer i avgang ved omfordeling' },
    { id: '27', name: 'Tilbakebetalt innbetalt aksjekapital (totalt beløp) og utbetalt fondsemittert aksjekapital ved reduksjon av pålydende per aksje', shortName: 'Tilbakebetalt innbetalt aksjekapital' },
    { id: '28', name: 'Tilbakebetalt tidligere innbetalt overkurs for aksjene', shortName: 'Tilbakebetalt overkurs' },
    { id: '29', name: 'Forhøyelse av aksjekapital og overkurs ved økning av pålydende ved nyemisjon, fisjon og fusjon', shortName: 'Forhøyelse av aksjekapital/overkurs' },
    { id: '30', name: 'Aksjonærens andel av nedsettelse av aksjekapital if m reduksjon av pålydende ved fisjon', shortName: 'Andel nedsettelse av aksjekapital' }
  ];

  // Form data for new transaction
  newTransaction: any = {};
  editingTransactionId: string | null = null;

  // Dividend detail panel state
  selectedDividendType: string | null = null;
  newDividend: any = {};
  editingDividendId: string | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Load all shareholders for the dropdown first
    this.loadAllShareholders();
    // Initialize filtered list with all shareholders
    this.filteredShareholders = [...this.allShareholders];
    
    this.route.params.subscribe(params => {
      this.shareholderId = params['id'];
      this.isEdit = this.shareholderId !== 'new' && this.shareholderId !== null;
      
      if (this.isEdit && this.shareholderId) {
        // Load shareholder data (mock for now)
        this.loadShareholderData(this.shareholderId);
        // Set selected shareholder in dropdown - this will set the search control value
        this.updateSelectedShareholder();
      } else {
        // Initialize for new shareholder
        this.initializeShareClassBalances();
        this.selectedShareholder = null;
        this.shareholderSearchControl = '';
      }
    });
  }

  loadAllShareholders(): void {
    // Mock data - in real app, fetch from service
    // This should match the shareholders from ShareholdersComponent
    this.allShareholders = [
      {
        id: '1',
        navn: 'John Doe',
        personnrOrgNr: '12345678901',
        status: 'Aktiv'
      },
      {
        id: '2',
        navn: 'Jane Smith',
        personnrOrgNr: '98765432109',
        status: 'Aktiv'
      },
      {
        id: '3',
        navn: 'Inactive Corp',
        personnrOrgNr: '11122233344',
        status: 'Inaktiv'
      },
      {
        id: '4',
        navn: 'Sample Shareholder',
        personnrOrgNr: '123456789',
        status: 'Aktiv'
      }
    ];
  }

  updateSelectedShareholder(): void {
    if (this.shareholderId && this.shareholderId !== 'new') {
      this.selectedShareholder = this.allShareholders.find(sh => sh.id === this.shareholderId) || null;
      // Set the search control to show current shareholder name
      if (this.selectedShareholder) {
        this.shareholderSearchControl = this.selectedShareholder.navn;
      } else if (this.navn) {
        // Fallback to navn if shareholder not found in list
        this.shareholderSearchControl = this.navn;
      }
    }
  }

  onSearchFocus(): void {
    // Always show all shareholders when field is focused
    this.filteredShareholders = [...this.allShareholders];
    // Open the autocomplete panel
    this.cdr.detectChanges();
    setTimeout(() => {
      if (this.autocompleteTrigger && this.filteredShareholders.length > 0) {
        this.autocompleteTrigger.openPanel();
      }
    }, 150);
  }

  onSearchClick(): void {
    // Also handle click event to ensure panel opens
    this.filteredShareholders = [...this.allShareholders];
    this.cdr.detectChanges();
    setTimeout(() => {
      if (this.autocompleteTrigger && this.filteredShareholders.length > 0) {
        this.autocompleteTrigger.openPanel();
      }
    }, 150);
  }

  onShareholderSearchChange(searchValue: string): void {
    this.shareholderSearchControl = searchValue;
    
    if (!searchValue || searchValue.trim() === '') {
      // Show all shareholders when search is empty
      this.filteredShareholders = [...this.allShareholders];
    } else {
      const search = searchValue.toLowerCase().trim();
      this.filteredShareholders = this.allShareholders.filter(sh =>
        sh.navn.toLowerCase().includes(search) ||
        sh.personnrOrgNr.includes(search)
      );
    }
    
    // Ensure panel stays open while typing
    this.cdr.detectChanges();
    setTimeout(() => {
      if (this.autocompleteTrigger && this.filteredShareholders.length > 0) {
        this.autocompleteTrigger.openPanel();
      }
    }, 50);
  }

  onShareholderSelected(shareholder: ShareholderOption): void {
    if (shareholder && shareholder.id !== this.shareholderId) {
      // Navigate to the selected shareholder
      this.router.navigate(['/mock-share-classes/shareholders', shareholder.id]);
    }
  }

  displayShareholderFn(shareholder: ShareholderOption | null): string {
    return shareholder ? shareholder.navn : '';
  }

  loadShareholderData(id: string): void {
    // Find shareholder in the list first
    const shareholder = this.allShareholders.find(sh => sh.id === id);
    
    if (shareholder) {
      // Use data from the shareholder list
      this.navn = shareholder.navn;
      this.personnrOrgNr = shareholder.personnrOrgNr;
      this.status = shareholder.status;
    } else {
      // Fallback mock data - in real app, fetch from service
      this.navn = 'Sample Shareholder';
      this.personnrOrgNr = '123456789';
      this.status = 'Aktiv';
    }
    
    this.shareholderType = 'Selskap';
    this.adresse = 'Sample Address';
    this.postnummer = '0001';
    this.poststed = 'Oslo';
    this.kommune = 'Oslo';
    this.telefon = '12345678';
    this.epost = 'sample@example.com';
    this.landkode = 'NO';
    
    this.initializeShareClassBalances();
  }

  initializeShareClassBalances(): void {
    this.shareClassBalances = this.availableShareClasses.map(sc => ({
      shareClassName: sc,
      antallIB: 0,
      andelIB: 0,
      antallUB: 0,
      andelUB: 0,
      selected: false
    }));
    
    // Initialize selected share classes for transactions - all available by default
    if (this.selectedShareClasses.length === 0) {
      this.selectedShareClasses = [...this.availableShareClasses];
      this.selectedShareClass = this.availableShareClasses[0] || 'Ordinære';
    }

    // Initialize postingTypeId for mock transactions if not set
    this.transactions.forEach((t) => {
      const transactionAny = t as any;
      if (!transactionAny.postingTypeId) {
        // Assign postingTypeId based on transaction ID and type for demo purposes
        if (t.id === 't1' || t.id === 't2') {
          transactionAny.postingTypeId = '23'; // Aksjer i tilgang
        } else if (t.id === 't3') {
          transactionAny.postingTypeId = '24'; // Aksjer i tilgang ved omfordeling
        } else if (t.id === 't4' || t.id === 't5') {
          transactionAny.postingTypeId = '25'; // Aksjer i avgang
        } else if (t.id === 't6') {
          transactionAny.postingTypeId = '26'; // Aksjer i avgang ved omfordeling
        } else if (t.id === 't7') {
          transactionAny.postingTypeId = '27'; // Tilbakebetalt innbetalt aksjekapital
        } else if (t.id === 't8') {
          transactionAny.postingTypeId = '28'; // Tilbakebetalt overkurs
        } else if (t.id === 't9') {
          transactionAny.postingTypeId = '29'; // Forhøyelse av aksjekapital/overkurs
        } else if (t.id === 't10') {
          transactionAny.postingTypeId = '30'; // Andel nedsettelse av aksjekapital
        } else if (t.transaksjon === 'Kjøp') {
          transactionAny.postingTypeId = '23'; // Default for Kjøp
        } else if (t.transaksjon === 'Salg') {
          transactionAny.postingTypeId = '25'; // Default for Salg
        } else {
          transactionAny.postingTypeId = '23'; // Default
        }
      }
    });
  }

  getDialogTitle(): string {
    if (this.isEdit) {
      return `Aksjonær – ${this.navn || 'Ukjent'}`;
    }
    return 'Ny aksjonær';
  }

  getBankAccountsCount(): number {
    return this.bankAccounts.filter(ba => 
      ba.valuta || ba.bankkonto || ba.iban || ba.swift
    ).length;
  }

  getBankAccountsDisplayText(): string {
    const count = this.getBankAccountsCount();
    if (count === 0) {
      return '';
    }
    return `${count} bankkonto${count > 1 ? 'er' : ''} registrert`;
  }

  openBankAccountsDialog(): void {
    const dialogRef = this.dialog.open(BankAccountsDialogComponent, {
      width: '800px',
      maxWidth: '95vw',
      height: 'auto',
      maxHeight: '90vh',
      disableClose: false,
      hasBackdrop: true,
      backdropClass: 'dialog-backdrop',
      panelClass: 'bank-accounts-dialog',
      autoFocus: true,
      data: {
        bankAccounts: this.bankAccounts.map(account => ({ ...account }))
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result && result.saved) {
        this.bankAccounts = result.bankAccounts.map((account: BankAccount) => ({ ...account }));
        this.isDirty = true;
      }
    });
  }

  onShareClassCheckboxChange(balance: ShareClassBalance): void {
    if (!balance.selected) {
      balance.antallIB = 0;
      balance.andelIB = 0;
    }
    this.calculateShareClassTotals();
  }

  onAntallIBChange(balance: ShareClassBalance): void {
    this.calculateShareClassTotals();
  }

  calculateShareClassTotals(): void {
    const totalAntallIB = this.shareClassBalances
      .reduce((sum, sc) => sum + (sc.antallIB || 0), 0);
    
    this.shareClassBalances.forEach(sc => {
      if (totalAntallIB > 0) {
        sc.andelIB = (sc.antallIB / totalAntallIB) * 100;
      } else {
        sc.andelIB = 0;
      }
    });
  }

  onTransactions(): void {
    const dialogRef = this.dialog.open(ShareholderTransactionsModalComponent, {
      width: '1200px',
      maxWidth: '95vw',
      height: 'auto',
      maxHeight: '90vh',
      disableClose: false,
      hasBackdrop: true,
      backdropClass: 'dialog-backdrop',
      autoFocus: true,
      data: {
        shareholderName: this.navn || 'Ukjent aksjonær',
        availableShareClasses: this.availableShareClasses,
        selectedShareClasses: this.shareClassBalances
          .filter(sc => sc.selected)
          .map(sc => sc.shareClassName)
      }
    });
  }

  onLookupCompany(): void {
    // Implement company lookup logic
    console.log('Lookup company for:', this.personnrOrgNr);
  }

  onSave(): void {
    // Save logic here
    console.log('Saving shareholder:', {
      navn: this.navn,
      personnrOrgNr: this.personnrOrgNr,
      status: this.status,
      shareholderType: this.shareholderType,
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
    
    // Navigate back to shareholders list
    this.router.navigate(['/mock-share-classes/shareholders']);
  }

  onCancel(): void {
    // Navigate back to shareholders list
    this.router.navigate(['/mock-share-classes/shareholders']);
  }

  onBack(): void {
    this.router.navigate(['/mock-share-classes/shareholders']);
  }

  setActiveTab(tab: 'basic' | 'transaksjoner'): void {
    this.activeTab = tab;
  }

  getTotalRow(): ShareClassBalance {
    const totalIB = this.shareClassBalances.reduce((sum, sc) => sum + sc.antallIB, 0);
    const totalUB = this.shareClassBalances.reduce((sum, sc) => sum + sc.antallUB, 0);
    const totalAndelIB = this.shareClassBalances.reduce((sum, sc) => sum + sc.andelIB, 0);
    const totalAndelUB = this.shareClassBalances.reduce((sum, sc) => sum + sc.andelUB, 0);
    
    return {
      shareClassName: 'Total',
      antallIB: totalIB,
      andelIB: totalAndelIB,
      antallUB: totalUB,
      andelUB: totalAndelUB,
      selected: false
    };
  }

  // Transaction methods
  onShareClassFilterChange(): void {
    this.isDirty = true;
  }

  toggleShareClass(className: string): void {
    const index = this.selectedShareClasses.indexOf(className);
    if (index > -1) {
      this.selectedShareClasses.splice(index, 1);
    } else {
      this.selectedShareClasses.push(className);
    }
    this.isDirty = true;
  }

  removeShareClass(className: string): void {
    const index = this.selectedShareClasses.indexOf(className);
    if (index > -1) {
      this.selectedShareClasses.splice(index, 1);
    }
    this.isDirty = true;
  }

  openDividendDetailPanel(): void {
    // Open panel but don't select type yet - similar to transactions
    this.selectedDividendType = null;
    this.newDividend = { _open: true }; // Flag to indicate panel is open
    this.editingDividendId = null;
  }

  selectDividendType(dividendType: string | null): void {
    this.selectedDividendType = dividendType;
    if (dividendType) {
      // Only initialize if not editing (to preserve existing data when editing)
      if (!this.editingDividendId) {
        this.newDividend = {
          type: dividendType,
          aksjeklasse: this.selectedShareClass || this.availableShareClasses[0] || '',
          tidspunkt: new Date().toISOString().slice(0, 16),
          _open: true // Keep panel open
        };
        if (dividendType === 'Tilbakebetaling') {
          this.newDividend.transaksjonstype = 'Kjøp';
        }
      } else {
        // When editing, just update the type in newDividend
        this.newDividend.type = dividendType;
      }
    }
  }

  closeDividendDetailPanel(): void {
    this.selectedDividendType = null;
    this.newDividend = {};
    this.editingDividendId = null;
  }

  isDividendDetailPanelOpen(): boolean {
    return this.newDividend !== null && this.newDividend !== undefined && Object.keys(this.newDividend).length > 0;
  }

  saveNewDividend(): void {
    if (!this.selectedDividendType) {
      alert('Vennligst velg en type først');
      return;
    }

    // Remove internal flags before saving
    const { _open, ...dividendDataWithoutFlags } = this.newDividend;
    
    const dividendData: any = {
      id: this.editingDividendId || `div-${Date.now()}`,
      aksjeklasse: this.newDividend.aksjeklasse || this.selectedShareClass || this.availableShareClasses[0],
      type: this.selectedDividendType,
      ...dividendDataWithoutFlags
    };

    // Convert tidspunkt to dato format if needed
    if (dividendData.tidspunkt) {
      dividendData.dato = dividendData.tidspunkt.split('T')[0];
    }

    if (this.editingDividendId) {
      // Update existing dividend
      const index = this.dividendPayments.findIndex(d => d.id === this.editingDividendId);
      if (index > -1) {
        Object.assign(this.dividendPayments[index], dividendData);
      }
    } else {
      // Add new dividend
      const newDividend: DividendPayment = {
        ...dividendData,
        isEditing: false,
        isNew: false
      } as DividendPayment;
      this.dividendPayments.push(newDividend);
    }

    this.closeDividendDetailPanel();
    this.isDirty = true;
  }

  saveAndNextDividend(): void {
    // Save without closing the panel
    if (!this.selectedDividendType) {
      alert('Vennligst velg en type først');
      return;
    }

    // Remove internal flags before saving
    const { _open, ...dividendDataWithoutFlags } = this.newDividend;
    
    const dividendData: any = {
      id: this.editingDividendId || `div-${Date.now()}`,
      aksjeklasse: this.newDividend.aksjeklasse || this.selectedShareClass || this.availableShareClasses[0],
      type: this.selectedDividendType,
      ...dividendDataWithoutFlags
    };

    // Convert tidspunkt to dato format if needed
    if (dividendData.tidspunkt) {
      dividendData.dato = dividendData.tidspunkt.split('T')[0];
    }

    if (this.editingDividendId) {
      // Update existing dividend
      const index = this.dividendPayments.findIndex(d => d.id === this.editingDividendId);
      if (index > -1) {
        Object.assign(this.dividendPayments[index], dividendData);
      }
    } else {
      // Add new dividend
      const newDividend: DividendPayment = {
        ...dividendData,
        isEditing: false,
        isNew: false
      } as DividendPayment;
      this.dividendPayments.push(newDividend);
    }

    this.isDirty = true;

    // Reset for next entry, keeping the same type (don't close panel)
    if (this.selectedDividendType) {
      this.newDividend = {
        type: this.selectedDividendType,
        aksjeklasse: this.selectedShareClass || this.availableShareClasses[0] || '',
        tidspunkt: new Date().toISOString().slice(0, 16),
        _open: true // Keep panel open
      };
      if (this.selectedDividendType === 'Tilbakebetaling') {
        this.newDividend.transaksjonstype = 'Kjøp';
      }
      this.editingDividendId = null;
    }
  }

  editDividend(dividend: DividendPayment): void {
    this.editingDividendId = dividend.id;
    this.selectedDividendType = dividend.type;
    
    // Load dividend data into newDividend
    const dividendAny = dividend as any;
    this.newDividend = {
      ...dividendAny,
      tidspunkt: dividendAny.tidspunkt || (dividend.dato ? `${dividend.dato}T00:00:00` : new Date().toISOString().slice(0, 16)),
      aksjeklasse: dividend.aksjeklasse || this.selectedShareClass || this.availableShareClasses[0],
      _open: true // Keep panel open
    };
    
    // Ensure panel is open by ensuring newDividend has content
    if (Object.keys(this.newDividend).length === 0) {
      this.newDividend = { type: dividend.type, _open: true };
    }
    
    this.cdr.detectChanges();
    this.isDirty = true;
  }

  cancelEditDividend(dividend: DividendPayment): void {
    if (dividend.isNew) {
      const index = this.dividendPayments.indexOf(dividend);
      if (index > -1) {
        this.dividendPayments.splice(index, 1);
      }
    } else {
      dividend.isEditing = false;
    }
  }

  saveDividend(dividend: DividendPayment): void {
    dividend.isEditing = false;
    dividend.isNew = false;
    this.isDirty = true;
  }

  deleteDividend(dividend: DividendPayment): void {
    if (confirm('Er du sikker på at du vil slette denne raden?')) {
      const index = this.dividendPayments.indexOf(dividend);
      if (index > -1) {
        this.dividendPayments.splice(index, 1);
      }
      this.isDirty = true;
    }
  }

  showTransactionAddMenu(): void {
    // Open detail panel directly
    this.selectedPostingType = null; // Start with no type selected
    this.initializeNewTransaction(null);
  }

  selectPostingType(postingTypeId: string | null): void {
    this.selectedPostingType = postingTypeId;
    // Only initialize if not editing (to preserve existing data when editing)
    if (!this.editingTransactionId) {
      this.initializeNewTransaction(postingTypeId);
    } else {
      // When editing, just update the postingTypeId in newTransaction
      if (this.newTransaction) {
        this.newTransaction.postingTypeId = postingTypeId;
      }
    }
  }

  initializeNewTransaction(postingTypeId: string | null): void {
    // Only initialize if not editing (to preserve existing data when editing)
    if (!this.editingTransactionId) {
      this.newTransaction = {
        postingTypeId: postingTypeId || null,
        antall: '',
        type: '',
        tidspunkt: new Date().toISOString().split('T')[0] + ' 00:00',
        // Post 23 fields
        motpart: '',
        giversFnr: '',
        giversOrgNr: '',
        aksjenrFra: '',
        aksjenrTil: '',
        anskaffelsesverdi: '',
        // Post 24 fields
        overdSelskapOrgNr: '',
        isinOverdSelsk: '',
        aksjeklasseOverdSelsk: '',
        overdPalyende: '',
        // Post 25 fields
        kommentarMotpart: '',
        vederlagTotalt: '',
        mottakersFnr: '',
        mottakersOrgNr: '',
        // Post 26 fields
        overtakeneSelskapsOrgNr: '',
        isinOvertSelsk: '',
        aksjeklasseOvertSelsk: '',
        palyende: '',
        // Post 27 fields
        tilbakebetaltBelop: '',
        // Post 28 fields
        tilbakebetaltOverkurs: '',
        // Post 29 fields
        forhoyelseAvAK: '',
        okningPalPrAksje: '',
        forhoyelseAvOverkurs: '',
        // Post 30 fields
        reduksjonAvAK: ''
      };
    }
  }

  closeTransactionDetailPanel(): void {
    this.selectedPostingType = null;
    this.newTransaction = {};
    this.editingTransactionId = null;
    this.showTransactionAddOptions = false;
  }

  saveNewTransaction(): void {
    const transactionData: any = {
      aksjeklasse: this.selectedShareClass,
      transaksjon: this.newTransaction.type || 'Kjøp',
      transaksjonstype: this.newTransaction.type || 'Kjøp',
      dato: this.newTransaction.tidspunkt?.split(' ')[0] || new Date().toISOString().split('T')[0],
      antall: parseInt(this.newTransaction.antall) || 0,
      isEditing: false,
      isNew: false,
      postingTypeId: this.selectedPostingType,
      ...this.newTransaction
    };

    if (this.editingTransactionId) {
      // Update existing transaction
      const index = this.transactions.findIndex(t => t.id === this.editingTransactionId);
      if (index > -1) {
        this.transactions[index] = {
          ...this.transactions[index],
          ...transactionData,
          id: this.editingTransactionId // Keep the original ID
        };
      }
      this.editingTransactionId = null;
    } else {
      // Create new transaction
      const transaction: Transaction = {
        id: `trans-${Date.now()}`,
        ...transactionData
      };
      this.transactions.push(transaction);
    }
    
    this.isDirty = true;
    this.closeTransactionDetailPanel();
  }

  saveAndNextTransaction(): void {
    // Save the current transaction
    this.saveNewTransaction();
    
    // Immediately open the form for the next transaction
    // Keep the same posting type if one was selected, otherwise reset
    const currentPostingType = this.selectedPostingType;
    this.showTransactionAddMenu();
    
    // If there was a posting type selected, restore it
    if (currentPostingType) {
      this.selectedPostingType = currentPostingType;
      this.initializeNewTransaction(currentPostingType);
    }
  }

  addTransaction(): void {
    // This method is kept for backward compatibility but now opens the menu
    this.showTransactionAddMenu();
  }

  toggleExpand(transaction: Transaction): void {
    if (this.isParent(transaction)) {
      if (this.expandedParentIds.has(transaction.id)) {
        this.expandedParentIds.delete(transaction.id);
      } else {
        this.expandedParentIds.clear();
        this.expandedParentIds.add(transaction.id);
      }
    }
  }

  isParent(transaction: Transaction): boolean {
    return this.transactions.some(t => t.parentId === transaction.id);
  }

  isExpanded(transaction: Transaction): boolean {
    return this.expandedParentIds.has(transaction.id);
  }

  getChildTransactions(parentId: string): Transaction[] {
    return this.transactions.filter(t => t.parentId === parentId);
  }

  getParentTransactions(): Transaction[] {
    return this.transactions.filter(t => !t.parentId && this.isShareClassVisible(t.aksjeklasse));
  }

  // Get posting type description from postingTypeId
  getPostingTypeDescription(postingTypeId: string | null | undefined): string {
    if (!postingTypeId) return 'Ukjent';
    const postingType = this.postingTypes.find(pt => pt.id === postingTypeId);
    return postingType ? postingType.shortName : 'Ukjent';
  }

  // Group transactions by Posting Type (postingTypeId)
  getTransactionGroups(): { postingTypeId: string; postingTypeDescription: string; transactions: Transaction[]; totalAntall: number }[] {
    const visibleTransactions = this.transactions.filter(t => this.isShareClassVisible(t.aksjeklasse));
    const grouped = new Map<string, Transaction[]>();
    
    visibleTransactions.forEach(t => {
      const transactionAny = t as any;
      const postingTypeId = transactionAny.postingTypeId || '23'; // Default to post 23 if not set
      if (!grouped.has(postingTypeId)) {
        grouped.set(postingTypeId, []);
      }
      grouped.get(postingTypeId)!.push(t);
    });
    
    return Array.from(grouped.entries()).map(([postingTypeId, transactions]) => ({
      postingTypeId,
      postingTypeDescription: this.getPostingTypeDescription(postingTypeId),
      transactions,
      totalAntall: transactions.reduce((sum, t) => sum + (t.antall || 0), 0)
    }));
  }

  isTransactionGroupExpanded(postingTypeId: string): boolean {
    return this.expandedTransactionGroups.has(postingTypeId);
  }

  toggleTransactionGroup(postingTypeId: string): void {
    if (this.expandedTransactionGroups.has(postingTypeId)) {
      this.expandedTransactionGroups.delete(postingTypeId);
    } else {
      this.expandedTransactionGroups.add(postingTypeId);
    }
  }

  hasExpandedGroups(): boolean {
    return this.expandedTransactionGroups.size > 0 || 
           this.getTransactionGroups().some((g) => g.transactions.length === 1);
  }

  isShareClassVisible(className: string): boolean {
    return this.selectedShareClasses.includes(className);
  }

  isShareClassSelected(className: string): boolean {
    return this.selectedShareClasses.includes(className);
  }

  selectTransaction(transaction: Transaction, event?: Event): void {
    // Prevent row click when clicking on buttons or inputs
    if (event) {
      const target = event.target as HTMLElement;
      if (target.closest('button') || target.closest('input') || target.closest('select')) {
        return;
      }
    }

    // If detail panel is not open, open it first
    if (!this.isTransactionDetailPanelOpen()) {
      // Open the detail panel by setting a posting type (use default or from transaction)
      const transactionAny = transaction as any;
      this.selectedPostingType = transactionAny.postingTypeId || '23';
      this.selectedShareClass = transaction.aksjeklasse || 'Ordinære';
      // Initialize newTransaction object to open the panel
      this.newTransaction = {
        postingTypeId: this.selectedPostingType
      };
    }

    // Load transaction data into the detail panel
    this.editTransaction(transaction);
  }

  editTransaction(transaction: Transaction): void {
    // Load transaction data into the detail panel
    this.editingTransactionId = transaction.id;
    const transactionAny = transaction as any;
    
    // Set the selected share class for the form
    this.selectedShareClass = transaction.aksjeklasse || 'Ordinære';
    
    // CRITICAL: Set the posting type FIRST from the saved transaction
    // This determines which form fields will be displayed
    this.selectedPostingType = transactionAny.postingTypeId || null;
    
    // If no posting type is stored, we need to determine it or default to '23'
    // But ideally, transactions should always have a postingTypeId when saved
    if (!this.selectedPostingType) {
      // Default to post 23 if not set (for backward compatibility)
      this.selectedPostingType = '23';
    }
    
    // Populate newTransaction with ALL saved transaction data
    // Read all fields that were saved (including posting-type-specific fields)
    this.newTransaction = {
      // Core fields
      postingTypeId: this.selectedPostingType,
      antall: transaction.antall?.toString() || '',
      type: transactionAny.type || transaction.transaksjonstype || transaction.transaksjon || '',
      tidspunkt: transaction.dato ? `${transaction.dato} 00:00` : new Date().toISOString().split('T')[0] + ' 00:00',
      
      // Post 23 fields (Aksjer i tilgang)
      motpart: transactionAny.motpart || '',
      giversFnr: transactionAny.giversFnr || '',
      giversOrgNr: transactionAny.giversOrgNr || '',
      aksjenrFra: transactionAny.aksjenrFra || '',
      aksjenrTil: transactionAny.aksjenrTil || '',
      anskaffelsesverdi: transactionAny.anskaffelsesverdi || '',
      
      // Post 24 fields (Aksjer i tilgang ved omfordeling)
      overdSelskapOrgNr: transactionAny.overdSelskapOrgNr || '',
      isinOverdSelsk: transactionAny.isinOverdSelsk || '',
      aksjeklasseOverdSelsk: transactionAny.aksjeklasseOverdSelsk || '',
      overdPalyende: transactionAny.overdPalyende || '',
      
      // Post 25 fields (Aksjer i avgang)
      kommentarMotpart: transactionAny.kommentarMotpart || '',
      vederlagTotalt: transactionAny.vederlagTotalt || '',
      mottakersFnr: transactionAny.mottakersFnr || '',
      mottakersOrgNr: transactionAny.mottakersOrgNr || '',
      
      // Post 26 fields (Aksjer i avgang ved omfordeling)
      overtakeneSelskapsOrgNr: transactionAny.overtakeneSelskapsOrgNr || '',
      isinOvertSelsk: transactionAny.isinOvertSelsk || '',
      aksjeklasseOvertSelsk: transactionAny.aksjeklasseOvertSelsk || '',
      palyende: transactionAny.palyende || '',
      
      // Post 27 fields (Tilbakebetalt innbetalt aksjekapital)
      tilbakebetaltBelop: transactionAny.tilbakebetaltBelop || '',
      
      // Post 28 fields (Tilbakebetalt overkurs)
      tilbakebetaltOverkurs: transactionAny.tilbakebetaltOverkurs || '',
      
      // Post 29 fields (Forhøyelse av aksjekapital/overkurs)
      forhoyelseAvAK: transactionAny.forhoyelseAvAK || '',
      okningPalPrAksje: transactionAny.okningPalPrAksje || '',
      forhoyelseAvOverkurs: transactionAny.forhoyelseAvOverkurs || '',
      
      // Post 30 fields (Andel nedsettelse av aksjekapital)
      reduksjonAvAK: transactionAny.reduksjonAvAK || ''
    };
    
    // Debug: log to verify data is loaded
    console.log('=== Editing Transaction ===');
    console.log('Transaction object:', transaction);
    console.log('Transaction postingTypeId:', transactionAny.postingTypeId);
    console.log('Selected posting type:', this.selectedPostingType);
    console.log('Selected share class:', this.selectedShareClass);
    console.log('Loaded newTransaction:', this.newTransaction);
    console.log('isTransactionDetailPanelOpen:', this.isTransactionDetailPanelOpen());
    
    // Force change detection to ensure the panel opens and displays correctly
    this.cdr.detectChanges();
    
    this.isDirty = true;
  }

  cancelEditTransaction(transaction: Transaction): void {
    if (transaction.isNew) {
      const index = this.transactions.indexOf(transaction);
      if (index > -1) {
        this.transactions.splice(index, 1);
      }
    } else {
      transaction.isEditing = false;
    }
  }

  saveTransaction(transaction: Transaction): void {
    transaction.isEditing = false;
    transaction.isNew = false;
    this.isDirty = true;
  }

  deleteTransaction(transaction: Transaction): void {
    if (confirm('Er du sikker på at du vil slette denne raden?')) {
      const children = this.transactions.filter(t => t.parentId === transaction.id);
      children.forEach(child => {
        const index = this.transactions.indexOf(child);
        if (index > -1) {
          this.transactions.splice(index, 1);
        }
      });
      
      const index = this.transactions.indexOf(transaction);
      if (index > -1) {
        this.transactions.splice(index, 1);
      }
      this.isDirty = true;
    }
  }

  getTransactionSum(): number {
    return this.getParentTransactions()
      .reduce((sum, parent) => {
        let total = parent.antall;
        if (this.expandedParentIds.has(parent.id)) {
          const children = this.getChildTransactions(parent.id);
          total += children.reduce((childSum, child) => childSum + child.antall, 0);
        }
        return sum + total;
      }, 0);
  }

  formatNumber(value: number): string {
    if (value === 0) return '0';
    const sign = value > 0 ? '+' : '';
    return `${sign}${value}`;
  }

  getSelectedPostingTypeName(): string {
    if (!this.selectedPostingType) return '';
    const postingType = this.postingTypes.find(pt => pt.id === this.selectedPostingType);
    return postingType ? postingType.shortName : '';
  }

  isTransactionDetailPanelOpen(): boolean {
    return this.newTransaction !== null && Object.keys(this.newTransaction).length > 0;
  }
}
