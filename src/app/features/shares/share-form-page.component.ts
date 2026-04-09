import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { ShareGroup, Shareholding, ShareholdingDraft, ShareValueEntry } from './shares.models';
import { SharesService } from './shares.service';
import { SharesRiskDetailsDialogComponent, SharesRiskEntry } from './risk-details-dialog/risk-details-dialog.component';
import { SharesInitialValueDialogComponent } from './initial-value-dialog/initial-value-dialog.component';

@Component({
  selector: 'app-share-form-page',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatDialogModule],
  templateUrl: './share-form-page.component.html',
  styleUrls: ['./share-form-page.component.scss']
})
export class ShareFormPageComponent implements OnInit {
  year = 2025;
  shareId: string | null = null;
  isEdit = false;
  groups: ShareGroup[] = [];
  shareholdings: Shareholding[] = [];
  selectedShareholdingId: string | null = null;
  private isInitialValueDialogOpen = false;
  readonly typeOptions = ['Share', 'Security'];
  readonly companyOptions = ['Cantor Holding AS', 'Cantor Services AS', 'Cantor Advisory AS'];
  readonly municipalityOptions = ['Oslo', 'Bergen', 'Trondheim', 'Stavanger', 'Bærum'];
  readonly currencyOptions = ['NOK', 'SEK', 'DKK', 'EUR', 'USD'];

  form: ShareholdingDraft = this.createEmptyForm();

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly sharesService: SharesService,
    private readonly dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.reloadLookupData();

    this.route.queryParamMap.subscribe((params) => {
      const yearParam = Number(params.get('year'));
      this.year = Number.isFinite(yearParam) && yearParam > 0 ? yearParam : 2025;
      this.reloadLookupData();
      this.loadFormData();
    });

    this.route.paramMap.subscribe((params) => {
      this.shareId = params.get('id');
      this.isEdit = !!this.shareId && this.shareId !== 'new';
      this.loadFormData();
    });
  }

  get pageTitle(): string {
    return 'Aksjer - «Aksjeposter»';
  }

  get selectedShareName(): string {
    return this.form.company || 'Aksjepost';
  }

  get totalShares(): number {
    return this.form.shareValueEntries.reduce((sum, entry) => sum + Number(entry.shares || 0), 0);
  }

  get totalAmount(): number {
    return this.form.shareValueEntries.reduce((sum, entry) => sum + this.getEntryAmount(entry), 0);
  }

  onSelectedShareholdingChange(): void {
    if (!this.selectedShareholdingId) {
      return;
    }
    this.router.navigate(['/shares', this.selectedShareholdingId], { queryParams: { year: this.year } });
  }

  addShareValueRow(): void {
    this.form.shareValueEntries.push(this.createEmptyShareValueEntry());
  }

  removeShareValueRow(index: number): void {
    this.form.shareValueEntries.splice(index, 1);
  }

  getEntryAmount(entry: ShareValueEntry): number {
    return Number(entry.shares || 0) * Number(entry.price || 0);
  }

  openRiskDetailsDialog(): void {
    const dialogRef = this.dialog.open(SharesRiskDetailsDialogComponent, {
      width: '500px',
      maxWidth: '90vw',
      disableClose: false,
      hasBackdrop: true,
      backdropClass: 'dialog-backdrop',
      panelClass: 'risk-details-dialog',
      autoFocus: true,
      data: { riskEntries: [...(this.form.riskEntries ?? [])] as SharesRiskEntry[] }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result?.saved) {
        this.form.riskEntries = (result.riskEntries ?? []) as any;
      }
    });
  }

  openInitialValueDialog(): void {
    if (this.isInitialValueDialogOpen) {
      return; // Prevent double-open when the click event fires twice.
    }
    this.isInitialValueDialogOpen = true;

    const dialogRef = this.dialog.open(SharesInitialValueDialogComponent, {
      width: '520px',
      maxWidth: '92vw',
      disableClose: false,
      hasBackdrop: true,
      backdropClass: 'dialog-backdrop',
      panelClass: 'initial-value-dialog',
      autoFocus: true,
      data: {
        taxableAssetValue: this.form.taxableAssetValue,
        appraisedValue: this.form.appraisedValue,
        accountingValue: this.form.accountingValue,
        listedCompanyStatedInitialValue: this.form.listedCompanyStatedInitialValue
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      this.isInitialValueDialogOpen = false;
      if (result?.saved) {
        this.form.taxableAssetValue = Number(result.taxableAssetValue) || 0;
        this.form.appraisedValue = Number(result.appraisedValue) || 0;
        this.form.accountingValue = Number(result.accountingValue) || 0;
        this.form.listedCompanyStatedInitialValue =
          Number(result.listedCompanyStatedInitialValue) || 0;
      }
    });
  }

  onCompanyInCantorChange(): void {
    if (!this.form.companyInCantor) {
      return;
    }

    const matchingRecord = this.shareholdings.find((item) => item.companyInCantor === this.form.companyInCantor);
    if (matchingRecord) {
      this.form.assessedTotalAccountingValue = matchingRecord.assessedTotalAccountingValue;
    }
  }

  onSave(): void {
    if (!this.form.company.trim() || !this.form.organizationNumber.trim() || !this.form.type.trim()) {
      alert('Please fill in company, organization number and type.');
      return;
    }

    this.sharesService.saveShareholding(this.year, this.form, this.shareId ?? undefined);
    this.navigateBack();
  }

  onCancel(): void {
    this.navigateBack();
  }

  private navigateBack(): void {
    this.router.navigate(['/shares'], { queryParams: { year: this.year } });
  }

  private loadFormData(): void {
    if (!this.isEdit || !this.shareId) {
      this.form = this.createEmptyForm();
      this.selectedShareholdingId = null;
      return;
    }

    const existing = this.sharesService.getShareholding(this.year, this.shareId);
    if (!existing) {
      return;
    }

    this.form = {
      company: existing.company,
      organizationNumber: existing.organizationNumber,
      type: existing.type,
      groupId: existing.groupId,
      companyInCantor: existing.companyInCantor,
      officeMunicipality: existing.officeMunicipality,
      currency: existing.currency,
      norwegianCompany: existing.norwegianCompany,
      openingBalanceShares: existing.openingBalanceShares,
      yearEndShares: existing.yearEndShares,
      activeAtYearEnd: existing.activeAtYearEnd
      ,
      parValue: existing.parValue,
      shareCapital: existing.shareCapital,
      equityLastYear: existing.equityLastYear,
      profitLastYear: existing.profitLastYear,
      totalDividendReceived: existing.totalDividendReceived,
      withholdingTaxDeducted: existing.withholdingTaxDeducted,
      assessedTotalAccountingValue: existing.assessedTotalAccountingValue,
      transferToTaxReturn: existing.transferToTaxReturn,
      riskEntries: existing.riskEntries ? existing.riskEntries.map((entry) => ({ ...entry })) : [],
      taxableAssetValue: (existing as any).taxableAssetValue ?? 0,
      appraisedValue: (existing as any).appraisedValue ?? 0,
      accountingValue: (existing as any).accountingValue ?? 0,
      listedCompanyStatedInitialValue: (existing as any).listedCompanyStatedInitialValue ?? 0,
      shareValueEntries: existing.shareValueEntries.map((entry) => ({ ...entry }))
    };
    this.selectedShareholdingId = existing.id;
  }

  private createEmptyForm(): ShareholdingDraft {
    return {
      company: '',
      organizationNumber: '',
      type: this.typeOptions[0],
      groupId: null,
      companyInCantor: null,
      officeMunicipality: this.municipalityOptions[0],
      currency: 'NOK',
      norwegianCompany: true,
      openingBalanceShares: 0,
      yearEndShares: 0,
      activeAtYearEnd: true,
      riskEntries: [
        {
          id: `risk-${Date.now()}-1`,
          år: this.year - 2,
          riskBeløp: 10
        },
        {
          id: `risk-${Date.now()}-2`,
          år: this.year - 1,
          riskBeløp: 25
        },
        {
          id: `risk-${Date.now()}-3`,
          år: this.year,
          riskBeløp: 50
        }
      ],
      parValue: 0,
      shareCapital: 0,
      equityLastYear: 0,
      profitLastYear: 0,
      totalDividendReceived: 0,
      withholdingTaxDeducted: 0,
      assessedTotalAccountingValue: 0,
      transferToTaxReturn: false,
      taxableAssetValue: 0,
      appraisedValue: 0,
      accountingValue: 0,
      listedCompanyStatedInitialValue: 0,
      shareValueEntries: [
        this.createEmptyShareValueEntry()
      ]
    };
  }

  private createEmptyShareValueEntry(): ShareValueEntry {
    return {
      id: `entry-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      date: new Date().toISOString().slice(0, 10),
      text: 'Buy',
      shares: 0,
      price: 0,
      costs: 0
    };
  }

  private reloadLookupData(): void {
    this.groups = this.sharesService.getGroups();
    this.shareholdings = this.sharesService.getShareholdings(this.year);
  }
}
