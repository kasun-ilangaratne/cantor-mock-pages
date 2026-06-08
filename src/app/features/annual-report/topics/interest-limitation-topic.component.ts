import { CommonModule } from '@angular/common';
import { Component, HostListener, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

type RentN = number;

interface RentebegrRecord {
  id: string;
  firmanr: number;
  aar: string;
  harRentekostnadLavereEnnTerskelbeloepPerNorskDelAvKonsern: boolean;
  erKonsernIhtRegelverkForRentebegrensning: boolean;
  totalRentekostnad: RentN;
  garantiprovisjonForGjeld: RentN;
  totalRenteinntekt: RentN;
  gevinstVedRealisasjonAvOverEllerUnderkursobligasjon: RentN;
  tapVedRealisasjonAvOverEllerUnderkursobligasjon: RentN;
  gevinstVedRealisasjonAvSammensattMengdegjeldsbrevEllerFordringSomIkkeSkalDekomponeres: RentN;
  tapVedRealisasjonAvSammensattMengdegjeldsbrevEllerFordringSomIkkeSkalDekomponeres: RentN;
  nettoRentekostnad: RentN;
  fremfoerbarRentekostnad: RentN;
  fradragForKonsernbidragSomSkalEkskluderes: RentN;
  tilleggForSkattemessigAvskrivning: RentN;
  direkteInntektsfoertVederlagForAvskrevetAnleggsmiddel: RentN;
  periodisertLeiekostnad: RentN;
  grunnlagForRentefradragsramme: RentN;
  rentefradragsramme: RentN;
  differanseMellomNettoRentekostnadOgRentefradragsrammen: RentN;
  tilleggIInntektSomFoelgeAvRentebegrensning: RentN;
  fradragIInntektSomFoelgeAvRentebegrensning: RentN;
  aaretsTilleggIInntekt: RentN;
  aaretsFradragIInntekt: RentN;
  fremfoerbartRentefradragIInntekt: RentN;
  spesifikasjonRapportertPaaVegneAvKonsern: boolean;
  UnntaksregelBenyttes: boolean;
  HarSelskapetMottattKonsernbidragMedSkatteeffektDirekteEllerIndirekteFraSelskapSomErUnntattRentebegr: boolean;
  selskapErInkludertIAnnenInnrapportering: boolean;
  KRnavn: string;
  KRidentifikator: string;
  KRlandkode: string;
  ASnavn: string;
  ASidentifikator: string;
  ASlandkode: string;
  samletMottattKonsernbidrag: number;
  sumAndelAvMotattKonsernbidragSomErAvgittTilAnnetSelskap: number;
  korrigertRentestoerrelse: number;
  diffkorrigertRentestoerrelse: number;
  rammeNettoRentekostnad: number;
  anvendtNettoRentekostnad: number;
  deltakerrolle: string;
  totalRentekostnad_O: boolean;
  garantiprovisjonForGjeld_O: boolean;
  totalRenteinntekt_O: boolean;
  gevinstVedRealisasjonAvOverEllerUnderkursobligasjon_O: boolean;
  tapVedRealisasjonAvOverEllerUnderkursobligasjon_O: boolean;
  gevinstVedRealisasjonAvSammensattMengdegjeldsbrevEllerFordringSomIkkeSkalDekomponeres_O: boolean;
  tapVedRealisasjonAvSammensattMengdegjeldsbrevEllerFordringSomIkkeSkalDekomponeres_O: boolean;
  UnntaksregelBenyttes_O: boolean;
}

interface AnnetSelskapIKonsernRow {
  id: string;
  idFn: string;
  selskapetsNavn: string;
  selskapetsOrganisasjonsnummer: string;
  nettoRentekostnad: number;
  nettoFradragsfoertRentekostnad: number;
}

interface NaerstaaendeRow {
  id: string;
  idFn: string;
  nsType: string;
  navn: string;
  identifikator: string;
  landkode: string;
  rentekostnadBetaltTilSelskapMvISammeKonsern: number;
  rentekostnadBetaltTilAnnenNaerstaaendePart: number;
  renteinntektMottattFraSelskapMvISammeKonsern: number;
  renteinntektMottattFraAnnenNaerstaaendePart: number;
}

interface FremfoertRentefradragRow {
  inntektsaar: string;
  fremfoertRentefradragFraTidligereAar: number;
  aaretsAnvendelseAvFremfoertRentefradragFraTidligereAar: number;
  fremfoerbartRentefradragIInntekt: number;
}

interface KonsernbPerMotpartRow {
  id: string;
  idFn: string;
  avgivendeSelskapsIdentifikator: string;
  mottattBeloep: number;
}

interface AvgittAndelKonsernbRow {
  id: string;
  idFn: string;
  mottakendeSelskapsIdentifikator: string;
  andelAvMotattKonsernbidragSomErAvgittTilAnnetSelskap: number;
}

interface KonsernBidragskjedeRow {
  id: string;
  idFn: string;
  konsernbidragskjedeidentifikator: string;
  aarsakTilAtAvgivendeSelskapErUnntattRentebegrensning: string;
  navnOpprinnleligSelsk: string;
  identifikatorOpprinnleligSelsk: string;
  landkodeOpprinnleligSelsk: string;
}

interface KonsernBidragPerTransRow {
  id: string;
  idFn: string;
  navnAvgivendeSelsk: string;
  identifikatorAvgivendeSelsk: string;
  landkodeAvgivendeSelsk: string;
  navnMottakendeSelsk: string;
  identifikatorMottakendeSelsk: string;
  landkodeMottakendeSelsk: string;
  transaksjonsbeloep: number;
}

interface UnntakRecord {
  erHelnorskKonsern: boolean;
  unntaksregeltype: string;
  selskapetErInkludertIAnnenInnrapportering: boolean;
  auNavn: string;
  auIdentifikator: string;
  auLandkode: string;
  positivEgenkapitalIKonsernregnskapGlobalt: number;
  negativEgenkapitalIKonsernregnskapGlobalt: number;
  balansesumIKonsernregnskapGlobalt: number;
  egenkapitalandelIKonsernregnskap: number;
  egenkapitalVedUtgangenAvRegnskapsaaretFoerInntektsaaret: number;
  samletKorrigertEgenkapitalISelskapetEllerNorskDelAvKonsernet: number;
  balansesumVedUtgangenAvRegnskapsaaretFoerInntektsaaret: number;
  samletKorrigertBalansesumISelskapetEllerNorskDelAvKonsernet: number;
  egenkapitalandelForSelskapetEllerNorskDelAvKonsernet: number;
  unntakForRentebegrensningSkalBekreftesAvRevisor: boolean;
}

interface UnntakAnnetSelskRow {
  id: string;
  selskapetsNavn: string;
  selskapetsOrganisasjonsnummer: string;
  landkode: string;
  erInkludertIKonsernregnskap: boolean;
  eierandelIProsent: number;
}

interface UnntakOmarbeidelseRow {
  id: string;
  balansekonto: string;
  positivEffektPaaEgenkapital: number;
  negativEffektPaaEgenkapital: number;
  positivEffektPaaBalansesum: number;
  negativEffektPaaBalansesum: number;
}

@Component({
  selector: 'app-interest-limitation-topic',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="topic">
      <div class="top-right-help">
        <button type="button" class="next-btn" (click)="goToNextTopic()">Next topic →</button>
        <div class="overflow-menu" (click)="$event.stopPropagation()">
          <button type="button" class="overflow-trigger" (click)="toggleOverflowMenu($event)" aria-label="More actions" title="More actions">⋮</button>
          <div class="overflow-panel" *ngIf="overflowMenuOpen()">
            <button type="button" (click)="printTopic(); closeOverflowMenu()">Print</button>
            <button type="button" (click)="resetOverrides(); closeOverflowMenu()">Reset overrides</button>
          </div>
        </div>
        <button type="button" class="help-icon-btn" (click)="openGuide()" aria-label="Help" title="Help">?</button>
      </div>
      <p class="muted">RF1315/RF1509-style structure with main row and related detail tables.</p>
      <p class="muted" *ngIf="statusMessage()">{{ statusMessage() }}</p>
      <div class="tabs">
        <button type="button" [class.active]="activeTab() === 'main'" (click)="setActiveTab('main')">Main</button>
        <button type="button" [class.active]="activeTab() === 'annet'" (click)="setActiveTab('annet')">Other group companies</button>
        <button type="button" [class.active]="activeTab() === 'naerI'" (click)="setActiveTab('naerI')">Related I</button>
        <button type="button" [class.active]="activeTab() === 'naerG'" (click)="setActiveTab('naerG')">Related G</button>
        <button type="button" [class.active]="activeTab() === 'naerF'" (click)="setActiveTab('naerF')">Related F</button>
        <button type="button" [class.active]="activeTab() === 'fremfoert'" (click)="setActiveTab('fremfoert')">Carryforward</button>
        <button type="button" [class.active]="activeTab() === 'motpart'" (click)="setActiveTab('motpart')">Counterparty</button>
        <button type="button" [class.active]="activeTab() === 'kjede'" (click)="setActiveTab('kjede')">Contribution chain</button>
        <button type="button" [class.active]="activeTab() === 'trans'" (click)="setActiveTab('trans')">Transactions</button>
        <button type="button" [class.active]="activeTab() === 'unntak'" (click)="setActiveTab('unntak')">Exception (RF1509)</button>
      </div>
      <p class="warn" *ngIf="validationError()">{{ validationError() }}</p>
      <ng-container *ngIf="activeTab() === 'main'">
      <div class="layout">
      <section class="card table-card">
      <div class="section-head">
        <h4>Main records</h4>
        <button type="button" class="add-btn" (click)="addMainRecord()">Add</button>
      </div>
      <p class="muted">Row {{ currentMainPositionLabel() }}</p>
      <table class="assets-table">
        <thead>
          <tr>
            <th>Year</th>
            <th>Below threshold</th>
            <th>Group company</th>
            <th>Exception rule</th>
            <th>Reported for group</th>
            <th class="num">Net interest cost</th>
            <th class="num">Deduction framework</th>
            <th class="num">Difference</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let row of mainRecords()" [class.selected-row]="row.id === record().id" (click)="openMainDrawer(row.id)">
            <td>{{ row.aar }}</td>
            <td>{{ row.harRentekostnadLavereEnnTerskelbeloepPerNorskDelAvKonsern ? 'Yes' : 'No' }}</td>
            <td>{{ row.erKonsernIhtRegelverkForRentebegrensning ? 'Yes' : 'No' }}</td>
            <td>{{ row.UnntaksregelBenyttes ? 'Yes' : 'No' }}</td>
            <td>{{ row.spesifikasjonRapportertPaaVegneAvKonsern ? 'Yes' : 'No' }}</td>
            <td class="num">{{ row.nettoRentekostnad | number: '1.0-0' }}</td>
            <td class="num">{{ row.rentefradragsramme | number: '1.0-0' }}</td>
            <td class="num">{{ row.differanseMellomNettoRentekostnadOgRentefradragsrammen | number: '1.0-0' }}</td>
            <td class="row-actions">
              <button type="button" class="icon-btn" (click)="openMainDrawer(row.id); $event.stopPropagation()">✎</button>
              <button type="button" class="icon-btn danger-icon-btn" title="Delete" aria-label="Delete" [disabled]="mainRecords().length <= 1" (click)="deleteMainRecord(row.id); $event.stopPropagation()">🗑</button>
            </td>
          </tr>
        </tbody>
      </table>
      </section>

      <aside class="detail-drawer" [class.open]="mainDrawerOpen()">
      <div class="drawer-header">
        <div>
          <h3>Interest limitation details</h3>
          <small>{{ record().id }}</small>
        </div>
        <button type="button" class="close-btn" (click)="closeMainDrawer()">Close</button>
      </div>
      <div class="drawer-content">
      <section class="card">
      <div class="grid boolean-grid">
        <label class="toggle-inline">
          Below threshold
          <span class="toggle">
            <input type="checkbox" [(ngModel)]="record().harRentekostnadLavereEnnTerskelbeloepPerNorskDelAvKonsern" (ngModelChange)="syncCurrentRecord()" />
            <span class="toggle-slider"></span>
          </span>
        </label>
        <label class="toggle-inline">
          Group company
          <span class="toggle">
            <input type="checkbox" [(ngModel)]="record().erKonsernIhtRegelverkForRentebegrensning" (ngModelChange)="syncCurrentRecord()" />
            <span class="toggle-slider"></span>
          </span>
        </label>
        <label class="toggle-inline">
          Exception rule applies
          <span class="toggle">
            <input type="checkbox" [(ngModel)]="record().UnntaksregelBenyttes" (ngModelChange)="syncCurrentRecord()" />
            <span class="toggle-slider"></span>
          </span>
        </label>
        <label class="toggle-inline">
          Reported on behalf of group
          <span class="toggle">
            <input type="checkbox" [(ngModel)]="record().spesifikasjonRapportertPaaVegneAvKonsern" (ngModelChange)="syncCurrentRecord()" />
            <span class="toggle-slider"></span>
          </span>
        </label>
      </div>
      <div class="grid two">
        <label>Total interest cost <input type="number" [(ngModel)]="record().totalRentekostnad" (ngModelChange)="recalc()" /></label>
        <label>Guarantee provision debt <input type="number" [(ngModel)]="record().garantiprovisjonForGjeld" (ngModelChange)="recalc()" /></label>
        <label>Total interest income <input type="number" [(ngModel)]="record().totalRenteinntekt" (ngModelChange)="recalc()" /></label>
        <label>Bond realization gain <input type="number" [(ngModel)]="record().gevinstVedRealisasjonAvOverEllerUnderkursobligasjon" (ngModelChange)="recalc()" /></label>
        <label>Bond realization loss <input type="number" [(ngModel)]="record().tapVedRealisasjonAvOverEllerUnderkursobligasjon" (ngModelChange)="recalc()" /></label>
        <label>Composite debt gain <input type="number" [(ngModel)]="record().gevinstVedRealisasjonAvSammensattMengdegjeldsbrevEllerFordringSomIkkeSkalDekomponeres" (ngModelChange)="recalc()" /></label>
        <label>Composite debt loss <input type="number" [(ngModel)]="record().tapVedRealisasjonAvSammensattMengdegjeldsbrevEllerFordringSomIkkeSkalDekomponeres" (ngModelChange)="recalc()" /></label>
        <label>Net interest cost <input type="number" [ngModel]="record().nettoRentekostnad" readonly /></label>
        <label>Deduction for group contribution excluded <input type="number" [(ngModel)]="record().fradragForKonsernbidragSomSkalEkskluderes" (ngModelChange)="recalc()" /></label>
        <label>Tax depreciation addition <input type="number" [(ngModel)]="record().tilleggForSkattemessigAvskrivning" (ngModelChange)="recalc()" /></label>
        <label>Direct recognized proceeds (written-down assets) <input type="number" [(ngModel)]="record().direkteInntektsfoertVederlagForAvskrevetAnleggsmiddel" (ngModelChange)="recalc()" /></label>
        <label>Accrued lease expense <input type="number" [(ngModel)]="record().periodisertLeiekostnad" (ngModelChange)="recalc()" /></label>
        <label>Deduction framework base <input type="number" [(ngModel)]="record().grunnlagForRentefradragsramme" (ngModelChange)="recalc()" /></label>
        <label>Deduction framework <input type="number" [ngModel]="record().rentefradragsramme" readonly /></label>
        <label>Year addition <input type="number" [ngModel]="record().aaretsTilleggIInntekt" readonly /></label>
        <label>Year deduction <input type="number" [ngModel]="record().aaretsFradragIInntekt" readonly /></label>
      </div>
      <p class="muted">Condition mirrored: when net exceeds framework, excess goes to income addition; otherwise to income deduction.</p>
      </section>
      </div>
      </aside>
      </div>
      </ng-container>
      <ng-container *ngIf="activeTab() === 'annet'">
        <div class="section-head"><h4>Other group companies</h4><button type="button" class="add-btn" (click)="addAnnetSelskap()">Add</button></div>
        <section class="card">
        <table class="assets-table">
          <thead><tr><th>Name</th><th>Org no</th><th>Net interest cost</th><th>Net deducted</th><th></th></tr></thead>
          <tbody>
            <tr *ngFor="let row of annetSelskapIKonsern(); let i = index">
              <td><input [(ngModel)]="row.selskapetsNavn" /></td>
              <td><input [(ngModel)]="row.selskapetsOrganisasjonsnummer" /></td>
              <td><input type="number" [(ngModel)]="row.nettoRentekostnad" /></td>
              <td><input type="number" [(ngModel)]="row.nettoFradragsfoertRentekostnad" /></td>
              <td><button type="button" class="icon-btn danger-icon-btn" title="Delete" aria-label="Delete" (click)="removeAt('annet', i)">🗑</button></td>
            </tr>
          </tbody>
        </table>
        </section>
      </ng-container>
      <ng-container *ngIf="activeTab() === 'naerI' || activeTab() === 'naerG' || activeTab() === 'naerF'">
        <div class="section-head"><h4>Related parties</h4><button type="button" class="add-btn" (click)="addNaerstaaende(activeTab() === 'naerI' ? 'I' : activeTab() === 'naerG' ? 'G' : 'F')">Add</button></div>
        <section class="card">
        <table class="assets-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Identifier</th>
              <th>Country</th>
              <th>Interest cost group</th>
              <th>Interest cost other</th>
              <th *ngIf="activeTab() === 'naerI'">Interest income group</th>
              <th *ngIf="activeTab() === 'naerI'">Interest income other</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let row of currentNaerstaaende(); let i = index">
              <td><input [(ngModel)]="row.navn" /></td>
              <td><input [(ngModel)]="row.identifikator" /></td>
              <td><input [(ngModel)]="row.landkode" /></td>
              <td><input type="number" [(ngModel)]="row.rentekostnadBetaltTilSelskapMvISammeKonsern" /></td>
              <td><input type="number" [(ngModel)]="row.rentekostnadBetaltTilAnnenNaerstaaendePart" /></td>
              <td *ngIf="activeTab() === 'naerI'"><input type="number" [(ngModel)]="row.renteinntektMottattFraSelskapMvISammeKonsern" /></td>
              <td *ngIf="activeTab() === 'naerI'"><input type="number" [(ngModel)]="row.renteinntektMottattFraAnnenNaerstaaendePart" /></td>
              <td><button type="button" class="icon-btn danger-icon-btn" title="Delete" aria-label="Delete" (click)="removeCurrentNaerstaaende(i)">🗑</button></td>
            </tr>
          </tbody>
        </table>
        </section>
      </ng-container>
      <ng-container *ngIf="activeTab() === 'fremfoert'">
        <section class="card">
        <table class="assets-table">
          <thead><tr><th>Income year</th><th>Carryforward from previous</th><th>Applied this year</th><th>Carryforward remaining</th></tr></thead>
          <tbody>
            <tr *ngFor="let row of fremfoertRentefradrag()">
              <td>{{ row.inntektsaar }}</td>
              <td><input type="number" [(ngModel)]="row.fremfoertRentefradragFraTidligereAar" [readonly]="isCurrentIncomeYear(row.inntektsaar)" /></td>
              <td><input type="number" [(ngModel)]="row.aaretsAnvendelseAvFremfoertRentefradragFraTidligereAar" [readonly]="isCurrentIncomeYear(row.inntektsaar)" /></td>
              <td><input type="number" [(ngModel)]="row.fremfoerbartRentefradragIInntekt" readonly /></td>
            </tr>
          </tbody>
        </table>
        </section>
      </ng-container>
      <ng-container *ngIf="activeTab() === 'motpart'">
        <div class="section-head">
          <h4>Counterparty rows</h4>
          <div class="toolbar">
            <button type="button" class="add-btn" (click)="addKonsernbPerMotpart()">Add</button>
            <button type="button" [disabled]="konsernbPerMotpart().length === 0" (click)="addAvgittAndelForSelected()">Add transferred share</button>
          </div>
        </div>
        <section class="card">
        <table class="assets-table">
          <thead><tr><th>Contributor identifier</th><th>Received amount</th><th></th></tr></thead>
          <tbody>
            <tr *ngFor="let row of konsernbPerMotpart(); let i = index">
              <td><input [(ngModel)]="row.avgivendeSelskapsIdentifikator" /></td>
              <td><input type="number" [(ngModel)]="row.mottattBeloep" (ngModelChange)="recalcFromCounterparty()" /></td>
              <td><button type="button" class="icon-btn danger-icon-btn" title="Delete" aria-label="Delete" (click)="removeAt('motpart', i)">🗑</button></td>
            </tr>
          </tbody>
        </table>
        <table class="assets-table" *ngIf="avgittAndelKonsernb().length > 0">
          <thead><tr><th>Parent counterparty id</th><th>Recipient identifier</th><th>Transferred share amount</th><th></th></tr></thead>
          <tbody>
            <tr *ngFor="let row of avgittAndelKonsernb(); let i = index">
              <td>{{ row.idFn }}</td>
              <td><input [(ngModel)]="row.mottakendeSelskapsIdentifikator" /></td>
              <td><input type="number" [(ngModel)]="row.andelAvMotattKonsernbidragSomErAvgittTilAnnetSelskap" (ngModelChange)="recalcFromCounterparty()" /></td>
              <td><button type="button" class="icon-btn danger-icon-btn" title="Delete" aria-label="Delete" (click)="removeAvgittAndel(i)">🗑</button></td>
            </tr>
          </tbody>
        </table>
        </section>
      </ng-container>
      <ng-container *ngIf="activeTab() === 'kjede'">
        <div class="section-head"><h4>Contribution chain rows</h4><button type="button" class="add-btn" (click)="addKonsernBidragskjede()">Add</button></div>
        <section class="card">
        <table class="assets-table">
          <thead><tr><th>Chain id</th><th>Reason</th><th>Original company name</th><th>Original identifier</th><th>Country</th><th></th></tr></thead>
          <tbody>
            <tr *ngFor="let row of konsernBidragskjede(); let i = index">
              <td><input [(ngModel)]="row.konsernbidragskjedeidentifikator" /></td>
              <td><input [(ngModel)]="row.aarsakTilAtAvgivendeSelskapErUnntattRentebegrensning" /></td>
              <td><input [(ngModel)]="row.navnOpprinnleligSelsk" /></td>
              <td><input [(ngModel)]="row.identifikatorOpprinnleligSelsk" /></td>
              <td><input [(ngModel)]="row.landkodeOpprinnleligSelsk" /></td>
              <td><button type="button" class="icon-btn danger-icon-btn" title="Delete" aria-label="Delete" (click)="removeAt('kjede', i)">🗑</button></td>
            </tr>
          </tbody>
        </table>
        </section>
      </ng-container>
      <ng-container *ngIf="activeTab() === 'trans'">
        <div class="section-head"><h4>Transaction rows</h4><button type="button" class="add-btn" (click)="addKonsernBidragPerTrans()">Add</button></div>
        <section class="card">
        <table class="assets-table">
          <thead><tr><th>From name</th><th>From id</th><th>From country</th><th>To name</th><th>To id</th><th>To country</th><th>Amount</th><th></th></tr></thead>
          <tbody>
            <tr *ngFor="let row of konsernBidragPerTrans(); let i = index">
              <td><input [(ngModel)]="row.navnAvgivendeSelsk" /></td>
              <td><input [(ngModel)]="row.identifikatorAvgivendeSelsk" /></td>
              <td><input [(ngModel)]="row.landkodeAvgivendeSelsk" /></td>
              <td><input [(ngModel)]="row.navnMottakendeSelsk" /></td>
              <td><input [(ngModel)]="row.identifikatorMottakendeSelsk" /></td>
              <td><input [(ngModel)]="row.landkodeMottakendeSelsk" /></td>
              <td><input type="number" [(ngModel)]="row.transaksjonsbeloep" /></td>
              <td><button type="button" class="icon-btn danger-icon-btn" title="Delete" aria-label="Delete" (click)="removeAt('trans', i)">🗑</button></td>
            </tr>
          </tbody>
        </table>
        </section>
      </ng-container>
      <ng-container *ngIf="activeTab() === 'unntak'">
        <section class="card">
          <div class="grid two">
            <label class="toggle-inline">
              Is all-Norwegian group
              <span class="toggle">
                <input type="checkbox" [(ngModel)]="unntak().erHelnorskKonsern" (ngModelChange)="recalcUnntak()" />
                <span class="toggle-slider"></span>
              </span>
            </label>
            <label class="toggle-inline">
              Included in other reporting
              <span class="toggle">
                <input type="checkbox" [(ngModel)]="unntak().selskapetErInkludertIAnnenInnrapportering" />
                <span class="toggle-slider"></span>
              </span>
            </label>
            <label class="toggle-inline">
              Must be auditor confirmed
              <span class="toggle">
                <input type="checkbox" [(ngModel)]="unntak().unntakForRentebegrensningSkalBekreftesAvRevisor" />
                <span class="toggle-slider"></span>
              </span>
            </label>
            <label>Exception rule type
              <select [(ngModel)]="unntak().unntaksregeltype">
                <option value="egenkapitalunntak">Equity exemption</option>
                <option value="balanseunntak">Balance exemption</option>
              </select>
            </label>
            <label>Reporting company name <input [(ngModel)]="unntak().auNavn" /></label>
            <label>Reporting company identifier <input [(ngModel)]="unntak().auIdentifikator" /></label>
            <label>Reporting company country <input [(ngModel)]="unntak().auLandkode" /></label>
            <label>Positive group equity <input type="number" [(ngModel)]="unntak().positivEgenkapitalIKonsernregnskapGlobalt" (ngModelChange)="recalcUnntak()" /></label>
            <label>Negative group equity <input type="number" [(ngModel)]="unntak().negativEgenkapitalIKonsernregnskapGlobalt" (ngModelChange)="recalcUnntak()" /></label>
            <label>Group balance sum <input type="number" [(ngModel)]="unntak().balansesumIKonsernregnskapGlobalt" (ngModelChange)="recalcUnntak()" /></label>
            <label>Group equity ratio <input type="number" [ngModel]="unntak().egenkapitalandelIKonsernregnskap" readonly /></label>
            <label>Equity before income year <input type="number" [(ngModel)]="unntak().egenkapitalVedUtgangenAvRegnskapsaaretFoerInntektsaaret" (ngModelChange)="recalcUnntak()" /></label>
            <label>Adjusted equity (company/Norwegian part) <input type="number" [(ngModel)]="unntak().samletKorrigertEgenkapitalISelskapetEllerNorskDelAvKonsernet" (ngModelChange)="recalcUnntak()" /></label>
            <label>Balance sum before income year <input type="number" [(ngModel)]="unntak().balansesumVedUtgangenAvRegnskapsaaretFoerInntektsaaret" (ngModelChange)="recalcUnntak()" /></label>
            <label>Adjusted balance sum (company/Norwegian part) <input type="number" [(ngModel)]="unntak().samletKorrigertBalansesumISelskapetEllerNorskDelAvKonsernet" (ngModelChange)="recalcUnntak()" /></label>
            <label>Equity ratio company/Norwegian part <input type="number" [ngModel]="unntak().egenkapitalandelForSelskapetEllerNorskDelAvKonsernet" readonly /></label>
          </div>
        </section>
        <div class="section-head"><h4>Exception companies</h4><button type="button" class="add-btn" (click)="addUnntakAnnetSelsk()">Add</button></div>
        <section class="card">
          <table class="assets-table">
            <thead><tr><th>Name</th><th>Org no</th><th>Country</th><th>Included in consolidated report</th><th>Ownership %</th><th></th></tr></thead>
            <tbody>
              <tr *ngFor="let row of unntakAnnetSelsk(); let i = index">
                <td><input [(ngModel)]="row.selskapetsNavn" /></td>
                <td><input [(ngModel)]="row.selskapetsOrganisasjonsnummer" /></td>
                <td><input [(ngModel)]="row.landkode" /></td>
                <td>
                  <span class="toggle">
                    <input type="checkbox" [(ngModel)]="row.erInkludertIKonsernregnskap" />
                    <span class="toggle-slider"></span>
                  </span>
                </td>
                <td><input type="number" [(ngModel)]="row.eierandelIProsent" /></td>
                <td><button type="button" class="icon-btn danger-icon-btn" title="Delete" aria-label="Delete" (click)="removeUnntakAnnetSelsk(i)">🗑</button></td>
              </tr>
            </tbody>
          </table>
        </section>
        <div class="section-head"><h4>Exception restatements</h4><button type="button" class="add-btn" (click)="addUnntakOmarbeidelse()">Add</button></div>
        <section class="card">
          <table class="assets-table">
            <thead><tr><th>Balance account</th><th>Positive equity effect</th><th>Negative equity effect</th><th>Positive balance effect</th><th>Negative balance effect</th><th></th></tr></thead>
            <tbody>
              <tr *ngFor="let row of unntakOmarbeidelse(); let i = index">
                <td><input [(ngModel)]="row.balansekonto" /></td>
                <td><input type="number" [(ngModel)]="row.positivEffektPaaEgenkapital" (ngModelChange)="recalcUnntak()" /></td>
                <td><input type="number" [(ngModel)]="row.negativEffektPaaEgenkapital" (ngModelChange)="recalcUnntak()" /></td>
                <td><input type="number" [(ngModel)]="row.positivEffektPaaBalansesum" (ngModelChange)="recalcUnntak()" /></td>
                <td><input type="number" [(ngModel)]="row.negativEffektPaaBalansesum" (ngModelChange)="recalcUnntak()" /></td>
                <td><button type="button" class="icon-btn danger-icon-btn" title="Delete" aria-label="Delete" (click)="removeUnntakOmarbeidelse(i)">🗑</button></td>
              </tr>
            </tbody>
          </table>
        </section>
      </ng-container>
    </section>
  `,
  styles: [`
    .topic { display: grid; gap: 10px; }
    .top-right-help { display: flex; flex-direction: column; align-items: flex-end; gap: 6px; }
    .overflow-menu { position: relative; }
    .overflow-trigger { border: 1px solid #cbd5e1; border-radius: 6px; padding: 3px 8px; background: #f8fafc; cursor: pointer; font-size: 18px; line-height: 1; }
    .overflow-panel { position: absolute; top: 34px; right: 0; z-index: 20; display: grid; gap: 6px; min-width: 190px; padding: 8px; border: 1px solid #dbe1ea; border-radius: 8px; background: #fff; box-shadow: 0 8px 20px rgba(15,23,42,.12); }
    .overflow-panel button { text-align: left; }
    .help-icon-btn { width: 30px; height: 30px; border-radius: 999px; padding: 0; font-weight: 700; display: inline-flex; align-items: center; justify-content: center; background: #eff6ff; border: 1px solid #bfdbfe; color: #1e40af; }
    h3, h4 { margin: 0; }
    .layout { position: static; min-height: 0; margin-top: 8px; }
    .card { border: 1px solid #dbe1ea; border-radius: 8px; padding: 12px; background: #fff; }
    .table-card { margin-right: 0; }
    .grid { display: grid; gap: 8px; }
    .boolean-grid { grid-template-columns: repeat(2, minmax(220px, 1fr)); column-gap: 24px; row-gap: 6px; }
    .toggle-inline {
      display: inline-flex;
      flex-direction: row;
      align-items: center;
      gap: 8px;
      white-space: nowrap;
    }
    .toggle {
      position: relative;
      display: inline-flex;
      width: 40px;
      height: 22px;
      flex: 0 0 auto;
    }
    .toggle input[type='checkbox'] {
      position: absolute;
      opacity: 0;
      width: 0;
      height: 0;
    }
    .toggle-slider {
      width: 100%;
      height: 100%;
      background: #cbd5e1;
      border-radius: 999px;
      position: relative;
      transition: background-color 0.2s ease;
    }
    .toggle-slider::before {
      content: '';
      position: absolute;
      width: 16px;
      height: 16px;
      top: 3px;
      left: 3px;
      border-radius: 50%;
      background: #fff;
      box-shadow: 0 1px 2px rgba(15, 23, 42, 0.24);
      transition: transform 0.2s ease;
    }
    .toggle input[type='checkbox']:checked + .toggle-slider { background: #2563eb; }
    .toggle input[type='checkbox']:checked + .toggle-slider::before { transform: translateX(18px); }
    .toolbar, .meta { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
    .section-head { display: flex; justify-content: space-between; align-items: center; gap: 8px; }
    .tabs { display: flex; flex-wrap: wrap; gap: 6px; }
    .tabs button { border: 1px solid #cbd5e1; background: #f8fafc; color: #334155; border-radius: 999px; padding: 5px 10px; font-size: 12px; line-height: 1; }
    .tabs button.active { background: #dbeafe; border-color: #93c5fd; color: #1e40af; }
    .two { grid-template-columns: repeat(2, minmax(220px, 1fr)); }
    label { display: flex; flex-direction: column; font-size: 12px; gap: 4px; color: #475569; line-height: 1.35; }
    label.toggle-inline { display: inline-flex; flex-direction: row; align-items: center; gap: 8px; }
    table { width: 100%; border-collapse: collapse; }
    .assets-table { width: 100%; border-collapse: collapse; margin-bottom: 12px; }
    .assets-table th, .assets-table td { padding: 10px 8px; border-bottom: 1px solid #e5e7eb; font-size: 13px; text-align: left; }
    .assets-table thead { background: #f8fafc; }
    .assets-table tbody tr { cursor: pointer; }
    .assets-table tbody tr:hover { background: #f8fbff; }
    .assets-table .num { text-align: right; font-variant-numeric: tabular-nums; }
    th, td { border-bottom: 1px solid #e5e7eb; padding: 10px 8px; font-size: 13px; text-align: left; }
    thead { background: #f8fafc; }
    input, button { border: 1px solid #cbd5e1; border-radius: 6px; padding: 7px 9px; font-size: 13px; }
    input[readonly], input:disabled, select:disabled { background: #f1f5f9; color: #64748b; cursor: not-allowed; }
    button { background: #f8fafc; cursor: pointer; }
    .next-btn { background: #eff6ff; border-color: #bfdbfe; color: #1e40af; font-weight: 600; }
    .add-btn { background: #eff6ff; border-color: #bfdbfe; color: #1e40af; font-weight: 600; }
    .warn { color: #8a6d3b; font-size: 12px; }
    .muted { color: #64748b; font-size: 12px; }
    .selected-row { background: #eff6ff; }
    .row-actions { display: flex; gap: 6px; }
    .icon-btn { background: #eff6ff; border: 1px solid #bfdbfe; color: #1e40af; padding: 6px 8px; line-height: 1; }
    .danger-icon-btn { color: #b91c1c; border-color: #fecaca; background: #fff1f2; }
    .close-btn { border: 1px solid #cbd5e1; background: #f8fafc; color: #1f2937; border-radius: 6px; padding: 7px 10px; cursor: pointer; }
    .detail-drawer {
      position: absolute;
      top: 12px;
      right: 12px;
      width: 0;
      opacity: 0;
      height: calc(100% - 24px);
      background: #fff;
      border: 1px solid #dbe1ea;
      border-radius: 10px;
      overflow: hidden;
      transition: width 180ms ease, opacity 180ms ease;
      pointer-events: none;
      display: flex;
      flex-direction: column;
    }
    .detail-drawer.open { width: 520px; opacity: 1; pointer-events: auto; }
    .drawer-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px;
      border-bottom: 1px solid #e5e7eb;
    }
    .drawer-header h3 { margin: 0; font-size: 16px; }
    .drawer-header small { color: #64748b; }
    .drawer-content { padding: 12px; overflow: auto; height: calc(100% - 64px); }
  `]
})
export class InterestLimitationTopicComponent {
  readonly activeTab = signal<'main' | 'annet' | 'naerI' | 'naerG' | 'naerF' | 'fremfoert' | 'motpart' | 'kjede' | 'trans' | 'unntak'>('main');
  readonly record = signal<RentebegrRecord>({
    id: crypto.randomUUID(),
    firmanr: 1,
    aar: '2025',
    harRentekostnadLavereEnnTerskelbeloepPerNorskDelAvKonsern: false,
    erKonsernIhtRegelverkForRentebegrensning: true,
    totalRentekostnad: 1200000,
    garantiprovisjonForGjeld: 30000,
    totalRenteinntekt: 250000,
    gevinstVedRealisasjonAvOverEllerUnderkursobligasjon: 0,
    tapVedRealisasjonAvOverEllerUnderkursobligasjon: 0,
    gevinstVedRealisasjonAvSammensattMengdegjeldsbrevEllerFordringSomIkkeSkalDekomponeres: 0,
    tapVedRealisasjonAvSammensattMengdegjeldsbrevEllerFordringSomIkkeSkalDekomponeres: 0,
    nettoRentekostnad: 0,
    fremfoerbarRentekostnad: 0,
    fradragForKonsernbidragSomSkalEkskluderes: 0,
    tilleggForSkattemessigAvskrivning: 0,
    direkteInntektsfoertVederlagForAvskrevetAnleggsmiddel: 0,
    periodisertLeiekostnad: 0,
    grunnlagForRentefradragsramme: 3000000,
    rentefradragsramme: 0,
    differanseMellomNettoRentekostnadOgRentefradragsrammen: 0,
    tilleggIInntektSomFoelgeAvRentebegrensning: 0,
    fradragIInntektSomFoelgeAvRentebegrensning: 0,
    aaretsTilleggIInntekt: 0,
    aaretsFradragIInntekt: 0,
    fremfoerbartRentefradragIInntekt: 0,
    spesifikasjonRapportertPaaVegneAvKonsern: false,
    UnntaksregelBenyttes: false,
    HarSelskapetMottattKonsernbidragMedSkatteeffektDirekteEllerIndirekteFraSelskapSomErUnntattRentebegr: false,
    selskapErInkludertIAnnenInnrapportering: false,
    KRnavn: '',
    KRidentifikator: '',
    KRlandkode: '',
    ASnavn: '',
    ASidentifikator: '',
    ASlandkode: '',
    samletMottattKonsernbidrag: 0,
    sumAndelAvMotattKonsernbidragSomErAvgittTilAnnetSelskap: 0,
    korrigertRentestoerrelse: 0,
    diffkorrigertRentestoerrelse: 0,
    rammeNettoRentekostnad: 0,
    anvendtNettoRentekostnad: 0,
    deltakerrolle: 'ordinaerDeltaker',
    totalRentekostnad_O: false,
    garantiprovisjonForGjeld_O: false,
    totalRenteinntekt_O: false,
    gevinstVedRealisasjonAvOverEllerUnderkursobligasjon_O: false,
    tapVedRealisasjonAvOverEllerUnderkursobligasjon_O: false,
    gevinstVedRealisasjonAvSammensattMengdegjeldsbrevEllerFordringSomIkkeSkalDekomponeres_O: false,
    tapVedRealisasjonAvSammensattMengdegjeldsbrevEllerFordringSomIkkeSkalDekomponeres_O: false,
    UnntaksregelBenyttes_O: false
  });
  readonly mainRecords = signal<RentebegrRecord[]>([this.record()]);
  readonly annetSelskapIKonsern = signal<AnnetSelskapIKonsernRow[]>([
    {
      id: crypto.randomUUID(),
      idFn: this.record().id,
      selskapetsNavn: 'Shiba Energy AS',
      selskapetsOrganisasjonsnummer: '998877665',
      nettoRentekostnad: 640000,
      nettoFradragsfoertRentekostnad: 520000
    },
    {
      id: crypto.randomUUID(),
      idFn: this.record().id,
      selskapetsNavn: 'Shiba Grid Services AS',
      selskapetsOrganisasjonsnummer: '989898989',
      nettoRentekostnad: 420000,
      nettoFradragsfoertRentekostnad: 330000
    }
  ]);
  readonly naerstaaendeI = signal<NaerstaaendeRow[]>([
    {
      id: crypto.randomUUID(),
      idFn: this.record().id,
      nsType: 'I',
      navn: 'Shiba Holdings AB',
      identifikator: 'SE556677',
      landkode: 'SE',
      rentekostnadBetaltTilSelskapMvISammeKonsern: 180000,
      rentekostnadBetaltTilAnnenNaerstaaendePart: 45000,
      renteinntektMottattFraSelskapMvISammeKonsern: 25000,
      renteinntektMottattFraAnnenNaerstaaendePart: 7000
    }
  ]);
  readonly naerstaaendeG = signal<NaerstaaendeRow[]>([
    {
      id: crypto.randomUUID(),
      idFn: this.record().id,
      nsType: 'G',
      navn: 'Shiba Finance Ltd',
      identifikator: 'GB998877',
      landkode: 'GB',
      rentekostnadBetaltTilSelskapMvISammeKonsern: 220000,
      rentekostnadBetaltTilAnnenNaerstaaendePart: 60000,
      renteinntektMottattFraSelskapMvISammeKonsern: 0,
      renteinntektMottattFraAnnenNaerstaaendePart: 0
    }
  ]);
  readonly naerstaaendeF = signal<NaerstaaendeRow[]>([
    {
      id: crypto.randomUUID(),
      idFn: this.record().id,
      nsType: 'F',
      navn: 'Shiba Branch FI',
      identifikator: 'FI445566',
      landkode: 'FI',
      rentekostnadBetaltTilSelskapMvISammeKonsern: 95000,
      rentekostnadBetaltTilAnnenNaerstaaendePart: 28000,
      renteinntektMottattFraSelskapMvISammeKonsern: 0,
      renteinntektMottattFraAnnenNaerstaaendePart: 0
    }
  ]);
  readonly fremfoertRentefradrag = signal<FremfoertRentefradragRow[]>(
    Array.from({ length: 10 }, (_, idx) => ({
      inntektsaar: String(2024 - idx),
      fremfoertRentefradragFraTidligereAar: 0,
      aaretsAnvendelseAvFremfoertRentefradragFraTidligereAar: 0,
      fremfoerbartRentefradragIInntekt: 0
    }))
  );
  readonly konsernbPerMotpart = signal<KonsernbPerMotpartRow[]>([
    {
      id: crypto.randomUUID(),
      idFn: this.record().id,
      avgivendeSelskapsIdentifikator: '915667788',
      mottattBeloep: 360000
    },
    {
      id: crypto.randomUUID(),
      idFn: this.record().id,
      avgivendeSelskapsIdentifikator: '904332211',
      mottattBeloep: 190000
    }
  ]);
  readonly avgittAndelKonsernb = signal<AvgittAndelKonsernbRow[]>([
    {
      id: crypto.randomUUID(),
      idFn: this.konsernbPerMotpart()[0]?.id ?? '',
      mottakendeSelskapsIdentifikator: '927111222',
      andelAvMotattKonsernbidragSomErAvgittTilAnnetSelskap: 110000
    }
  ]);
  readonly konsernBidragskjede = signal<KonsernBidragskjedeRow[]>([
    {
      id: crypto.randomUUID(),
      idFn: this.record().id,
      konsernbidragskjedeidentifikator: 'KJEDE-2025-01',
      aarsakTilAtAvgivendeSelskapErUnntattRentebegrensning: 'equity-exemption',
      navnOpprinnleligSelsk: 'Shiba Parent Plc',
      identifikatorOpprinnleligSelsk: 'GB001122',
      landkodeOpprinnleligSelsk: 'GB'
    }
  ]);
  readonly konsernBidragPerTrans = signal<KonsernBidragPerTransRow[]>([
    {
      id: crypto.randomUUID(),
      idFn: this.konsernBidragskjede()[0]?.id ?? '',
      navnAvgivendeSelsk: 'Shiba Parent Plc',
      identifikatorAvgivendeSelsk: 'GB001122',
      landkodeAvgivendeSelsk: 'GB',
      navnMottakendeSelsk: 'Shiba Group AS',
      identifikatorMottakendeSelsk: '912345678',
      landkodeMottakendeSelsk: 'NO',
      transaksjonsbeloep: 360000
    }
  ]);
  readonly unntak = signal<UnntakRecord>({
    erHelnorskKonsern: true,
    unntaksregeltype: 'egenkapitalunntak',
    selskapetErInkludertIAnnenInnrapportering: false,
    auNavn: '',
    auIdentifikator: '',
    auLandkode: '',
    positivEgenkapitalIKonsernregnskapGlobalt: 0,
    negativEgenkapitalIKonsernregnskapGlobalt: 0,
    balansesumIKonsernregnskapGlobalt: 0,
    egenkapitalandelIKonsernregnskap: 0,
    egenkapitalVedUtgangenAvRegnskapsaaretFoerInntektsaaret: 0,
    samletKorrigertEgenkapitalISelskapetEllerNorskDelAvKonsernet: 0,
    balansesumVedUtgangenAvRegnskapsaaretFoerInntektsaaret: 0,
    samletKorrigertBalansesumISelskapetEllerNorskDelAvKonsernet: 0,
    egenkapitalandelForSelskapetEllerNorskDelAvKonsernet: 0,
    unntakForRentebegrensningSkalBekreftesAvRevisor: false
  });
  readonly unntakAnnetSelsk = signal<UnntakAnnetSelskRow[]>([
    {
      id: crypto.randomUUID(),
      selskapetsNavn: 'Shiba Wind AB',
      selskapetsOrganisasjonsnummer: 'SE001199',
      landkode: 'SE',
      erInkludertIKonsernregnskap: true,
      eierandelIProsent: 100
    }
  ]);
  readonly unntakOmarbeidelse = signal<UnntakOmarbeidelseRow[]>([
    {
      id: crypto.randomUUID(),
      balansekonto: '1210',
      positivEffektPaaEgenkapital: 45000,
      negativEffektPaaEgenkapital: 0,
      positivEffektPaaBalansesum: 45000,
      negativEffektPaaBalansesum: 0
    }
  ]);
  readonly validationError = signal('');
  readonly statusMessage = signal('');
  readonly mainDrawerOpen = signal(false);
  readonly overflowMenuOpen = signal(false);
  readonly isExcess = computed(() => this.record().nettoRentekostnad > this.record().rentefradragsramme);

  constructor() {
    this.recalcFromCounterparty();
    this.recalcUnntak();
    this.recalc();
  }

  private updateCurrentRecord(next: RentebegrRecord): void {
    this.record.set(next);
    this.mainRecords.update((rows) => rows.map((row) => (row.id === next.id ? next : row)));
  }

  syncCurrentRecord(): void {
    this.updateCurrentRecord({ ...this.record() });
  }

  recalc(): void {
    const r = this.record();
    const finansPoster =
      r.gevinstVedRealisasjonAvOverEllerUnderkursobligasjon -
      r.tapVedRealisasjonAvOverEllerUnderkursobligasjon +
      r.gevinstVedRealisasjonAvSammensattMengdegjeldsbrevEllerFordringSomIkkeSkalDekomponeres -
      r.tapVedRealisasjonAvSammensattMengdegjeldsbrevEllerFordringSomIkkeSkalDekomponeres;
    const netto = Math.max(0, r.totalRentekostnad + r.garantiprovisjonForGjeld - r.totalRenteinntekt + finansPoster);
    const ramme = r.grunnlagForRentefradragsramme * 0.25;
    const diff = netto - ramme;
    this.updateCurrentRecord({
      ...r,
      nettoRentekostnad: netto,
      rentefradragsramme: ramme,
      differanseMellomNettoRentekostnadOgRentefradragsrammen: diff,
      tilleggIInntektSomFoelgeAvRentebegrensning: diff > 0 ? diff : 0,
      fradragIInntektSomFoelgeAvRentebegrensning: diff < 0 ? Math.abs(diff) : 0,
      aaretsTilleggIInntekt: diff > 0 ? diff : 0,
      aaretsFradragIInntekt: diff < 0 ? Math.abs(diff) : 0,
      fremfoerbartRentefradragIInntekt: diff > 0 ? diff : 0,
      korrigertRentestoerrelse: netto - (r.samletMottattKonsernbidrag - r.sumAndelAvMotattKonsernbidragSomErAvgittTilAnnetSelskap),
      diffkorrigertRentestoerrelse: netto - ramme,
      rammeNettoRentekostnad: ramme,
      anvendtNettoRentekostnad: Math.min(netto, ramme)
    });
  }

  addMainRecord(): void {
    const newRecord: RentebegrRecord = {
      ...this.record(),
      id: crypto.randomUUID(),
      aar: this.record().aar,
      totalRentekostnad: 0,
      garantiprovisjonForGjeld: 0,
      totalRenteinntekt: 0,
      nettoRentekostnad: 0,
      rentefradragsramme: 0,
      differanseMellomNettoRentekostnadOgRentefradragsrammen: 0,
      tilleggIInntektSomFoelgeAvRentebegrensning: 0,
      fradragIInntektSomFoelgeAvRentebegrensning: 0,
      aaretsTilleggIInntekt: 0,
      aaretsFradragIInntekt: 0,
      fremfoerbartRentefradragIInntekt: 0,
      samletMottattKonsernbidrag: 0,
      sumAndelAvMotattKonsernbidragSomErAvgittTilAnnetSelskap: 0,
      korrigertRentestoerrelse: 0,
      diffkorrigertRentestoerrelse: 0,
      rammeNettoRentekostnad: 0,
      anvendtNettoRentekostnad: 0
    };
    this.mainRecords.update((rows) => [...rows, newRecord]);
    this.record.set(newRecord);
    this.mainDrawerOpen.set(true);
  }

  selectMainRecord(id: string): void {
    const selected = this.mainRecords().find((row) => row.id === id);
    if (!selected) return;
    this.record.set({ ...selected });
  }

  openMainDrawer(id: string): void {
    this.selectMainRecord(id);
    this.mainDrawerOpen.set(true);
  }

  closeMainDrawer(): void {
    this.mainDrawerOpen.set(false);
  }

  currentMainIndex(): number {
    return this.mainRecords().findIndex((row) => row.id === this.record().id);
  }

  currentMainPositionLabel(): string {
    const idx = this.currentMainIndex();
    const total = this.mainRecords().length;
    if (idx < 0 || total === 0) return '0/0';
    return `${idx + 1}/${total}`;
  }

  canGoPrevMain(): boolean {
    return this.currentMainIndex() > 0;
  }

  canGoNextMain(): boolean {
    const idx = this.currentMainIndex();
    return idx >= 0 && idx < this.mainRecords().length - 1;
  }

  goPrevMainRecord(): void {
    const idx = this.currentMainIndex();
    if (idx <= 0) return;
    this.record.set({ ...this.mainRecords()[idx - 1] });
  }

  goNextMainRecord(): void {
    const idx = this.currentMainIndex();
    if (idx < 0 || idx >= this.mainRecords().length - 1) return;
    this.record.set({ ...this.mainRecords()[idx + 1] });
  }

  deleteCurrentMainRecord(): void {
    if (this.mainRecords().length <= 1) return;
    const remaining = this.mainRecords().filter((row) => row.id !== this.record().id);
    this.mainRecords.set(remaining);
    this.record.set({ ...remaining[0] });
  }

  deleteMainRecord(id: string): void {
    if (this.mainRecords().length <= 1) return;
    const remaining = this.mainRecords().filter((row) => row.id !== id);
    this.mainRecords.set(remaining);
    if (this.record().id === id) {
      this.record.set({ ...remaining[0] });
      this.mainDrawerOpen.set(false);
    }
  }

  addAnnetSelskap(): void {
    this.annetSelskapIKonsern.update((rows) => [...rows, { id: crypto.randomUUID(), idFn: this.record().id, selskapetsNavn: '', selskapetsOrganisasjonsnummer: '', nettoRentekostnad: 0, nettoFradragsfoertRentekostnad: 0 }]);
  }

  addNaerstaaende(target: 'I' | 'G' | 'F'): void {
    const row: NaerstaaendeRow = { id: crypto.randomUUID(), idFn: this.record().id, nsType: target, navn: '', identifikator: '', landkode: '', rentekostnadBetaltTilSelskapMvISammeKonsern: 0, rentekostnadBetaltTilAnnenNaerstaaendePart: 0, renteinntektMottattFraSelskapMvISammeKonsern: 0, renteinntektMottattFraAnnenNaerstaaendePart: 0 };
    if (target === 'I') this.naerstaaendeI.update((rows) => [...rows, row]);
    if (target === 'G') this.naerstaaendeG.update((rows) => [...rows, row]);
    if (target === 'F') this.naerstaaendeF.update((rows) => [...rows, row]);
  }

  currentNaerstaaende(): NaerstaaendeRow[] {
    if (this.activeTab() === 'naerI') return this.naerstaaendeI();
    if (this.activeTab() === 'naerG') return this.naerstaaendeG();
    return this.naerstaaendeF();
  }

  removeCurrentNaerstaaende(index: number): void {
    if (this.activeTab() === 'naerI') this.naerstaaendeI.update((rows) => rows.filter((_, i) => i !== index));
    if (this.activeTab() === 'naerG') this.naerstaaendeG.update((rows) => rows.filter((_, i) => i !== index));
    if (this.activeTab() === 'naerF') this.naerstaaendeF.update((rows) => rows.filter((_, i) => i !== index));
  }

  addKonsernbPerMotpart(): void {
    this.konsernbPerMotpart.update((rows) => [...rows, { id: crypto.randomUUID(), idFn: this.record().id, avgivendeSelskapsIdentifikator: '', mottattBeloep: 0 }]);
    this.recalcFromCounterparty();
  }

  addKonsernBidragskjede(): void {
    this.konsernBidragskjede.update((rows) => [...rows, { id: crypto.randomUUID(), idFn: this.record().id, konsernbidragskjedeidentifikator: '', aarsakTilAtAvgivendeSelskapErUnntattRentebegrensning: '', navnOpprinnleligSelsk: '', identifikatorOpprinnleligSelsk: '', landkodeOpprinnleligSelsk: '' }]);
  }

  addKonsernBidragPerTrans(): void {
    if (this.konsernBidragskjede().length === 0) {
      this.validationError.set('Add a contribution chain row first.');
      return;
    }
    this.konsernBidragPerTrans.update((rows) => [...rows, { id: crypto.randomUUID(), idFn: this.record().id, navnAvgivendeSelsk: '', identifikatorAvgivendeSelsk: '', landkodeAvgivendeSelsk: '', navnMottakendeSelsk: '', identifikatorMottakendeSelsk: '', landkodeMottakendeSelsk: '', transaksjonsbeloep: 0 }]);
  }

  removeAt(target: 'annet' | 'motpart' | 'kjede' | 'trans', index: number): void {
    if (target === 'annet') this.annetSelskapIKonsern.update((rows) => rows.filter((_, i) => i !== index));
    if (target === 'motpart') {
      const deleting = this.konsernbPerMotpart()[index];
      if (deleting) {
        this.avgittAndelKonsernb.update((rows) => rows.filter((row) => row.idFn !== deleting.id));
      }
      this.konsernbPerMotpart.update((rows) => rows.filter((_, i) => i !== index));
      this.recalcFromCounterparty();
    }
    if (target === 'kjede') this.konsernBidragskjede.update((rows) => rows.filter((_, i) => i !== index));
    if (target === 'trans') this.konsernBidragPerTrans.update((rows) => rows.filter((_, i) => i !== index));
  }

  addAvgittAndelForSelected(): void {
    const parent = this.konsernbPerMotpart()[this.konsernbPerMotpart().length - 1];
    if (!parent) return;
    this.avgittAndelKonsernb.update((rows) => [
      ...rows,
      {
        id: crypto.randomUUID(),
        idFn: parent.id,
        mottakendeSelskapsIdentifikator: '',
        andelAvMotattKonsernbidragSomErAvgittTilAnnetSelskap: 0
      }
    ]);
  }

  removeAvgittAndel(index: number): void {
    this.avgittAndelKonsernb.update((rows) => rows.filter((_, i) => i !== index));
    this.recalcFromCounterparty();
  }

  recalcFromCounterparty(): void {
    const mottatt = this.konsernbPerMotpart().reduce((sum, row) => sum + row.mottattBeloep, 0);
    const avgittAndel = this.avgittAndelKonsernb().reduce((sum, row) => sum + row.andelAvMotattKonsernbidragSomErAvgittTilAnnetSelskap, 0);
    this.updateCurrentRecord({
      ...this.record(),
      samletMottattKonsernbidrag: mottatt,
      sumAndelAvMotattKonsernbidragSomErAvgittTilAnnetSelskap: avgittAndel
    });
    this.recalc();
  }

  setActiveTab(tab: 'main' | 'annet' | 'naerI' | 'naerG' | 'naerF' | 'fremfoert' | 'motpart' | 'kjede' | 'trans' | 'unntak'): void {
    this.validationError.set('');
    if (tab === 'motpart') {
      const hasInvalidOrgNr = this.konsernbPerMotpart().some((row) => row.avgivendeSelskapsIdentifikator.trim().length > 0 && row.avgivendeSelskapsIdentifikator.trim().length < 6);
      if (hasInvalidOrgNr) {
        this.validationError.set('Counterparty identifier appears invalid (too short).');
        return;
      }
    }
    this.activeTab.set(tab);
  }

  isCurrentIncomeYear(year: string): boolean {
    return year === this.record().aar;
  }

  openGuide(): void {
    this.statusMessage.set('Guide action is ready for integration.');
  }

  printTopic(): void {
    this.statusMessage.set('Print action is ready for integration.');
  }

  goToNextTopic(): void {
    this.statusMessage.set('Next topic action is ready for integration.');
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

  resetOverrides(): void {
    this.updateCurrentRecord({
      ...this.record(),
      totalRentekostnad_O: false,
      garantiprovisjonForGjeld_O: false,
      totalRenteinntekt_O: false,
      gevinstVedRealisasjonAvOverEllerUnderkursobligasjon_O: false,
      tapVedRealisasjonAvOverEllerUnderkursobligasjon_O: false,
      gevinstVedRealisasjonAvSammensattMengdegjeldsbrevEllerFordringSomIkkeSkalDekomponeres_O: false,
      tapVedRealisasjonAvSammensattMengdegjeldsbrevEllerFordringSomIkkeSkalDekomponeres_O: false,
      UnntaksregelBenyttes_O: false
    });
    this.statusMessage.set('Override flags reset.');
  }

  recalcUnntak(): void {
    const u = this.unntak();
    const ekGlobalNum = u.positivEgenkapitalIKonsernregnskapGlobalt - u.negativEgenkapitalIKonsernregnskapGlobalt;
    const ekGlobal = u.balansesumIKonsernregnskapGlobalt === 0 ? 0 : (ekGlobalNum / u.balansesumIKonsernregnskapGlobalt) * 100;

    const omarb = this.unntakOmarbeidelse().reduce(
      (acc, row) => {
        acc.ek += row.positivEffektPaaEgenkapital - row.negativEffektPaaEgenkapital;
        acc.bs += row.positivEffektPaaBalansesum - row.negativEffektPaaBalansesum;
        return acc;
      },
      { ek: 0, bs: 0 }
    );

    const ekSelskapNum = u.samletKorrigertEgenkapitalISelskapetEllerNorskDelAvKonsernet + omarb.ek;
    const bsSelskap = u.samletKorrigertBalansesumISelskapetEllerNorskDelAvKonsernet + omarb.bs;
    const ekSelskap = bsSelskap === 0 ? 0 : (ekSelskapNum / bsSelskap) * 100;

    this.unntak.set({
      ...u,
      egenkapitalandelIKonsernregnskap: ekGlobal,
      egenkapitalandelForSelskapetEllerNorskDelAvKonsernet: ekSelskap
    });
  }

  addUnntakAnnetSelsk(): void {
    this.unntakAnnetSelsk.update((rows) => [
      ...rows,
      {
        id: crypto.randomUUID(),
        selskapetsNavn: '',
        selskapetsOrganisasjonsnummer: '',
        landkode: '',
        erInkludertIKonsernregnskap: false,
        eierandelIProsent: 0
      }
    ]);
  }

  removeUnntakAnnetSelsk(index: number): void {
    this.unntakAnnetSelsk.update((rows) => rows.filter((_, i) => i !== index));
  }

  addUnntakOmarbeidelse(): void {
    this.unntakOmarbeidelse.update((rows) => [
      ...rows,
      {
        id: crypto.randomUUID(),
        balansekonto: '',
        positivEffektPaaEgenkapital: 0,
        negativEffektPaaEgenkapital: 0,
        positivEffektPaaBalansesum: 0,
        negativEffektPaaBalansesum: 0
      }
    ]);
    this.recalcUnntak();
  }

  removeUnntakOmarbeidelse(index: number): void {
    this.unntakOmarbeidelse.update((rows) => rows.filter((_, i) => i !== index));
    this.recalcUnntak();
  }
}
