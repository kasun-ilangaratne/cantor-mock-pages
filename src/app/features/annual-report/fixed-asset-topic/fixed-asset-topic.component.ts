import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AnleggsmiddelPayload, AnleggsmiddelRecord, AnleggsmiddelSaldogruppeGRow, AvskrType } from './fixed-asset-topic.model';
import { FixedAssetTopicService } from './fixed-asset-topic.service';

type FixedAssetDrawerTab = 'general' | 'values' | 'depreciation' | 'extended' | 'resource-rent';
type ResourceRentSubtypeTab = 'vannkraft' | 'landbasertVindkraft' | 'havbruk' | 'petroleum';
interface GainLossRow {
  id: string;
  gevTapId: string;
  naeringId: string;
  kommuneNr: string;
  ibVerdi: number;
  gevTapIA: number;
  gevVOpphDriftsgren: number;
  ervervetGevTapIB: number;
  verdiRealisertGevTap: number;
  grunnlag: number;
  sats: number;
  inntFradrIA: number;
  ubVerdi: number;
  realFraTomtJordSkog: boolean;
  gevFraGaardJordSkog: boolean;
  idAnlmSA: string;
}
@Component({
  selector: 'app-fixed-asset-topic',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './fixed-asset-topic.component.html',
  styleUrl: './fixed-asset-topic.component.scss'
})
export class FixedAssetTopicComponent implements OnInit {
  private service = inject(FixedAssetTopicService);

  payload = signal<AnleggsmiddelPayload | null>(null);
  original = signal<AnleggsmiddelPayload | null>(null);
  loading = signal(false);
  saving = signal(false);
  error = signal<string | null>(null);
  saveMessage = signal<string | null>(null);
  selectedType = signal<AvskrType>('SA');
  selectedTypeFilters = signal<AvskrType[]>([]);
  selectedId = signal<string | null>(null);
  dirty = signal(false);
  drawerOpen = false;
  editMode = false;
  drawerTab: FixedAssetDrawerTab = 'general';
  resourceRentSubtype: ResourceRentSubtypeTab = 'vannkraft';
  gainLossOpen = false;
  gainLossRows = signal<GainLossRow[]>([]);
  gainLossSelectedId = signal<string | null>(null);
  gainLossDraft = signal<GainLossRow | null>(null);
  gainLossMessage = signal<string | null>(null);
  overflowMenuOpen = signal(false);

  saldogrupper = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'];
  assetTypes: AvskrType[] = ['SA', 'LA', 'IA'];
  virksomhetSubtyper = new Set(['petroleum', 'havbruk', 'vannkraft', 'landbasertVindkraft']);

  filteredRecords = computed(() => {
    const records = this.payload()?.records ?? [];
    const activeFilters = this.selectedTypeFilters();
    if (activeFilters.length === 0) return records;
    return records.filter((record) => activeFilters.includes(record.avskrType));
  });

  selectedRecord = computed(() => {
    const id = this.selectedId();
    if (!id) return null;
    return (this.payload()?.records ?? []).find((record) => record.id === id) ?? null;
  });

  ngOnInit(): void {
    this.reload();
  }

  reload(): void {
    this.loading.set(true);
    this.error.set(null);
    this.saveMessage.set(null);
    this.service.get(1001, '2025').subscribe({
      next: (payload) => {
        this.payload.set(payload);
        this.original.set(this.clone(payload));
        this.dirty.set(false);
        const first = payload.records.find((r) => r.avskrType === this.selectedType()) ?? payload.records[0] ?? null;
        this.selectedId.set(first?.id ?? null);
        this.drawerOpen = false;
        this.editMode = false;
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.message ?? 'Failed to load fixed assets.');
        this.loading.set(false);
      }
    });
  }

  changeType(nextType: AvskrType): void {
    if (this.selectedType() === 'SA' && this.hasValidationErrorsForType('SA')) {
      this.error.set('Cannot switch from SA until validation errors are resolved.');
      return;
    }
    this.error.set(null);
    this.selectedType.set(nextType);
    const firstForType = (this.payload()?.records ?? []).find((r) => r.avskrType === nextType);
    this.selectedId.set(firstForType?.id ?? null);
    this.drawerOpen = false;
    this.editMode = false;
  }

  toggleTypeFilter(type: AvskrType): void {
    const current = this.selectedTypeFilters();
    if (current.includes(type)) {
      this.selectedTypeFilters.set(current.filter((value) => value !== type));
    } else {
      this.selectedTypeFilters.set([...current, type]);
    }
    const visible = this.filteredRecords();
    if (this.selectedId() && !visible.some((record) => record.id === this.selectedId())) {
      this.selectedId.set(visible[0]?.id ?? null);
      this.drawerOpen = false;
      this.editMode = false;
    }
  }

  isTypeFilterActive(type: AvskrType): boolean {
    return this.selectedTypeFilters().includes(type);
  }

  selectRecord(id: string): void {
    this.selectedId.set(id);
    this.drawerOpen = true;
    this.drawerTab = 'general';
  }

  startEditRecord(id: string): void {
    this.selectedId.set(id);
    this.drawerOpen = true;
    this.editMode = true;
    this.drawerTab = 'general';
  }

  resourceRentSubtypeOptions(): Array<{ id: ResourceRentSubtypeTab; label: string }> {
    const options: Array<{ id: ResourceRentSubtypeTab; label: string }> = [];
    if (this.hasSubtype('vannkraft')) options.push({ id: 'vannkraft', label: 'Hydropower' });
    if (this.hasSubtype('landbasertVindkraft')) options.push({ id: 'landbasertVindkraft', label: 'Onshore Wind' });
    if (this.hasSubtype('havbruk')) options.push({ id: 'havbruk', label: 'Aquaculture' });
    if (this.hasSubtype('petroleum')) options.push({ id: 'petroleum', label: 'Petroleum' });
    return options;
  }

  selectResourceRentSubtype(tab: ResourceRentSubtypeTab): void {
    this.resourceRentSubtype = tab;
  }

  closeDrawer(): void {
    this.drawerOpen = false;
    this.editMode = false;
  }

  addRecord(): void {
    this.patchPayload((draft) => {
      const nextObjektId = this.nextObjektId(draft.records);
      const record = this.service.createEmptyRecord(this.selectedType(), draft.firmanr, draft.aar, nextObjektId);
      draft.records.push(record);
      this.selectedId.set(record.id);
      this.drawerOpen = true;
      this.editMode = true;
    });
  }

  deleteSelected(): void {
    const id = this.selectedId();
    if (!id) return;
    if (!confirm('Do you want to delete the selected fixed asset?')) return;
    this.patchPayload((draft) => {
      draft.records = draft.records.filter((record) => record.id !== id);
      const firstForType = draft.records.find((record) => record.avskrType === this.selectedType());
      this.selectedId.set(firstForType?.id ?? null);
      this.drawerOpen = !!firstForType;
      this.editMode = !!firstForType;
    });
  }

  deleteById(id: string): void {
    if (!confirm('Do you want to delete this fixed asset row?')) return;
    this.patchPayload((draft) => {
      draft.records = draft.records.filter((record) => record.id !== id);
      const visible = draft.records.filter((record) => {
        const active = this.selectedTypeFilters();
        return active.length === 0 || active.includes(record.avskrType);
      });
      const next = visible[0] ?? draft.records[0] ?? null;
      this.selectedId.set(next?.id ?? null);
      this.drawerOpen = !!next;
      this.editMode = !!next;
    });
  }

  saveAndNext(): void {
    const currentId = this.selectedId();
    const currentRows = this.filteredRecords();
    const pos = currentRows.findIndex((row) => row.id === currentId);
    this.save();
    const next = currentRows[pos + 1];
    if (next) {
      this.selectedId.set(next.id);
      this.drawerOpen = true;
    }
  }

  openGevinstTap(): void {
    const selected = this.selectedRecord();
    if (!selected) return;
    const base = (selected.gevTilGevOgTapKonto ?? 0) - (selected.tapTilGevOgTapKonto ?? 0);
    const existing = this.gainLossRows();
    if (existing.length === 0) {
      const row = this.createGainLossRow(selected.objektId, selected.id, base);
      this.gainLossRows.set([row]);
      this.gainLossSelectedId.set(row.id);
      this.gainLossDraft.set({ ...row });
    } else if (!this.gainLossSelectedId()) {
      this.gainLossSelectedId.set(existing[0].id);
      this.gainLossDraft.set({ ...existing[0] });
    }
    this.gainLossOpen = true;
    this.gainLossMessage.set('Gain/Loss flow opened.');
  }

  canOpenGevinstTapSelected(): boolean {
    const selected = this.selectedRecord();
    return !!selected && this.service.canOpenGevinstTap(selected);
  }

  updateSelected<K extends keyof AnleggsmiddelRecord>(field: K, value: AnleggsmiddelRecord[K]): void {
    this.patchSelected((record) => {
      (record[field] as AnleggsmiddelRecord[K]) = value;
    });
  }

  updateNumber(field: keyof AnleggsmiddelRecord, value: number | string): void {
    const parsed = Number(value);
    this.patchSelected((record) => {
      (record[field] as unknown) = Number.isFinite(parsed) ? parsed : 0;
    });
  }

  updateSaldogruppe(value: string): void {
    this.patchSelected((record) => {
      if (record.avskrType !== 'SA') return;
      record.saSaldogruppe = value;
      if (!this.service.canOpenGevinstTap(record)) {
        record.gevTilGevOgTapKonto = 0;
        record.tapTilGevOgTapKonto = 0;
      }
    });
  }

  updateGrunnrente(field: keyof AnleggsmiddelRecord['grunnrente'], value: unknown): void {
    this.patchSelected((record) => {
      (record.grunnrente[field] as unknown) = value;
    });
  }

  showSaldogruppeGSection(record: AnleggsmiddelRecord): boolean {
    return record.avskrType === 'SA' && record.saSaldogruppe === 'g' && this.hasSubtype('vannkraft');
  }

  addSaldogruppeGRow(): void {
    this.patchSelected((record) => {
      if (record.avskrType !== 'SA') return;
      if (!record.saSaldogruppeGRows) record.saSaldogruppeGRows = [];
      record.saSaldogruppeGRows.push({
        id: crypto.randomUUID(),
        kommunenummer: '',
        erElektrotekniskUtrustningIKraftforetak: false
      });
    });
  }

  removeSaldogruppeGRow(rowId: string): void {
    this.patchSelected((record) => {
      if (record.avskrType !== 'SA' || !record.saSaldogruppeGRows) return;
      record.saSaldogruppeGRows = record.saSaldogruppeGRows.filter((row) => row.id !== rowId);
    });
  }

  updateSaldogruppeGRow<K extends keyof AnleggsmiddelSaldogruppeGRow>(
    rowId: string,
    field: K,
    value: AnleggsmiddelSaldogruppeGRow[K]
  ): void {
    this.patchSelected((record) => {
      if (record.avskrType !== 'SA' || !record.saSaldogruppeGRows) return;
      const row = record.saSaldogruppeGRows.find((item) => item.id === rowId);
      if (!row) return;
      row[field] = value;
    });
  }

  hasSubtype(type: 'petroleum' | 'havbruk' | 'vannkraft' | 'landbasertVindkraft'): boolean {
    return this.virksomhetSubtyper.has(type);
  }

  toNumber(value: unknown): number {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  isFieldOverridden(field: keyof AnleggsmiddelRecord): boolean {
    const current = this.selectedRecord();
    if (!current) return false;
    const baseline = this.originalRecordById(current.id);
    if (!baseline) return false;
    return !this.valuesEqual(current[field], baseline[field]);
  }

  isGrunnrenteOverridden(field: keyof AnleggsmiddelRecord['grunnrente']): boolean {
    const current = this.selectedRecord();
    if (!current) return false;
    const baseline = this.originalRecordById(current.id);
    if (!baseline) return false;
    return !this.valuesEqual(current.grunnrente?.[field], baseline.grunnrente?.[field]);
  }

  getCurrentRecordIndex(): number {
    const id = this.selectedId();
    if (!id) return -1;
    return this.filteredRecords().findIndex((record) => record.id === id);
  }

  resetSelectedOverrides(): void {
    this.patchSelected((record) => {
      if (record.avskrType === 'SA') {
        record.saSatsAvskr = 20;
        record.saAvskrIA = 0;
        record.saInntektsfortNegSaldoIA = 0;
      } else if (record.avskrType === 'LA') {
        record.laLevetid = 60;
        record.laAvskrIA = 0;
      } else {
        record.iaNyanskaffelse = 0;
      }
      record.gevTilGevOgTapKonto = 0;
      record.tapTilGevOgTapKonto = 0;
    });
  }

  printSelected(): void {
    const selected = this.selectedRecord();
    if (!selected) return;
    alert(`Mock print: Fixed Asset ${selected.objektId}.`);
  }

  closeGainLoss(): void {
    this.gainLossOpen = false;
  }

  toggleOverflowMenu(event: Event): void {
    event.stopPropagation();
    this.overflowMenuOpen.update((open) => !open);
  }

  closeOverflowMenu(): void {
    this.overflowMenuOpen.set(false);
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    if (this.overflowMenuOpen()) {
      this.overflowMenuOpen.set(false);
    }
  }

  selectGainLossRow(id: string): void {
    this.gainLossSelectedId.set(id);
    const row = this.gainLossRows().find((r) => r.id === id);
    this.gainLossDraft.set(row ? { ...row } : null);
  }

  addGainLossRow(): void {
    const selected = this.selectedRecord();
    if (!selected) return;
    const row = this.createGainLossRow(selected.objektId, selected.id, 0);
    this.gainLossRows.update((rows) => [row, ...rows]);
    this.gainLossSelectedId.set(row.id);
    this.gainLossDraft.set({ ...row });
  }

  deleteGainLossSelected(): void {
    const id = this.gainLossSelectedId();
    if (!id) return;
    this.gainLossRows.update((rows) => rows.filter((r) => r.id !== id));
    const next = this.gainLossRows()[0] ?? null;
    this.gainLossSelectedId.set(next?.id ?? null);
    this.gainLossDraft.set(next ? { ...next } : null);
  }

  updateGainLossDraft<K extends keyof GainLossRow>(field: K, value: GainLossRow[K]): void {
    const current = this.gainLossDraft();
    if (!current) return;
    const next = { ...current, [field]: value };
    this.gainLossDraft.set(this.recalcGainLoss(next));
  }

  saveGainLossDraft(): void {
    const draft = this.gainLossDraft();
    if (!draft) return;
    this.gainLossRows.update((rows) => rows.map((r) => (r.id === draft.id ? { ...draft } : r)));
    this.gainLossMessage.set('Gain/Loss row saved.');
    this.applyGainLossToSelectedAsset();
  }

  private applyGainLossToSelectedAsset(): void {
    const total = this.gainLossRows().reduce((sum, row) => sum + (row.gevTapIA ?? 0), 0);
    this.patchSelected((record) => {
      record.gevTilGevOgTapKonto = total > 0 ? total : 0;
      record.tapTilGevOgTapKonto = total < 0 ? Math.abs(total) : 0;
    });
  }

  private createGainLossRow(objektId: string, anlmId: string, gevTapIA: number): GainLossRow {
    const row: GainLossRow = {
      id: crypto.randomUUID(),
      gevTapId: `GT-${Date.now().toString().slice(-6)}`,
      naeringId: '',
      kommuneNr: '',
      ibVerdi: 0,
      gevTapIA,
      gevVOpphDriftsgren: 0,
      ervervetGevTapIB: 0,
      verdiRealisertGevTap: 0,
      grunnlag: 0,
      sats: 20,
      inntFradrIA: 0,
      ubVerdi: 0,
      realFraTomtJordSkog: false,
      gevFraGaardJordSkog: false,
      idAnlmSA: objektId || anlmId
    };
    return this.recalcGainLoss(row);
  }

  private recalcGainLoss(row: GainLossRow): GainLossRow {
    const grunnlag =
      (row.ibVerdi ?? 0) +
      (row.gevTapIA ?? 0) +
      (row.gevVOpphDriftsgren ?? 0) +
      (row.ervervetGevTapIB ?? 0) +
      (row.verdiRealisertGevTap ?? 0);
    const inntFradrIA = (grunnlag * (row.sats ?? 0)) / 100;
    const ubVerdi = grunnlag - inntFradrIA;
    return { ...row, grunnlag, inntFradrIA, ubVerdi };
  }

  exportCurrentType(): void {
    const type = this.selectedTypeFilters().length > 0 ? this.selectedTypeFilters().join('-') : 'all';
    const rows = this.filteredRecords();
    if (rows.length === 0) return;
    const header = 'objektId,objektBeskrivelse,inngVerdi,utgVerdi';
    const csvRows = rows.map((r) =>
      [r.objektId, r.objektBeskrivelse, r.inngVerdi ?? 0, r.utgVerdi ?? 0]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(',')
    );
    const blob = new Blob([[header, ...csvRows].join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `fixed-asset-${type}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  save(): void {
    const payload = this.payload();
    if (!payload || !this.dirty()) return;
    this.saving.set(true);
    this.error.set(null);
    this.saveMessage.set(null);
    this.service.save(payload).subscribe({
      next: (saved) => {
        this.payload.set(saved);
        this.original.set(this.clone(saved));
        this.dirty.set(false);
        this.saving.set(false);
        this.saveMessage.set('Changes saved.');
      },
      error: (err) => {
        this.error.set(err?.message ?? 'Failed to save fixed assets.');
        this.saving.set(false);
      }
    });
  }

  openGuide(): void {
    this.saveMessage.set('Guide action is available (PDF in Delphi).');
  }

  goToNextTopic(): void {
    this.saveMessage.set('Next topic navigation is available.');
  }

  private hasValidationErrorsForType(type: AvskrType): boolean {
    const records = (this.payload()?.records ?? []).filter((record) => record.avskrType === type);
    return records.some((record) => {
      if (!record.objektBeskrivelse?.trim()) return true;
      if (record.avskrType === 'SA') {
        return !record.saSaldogruppe || (record.saSatsAvskr ?? 0) < 0 || (record.saSatsAvskr ?? 0) > 100;
      }
      if (record.avskrType === 'LA') return (record.laLevetid ?? 0) <= 0;
      return false;
    });
  }

  private patchSelected(mutator: (record: AnleggsmiddelRecord) => void): void {
    const id = this.selectedId();
    if (!id) return;
    this.patchPayload((draft) => {
      const target = draft.records.find((record) => record.id === id);
      if (!target) return;
      mutator(target);
    });
  }

  private patchPayload(mutator: (draft: AnleggsmiddelPayload) => void): void {
    const current = this.payload();
    if (!current) return;
    const draft = this.clone(current);
    mutator(draft);
    this.payload.set(draft);
    this.dirty.set(JSON.stringify(draft) !== JSON.stringify(this.original()));
    this.saveMessage.set(null);
    this.error.set(null);
  }

  private nextObjektId(records: AnleggsmiddelRecord[]): string {
    const max = records
      .map((record) => Number(record.objektId))
      .filter(Number.isFinite)
      .reduce((acc, n) => Math.max(acc, n), 100000);
    return String(max + 1);
  }

  private originalRecordById(id: string): AnleggsmiddelRecord | null {
    return this.original()?.records.find((record) => record.id === id) ?? null;
  }

  private valuesEqual(a: unknown, b: unknown): boolean {
    return JSON.stringify(a ?? null) === JSON.stringify(b ?? null);
  }

  private clone<T>(value: T): T {
    return JSON.parse(JSON.stringify(value)) as T;
  }
}
