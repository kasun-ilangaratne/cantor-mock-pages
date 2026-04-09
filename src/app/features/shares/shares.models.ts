export interface ShareGroup {
  id: string;
  name: string;
  description: string;
}

export interface Shareholding {
  id: string;
  company: string;
  organizationNumber: string;
  type: string;
  groupId: string | null;
  companyInCantor: string | null;
  officeMunicipality: string;
  currency: string;
  norwegianCompany: boolean;
  openingBalanceShares: number;
  yearEndShares: number;
  activeAtYearEnd: boolean;
  riskEntries: ShareRiskEntry[];
  // Inngangsverdi pr 01.01.1992 (initial value for tax/accounting workflows)
  taxableAssetValue: number; // Skattemessig formue
  appraisedValue: number; // Takstverdi
  accountingValue: number; // Regnskapsmessig verdi
  listedCompanyStatedInitialValue: number; // Børsnotert selskaps oppgitte inngangsverdi
  parValue: number;
  shareCapital: number;
  equityLastYear: number;
  profitLastYear: number;
  totalDividendReceived: number;
  withholdingTaxDeducted: number;
  assessedTotalAccountingValue: number;
  transferToTaxReturn: boolean;
  shareValueEntries: ShareValueEntry[];
  assetValueNote?: string;
  lastUpdated: string;
}

export interface ShareholdingDraft {
  company: string;
  organizationNumber: string;
  type: string;
  groupId: string | null;
  companyInCantor: string | null;
  officeMunicipality: string;
  currency: string;
  norwegianCompany: boolean;
  openingBalanceShares: number;
  yearEndShares: number;
  activeAtYearEnd: boolean;
  riskEntries: ShareRiskEntry[];
  // Inngangsverdi pr 01.01.1992 (initial value for tax/accounting workflows)
  taxableAssetValue: number;
  appraisedValue: number;
  accountingValue: number;
  listedCompanyStatedInitialValue: number;
  parValue: number;
  shareCapital: number;
  equityLastYear: number;
  profitLastYear: number;
  totalDividendReceived: number;
  withholdingTaxDeducted: number;
  assessedTotalAccountingValue: number;
  transferToTaxReturn: boolean;
  shareValueEntries: ShareValueEntry[];
}

export interface ShareValueEntry {
  id: string;
  date: string;
  text: 'Buy' | 'Sell';
  shares: number;
  price: number;
  costs: number;
}

export interface ShareRiskEntry {
  id: string;
  år: number;
  riskBeløp: number;
}

export interface ShareImportResult {
  importedCount: number;
  fileName: string;
}

export interface AssetValueUpdateResult {
  updatedCount: number;
  updatedAt: string;
}
