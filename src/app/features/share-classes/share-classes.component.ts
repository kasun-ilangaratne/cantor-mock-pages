import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { AddShareClassDialogComponent } from './add-share-class-dialog/add-share-class-dialog.component';
import { RiskDetailsDialogComponent } from './risk-details-dialog/risk-details-dialog.component';
import { ShareClassesSelectionDialogComponent } from './share-classes-selection-dialog/share-classes-selection-dialog.component';

export interface ShareClass {
  id: string;
  navn: string;
  antallAksjer: number;
  pålydende: number;
  aksjekapital: number; // Calculated: antallAksjer × pålydende
  innbetaltOverkurs: number;
  innbetaltAksjekapital: number; // Calculated: aksjekapital + innbetaltOverkurs
  formuesverdiPerAksje: number;
  isdn: string;
  totaltUtbytteUtdelt: number; // Read-only
  utbytteUtdeltPerAksje: number; // Calculated: totaltUtbytteUtdelt / antallAksjer
}

export interface InngåendeBalanse {
  antallAksjer: number;
  pålydende: number;
  aksjekapital: number;
  innbetaltOverkurs: number;
  innbetaltAksjekapital: number;
  formuesverdiPerAksje: number;
}

export interface AggregateFields {
  antallEgneAksjerUtgåendeBalanse: number;
  totaltUtbytteAvsatt: number;
  riskBeløpPerAksje: number; // Read-only, calculated
}

export interface RiskEntry {
  id: string;
  år: number;
  riskBeløp: number;
}

@Component({
  selector: 'app-share-classes',
  templateUrl: './share-classes.component.html',
  styleUrls: ['./share-classes.component.scss']
})
export class ShareClassesComponent implements OnInit {
  // Header data
  company: string = 'Shiba Group AS';
  year: number = 2025;
  month: number = 11;

  // Year and month options for dropdowns
  years: number[] = [2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030];
  months: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  monthNames: string[] = ['Januar', 'Februar', 'Mars', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Desember'];

  // Demo mode: 'single' or 'multiple'
  demoMode: 'single' | 'multiple' = 'multiple';

  // Share classes table data - will be populated based on demo mode
  shareClasses: ShareClass[] = [];

  // All available share classes data
  private allShareClassesData: ShareClass[] = [
    {
      id: '1',
      navn: 'A-aksjer',
      antallAksjer: 1000000,
      pålydende: 1,
      aksjekapital: 1000000,
      innbetaltOverkurs: 500000,
      innbetaltAksjekapital: 1500000,
      formuesverdiPerAksje: 1.5,
      isdn: 'NO123456789',
      totaltUtbytteUtdelt: 200000,
      utbytteUtdeltPerAksje: 0.2
    },
    {
      id: '2',
      navn: 'B-aksjer',
      antallAksjer: 500000,
      pålydende: 1,
      aksjekapital: 500000,
      innbetaltOverkurs: 250000,
      innbetaltAksjekapital: 750000,
      formuesverdiPerAksje: 1.5,
      isdn: 'NO987654321',
      totaltUtbytteUtdelt: 100000,
      utbytteUtdeltPerAksje: 0.2
    }
  ];

  selectedShareClass: ShareClass | null = null;
  isDirty: boolean = false;
  isAddMode: boolean = false; // Track if we're adding a new record
  activeSubTab: string | null = null; // Track which sub-tab is active
  shareClassesDialogRef: any = null; // Track open dialog to prevent multiple instances
  
  // All available share classes
  allAvailableShareClasses: string[] = ['Ordinære', 'A', 'B', 'C', 'D', 'Preference', 'Extraordinary', 'E', 'F', 'G', 'H', 'I', 'J'];
  // Selected (ticked) share classes from the selection dialog
  selectedShareClasses: string[] = ['Ordinære', 'A', 'B']; // Default selected classes
  selectedShareClassName: string = ''; // Selected share class name from dropdown

  // Inngående balanse (read-only, from backend)
  inngåendeBalanse: InngåendeBalanse = {
    antallAksjer: 1500000,
    pålydende: 1,
    aksjekapital: 1500000,
    innbetaltOverkurs: 750000,
    innbetaltAksjekapital: 2250000,
    formuesverdiPerAksje: 1.5
  };

  // Aggregate fields (Alle aksjeklasser)
  aggregateFields: AggregateFields = {
    antallEgneAksjerUtgåendeBalanse: 0,
    totaltUtbytteAvsatt: 300000,
    riskBeløpPerAksje: 0
  };

  // RISK entries
  riskEntries: RiskEntry[] = [
    { id: '1', år: 2023, riskBeløp: 500000 },
    { id: '2', år: 2024, riskBeløp: 600000 }
  ];

  // Company Transactions
  companyTransactions: any[] = [
    {
      id: 'ct1',
      postingTypeId: '9',
      hendelsestype: 'Nyemisjon',
      antallNyutstedteAksjer: 1000,
      palyendePerAksje: 10.50,
      innbetaltOverkursPerAksje: 2.50,
      antallAksjerEtter: 5000,
      antallEgneAksjerOverfort: 0,
      tidspunkt: '2025-08-01T00:00:00'
    },
    {
      id: 'ct2',
      postingTypeId: '9',
      hendelsestype: 'Fondsemisjon',
      antallNyutstedteAksjer: 500,
      palyendePerAksje: 10.00,
      innbetaltOverkursPerAksje: 1.50,
      antallAksjerEtter: 5500,
      antallEgneAksjerOverfort: 0,
      tidspunkt: '2025-11-15T00:00:00'
    },
    {
      id: 'ct3',
      postingTypeId: '10',
      hendelsestype: 'Fondsemisjon',
      antallNyutstedteAksjer: 2000,
      palyendePerUtstedtAksje: 10.00,
      antallEgneAksjerOverfort: 100,
      antallAksjerEtter: 7500,
      palyendePerInnlostAksje: 10.00,
      overdSelskapsOrgNr: '123456789',
      isinAksjeklasse: 'NO0012345678',
      antallInnlosteAksjer: 50,
      overtSelskapsOrgNr: '987654321',
      tidspunkt: '2025-09-10T00:00:00'
    },
    {
      id: 'ct4',
      postingTypeId: '11',
      hendelsestype: 'Likvidasjon',
      palyendePerAksje: 10.00,
      antallSlettedeAksjer: 500,
      gjennomsnittligInnbetaltOverkursPerSlettetAksje: 2.00,
      antallAksjerEtter: 7000,
      totaltVederlagUtbetaltAvInnbetaltKapital: 6000,
      tidspunkt: '2025-10-05T00:00:00'
    },
    {
      id: 'ct5',
      postingTypeId: '13',
      nedsettelseAvInnbOverkurs: 50000,
      tidspunkt: '2025-07-20T00:00:00'
    },
    {
      id: 'ct6',
      postingTypeId: '15',
      hendelsestype: 'Fusjon',
      forhoyelseAvAksjekapital: 100000,
      okningPalyendePerAksje: 5.00,
      palyendePerAksjeEtter: 15.00,
      forhoyelseAvOverkurs: 50000,
      overdSelskapsOrgNr: '111222333',
      isinAksjeklasse: 'NO0011112222',
      tidspunkt: '2025-06-15T00:00:00'
    }
  ];
  expandedTransactionGroups: Set<string> = new Set();
  selectedPostingType: string | null = null;
  newTransaction: any = {};
  editingTransactionId: string | null = null;
  
  // Company posting types (9-18)
  companyPostingTypes = [
    { id: '9', name: 'Nyutstedte aksjer', shortName: 'Nyutstedte aksjer' },
    { id: '10', name: 'Ny utstedte aksjer (omfordeling)', shortName: 'Ny utstedte aksjer (omfordeling)' },
    { id: '11', name: 'Sletting av aksjer (avgang)', shortName: 'Sletting av aksjer (avgang)' },
    { id: '12', name: 'Sletting av aksjer (omfordeling)', shortName: 'Sletting av aksjer (omfordeling)' },
    { id: '13', name: 'Nedsetting av innbetalt overkurs med tilbakebetaling til aksjonærene i løpet av inntektsåret', shortName: 'Tilbakebetalt overkurs' },
    { id: '14', name: 'Forhøyelse av aksjekapital ved økning av pålydende per aksje if m fondsemisjon', shortName: 'Forhøyelse av aksjekapital ved økning av pålydende per aksje if m fondsemisjon' },
    { id: '15', name: 'Forhøyelse av aksjekapital og overkurs ved økning av pålydende ved nyemisjon, fisjon og fusjon', shortName: 'Forhøyelse av aksjekapital/overkurs' },
    { id: '16', name: 'Nedsettelse av aksjekapital ved reduksjon av pålydende per aksje til dekning av tap og overføring til fond', shortName: 'Nedsettelse av aksjekapital ved reduksjon av pålydende per aksje til dekning av tap og overføring til fond' },
    { id: '17', name: 'Nedsettelse av aksjekapital ved reduksjon av pålydende per aksje med utbet til aksjonærene', shortName: 'Tilbakebetalt innbetalt aksjekapital' },
    { id: '18', name: 'Nedsettelse av aksjekapital ved reduksjon av pålydende per aksje ved skattefri utfisjonering (omfordeling)', shortName: 'Nedsettelse av aksjekapital ved reduksjon av pålydende per aksje ved skattefri utfisjonering (omfordeling)' }
  ];

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.updateShareClassesBasedOnDemoMode();
    this.calculateAggregateFields();
    
    // Automatically select and display the first share class
    if (this.shareClasses && this.shareClasses.length > 0) {
      // Select the first share class to display its details
      this.selectedShareClass = { ...this.shareClasses[0] };
      this.isAddMode = false;
      this.isDirty = false;
    }
  }

  // Update share classes based on demo mode
  updateShareClassesBasedOnDemoMode(): void {
    if (this.demoMode === 'single') {
      // Show only the first share class
      this.shareClasses = [this.allShareClassesData[0]];
    } else {
      // Show all share classes
      this.shareClasses = [...this.allShareClassesData];
    }
    
    // Reset selection when switching modes
    if (this.shareClasses.length > 0) {
      this.selectedShareClass = { ...this.shareClasses[0] };
      this.isAddMode = false;
      this.isDirty = false;
    } else {
      this.selectedShareClass = null;
    }
  }

  // Toggle demo mode
  toggleDemoMode(): void {
    this.demoMode = this.demoMode === 'single' ? 'multiple' : 'single';
    this.updateShareClassesBasedOnDemoMode();
    this.calculateAggregateFields();
  }

  // Check if there's only one share class
  get hasSingleShareClass(): boolean {
    return this.shareClasses && this.shareClasses.length === 1;
  }

  // Check if we should show the table (only when multiple share classes)
  get shouldShowTable(): boolean {
    return this.shareClasses && this.shareClasses.length > 1;
  }

  formatNumber(value: number): string {
    return new Intl.NumberFormat('no-NO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value).replace(/,/g, ' ');
  }

  formatDecimal(value: number): string {
    return new Intl.NumberFormat('no-NO', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value).replace(/,/g, ' ');
  }

  formatCalculatedField(value: number): string {
    // In add mode, show empty if value is 0 (user hasn't entered inputs yet)
    if (this.isAddMode && value === 0) {
      return '';
    }
    return this.formatNumber(value);
  }

  formatCalculatedDecimal(value: number): string {
    // In add mode, show empty if value is 0 (user hasn't entered inputs yet)
    if (this.isAddMode && value === 0) {
      return '';
    }
    return this.formatDecimal(value);
  }

  selectShareClass(shareClass: ShareClass): void {
    if (this.isDirty && this.selectedShareClass) {
      if (!confirm('Du har ikke lagrede endringer. Vil du fortsette?')) {
        return;
      }
    }
    this.selectedShareClass = { ...shareClass };
    this.isAddMode = false;
    this.isDirty = false;
  }

  closeDetailPanel(): void {
    if (this.isDirty && this.selectedShareClass) {
      if (!confirm('Du har ikke lagrede endringer. Vil du fortsette?')) {
        return;
      }
    }
    this.selectedShareClass = null;
    this.isAddMode = false;
    this.selectedShareClassName = '';
    this.isDirty = false;
  }

  saveDetailChanges(): void {
    if (!this.selectedShareClass) return;
    
    if (this.isAddMode) {
      // Add new record
      if (!this.selectedShareClass.navn || !this.selectedShareClass.navn.trim()) {
        alert('Aksjeklasse navn er påkrevd');
        return;
      }
      
      // Check if share class name already exists
      const exists = this.shareClasses.some(sc => sc.navn === this.selectedShareClass!.navn);
      if (exists) {
        alert('Denne aksjeklassen finnes allerede');
        return;
      }
      
      // Calculate fields
      this.selectedShareClass.aksjekapital = this.selectedShareClass.antallAksjer * this.selectedShareClass['pålydende'];
      this.selectedShareClass['innbetaltAksjekapital'] = this.selectedShareClass.aksjekapital + this.selectedShareClass['innbetaltOverkurs'];
      this.selectedShareClass.utbytteUtdeltPerAksje = this.calculateUtbyttePerAksje(this.selectedShareClass);
      
      // Generate new ID
      this.selectedShareClass.id = `sc-${Date.now()}`;
      
      // Add to list
      this.shareClasses.push({ ...this.selectedShareClass });
      this.calculateAggregateFields();
      this.isAddMode = false;
      this.selectedShareClassName = '';
      this.isDirty = false;
      alert('Ny aksjeklasse lagret');
    } else {
      // Update existing record
      const index = this.shareClasses.findIndex(sc => sc.id === this.selectedShareClass!.id);
      if (index !== -1) {
        // Update calculated fields
        this.selectedShareClass.aksjekapital = this.selectedShareClass.antallAksjer * this.selectedShareClass['pålydende'];
        this.selectedShareClass['innbetaltAksjekapital'] = this.selectedShareClass.aksjekapital + this.selectedShareClass['innbetaltOverkurs'];
        this.selectedShareClass.utbytteUtdeltPerAksje = this.calculateUtbyttePerAksje(this.selectedShareClass);
        
        this.shareClasses[index] = { ...this.selectedShareClass };
        this.isDirty = false;
        alert('Endringer lagret');
      }
    }
  }

  calculateAksjekapital(shareClass: ShareClass): number {
    return shareClass.antallAksjer * shareClass.pålydende;
  }

  calculateInnbetaltAksjekapital(shareClass: ShareClass): number {
    return shareClass.aksjekapital + shareClass.innbetaltOverkurs;
  }

  calculateUtbyttePerAksje(shareClass: ShareClass): number {
    if (shareClass.antallAksjer === 0) return 0;
    return shareClass.totaltUtbytteUtdelt / shareClass.antallAksjer;
  }

  onFieldChange(): void {
    if (this.selectedShareClass) {
      // Recalculate dependent fields
      this.selectedShareClass.aksjekapital = this.calculateAksjekapital(this.selectedShareClass);
      this.selectedShareClass.innbetaltAksjekapital = this.calculateInnbetaltAksjekapital(this.selectedShareClass);
      this.selectedShareClass.utbytteUtdeltPerAksje = this.calculateUtbyttePerAksje(this.selectedShareClass);
      
      // Update the share class in the array only if not in add mode
      if (!this.isAddMode) {
        const index = this.shareClasses.findIndex(sc => sc.id === this.selectedShareClass!.id);
        if (index !== -1) {
          this.shareClasses[index] = { ...this.selectedShareClass };
        }
      }
      
      this.isDirty = true;
      if (!this.isAddMode) {
        this.calculateAggregateFields();
      }
    }
  }

  calculateAggregateFields(): void {
    // Calculate RISK per aksje (sum of all RISK entries / total shares)
    const totalRisk = this.riskEntries.reduce((sum, entry) => sum + entry.riskBeløp, 0);
    const totalShares = this.shareClasses.reduce((sum, sc) => sum + sc.antallAksjer, 0);
    this.aggregateFields.riskBeløpPerAksje = totalShares > 0 ? totalRisk / totalShares : 0;
  }

  openAddShareClassDialog(): void {
    if (this.isDirty && this.selectedShareClass) {
      if (!confirm('Du har ikke lagrede endringer. Vil du fortsette?')) {
        return;
      }
    }
    
    // Open detail panel in add mode
    this.isAddMode = true;
    this.selectedShareClassName = '';
    this.selectedShareClass = {
      id: '', // Will be generated on save
      navn: '',
      antallAksjer: 0,
      pålydende: 0,
      aksjekapital: 0, // Will be calculated when user enters values
      innbetaltOverkurs: 0,
      innbetaltAksjekapital: 0, // Will be calculated when user enters values
      formuesverdiPerAksje: 0,
      isdn: '',
      totaltUtbytteUtdelt: 0,
      utbytteUtdeltPerAksje: 0
    };
    this.isDirty = false;
  }
  
  onShareClassNameSelected(): void {
    if (this.selectedShareClassName && this.selectedShareClass) {
      this.selectedShareClass.navn = this.selectedShareClassName;
      this.isDirty = true;
    }
  }
  
  getAvailableShareClassesForDropdown(): string[] {
    // Return only ticked/selected share classes that are not already in the list
    const existingNames = this.shareClasses.map(sc => sc.navn);
    return this.selectedShareClasses.filter(name => !existingNames.includes(name));
  }

  openRiskDetailsDialog(): void {
    const dialogRef = this.dialog.open(RiskDetailsDialogComponent, {
      width: '500px',
      maxWidth: '90vw',
      disableClose: false,
      hasBackdrop: true,
      backdropClass: 'dialog-backdrop',
      panelClass: 'risk-details-dialog',
      autoFocus: true,
      data: { riskEntries: [...this.riskEntries] }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result && result.saved) {
        this.riskEntries = result.riskEntries;
        this.calculateAggregateFields();
      }
    });
  }

  openShareClassesSelectionDialog(): void {
    // Prevent opening multiple dialogs
    if (this.shareClassesDialogRef) {
      return;
    }

    // Set active state
    this.activeSubTab = 'aksjeklasser';

    const dialogRef = this.dialog.open(ShareClassesSelectionDialogComponent, {
      width: '500px',
      maxWidth: '90vw',
      disableClose: false,
      hasBackdrop: true,
      backdropClass: 'dialog-backdrop',
      panelClass: 'share-classes-selection-dialog',
      autoFocus: true,
      data: {
        selectedClasses: this.selectedShareClasses
      }
    });

    // Store reference to prevent multiple dialogs
    this.shareClassesDialogRef = dialogRef;

    dialogRef.afterClosed().subscribe((result: any) => {
      // Clear dialog reference when closed
      this.shareClassesDialogRef = null;
      this.activeSubTab = null;
      
      if (result && result.saved) {
        // Store selected classes
        this.selectedShareClasses = result.selectedClasses || [];
      }
    });
  }

  save(): void {
    // Validate
    if (this.selectedShareClass) {
      if (this.selectedShareClass.antallAksjer < 0 || 
          this.selectedShareClass.pålydende < 0 ||
          this.selectedShareClass.innbetaltOverkurs < 0 ||
          this.selectedShareClass.formuesverdiPerAksje < 0) {
        alert('Alle numeriske verdier må være større enn eller lik 0');
        return;
      }
    }

    if (this.aggregateFields.antallEgneAksjerUtgåendeBalanse < 0 ||
        this.aggregateFields.totaltUtbytteAvsatt < 0) {
      alert('Alle numeriske verdier må være større enn eller lik 0');
      return;
    }

    // Save logic would go here (API call)
    console.log('Saving share classes:', this.shareClasses);
    console.log('Saving aggregate fields:', this.aggregateFields);
    console.log('Saving RISK entries:', this.riskEntries);

    this.isDirty = false;
    alert('Endringer lagret');
  }

  deleteShareClass(shareClass: ShareClass, event: Event): void {
    event.stopPropagation();
    if (confirm(`Er du sikker på at du vil slette ${shareClass.navn}?`)) {
      const index = this.shareClasses.findIndex(sc => sc.id === shareClass.id);
      if (index !== -1) {
        this.shareClasses.splice(index, 1);
        if (this.selectedShareClass?.id === shareClass.id) {
          this.selectedShareClass = null;
        }
        this.calculateAggregateFields();
      }
    }
  }

  get incomingBalanceShares(): number {
    return this.inngåendeBalanse.antallAksjer;
  }

  get incomingBalanceParValue(): number {
    return (this.inngåendeBalanse as any)['pålydende'];
  }

  get incomingBalanceCapital(): number {
    return this.inngåendeBalanse.aksjekapital;
  }

  get incomingBalancePremium(): number {
    return (this.inngåendeBalanse as any)['innbetaltOverkurs'];
  }

  get incomingBalanceTotalCapital(): number {
    return (this.inngåendeBalanse as any)['innbetaltAksjekapital'];
  }

  get incomingBalanceFormuesverdiPerAksje(): number {
    return (this.inngåendeBalanse as any)['formuesverdiPerAksje'] || 0;
  }

  openDividendDetailsDialog(): void {
    // TODO: Implement dividend details dialog
    console.log('Open dividend details dialog');
  }

  get aggregateRiskPerShare(): number {
    return (this.aggregateFields as any)['riskBeløpPerAksje'];
  }

  isShareClassesRoute(): boolean {
    const url = this.router.url;
    return url.endsWith('/share-classes') || url.endsWith('/share-classes/') || (!url.includes('/shareholders') && url.includes('/share-classes'));
  }

  isShareholdersRoute(): boolean {
    return this.router.url.includes('/shareholders');
  }

  navigateToShareClasses(): void {
    this.router.navigate([''], { relativeTo: this.route });
  }

  navigateToShareholders(): void {
    this.router.navigate(['shareholders'], { relativeTo: this.route });
  }

  // Company Transactions Methods
  setActiveSubTab(tab: string): void {
    this.activeSubTab = tab;
  }

  openTransactionDetailPanel(): void {
    this.selectedPostingType = null;
    this.newTransaction = { _open: true };
    this.editingTransactionId = null;
  }

  closeTransactionDetailPanel(): void {
    this.selectedPostingType = null;
    this.newTransaction = {};
    this.editingTransactionId = null;
  }

  isTransactionDetailPanelOpen(): boolean {
    return this.newTransaction && (this.newTransaction as any)._open === true;
  }

  selectCompanyPostingType(postingTypeId: string | null): void {
    this.selectedPostingType = postingTypeId;
    if (!this.editingTransactionId) {
      this.newTransaction = {
        postingTypeId: postingTypeId || null,
        tidspunkt: new Date().toISOString().slice(0, 16),
        _open: true
      };
    }
  }

  getSelectedCompanyPostingTypeName(): string {
    if (!this.selectedPostingType) return '';
    const postingType = this.companyPostingTypes.find(pt => pt.id === this.selectedPostingType);
    return postingType ? postingType.shortName : '';
  }

  getCompanyTransactionGroups(): { postingTypeId: string; postingTypeDescription: string; transactions: any[] }[] {
    const grouped = new Map<string, any[]>();
    
    this.companyTransactions.forEach(t => {
      const transactionAny = t as any;
      const postingTypeId = transactionAny.postingTypeId || '9';
      if (!grouped.has(postingTypeId)) {
        grouped.set(postingTypeId, []);
      }
      grouped.get(postingTypeId)!.push(t);
    });

    // Sort by postingTypeId (9, 10, 11, etc.)
    return Array.from(grouped.entries())
      .sort(([a], [b]) => parseInt(a) - parseInt(b))
      .map(([postingTypeId, transactions]) => {
        const postingType = this.companyPostingTypes.find(pt => pt.id === postingTypeId);
        return {
          postingTypeId,
          postingTypeDescription: postingType ? `Post ${postingTypeId}: ${postingType.shortName}` : `Post ${postingTypeId}`,
          transactions
        };
      });
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

  hasExpandedTransactionGroups(): boolean {
    return this.expandedTransactionGroups.size > 0 || 
           this.getCompanyTransactionGroups().some((g) => g.transactions.length === 1);
  }

  selectCompanyTransaction(transaction: any, event: Event): void {
    event.stopPropagation();
    if (!transaction.isEditing) {
      this.editCompanyTransaction(transaction);
      // Ensure the detail panel is open
      if (!this.isTransactionDetailPanelOpen()) {
        (this.newTransaction as any)._open = true;
      }
    }
  }

  editCompanyTransaction(transaction: any): void {
    this.editingTransactionId = transaction.id;
    const transactionAny = transaction as any;
    
    // Set the posting type first so the correct form fields are displayed
    this.selectedPostingType = transactionAny.postingTypeId || '9';
    
    // Format tidspunkt for datetime-local input (YYYY-MM-DDTHH:mm)
    let formattedTidspunkt = transactionAny.tidspunkt;
    if (formattedTidspunkt) {
      // If it's a full ISO string, convert to datetime-local format
      if (formattedTidspunkt.includes('T')) {
        formattedTidspunkt = formattedTidspunkt.slice(0, 16);
      }
    } else {
      formattedTidspunkt = new Date().toISOString().slice(0, 16);
    }
    
    // Load ALL transaction data into newTransaction - this ensures all fields are available
    // Remove any internal flags first, then spread all transaction data
    const { _open, isEditing, ...cleanTransactionData } = transactionAny;
    
    // Create a new object with ALL fields from the transaction
    this.newTransaction = {
      ...cleanTransactionData,  // Spread all fields from the transaction
      tidspunkt: formattedTidspunkt,
      _open: true  // Ensure panel is marked as open
    };
    
    // Force Angular to detect changes and update the form
    // This ensures all bound fields are updated
    this.cdr.detectChanges();
  }

  saveCompanyTransaction(transaction: any): void {
    transaction.isEditing = false;
    this.isDirty = true;
    this.closeTransactionDetailPanel();
  }

  cancelEditCompanyTransaction(transaction: any): void {
    transaction.isEditing = false;
    this.closeTransactionDetailPanel();
  }

  deleteCompanyTransaction(transaction: any): void {
    if (confirm('Er du sikker på at du vil slette denne transaksjonen?')) {
      const index = this.companyTransactions.indexOf(transaction);
      if (index > -1) {
        this.companyTransactions.splice(index, 1);
      }
      this.isDirty = true;
    }
  }

  saveNewCompanyTransaction(): void {
    if (!this.selectedPostingType) {
      alert('Vennligst velg en post type først');
      return;
    }

    // Remove internal flags but keep ALL other fields
    const { _open, isEditing, ...transactionDataWithoutFlags } = this.newTransaction;
    
    // Create transaction data with ALL fields from newTransaction
    const transactionData: any = {
      id: this.editingTransactionId || `ct-${Date.now()}`,
      postingTypeId: this.selectedPostingType,
      ...transactionDataWithoutFlags  // This includes ALL fields entered by the user
    };

    if (this.editingTransactionId) {
      const index = this.companyTransactions.findIndex(t => (t as any).id === this.editingTransactionId);
      if (index > -1) {
        Object.assign(this.companyTransactions[index], transactionData);
      }
    } else {
      this.companyTransactions.push(transactionData);
    }

    this.closeTransactionDetailPanel();
    this.isDirty = true;
  }

  saveAndNextCompanyTransaction(): void {
    // Save the current transaction
    this.saveNewCompanyTransaction();
    
    // Keep the panel open and prepare for next entry
    const currentPostingType = this.selectedPostingType;
    this.openTransactionDetailPanel();
    if (currentPostingType) {
      this.selectCompanyPostingType(currentPostingType);
    }
  }

  saveCompanyTransactions(): void {
    // Mock save - in real app, call API
    console.log('Saving company transactions:', this.companyTransactions);
    alert('Transaksjoner lagret');
    this.isDirty = false;
  }

  formatDateTime(dateTime: string): string {
    if (!dateTime) return '-';
    try {
      const date = new Date(dateTime);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
    } catch {
      return dateTime;
    }
  }
}

