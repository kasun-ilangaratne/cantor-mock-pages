import { Injectable } from '@angular/core';

import {
  AssetValueUpdateResult,
  ShareGroup,
  Shareholding,
  ShareholdingDraft,
  ShareImportResult
} from './shares.models';

interface SharesState {
  groups: ShareGroup[];
  shareholdingsByYear: Record<string, Shareholding[]>;
}

@Injectable({
  providedIn: 'root'
})
export class SharesService {
  private state: SharesState = this.createSeedState();

  getShareholdings(year: number): Shareholding[] {
    const state = this.getState();
    return [...(state.shareholdingsByYear[year] ?? [])]
      .sort((a, b) => a.company.localeCompare(b.company));
  }

  getShareholding(year: number, id: string): Shareholding | null {
    return this.getShareholdings(year).find((item) => item.id === id) ?? null;
  }

  saveShareholding(year: number, draft: ShareholdingDraft, id?: string): Shareholding {
    const state = this.getState();
    const records = [...(state.shareholdingsByYear[year] ?? [])];
    const shareholding: Shareholding = {
      id: id ?? this.createId(),
      company: draft.company.trim(),
      organizationNumber: draft.organizationNumber.trim(),
      type: draft.type.trim(),
      groupId: draft.groupId || null,
      companyInCantor: draft.companyInCantor || null,
      officeMunicipality: draft.officeMunicipality,
      currency: draft.currency,
      norwegianCompany: !!draft.norwegianCompany,
      openingBalanceShares: Number(draft.openingBalanceShares) || 0,
      yearEndShares: Number(draft.yearEndShares) || 0,
      activeAtYearEnd: !!draft.activeAtYearEnd,
      riskEntries: (draft.riskEntries ?? []).map((entry) => ({ ...entry })),
      taxableAssetValue: Number(draft.taxableAssetValue) || 0,
      appraisedValue: Number(draft.appraisedValue) || 0,
      accountingValue: Number(draft.accountingValue) || 0,
      listedCompanyStatedInitialValue: Number(draft.listedCompanyStatedInitialValue) || 0,
      parValue: Number(draft.parValue) || 0,
      shareCapital: Number(draft.shareCapital) || 0,
      equityLastYear: Number(draft.equityLastYear) || 0,
      profitLastYear: Number(draft.profitLastYear) || 0,
      totalDividendReceived: Number(draft.totalDividendReceived) || 0,
      withholdingTaxDeducted: Number(draft.withholdingTaxDeducted) || 0,
      assessedTotalAccountingValue: Number(draft.assessedTotalAccountingValue) || 0,
      transferToTaxReturn: !!draft.transferToTaxReturn,
      shareValueEntries: draft.shareValueEntries.map((entry) => ({ ...entry })),
      lastUpdated: new Date().toISOString()
    };

    const index = records.findIndex((item) => item.id === shareholding.id);
    if (index >= 0) {
      records[index] = shareholding;
    } else {
      records.push(shareholding);
    }

    state.shareholdingsByYear[year] = records;
    this.saveState(state);
    return shareholding;
  }

  deleteShareholding(year: number, id: string): void {
    const state = this.getState();
    state.shareholdingsByYear[year] = (state.shareholdingsByYear[year] ?? [])
      .filter((item) => item.id !== id);
    this.saveState(state);
  }

  getGroups(): ShareGroup[] {
    return [...this.getState().groups].sort((a, b) => a.name.localeCompare(b.name));
  }

  saveGroup(group: Partial<ShareGroup>): ShareGroup {
    const state = this.getState();
    const nextGroup: ShareGroup = {
      id: group.id ?? this.createId(),
      name: (group.name ?? '').trim(),
      description: (group.description ?? '').trim()
    };
    const existingIndex = state.groups.findIndex((item) => item.id === nextGroup.id);

    if (existingIndex >= 0) {
      state.groups[existingIndex] = nextGroup;
    } else {
      state.groups.push(nextGroup);
    }

    this.saveState(state);
    return nextGroup;
  }

  deleteGroup(groupId: string): void {
    const state = this.getState();
    state.groups = state.groups.filter((group) => group.id !== groupId);

    Object.keys(state.shareholdingsByYear).forEach((year) => {
      state.shareholdingsByYear[year] = state.shareholdingsByYear[year].map((item) => ({
        ...item,
        groupId: item.groupId === groupId ? null : item.groupId
      }));
    });

    this.saveState(state);
  }

  importFromExcel(year: number, fileName: string, replaceExisting = false): ShareImportResult {
    const baseName = fileName.replace(/\.[^.]+$/, '') || 'Imported';
    const state = this.getState();
    const existing = replaceExisting ? [] : [...(state.shareholdingsByYear[year] ?? [])];
    const importedAt = new Date().toISOString();

    const importedRows: Shareholding[] = [
      {
        id: this.createId(),
        company: `${baseName} Holding AS`,
        organizationNumber: this.createOrgNumber(1),
        type: 'Share',
        groupId: state.groups[0]?.id ?? null,
        companyInCantor: 'Cantor Holding AS',
        officeMunicipality: 'Oslo',
        currency: 'NOK',
        norwegianCompany: true,
        openingBalanceShares: 100,
        yearEndShares: 125,
        activeAtYearEnd: true,
        riskEntries: [],
        taxableAssetValue: 0,
        appraisedValue: 0,
        accountingValue: 0,
        listedCompanyStatedInitialValue: 0,
        parValue: 10,
        shareCapital: 1000,
        equityLastYear: 150000,
        profitLastYear: 18000,
        totalDividendReceived: 0,
        withholdingTaxDeducted: 0,
        assessedTotalAccountingValue: 150000,
        transferToTaxReturn: true,
        shareValueEntries: [
          { id: this.createId(), date: new Date().toISOString().slice(0, 10), text: 'Buy', shares: 100, price: 125, costs: 0 }
        ],
        assetValueNote: 'Imported from Excel',
        lastUpdated: importedAt
      },
      {
        id: this.createId(),
        company: `${baseName} Invest AS`,
        organizationNumber: this.createOrgNumber(2),
        type: 'Security',
        groupId: state.groups[1]?.id ?? null,
        companyInCantor: 'Cantor Services AS',
        officeMunicipality: 'Bergen',
        currency: 'NOK',
        norwegianCompany: true,
        openingBalanceShares: 40,
        yearEndShares: 0,
        activeAtYearEnd: false,
        riskEntries: [],
        taxableAssetValue: 0,
        appraisedValue: 0,
        accountingValue: 0,
        listedCompanyStatedInitialValue: 0,
        parValue: 20,
        shareCapital: 800,
        equityLastYear: 90000,
        profitLastYear: -4000,
        totalDividendReceived: 0,
        withholdingTaxDeducted: 0,
        assessedTotalAccountingValue: 90000,
        transferToTaxReturn: false,
        shareValueEntries: [
          { id: this.createId(), date: new Date().toISOString().slice(0, 10), text: 'Buy', shares: 40, price: 110, costs: 0 }
        ],
        assetValueNote: 'Imported from Excel',
        lastUpdated: importedAt
      }
    ];

    state.shareholdingsByYear[year] = [...existing, ...importedRows];
    this.saveState(state);

    return {
      importedCount: importedRows.length,
      fileName
    };
  }

  updateAssetValues(year: number): AssetValueUpdateResult {
    const state = this.getState();
    const updatedAt = new Date().toISOString();
    const records = (state.shareholdingsByYear[year] ?? []).map((item) => ({
      ...item,
      assetValueNote: `Updated from Cantor companies on ${new Date(updatedAt).toLocaleDateString()}`,
      lastUpdated: updatedAt
    }));

    state.shareholdingsByYear[year] = records;
    this.saveState(state);

    return {
      updatedCount: records.length,
      updatedAt
    };
  }

  private getState(): SharesState {
    return this.state;
  }

  private saveState(state: SharesState): void {
    this.state = {
      groups: [...state.groups],
      shareholdingsByYear: Object.fromEntries(
        Object.entries(state.shareholdingsByYear).map(([year, shareholdings]) => [
          year,
          shareholdings.map((shareholding) => ({ ...shareholding }))
        ])
      )
    };
  }

  private createSeedState(): SharesState {
    const groups: ShareGroup[] = [
      { id: 'group-core', name: 'Core holdings', description: 'Long-term strategic holdings' },
      { id: 'group-financial', name: 'Financial investments', description: 'Financial share investments' },
      { id: 'group-exited', name: 'Exited', description: 'Holdings closed during the year' }
    ];

    return {
      groups,
      shareholdingsByYear: {
        '2024': [
          {
            id: 'share-1',
            company: 'Northwind Invest AS',
            organizationNumber: '918273645',
            type: 'Share',
            groupId: groups[0].id,
            companyInCantor: 'Cantor Holding AS',
            officeMunicipality: 'Oslo',
            currency: 'NOK',
            norwegianCompany: true,
            openingBalanceShares: 150,
            yearEndShares: 150,
            activeAtYearEnd: true,
            riskEntries: [
              { id: 'risk-2023-1', år: 2023, riskBeløp: 80 },
              { id: 'risk-2024-1', år: 2024, riskBeløp: 100 },
              { id: 'risk-2025-1', år: 2025, riskBeløp: 50 }
            ],
            taxableAssetValue: 120000,
            appraisedValue: 130000,
            accountingValue: 125000,
            listedCompanyStatedInitialValue: 140000,
            parValue: 10,
            shareCapital: 1500,
            equityLastYear: 250000,
            profitLastYear: 32000,
            totalDividendReceived: 8000,
            withholdingTaxDeducted: 0,
            assessedTotalAccountingValue: 265000,
            transferToTaxReturn: true,
            shareValueEntries: [
              { id: 'entry-1', date: '2024-01-10', text: 'Buy', shares: 150, price: 100, costs: 0 }
            ],
            lastUpdated: new Date().toISOString()
          },
          {
            id: 'share-2',
            company: 'Fjord Securities AS',
            organizationNumber: '829374651',
            type: 'Security',
            groupId: groups[1].id,
            companyInCantor: 'Cantor Services AS',
            officeMunicipality: 'Bergen',
            currency: 'NOK',
            norwegianCompany: true,
            openingBalanceShares: 75,
            yearEndShares: 50,
            activeAtYearEnd: true,
            riskEntries: [
              { id: 'risk-2022-2', år: 2022, riskBeløp: 20 },
              { id: 'risk-2024-2', år: 2024, riskBeløp: 50 },
              { id: 'risk-2025-2', år: 2025, riskBeløp: 15 }
            ],
            taxableAssetValue: 60000,
            appraisedValue: 65000,
            accountingValue: 62000,
            listedCompanyStatedInitialValue: 70000,
            parValue: 25,
            shareCapital: 5000,
            equityLastYear: 120000,
            profitLastYear: 15000,
            totalDividendReceived: 3000,
            withholdingTaxDeducted: 0,
            assessedTotalAccountingValue: 132000,
            transferToTaxReturn: false,
            shareValueEntries: [
              { id: 'entry-2', date: '2024-03-12', text: 'Buy', shares: 75, price: 80, costs: 50 },
              { id: 'entry-3', date: '2024-09-01', text: 'Sell', shares: -25, price: 90, costs: 10 }
            ],
            lastUpdated: new Date().toISOString()
          }
        ],
        '2025': [
          {
            id: 'share-3',
            company: 'Polar Ventures AS',
            organizationNumber: '934567812',
            type: 'Share',
            groupId: groups[0].id,
            companyInCantor: 'Cantor Holding AS',
            officeMunicipality: 'Oslo',
            currency: 'NOK',
            norwegianCompany: true,
            openingBalanceShares: 200,
            yearEndShares: 240,
            activeAtYearEnd: true,
            riskEntries: [
              { id: 'risk-2023-3', år: 2023, riskBeløp: 25 },
              { id: 'risk-2024-3', år: 2024, riskBeløp: 10 },
              { id: 'risk-2025-3', år: 2025, riskBeløp: 25 },
              { id: 'risk-2026-3', år: 2026, riskBeløp: 5 }
            ],
            taxableAssetValue: 90000,
            appraisedValue: 98000,
            accountingValue: 94000,
            listedCompanyStatedInitialValue: 102000,
            parValue: 12,
            shareCapital: 2400,
            equityLastYear: 340000,
            profitLastYear: 45000,
            totalDividendReceived: 12000,
            withholdingTaxDeducted: 500,
            assessedTotalAccountingValue: 360000,
            transferToTaxReturn: true,
            shareValueEntries: [
              { id: 'entry-4', date: '2025-04-25', text: 'Buy', shares: 140, price: 100, costs: 0 },
              { id: 'entry-5', date: '2025-05-12', text: 'Sell', shares: -20, price: 120, costs: 10 }
            ],
            lastUpdated: new Date().toISOString()
          },
          {
            id: 'share-4',
            company: 'Aurora Capital ASA',
            organizationNumber: '945678123',
            type: 'Security',
            groupId: groups[1].id,
            companyInCantor: null,
            officeMunicipality: 'Trondheim',
            currency: 'EUR',
            norwegianCompany: false,
            openingBalanceShares: 120,
            yearEndShares: 0,
            activeAtYearEnd: false,
            riskEntries: [],
            taxableAssetValue: 0,
            appraisedValue: 0,
            accountingValue: 0,
            listedCompanyStatedInitialValue: 0,
            parValue: 15,
            shareCapital: 1800,
            equityLastYear: 90000,
            profitLastYear: -5000,
            totalDividendReceived: 0,
            withholdingTaxDeducted: 0,
            assessedTotalAccountingValue: 87000,
            transferToTaxReturn: false,
            shareValueEntries: [
              { id: 'entry-6', date: '2025-02-10', text: 'Buy', shares: 120, price: 95, costs: 0 },
              { id: 'entry-7', date: '2025-11-03', text: 'Sell', shares: -120, price: 98, costs: 35 }
            ],
            lastUpdated: new Date().toISOString()
          }
        ]
      }
    };
  }

  private createId(): string {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }

  private createOrgNumber(seed: number): string {
    return `9${Date.now().toString().slice(-7)}${seed}`.slice(0, 9);
  }
}
