import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-establish-cashflow-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  template: `
    <div class="cashflow-dialog">
      <h2 mat-dialog-title class="dialog-title">Etabler kontantstrømanalyse</h2>
      <mat-dialog-content class="dialog-content">
        <p>
          Denne rutinen etablerer kontantstrømanalyse på dette selskapet ved å lese inn nye
          kontantstrømvariabler og legger inn styringer fra kolonne 8 i kontoplanen til ny
          kontantstrømoppstillings rapport. Eksisterende styringer i rapportkolonne 8 vil bli
          overskrevet. Sjekk om du bruker rapportkolonne 8 til andre rapporter og flytt evt.
          disse til en ledig kolonne før denne rutinen startes.
        </p>
      </mat-dialog-content>
      <mat-dialog-actions align="end" class="dialog-actions">
        <button type="button" class="btn-save" (click)="dialogRef.close(true)">OK</button>
        <button type="button" class="btn-cancel" (click)="dialogRef.close(false)">Avbryt</button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .cashflow-dialog { min-width: 520px; max-width: 640px; }
    .dialog-title { margin: 0; padding: 20px 24px 12px; font-size: 20px; font-weight: 700; }
    .dialog-content { padding: 8px 24px !important; margin: 0 !important; }
    .dialog-content p { margin: 0; font-size: 14px; line-height: 1.6; color: #1f2937; }
    .dialog-actions { padding: 12px 24px 20px !important; margin: 0 !important; gap: 10px; }
    .btn-save, .btn-cancel {
      min-width: 96px; height: 36px; border: none; border-radius: 6px;
      font-size: 14px; font-weight: 600; cursor: pointer;
    }
    .btn-save { background: #0f2744; color: white; }
    .btn-cancel { background: #e5e7eb; color: #111827; }
  `]
})
export class EstablishCashflowDialogComponent {
  constructor(public dialogRef: MatDialogRef<EstablishCashflowDialogComponent>) {}
}
