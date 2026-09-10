import { CommonModule } from '@angular/common';
import { Component, HostListener, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface MidlertidigRow {
  id: string;
  firmanr: number;
  aar: string;
  type: string;
  regnskapsmVerdi: number;
  skattemVerdi: number;
  regnskapsmVerdiIfjor: number;
  skattemVerdiIfjor: number;
  regnskapsmVerdi_O: boolean;
  skattemVerdi_O: boolean;
  regnskapsmVerdiIfjor_O: boolean;
  skattemVerdiIfjor_O: boolean;
  endringIForskjeller: number;
  forskjellIAar: number;
  forskjellIFjor: number;
  beskrivelse: string;
}

interface PermanentRow {
  id: string;
  firmanr: number;
  aar: string;
  permanetForskjellstype: string;
  belop: number;
  belop_O: boolean;
  kategori: string;
  belopT: number;
  belopF: number;
  belopT_O: boolean;
  belopF_O: boolean;
  beskrivelse: string;
}

interface AndreRow {
  id: string;
  firmanr: number;
  aar: string;
  midlertidigeForskjellstype: string;
  regnskapsmVerdi: number;
  skattemVerdi: number;
  regnskapsmVerdiIfjor: number;
  skattemVerdiIfjor: number;
  regnskapsmVerdi_O: boolean;
  skattemVerdi_O: boolean;
  regnskapsmVerdiIfjor_O: boolean;
  skattemVerdiIfjor_O: boolean;
  endringIForskjeller_O: boolean;
  endringIForskjeller: number;
  forskjellIAar: number;
  forskjellIFjor: number;
  beskrivelse: string;
}

interface OmvurderingskontoState {
  omfType: 'A' | 'S';
  urealisertValutagevinstForrigeInntektsaar: number;
  urealisertValutagevinst: number;
  urealisertValutatapForrigeInntektsaar: number;
  urealisertValutatap: number;
  nettoUrealisertValutagevinstForrigeInntektsaar: number;
  nettoUrealisertValutagevinst: number;
  nettoUrealisertValutatapForrigeInntektsaar: number;
  nettoUrealisertValutatap: number;
  endringIOmvurderingskonto: number;
  korrigertOmvurderingskontoForrigeInntektsaar: number;
  korrigertOmvurderingskonto: number;
  resultatOmvurderingskontoForrigeInntektsaar: number;
  resultatOmvurderingskonto: number;
}

@Component({
  selector: 'app-differences-topic',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="topic">
      <div class="top-right-help">
        <button type="button" class="next-btn" (click)="goToNextTopic()">Next topic →</button>
        <button type="button" class="help-icon-btn" (click)="openGuide()" aria-label="Help" title="Help">?</button>
        <div class="overflow-menu top-right-menu" (click)="$event.stopPropagation()">
          <button type="button" class="overflow-trigger" aria-label="More options" title="More options" (click)="toggleOverflowMenu($event)">⋮</button>
          <div class="overflow-panel" *ngIf="overflowMenuOpen()">
            <button type="button" (click)="printTopic('staende')">Print standing</button>
            <button type="button" (click)="printTopic('liggende')">Print landscape</button>
            <button type="button" (click)="printTopic('spesifisert')">Print specified</button>
            <button type="button" (click)="exportGrid('P')">Export permanent</button>
            <button type="button" (click)="exportGrid('M')">Export temporary</button>
            <button type="button" (click)="exportGrid('A')">Export other</button>
          </div>
        </div>
      </div>
      <div class="toolbar">
        <label class="toggle-inline">
          Show all permanent
          <span class="toggle">
            <input type="checkbox" [(ngModel)]="visAllePermanente" />
            <span class="toggle-slider"></span>
          </span>
        </label>
        <label class="toggle-inline">
          Show all temporary
          <span class="toggle">
            <input type="checkbox" [(ngModel)]="visAlleMidlertidige" />
            <span class="toggle-slider"></span>
          </span>
        </label>
        <label class="toggle-inline">
          Show all other
          <span class="toggle">
            <input type="checkbox" [(ngModel)]="visAlleAndre" />
            <span class="toggle-slider"></span>
          </span>
        </label>
        <label class="toggle-inline">
          Auto-calc 3% taxable share (exemption method)
          <span class="toggle">
            <input type="checkbox" [(ngModel)]="skattefriGevinstFritaksmetoden" (ngModelChange)="recalcAll()" />
            <span class="toggle-slider"></span>
          </span>
        </label>
        <button type="button" (click)="resetSection('P')">Reset permanent overrides</button>
        <button type="button" (click)="resetSection('M')">Reset temporary overrides</button>
        <button type="button" (click)="resetSection('A')">Reset other values</button>
        <button type="button" (click)="recalcAll()">Calculate</button>
        <button type="button" [disabled]="!canOpenOmvurderingskonto()" (click)="openOmvurderingskonto('A')">Revaluation account (general)</button>
        <button type="button" [disabled]="!canOpenOmvurderingskonto()" (click)="openOmvurderingskonto('S')">Revaluation account (separate)</button>
      </div>
      <p class="muted" *ngIf="statusMessage()">{{ statusMessage() }}</p>
      <section class="card" *ngIf="omvDialogOpen()">
        <div class="toolbar">
          <h4>Revaluation account {{ omvState().omfType === 'A' ? 'general' : 'separate' }}</h4>
          <button type="button" (click)="closeOmvurderingskonto()">Close</button>
        </div>
        <div class="grid omv-grid">
          <label>Unrealized FX gain prior year <input type="number" [(ngModel)]="omvState().urealisertValutagevinstForrigeInntektsaar" (ngModelChange)="recalcOmv()" /></label>
          <label>Unrealized FX gain <input type="number" [(ngModel)]="omvState().urealisertValutagevinst" (ngModelChange)="recalcOmv()" /></label>
          <label>Unrealized FX loss prior year <input type="number" [(ngModel)]="omvState().urealisertValutatapForrigeInntektsaar" (ngModelChange)="recalcOmv()" /></label>
          <label>Unrealized FX loss <input type="number" [(ngModel)]="omvState().urealisertValutatap" (ngModelChange)="recalcOmv()" /></label>
          <label>Net unrealized gain prior year <input type="number" [ngModel]="omvState().nettoUrealisertValutagevinstForrigeInntektsaar" readonly /></label>
          <label>Net unrealized gain <input type="number" [ngModel]="omvState().nettoUrealisertValutagevinst" readonly /></label>
          <label>Net unrealized loss prior year <input type="number" [ngModel]="omvState().nettoUrealisertValutatapForrigeInntektsaar" readonly /></label>
          <label>Net unrealized loss <input type="number" [ngModel]="omvState().nettoUrealisertValutatap" readonly /></label>
          <label>Change in revaluation account <input type="number" [ngModel]="omvState().endringIOmvurderingskonto" readonly /></label>
          <label>Adjusted account prior year <input type="number" [(ngModel)]="omvState().korrigertOmvurderingskontoForrigeInntektsaar" (ngModelChange)="recalcOmv()" /></label>
          <label>Adjusted account current <input type="number" [ngModel]="omvState().korrigertOmvurderingskonto" readonly /></label>
          <label>Result prior year <input type="number" [(ngModel)]="omvState().resultatOmvurderingskontoForrigeInntektsaar" (ngModelChange)="recalcOmv()" /></label>
          <label>Result current <input type="number" [ngModel]="omvState().resultatOmvurderingskonto" readonly /></label>
        </div>
      </section>
      <p class="warn" *ngIf="duplicateWarning()">{{ duplicateWarning() }}</p>
      <div class="card">
      <div class="section-head">
        <h4>Permanent</h4>
        <button type="button" class="add-btn" (click)="addPermanentRow()">Add</button>
      </div>
      <table>
        <thead><tr><th>Type</th><th>Addition</th><th>Deduction</th><th>Description</th></tr></thead>
        <tbody>
          <tr *ngFor="let p of filteredPermanente(); let i = index">
            <td>
              <select [(ngModel)]="p.permanetForskjellstype" (ngModelChange)="recalcPermanent(i)">
                <option *ngFor="let option of permanentTypeOptions()" [value]="option">{{ option }}</option>
              </select>
            </td>
            <td><input type="number" [(ngModel)]="p.belopT" [disabled]="p.kategori === 'fradrag'" (ngModelChange)="recalcPermanent(i)" /></td>
            <td><input type="number" [(ngModel)]="p.belopF" [disabled]="p.kategori !== 'fradrag'" (ngModelChange)="recalcPermanent(i)" /></td>
            <td><input [(ngModel)]="p.beskrivelse" /></td>
          </tr>
        </tbody>
      </table>
      <div class="section-head">
        <h4>Temporary</h4>
        <button type="button" class="add-btn" (click)="addExtraTemporaryLine()">Add</button>
      </div>
      <table>
        <thead><tr><th>Type</th><th>Reg. year</th><th>Tax year</th><th>Diff year</th><th>Reg. prev</th><th>Tax prev</th><th>Diff prev</th><th>Change</th><th>Description</th></tr></thead>
        <tbody>
          <tr *ngFor="let r of filteredMidlertidige(); let i = index" [class.selected]="selectedTemporaryIndex() === i" (click)="selectedTemporaryIndex.set(i)">
            <td>
              <select [(ngModel)]="r.type" (ngModelChange)="recalc(i)">
                <option *ngFor="let option of temporaryTypeOptions()" [value]="option">{{ option }}</option>
              </select>
            </td>
            <td><input type="number" [(ngModel)]="r.regnskapsmVerdi" [disabled]="isReadonly(r.type,'reg')" (ngModelChange)="recalc(i)" /></td>
            <td><input type="number" [(ngModel)]="r.skattemVerdi" [disabled]="isReadonly(r.type,'tax')" (ngModelChange)="recalc(i)" /></td>
            <td><input type="number" [ngModel]="r.forskjellIAar" readonly /></td>
            <td><input type="number" [(ngModel)]="r.regnskapsmVerdiIfjor" [disabled]="isReadonly(r.type,'reg')" (ngModelChange)="recalc(i)" /></td>
            <td><input type="number" [(ngModel)]="r.skattemVerdiIfjor" [disabled]="isReadonly(r.type,'tax')" (ngModelChange)="recalc(i)" /></td>
            <td><input type="number" [ngModel]="r.forskjellIFjor" readonly /></td>
            <td><input type="number" [ngModel]="r.endringIForskjeller" readonly /></td>
            <td><input [(ngModel)]="r.beskrivelse" /></td>
          </tr>
        </tbody>
      </table>
      <div class="section-head">
        <h4>Other</h4>
        <button type="button" class="add-btn" (click)="addOtherRow()">Add</button>
      </div>
      <table>
        <thead><tr><th>Type</th><th>Reg. year</th><th>Tax year</th><th>Diff year</th><th>Reg. prev</th><th>Tax prev</th><th>Diff prev</th><th>Change</th><th>Description</th></tr></thead>
        <tbody>
          <tr *ngFor="let a of filteredAndre(); let i = index">
            <td>
              <select [(ngModel)]="a.midlertidigeForskjellstype" (ngModelChange)="recalcAndre(i)">
                <option *ngFor="let option of otherTypeOptions()" [value]="option">{{ option }}</option>
              </select>
            </td>
            <td><input type="number" [(ngModel)]="a.regnskapsmVerdi" (ngModelChange)="recalcAndre(i)" /></td>
            <td><input type="number" [(ngModel)]="a.skattemVerdi" (ngModelChange)="recalcAndre(i)" /></td>
            <td><input type="number" [ngModel]="a.forskjellIAar" readonly /></td>
            <td><input type="number" [(ngModel)]="a.regnskapsmVerdiIfjor" (ngModelChange)="recalcAndre(i)" /></td>
            <td><input type="number" [(ngModel)]="a.skattemVerdiIfjor" (ngModelChange)="recalcAndre(i)" /></td>
            <td><input type="number" [ngModel]="a.forskjellIFjor" readonly /></td>
            <td><input type="number" [ngModel]="a.endringIForskjeller" readonly /></td>
            <td><input [(ngModel)]="a.beskrivelse" /></td>
          </tr>
        </tbody>
      </table>
      <p>Total: {{ calcTotal() | number:'1.0-2' }}</p>
      </div>
    </section>
  `,
  styles: [`
    .topic{display:grid;gap:10px}
    h3,h4{margin:0}
    .top-right-help{display:flex;flex-direction:column;align-items:flex-end;gap:6px}
    .help-icon-btn{width:30px;height:30px;border-radius:999px;padding:0;font-weight:700;display:inline-flex;align-items:center;justify-content:center;background:#eff6ff;border:1px solid #bfdbfe;color:#1e40af}
    .toolbar{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
    .overflow-menu{position:relative}
    .overflow-trigger{border:1px solid #cbd5e1;border-radius:6px;padding:3px 8px;background:#f8fafc;cursor:pointer;font-size:18px;line-height:1}
    .overflow-panel{position:absolute;top:34px;right:0;z-index:10;display:grid;gap:6px;min-width:210px;padding:8px;border:1px solid #dbe1ea;border-radius:8px;background:#fff;box-shadow:0 8px 20px rgba(15,23,42,.12)}
    .overflow-panel button{text-align:left}
    .section-head{display:flex;justify-content:space-between;align-items:center;gap:8px}
    .add-btn{background:#eff6ff;border-color:#bfdbfe;color:#1e40af;font-weight:600}
    .card{border:1px solid #dbe1ea;border-radius:8px;padding:12px;background:#fff;display:grid;gap:10px}
    .omv-grid{grid-template-columns:repeat(2,minmax(220px,1fr))}
    .warn{color:#8a6d3b;font-size:12px}
    table{width:100%;border-collapse:collapse}
    th,td{border-bottom:1px solid #e5e7eb;padding:10px 8px;font-size:13px;text-align:left}
    thead{background:#f8fafc}
    label{display:flex;align-items:center;gap:6px;font-size:12px;color:#475569}
    .toggle-inline{display:inline-flex;align-items:center;gap:8px;white-space:nowrap}
    .toggle{position:relative;display:inline-flex;width:40px;height:22px;flex:0 0 auto}
    .toggle input[type='checkbox']{position:absolute;opacity:0;width:0;height:0}
    .toggle-slider{width:100%;height:100%;background:#cbd5e1;border-radius:999px;position:relative;transition:background-color .2s ease}
    .toggle-slider::before{content:'';position:absolute;width:16px;height:16px;top:3px;left:3px;border-radius:50%;background:#fff;box-shadow:0 1px 2px rgba(15,23,42,.24);transition:transform .2s ease}
    .toggle input[type='checkbox']:checked + .toggle-slider{background:#2563eb}
    .toggle input[type='checkbox']:checked + .toggle-slider::before{transform:translateX(18px)}
    input,button,select{border:1px solid #cbd5e1;border-radius:6px;padding:7px 9px;font-size:13px}
    input[readonly],input:disabled,select:disabled{background:#f1f5f9;color:#64748b;cursor:not-allowed}
    input,select{width:100%}
    button{background:#f8fafc;cursor:pointer}
    .next-btn{background:#eff6ff;border-color:#bfdbfe;color:#1e40af;font-weight:600}
  `]
})
export class DifferencesTopicComponent {
  private readonly midlertidigMinus = ['annenNegativMidlertidigForskjell'];
  private readonly kunSkattemessig = ['skattemessigKun'];
  private readonly kunRegnskapsmessig = ['regnskapsmessigKun'];
  private readonly omvurderingskontoTyper = ['langsiktigFordringIUtenlandskValuta', 'langsiktigGjeldIUtenlandskValuta'];
  skattefriGevinstFritaksmetoden = false;
  visAllePermanente = true;
  visAlleMidlertidige = true;
  visAlleAndre = true;
  readonly statusMessage = signal('');
  readonly selectedTemporaryIndex = signal(0);
  readonly overflowMenuOpen = signal(false);
  readonly omvDialogOpen = signal(false);
  readonly omvState = signal<OmvurderingskontoState>({
    omfType: 'A',
    urealisertValutagevinstForrigeInntektsaar: 0,
    urealisertValutagevinst: 0,
    urealisertValutatapForrigeInntektsaar: 0,
    urealisertValutatap: 0,
    nettoUrealisertValutagevinstForrigeInntektsaar: 0,
    nettoUrealisertValutagevinst: 0,
    nettoUrealisertValutatapForrigeInntektsaar: 0,
    nettoUrealisertValutatap: 0,
    endringIOmvurderingskonto: 0,
    korrigertOmvurderingskontoForrigeInntektsaar: 0,
    korrigertOmvurderingskonto: 0,
    resultatOmvurderingskontoForrigeInntektsaar: 0,
    resultatOmvurderingskonto: 0
  });

  constructor() {
    this.recalcAll();
  }
  readonly duplicateWarning = signal('');
  readonly permanentTypeOptions = signal<string[]>([
    'ikkeFradragsberettigetKostnad',
    'ikkeSkattepliktigInntekt',
    'annenPermanentForskjell'
  ]);
  readonly temporaryTypeOptions = signal<string[]>([
    'annenPositivMidlertidigForskjell',
    'annenNegativMidlertidigForskjell',
    'langsiktigFordringIUtenlandskValuta',
    'langsiktigGjeldIUtenlandskValuta',
    'skattemessigKun',
    'regnskapsmessigKun'
  ]);
  readonly otherTypeOptions = signal<string[]>([
    'annenPositivMidlertidigForskjell',
    'annenNegativMidlertidigForskjell',
    'ikkeKlassifisertForskjell'
  ]);
  readonly permanente = signal<PermanentRow[]>([
    { id: crypto.randomUUID(), firmanr: 1, aar: '2025', permanetForskjellstype: 'ikkeFradragsberettigetKostnad', belop: 10000, belop_O: false, kategori: 'tillegg', belopT: 10000, belopF: 0, belopT_O: false, belopF_O: false, beskrivelse: '' }
  ]);
  readonly midlertidige = signal<MidlertidigRow[]>([
    { id: crypto.randomUUID(), firmanr: 1, aar: '2025', type: 'annenPositivMidlertidigForskjell', regnskapsmVerdi: 100000, skattemVerdi: 70000, regnskapsmVerdiIfjor: 80000, skattemVerdiIfjor: 75000, regnskapsmVerdi_O: false, skattemVerdi_O: false, regnskapsmVerdiIfjor_O: false, skattemVerdiIfjor_O: false, endringIForskjeller: 0, forskjellIAar: 0, forskjellIFjor: 0, beskrivelse: '' },
    { id: crypto.randomUUID(), firmanr: 1, aar: '2025', type: 'annenNegativMidlertidigForskjell', regnskapsmVerdi: 20000, skattemVerdi: 50000, regnskapsmVerdiIfjor: 15000, skattemVerdiIfjor: 30000, regnskapsmVerdi_O: false, skattemVerdi_O: false, regnskapsmVerdiIfjor_O: false, skattemVerdiIfjor_O: false, endringIForskjeller: 0, forskjellIAar: 0, forskjellIFjor: 0, beskrivelse: '' }
  ]);
  readonly andre = signal<AndreRow[]>([
    {
      id: crypto.randomUUID(),
      firmanr: 1,
      aar: '2025',
      midlertidigeForskjellstype: 'annenPositivMidlertidigForskjell',
      regnskapsmVerdi: 0,
      skattemVerdi: 0,
      regnskapsmVerdiIfjor: 0,
      skattemVerdiIfjor: 0,
      regnskapsmVerdi_O: false,
      skattemVerdi_O: false,
      regnskapsmVerdiIfjor_O: false,
      skattemVerdiIfjor_O: false,
      endringIForskjeller_O: false,
      endringIForskjeller: 0,
      forskjellIAar: 0,
      forskjellIFjor: 0,
      beskrivelse: ''
    }
  ]);
  filteredPermanente(): PermanentRow[] {
    if (this.visAllePermanente) return this.permanente();
    return this.permanente().filter((r) => r.belop !== 0);
  }
  filteredMidlertidige(): MidlertidigRow[] {
    if (this.visAlleMidlertidige) return this.midlertidige();
    return this.midlertidige().filter((r) => r.regnskapsmVerdi !== 0 || r.skattemVerdi !== 0 || r.regnskapsmVerdiIfjor !== 0 || r.skattemVerdiIfjor !== 0);
  }
  filteredAndre(): AndreRow[] {
    if (this.visAlleAndre) return this.andre();
    return this.andre().filter((r) => r.regnskapsmVerdi !== 0 || r.skattemVerdi !== 0);
  }
  isReadonly(type: string, side: 'reg' | 'tax'): boolean {
    if (this.kunSkattemessig.includes(type)) return side === 'reg';
    if (this.kunRegnskapsmessig.includes(type)) return side === 'tax';
    return false;
  }
  recalc(_index: number): void {
    this.midlertidige.update((rows) =>
      rows.map((r) => ({
        ...r,
        forskjellIAar: r.regnskapsmVerdi - r.skattemVerdi,
        forskjellIFjor: r.regnskapsmVerdiIfjor - r.skattemVerdiIfjor,
        endringIForskjeller: (r.regnskapsmVerdi - r.skattemVerdi) - (r.regnskapsmVerdiIfjor - r.skattemVerdiIfjor)
      }))
    );
    this.validateDuplicates();
  }
  recalcPermanent(_index: number): void {
    this.permanente.update((rows) =>
      rows.map((r) => {
        const kategori = r.kategori || (r.belopF !== 0 ? 'fradrag' : 'tillegg');
        const belop = kategori === 'fradrag' ? r.belopF : r.belopT;
        return { ...r, kategori, belop };
      })
    );
    this.validateDuplicates();
  }
  recalcAndre(_index: number): void {
    this.andre.update((rows) =>
      rows.map((r) => {
        const forskjellIAar = r.regnskapsmVerdi - r.skattemVerdi;
        const forskjellIFjor = r.regnskapsmVerdiIfjor - r.skattemVerdiIfjor;
        return {
          ...r,
          forskjellIAar,
          forskjellIFjor,
          endringIForskjeller: forskjellIAar - forskjellIFjor
        };
      })
    );
    this.validateDuplicates();
  }
  addExtraTemporaryLine(): void {
    const current = this.midlertidige();
    const selected = current[this.selectedTemporaryIndex()] ?? current[current.length - 1];
    if (!selected) return;
    if (!['annenPositivMidlertidigForskjell', 'annenNegativMidlertidigForskjell'].includes(selected.type)) return;
    this.midlertidige.set([
      ...current,
      {
        ...selected,
        id: crypto.randomUUID(),
        regnskapsmVerdi: 0,
        skattemVerdi: 0,
        regnskapsmVerdiIfjor: 0,
        skattemVerdiIfjor: 0,
        endringIForskjeller: 0,
        forskjellIAar: 0,
        forskjellIFjor: 0
      }
    ]);
    this.validateDuplicates();
  }
  addPermanentRow(): void {
    this.permanente.update((rows) => [
      ...rows,
      {
        id: crypto.randomUUID(),
        firmanr: 1,
        aar: '2025',
        permanetForskjellstype: this.permanentTypeOptions()[0] ?? '',
        belop: 0,
        belop_O: false,
        kategori: 'tillegg',
        belopT: 0,
        belopF: 0,
        belopT_O: false,
        belopF_O: false,
        beskrivelse: ''
      }
    ]);
    this.validateDuplicates();
  }
  addOtherRow(): void {
    this.andre.update((rows) => [
      ...rows,
      {
        id: crypto.randomUUID(),
        firmanr: 1,
        aar: '2025',
        midlertidigeForskjellstype: this.otherTypeOptions()[0] ?? '',
        regnskapsmVerdi: 0,
        skattemVerdi: 0,
        regnskapsmVerdiIfjor: 0,
        skattemVerdiIfjor: 0,
        regnskapsmVerdi_O: false,
        skattemVerdi_O: false,
        regnskapsmVerdiIfjor_O: false,
        skattemVerdiIfjor_O: false,
        endringIForskjeller_O: false,
        endringIForskjeller: 0,
        forskjellIAar: 0,
        forskjellIFjor: 0,
        beskrivelse: ''
      }
    ]);
    this.validateDuplicates();
  }
  validateDuplicates(): void {
    const dupP = this.findDuplicates(this.permanente().map((r) => r.permanetForskjellstype));
    const dupM = this.findDuplicates(this.midlertidige().map((r) => r.type));
    const dupA = this.findDuplicates(this.andre().map((r) => r.midlertidigeForskjellstype));
    const parts = [dupP ? `Permanent: ${dupP}` : '', dupM ? `Temporary: ${dupM}` : '', dupA ? `Other: ${dupA}` : ''].filter(Boolean);
    this.duplicateWarning.set(parts.length ? `Duplicate codes detected. ${parts.join(' | ')}` : '');
  }
  findDuplicates(values: string[]): string {
    const seen = new Map<string, number>();
    for (const v of values) {
      const key = v.trim();
      if (!key) continue;
      seen.set(key, (seen.get(key) ?? 0) + 1);
    }
    return Array.from(seen.entries()).filter(([, c]) => c > 1).map(([k]) => k).join(', ');
  }
  resetSection(section: 'P' | 'M' | 'A'): void {
    if (section === 'P') {
      this.permanente.update((rows) => rows.map((r) => ({ ...r, belop_O: false, belopT_O: false, belopF_O: false })));
    } else if (section === 'M') {
      this.midlertidige.update((rows) =>
        rows.map((r) => ({ ...r, regnskapsmVerdi_O: false, skattemVerdi_O: false, regnskapsmVerdiIfjor_O: false, skattemVerdiIfjor_O: false }))
      );
    } else {
      this.andre.update((rows) =>
        rows.map((r) => ({
          ...r,
          regnskapsmVerdi: 0,
          skattemVerdi: 0,
          regnskapsmVerdiIfjor: 0,
          skattemVerdiIfjor: 0,
          endringIForskjeller: 0,
          forskjellIAar: 0,
          forskjellIFjor: 0,
          endringIForskjeller_O: false
        }))
      );
    }
    this.validateDuplicates();
  }
  recalcAll(): void {
    this.recalc(0);
    this.recalcPermanent(0);
    this.recalcAndre(0);
    this.statusMessage.set('Differences recalculated.');
  }
  openOmvurderingskonto(type: 'A' | 'S'): void {
    if (!this.canOpenOmvurderingskonto()) {
      this.statusMessage.set('Select a temporary row of type long-term receivable/debt in foreign currency first.');
      return;
    }
    this.omvState.update((s) => ({ ...s, omfType: type }));
    this.omvDialogOpen.set(true);
    this.recalcOmv();
  }
  closeOmvurderingskonto(): void {
    this.omvDialogOpen.set(false);
  }
  recalcOmv(): void {
    const s = this.omvState();
    const nettoGainPrev = Math.max(0, s.urealisertValutagevinstForrigeInntektsaar - s.urealisertValutatapForrigeInntektsaar);
    const nettoGain = Math.max(0, s.urealisertValutagevinst - s.urealisertValutatap);
    const nettoLossPrev = Math.max(0, s.urealisertValutatapForrigeInntektsaar - s.urealisertValutagevinstForrigeInntektsaar);
    const nettoLoss = Math.max(0, s.urealisertValutatap - s.urealisertValutagevinst);
    const endring = (nettoGain - nettoLoss) - (nettoGainPrev - nettoLossPrev);
    const korrigert = s.korrigertOmvurderingskontoForrigeInntektsaar + endring;
    const resultat = s.resultatOmvurderingskontoForrigeInntektsaar + endring;
    this.omvState.set({
      ...s,
      nettoUrealisertValutagevinstForrigeInntektsaar: nettoGainPrev,
      nettoUrealisertValutagevinst: nettoGain,
      nettoUrealisertValutatapForrigeInntektsaar: nettoLossPrev,
      nettoUrealisertValutatap: nettoLoss,
      endringIOmvurderingskonto: endring,
      korrigertOmvurderingskonto: korrigert,
      resultatOmvurderingskonto: resultat
    });
  }
  openGuide(): void {
    this.statusMessage.set('Guide action is ready for integration.');
  }
  goToNextTopic(): void {
    this.statusMessage.set('Next topic action is ready for integration.');
  }
  printTopic(mode: 'staende' | 'liggende' | 'spesifisert'): void {
    this.statusMessage.set(`Print ${mode} action is ready for integration.`);
    this.overflowMenuOpen.set(false);
  }
  exportGrid(section: 'P' | 'M' | 'A'): void {
    this.statusMessage.set(`Export ${section} action is ready for integration.`);
    this.overflowMenuOpen.set(false);
  }
  toggleOverflowMenu(event: Event): void {
    event.stopPropagation();
    this.overflowMenuOpen.update((open) => !open);
  }
  @HostListener('document:click')
  onDocumentClick(): void {
    if (this.overflowMenuOpen()) {
      this.overflowMenuOpen.set(false);
    }
  }
  selectedTemporaryRow(): MidlertidigRow | undefined {
    const rows = this.filteredMidlertidige();
    const idx = this.selectedTemporaryIndex();
    return rows[idx] ?? rows[rows.length - 1];
  }
  canOpenOmvurderingskonto(): boolean {
    const row = this.selectedTemporaryRow();
    if (!row) return false;
    return this.omvurderingskontoTyper.includes(row.type);
  }
  calcTotal(): number {
    return this.midlertidige().reduce((sum, r) => {
      const diff = (r.regnskapsmVerdi - r.skattemVerdi) + (r.regnskapsmVerdiIfjor - r.skattemVerdiIfjor);
      return this.midlertidigMinus.includes(r.type) ? sum - diff : sum + diff;
    }, 0);
  }
}
