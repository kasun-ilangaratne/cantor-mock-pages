import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AccountOption } from '../../shared/components/account-dropdown/account-dropdown.component';
import { CounterpartyDialogComponent } from './counterparty-dialog/counterparty-dialog.component';
import { DimensionFilterDialogComponent } from './dimension-filter-dialog/dimension-filter-dialog.component';
import { EliminationsDialogComponent } from './eliminations-dialog/eliminations-dialog.component';
import { AlternativeCalculationDialogComponent } from './alternative-calculation-dialog/alternative-calculation-dialog.component';
import { ExceptionDialogComponent } from './exception-dialog/exception-dialog.component';
import { HistoricalCostDialogComponent } from './historical-cost-dialog/historical-cost-dialog.component';
import { ChangeDialogComponent } from './change-dialog/change-dialog.component';

@Component({
  selector: 'app-consolidated-result-unit',
  templateUrl: './consolidated-result-unit.component.html',
  styleUrls: ['./consolidated-result-unit.component.scss']
})
export class ConsolidatedResultUnitComponent implements OnInit {
  form: FormGroup;

  currencies = [
    { value: 'currency', label: 'Currency' },
    { value: 'deullaroi', label: 'Deullaroi' }
  ];

  // Track expanded/collapsed state for each section
  expandedSections: { [key: string]: boolean } = {
    basicInfo: true,
    groupRelationship: true,
    currency: true,
    openingBalance: true,
    restrictions: true,
    minority: true,
    taxComputation: true
  };

  constructor(private fb: FormBuilder, private dialog: MatDialog) {
    this.form = this.fb.group({
      // Basic info
      dimensionNo: ['', Validators.required],
      dimensionId: ['', Validators.required],
      name: ['', Validators.required],
      columnText1: [''],
      columnText2: [''],
      dimensionText: [''],

      // Group Relationship section
      companyNo: [''],
      groupDimensionNo: [''],
      parent: [false],
      accountDuplication: [true],
      includeAllDimensions: [true],
      dimensionFilter: [false],
      netMethod: [false],

      // Currency section
      currency: ['currency'],
      method: [true],
      periodicTranslation: [false],
      fxGainLossAccount: [''],
      offsetAccount: [''],
      dontShowFxAsElimination: [false],
      resultIsAppropriated: [true],
      plAccountsFrom: [''],
      plAccountsTo: [''],
      equityAccountsFrom: [''],
      equityAccountsTo: [''],
      ociAccount: [''],
      profitAllocation: [''],

      // Opening Balance section
      openingBalanceStartYear: [''],
      openingBalanceEquity: [''],
      openingBalanceFxTranslation: [''],

      // Restrictions section
      sharePercent: [''],
      consolidateFromPeriod: [''],
      consolidateToPeriod: [''],
      balanceOnlyFirstPeriod: [false],

      // Minority section
      plAccountsFromMinority: [''],
      plAccountsToMinority: [''],
      minoritySharePercent: [''],
      minorityResultAccount: [''],
      minorityBalanceAccount: [''],
      minorityShareOfEquityOpeningBalance: [''],

      // Tax Computation section
      plAccountsFromTax: [''],
      plAccountsToTax: [''],
      taxRatePercent: [''],
      taxResultAccount: [''],
      taxBalanceAccount: [''],
      includeIfrsEntries: [false]
    });
  }

  ngOnInit(): void {
    // Component initialization
  }

  toggleSection(sectionName: string): void {
    this.expandedSections[sectionName] = !this.expandedSections[sectionName];
  }

  onAccountSelected(fieldName: string, accountOption: AccountOption): void {
    this.form.get(fieldName)?.setValue(accountOption.value);
  }

  onSave(): void {
    if (this.form.valid) {
      console.log('Form submitted:', this.form.value);
      // Handle form submission
    }
  }

  onCancel(): void {
    // Handle cancel action
    console.log('Form cancelled');
  }

  onEliminations(): void {
    const dialogRef = this.dialog.open(EliminationsDialogComponent, {
      width: '75vw',
      maxWidth: '1200px',
      height: '100vh',
      position: { right: '0', top: '0' },
      panelClass: 'slider-dialog',
      data: { parentData: this.form.value }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Eliminations dialog result:', result);
        // Handle the dialog result
      }
    });
  }

  onCounterparties(): void {
    const dialogRef = this.dialog.open(CounterpartyDialogComponent, {
      width: '75vw',
      maxWidth: '1200px',
      height: '100vh',
      position: { right: '0', top: '0' },
      panelClass: 'slider-dialog',
      data: { dim: 5 }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Dialog result:', result);
        // Handle the dialog result
      }
    });
  }

  onDimensionFilter(): void {
    const dialogRef = this.dialog.open(DimensionFilterDialogComponent, {
      width: '500px',
      maxWidth: '90vw',
      position: { right: '50px', top: '50px' },
      panelClass: 'dimension-filter-dialog-overlay',
      data: { parentData: this.form.value }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Dimension Filter dialog result:', result);
        // Handle the dialog result
      }
    });
  }

  onNetMethod(): void {
    const dialogRef = this.dialog.open(AlternativeCalculationDialogComponent, {
      width: '75vw',
      maxWidth: '1200px',
      height: '100vh',
      position: { right: '0', top: '0' },
      panelClass: 'slider-dialog',
      data: { parentData: this.form.value }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Alternative Calculation dialog result:', result);
        // Handle the dialog result
      }
    });
  }

  onException(): void {
    const dialogRef = this.dialog.open(ExceptionDialogComponent, {
      width: '500px',
      maxWidth: '90vw',
      position: { right: '50px', top: '50px' },
      panelClass: 'dimension-filter-dialog-overlay',
      data: { parentData: this.form.value }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // handle result if needed
      }
    });
  }

  onHistCost(): void {
    const dialogRef = this.dialog.open(HistoricalCostDialogComponent, {
      width: '75vw',
      maxWidth: '1200px',
      height: '100vh',
      position: { right: '0', top: '0' },
      panelClass: 'slider-dialog',
      data: { parentData: this.form.value }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Historical Cost dialog result:', result);
        // Handle the dialog result
      }
    });
  }

  onChange(): void {
    const dialogRef = this.dialog.open(ChangeDialogComponent, {
      width: '500px',
      maxWidth: '90vw',
      maxHeight: '70vh',
      position: { right: '50px', top: '50px' },
      panelClass: 'dimension-filter-dialog-overlay',
      data: { parentData: this.form.value }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Change dialog result:', result);
        // Handle the dialog result
      }
    });
  }

  onTaxException(): void {
    const dialogRef = this.dialog.open(ExceptionDialogComponent, {
      width: '500px',
      maxWidth: '90vw',
      position: { right: '50px', top: '50px' },
      panelClass: 'dimension-filter-dialog-overlay',
      data: { parentData: this.form.value }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // handle result if needed
      }
    });
  }
} 