import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface VarelagerRow {
  Id: string;
  Firmanr: number;
  Aar: string;
  RaavareHalvfabrikata: number; VarerUnderTilvirkning: number; TilvirketVare: number; InnkjVareForVideresalg: number; Buskap: number; SelvprodVareIEgenProd: number; Pelsdyr: number;
  RaavareHalvfabrikataSMV: number; VarerUnderTilvirkningSMV: number; TilvirketVareSMV: number; InnkjVareForVideresalgSMV: number; BuskapSMV: number; SelvprodVareIEgenProdSMV: number; PelsdyrSMV: number;
  RaavareHalvfabrikata_O: boolean; VarerUnderTilvirkning_O: boolean; TilvirketVare_O: boolean; InnkjVareForVideresalg_O: boolean; Buskap_O: boolean; SelvprodVareIEgenProd_O: boolean; Pelsdyr_O: boolean;
  RaavareHalvfabrikataSMV_O: boolean; VarerUnderTilvirkningSMV_O: boolean; TilvirketVareSMV_O: boolean; InnkjVareForVideresalgSMV_O: boolean; BuskapSMV_O: boolean; SelvprodVareIEgenProdSMV_O: boolean; PelsdyrSMV_O: boolean;
  SumVerdiVarelager: number; SumVerdiVarelagerSMV: number;
}

@Component({
  selector: 'app-inventory-topic',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="topic">
      <div class="top-right-help">
        <button type="button" class="next-btn" (click)="goToNextTopic()">Next topic →</button>
        <button type="button" class="help-icon-btn" (click)="openGuide()" aria-label="Help" title="Help">?</button>
      </div>
      <div class="toolbar">
        <label class="row"><input type="checkbox" [(ngModel)]="fullRegnskapsplikt" /> Full accounting obligation</label>
        <button type="button" (click)="printTopic()">Print</button>
        <button type="button" (click)="copyRegnskToSktm()">Copy accounting values to tax values</button>
        <button type="button" (click)="resetFromChartOfAccounts()">Reset from chart of accounts</button>
      </div>
      <div class="card">
      <div class="grid">
        <label>Raw materials / semi-finished<input type="number" [ngModel]="row().RaavareHalvfabrikata" [disabled]="!fullRegnskapsplikt" (ngModelChange)="updateField('RaavareHalvfabrikata', $event)"/></label>
        <label>Tax raw materials / semi-finished<input type="number" [ngModel]="row().RaavareHalvfabrikataSMV" (ngModelChange)="updateField('RaavareHalvfabrikataSMV', $event)"/></label>
        <label>Under production<input type="number" [ngModel]="row().VarerUnderTilvirkning" [disabled]="!fullRegnskapsplikt" (ngModelChange)="updateField('VarerUnderTilvirkning', $event)"/></label>
        <label>Tax under production<input type="number" [ngModel]="row().VarerUnderTilvirkningSMV" (ngModelChange)="updateField('VarerUnderTilvirkningSMV', $event)"/></label>
        <label>Finished goods<input type="number" [ngModel]="row().TilvirketVare" [disabled]="!fullRegnskapsplikt" (ngModelChange)="updateField('TilvirketVare', $event)"/></label>
        <label>Tax finished goods<input type="number" [ngModel]="row().TilvirketVareSMV" (ngModelChange)="updateField('TilvirketVareSMV', $event)"/></label>
        <label>Purchased for resale<input type="number" [ngModel]="row().InnkjVareForVideresalg" [disabled]="!fullRegnskapsplikt" (ngModelChange)="updateField('InnkjVareForVideresalg', $event)"/></label>
        <label>Tax purchased for resale<input type="number" [ngModel]="row().InnkjVareForVideresalgSMV" (ngModelChange)="updateField('InnkjVareForVideresalgSMV', $event)"/></label>
        <label>Livestock<input type="number" [ngModel]="row().Buskap" [disabled]="!fullRegnskapsplikt" (ngModelChange)="updateField('Buskap', $event)"/></label>
        <label>Tax livestock<input type="number" [ngModel]="row().BuskapSMV" (ngModelChange)="updateField('BuskapSMV', $event)"/></label>
        <label>Self-produced own production<input type="number" [ngModel]="row().SelvprodVareIEgenProd" [disabled]="!fullRegnskapsplikt" (ngModelChange)="updateField('SelvprodVareIEgenProd', $event)"/></label>
        <label>Tax self-produced own production<input type="number" [ngModel]="row().SelvprodVareIEgenProdSMV" (ngModelChange)="updateField('SelvprodVareIEgenProdSMV', $event)"/></label>
        <label>Fur animals<input type="number" [ngModel]="row().Pelsdyr" [disabled]="!fullRegnskapsplikt" (ngModelChange)="updateField('Pelsdyr', $event)"/></label>
        <label>Tax fur animals<input type="number" [ngModel]="row().PelsdyrSMV" (ngModelChange)="updateField('PelsdyrSMV', $event)"/></label>
        <label>Accounting total<input type="number" [ngModel]="row().SumVerdiVarelager" readonly /></label>
        <label>Tax total<input type="number" [ngModel]="row().SumVerdiVarelagerSMV" readonly /></label>
      </div>
      </div>
      <p class="muted" *ngIf="statusMessage()">{{ statusMessage() }}</p>
    </section>
  `,
  styles: [`
    .topic{display:grid;gap:10px}
    h3,h4{margin:0}
    .top-right-help{display:flex;flex-direction:column;align-items:flex-end;gap:6px}
    .help-icon-btn{width:30px;height:30px;border-radius:999px;padding:0;font-weight:700;display:inline-flex;align-items:center;justify-content:center;background:#eff6ff;border:1px solid #bfdbfe;color:#1e40af}
    .toolbar{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
    .card{border:1px solid #dbe1ea;border-radius:8px;padding:12px;background:#fff}
    .grid{display:grid;grid-template-columns:repeat(2,minmax(220px,1fr));gap:8px}
    label{display:flex;flex-direction:column;font-size:12px;gap:4px;color:#475569;line-height:1.35}
    .row{flex-direction:row;align-items:center}
    input,button{border:1px solid #cbd5e1;border-radius:6px;padding:7px 9px;font-size:13px}
    input[readonly],input:disabled,select:disabled{background:#f1f5f9;color:#64748b;cursor:not-allowed}
    button{background:#f8fafc;cursor:pointer}
    .next-btn{background:#eff6ff;border-color:#bfdbfe;color:#1e40af;font-weight:600}
    .muted{color:#64748b;font-size:12px}
  `]
})
export class InventoryTopicComponent {
  fullRegnskapsplikt = true;
  readonly statusMessage = signal('');
  readonly row = signal<VarelagerRow>({
    Id: '0000001',
    Firmanr: 1,
    Aar: '2025',
    RaavareHalvfabrikata: 250000, VarerUnderTilvirkning: 120000, TilvirketVare: 400000, InnkjVareForVideresalg: 90000, Buskap: 0, SelvprodVareIEgenProd: 10000, Pelsdyr: 0,
    RaavareHalvfabrikataSMV: 220000, VarerUnderTilvirkningSMV: 100000, TilvirketVareSMV: 380000, InnkjVareForVideresalgSMV: 90000, BuskapSMV: 0, SelvprodVareIEgenProdSMV: 10000, PelsdyrSMV: 0,
    RaavareHalvfabrikata_O: false, VarerUnderTilvirkning_O: false, TilvirketVare_O: false, InnkjVareForVideresalg_O: false, Buskap_O: false, SelvprodVareIEgenProd_O: false, Pelsdyr_O: false,
    RaavareHalvfabrikataSMV_O: false, VarerUnderTilvirkningSMV_O: false, TilvirketVareSMV_O: false, InnkjVareForVideresalgSMV_O: false, BuskapSMV_O: false, SelvprodVareIEgenProdSMV_O: false, PelsdyrSMV_O: false,
    SumVerdiVarelager: 0, SumVerdiVarelagerSMV: 0
  });
  readonly baselineFromChart = signal<VarelagerRow>({
    Id: '0000001',
    Firmanr: 1,
    Aar: '2025',
    RaavareHalvfabrikata: 250000, VarerUnderTilvirkning: 120000, TilvirketVare: 400000, InnkjVareForVideresalg: 90000, Buskap: 0, SelvprodVareIEgenProd: 10000, Pelsdyr: 0,
    RaavareHalvfabrikataSMV: 220000, VarerUnderTilvirkningSMV: 100000, TilvirketVareSMV: 380000, InnkjVareForVideresalgSMV: 90000, BuskapSMV: 0, SelvprodVareIEgenProdSMV: 10000, PelsdyrSMV: 0,
    RaavareHalvfabrikata_O: false, VarerUnderTilvirkning_O: false, TilvirketVare_O: false, InnkjVareForVideresalg_O: false, Buskap_O: false, SelvprodVareIEgenProd_O: false, Pelsdyr_O: false,
    RaavareHalvfabrikataSMV_O: false, VarerUnderTilvirkningSMV_O: false, TilvirketVareSMV_O: false, InnkjVareForVideresalgSMV_O: false, BuskapSMV_O: false, SelvprodVareIEgenProdSMV_O: false, PelsdyrSMV_O: false,
    SumVerdiVarelager: 0, SumVerdiVarelagerSMV: 0
  });

  updateField(
    field:
      | 'RaavareHalvfabrikata' | 'VarerUnderTilvirkning' | 'TilvirketVare' | 'InnkjVareForVideresalg' | 'Buskap' | 'SelvprodVareIEgenProd' | 'Pelsdyr'
      | 'RaavareHalvfabrikataSMV' | 'VarerUnderTilvirkningSMV' | 'TilvirketVareSMV' | 'InnkjVareForVideresalgSMV' | 'BuskapSMV' | 'SelvprodVareIEgenProdSMV' | 'PelsdyrSMV',
    value: number
  ): void {
    const num = Number(value) || 0;
    const overrideField = `${field}_O` as keyof VarelagerRow;
    this.row.update((r) => {
      const next: VarelagerRow = { ...r, [field]: num };
      if (overrideField in next && typeof next[overrideField] === 'boolean') {
        (next[overrideField] as boolean) = true;
      }
      return next;
    });
    this.recalc();
  }

  copyRegnskToSktm(): void {
    const r = this.row();
    this.row.set({
      ...r,
      RaavareHalvfabrikataSMV: r.RaavareHalvfabrikata,
      VarerUnderTilvirkningSMV: r.VarerUnderTilvirkning,
      TilvirketVareSMV: r.TilvirketVare,
      InnkjVareForVideresalgSMV: r.InnkjVareForVideresalg,
      BuskapSMV: r.Buskap,
      SelvprodVareIEgenProdSMV: r.SelvprodVareIEgenProd,
      PelsdyrSMV: r.Pelsdyr,
      RaavareHalvfabrikataSMV_O: true,
      VarerUnderTilvirkningSMV_O: true,
      TilvirketVareSMV_O: true,
      InnkjVareForVideresalgSMV_O: true,
      BuskapSMV_O: true,
      SelvprodVareIEgenProdSMV_O: true,
      PelsdyrSMV_O: true
    });
    this.statusMessage.set('Copied accounting values to tax values.');
    this.recalc();
  }
  recalc(): void {
    const r = this.row();
    const sumR = r.RaavareHalvfabrikata + r.VarerUnderTilvirkning + r.TilvirketVare + r.InnkjVareForVideresalg + r.Buskap + r.SelvprodVareIEgenProd + r.Pelsdyr;
    const sumS = r.RaavareHalvfabrikataSMV + r.VarerUnderTilvirkningSMV + r.TilvirketVareSMV + r.InnkjVareForVideresalgSMV + r.BuskapSMV + r.SelvprodVareIEgenProdSMV + r.PelsdyrSMV;
    this.row.set({ ...r, SumVerdiVarelager: sumR, SumVerdiVarelagerSMV: sumS });
  }

  resetFromChartOfAccounts(): void {
    const base = this.baselineFromChart();
    this.row.set({
      ...this.row(),
      ...base,
      RaavareHalvfabrikata_O: false,
      VarerUnderTilvirkning_O: false,
      TilvirketVare_O: false,
      InnkjVareForVideresalg_O: false,
      Buskap_O: false,
      SelvprodVareIEgenProd_O: false,
      Pelsdyr_O: false,
      RaavareHalvfabrikataSMV_O: false,
      VarerUnderTilvirkningSMV_O: false,
      TilvirketVareSMV_O: false,
      InnkjVareForVideresalgSMV_O: false,
      BuskapSMV_O: false,
      SelvprodVareIEgenProdSMV_O: false,
      PelsdyrSMV_O: false
    });
    this.statusMessage.set('Values refreshed from chart of accounts.');
    this.recalc();
  }

  validateBeforeLeave(): boolean {
    const r = this.row();
    const hasNegative = [
      r.RaavareHalvfabrikata, r.VarerUnderTilvirkning, r.TilvirketVare, r.InnkjVareForVideresalg, r.Buskap, r.SelvprodVareIEgenProd, r.Pelsdyr,
      r.RaavareHalvfabrikataSMV, r.VarerUnderTilvirkningSMV, r.TilvirketVareSMV, r.InnkjVareForVideresalgSMV, r.BuskapSMV, r.SelvprodVareIEgenProdSMV, r.PelsdyrSMV
    ].some((v) => v < 0);
    if (hasNegative) {
      this.statusMessage.set('Validation failed: negative inventory values are not allowed.');
      return false;
    }
    this.statusMessage.set('Validation passed.');
    return true;
  }

  openGuide(): void {
    this.statusMessage.set('Guide action is available (PDF in Delphi).');
  }

  printTopic(): void {
    if (!this.validateBeforeLeave()) return;
    this.statusMessage.set('Print action is available (PDF export in Delphi).');
  }

  goToNextTopic(): void {
    if (!this.validateBeforeLeave()) return;
    this.statusMessage.set('Next topic navigation is available.');
  }
}
