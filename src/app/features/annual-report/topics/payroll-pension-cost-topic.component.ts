import { CommonModule } from '@angular/common';
import { Component, HostListener, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface LoennRad {
  firmanr: number;
  aar: string;
  id: string;
  kontonummer: string;
  kontonavn: string;
  loennsopplysningspliktigYtelse: number;
  tilleggForKostnadsfoertLoennMvTidligereAar: number;
  fradragForPaaloeptIkkeForfaltLoennMvSomIkkeErRapportert: number;
  arbeidsgiveravgiftspliktigYtelse: number;
  samletBeloepSomErKreditertKontoForNaturalytelser: number;
  aaretsInnbetalingAvArbeidsgiveravgiftspliktigTilskuddOgPremieTilPensjonsordning: number;
  samletOpplysningspliktigYtelse: number;
  loennsopplysningspliktigYtelse_O: boolean;
  tilleggForKostnadsfoertLoennMvTidligereAar_O: boolean;
  fradragForPaaloeptIkkeForfaltLoennMvSomIkkeErRapportert_O: boolean;
  arbeidsgiveravgiftspliktigYtelse_O: boolean;
  samletBeloepSomErKreditertKontoForNaturalytelser_O: boolean;
  aaretsInnbetalingAvArbeidsgiveravgiftspliktigTilskuddOgPremieTilPensjonsordning_O: boolean;
  samletOpplysningspliktigYtelse_O: boolean;
  postType: number;
  ArbGivYtelserAuto: boolean;
}

interface LoennPensjonSpes {
  firmanr: number;
  aar: string;
  samletOpplysningspliktigYtelse: number;
  samletArbeidsgiveravgiftspliktigYtelse: number;
  ArbGivYtelserAuto: boolean;
  HarRevisor: boolean;
  HentKontoerFraAnnenFirma: boolean;
  HentKontoerFraFirma: number;
}

@Component({
  selector: 'app-payroll-pension-cost-topic',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="topic">
      <div class="top-header">
        <div class="top-left-meta">
        <label class="toggle-inline header-toggle">
          Fetch accounts from another company
          <span class="toggle">
            <input type="checkbox" [(ngModel)]="hentKontoerFraAnnenFirma" (ngModelChange)="syncSpesMeta()" />
            <span class="toggle-slider"></span>
          </span>
        </label>
        <label class="header-company" *ngIf="hentKontoerFraAnnenFirma">Company no <input type="number" [(ngModel)]="hentKontoerFraFirma" (ngModelChange)="syncSpesMeta()" /></label>
        <label class="toggle-inline header-toggle">
          Auditor confirmation required
          <span class="toggle">
            <input type="checkbox" [ngModel]="spes().HarRevisor" (ngModelChange)="setHarRevisor($event)" />
            <span class="toggle-slider"></span>
          </span>
        </label>
        </div>
        <div class="top-right-help">
        <button type="button" class="next-btn" (click)="goToNextTopic()">Next topic →</button>
        <button type="button" class="help-icon-btn" (click)="openGuide()" aria-label="Help" title="Help">?</button>
        <div class="overflow-menu top-right-menu" (click)="$event.stopPropagation()">
          <button type="button" class="overflow-trigger" aria-label="More options" title="More options" (click)="toggleOverflowMenu($event)">⋮</button>
          <div class="overflow-panel" *ngIf="overflowMenuOpen()">
            <button type="button" (click)="printTopic()">Print</button>
            <button type="button" (click)="deleteAll()">Delete all</button>
            <button type="button" (click)="resetOverrides()">Reset overrides</button>
            <button type="button" (click)="validateRows()">Validate rows</button>
            <button type="button" (click)="exportGrid(1)">Export payroll</button>
            <button type="button" (click)="exportGrid(2)">Export natural benefits</button>
            <button type="button" (click)="exportGrid(3)">Export pension contributions</button>
          </div>
        </div>
        </div>
      </div>
      <section class="card">
      <div class="section-head">
        <h4>Payroll / reportable salary values</h4>
        <button type="button" class="add-btn" (click)="addPayrollRow()">Add</button>
      </div>
      <table>
        <thead><tr><th>Account</th><th>Name</th><th>Salary basis</th><th>Addition prior year</th><th>Deduction accrued/not reported</th><th>Employer basis</th><th>Total reportable</th><th>Auto</th><th></th></tr></thead>
        <tbody>
          <tr *ngFor="let row of rowsByPostTypes([1,4]); let i = index">
            <td><input [ngModel]="row.kontonummer" readonly /></td>
            <td><input [ngModel]="row.kontonavn" readonly /></td>
            <td><input type="number" [(ngModel)]="row.loennsopplysningspliktigYtelse" (ngModelChange)="updateNumeric(row.id, 'loennsopplysningspliktigYtelse', $event)" /></td>
            <td><input type="number" [(ngModel)]="row.tilleggForKostnadsfoertLoennMvTidligereAar" (ngModelChange)="updateNumeric(row.id, 'tilleggForKostnadsfoertLoennMvTidligereAar', $event)" /></td>
            <td><input type="number" [(ngModel)]="row.fradragForPaaloeptIkkeForfaltLoennMvSomIkkeErRapportert" (ngModelChange)="updateNumeric(row.id, 'fradragForPaaloeptIkkeForfaltLoennMvSomIkkeErRapportert', $event)" /></td>
            <td><input type="number" [(ngModel)]="row.arbeidsgiveravgiftspliktigYtelse" (ngModelChange)="updateNumeric(row.id, 'arbeidsgiveravgiftspliktigYtelse', $event)" /></td>
            <td><input type="number" [ngModel]="row.samletOpplysningspliktigYtelse" readonly /></td>
            <td>
              <label class="toggle-inline">
                <span class="toggle">
                  <input type="checkbox" [ngModel]="row.ArbGivYtelserAuto" (ngModelChange)="setArbGivYtelserAuto(row.id, $event)" />
                  <span class="toggle-slider"></span>
                </span>
              </label>
            </td>
            <td><button type="button" class="icon-btn danger-icon-btn" title="Delete" aria-label="Delete" (click)="removeRow(row.id)">🗑</button></td>
          </tr>
        </tbody>
      </table>
      </section>
      <section class="card">
      <div class="section-head">
        <h4>Natural benefits credited account amount</h4>
        <button type="button" class="add-btn" (click)="addRow(2)">Add</button>
      </div>
      <table>
        <thead><tr><th>Account</th><th>Name</th><th>Amount</th><th></th></tr></thead>
        <tbody>
          <tr *ngFor="let row of rowsByPostType(2)">
            <td><input [ngModel]="row.kontonummer" readonly /></td>
            <td><input [ngModel]="row.kontonavn" readonly /></td>
            <td><input type="number" [(ngModel)]="row.samletBeloepSomErKreditertKontoForNaturalytelser" (ngModelChange)="updateNumeric(row.id, 'samletBeloepSomErKreditertKontoForNaturalytelser', $event)" /></td>
            <td><button type="button" class="icon-btn danger-icon-btn" title="Delete" aria-label="Delete" (click)="removeRow(row.id)">🗑</button></td>
          </tr>
        </tbody>
      </table>
      </section>
      <section class="card">
      <div class="section-head">
        <h4>Employer-paid pension contribution/premium</h4>
        <button type="button" class="add-btn" (click)="addRow(3)">Add</button>
      </div>
      <table>
        <thead><tr><th>Account</th><th>Name</th><th>Amount</th><th></th></tr></thead>
        <tbody>
          <tr *ngFor="let row of rowsByPostType(3)">
            <td><input [(ngModel)]="row.kontonummer" /></td>
            <td><input [ngModel]="row.kontonavn" readonly /></td>
            <td><input type="number" [(ngModel)]="row.aaretsInnbetalingAvArbeidsgiveravgiftspliktigTilskuddOgPremieTilPensjonsordning" (ngModelChange)="updateNumeric(row.id, 'aaretsInnbetalingAvArbeidsgiveravgiftspliktigTilskuddOgPremieTilPensjonsordning', $event)" /></td>
            <td><button type="button" class="icon-btn danger-icon-btn" title="Delete" aria-label="Delete" (click)="removeRow(row.id)">🗑</button></td>
          </tr>
        </tbody>
      </table>
      </section>
      <section class="card summary">
        <p>Total reportable: {{ spes().samletOpplysningspliktigYtelse | number:'1.0-2' }}</p>
        <p>Total employer basis: {{ spes().samletArbeidsgiveravgiftspliktigYtelse | number:'1.0-2' }}</p>
      </section>
      <p class="err" *ngIf="validationError()">{{ validationError() }}</p>
      <p class="muted" *ngIf="statusMessage()">{{ statusMessage() }}</p>
    </section>
  `,
  styles: [`
    .topic{display:grid;gap:10px}
    h3,h4{margin:0}
    .top-header{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap}
    .top-left-meta{display:flex;flex-wrap:wrap;align-items:center;gap:8px}
    .top-right-help{display:flex;flex-direction:column;align-items:flex-end;gap:6px}
    .help-icon-btn{width:30px;height:30px;border-radius:999px;padding:0;font-weight:700;display:inline-flex;align-items:center;justify-content:center;background:#eff6ff;border:1px solid #bfdbfe;color:#1e40af}
    .meta,.toolbar{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
    .header-toggle{font-size:12px}
    .header-company{display:flex;align-items:center;gap:6px;font-size:12px;color:#475569}
    .header-company input{width:90px}
    .overflow-menu{position:relative}
    .overflow-trigger{border:1px solid #cbd5e1;border-radius:6px;padding:3px 8px;background:#f8fafc;cursor:pointer;font-size:18px;line-height:1}
    .overflow-panel{position:absolute;top:34px;right:0;z-index:10;display:grid;gap:6px;min-width:230px;padding:8px;border:1px solid #dbe1ea;border-radius:8px;background:#fff;box-shadow:0 8px 20px rgba(15,23,42,.12)}
    .overflow-panel button{text-align:left}
    .section-head{display:flex;justify-content:space-between;align-items:center;gap:8px}
    .card{border:1px solid #dbe1ea;border-radius:8px;padding:12px;background:#fff;display:grid;gap:8px}
    table{width:100%;border-collapse:collapse}
    th,td{padding:10px 8px;border-bottom:1px solid #e5e7eb;font-size:13px;text-align:left}
    thead{background:#f8fafc}
    label{display:flex;align-items:center;gap:6px;font-size:12px;color:#475569;line-height:1.35}
    .toggle-inline{display:inline-flex;align-items:center;gap:8px;white-space:nowrap}
    .toggle{position:relative;display:inline-flex;width:40px;height:22px;flex:0 0 auto}
    .toggle input[type='checkbox']{position:absolute;opacity:0;width:0;height:0}
    .toggle-slider{width:100%;height:100%;background:#cbd5e1;border-radius:999px;position:relative;transition:background-color .2s ease}
    .toggle-slider::before{content:'';position:absolute;width:16px;height:16px;top:3px;left:3px;border-radius:50%;background:#fff;box-shadow:0 1px 2px rgba(15,23,42,.24);transition:transform .2s ease}
    .toggle input[type='checkbox']:checked + .toggle-slider{background:#2563eb}
    .toggle input[type='checkbox']:checked + .toggle-slider::before{transform:translateX(18px)}
    input,button{border:1px solid #cbd5e1;border-radius:6px;padding:7px 9px;font-size:13px}
    input[readonly],input:disabled,select:disabled{background:#f1f5f9;color:#64748b;cursor:not-allowed}
    input{width:100%}
    button{background:#f8fafc;cursor:pointer}
    .add-btn{background:#eff6ff;border-color:#bfdbfe;color:#1e40af;font-weight:600}
    .next-btn{background:#eff6ff;border-color:#bfdbfe;color:#1e40af;font-weight:600}
    .icon-btn{padding:6px 8px;line-height:1}
    .danger-icon-btn{color:#b91c1c;border-color:#fecaca;background:#fff1f2}
    .summary{display:flex;gap:20px;flex-wrap:wrap}
    .err{color:#b00020;font-size:12px}
    .muted{color:#64748b;font-size:12px}
  `]
})
export class PayrollPensionCostTopicComponent {
  hentKontoerFraAnnenFirma = false;
  hentKontoerFraFirma = 0;
  readonly statusMessage = signal('');
  readonly overflowMenuOpen = signal(false);
  readonly spes = signal<LoennPensjonSpes>({
    firmanr: 1,
    aar: '2025',
    samletOpplysningspliktigYtelse: 0,
    samletArbeidsgiveravgiftspliktigYtelse: 0,
    ArbGivYtelserAuto: true,
    HarRevisor: false,
    HentKontoerFraAnnenFirma: false,
    HentKontoerFraFirma: 0
  });
  readonly rows = signal<LoennRad[]>([
    {
      firmanr: 1,
      aar: '2025',
      id: crypto.randomUUID(),
      kontonummer: '5000', kontonavn: 'Salary', loennsopplysningspliktigYtelse: 500000, tilleggForKostnadsfoertLoennMvTidligereAar: 0,
      fradragForPaaloeptIkkeForfaltLoennMvSomIkkeErRapportert: 10000, arbeidsgiveravgiftspliktigYtelse: 460000,
      samletBeloepSomErKreditertKontoForNaturalytelser: 20000, aaretsInnbetalingAvArbeidsgiveravgiftspliktigTilskuddOgPremieTilPensjonsordning: 30000,
      samletOpplysningspliktigYtelse: 0,
      loennsopplysningspliktigYtelse_O: false,
      tilleggForKostnadsfoertLoennMvTidligereAar_O: false,
      fradragForPaaloeptIkkeForfaltLoennMvSomIkkeErRapportert_O: false,
      arbeidsgiveravgiftspliktigYtelse_O: false,
      samletBeloepSomErKreditertKontoForNaturalytelser_O: false,
      aaretsInnbetalingAvArbeidsgiveravgiftspliktigTilskuddOgPremieTilPensjonsordning_O: false,
      samletOpplysningspliktigYtelse_O: false,
      postType: 1,
      ArbGivYtelserAuto: true
    },
    {
      firmanr: 1,
      aar: '2025',
      id: crypto.randomUUID(),
      kontonummer: '5090',
      kontonavn: 'Payroll supplementary account',
      loennsopplysningspliktigYtelse: 75000,
      tilleggForKostnadsfoertLoennMvTidligereAar: 5000,
      fradragForPaaloeptIkkeForfaltLoennMvSomIkkeErRapportert: 0,
      arbeidsgiveravgiftspliktigYtelse: 69000,
      samletBeloepSomErKreditertKontoForNaturalytelser: 0,
      aaretsInnbetalingAvArbeidsgiveravgiftspliktigTilskuddOgPremieTilPensjonsordning: 0,
      samletOpplysningspliktigYtelse: 0,
      loennsopplysningspliktigYtelse_O: false,
      tilleggForKostnadsfoertLoennMvTidligereAar_O: false,
      fradragForPaaloeptIkkeForfaltLoennMvSomIkkeErRapportert_O: false,
      arbeidsgiveravgiftspliktigYtelse_O: false,
      samletBeloepSomErKreditertKontoForNaturalytelser_O: false,
      aaretsInnbetalingAvArbeidsgiveravgiftspliktigTilskuddOgPremieTilPensjonsordning_O: false,
      samletOpplysningspliktigYtelse_O: false,
      postType: 4,
      ArbGivYtelserAuto: true
    },
    {
      firmanr: 1,
      aar: '2025',
      id: crypto.randomUUID(),
      kontonummer: '5290',
      kontonavn: 'Natural benefits account',
      loennsopplysningspliktigYtelse: 0,
      tilleggForKostnadsfoertLoennMvTidligereAar: 0,
      fradragForPaaloeptIkkeForfaltLoennMvSomIkkeErRapportert: 0,
      arbeidsgiveravgiftspliktigYtelse: 0,
      samletBeloepSomErKreditertKontoForNaturalytelser: 42000,
      aaretsInnbetalingAvArbeidsgiveravgiftspliktigTilskuddOgPremieTilPensjonsordning: 0,
      samletOpplysningspliktigYtelse: 0,
      loennsopplysningspliktigYtelse_O: false,
      tilleggForKostnadsfoertLoennMvTidligereAar_O: false,
      fradragForPaaloeptIkkeForfaltLoennMvSomIkkeErRapportert_O: false,
      arbeidsgiveravgiftspliktigYtelse_O: false,
      samletBeloepSomErKreditertKontoForNaturalytelser_O: false,
      aaretsInnbetalingAvArbeidsgiveravgiftspliktigTilskuddOgPremieTilPensjonsordning_O: false,
      samletOpplysningspliktigYtelse_O: false,
      postType: 2,
      ArbGivYtelserAuto: true
    },
    {
      firmanr: 1,
      aar: '2025',
      id: crypto.randomUUID(),
      kontonummer: '5950',
      kontonavn: 'Pension contribution account',
      loennsopplysningspliktigYtelse: 0,
      tilleggForKostnadsfoertLoennMvTidligereAar: 0,
      fradragForPaaloeptIkkeForfaltLoennMvSomIkkeErRapportert: 0,
      arbeidsgiveravgiftspliktigYtelse: 0,
      samletBeloepSomErKreditertKontoForNaturalytelser: 0,
      aaretsInnbetalingAvArbeidsgiveravgiftspliktigTilskuddOgPremieTilPensjonsordning: 88000,
      samletOpplysningspliktigYtelse: 0,
      loennsopplysningspliktigYtelse_O: false,
      tilleggForKostnadsfoertLoennMvTidligereAar_O: false,
      fradragForPaaloeptIkkeForfaltLoennMvSomIkkeErRapportert_O: false,
      arbeidsgiveravgiftspliktigYtelse_O: false,
      samletBeloepSomErKreditertKontoForNaturalytelser_O: false,
      aaretsInnbetalingAvArbeidsgiveravgiftspliktigTilskuddOgPremieTilPensjonsordning_O: false,
      samletOpplysningspliktigYtelse_O: false,
      postType: 3,
      ArbGivYtelserAuto: true
    }
  ]);
  readonly validationError = signal('');
  constructor() {
    this.recalcAll();
  }
  rowsByPostType(postType: number): LoennRad[] {
    return this.rows().filter((r) => r.postType === postType);
  }
  rowsByPostTypes(postTypes: number[]): LoennRad[] {
    return this.rows().filter((r) => postTypes.includes(r.postType));
  }
  addPayrollRow(): void {
    const hasPostType1 = this.rows().some((r) => r.postType === 1);
    this.addRow(hasPostType1 ? 4 : 1);
  }
  private defaultAccountForPostType(postType: number): { number: string; name: string } {
    if (postType === 2) return { number: '5290', name: 'Natural benefits account' };
    if (postType === 3) return { number: '5950', name: 'Pension contribution account' };
    if (postType === 4) return { number: '5090', name: 'Payroll supplementary account' };
    return { number: '5000', name: 'Salary account' };
  }
  addRow(postType: number): void {
    const account = this.defaultAccountForPostType(postType);
    this.rows.update((rows) => [
      ...rows,
      {
        firmanr: 1,
        aar: '2025',
        id: crypto.randomUUID(),
        kontonummer: account.number,
        kontonavn: account.name,
        loennsopplysningspliktigYtelse: 0,
        tilleggForKostnadsfoertLoennMvTidligereAar: 0,
        fradragForPaaloeptIkkeForfaltLoennMvSomIkkeErRapportert: 0,
        arbeidsgiveravgiftspliktigYtelse: 0,
        samletBeloepSomErKreditertKontoForNaturalytelser: 0,
        aaretsInnbetalingAvArbeidsgiveravgiftspliktigTilskuddOgPremieTilPensjonsordning: 0,
        samletOpplysningspliktigYtelse: 0,
        loennsopplysningspliktigYtelse_O: false,
        tilleggForKostnadsfoertLoennMvTidligereAar_O: false,
        fradragForPaaloeptIkkeForfaltLoennMvSomIkkeErRapportert_O: false,
        arbeidsgiveravgiftspliktigYtelse_O: false,
        samletBeloepSomErKreditertKontoForNaturalytelser_O: false,
        aaretsInnbetalingAvArbeidsgiveravgiftspliktigTilskuddOgPremieTilPensjonsordning_O: false,
        samletOpplysningspliktigYtelse_O: false,
        postType,
        ArbGivYtelserAuto: true
      }
    ]);
    this.recalcAll();
  }
  removeRow(id: string): void {
    this.rows.update((rows) => rows.filter((r) => r.id !== id));
    this.recalcAll();
  }
  deleteAll(): void {
    this.rows.set([]);
    this.spes.set({ ...this.spes(), samletOpplysningspliktigYtelse: 0, samletArbeidsgiveravgiftspliktigYtelse: 0 });
    this.validationError.set('');
    this.statusMessage.set('All payroll/pension rows deleted.');
    this.overflowMenuOpen.set(false);
  }
  updateNumeric(
    id: string,
    field:
      | 'loennsopplysningspliktigYtelse'
      | 'tilleggForKostnadsfoertLoennMvTidligereAar'
      | 'fradragForPaaloeptIkkeForfaltLoennMvSomIkkeErRapportert'
      | 'arbeidsgiveravgiftspliktigYtelse'
      | 'samletBeloepSomErKreditertKontoForNaturalytelser'
      | 'aaretsInnbetalingAvArbeidsgiveravgiftspliktigTilskuddOgPremieTilPensjonsordning',
    value: number
  ): void {
    const num = Number(value) || 0;
    const overrideField = `${field}_O` as keyof LoennRad;
    this.rows.update((rows) =>
      rows.map((r) => {
        if (r.id !== id) return r;
        const updated: LoennRad = { ...r, [field]: num };
        if (overrideField in updated && typeof updated[overrideField] === 'boolean') {
          (updated[overrideField] as boolean) = true;
        }
        return updated;
      })
    );
    this.recalcAll();
  }
  recalcAll(): void {
    const next = this.rows().map((r) => ({
      ...r,
      samletOpplysningspliktigYtelse: [1, 4].includes(r.postType)
        ? r.loennsopplysningspliktigYtelse + r.tilleggForKostnadsfoertLoennMvTidligereAar - r.fradragForPaaloeptIkkeForfaltLoennMvSomIkkeErRapportert
        : 0
    }));
    this.rows.set(next);
    const payrollRows = next.filter((r) => [1, 4].includes(r.postType));
    this.spes.set({
      ...this.spes(),
      samletOpplysningspliktigYtelse: payrollRows.reduce((sum, item) => sum + item.samletOpplysningspliktigYtelse, 0),
      samletArbeidsgiveravgiftspliktigYtelse: payrollRows.reduce((sum, item) => sum + item.arbeidsgiveravgiftspliktigYtelse, 0),
      HentKontoerFraAnnenFirma: this.hentKontoerFraAnnenFirma,
      HentKontoerFraFirma: this.hentKontoerFraFirma
    });
  }

  resetOverrides(): void {
    this.rows.update((rows) =>
      rows.map((r) => ({
        ...r,
        loennsopplysningspliktigYtelse_O: false,
        tilleggForKostnadsfoertLoennMvTidligereAar_O: false,
        fradragForPaaloeptIkkeForfaltLoennMvSomIkkeErRapportert_O: false,
        arbeidsgiveravgiftspliktigYtelse_O: false,
        samletBeloepSomErKreditertKontoForNaturalytelser_O: false,
        aaretsInnbetalingAvArbeidsgiveravgiftspliktigTilskuddOgPremieTilPensjonsordning_O: false,
        samletOpplysningspliktigYtelse_O: false
      }))
    );
    this.statusMessage.set('Override flags reset.');
    this.overflowMenuOpen.set(false);
  }

  validateRows(): void {
    const missingAccount = this.rows().some((r) => !r.kontonummer.trim());
    const missingName = this.rows().some((r) => !r.kontonavn.trim());
    if (missingAccount || missingName) {
      this.validationError.set('All rows must have both account number and account name.');
      this.overflowMenuOpen.set(false);
      return;
    }
    this.validationError.set('');
    this.statusMessage.set('Validation passed.');
    this.overflowMenuOpen.set(false);
  }
  syncSpesMeta(): void {
    this.spes.update((s) => ({
      ...s,
      HentKontoerFraAnnenFirma: this.hentKontoerFraAnnenFirma,
      HentKontoerFraFirma: this.hentKontoerFraFirma
    }));
  }
  setHarRevisor(value: boolean): void {
    this.spes.update((s) => ({ ...s, HarRevisor: !!value }));
  }
  setArbGivYtelserAuto(id: string, value: boolean): void {
    this.rows.update((rows) => rows.map((r) => (r.id === id ? { ...r, ArbGivYtelserAuto: !!value } : r)));
  }
  openGuide(): void {
    this.statusMessage.set('Guide action is available (PDF in Delphi).');
  }
  printTopic(): void {
    this.statusMessage.set('Print action is available (PDF export in Delphi).');
    this.overflowMenuOpen.set(false);
  }
  goToNextTopic(): void {
    this.statusMessage.set('Next topic navigation is available.');
  }
  exportGrid(postType: 1 | 2 | 3): void {
    const label = postType === 1 ? 'payroll' : postType === 2 ? 'natural benefits' : 'pension contributions';
    this.statusMessage.set(`Export ${label} is available (Excel export in Delphi).`);
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
}
