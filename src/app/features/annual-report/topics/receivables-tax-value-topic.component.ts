import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface FordringerRow {
  Id: string;
  Firmanr: number;
  Aar: string;
  KundefordrIkkeFaktInntekt: number;
  KundefordrIkkeFaktInntekt_O: boolean;
  KundefordrTap: number;
  KundefordrTap_O: boolean;
  KundefordrTapIF: number;
  KundefordrTapIF_O: boolean;
  Kredittsalg: number;
  Kredittsalg_O: boolean;
  KredittsalgIF: number;
  KredittsalgIF_O: boolean;
  KundefordrSktmNedskr: number;
  KundefordrSktmNedskrNyetabl: number;
  KundefordrSktmVerdi: number;
  AnnenFordring: number;
  AnnenFordring_O: boolean;
  sumFordrSktmVerdi: number;
}

@Component({
  selector: 'app-receivables-tax-value-topic',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="topic">
      <div class="top-right-help">
        <button type="button" class="next-btn" (click)="goToNextTopic()">Next topic →</button>
        <button type="button" class="help-icon-btn" (click)="openGuide()" aria-label="Help" title="Help">?</button>
      </div>
      <div class="card">
      <div class="grid">
        <label>Customer receivables not invoiced income <input type="number" [ngModel]="row().KundefordrIkkeFaktInntekt" (ngModelChange)="updateNumeric('KundefordrIkkeFaktInntekt', $event)" /></label>
        <label>Receivable loss <input type="number" [ngModel]="row().KundefordrTap" (ngModelChange)="updateNumeric('KundefordrTap', $event)" /></label>
        <label>Receivable loss prev year <input type="number" [ngModel]="row().KundefordrTapIF" (ngModelChange)="updateNumeric('KundefordrTapIF', $event)" /></label>
        <label>Credit sales <input type="number" [ngModel]="row().Kredittsalg" (ngModelChange)="updateNumeric('Kredittsalg', $event)" /></label>
        <label>Credit sales prev year <input type="number" [ngModel]="row().KredittsalgIF" (ngModelChange)="updateNumeric('KredittsalgIF', $event)" /></label>
        <label>Tax write-down <input type="number" [ngModel]="row().KundefordrSktmNedskr" readonly /></label>
        <label>Tax write-down (newly established) <input type="number" [ngModel]="row().KundefordrSktmNedskrNyetabl" (ngModelChange)="updateNumeric('KundefordrSktmNedskrNyetabl', $event)" /></label>
        <label>Other receivables <input type="number" [ngModel]="row().AnnenFordring" (ngModelChange)="updateNumeric('AnnenFordring', $event)" /></label>
        <label>Calculated tax receivable value <input type="number" [ngModel]="row().KundefordrSktmVerdi" readonly /></label>
        <label>Total tax receivables <input type="number" [ngModel]="row().sumFordrSktmVerdi" readonly /></label>
      </div>
      <div class="override-grid">
        <label><input type="checkbox" [(ngModel)]="row().KundefordrIkkeFaktInntekt_O" /> Override: non-invoiced</label>
        <label><input type="checkbox" [(ngModel)]="row().KundefordrTap_O" /> Override: loss</label>
        <label><input type="checkbox" [(ngModel)]="row().KundefordrTapIF_O" /> Override: loss prev year</label>
        <label><input type="checkbox" [(ngModel)]="row().Kredittsalg_O" /> Override: credit sales</label>
        <label><input type="checkbox" [(ngModel)]="row().KredittsalgIF_O" /> Override: credit sales prev year</label>
        <label><input type="checkbox" [(ngModel)]="row().AnnenFordring_O" /> Override: other receivables</label>
      </div>
      </div>
      <div class="toolbar">
        <button type="button" (click)="printTopic()">Print</button>
        <button type="button" (click)="resetFromChartOfAccounts()">Reset from chart of accounts</button>
      </div>
      <p class="muted" *ngIf="statusMessage()">{{ statusMessage() }}</p>
    </section>
  `,
  styles: [`
    .topic{display:grid;gap:10px}
    h3,h4{margin:0}
    .top-right-help{display:flex;flex-direction:column;align-items:flex-end;gap:6px}
    .help-icon-btn{width:30px;height:30px;border-radius:999px;padding:0;font-weight:700;display:inline-flex;align-items:center;justify-content:center;background:#eff6ff;border:1px solid #bfdbfe;color:#1e40af}
    .card{border:1px solid #dbe1ea;border-radius:8px;padding:12px;background:#fff;display:grid;gap:10px}
    .toolbar{display:flex;gap:8px;flex-wrap:wrap}
    .grid{display:grid;grid-template-columns:repeat(2,minmax(220px,1fr));gap:8px}
    .override-grid{display:grid;grid-template-columns:repeat(3,minmax(180px,1fr));gap:8px;margin-top:4px}
    label{display:flex;flex-direction:column;font-size:12px;gap:4px;color:#475569;line-height:1.35}
    .override-grid label{flex-direction:row;align-items:center;gap:8px}
    input,button{border:1px solid #cbd5e1;border-radius:6px;padding:7px 9px;font-size:13px}
    input[readonly],input:disabled,select:disabled{background:#f1f5f9;color:#64748b;cursor:not-allowed}
    button{background:#f8fafc;cursor:pointer}
    .next-btn{background:#eff6ff;border-color:#bfdbfe;color:#1e40af;font-weight:600}
    .muted{color:#64748b;font-size:12px}
  `]
})
export class ReceivablesTaxValueTopicComponent {
  readonly statusMessage = signal('');
  readonly row = signal<FordringerRow>({
    Id: '0000001',
    Firmanr: 1,
    Aar: '2025',
    KundefordrIkkeFaktInntekt: 110000,
    KundefordrIkkeFaktInntekt_O: false,
    KundefordrTap: 12000,
    KundefordrTap_O: false,
    KundefordrTapIF: 9000,
    KundefordrTapIF_O: false,
    Kredittsalg: 45000,
    Kredittsalg_O: false,
    KredittsalgIF: 31000,
    KredittsalgIF_O: false,
    KundefordrSktmNedskr: 0,
    KundefordrSktmNedskrNyetabl: 0,
    KundefordrSktmVerdi: 0,
    AnnenFordring: 6000,
    AnnenFordring_O: false,
    sumFordrSktmVerdi: 0
  });

  updateNumeric(
    field:
      | 'KundefordrIkkeFaktInntekt'
      | 'KundefordrTap'
      | 'KundefordrTapIF'
      | 'Kredittsalg'
      | 'KredittsalgIF'
      | 'KundefordrSktmNedskrNyetabl'
      | 'AnnenFordring',
    value: number
  ): void {
    const nextValue = Number(value) || 0;
    const overrideField = `${field}_O` as keyof FordringerRow;
    this.row.update((r) => {
      const updated: FordringerRow = { ...r, [field]: nextValue };
      if (overrideField in updated && typeof updated[overrideField] === 'boolean') {
        (updated[overrideField] as boolean) = true;
      }
      return updated;
    });
    this.recalc();
  }

  recalc(): void {
    const r = this.row();
    const baseReceivable = Math.max(0, r.KundefordrIkkeFaktInntekt);
    const totalLoss = Math.max(0, r.KundefordrTap) + Math.max(0, r.KundefordrTapIF);
    const totalCreditSales = Math.max(0, r.Kredittsalg) + Math.max(0, r.KredittsalgIF);
    const lossRatio = totalCreditSales > 0 ? totalLoss / totalCreditSales : 0;
    const taxWriteDown = Math.min(baseReceivable, Math.max(0, baseReceivable * lossRatio * 4));
    const sktm = Math.max(0, baseReceivable - taxWriteDown - Math.max(0, r.KundefordrSktmNedskrNyetabl));
    this.row.set({ ...r, KundefordrSktmNedskr: taxWriteDown, KundefordrSktmVerdi: sktm, sumFordrSktmVerdi: sktm + r.AnnenFordring });
  }

  resetFromChartOfAccounts(): void {
    this.row.set({
      ...this.row(),
      KundefordrIkkeFaktInntekt: 0,
      KundefordrTap: 0,
      KundefordrTapIF: 0,
      Kredittsalg: 0,
      KredittsalgIF: 0,
      KundefordrSktmNedskrNyetabl: 0,
      KundefordrSktmVerdi: 0,
      AnnenFordring: 0,
      sumFordrSktmVerdi: 0,
      KundefordrIkkeFaktInntekt_O: false,
      KundefordrTap_O: false,
      KundefordrTapIF_O: false,
      Kredittsalg_O: false,
      KredittsalgIF_O: false,
      AnnenFordring_O: false
    });
    this.statusMessage.set('Values refreshed from chart of accounts.');
    this.recalc();
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
}
