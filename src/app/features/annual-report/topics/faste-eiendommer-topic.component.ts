import { CommonModule } from '@angular/common';
import { Component, HostListener, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

type PropertyType =
  | 'selveidBolig'
  | 'boenhetIBoligselskap'
  | 'flerboligbygning'
  | 'selveidFritidseiendom'
  | 'tomt'
  | 'annenFastEiendomInnenforInntektsgivendeAktivitet'
  | 'annenFastEiendomUtenforInntektsgivendeAktivitet'
  | 'borett'
  | 'regnskapsbehandletBolig'
  | 'egenFritaksbehandletBolig'
  | 'regnskapsbehandletFritidseiendom'
  | 'egenFritaksbehandletFritidseiendom'
  | 'gaardsbruk'
  | 'naeringseiendom'
  | 'ikkeUtleidNaeringseiendomINorge'
  | 'utleidFlerboligbygningIUtlandet'
  | 'ikkeUtleidNaeringseiendomIUtlandet'
  | 'skogeiendomIUtlandet'
  | 'skogeiendomINorge'
  | 'fastEiendomPaaSvalbard'
  | 'skalIkkeFastsettes';

interface TypeOption {
  tag: number;
  id: PropertyType;
  label: string;
  group: 'main' | 'other-types';
  detailForm: 'bolig' | 'flerbolig' | 'andre' | 'naering' | 'skog-norge';
}

interface PropertyRow {
  id: string;
  firmanr: number;
  aar: string;
  type: PropertyType;
  navn: string;
  kommunenummer: string;
  gaardsnummer: number;
  bruksnummer: number;
  festenummer: number;
  seksjonsnummer: number;
  formuesverdi: number;
  // Shared detail fields
  sergEiendomsidentifikator: string;
  postnummer: string;
  poststedsnavn: string;
  husnummer: string;
  husbokstav: string;
  bruksenhetsnummer: string;
  iaAdressenavn: string;
  iaAdressenummer: string;
  iaPostkode: string;
  iaByEllerStedsnavn: string;
  iaLandkode: string;
  // Bolig/Flerbolig core fields
  boligensAreal: number;
  boligtype: string;
  byggeaar: number;
  boligbruk: string;
  beregnetMarkedsverdiForBolig: number;
  dokumentertMarkedsverdiForBolig: number;
  datoForDokumentertMarkedsverdiForBolig: string;
  formuesverdiForBolig: number;
  markedsverdiErGrunnlag: boolean;
  aarForMottattMarkedsverdi: number;
  justertMarkedsverdiForBolig: number;
  reduksjonsfaktorForJustertMarkedsverdiForBolig: number;
  dokumentertMarkedsverdiTidligereInntektsaar: number;
  boligverdiTidligereInntektsaar: number;
  beregnetBoligverdiTidligereInntektsaar: number;
  // Formuesobjekt ownership/share fields
  andelAvFormuesverdi: number;
  formuesverdiForFormuesandel: number;
  verdiFoerVerdsettingsrabattForFormuesandel: number;
  boligselskapetsOrganisasjonsnummer: string;
  boligselskapetsNavn: string;
  aksjeboenhetsnummer: number;
  andelsnummer: number;
  boligsameietsNavn: string;
  boligsameietsOrganisasjonsnummer: string;
  // Flerbolig specific
  formuesverdiForFlerboligbygning: number;
  antallUseksjonerteBoenheter: number;
  useksjonerteBoenheter: UseksjonertBoenhetRow[];
  // Naering core fields (for in-drawer parity)
  naeringseiendomstype: string;
  naeringAreal: number;
  naeringUtleidAreal: number;
  naeringAntallMaanederUtleid: number;
  naeringBruttoUtleieinntekt: number;
  naeringAarligUtleieinntektIAaretFoerInntektsaar: number;
  naeringAarligUtleieinntektToAarFoerInntektsaar: number;
  naeringSisteRapporterteUtleieinntekt: number;
  naeringBeregnetUtleieverdi: number;
  naeringDokumentertMarkedsverdi: number;
  naeringDatoForDokumentertMarkedsverdi: string;
  naeringFormuesverdi: number;
  naeringWizHeltEllerDelvisUtleid: boolean;
  naeringWizUtleidSiste3Aar: boolean;
  naeringWizUtleidIAar: boolean;
  // Skog/Andre base placeholders
  skogeiendomAreal: number;
  skogeiendomAvkastning: number;
}

interface UseksjonertBoenhetRow {
  idX: string;
  boligverdiForUseksjonertBoenhet: number;
  bruksenhetsnummer: string;
  formuesverdiForFormuesandel: number;
  verdiFoerVerdsettingsrabattForFormuesandel: number;
  boligensAreal: number;
  boligtype: string;
  byggeaar: number;
  boligbruk: string;
}

@Component({
  selector: 'app-faste-eiendommer-topic',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="topic">
      <div class="fp-top-header">
        <div class="toolbar"></div>
        <div class="fp-top-right-help">
          <button type="button" class="next-btn" (click)="statusMessage.set('Next topic is not wired yet.')">Next topic →</button>
          <div class="overflow-menu" (click)="$event.stopPropagation()">
            <button type="button" class="overflow-trigger" (click)="toggleMenu($event)" aria-label="More options" title="More options">⋮</button>
            <div class="overflow-panel" *ngIf="menuOpen()">
              <button type="button" (click)="refreshFromTaxAuthority(); closeMenu()">Refresh from tax authority</button>
              <button type="button" (click)="validateRows(); closeMenu()">Validate rows</button>
              <button type="button" (click)="statusMessage.set('Print is not wired yet.'); closeMenu()">Print</button>
              <button type="button" (click)="statusMessage.set('Export to Excel is not wired yet.'); closeMenu()">Export to Excel</button>
            </div>
          </div>
          <button type="button" class="help-icon-btn" (click)="statusMessage.set('Help is not wired yet.')" aria-label="Help" title="Help">?</button>
        </div>
      </div>

      <article class="card table-card">
        <div class="section-head">
          <h4>Properties</h4>
          <button type="button" class="add-btn" (click)="openEditor()">Add new</button>
        </div>

        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Company</th>
                <th>Year</th>
                <th>Type</th>
                <th>Name</th>
                <th>Matrikkel</th>
                <th class="num">Tax value</th>
                <th class="actions-col">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let row of rows(); let i = index">
                <td>{{ row.firmanr }}</td>
                <td>{{ row.aar }}</td>
                <td>{{ getTypeLabel(row.type) }}</td>
                <td>{{ row.navn || '-' }}</td>
                <td>{{ matrikkel(row) }}</td>
                <td class="num">{{ row.formuesverdi | number: '1.0-0' }}</td>
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
            <h4>{{ editorIndex() === -1 ? 'New property' : 'Edit property' }}</h4>
            <small>Detail form: {{ selectedDetailFormLabel() }}</small>
          </div>
          <button type="button" class="close-btn" (click)="closeEditor()">Close</button>
        </div>
        <div class="drawer-content" *ngIf="draft() as current">
          <div class="grid two">
            <label>Company no<input type="number" [(ngModel)]="current.firmanr" /></label>
            <label>Year<input [(ngModel)]="current.aar" /></label>
            <label>Type
              <select [(ngModel)]="current.type" [disabled]="editorIndex() !== -1">
                <option *ngFor="let option of typeOptions" [ngValue]="option.id">{{ option.label }}</option>
              </select>
            </label>
            <label>Name<input [(ngModel)]="current.navn" /></label>
            <label>Municipality no<input [(ngModel)]="current.kommunenummer" /></label>
            <label>Gaards no<input type="number" [(ngModel)]="current.gaardsnummer" /></label>
            <label>Bruks no<input type="number" [(ngModel)]="current.bruksnummer" /></label>
            <label>Feste no<input type="number" [(ngModel)]="current.festenummer" /></label>
            <label>Seksjon no<input type="number" [(ngModel)]="current.seksjonsnummer" /></label>
            <label>Tax value<input type="number" [(ngModel)]="current.formuesverdi" /></label>
            <label>Matrikkel<input [ngModel]="matrikkel(current)" readonly /></label>
            <label>Detail form<input [ngModel]="selectedDetailFormLabel()" readonly /></label>
          </div>

          <section class="subtype-section" *ngIf="selectedDetailFormLabel() === 'SM_FastEiendomBolig'">
            <h5>Residential details</h5>
            <div class="grid two">
              <label>SERG property identifier<input [(ngModel)]="current.sergEiendomsidentifikator" /></label>
              <label>Residential area<input type="number" [(ngModel)]="current.boligensAreal" /></label>
              <label>Residential type<input [(ngModel)]="current.boligtype" /></label>
              <label>Construction year<input type="number" [(ngModel)]="current.byggeaar" /></label>
              <label>Residential usage<input [(ngModel)]="current.boligbruk" /></label>
              <label>Calculated market value<input type="number" [(ngModel)]="current.beregnetMarkedsverdiForBolig" /></label>
              <label>Documented market value<input type="number" [(ngModel)]="current.dokumentertMarkedsverdiForBolig" /></label>
              <label>Documented market value date<input type="date" [(ngModel)]="current.datoForDokumentertMarkedsverdiForBolig" /></label>
              <label>Residential wealth value<input type="number" [(ngModel)]="current.formuesverdiForBolig" /></label>
              <label class="check-row"><input type="checkbox" [(ngModel)]="current.markedsverdiErGrunnlag" /> Market value is basis</label>
              <label>Ownership share of wealth value (%)<input type="number" [(ngModel)]="current.andelAvFormuesverdi" /></label>
              <label>Wealth value for ownership share<input type="number" [(ngModel)]="current.formuesverdiForFormuesandel" /></label>
              <label>Value before valuation discount (share)<input type="number" [(ngModel)]="current.verdiFoerVerdsettingsrabattForFormuesandel" /></label>
              <label>Housing company org no<input [(ngModel)]="current.boligselskapetsOrganisasjonsnummer" /></label>
              <label>Housing company name<input [(ngModel)]="current.boligselskapetsNavn" /></label>
              <label>Share unit number<input type="number" [(ngModel)]="current.aksjeboenhetsnummer" /></label>
              <label>Andels number<input type="number" [(ngModel)]="current.andelsnummer" /></label>
              <label>Co-ownership name<input [(ngModel)]="current.boligsameietsNavn" /></label>
              <label>Co-ownership org no<input [(ngModel)]="current.boligsameietsOrganisasjonsnummer" /></label>
            </div>
          </section>

          <section class="subtype-section" *ngIf="selectedDetailFormLabel() === 'SM_FastEiendomFlerbolig'">
            <h5>Multi-dwelling details</h5>
            <div class="grid two">
              <label>Multi-dwelling wealth value<input type="number" [(ngModel)]="current.formuesverdiForFlerboligbygning" /></label>
              <label>Unsectioned dwelling units<input type="number" [(ngModel)]="current.antallUseksjonerteBoenheter" /></label>
              <label>Received market value year<input type="number" [(ngModel)]="current.aarForMottattMarkedsverdi" /></label>
              <label>Adjusted market value<input type="number" [(ngModel)]="current.justertMarkedsverdiForBolig" /></label>
              <label>Reduction factor<input type="number" [(ngModel)]="current.reduksjonsfaktorForJustertMarkedsverdiForBolig" /></label>
              <label>Prev year documented market value<input type="number" [(ngModel)]="current.dokumentertMarkedsverdiTidligereInntektsaar" /></label>
              <label>Prev year residential value<input type="number" [(ngModel)]="current.boligverdiTidligereInntektsaar" /></label>
              <label>Prev year calculated residential value<input type="number" [(ngModel)]="current.beregnetBoligverdiTidligereInntektsaar" /></label>
              <label>Ownership share of wealth value (%)<input type="number" [(ngModel)]="current.andelAvFormuesverdi" /></label>
              <label>Wealth value for ownership share<input type="number" [(ngModel)]="current.formuesverdiForFormuesandel" /></label>
              <label>Value before valuation discount (share)<input type="number" [(ngModel)]="current.verdiFoerVerdsettingsrabattForFormuesandel" /></label>
            </div>
            <div class="section-head">
              <h5>Unsectioned dwelling units</h5>
              <button type="button" class="add-btn" (click)="addUseksjonertBoenhet(current)">Add unit</button>
            </div>
            <div class="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Unit no</th>
                    <th class="num">Area</th>
                    <th>Type</th>
                    <th class="num">Build year</th>
                    <th class="num">Residential value</th>
                    <th class="num">Share value</th>
                    <th class="actions-col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let unit of current.useksjonerteBoenheter; let ui = index">
                    <td><input [(ngModel)]="unit.bruksenhetsnummer" /></td>
                    <td class="num"><input type="number" [(ngModel)]="unit.boligensAreal" /></td>
                    <td><input [(ngModel)]="unit.boligtype" /></td>
                    <td class="num"><input type="number" [(ngModel)]="unit.byggeaar" /></td>
                    <td class="num"><input type="number" [(ngModel)]="unit.boligverdiForUseksjonertBoenhet" /></td>
                    <td class="num"><input type="number" [(ngModel)]="unit.formuesverdiForFormuesandel" /></td>
                    <td class="actions-col">
                      <button type="button" class="icon-btn danger-icon-btn" title="Delete" aria-label="Delete" (click)="removeUseksjonertBoenhet(current, ui)">🗑</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section class="subtype-section" *ngIf="selectedDetailFormLabel() === 'SM_FastEiendomNaering'">
            <h5>Commercial details</h5>
            <div class="grid two">
              <label>Commercial property type<input [(ngModel)]="current.naeringseiendomstype" /></label>
              <label>Total area<input type="number" [(ngModel)]="current.naeringAreal" /></label>
              <label>Leased area<input type="number" [(ngModel)]="current.naeringUtleidAreal" /></label>
              <label>Leased months<input type="number" [(ngModel)]="current.naeringAntallMaanederUtleid" /></label>
              <label>Gross rental income<input type="number" [(ngModel)]="current.naeringBruttoUtleieinntekt" /></label>
              <label>Rental income year-1<input type="number" [(ngModel)]="current.naeringAarligUtleieinntektIAaretFoerInntektsaar" /></label>
              <label>Rental income year-2<input type="number" [(ngModel)]="current.naeringAarligUtleieinntektToAarFoerInntektsaar" /></label>
              <label>Reported rental income<input type="number" [(ngModel)]="current.naeringSisteRapporterteUtleieinntekt" /></label>
              <label>Computed rental value<input type="number" [(ngModel)]="current.naeringBeregnetUtleieverdi" /></label>
              <label>Documented market value<input type="number" [(ngModel)]="current.naeringDokumentertMarkedsverdi" /></label>
              <label>Documented market value date<input type="date" [(ngModel)]="current.naeringDatoForDokumentertMarkedsverdi" /></label>
              <label>Commercial wealth value<input type="number" [(ngModel)]="current.naeringFormuesverdi" /></label>
              <label class="check-row"><input type="checkbox" [(ngModel)]="current.naeringWizHeltEllerDelvisUtleid" /> Fully/partially leased</label>
              <label class="check-row"><input type="checkbox" [(ngModel)]="current.naeringWizUtleidSiste3Aar" /> Leased all last 3 years</label>
              <label class="check-row"><input type="checkbox" [(ngModel)]="current.naeringWizUtleidIAar" /> Leased this year</label>
            </div>
            <p class="muted">Commercial Property topic remains available for advanced calculations and full workflow.</p>
          </section>

          <section class="subtype-section" *ngIf="selectedDetailFormLabel() === 'SM_FastEiendomSkogINorge'">
            <h5>Forestry details</h5>
            <div class="grid two">
              <label>Forestry area<input type="number" [(ngModel)]="current.skogeiendomAreal" /></label>
              <label>Forestry yield<input type="number" [(ngModel)]="current.skogeiendomAvkastning" /></label>
            </div>
          </section>

          <section class="subtype-section" *ngIf="selectedDetailFormLabel() === 'SM_FastEiendomAndre'">
            <h5>Other property details</h5>
            <div class="grid two">
              <label>Address name abroad<input [(ngModel)]="current.iaAdressenavn" /></label>
              <label>Address number abroad<input [(ngModel)]="current.iaAdressenummer" /></label>
              <label>Postal code abroad<input [(ngModel)]="current.iaPostkode" /></label>
              <label>City abroad<input [(ngModel)]="current.iaByEllerStedsnavn" /></label>
              <label>Country code abroad<input [(ngModel)]="current.iaLandkode" /></label>
            </div>
          </section>
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
    .topic{display:grid;gap:10px;position:relative;min-height:560px;align-content:start}
    .fp-top-header{display:flex;justify-content:space-between;align-items:flex-start;margin:0;padding:0}
    .toolbar{display:flex;align-items:center;gap:8px}
    .fp-top-right-help{display:flex;flex-direction:column;align-items:flex-end;gap:6px}
    .next-btn{font-size:12px;background:#2563eb;color:#fff;border-color:#1d4ed8}
    .help-icon-btn{width:32px;height:32px;border-radius:999px;background:#eff6ff;color:#1e3a8a;border:1px solid #bfdbfe;font-weight:700}
    .overflow-menu{position:relative}
    .overflow-trigger{border:1px solid #cbd5e1;border-radius:6px;padding:3px 8px;background:#f8fafc;cursor:pointer;font-size:18px;line-height:1}
    .overflow-panel{position:absolute;top:34px;right:0;z-index:20;display:grid;gap:6px;min-width:210px;padding:8px;border:1px solid #dbe1ea;border-radius:8px;background:#fff;box-shadow:0 8px 20px rgba(15,23,42,.12)}
    .overflow-panel button{text-align:left}
    .card{background:#fff;border:1px solid #dbe1ea;border-radius:10px;padding:12px;display:grid;gap:8px}
    .table-card{overflow:auto}
    .section-head{display:flex;justify-content:space-between;align-items:center;gap:8px}
    .table-wrap{overflow:auto}
    table{width:100%;border-collapse:collapse;min-width:760px}
    th,td{border-bottom:1px solid #e2e8f0;padding:8px 6px;font-size:12px;vertical-align:middle}
    thead{background:#f8fafc}
    tbody tr:hover{background:#f8fafc}
    .num{text-align:right;font-variant-numeric:tabular-nums}
    .actions-col{width:140px;text-align:right}
    .icon-btn{background:#eff6ff;border-color:#bfdbfe;color:#1e40af;padding:6px 8px;line-height:1}
    .danger-icon-btn{color:#b91c1c;border-color:#fecaca;background:#fff1f2}
    .add-btn{background:#eff6ff;border-color:#bfdbfe;color:#1e40af;font-weight:600}
    input,button,select{border:1px solid #cbd5e1;border-radius:6px;padding:6px 8px;font-size:12px}
    input[readonly],input:disabled,select:disabled{background:#f1f5f9;color:#64748b;cursor:not-allowed}
    .detail-drawer{position:absolute;top:12px;right:12px;width:0;opacity:0;height:calc(100% - 24px);background:#fff;border:1px solid #dbe1ea;border-radius:10px;overflow:hidden;transition:width .18s ease,opacity .18s ease;pointer-events:none;display:flex;flex-direction:column;z-index:10}
    .detail-drawer.open{width:460px;opacity:1;pointer-events:auto}
    .drawer-header{display:flex;justify-content:space-between;align-items:center;padding:12px;border-bottom:1px solid #e5e7eb;background:#f8fafc}
    .drawer-content{padding:12px;overflow:auto;overflow-x:hidden;display:grid;gap:10px;height:calc(100% - 120px)}
    .grid{display:grid;gap:8px}
    .grid.two{grid-template-columns:minmax(0,1fr) minmax(0,1fr)}
    label{display:flex;flex-direction:column;font-size:12px;gap:4px;color:#475569;line-height:1.35;min-width:0}
    input,select{min-width:0;max-width:100%}
    .drawer-actions{display:flex;justify-content:flex-end;gap:8px;padding:12px;border-top:1px solid #e5e7eb}
    .subtype-section{border:1px solid #e2e8f0;border-radius:8px;padding:10px;display:grid;gap:8px}
    .subtype-section h5{margin:0;font-size:12px}
    .check-row{display:flex;flex-direction:row;align-items:center;gap:8px}
    .err{color:#b91c1c;margin:0;font-size:12px}
    .muted{color:#64748b;font-size:12px}
  `]
})
export class FasteEiendommerTopicComponent {
  readonly typeOptions: TypeOption[] = [
    { tag: 16, id: 'naeringseiendom', label: 'Leased commercial property', group: 'main', detailForm: 'naering' },
    { tag: 5, id: 'selveidBolig', label: 'Owner-occupied residential', group: 'main', detailForm: 'bolig' },
    { tag: 1, id: 'selveidFritidseiendom', label: 'Holiday property', group: 'main', detailForm: 'andre' },
    { tag: 6, id: 'flerboligbygning', label: 'Flerboligbygning', group: 'main', detailForm: 'flerbolig' },
    { tag: 19, id: 'boenhetIBoligselskap', label: 'Bolig i borettslag eller andelslag', group: 'main', detailForm: 'bolig' },
    { tag: 2, id: 'tomt', label: 'Tomt', group: 'main', detailForm: 'andre' },
    { tag: 20, id: 'skalIkkeFastsettes', label: 'Do not assess', group: 'main', detailForm: 'andre' },

    { tag: 9, id: 'regnskapsbehandletBolig', label: 'Regnskapsbehandlet bolig', group: 'other-types', detailForm: 'andre' },
    { tag: 10, id: 'egenFritaksbehandletBolig', label: 'Egen fritaksbehandlet bolig', group: 'other-types', detailForm: 'andre' },
    { tag: 11, id: 'regnskapsbehandletFritidseiendom', label: 'Regnskapsbehandlet fritidseiendom', group: 'other-types', detailForm: 'andre' },
    { tag: 12, id: 'egenFritaksbehandletFritidseiendom', label: 'Egen fritaksbehandlet fritidseiendom', group: 'other-types', detailForm: 'andre' },
    { tag: 3, id: 'annenFastEiendomInnenforInntektsgivendeAktivitet', label: 'Annen fast eiendom innenfor inntektsgivende aktivitet', group: 'other-types', detailForm: 'andre' },
    { tag: 4, id: 'annenFastEiendomUtenforInntektsgivendeAktivitet', label: 'Annen fast eiendom utenfor inntektsgivende aktivitet', group: 'other-types', detailForm: 'andre' },
    { tag: 8, id: 'borett', label: 'Borett', group: 'other-types', detailForm: 'andre' },
    { tag: 13, id: 'gaardsbruk', label: 'Gaardsbruk', group: 'other-types', detailForm: 'andre' },
    { tag: 22, id: 'skogeiendomINorge', label: 'Skogeiendom i Norge', group: 'other-types', detailForm: 'skog-norge' },
    { tag: 15, id: 'utleidFlerboligbygningIUtlandet', label: 'Utleid flerboligbygning utland', group: 'other-types', detailForm: 'andre' },
    { tag: 21, id: 'ikkeUtleidNaeringseiendomIUtlandet', label: 'Ikke utleid naeringseiendom i utlandet', group: 'other-types', detailForm: 'naering' },
    { tag: 18, id: 'skogeiendomIUtlandet', label: 'Skog utlandet', group: 'other-types', detailForm: 'andre' },
    { tag: 23, id: 'fastEiendomPaaSvalbard', label: 'Fast eiendom paa Svalbard', group: 'other-types', detailForm: 'andre' },
    { tag: 14, id: 'ikkeUtleidNaeringseiendomINorge', label: 'Ikke-utleid naeringseiendom', group: 'other-types', detailForm: 'naering' }
  ];

  readonly rows = signal<PropertyRow[]>([
    {
      id: 'fe-1',
      firmanr: 101,
      aar: '2025',
      type: 'naeringseiendom',
      navn: 'Bryggegata 11',
      kommunenummer: '0301',
      gaardsnummer: 12,
      bruksnummer: 44,
      festenummer: 0,
      seksjonsnummer: 3,
      formuesverdi: 3900000
      ,
      sergEiendomsidentifikator: '',
      postnummer: '',
      poststedsnavn: '',
      husnummer: '',
      husbokstav: '',
      bruksenhetsnummer: '',
      iaAdressenavn: '',
      iaAdressenummer: '',
      iaPostkode: '',
      iaByEllerStedsnavn: '',
      iaLandkode: '',
      boligensAreal: 0,
      boligtype: '',
      byggeaar: 0,
      boligbruk: '',
      beregnetMarkedsverdiForBolig: 0,
      dokumentertMarkedsverdiForBolig: 0,
      datoForDokumentertMarkedsverdiForBolig: '',
      formuesverdiForBolig: 0,
      markedsverdiErGrunnlag: false,
      aarForMottattMarkedsverdi: 0,
      justertMarkedsverdiForBolig: 0,
      reduksjonsfaktorForJustertMarkedsverdiForBolig: 0,
      dokumentertMarkedsverdiTidligereInntektsaar: 0,
      boligverdiTidligereInntektsaar: 0,
      beregnetBoligverdiTidligereInntektsaar: 0,
      andelAvFormuesverdi: 0,
      formuesverdiForFormuesandel: 0,
      verdiFoerVerdsettingsrabattForFormuesandel: 0,
      boligselskapetsOrganisasjonsnummer: '',
      boligselskapetsNavn: '',
      aksjeboenhetsnummer: 0,
      andelsnummer: 0,
      boligsameietsNavn: '',
      boligsameietsOrganisasjonsnummer: '',
      formuesverdiForFlerboligbygning: 0,
      antallUseksjonerteBoenheter: 0,
      useksjonerteBoenheter: [],
      naeringseiendomstype: '',
      naeringAreal: 0,
      naeringUtleidAreal: 0,
      naeringAntallMaanederUtleid: 0,
      naeringBruttoUtleieinntekt: 0,
      naeringAarligUtleieinntektIAaretFoerInntektsaar: 0,
      naeringAarligUtleieinntektToAarFoerInntektsaar: 0,
      naeringSisteRapporterteUtleieinntekt: 0,
      naeringBeregnetUtleieverdi: 0,
      naeringDokumentertMarkedsverdi: 0,
      naeringDatoForDokumentertMarkedsverdi: '',
      naeringFormuesverdi: 0,
      naeringWizHeltEllerDelvisUtleid: false,
      naeringWizUtleidSiste3Aar: false,
      naeringWizUtleidIAar: false,
      skogeiendomAreal: 0,
      skogeiendomAvkastning: 0
    }
  ]);
  readonly editorOpen = signal(false);
  readonly editorIndex = signal(-1);
  readonly draft = signal<PropertyRow | null>(null);
  readonly editorError = signal('');
  readonly statusMessage = signal('');
  readonly menuOpen = signal(false);

  openEditor(index = -1): void {
    this.editorIndex.set(index);
    this.draft.set(index === -1 ? this.createEmptyRow(this.typeOptions[0].id) : { ...this.rows()[index] });
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
    if (!current.navn.trim()) {
      this.editorError.set('Name is required.');
      return;
    }
    const idx = this.editorIndex();
    if (idx === -1) {
      this.rows.update((rows) => [current, ...rows]);
      this.statusMessage.set('Property row added.');
    } else {
      this.rows.update((rows) => rows.map((r, i) => (i === idx ? current : r)));
      this.statusMessage.set('Property row updated.');
    }
    this.closeEditor();
  }

  removeRow(index: number): void {
    const row = this.rows()[index];
    if (!row) return;
    const detailForm = this.getDetailFormLabelByType(row.type);
    const confirmed = confirm(`Delete selected row using ${detailForm} delete flow?`);
    if (!confirmed) return;

    this.rows.update((rows) => rows.filter((_, i) => i !== index));
    this.statusMessage.set(`Deleted row via ${detailForm} flow.`);
  }

  validateRows(): void {
    const invalid = this.rows().some((r) => !r.type || !r.navn.trim());
    this.statusMessage.set(invalid ? 'Validation failed.' : 'Validation passed.');
  }

  refreshFromTaxAuthority(): void {
    this.rows.update((rows) =>
      rows.map((row) => ({
        ...row,
        formuesverdi: Math.round(row.formuesverdi * 1.01)
      }))
    );
    this.statusMessage.set('Refreshed property addresses/values from tax authority (mock).');
  }

  matrikkel(row: PropertyRow): string {
    return `${row.kommunenummer || '-'}-${row.gaardsnummer || 0}/${row.bruksnummer || 0}/${row.festenummer || 0}/${row.seksjonsnummer || 0}`;
  }

  getTypeLabel(type: PropertyType): string {
    return this.typeOptions.find((t) => t.id === type)?.label ?? type;
  }

  getOptionsByGroup(group: TypeOption['group']): TypeOption[] {
    return this.typeOptions.filter((option) => option.group === group);
  }

  selectedDetailFormLabel(): string {
    const type = this.draft()?.type;
    if (!type) return '-';
    return this.getDetailFormLabelByType(type);
  }

  private getDetailFormLabelByType(type: PropertyType): string {
    const route = this.typeOptions.find((t) => t.id === type)?.detailForm ?? 'andre';
    if (route === 'bolig') return 'SM_FastEiendomBolig';
    if (route === 'flerbolig') return 'SM_FastEiendomFlerbolig';
    if (route === 'naering') return 'SM_FastEiendomNaering';
    if (route === 'skog-norge') return 'SM_FastEiendomSkogINorge';
    return 'SM_FastEiendomAndre';
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

  addUseksjonertBoenhet(row: PropertyRow): void {
    row.useksjonerteBoenheter.push({
      idX: `ux-${Date.now()}-${row.useksjonerteBoenheter.length + 1}`,
      boligverdiForUseksjonertBoenhet: 0,
      bruksenhetsnummer: '',
      formuesverdiForFormuesandel: 0,
      verdiFoerVerdsettingsrabattForFormuesandel: 0,
      boligensAreal: 0,
      boligtype: '',
      byggeaar: 0,
      boligbruk: ''
    });
    row.antallUseksjonerteBoenheter = row.useksjonerteBoenheter.length;
  }

  removeUseksjonertBoenhet(row: PropertyRow, index: number): void {
    row.useksjonerteBoenheter.splice(index, 1);
    row.antallUseksjonerteBoenheter = row.useksjonerteBoenheter.length;
  }

  private createEmptyRow(type: PropertyType): PropertyRow {
    return {
      id: `fe-${Date.now()}`,
      firmanr: 101,
      aar: '2025',
      type,
      navn: '',
      kommunenummer: '',
      gaardsnummer: 0,
      bruksnummer: 0,
      festenummer: 0,
      seksjonsnummer: 0,
      formuesverdi: 0
      ,
      sergEiendomsidentifikator: '',
      postnummer: '',
      poststedsnavn: '',
      husnummer: '',
      husbokstav: '',
      bruksenhetsnummer: '',
      iaAdressenavn: '',
      iaAdressenummer: '',
      iaPostkode: '',
      iaByEllerStedsnavn: '',
      iaLandkode: '',
      boligensAreal: 0,
      boligtype: '',
      byggeaar: 0,
      boligbruk: '',
      beregnetMarkedsverdiForBolig: 0,
      dokumentertMarkedsverdiForBolig: 0,
      datoForDokumentertMarkedsverdiForBolig: '',
      formuesverdiForBolig: 0,
      markedsverdiErGrunnlag: false,
      aarForMottattMarkedsverdi: 0,
      justertMarkedsverdiForBolig: 0,
      reduksjonsfaktorForJustertMarkedsverdiForBolig: 0,
      dokumentertMarkedsverdiTidligereInntektsaar: 0,
      boligverdiTidligereInntektsaar: 0,
      beregnetBoligverdiTidligereInntektsaar: 0,
      andelAvFormuesverdi: 0,
      formuesverdiForFormuesandel: 0,
      verdiFoerVerdsettingsrabattForFormuesandel: 0,
      boligselskapetsOrganisasjonsnummer: '',
      boligselskapetsNavn: '',
      aksjeboenhetsnummer: 0,
      andelsnummer: 0,
      boligsameietsNavn: '',
      boligsameietsOrganisasjonsnummer: '',
      formuesverdiForFlerboligbygning: 0,
      antallUseksjonerteBoenheter: 0,
      useksjonerteBoenheter: [],
      naeringseiendomstype: '',
      naeringAreal: 0,
      naeringUtleidAreal: 0,
      naeringAntallMaanederUtleid: 0,
      naeringBruttoUtleieinntekt: 0,
      naeringAarligUtleieinntektIAaretFoerInntektsaar: 0,
      naeringAarligUtleieinntektToAarFoerInntektsaar: 0,
      naeringSisteRapporterteUtleieinntekt: 0,
      naeringBeregnetUtleieverdi: 0,
      naeringDokumentertMarkedsverdi: 0,
      naeringDatoForDokumentertMarkedsverdi: '',
      naeringFormuesverdi: 0,
      naeringWizHeltEllerDelvisUtleid: false,
      naeringWizUtleidSiste3Aar: false,
      naeringWizUtleidIAar: false,
      skogeiendomAreal: 0,
      skogeiendomAvkastning: 0
    };
  }
}
