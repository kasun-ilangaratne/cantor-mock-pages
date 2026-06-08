import { CommonModule } from '@angular/common';
import { Component, HostListener, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface EgenkapState {
  Id: string;
  Firmanr: number;
  Aar: string;
  UtsattSkattefordel: number;
  UtsattSkatt: number;
  EgenkapitalIB: number;
  EgenkapitalIB_O: boolean;
  SumTilleggIEgenkap: number;
  SumFradragIEgenkap: number;
  SumNettoPosPrinsippendring: number;
  SumNettoNegPrinsippendring: number;
  EgenkapitalUB: number;
  BalansensEgenkapital: number;
  Differanse: number;
}

interface EgenkapEndringRow {
  id: string;
  firmanr: number;
  aar: string;
  egenkapitalendringstype: string;
  belop: number;
  belop_O: boolean;
}

interface PrinsippendringRow {
  id: string;
  firmanr: number;
  aar: string;
  resOgBalanseregnskapstype: string;
  posPrinsippendring: number;
  negPrinsippendring: number;
}

@Component({
  selector: 'app-equity-reconciliation-topic',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="equity-reconciliation-topic">
      <div class="top-header">
        <div class="toolbar"></div>
        <div class="top-right-help">
          <button type="button" class="next-btn" (click)="goToNextTopic()">Next topic →</button>
          <div class="overflow-menu top-right-menu" (click)="$event.stopPropagation()">
            <button type="button" class="overflow-trigger" (click)="toggleOverflowMenu($event)" aria-label="More options" title="More options">⋮</button>
            <div class="overflow-panel" *ngIf="overflowMenuOpen()">
              <button type="button" (click)="printTopic(); closeOverflowMenu()">Print</button>
              <button type="button" (click)="exportGrid1(); closeOverflowMenu()">Export equity changes</button>
              <button type="button" (click)="exportGrid2(); closeOverflowMenu()">Export principle changes</button>
            </div>
          </div>
          <button type="button" class="help-icon-btn" (click)="openGuide()" aria-label="Help" title="Help">?</button>
        </div>
      </div>
      <div class="topic-body">
      <div class="card">
      <div class="grid">
        <label>Equity opening <input type="number" [ngModel]="state().EgenkapitalIB" (ngModelChange)="markEgenkapitalIbOverride($event)" /></label>
        <label>Additions equity <input type="number" [ngModel]="state().SumTilleggIEgenkap" readonly /></label>
        <label>Deductions equity <input type="number" [ngModel]="state().SumFradragIEgenkap" readonly /></label>
        <label>Net positive principle change <input type="number" [(ngModel)]="state().SumNettoPosPrinsippendring" (ngModelChange)="setPosPrinciple($event)" /></label>
        <label>Net negative principle change <input type="number" [(ngModel)]="state().SumNettoNegPrinsippendring" (ngModelChange)="setNegPrinciple($event)" /></label>
        <label>Equity closing <input type="number" [ngModel]="state().EgenkapitalUB" readonly /></label>
        <label>Difference <input type="number" [ngModel]="state().Differanse" readonly /></label>
      </div>
      </div>
      <div class="section-head">
        <h4>Equity Changes</h4>
        <button type="button" class="add-btn" (click)="addEgenkapEndring()">Add</button>
      </div>
      <section class="card">
      <table>
        <thead>
          <tr>
            <th>Type</th>
            <th>Amount</th>
            <th class="actions-col"></th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let row of egenkapEndringer(); let i = index">
            <td>
              <select [ngModel]="row.egenkapitalendringstype" (ngModelChange)="updateEndringType(i, $event)">
                <option *ngFor="let option of equityTypeOptions()" [value]="option">{{ option }}</option>
              </select>
            </td>
            <td><input type="number" [ngModel]="row.belop" (ngModelChange)="updateEndringBelop(i, $event)" /></td>
            <td><button type="button" class="icon-btn danger-icon-btn" title="Delete" aria-label="Delete" (click)="removeEgenkapEndring(i)">🗑</button></td>
          </tr>
        </tbody>
      </table>
      </section>
      <div class="section-head">
        <h4>Principle Changes</h4>
        <button type="button" class="add-btn" (click)="addPrinsippendring()">Add</button>
      </div>
      <section class="card">
      <table>
        <thead>
          <tr>
            <th>Type</th>
            <th>Positive</th>
            <th>Negative</th>
            <th class="actions-col"></th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let row of prinsippendringer(); let i = index">
            <td>
              <select [ngModel]="row.resOgBalanseregnskapstype" (ngModelChange)="updatePrinsippType(i, $event)">
                <option *ngFor="let option of principleTypeOptions()" [value]="option">{{ option }}</option>
              </select>
            </td>
            <td><input type="number" [(ngModel)]="row.posPrinsippendring" (ngModelChange)="setPrinsippPos(i, $event)" /></td>
            <td><input type="number" [(ngModel)]="row.negPrinsippendring" (ngModelChange)="setPrinsippNeg(i, $event)" /></td>
            <td><button type="button" class="icon-btn danger-icon-btn" title="Delete" aria-label="Delete" (click)="removePrinsippendring(i)">🗑</button></td>
          </tr>
        </tbody>
      </table>
      </section>
      <div class="bottom-toolbar">
        <button type="button" *ngIf="state().Differanse !== 0" (click)="applyUpdateFlow()">Update</button>
        <button type="button" (click)="resetToBaseline()">Reset</button>
        <button type="button" (click)="resetGrid2LikeDelphi()">Reset grid 2</button>
        <button type="button" (click)="resetIbandRecompute()">Reset IB and recalc</button>
      </div>
      <p class="muted" *ngIf="statusMessage()">{{ statusMessage() }}</p>
      </div>
    </section>
  `,
  styles: [`
    .equity-reconciliation-topic{display:block;position:relative;min-height:calc(100vh - 112px)}
    h3,h4{margin:0}
    .top-header{display:flex;justify-content:space-between;align-items:flex-start;gap:10px;flex-wrap:wrap}
    .toolbar{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
    .top-right-help{display:flex;flex-direction:column;align-items:flex-end;gap:6px}
    .overflow-menu{position:relative}
    .overflow-trigger{border:1px solid #cbd5e1;border-radius:6px;padding:3px 8px;background:#f8fafc;cursor:pointer;font-size:18px;line-height:1}
    .overflow-panel{position:absolute;top:34px;right:0;z-index:20;display:grid;gap:6px;min-width:210px;padding:8px;border:1px solid #dbe1ea;border-radius:8px;background:#fff;box-shadow:0 8px 20px rgba(15,23,42,.12)}
    .overflow-panel button{text-align:left}
    .help-icon-btn{width:30px;height:30px;border-radius:999px;padding:0;font-weight:700;display:inline-flex;align-items:center;justify-content:center;background:#eff6ff;border:1px solid #bfdbfe;color:#1e40af}
    .next-btn{background:#eff6ff;border-color:#bfdbfe;color:#1e40af;font-weight:600}
    .topic-body{display:grid;gap:10px;margin-top:8px}
    .card{border:1px solid #dbe1ea;border-radius:8px;padding:12px;background:#fff}
    .bottom-toolbar{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
    .section-head{display:flex;justify-content:space-between;align-items:center;gap:8px}
    .grid{display:grid;gap:8px;grid-template-columns:repeat(2,minmax(220px,1fr))}
    label{display:flex;flex-direction:column;font-size:12px;gap:4px;color:#475569;line-height:1.35}
    table{width:100%;border-collapse:collapse}
    th,td{padding:10px 8px;border-bottom:1px solid #e5e7eb;font-size:13px;text-align:left}
    thead{background:#f8fafc}
    input,button{border:1px solid #cbd5e1;border-radius:6px;padding:7px 9px;font-size:13px}
    input[readonly],input:disabled,select:disabled{background:#f1f5f9;color:#64748b;cursor:not-allowed}
    select{border:1px solid #cbd5e1;border-radius:6px;padding:7px 9px;font-size:13px;background:#fff}
    button{background:#f8fafc;cursor:pointer}
    .add-btn{background:#eff6ff;border-color:#bfdbfe;color:#1e40af;font-weight:600}
    .icon-btn{padding:6px 8px;line-height:1}
    .danger-icon-btn{color:#b91c1c;border-color:#fecaca;background:#fff1f2}
    .actions-col{text-align:right;width:110px}
    .muted{color:#64748b;font-size:12px}
  `]
})
export class EquityReconciliationTopicComponent {
  readonly overflowMenuOpen = signal(false);
  readonly statusMessage = signal('');
  readonly equityTypeOptions = signal<string[]>([
    'resultatEtterSkatt',
    'utbytte',
    'egenkapitalinnskudd',
    'annenEndring'
  ]);
  readonly principleTypeOptions = signal<string[]>([
    'resultatregnskap',
    'balanseregnskap',
    'annenPrinsippendring'
  ]);
  private readonly minusTypes = new Set<string>(['utbytte', 'annenNegativEndring']);
  readonly state = signal<EgenkapState>({ Id: '0000001', Firmanr: 1, Aar: '2025', UtsattSkattefordel: 0, UtsattSkatt: 0, EgenkapitalIB: 1000000, EgenkapitalIB_O: false, SumTilleggIEgenkap: 210000, SumFradragIEgenkap: 90000, SumNettoPosPrinsippendring: 0, SumNettoNegPrinsippendring: 0, EgenkapitalUB: 0, BalansensEgenkapital: 1120000, Differanse: 0 });
  readonly egenkapEndringer = signal<EgenkapEndringRow[]>([
    { id: crypto.randomUUID(), firmanr: 1, aar: '2025', egenkapitalendringstype: 'resultatEtterSkatt', belop: 210000, belop_O: false },
    { id: crypto.randomUUID(), firmanr: 1, aar: '2025', egenkapitalendringstype: 'utbytte', belop: -90000, belop_O: false }
  ]);
  readonly prinsippendringer = signal<PrinsippendringRow[]>([
    { id: crypto.randomUUID(), firmanr: 1, aar: '2025', resOgBalanseregnskapstype: 'resultatregnskap', posPrinsippendring: 0, negPrinsippendring: 0 }
  ]);
  readonly baselineState = signal<EgenkapState>({ Id: '0000001', Firmanr: 1, Aar: '2025', UtsattSkattefordel: 0, UtsattSkatt: 0, EgenkapitalIB: 1000000, EgenkapitalIB_O: false, SumTilleggIEgenkap: 210000, SumFradragIEgenkap: 90000, SumNettoPosPrinsippendring: 0, SumNettoNegPrinsippendring: 0, EgenkapitalUB: 0, BalansensEgenkapital: 1120000, Differanse: 0 });
  setPosPrinciple(v: number): void {
    const s = this.state();
    this.state.set({ ...s, SumNettoPosPrinsippendring: Number(v) || 0, SumNettoNegPrinsippendring: v ? 0 : s.SumNettoNegPrinsippendring });
    this.recalc(false);
  }
  setNegPrinciple(v: number): void {
    const s = this.state();
    this.state.set({ ...s, SumNettoNegPrinsippendring: Number(v) || 0, SumNettoPosPrinsippendring: v ? 0 : s.SumNettoPosPrinsippendring });
    this.recalc(false);
  }
  recalc(_forced: boolean): void {
    const s = this.state();
    const sumTillegg = this.egenkapEndringer()
      .filter((r) => !this.minusTypes.has(r.egenkapitalendringstype) && r.belop >= 0)
      .reduce((sum, r) => sum + r.belop, 0);
    const sumFradrag = this.egenkapEndringer()
      .filter((r) => this.minusTypes.has(r.egenkapitalendringstype) || r.belop < 0)
      .reduce((sum, r) => sum + Math.abs(r.belop), 0);
    const sumPos = this.prinsippendringer().reduce((sum, r) => sum + r.posPrinsippendring, 0);
    const sumNeg = this.prinsippendringer().reduce((sum, r) => sum + r.negPrinsippendring, 0);
    const ub = s.EgenkapitalIB + s.SumTilleggIEgenkap - s.SumFradragIEgenkap + s.SumNettoPosPrinsippendring - s.SumNettoNegPrinsippendring;
    const computedUb = s.EgenkapitalIB + sumTillegg - sumFradrag + sumPos - sumNeg;
    this.state.set({ ...s, SumTilleggIEgenkap: sumTillegg, SumFradragIEgenkap: sumFradrag, SumNettoPosPrinsippendring: sumPos, SumNettoNegPrinsippendring: sumNeg, EgenkapitalUB: computedUb || ub, Differanse: s.BalansensEgenkapital - (computedUb || ub) });
  }

  setPrinsippPos(index: number, value: number): void {
    this.prinsippendringer.update((rows) => rows.map((row, i) => (i === index ? { ...row, posPrinsippendring: Number(value) || 0, negPrinsippendring: value ? 0 : row.negPrinsippendring } : row)));
    this.recalc(false);
  }

  setPrinsippNeg(index: number, value: number): void {
    this.prinsippendringer.update((rows) => rows.map((row, i) => (i === index ? { ...row, negPrinsippendring: Number(value) || 0, posPrinsippendring: value ? 0 : row.posPrinsippendring } : row)));
    this.recalc(false);
  }

  addEgenkapEndring(): void {
    this.egenkapEndringer.update((rows) => [...rows, { id: crypto.randomUUID(), firmanr: 1, aar: '2025', egenkapitalendringstype: '', belop: 0, belop_O: false }]);
  }

  removeEgenkapEndring(index: number): void {
    this.egenkapEndringer.update((rows) => rows.filter((_, i) => i !== index));
    this.recalc(false);
  }

  addPrinsippendring(): void {
    this.prinsippendringer.update((rows) => [...rows, { id: crypto.randomUUID(), firmanr: 1, aar: '2025', resOgBalanseregnskapstype: '', posPrinsippendring: 0, negPrinsippendring: 0 }]);
  }

  removePrinsippendring(index: number): void {
    this.prinsippendringer.update((rows) => rows.filter((_, i) => i !== index));
    this.recalc(false);
  }

  resetToBaseline(): void {
    this.state.set({ ...this.baselineState() });
    this.egenkapEndringer.set([
      { id: crypto.randomUUID(), firmanr: 1, aar: '2025', egenkapitalendringstype: 'resultatEtterSkatt', belop: 210000, belop_O: false },
      { id: crypto.randomUUID(), firmanr: 1, aar: '2025', egenkapitalendringstype: 'utbytte', belop: -90000, belop_O: false }
    ]);
    this.prinsippendringer.set([{ id: crypto.randomUUID(), firmanr: 1, aar: '2025', resOgBalanseregnskapstype: 'resultatregnskap', posPrinsippendring: 0, negPrinsippendring: 0 }]);
    this.statusMessage.set('Baseline restored.');
    this.recalc(false);
  }

  resetGrid2LikeDelphi(): void {
    this.egenkapEndringer.update((rows) => rows.map((r) => ({ ...r, belop_O: false })));
    this.statusMessage.set('Grid 2 overrides reset.');
    this.recalc(false);
  }

  resetIbandRecompute(): void {
    this.state.set({
      ...this.state(),
      EgenkapitalIB: 0,
      EgenkapitalIB_O: false
    });
    this.statusMessage.set('Opening equity reset and recalculated.');
    this.recalc(true);
  }

  markEgenkapitalIbOverride(value: number): void {
    this.state.set({ ...this.state(), EgenkapitalIB: Number(value) || 0, EgenkapitalIB_O: true });
    this.recalc(false);
  }

  updateEndringType(index: number, type: string): void {
    this.egenkapEndringer.update((rows) => rows.map((row, i) => (i === index ? { ...row, egenkapitalendringstype: type } : row)));
    this.recalc(false);
  }

  updateEndringBelop(index: number, value: number): void {
    const num = Number(value) || 0;
    this.egenkapEndringer.update((rows) => rows.map((row, i) => (i === index ? { ...row, belop: num, belop_O: true } : row)));
    this.recalc(false);
  }

  updatePrinsippType(index: number, type: string): void {
    this.prinsippendringer.update((rows) => rows.map((row, i) => (i === index ? { ...row, resOgBalanseregnskapstype: type } : row)));
    this.recalc(false);
  }

  applyUpdateFlow(): void {
    this.recalc(true);
    this.statusMessage.set('Updated other changes from current values.');
  }

  exportGrid1(): void {
    this.statusMessage.set('Exported equity changes to Excel (web stub).');
  }

  exportGrid2(): void {
    this.statusMessage.set('Exported principle changes to Excel (web stub).');
  }

  openGuide(): void {
    this.statusMessage.set('Guide action is available (PDF in Delphi).');
  }

  printTopic(): void {
    this.statusMessage.set('Print action is available (PDF export in Delphi).');
  }

  goToNextTopic(): void {
    this.statusMessage.set('Next topic navigation is available.');
  }

  toggleOverflowMenu(event: Event): void {
    event.stopPropagation();
    this.overflowMenuOpen.update((v) => !v);
  }

  closeOverflowMenu(): void {
    this.overflowMenuOpen.set(false);
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    if (this.overflowMenuOpen()) this.overflowMenuOpen.set(false);
  }
}
