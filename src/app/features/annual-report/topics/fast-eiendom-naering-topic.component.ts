import { CommonModule } from '@angular/common';
import { Component, HostListener, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface NaeringRow {
  id: string;
  eiendomId: string;
  naeringseiendomstype: string;
  areal: number;
  utleidAreal: number;
  antallMaanederUtleid: number;
  bruttoUtleieinntekt: number;
  aarligUtleieinntektIAaretFoerInntektsaar: number;
  aarligUtleieinntektToAarFoerInntektsaar: number;
  sisteRapporterteUtleieinntekt: number;
  beregnetUtleieverdiForNaeringseiendom: number;
  formuesverdiForNaeringseiendom: number;
  utleieverdi: number;
  avvikVedAnvendtDokumentertMarkedsverdi: number;
  dokumentertMarkedsverdiForNaeringseiendom: number;
  dokumentertMarkedsverdiForNaeringseiendomTidligereInntektsaar: number;
  datoForDokumentertMarkedsverdiForNaeringseiendom: string;
  aarForMottattMarkedsverdi: number;
  reduksjonsfaktorVedAnvendtDokumentertMarkedsverdi: number;
  reduksjonsfaktorForJustertMarkedsverdiForNaeringseiendom: number;
  beregnetReduksjonsfaktorForJustertMarkedsverdi: number;
  justertMarkedsverdiForNaeringseiendom: number;
  grunnlagReduksjonsfaktor: number;
  utleieverdiFraSerg: number;
  utleieverdiFraSergTidligereInntektsaar: number;
  beregnetUtleieverdiFraSergTidligereInntektsaar: number;
  calcBruttoUtleieinntektIAar: number;
  calcSumSiste3Aar: number;
  calcGjnSnSiste3Aar: number;
  calcKalkulasjonsfaktor: number;
  calcKalkulasjonsfaktorStorby: number;
  calcTellerBrok: number;
  calcTellerMultiplikator: number;
  calcFormuesverdiFoerRabatt: number;
  calcUtleieverdi: number;
  calcFormuesferdiFoerRab: number;
  wizHeltEllerDelvisUtleid: boolean | null;
  wizUtleidSiste3Aar: boolean | null;
  wizUtleidIAar: boolean | null;
  wizBruktTidligereJusteringsfaktor: boolean;
  bygningeneUtgjorHovedfunksjon: boolean | null;
  adresseModus: 'norge' | 'svalbard' | 'utland';
  adresseNorge: string;
  husnummer: string;
  husbokstav: string;
  bruksenhetsnummer: string;
  postnr: string;
  poststed: string;
  adresseSvalbard: string;
  postnrSvalbard: string;
  poststedSvalbard: string;
  adresseUtland: string;
  adresseNummerUtland: string;
  postkodeUtland: string;
  byUtland: string;
  landkode: string;
}

@Component({
  selector: 'app-fast-eiendom-naering-topic',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="topic">
      <div class="top-header">
        <div></div>
        <div class="top-right-help">
          <button type="button" class="next-btn" (click)="statusMessage.set('Next topic is not wired yet.')">Next topic →</button>
          <div class="overflow-menu" (click)="$event.stopPropagation()">
            <button type="button" class="overflow-trigger" (click)="toggleMenu($event)" aria-label="More options" title="More options">⋮</button>
            <div class="overflow-panel" *ngIf="menuOpen()">
              <button type="button" (click)="recalculateAll(); closeMenu()">Recalculate</button>
              <button type="button" (click)="resetOverrides(); closeMenu()">Reset overrides</button>
              <button type="button" (click)="statusMessage.set('Fetch fixed values is not wired yet.'); closeMenu()">Fetch fixed values</button>
              <button type="button" (click)="statusMessage.set('Calculate market value is not wired yet.'); closeMenu()">Calculate market value</button>
            </div>
          </div>
          <button type="button" class="help-icon-btn" (click)="statusMessage.set('Help is not wired yet.')" aria-label="Help" title="Help">?</button>
        </div>
      </div>

      <article class="card">
        <div class="section-head">
          <h4>Commercial property details</h4>
          <button type="button" class="add-btn" (click)="openEditor()">Add new</button>
        </div>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Property ID</th>
                <th>Type</th>
                <th class="num">Area</th>
                <th class="num">Computed rental value</th>
                <th class="num">Tax value</th>
                <th class="actions-col">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let row of rows(); let i = index">
                <td>{{ row.eiendomId }}</td>
                <td>{{ row.naeringseiendomstype }}</td>
                <td class="num">{{ row.areal | number: '1.0-0' }}</td>
                <td class="num">{{ row.beregnetUtleieverdiForNaeringseiendom | number: '1.0-0' }}</td>
                <td class="num">{{ row.formuesverdiForNaeringseiendom | number: '1.0-0' }}</td>
                <td class="actions-col">
                  <button type="button" class="icon-btn" (click)="openEditor(i)">✎</button>
                  <button type="button" class="icon-btn danger-icon-btn" title="Delete" aria-label="Delete" (click)="removeRow(i)">🗑</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </article>

      <aside class="detail-drawer" [class.open]="editorOpen()">
        <div class="drawer-header">
          <div>
            <h4>{{ editorIndex() === -1 ? 'New row' : 'Edit row' }}</h4>
            <small>SM_FastEiendomNaering</small>
          </div>
          <button type="button" class="close-btn" (click)="closeEditor()">Close</button>
        </div>
        <div class="drawer-content" *ngIf="draft() as current">
          <div class="grid two">
            <label>Property ID<input [(ngModel)]="current.eiendomId" /></label>
            <label>Commercial type
              <select [(ngModel)]="current.naeringseiendomstype">
                <option *ngFor="let option of naeringseiendomstypeOptions" [value]="option">{{ option }}</option>
              </select>
            </label>
            <label>Total area<input type="number" [(ngModel)]="current.areal" /></label>
            <label>Leased area<input type="number" [(ngModel)]="current.utleidAreal" /></label>
            <label>Antall maaneder utleid<input type="number" [(ngModel)]="current.antallMaanederUtleid" /></label>
            <label>Brutto utleieinntekt i aar<input type="number" [(ngModel)]="current.bruttoUtleieinntekt" /></label>
            <label>Aarlig utleieinntekt aaret foer<input type="number" [(ngModel)]="current.aarligUtleieinntektIAaretFoerInntektsaar" /></label>
            <label>Aarlig utleieinntekt to aar foer<input type="number" [(ngModel)]="current.aarligUtleieinntektToAarFoerInntektsaar" /></label>
            <label>Siste rapporterte utleieinntekt<input type="number" [(ngModel)]="current.sisteRapporterteUtleieinntekt" /></label>
            <label>Beregnet utleieverdi<input type="number" [ngModel]="current.beregnetUtleieverdiForNaeringseiendom" readonly /></label>
            <label>Formuesverdi<input type="number" [ngModel]="current.formuesverdiForNaeringseiendom" readonly /></label>
            <label>Utleieverdi<input type="number" [ngModel]="current.utleieverdi" readonly /></label>
            <label>Avvik ved anvendt dokumentert markedsverdi<input type="number" [ngModel]="current.avvikVedAnvendtDokumentertMarkedsverdi" readonly /></label>
            <label>Dokumentert markedsverdi<input type="number" [(ngModel)]="current.dokumentertMarkedsverdiForNaeringseiendom" /></label>
            <label>Dokumentert markedsverdi tidligere inntektsaar<input type="number" [(ngModel)]="current.dokumentertMarkedsverdiForNaeringseiendomTidligereInntektsaar" /></label>
            <label>Dato for dokumentert markedsverdi<input type="date" [(ngModel)]="current.datoForDokumentertMarkedsverdiForNaeringseiendom" /></label>
            <label>Aar for mottatt markedsverdi<input type="number" [(ngModel)]="current.aarForMottattMarkedsverdi" /></label>
            <label>Reduksjonsfaktor ved anvendt dokumentert markedsverdi<input type="number" [(ngModel)]="current.reduksjonsfaktorVedAnvendtDokumentertMarkedsverdi" /></label>
            <label>Reduksjonsfaktor for justert markedsverdi<input type="number" [(ngModel)]="current.reduksjonsfaktorForJustertMarkedsverdiForNaeringseiendom" /></label>
            <label>Beregnet reduksjonsfaktor<input type="number" [ngModel]="current.beregnetReduksjonsfaktorForJustertMarkedsverdi" readonly /></label>
            <label>Justert markedsverdi<input type="number" [ngModel]="current.justertMarkedsverdiForNaeringseiendom" readonly /></label>
            <label>Grunnlag reduksjonsfaktor<input type="number" [ngModel]="current.grunnlagReduksjonsfaktor" readonly /></label>
            <label>Utleieverdi fra SERG<input type="number" [(ngModel)]="current.utleieverdiFraSerg" /></label>
            <label>Utleieverdi fra SERG tidligere inntektsaar<input type="number" [(ngModel)]="current.utleieverdiFraSergTidligereInntektsaar" /></label>
            <label>Beregnet utleieverdi fra SERG tidligere inntektsaar<input type="number" [ngModel]="current.beregnetUtleieverdiFraSergTidligereInntektsaar" readonly /></label>
          </div>

          <div class="wizard card-flat">
            <h5>Wizard</h5>
            <div class="grid two">
              <label>Property fully/partially leased
                <select [ngModel]="fromTriState(current.wizHeltEllerDelvisUtleid)" (ngModelChange)="current.wizHeltEllerDelvisUtleid = toTriState($event)">
                  <option value="unknown">Unknown</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </label>
              <label>Er eiendommen utleid alle de siste 3 aar
                <select [disabled]="current.wizHeltEllerDelvisUtleid !== true" [ngModel]="fromTriState(current.wizUtleidSiste3Aar)" (ngModelChange)="current.wizUtleidSiste3Aar = toTriState($event)">
                  <option value="unknown">Unknown</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </label>
              <label>Er eiendommen utleid i aar
                <select [disabled]="!(current.wizHeltEllerDelvisUtleid === true && current.wizUtleidSiste3Aar === false)" [ngModel]="fromTriState(current.wizUtleidIAar)" (ngModelChange)="current.wizUtleidIAar = toTriState($event)">
                  <option value="unknown">Unknown</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </label>
              <label class="toggle-inline">Juster for tidligere rapportert markedsverdi
                <span class="toggle"><input type="checkbox" [(ngModel)]="current.wizBruktTidligereJusteringsfaktor" /><span class="toggle-slider"></span></span>
              </label>
              <label>Bygningene utgjor utleieeiendommens hovedfunksjon
                <select [ngModel]="fromTriState(current.bygningeneUtgjorHovedfunksjon)" (ngModelChange)="current.bygningeneUtgjorHovedfunksjon = toTriState($event)">
                  <option value="unknown">Unknown</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </label>
            </div>
          </div>

          <div class="card-flat" *ngIf="showPanelA(current)">
            <h5>A - Utleid verdier</h5>
            <p class="muted">Brutto utleieinntekt og omregnede utleieverdier.</p>
          </div>
          <div class="card-flat" *ngIf="showPanelC(current)">
            <h5>C - Utleiehistorikk siste 3 aar</h5>
            <div class="grid two">
              <label>Beregnet brutto utleieinntekt i aar<input type="number" [ngModel]="current.calcBruttoUtleieinntektIAar" readonly /></label>
              <label>Beregnet sum siste 3 aar<input type="number" [ngModel]="current.calcSumSiste3Aar" readonly /></label>
              <label>Beregnet gjennomsnitt siste 3 aar<input type="number" [ngModel]="current.calcGjnSnSiste3Aar" readonly /></label>
              <label>Kalkulasjonsfaktor<input type="number" [ngModel]="current.calcKalkulasjonsfaktor" readonly /></label>
              <label>Kalkulasjonsfaktor storby<input type="number" [ngModel]="current.calcKalkulasjonsfaktorStorby" readonly /></label>
              <label>Teller broek<input type="number" [ngModel]="current.calcTellerBrok" readonly /></label>
              <label>Teller multiplikator<input type="number" [ngModel]="current.calcTellerMultiplikator" readonly /></label>
            </div>
          </div>
          <div class="card-flat" *ngIf="showPanelD(current)">
            <h5>D - Beregnet utleieverdi grunnlag</h5>
            <p class="muted">Beregnet utleieverdi brukes som grunnlag.</p>
          </div>
          <div class="card-flat" *ngIf="showPanelE(current)">
            <h5>E - Ikke utleid</h5>
            <p class="muted">Dokumentert markedsverdi benyttes i ikke-utleid loep.</p>
          </div>
          <div class="card-flat" *ngIf="showPanelF(current)">
            <h5>F - Formuesverdi output</h5>
            <div class="grid two">
              <label>Beregnet formuesverdi foer rabatt<input type="number" [ngModel]="current.calcFormuesverdiFoerRabatt" readonly /></label>
              <label>Beregnet utleieverdi<input type="number" [ngModel]="current.calcUtleieverdi" readonly /></label>
              <label>Beregnet formuesverdi foer rab<input type="number" [ngModel]="current.calcFormuesferdiFoerRab" readonly /></label>
            </div>
          </div>

          <div class="card-flat">
            <h5>Adresse</h5>
            <div class="address-tabs">
              <button type="button" [class.active]="current.adresseModus === 'norge'" (click)="current.adresseModus = 'norge'">Address Norway</button>
              <button type="button" [class.active]="current.adresseModus === 'svalbard'" (click)="current.adresseModus = 'svalbard'">Address Svalbard</button>
              <button type="button" [class.active]="current.adresseModus === 'utland'" (click)="current.adresseModus = 'utland'">Address Abroad</button>
            </div>
            <div class="grid two">
              <ng-container *ngIf="current.adresseModus === 'norge'">
                <label>Address name<input [(ngModel)]="current.adresseNorge" /></label>
                <label>Post no<input [(ngModel)]="current.postnr" /></label>
                <label>Poststedsnavn<input [(ngModel)]="current.poststed" /></label>
                <label>Husnummer<input [(ngModel)]="current.husnummer" /></label>
                <label>Husbokstav<input [(ngModel)]="current.husbokstav" /></label>
                <label>Bruksenhetsnummer<input [(ngModel)]="current.bruksenhetsnummer" /></label>
              </ng-container>
              <ng-container *ngIf="current.adresseModus === 'svalbard'">
                <label>Address name<input [(ngModel)]="current.adresseSvalbard" /></label>
                <label>Post no<input [(ngModel)]="current.postnrSvalbard" /></label>
                <label>Poststedsnavn<input [(ngModel)]="current.poststedSvalbard" /></label>
              </ng-container>
              <ng-container *ngIf="current.adresseModus === 'utland'">
                <label>Address name<input [(ngModel)]="current.adresseUtland" /></label>
                <label>Adressenummer<input [(ngModel)]="current.adresseNummerUtland" /></label>
                <label>Postkode<input [(ngModel)]="current.postkodeUtland" /></label>
                <label>City<input [(ngModel)]="current.byUtland" /></label>
                <label>Landkode<input [(ngModel)]="current.landkode" /></label>
              </ng-container>
            </div>
          </div>

          <p class="err" *ngIf="editorError()">{{ editorError() }}</p>
        </div>
        <div class="drawer-actions">
          <button type="button" (click)="closeEditor()">Cancel</button>
          <button type="button" class="add-btn" (click)="saveEditor()">Save</button>
        </div>
      </aside>

      <p class="muted" *ngIf="statusMessage()">{{ statusMessage() }}</p>
    </section>
  `,
  styles: [`
    .topic{display:grid;gap:10px;position:relative;min-height:620px;align-content:start}
    .top-header{display:flex;justify-content:space-between;align-items:flex-start}
    .top-right-help{display:flex;flex-direction:column;align-items:flex-end;gap:6px}
    .next-btn{background:#2563eb;color:#fff;border-color:#1d4ed8}
    .help-icon-btn{width:32px;height:32px;border-radius:999px;background:#eff6ff;color:#1e3a8a;border:1px solid #bfdbfe;font-weight:700}
    .overflow-menu{position:relative}
    .overflow-trigger{border:1px solid #cbd5e1;border-radius:6px;padding:3px 8px;background:#f8fafc;cursor:pointer;font-size:18px;line-height:1}
    .overflow-panel{position:absolute;top:34px;right:0;z-index:20;display:grid;gap:6px;min-width:230px;padding:8px;border:1px solid #dbe1ea;border-radius:8px;background:#fff;box-shadow:0 8px 20px rgba(15,23,42,.12)}
    .overflow-panel button{text-align:left}
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
    input,button,select{border:1px solid #cbd5e1;border-radius:6px;padding:6px 8px;font-size:12px}
    input[readonly],input:disabled,select:disabled{background:#f1f5f9;color:#64748b;cursor:not-allowed}
    .detail-drawer{position:absolute;top:12px;right:12px;width:0;opacity:0;height:calc(100% - 24px);background:#fff;border:1px solid #dbe1ea;border-radius:10px;overflow:hidden;transition:width .18s ease,opacity .18s ease;pointer-events:none;display:flex;flex-direction:column;z-index:10}
    .detail-drawer.open{width:540px;opacity:1;pointer-events:auto}
    .drawer-header{display:flex;justify-content:space-between;align-items:center;padding:12px;border-bottom:1px solid #e5e7eb;background:#f8fafc}
    .drawer-content{padding:12px;overflow:auto;display:grid;gap:10px;height:calc(100% - 120px)}
    .grid{display:grid;gap:8px}
    .grid.two{grid-template-columns:1fr 1fr}
    label{display:flex;flex-direction:column;font-size:12px;gap:4px;color:#475569;line-height:1.35}
    .toggle-row{display:flex;flex-wrap:wrap;gap:8px}
    .toggle-inline{display:inline-flex;flex-direction:row;align-items:center;gap:8px;white-space:nowrap}
    .toggle{position:relative;display:inline-flex;width:40px;height:22px;flex:0 0 auto}
    .toggle input[type='checkbox']{position:absolute;opacity:0;width:0;height:0}
    .toggle-slider{width:100%;height:100%;background:#cbd5e1;border-radius:999px;position:relative;transition:background-color .2s ease}
    .toggle-slider::before{content:'';position:absolute;width:16px;height:16px;top:3px;left:3px;border-radius:50%;background:#fff;box-shadow:0 1px 2px rgba(15,23,42,.24);transition:transform .2s ease}
    .toggle input[type='checkbox']:checked + .toggle-slider{background:#2563eb}
    .toggle input[type='checkbox']:checked + .toggle-slider::before{transform:translateX(18px)}
    .card-flat{border:1px solid #e2e8f0;border-radius:8px;background:#f8fafc;padding:8px;display:grid;gap:6px}
    .address-tabs{display:flex;gap:6px;flex-wrap:wrap}
    .address-tabs button.active{background:#dbeafe;border-color:#93c5fd;color:#1e3a8a}
    h5{margin:0;font-size:12px}
    .drawer-actions{display:flex;justify-content:flex-end;gap:8px;padding:12px;border-top:1px solid #e5e7eb}
    .err{color:#b91c1c;margin:0;font-size:12px}
    .muted{color:#64748b;font-size:12px;margin:0}
  `]
})
export class FastEiendomNaeringTopicComponent {
  readonly naeringseiendomstypeOptions = ['Office', 'Warehouse', 'Retail', 'Industrial', 'Mixed use'];
  readonly rows = signal<NaeringRow[]>([this.createSeedRow()]);
  readonly baseline = signal<NaeringRow[]>([this.createSeedRow()]);
  readonly editorOpen = signal(false);
  readonly editorIndex = signal(-1);
  readonly draft = signal<NaeringRow | null>(null);
  readonly editorError = signal('');
  readonly statusMessage = signal('');
  readonly menuOpen = signal(false);

  openEditor(index = -1): void {
    this.editorIndex.set(index);
    const row = index === -1 ? this.createEmptyRow() : { ...this.rows()[index] };
    this.recalculateRow(row);
    this.draft.set(row);
    this.editorError.set('');
    this.editorOpen.set(true);
  }

  closeEditor(): void {
    this.editorOpen.set(false);
    this.draft.set(null);
    this.editorError.set('');
  }

  saveEditor(): void {
    const current = this.draft();
    if (!current) return;
    if (!current.eiendomId.trim()) {
      this.editorError.set('Property ID is required.');
      return;
    }
    this.recalculateRow(current);
    const idx = this.editorIndex();
    if (idx === -1) {
      this.rows.update((rows) => [current, ...rows]);
      this.statusMessage.set('Row added.');
    } else {
      this.rows.update((rows) => rows.map((r, i) => (i === idx ? current : r)));
      this.statusMessage.set('Row updated.');
    }
    this.closeEditor();
  }

  removeRow(index: number): void {
    this.rows.update((rows) => rows.filter((_, i) => i !== index));
    this.statusMessage.set('Row deleted.');
  }

  recalculateAll(): void {
    this.rows.update((rows) => rows.map((row) => this.recalculateRow({ ...row })));
    this.statusMessage.set('All rows recalculated.');
  }

  resetOverrides(): void {
    this.rows.set(this.baseline().map((r) => ({ ...r })));
    this.statusMessage.set('Overrides reset.');
  }

  showPanelA(row: NaeringRow): boolean {
    return row.wizHeltEllerDelvisUtleid === true && (row.wizUtleidSiste3Aar === true || row.wizUtleidIAar === true);
  }

  showPanelC(row: NaeringRow): boolean {
    return row.wizHeltEllerDelvisUtleid === true && row.wizUtleidSiste3Aar === true;
  }

  showPanelD(row: NaeringRow): boolean {
    return row.wizHeltEllerDelvisUtleid === true && (row.wizUtleidSiste3Aar === true || row.wizUtleidIAar === true);
  }

  showPanelE(row: NaeringRow): boolean {
    return row.wizHeltEllerDelvisUtleid === false || (row.wizHeltEllerDelvisUtleid === true && row.wizUtleidSiste3Aar === false && row.wizUtleidIAar === false);
  }

  showPanelF(_row: NaeringRow): boolean {
    return true;
  }

  fromTriState(value: boolean | null): 'yes' | 'no' | 'unknown' {
    if (value === true) return 'yes';
    if (value === false) return 'no';
    return 'unknown';
  }

  toTriState(value: 'yes' | 'no' | 'unknown'): boolean | null {
    if (value === 'yes') return true;
    if (value === 'no') return false;
    return null;
  }

  toggleMenu(event: Event): void {
    event.stopPropagation();
    this.menuOpen.update((open) => !open);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    if (this.menuOpen()) this.menuOpen.set(false);
  }

  private recalculateRow(row: NaeringRow): NaeringRow {
    const grossAnnual = row.areal > 0 ? (row.bruttoUtleieinntekt / Math.max(row.utleidAreal, 1)) * row.areal : row.bruttoUtleieinntekt;
    const avg3 = (grossAnnual + row.aarligUtleieinntektIAaretFoerInntektsaar + row.aarligUtleieinntektToAarFoerInntektsaar) / 3;
    row.calcBruttoUtleieinntektIAar = Math.max(0, Math.round(grossAnnual));
    row.calcSumSiste3Aar =
      row.calcBruttoUtleieinntektIAar +
      row.aarligUtleieinntektIAaretFoerInntektsaar +
      row.aarligUtleieinntektToAarFoerInntektsaar;
    row.calcGjnSnSiste3Aar = Math.round(row.calcSumSiste3Aar / 3);
    row.calcKalkulasjonsfaktor = row.areal > 0 ? Number((row.utleidAreal / row.areal).toFixed(4)) : 0;
    row.calcKalkulasjonsfaktorStorby = Math.max(0.2, Math.min(1, row.calcKalkulasjonsfaktor || 0.7));
    row.calcTellerBrok = row.calcGjnSnSiste3Aar;
    row.calcTellerMultiplikator = Number((row.calcKalkulasjonsfaktorStorby || 1).toFixed(4));
    row.beregnetUtleieverdiForNaeringseiendom = Math.max(0, Math.round(avg3));
    row.calcUtleieverdi = row.beregnetUtleieverdiForNaeringseiendom;
    row.utleieverdi = row.beregnetUtleieverdiForNaeringseiendom;
    const factor = row.reduksjonsfaktorVedAnvendtDokumentertMarkedsverdi || 1;
    row.justertMarkedsverdiForNaeringseiendom = Math.round((row.dokumentertMarkedsverdiForNaeringseiendom || 0) * factor);
    row.beregnetReduksjonsfaktorForJustertMarkedsverdi = row.dokumentertMarkedsverdiForNaeringseiendom
      ? Number((row.justertMarkedsverdiForNaeringseiendom / row.dokumentertMarkedsverdiForNaeringseiendom).toFixed(4))
      : 0;
    row.grunnlagReduksjonsfaktor = row.wizBruktTidligereJusteringsfaktor
      ? row.dokumentertMarkedsverdiForNaeringseiendomTidligereInntektsaar
      : row.dokumentertMarkedsverdiForNaeringseiendom;
    row.beregnetUtleieverdiFraSergTidligereInntektsaar = Math.round(
      (row.utleieverdiFraSergTidligereInntektsaar || row.utleieverdiFraSerg || 0) * (row.reduksjonsfaktorForJustertMarkedsverdiForNaeringseiendom || 1)
    );
    row.avvikVedAnvendtDokumentertMarkedsverdi =
      row.justertMarkedsverdiForNaeringseiendom - row.beregnetUtleieverdiForNaeringseiendom;
    const base = this.showPanelE(row) ? row.justertMarkedsverdiForNaeringseiendom : row.beregnetUtleieverdiForNaeringseiendom;
    row.formuesverdiForNaeringseiendom = Math.round(base * 0.8);
    row.calcFormuesverdiFoerRabatt = base;
    row.calcFormuesferdiFoerRab = base;
    return row;
  }

  private createSeedRow(): NaeringRow {
    const row = this.createEmptyRow();
    row.eiendomId = 'P-1001';
    row.naeringseiendomstype = 'Office';
    row.areal = 1200;
    row.utleidAreal = 900;
    row.antallMaanederUtleid = 12;
    row.bruttoUtleieinntekt = 1450000;
    row.aarligUtleieinntektIAaretFoerInntektsaar = 1380000;
    row.aarligUtleieinntektToAarFoerInntektsaar = 1320000;
    row.sisteRapporterteUtleieinntekt = 1310000;
    row.dokumentertMarkedsverdiForNaeringseiendom = 9200000;
    row.reduksjonsfaktorVedAnvendtDokumentertMarkedsverdi = 0.9;
    row.reduksjonsfaktorForJustertMarkedsverdiForNaeringseiendom = 0.9;
    row.utleieverdiFraSerg = 1410000;
    row.utleieverdiFraSergTidligereInntektsaar = 1360000;
    row.dokumentertMarkedsverdiForNaeringseiendomTidligereInntektsaar = 8800000;
    row.wizHeltEllerDelvisUtleid = true;
    row.wizUtleidSiste3Aar = true;
    row.wizUtleidIAar = true;
    row.aarForMottattMarkedsverdi = 2024;
    row.datoForDokumentertMarkedsverdiForNaeringseiendom = '2024-09-10';
    row.bygningeneUtgjorHovedfunksjon = true;
    row.adresseModus = 'norge';
    row.adresseNorge = 'Bryggegata 11';
    row.husnummer = '11';
    row.postnr = '0250';
    row.poststed = 'Oslo';
    this.recalculateRow(row);
    return row;
  }

  private createEmptyRow(): NaeringRow {
    return {
      id: `fen-${Date.now()}`,
      eiendomId: '',
      naeringseiendomstype: '',
      areal: 0,
      utleidAreal: 0,
      antallMaanederUtleid: 0,
      bruttoUtleieinntekt: 0,
      aarligUtleieinntektIAaretFoerInntektsaar: 0,
      aarligUtleieinntektToAarFoerInntektsaar: 0,
      sisteRapporterteUtleieinntekt: 0,
      beregnetUtleieverdiForNaeringseiendom: 0,
      formuesverdiForNaeringseiendom: 0,
      utleieverdi: 0,
      avvikVedAnvendtDokumentertMarkedsverdi: 0,
      dokumentertMarkedsverdiForNaeringseiendom: 0,
      dokumentertMarkedsverdiForNaeringseiendomTidligereInntektsaar: 0,
      datoForDokumentertMarkedsverdiForNaeringseiendom: '',
      aarForMottattMarkedsverdi: 0,
      reduksjonsfaktorVedAnvendtDokumentertMarkedsverdi: 1,
      reduksjonsfaktorForJustertMarkedsverdiForNaeringseiendom: 1,
      beregnetReduksjonsfaktorForJustertMarkedsverdi: 0,
      justertMarkedsverdiForNaeringseiendom: 0,
      grunnlagReduksjonsfaktor: 0,
      utleieverdiFraSerg: 0,
      utleieverdiFraSergTidligereInntektsaar: 0,
      beregnetUtleieverdiFraSergTidligereInntektsaar: 0,
      calcBruttoUtleieinntektIAar: 0,
      calcSumSiste3Aar: 0,
      calcGjnSnSiste3Aar: 0,
      calcKalkulasjonsfaktor: 0,
      calcKalkulasjonsfaktorStorby: 0,
      calcTellerBrok: 0,
      calcTellerMultiplikator: 0,
      calcFormuesverdiFoerRabatt: 0,
      calcUtleieverdi: 0,
      calcFormuesferdiFoerRab: 0,
      wizHeltEllerDelvisUtleid: null,
      wizUtleidSiste3Aar: null,
      wizUtleidIAar: null,
      wizBruktTidligereJusteringsfaktor: false,
      bygningeneUtgjorHovedfunksjon: null,
      adresseModus: 'norge',
      adresseNorge: '',
      husnummer: '',
      husbokstav: '',
      bruksenhetsnummer: '',
      postnr: '',
      poststed: '',
      adresseSvalbard: '',
      postnrSvalbard: '',
      poststedSvalbard: '',
      adresseUtland: '',
      adresseNummerUtland: '',
      postkodeUtland: '',
      byUtland: '',
      landkode: 'NO'
    };
  }
}
