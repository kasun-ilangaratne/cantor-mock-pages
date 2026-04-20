import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

type TopicId =
  | 'overview'
  | 'income'
  | 'assets'
  | 'receivables-tax-value'
  | 'inventory'
  | 'equity-reconciliation'
  | 'validation';

type DrawerTabId = 'general' | 'values' | 'tax' | 'history';

interface TopicItem {
  id: TopicId;
  label: string;
  description: string;
  completion: number;
}

interface AssetRecord {
  id: string;
  objectId: string;
  description: string;
  openingValue: number;
  newAcquisition: number;
  depreciation: number;
  closingValue: number;
  physicalAsset: boolean;
  exclude: boolean;
  acquisitionDate: string;
  balanceGroup: string;
  writtenDownReplacedAssets: number;
  cost: number;
  depreciationBasis: number;
  annualDepreciation: number;
  historicCostPrice: number;
  lowerDepreciationThreshold: number;
  taxFlags: {
    physicalAssetInClosingValue: boolean;
    allowSpecialTaxWriteOff: boolean;
  };
  history: string[];
}

interface OverviewUpdate {
  title: string;
  when: string;
}

interface OverviewSummaryRow {
  label: string;
  amount: number;
  tax: number;
}

@Component({
  selector: 'app-annual-report',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './annual-report.component.html',
  styleUrl: './annual-report.component.scss'
})
export class AnnualReportComponent {
  readonly companyOptions = ['Shiba Group AS', 'Arctic Drift AS', 'North Ledger AS'];
  readonly yearOptions = [2023, 2024, 2025, 2026];
  readonly topics: TopicItem[] = [
    {
      id: 'overview',
      label: 'Overview',
      description: 'Summary, completion status and recent updates.',
      completion: 84
    },
    {
      id: 'income',
      label: 'Income Statement',
      description: 'Income and expense mapping.',
      completion: 78
    },
    {
      id: 'assets',
      label: 'Assets',
      description: 'Table based assets with row-level details.',
      completion: 92
    },
    {
      id: 'receivables-tax-value',
      label: 'Receivables Tax Value',
      description: 'Calculation-heavy workspace with formulas.',
      completion: 73
    },
    {
      id: 'inventory',
      label: 'Inventory',
      description: 'Inventory valuation and movement.',
      completion: 58
    },
    {
      id: 'equity-reconciliation',
      label: 'Equity Reconciliation',
      description: 'Opening to closing equity analysis.',
      completion: 67
    },
    {
      id: 'validation',
      label: 'Validation',
      description: 'Validation summary and blockers.',
      completion: 71
    }
  ];

  selectedCompany = this.companyOptions[0];
  selectedYear = this.yearOptions[2];
  selectedTopicId: TopicId = 'overview';
  drawerOpen = false;
  drawerTab: DrawerTabId = 'general';
  lastSavedLabel = 'Not saved yet';
  reportStatus: 'Draft' | 'Validated' | 'Ready to publish' = 'Draft';
  flashMessage = '';
  publishBlockedReason = 'Run validation before publish.';
  searchTerm = '';
  showActiveOnly = true;
  recentOverviewUpdates: OverviewUpdate[] = [
    { title: 'Receivables Tax Value', when: 'Today' },
    { title: 'Machinery', when: '30 minutes ago' },
    { title: 'Inventory', when: '1 hour ago' }
  ];

  receivablesInput = {
    grossReceivables: 880000,
    expectedCreditLoss: 43000,
    disputedAmount: 15000,
    taxAdjustment: -12000,
    taxRatePercent: 22
  };
  receivablesResult = {
    taxableBase: 0,
    taxableValue: 0,
    effectiveTaxImpact: 0
  };

  validationMessages: { severity: 'error' | 'warning' | 'success'; text: string }[] = [
    { severity: 'warning', text: 'Inventory section has two lines pending documentation.' },
    { severity: 'warning', text: 'Receivables tax value not recalculated for selected year.' }
  ];

  assets: AssetRecord[] = [
    {
      id: 'a1',
      objectId: 'AST-1001',
      description: 'Warehouse automation line',
      openingValue: 620000,
      newAcquisition: 140000,
      depreciation: 91000,
      closingValue: 669000,
      physicalAsset: true,
      exclude: false,
      acquisitionDate: '15.03.2022',
      balanceGroup: 'Machinery',
      writtenDownReplacedAssets: 10000,
      cost: 760000,
      depreciationBasis: 750000,
      annualDepreciation: 91000,
      historicCostPrice: 810000,
      lowerDepreciationThreshold: 30000,
      taxFlags: {
        physicalAssetInClosingValue: true,
        allowSpecialTaxWriteOff: false
      },
      history: ['14.02.2026 - Updated depreciation by Eva L.', '10.02.2026 - Created from legacy import']
    },
    {
      id: 'a2',
      objectId: 'AST-1007',
      description: 'Office fit-out Oslo',
      openingValue: 350000,
      newAcquisition: 25000,
      depreciation: 42000,
      closingValue: 333000,
      physicalAsset: true,
      exclude: false,
      acquisitionDate: '04.09.2023',
      balanceGroup: 'Buildings',
      writtenDownReplacedAssets: 0,
      cost: 375000,
      depreciationBasis: 375000,
      annualDepreciation: 42000,
      historicCostPrice: 392000,
      lowerDepreciationThreshold: 30000,
      taxFlags: {
        physicalAssetInClosingValue: true,
        allowSpecialTaxWriteOff: false
      },
      history: ['03.03.2026 - Cost adjusted from invoice reconciliation']
    },
    {
      id: 'a3',
      objectId: 'AST-1018',
      description: 'Legacy forklift pool',
      openingValue: 178000,
      newAcquisition: 0,
      depreciation: 26000,
      closingValue: 152000,
      physicalAsset: true,
      exclude: true,
      acquisitionDate: '11.06.2018',
      balanceGroup: 'Vehicles',
      writtenDownReplacedAssets: 6000,
      cost: 178000,
      depreciationBasis: 172000,
      annualDepreciation: 26000,
      historicCostPrice: 245000,
      lowerDepreciationThreshold: 30000,
      taxFlags: {
        physicalAssetInClosingValue: true,
        allowSpecialTaxWriteOff: true
      },
      history: ['21.01.2026 - Excluded from tax basis after legal review']
    }
  ];

  editingAsset: AssetRecord | null = null;
  private baselineAssetSnapshot: AssetRecord | null = null;

  constructor() {
    this.recalculateReceivables(false);
  }

  get selectedTopic(): TopicItem {
    return this.topics.find((t) => t.id === this.selectedTopicId) ?? this.topics[0];
  }

  get filteredAssets(): AssetRecord[] {
    const term = this.searchTerm.trim().toLowerCase();
    return this.assets.filter((asset) => {
      const matchesSearch =
        !term ||
        asset.objectId.toLowerCase().includes(term) ||
        asset.description.toLowerCase().includes(term) ||
        asset.balanceGroup.toLowerCase().includes(term);
      const active = !asset.exclude;
      return matchesSearch && (!this.showActiveOnly || active);
    });
  }

  get assetTotals(): { opening: number; acquisition: number; depreciation: number; closing: number } {
    return this.filteredAssets.reduce(
      (sum, a) => {
        sum.opening += a.openingValue;
        sum.acquisition += a.newAcquisition;
        sum.depreciation += a.depreciation;
        sum.closing += a.closingValue;
        return sum;
      },
      { opening: 0, acquisition: 0, depreciation: 0, closing: 0 }
    );
  }

  get completionAvg(): number {
    const total = this.topics.reduce((sum, t) => sum + t.completion, 0);
    return Math.round(total / this.topics.length);
  }

  get issueLabel(): string {
    return this.validationMessages.length === 1 ? 'Issue' : 'Issues';
  }

  get overviewSummaryRows(): OverviewSummaryRow[] {
    const incomeAmount = Math.round(this.assetTotals.closing * 0.98);
    const receivablesAmount = this.receivablesResult.taxableValue;
    const inventoryAmount = Math.round(this.assetTotals.closing * 0.58);
    const equityAmount = Math.round(this.assetTotals.closing * 0.29);

    return [
      { label: 'Income Statement', amount: incomeAmount, tax: Math.round(incomeAmount * 0.01) },
      { label: 'Assets', amount: this.assetTotals.closing, tax: Math.round(this.assetTotals.closing * 0.01) },
      { label: 'Receivables Tax Value', amount: receivablesAmount, tax: Math.round(receivablesAmount * 0.01) },
      { label: 'Inventory', amount: inventoryAmount, tax: Math.round(inventoryAmount * 0.01) },
      { label: 'Equity Reconciliation', amount: equityAmount, tax: Math.round(equityAmount * 0.01) }
    ];
  }

  selectTopic(topicId: TopicId): void {
    this.selectedTopicId = topicId;
    if (topicId !== 'assets') {
      this.closeDrawer();
    }
  }

  openAssetDrawer(asset: AssetRecord): void {
    this.drawerOpen = true;
    this.drawerTab = 'general';
    this.editingAsset = this.cloneAsset(asset);
    this.baselineAssetSnapshot = this.cloneAsset(asset);
  }

  closeDrawer(): void {
    this.drawerOpen = false;
    this.editingAsset = null;
    this.baselineAssetSnapshot = null;
  }

  saveAssetChanges(next = false): void {
    if (!this.editingAsset) {
      return;
    }
    const idx = this.assets.findIndex((a) => a.id === this.editingAsset?.id);
    if (idx >= 0) {
      this.editingAsset.closingValue =
        this.editingAsset.openingValue + this.editingAsset.newAcquisition - this.editingAsset.depreciation;
      this.editingAsset.taxFlags.physicalAssetInClosingValue = this.editingAsset.physicalAsset;
      this.assets[idx] = this.cloneAsset(this.editingAsset);
    }

    this.lastSavedLabel = `Saved ${new Date().toLocaleTimeString('no-NO', {
      hour: '2-digit',
      minute: '2-digit'
    })}`;
    this.flash('Asset row saved. Annual report totals and impact updated.');
    this.reportStatus = 'Draft';
    this.publishBlockedReason = 'Validation must be run after changes.';
    this.validationMessages = [
      { severity: 'warning', text: 'Changes saved. Re-run validation to confirm publish readiness.' }
    ];

    if (next) {
      const pos = this.filteredAssets.findIndex((a) => a.id === this.editingAsset?.id);
      const nextAsset = this.filteredAssets[pos + 1];
      if (nextAsset) {
        this.openAssetDrawer(nextAsset);
        return;
      }
    }
    this.closeDrawer();
  }

  recalculateReceivables(showFeedback = true): void {
    const taxableBase =
      this.receivablesInput.grossReceivables -
      this.receivablesInput.expectedCreditLoss -
      this.receivablesInput.disputedAmount +
      this.receivablesInput.taxAdjustment;
    const taxableValue = Math.max(0, taxableBase);
    const effectiveTaxImpact = taxableValue * (this.receivablesInput.taxRatePercent / 100);

    this.receivablesResult = { taxableBase, taxableValue, effectiveTaxImpact };

    if (showFeedback) {
      this.lastSavedLabel = `Recalculated ${new Date().toLocaleTimeString('no-NO', {
        hour: '2-digit',
        minute: '2-digit'
      })}`;
      this.flash('Receivables tax value recalculated.');
      this.reportStatus = 'Draft';
      this.publishBlockedReason = 'Validation must be run after changes.';
    }
  }

  runValidation(): void {
    const errors: { severity: 'error' | 'warning' | 'success'; text: string }[] = [];
    if (this.assetTotals.closing <= 0) {
      errors.push({ severity: 'error', text: 'Assets closing total must be greater than 0.' });
    }
    if (this.receivablesResult.taxableValue <= 0) {
      errors.push({
        severity: 'warning',
        text: 'Receivables taxable value is zero. Confirm if this is expected.'
      });
    }

    if (errors.length === 0) {
      this.validationMessages = [
        { severity: 'success', text: 'Validation successful. No blocking issues found.' }
      ];
      this.reportStatus = 'Ready to publish';
      this.publishBlockedReason = '';
    } else {
      this.validationMessages = errors;
      this.reportStatus = errors.some((e) => e.severity === 'error') ? 'Draft' : 'Validated';
      this.publishBlockedReason = errors.some((e) => e.severity === 'error')
        ? 'Resolve validation errors before publish.'
        : 'Publish allowed with warnings.';
    }
    this.flash('Validation completed.');
  }

  publish(): void {
    if (!this.canPublish) {
      this.flash(this.publishBlockedReason || 'Publish is blocked.');
      return;
    }
    this.reportStatus = 'Validated';
    this.lastSavedLabel = `Published ${new Date().toLocaleTimeString('no-NO', {
      hour: '2-digit',
      minute: '2-digit'
    })}`;
    this.flash('Annual report published (POC action).');
  }

  exportReport(): void {
    this.flash('Export started (POC action).');
  }

  get canPublish(): boolean {
    return this.reportStatus === 'Ready to publish' || this.publishBlockedReason === 'Publish allowed with warnings.';
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('no-NO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }

  private flash(message: string): void {
    this.flashMessage = message;
    setTimeout(() => {
      if (this.flashMessage === message) {
        this.flashMessage = '';
      }
    }, 2200);
  }

  private cloneAsset(asset: AssetRecord): AssetRecord {
    return {
      ...asset,
      taxFlags: { ...asset.taxFlags },
      history: [...asset.history]
    };
  }
}

