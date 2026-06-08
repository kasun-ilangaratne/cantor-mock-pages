import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface BidragRow {
  Firmanr: number;
  Aar: string;
  BidragType: 'M' | 'A';
  Id: string;
  Organisasjonsnummer: string;
  Organisasjonsnavn: string;
  BeloepMedSkattemessigVirkning: number;
  BeloepMedSkattemessigVirkningFinans: number;
  beloepUtenSkattemessigVirkning: number;
  beloepMedSkattemessigVirkningTilknyttetUtenlandskSelskap: number;
  Konserntilknytningstype: string;
  BeskrivelseAvKonserntilknytning: string;
  StemmerettsbegrensningForeligger: boolean;
  AarsakTilStemmerettsbegrensning: string;
  Ervervstidspunkt: string;
  DirekteEK: boolean;
  FoertFinansinnt: boolean;
  Svalbard: boolean;
}

@Component({
  selector: 'app-group-contribution-topic',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="topic">
      <div class="cols">
        <article class="card">
          <div class="section-head">
            <h4>Received (M)</h4>
            <button type="button" class="add-btn" (click)="openEditor('M')">Add new</button>
          </div>
          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Org no</th>
                  <th>Org name</th>
                  <th class="num">Tax amount</th>
                  <th class="num">Tax finance</th>
                  <th>Relation type</th>
                  <th class="actions-col">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let r of mottatt(); let i = index">
                  <td>{{ r.Organisasjonsnummer || '-' }}</td>
                  <td>{{ r.Organisasjonsnavn || '-' }}</td>
                  <td class="num">{{ r.BeloepMedSkattemessigVirkning | number: '1.0-0' }}</td>
                  <td class="num">{{ r.BeloepMedSkattemessigVirkningFinans | number: '1.0-0' }}</td>
                  <td>{{ r.Konserntilknytningstype || '-' }}</td>
                  <td class="actions-col">
                    <button type="button" class="icon-btn" (click)="openEditor('M', i)">✎</button>
                    <button type="button" class="icon-btn danger-icon-btn" title="Delete" aria-label="Delete" (click)="removeRow('M', i)">🗑</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </article>
        <article class="card">
          <div class="section-head">
            <h4>Given (A)</h4>
            <button type="button" class="add-btn" (click)="openEditor('A')">Add new</button>
          </div>
          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Org no</th>
                  <th>Org name</th>
                  <th class="num">Tax amount</th>
                  <th class="num">Tax finance</th>
                  <th>Relation type</th>
                  <th class="actions-col">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let r of avgitt(); let i = index">
                  <td>{{ r.Organisasjonsnummer || '-' }}</td>
                  <td>{{ r.Organisasjonsnavn || '-' }}</td>
                  <td class="num">{{ r.BeloepMedSkattemessigVirkning | number: '1.0-0' }}</td>
                  <td class="num">{{ r.BeloepMedSkattemessigVirkningFinans | number: '1.0-0' }}</td>
                  <td>{{ r.Konserntilknytningstype || '-' }}</td>
                  <td class="actions-col">
                    <button type="button" class="icon-btn" (click)="openEditor('A', i)">✎</button>
                    <button type="button" class="icon-btn danger-icon-btn" title="Delete" aria-label="Delete" (click)="removeRow('A', i)">🗑</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </article>
      </div>

      <aside class="detail-drawer" [class.open]="editorOpen()">
        <div class="drawer-header">
          <div>
            <h4>{{ editorMode() === 'new' ? 'New row' : 'Edit row' }}</h4>
            <small>{{ editorType() === 'M' ? 'Received (M)' : 'Given (A)' }}</small>
          </div>
          <button type="button" class="close-btn" (click)="closeEditor()">Close</button>
        </div>
        <div class="drawer-content" *ngIf="editorDraft() as draft">
          <div class="grid two">
            <label>Org no<input [(ngModel)]="draft.Organisasjonsnummer" /></label>
            <label>Org name<input [(ngModel)]="draft.Organisasjonsnavn" /></label>
            <label>Tax amount<input type="number" [(ngModel)]="draft.BeloepMedSkattemessigVirkning" /></label>
            <label>Tax finance<input type="number" [(ngModel)]="draft.BeloepMedSkattemessigVirkningFinans" /></label>
            <label>Tax foreign linked<input type="number" [(ngModel)]="draft.beloepMedSkattemessigVirkningTilknyttetUtenlandskSelskap" /></label>
            <label>Without tax<input type="number" [(ngModel)]="draft.beloepUtenSkattemessigVirkning" /></label>
            <label>Relation type
              <select [(ngModel)]="draft.Konserntilknytningstype">
                <option *ngFor="let option of konserntilknytningstyper()" [value]="option">{{ option }}</option>
              </select>
            </label>
            <label>Relation description<input [(ngModel)]="draft.BeskrivelseAvKonserntilknytning" /></label>
            <label>Acquisition date<input type="date" [(ngModel)]="draft.Ervervstidspunkt" /></label>
            <label>Restriction reason<input [disabled]="!draft.StemmerettsbegrensningForeligger" [(ngModel)]="draft.AarsakTilStemmerettsbegrensning" /></label>
          </div>
          <div class="toggle-row">
            <label><input type="checkbox" [(ngModel)]="draft.StemmerettsbegrensningForeligger" /> Voting restriction</label>
            <label><input type="checkbox" [(ngModel)]="draft.DirekteEK" /> Directly in equity</label>
            <label><input type="checkbox" [(ngModel)]="draft.FoertFinansinnt" /> Finance income</label>
            <label><input type="checkbox" [(ngModel)]="draft.Svalbard" /> Svalbard</label>
          </div>
          <p class="err" *ngIf="editorError()">{{ editorError() }}</p>
        </div>
        <div class="drawer-actions">
          <button type="button" (click)="closeEditor()">Cancel</button>
          <button type="button" class="add-btn" (click)="saveEditor()">Save</button>
        </div>
      </aside>

      <div class="toolbar">
        <label class="toggle-inline">
          Received contribution to be confirmed by auditor
          <span class="toggle">
            <input type="checkbox" [(ngModel)]="mottattSkalBekreftesAvRevisor" />
            <span class="toggle-slider"></span>
          </span>
        </label>
        <label class="toggle-inline">
          Given contribution to be confirmed by auditor
          <span class="toggle">
            <input type="checkbox" [(ngModel)]="avgittSkalBekreftesAvRevisor" />
            <span class="toggle-slider"></span>
          </span>
        </label>
        <button type="button" (click)="validateBeforeSave()">Validate rows</button>
      </div>
      <p class="err" *ngIf="saveError()">{{ saveError() }}</p>
      <p class="muted" *ngIf="statusMessage()">{{ statusMessage() }}</p>
    </section>
  `,
  styles: [`
    .topic{display:grid;gap:10px;position:relative;min-height:560px}
    h3,h4{margin:0}
    .cols{display:grid;grid-template-columns:1fr;gap:12px}
    .card{border:1px solid #dbe1ea;padding:12px;border-radius:8px;background:#fff;display:grid;gap:8px}
    .section-head{display:flex;justify-content:space-between;align-items:center;gap:8px}
    .table-wrap{overflow:auto}
    table{width:100%;border-collapse:collapse;min-width:760px}
    th,td{padding:7px 6px;border-bottom:1px solid #e5e7eb;font-size:12px;text-align:left;vertical-align:middle}
    thead{background:#f8fafc}
    .num{text-align:right;font-variant-numeric:tabular-nums}
    .actions-col{width:120px;text-align:right}
    .icon-btn{background:#eff6ff;border-color:#bfdbfe;color:#1e40af;padding:6px 8px;line-height:1}
    .danger-icon-btn{color:#b91c1c;border-color:#fecaca;background:#fff1f2}
    .add-btn{background:#eff6ff;border-color:#bfdbfe;color:#1e40af;font-weight:600}
    .toolbar{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
    label{display:flex;flex-direction:column;font-size:12px;gap:4px;color:#475569;line-height:1.35}
    .toggle-inline{display:inline-flex;flex-direction:row;align-items:center;gap:8px;white-space:nowrap}
    .toggle{position:relative;display:inline-flex;width:40px;height:22px;flex:0 0 auto}
    .toggle input[type='checkbox']{position:absolute;opacity:0;width:0;height:0}
    .toggle-slider{width:100%;height:100%;background:#cbd5e1;border-radius:999px;position:relative;transition:background-color .2s ease}
    .toggle-slider::before{content:'';position:absolute;width:16px;height:16px;top:3px;left:3px;border-radius:50%;background:#fff;box-shadow:0 1px 2px rgba(15,23,42,.24);transition:transform .2s ease}
    .toggle input[type='checkbox']:checked + .toggle-slider{background:#2563eb}
    .toggle input[type='checkbox']:checked + .toggle-slider::before{transform:translateX(18px)}
    input,button,select{border:1px solid #cbd5e1;border-radius:6px;padding:6px 8px;font-size:12px}
    input[readonly],input:disabled,select:disabled{background:#f1f5f9;color:#64748b;cursor:not-allowed}
    button{background:#f8fafc;cursor:pointer}
    .detail-drawer{position:absolute;top:12px;right:12px;width:0;opacity:0;height:calc(100% - 24px);background:#fff;border:1px solid #dbe1ea;border-radius:10px;overflow:hidden;transition:width .18s ease,opacity .18s ease;pointer-events:none;display:flex;flex-direction:column;z-index:10}
    .detail-drawer.open{width:460px;opacity:1;pointer-events:auto}
    .drawer-header{display:flex;justify-content:space-between;align-items:center;padding:12px;border-bottom:1px solid #e5e7eb;background:#f8fafc}
    .drawer-content{padding:12px;overflow:auto;display:grid;gap:10px;height:calc(100% - 120px)}
    .grid{display:grid;gap:8px}
    .two{grid-template-columns:repeat(2,minmax(180px,1fr))}
    .toggle-row{display:flex;flex-wrap:wrap;gap:10px}
    .toggle-row label{flex-direction:row;align-items:center}
    .drawer-actions{display:flex;justify-content:flex-end;gap:8px;padding:12px;border-top:1px solid #e5e7eb}
    .close-btn{background:#fff}
    .muted{color:#64748b;font-size:12px}
    .err{color:#b00020;font-size:12px}
  `]
})
export class GroupContributionTopicComponent {
  readonly konserntilknytningstyper = signal<string[]>([
    'mor-datter',
    'datter-mor',
    'sister company',
    'other relation'
  ]);
  readonly mottatt = signal<BidragRow[]>([{ Firmanr: 1, Aar: '2025', BidragType: 'M', Id: 'M1', Organisasjonsnummer: '998877665', Organisasjonsnavn: 'Shiba Holding AS', BeloepMedSkattemessigVirkning: 150000, BeloepMedSkattemessigVirkningFinans: 0, beloepUtenSkattemessigVirkning: 0, beloepMedSkattemessigVirkningTilknyttetUtenlandskSelskap: 25000, Konserntilknytningstype: 'mor-datter', BeskrivelseAvKonserntilknytning: 'Parent company ownership', StemmerettsbegrensningForeligger: false, AarsakTilStemmerettsbegrensning: '', Ervervstidspunkt: '2022-01-01', DirekteEK: true, FoertFinansinnt: false, Svalbard: false }]);
  readonly avgitt = signal<BidragRow[]>([{ Firmanr: 1, Aar: '2025', BidragType: 'A', Id: 'A1', Organisasjonsnummer: '912345678', Organisasjonsnavn: 'Shiba Energy AS', BeloepMedSkattemessigVirkning: 0, BeloepMedSkattemessigVirkningFinans: 85000, beloepUtenSkattemessigVirkning: 0, beloepMedSkattemessigVirkningTilknyttetUtenlandskSelskap: 0, Konserntilknytningstype: 'sister company', BeskrivelseAvKonserntilknytning: 'Common ultimate owner', StemmerettsbegrensningForeligger: true, AarsakTilStemmerettsbegrensning: 'Shareholder agreement', Ervervstidspunkt: '2021-06-15', DirekteEK: false, FoertFinansinnt: true, Svalbard: false }]);
  mottattSkalBekreftesAvRevisor = false;
  avgittSkalBekreftesAvRevisor = false;
  readonly saveError = signal('');
  readonly statusMessage = signal('');
  readonly editorOpen = signal(false);
  readonly editorType = signal<'M' | 'A'>('M');
  readonly editorMode = signal<'new' | 'edit'>('new');
  readonly editorIndex = signal<number>(-1);
  readonly editorDraft = signal<BidragRow | null>(null);
  readonly editorError = signal('');

  private createRowId(type: 'M' | 'A'): string {
    const randomId = globalThis.crypto?.randomUUID?.();
    if (randomId) return `${type}${randomId}`;
    return `${type}${Date.now()}-${Math.floor(Math.random() * 1_000_000)}`;
  }

  private createDefaultRow(type: 'M' | 'A'): BidragRow {
    return {
      Firmanr: 1,
      Aar: '2025',
      BidragType: type,
      Id: this.createRowId(type),
      Organisasjonsnummer: '',
      Organisasjonsnavn: '',
      BeloepMedSkattemessigVirkning: 0,
      BeloepMedSkattemessigVirkningFinans: 0,
      beloepUtenSkattemessigVirkning: 0,
      beloepMedSkattemessigVirkningTilknyttetUtenlandskSelskap: 0,
      Konserntilknytningstype: this.konserntilknytningstyper()[0] ?? '',
      BeskrivelseAvKonserntilknytning: '',
      StemmerettsbegrensningForeligger: false,
      AarsakTilStemmerettsbegrensning: '',
      Ervervstidspunkt: '',
      DirekteEK: false,
      FoertFinansinnt: false,
      Svalbard: false
    };
  }

  openEditor(type: 'M' | 'A', index?: number): void {
    const isEdit = typeof index === 'number' && index >= 0;
    const sourceRows = type === 'M' ? this.mottatt() : this.avgitt();
    const row = isEdit ? sourceRows[index!] : this.createDefaultRow(type);
    if (!row) return;
    this.editorType.set(type);
    this.editorMode.set(isEdit ? 'edit' : 'new');
    this.editorIndex.set(isEdit ? index! : -1);
    this.editorDraft.set({ ...row });
    this.editorError.set('');
    this.editorOpen.set(true);
  }

  closeEditor(): void {
    this.editorOpen.set(false);
    this.editorDraft.set(null);
    this.editorError.set('');
  }

  saveEditor(): void {
    const draft = this.editorDraft();
    if (!draft) return;
    if (draft.BeloepMedSkattemessigVirkning !== 0 && draft.BeloepMedSkattemessigVirkningFinans !== 0) {
      this.editorError.set('Cannot combine finance-tax and non-finance-tax amounts.');
      return;
    }
    if (this.editorType() === 'A' && !draft.Organisasjonsnavn.trim()) {
      this.editorError.set('Organization name is required for given contribution rows.');
      return;
    }
    if (this.editorMode() === 'new') {
      if (this.editorType() === 'M') this.mottatt.update((rows) => [draft, ...rows]);
      else this.avgitt.update((rows) => [draft, ...rows]);
      this.statusMessage.set(this.editorType() === 'M' ? 'Added received row.' : 'Added given row.');
    } else {
      const idx = this.editorIndex();
      if (idx < 0) return;
      if (this.editorType() === 'M') this.mottatt.update((rows) => rows.map((r, i) => (i === idx ? draft : r)));
      else this.avgitt.update((rows) => rows.map((r, i) => (i === idx ? draft : r)));
      this.statusMessage.set('Row updated.');
    }
    this.closeEditor();
  }

  removeRow(type: 'M' | 'A', index: number): void {
    if (type === 'M') this.mottatt.update((rows) => rows.filter((_, i) => i !== index));
    else this.avgitt.update((rows) => rows.filter((_, i) => i !== index));
  }

  validateBeforeSave(): void {
    const hasMissingName = this.avgitt().some((row) => row.Organisasjonsnavn.trim() === '');
    if (hasMissingName) {
      this.saveError.set('Cannot save: one or more given contribution rows are missing organization name.');
      return;
    }
    const hasInvalidCombo = [...this.mottatt(), ...this.avgitt()].some(
      (r) => r.BeloepMedSkattemessigVirkning !== 0 && r.BeloepMedSkattemessigVirkningFinans !== 0
    );
    if (hasInvalidCombo) {
      this.saveError.set('Cannot save while finance and non-finance tax-effective amounts are both set.');
      return;
    }
    this.saveError.set('');
    this.statusMessage.set('Validation passed.');
  }
}
