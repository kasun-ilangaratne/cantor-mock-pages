import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FixedAssetTopicComponent } from './fixed-asset-topic/fixed-asset-topic.component';
import { DifferencesTopicComponent } from './topics/differences-topic.component';
import { EquityReconciliationTopicComponent } from './topics/equity-reconciliation-topic.component';
import { FastEiendomNaeringTopicComponent } from './topics/fast-eiendom-naering-topic.component';
import { FasteEiendommerTopicComponent } from './topics/faste-eiendommer-topic.component';
import { GroupContributionTopicComponent } from './topics/group-contribution-topic.component';
import { InterestLimitationTopicComponent } from './topics/interest-limitation-topic.component';
import { InventoryTopicComponent } from './topics/inventory-topic.component';
import { PayrollPensionCostTopicComponent } from './topics/payroll-pension-cost-topic.component';
import { ReceivablesTaxValueTopicComponent } from './topics/receivables-tax-value-topic.component';
import { ResearchDevelopmentProjectsTopicComponent } from './topics/research-development-projects-topic.component';
import { ResearchDevelopmentTopicComponent } from './topics/research-development-topic.component';

type TopicId =
  | 'overview'
  | 'income'
  | 'fixed-asset'
  | 'receivables-tax-value'
  | 'inventory'
  | 'equity-reconciliation'
  | 'interest-limitation'
  | 'differences'
  | 'payroll-pension-cost'
  | 'group-contribution'
  | 'faste-eiendommer'
  | 'fast-eiendom-naering'
  | 'research-development-projects'
  | 'research-development'
  | 'validation'
  | 'saldobalanse'
  | 'rapporter'
  | 'likviditetsoversikt'
  | 'arsoppgjor'
  | 'budsjett'
  | 'prognose'
  | 'generer-kommentarer'
  | 'kontoplan'
  | 'valuta'
  | 'dimensjoner';

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

type FixedAssetType = 'SA' | 'LA' | 'IA';

interface FixedAssetRecord {
  id: string;
  type: FixedAssetType;
  objectId: string;
  description: string;
  acquisitionDate: string;
  openingValue: number;
  addition: number;
  proceeds: number;
  depreciationRate: number;
  annualDepreciation: number;
  closingValue: number;
  balanceGroup: string;
  taxableDays: number;
  linearCost: number;
  linearLifetimeMonths: number;
  nonDepreciableAdjustment: number;
}

interface OverviewUpdate {
  title: string;
  when: string;
}

interface OverviewSummaryRow {
  label: string;
  amount: number;
  lastYear: number;
}

interface OverviewStatCard {
  label: string;
  value: string;
  delta: string;
  trend: 'up' | 'down';
}

@Component({
  selector: 'app-annual-report',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FixedAssetTopicComponent,
    InterestLimitationTopicComponent,
    ReceivablesTaxValueTopicComponent,
    InventoryTopicComponent,
    DifferencesTopicComponent,
    PayrollPensionCostTopicComponent,
    EquityReconciliationTopicComponent,
    GroupContributionTopicComponent,
    FasteEiendommerTopicComponent,
    FastEiendomNaeringTopicComponent,
    ResearchDevelopmentProjectsTopicComponent,
    ResearchDevelopmentTopicComponent
  ],
  templateUrl: './annual-report.component.html',
  styleUrl: './annual-report.component.scss'
})
export class AnnualReportComponent {
  private readonly fixedTopicIds: TopicId[] = ['overview', 'income'];
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
      id: 'fixed-asset',
      label: 'Fixed Assets',
      description: 'Anleggsmiddel-style register with SA/LA/IA type handling.',
      completion: 63
    },
    {
      id: 'receivables-tax-value',
      label: 'Receivables Tax Value',
      description: 'Receivables tax value specification.',
      completion: 73
    },
    {
      id: 'inventory',
      label: 'Inventory',
      description: 'Inventory specification.',
      completion: 58
    },
    {
      id: 'equity-reconciliation',
      label: 'Equity Reconciliation',
      description: 'Equity reconciliation specification.',
      completion: 67
    },
    {
      id: 'interest-limitation',
      label: 'Interest Limitation',
      description: 'Interest limitation specification.',
      completion: 62
    },
    {
      id: 'differences',
      label: 'Differences',
      description: 'Permanent and temporary differences.',
      completion: 60
    },
    {
      id: 'payroll-pension-cost',
      label: 'Payroll & Pension Cost',
      description: 'Payroll and pension cost specification.',
      completion: 61
    },
    {
      id: 'group-contribution',
      label: 'Group Contribution',
      description: 'Group contribution specification.',
      completion: 64
    },
    {
      id: 'faste-eiendommer',
      label: 'Fixed Properties',
      description: 'SM_FasteEiendommer specification.',
      completion: 55
    },
    {
      id: 'fast-eiendom-naering',
      label: 'Commercial Property',
      description: 'SM_FastEiendomNaering specification.',
      completion: 54
    },
    {
      id: 'research-development-projects',
      label: 'R&D Projects',
      description: 'SM_ForskningOgUtviklingProsjekter specification.',
      completion: 52
    },
    {
      id: 'research-development',
      label: 'Research & Development',
      description: 'SM_ForskningOgUtvikling specification.',
      completion: 53
    },
    {
      id: 'validation',
      label: 'Validation',
      description: 'Validation summary and blockers.',
      completion: 71
    },
    {
      id: 'saldobalanse',
      label: 'Saldobalanse',
      description: 'Trial balance and control totals.',
      completion: 74
    },
    {
      id: 'rapporter',
      label: 'Rapporter',
      description: 'Report configuration and output setup.',
      completion: 61
    },
    {
      id: 'likviditetsoversikt',
      label: 'Likviditetsoversikt',
      description: 'Liquidity overview and movements.',
      completion: 56
    },
    {
      id: 'arsoppgjor',
      label: 'Arsoppgjor',
      description: 'Year-end closing activities and checks.',
      completion: 48
    },
    {
      id: 'budsjett',
      label: 'Budsjett',
      description: 'Budget inputs and variance basis.',
      completion: 66
    },
    {
      id: 'prognose',
      label: 'Prognose',
      description: 'Forecast assumptions and latest projection.',
      completion: 59
    },
    {
      id: 'generer-kommentarer',
      label: 'Generer kommentarer',
      description: 'Generate comments for selected sections.',
      completion: 52
    },
    {
      id: 'kontoplan',
      label: 'Kontoplan',
      description: 'Chart of accounts mapping and maintenance.',
      completion: 82
    },
    {
      id: 'valuta',
      label: 'Valuta',
      description: 'Currency setup and exchange assumptions.',
      completion: 64
    },
    {
      id: 'dimensjoner',
      label: 'Dimensjoner',
      description: 'Dimension tagging and reporting dimensions.',
      completion: 57
    }
  ];

  selectedCompany = this.companyOptions[0];
  selectedYear = this.yearOptions[2];
  selectedTopicId: TopicId = 'overview';
  topicSettingsOpen = false;
  visibleTopicIds = new Set<TopicId>([
    'overview',
    'income',
    'fixed-asset',
    'receivables-tax-value',
    'inventory',
    'equity-reconciliation',
    'interest-limitation',
    'differences',
    'payroll-pension-cost',
    'group-contribution',
    'faste-eiendommer',
    'fast-eiendom-naering',
    'research-development-projects',
    'research-development',
    'validation'
  ]);
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
  readonly fixedAssetTypes: { id: FixedAssetType; label: string }[] = [
    { id: 'SA', label: 'Saldoavskrevet (SA)' },
    { id: 'LA', label: 'Lineaert avskrevet (LA)' },
    { id: 'IA', label: 'Ikke avskrivbar (IA)' }
  ];
  fixedAssets: FixedAssetRecord[] = [
    {
      id: 'fa-1',
      type: 'SA',
      objectId: '100001',
      description: 'Lastebil',
      acquisitionDate: '2022-01-14',
      openingValue: 300000,
      addition: 50000,
      proceeds: 0,
      depreciationRate: 24,
      annualDepreciation: 84000,
      closingValue: 266000,
      balanceGroup: 'd',
      taxableDays: 365,
      linearCost: 0,
      linearLifetimeMonths: 0,
      nonDepreciableAdjustment: 0
    },
    {
      id: 'fa-2',
      type: 'LA',
      objectId: '100145',
      description: 'Produksjonslinje',
      acquisitionDate: '2023-06-01',
      openingValue: 500000,
      addition: 0,
      proceeds: 0,
      depreciationRate: 0,
      annualDepreciation: 50000,
      closingValue: 450000,
      balanceGroup: 'e',
      taxableDays: 365,
      linearCost: 500000,
      linearLifetimeMonths: 120,
      nonDepreciableAdjustment: 0
    },
    {
      id: 'fa-3',
      type: 'IA',
      objectId: '100903',
      description: 'Tomteareal',
      acquisitionDate: '2021-02-01',
      openingValue: 900000,
      addition: 0,
      proceeds: 0,
      depreciationRate: 0,
      annualDepreciation: 0,
      closingValue: 900000,
      balanceGroup: 'i',
      taxableDays: 365,
      linearCost: 0,
      linearLifetimeMonths: 0,
      nonDepreciableAdjustment: 0
    }
  ];
  selectedFixedAssetType: FixedAssetType = 'SA';
  selectedFixedAssetId: string | null = this.fixedAssets.find((item) => item.type === this.selectedFixedAssetType)?.id ?? null;

  constructor() {
    this.recalculateReceivables(false);
  }

  get selectedTopic(): TopicItem {
    return this.topics.find((t) => t.id === this.selectedTopicId) ?? this.topics[0];
  }

  get displayedTopics(): TopicItem[] {
    return this.topics.filter((topic) => this.visibleTopicIds.has(topic.id));
  }

  get settingsTopics(): TopicItem[] {
    return this.topics;
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
    const visibleTopics = this.displayedTopics;
    const total = visibleTopics.reduce((sum, t) => sum + t.completion, 0);
    return visibleTopics.length ? Math.round(total / visibleTopics.length) : 0;
  }

  get fixedAssetsForType(): FixedAssetRecord[] {
    return this.fixedAssets.filter((item) => item.type === this.selectedFixedAssetType);
  }

  get selectedFixedAsset(): FixedAssetRecord | null {
    return this.fixedAssets.find((item) => item.id === this.selectedFixedAssetId) ?? null;
  }

  get fixedAssetTotals(): { opening: number; addition: number; depreciation: number; closing: number } {
    return this.fixedAssetsForType.reduce(
      (sum, row) => {
        sum.opening += row.openingValue;
        sum.addition += row.addition;
        sum.depreciation += row.annualDepreciation;
        sum.closing += row.closingValue;
        return sum;
      },
      { opening: 0, addition: 0, depreciation: 0, closing: 0 }
    );
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
      { label: 'Income Statement', amount: incomeAmount, lastYear: Math.round(incomeAmount * 0.93) },
      { label: 'Fixed Assets', amount: this.assetTotals.closing, lastYear: Math.round(this.assetTotals.closing * 0.95) },
      { label: 'Receivables Tax Value', amount: receivablesAmount, lastYear: Math.round(receivablesAmount * 0.92) },
      { label: 'Inventory', amount: inventoryAmount, lastYear: Math.round(inventoryAmount * 0.94) },
      { label: 'Equity Reconciliation', amount: equityAmount, lastYear: Math.round(equityAmount * 0.91) }
    ];
  }

  get overviewStatCards(): OverviewStatCard[] {
    return [
      { label: 'Revenue', value: `${this.formatCurrency(1250000)} NOK`, delta: '8.7% vs. last year', trend: 'up' },
      { label: 'Total Asset Value', value: `${this.formatCurrency(this.assetTotals.closing)} NOK`, delta: '5.4% vs. last year', trend: 'up' },
      { label: 'Expenses', value: `${this.formatCurrency(-720000)} NOK`, delta: '4.2% vs. last year', trend: 'down' },
      {
        label: 'Profit (Loss)',
        value: `${this.formatCurrency(530000)} NOK`,
        delta: '12.1% vs. last year',
        trend: 'up'
      },
      { label: 'Open Issues', value: `${this.validationMessages.length}`, delta: '3 warnings', trend: 'down' },
      { label: 'Updated Sections', value: '4', delta: 'Since last validation', trend: 'up' }
    ];
  }

  get warningCount(): number {
    return this.validationMessages.filter((item) => item.severity === 'warning').length;
  }

  get snapshotProgressStyle(): string {
    return `conic-gradient(#2563eb ${this.completionAvg}%, #e2e8f0 ${this.completionAvg}% 100%)`;
  }

  selectTopic(topicId: TopicId): void {
    this.selectedTopicId = topicId;
    this.topicSettingsOpen = false;
    this.closeDrawer();
  }

  @HostListener('window:annual-report:navigate-topic', ['$event'])
  onNavigateTopic(event: Event): void {
    const detail = (event as CustomEvent<{ topicId?: TopicId }>).detail;
    if (!detail?.topicId) return;
    if (!this.visibleTopicIds.has(detail.topicId)) return;
    this.selectTopic(detail.topicId);
  }

  changeFixedAssetType(nextType: FixedAssetType): void {
    this.selectedFixedAssetType = nextType;
    this.selectedFixedAssetId = this.fixedAssetsForType[0]?.id ?? null;
  }

  selectFixedAsset(id: string): void {
    this.selectedFixedAssetId = id;
  }

  addFixedAsset(): void {
    const nextNumericId =
      this.fixedAssets
        .map((item) => Number(item.objectId))
        .filter((item) => Number.isFinite(item))
        .reduce((max, item) => Math.max(max, item), 100000) + 1;
    const newAsset: FixedAssetRecord = {
      id: `fa-${crypto.randomUUID()}`,
      type: this.selectedFixedAssetType,
      objectId: String(nextNumericId),
      description: '',
      acquisitionDate: `${this.selectedYear}-01-01`,
      openingValue: 0,
      addition: 0,
      proceeds: 0,
      depreciationRate: this.selectedFixedAssetType === 'SA' ? 20 : 0,
      annualDepreciation: 0,
      closingValue: 0,
      balanceGroup: 'a',
      taxableDays: 365,
      linearCost: 0,
      linearLifetimeMonths: this.selectedFixedAssetType === 'LA' ? 60 : 0,
      nonDepreciableAdjustment: 0
    };
    this.fixedAssets = [...this.fixedAssets, newAsset];
    this.selectedFixedAssetId = newAsset.id;
    this.flash('Fixed Asset row created.');
  }

  deleteFixedAsset(): void {
    if (!this.selectedFixedAssetId) {
      return;
    }
    this.fixedAssets = this.fixedAssets.filter((item) => item.id !== this.selectedFixedAssetId);
    this.selectedFixedAssetId = this.fixedAssetsForType[0]?.id ?? null;
    this.flash('Fixed Asset row deleted.');
  }

  updateFixedAsset(field: keyof FixedAssetRecord, value: string | number): void {
    if (!this.selectedFixedAsset) {
      return;
    }
    this.fixedAssets = this.fixedAssets.map((item) =>
      item.id === this.selectedFixedAsset?.id ? { ...item, [field]: value } : item
    );
    this.recalculateSelectedFixedAsset();
  }

  saveFixedAssets(): void {
    this.lastSavedLabel = `Saved ${new Date().toLocaleTimeString('no-NO', {
      hour: '2-digit',
      minute: '2-digit'
    })}`;
    this.reportStatus = 'Draft';
    this.publishBlockedReason = 'Validation must be run after changes.';
    this.flash('Fixed Asset changes saved. Re-run validation before publish.');
  }

  private recalculateSelectedFixedAsset(): void {
    const selected = this.selectedFixedAsset;
    if (!selected) {
      return;
    }
    const nextClosing =
      selected.type === 'IA'
        ? selected.openingValue + selected.addition + selected.nonDepreciableAdjustment - selected.proceeds
        : selected.openingValue + selected.addition - selected.annualDepreciation - selected.proceeds;
    this.fixedAssets = this.fixedAssets.map((item) =>
      item.id === selected.id ? { ...item, closingValue: Math.max(0, Math.round(nextClosing)) } : item
    );
  }

  toggleTopicSettings(): void {
    this.topicSettingsOpen = !this.topicSettingsOpen;
  }

  isTopicVisible(topicId: TopicId): boolean {
    return this.visibleTopicIds.has(topicId);
  }

  isTopicFixed(topicId: TopicId): boolean {
    return this.fixedTopicIds.includes(topicId);
  }

  setTopicVisibility(topicId: TopicId, isVisible: boolean): void {
    if (this.fixedTopicIds.includes(topicId)) {
      return;
    }
    if (isVisible) {
      this.visibleTopicIds.add(topicId);
    } else {
      this.visibleTopicIds.delete(topicId);
      if (this.selectedTopicId === topicId) {
        this.selectTopic('overview');
      }
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

