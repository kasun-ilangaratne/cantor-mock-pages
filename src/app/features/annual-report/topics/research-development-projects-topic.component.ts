import { CommonModule } from '@angular/common';
import { Component, HostListener, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ResearchDevelopmentSharedService } from './research-development-shared.service';

interface FoUProjectRow {
  id: string;
  projectNumber: number;
  projectTitle: string;
  taxDeductionPerProject: number;
  taxIncreasePerProject: number;
}

interface FoUTotals {
  companyNo: number;
  year: string;
  totalCost: number;
  totalTaxDeduction: number;
  totalTaxIncrease: number;
  appliesSvalbardTaxation: boolean;
}

@Component({
  selector: 'app-research-development-projects-topic',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="topic">
      <div class="top-header">
        <div class="toolbar"></div>
        <div class="top-right-help">
          <button type="button" class="next-btn" (click)="statusMessage.set('Next topic is not wired yet.')">Next topic →</button>
          <div class="overflow-menu" (click)="$event.stopPropagation()">
            <button type="button" class="overflow-trigger" (click)="toggleMenu($event)" aria-label="More options" title="More options">⋮</button>
            <div class="overflow-panel" *ngIf="menuOpen()">
              <button type="button" (click)="recalcTotals(); closeMenu()">Recalculate totals</button>
              <button type="button" (click)="statusMessage.set('Print is not wired yet.'); closeMenu()">Print</button>
              <button type="button" (click)="statusMessage.set('Topic picker is not wired yet.'); closeMenu()">Select topic</button>
            </div>
          </div>
          <button type="button" class="help-icon-btn" (click)="statusMessage.set('Help is not wired yet.')" aria-label="Help" title="Help">?</button>
        </div>
      </div>

      <article class="card">
        <div class="summary-grid">
          <div class="summary-tile">
            <span class="summary-label">Total cost</span>
            <strong class="summary-value">{{ totals().totalCost | number: '1.0-0' }}</strong>
          </div>
          <div class="summary-tile">
            <span class="summary-label">Total tax deduction</span>
            <strong class="summary-value">{{ totals().totalTaxDeduction | number: '1.0-0' }}</strong>
          </div>
          <div class="summary-tile">
            <span class="summary-label">Total tax increase</span>
            <strong class="summary-value">{{ totals().totalTaxIncrease | number: '1.0-0' }}</strong>
          </div>
          <div class="summary-toggle">
            <span class="summary-label">Tax context</span>
            <label class="check-row">
              <input type="checkbox" [ngModel]="totals().appliesSvalbardTaxation" (ngModelChange)="updateSvalbard($event)" />
              Applies Svalbard taxation
            </label>
          </div>
        </div>
      </article>

      <article class="card table-card">
        <div class="section-head">
          <h4>R&D Projects</h4>
          <button type="button" class="add-btn" (click)="openEditor()">Add new</button>
        </div>
        <div class="table-wrap">
          <table class="assets-table">
            <thead>
              <tr>
                <th>Project no</th>
                <th>Title</th>
                <th class="num">Tax deduction</th>
                <th class="num">Tax increase</th>
                <th class="actions-col">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let row of projects(); let i = index">
                <td>{{ row.projectNumber }}</td>
                <td>{{ row.projectTitle }}</td>
                <td class="num">{{ row.taxDeductionPerProject | number: '1.0-0' }}</td>
                <td class="num">{{ row.taxIncreasePerProject | number: '1.0-0' }}</td>
                <td class="actions-col">
                  <button type="button" class="icon-btn" (click)="openEditor(i)">✎</button>
                  <button type="button" (click)="openDetails(row)">Details...</button>
                  <button type="button" class="icon-btn danger-icon-btn" title="Delete" aria-label="Delete" (click)="removeProject(i)">🗑</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </article>

      <aside class="detail-drawer" [class.open]="editorOpen()">
        <div class="drawer-header">
          <div>
            <h4>{{ editorIndex() === -1 ? 'New project' : 'Edit project' }}</h4>
            <small>SM_ForskningOgUtviklingProsjekter</small>
          </div>
          <button type="button" class="close-btn" (click)="closeEditor()">Close</button>
        </div>
        <div class="drawer-content" *ngIf="draft() as current">
          <div class="grid two">
            <label>Project number<input type="number" [(ngModel)]="current.projectNumber" /></label>
            <label>Project title<input [(ngModel)]="current.projectTitle" /></label>
            <label>Tax deduction<input type="number" [(ngModel)]="current.taxDeductionPerProject" /></label>
            <label>Tax increase<input type="number" [(ngModel)]="current.taxIncreasePerProject" /></label>
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
    .topic{display:grid;gap:10px;position:relative;min-height:560px;align-content:start}
    .top-header{display:flex;justify-content:space-between;align-items:flex-start}
    .toolbar{display:flex;align-items:center;gap:8px}
    .top-right-help{display:flex;flex-direction:column;align-items:flex-end;gap:6px}
    .next-btn{font-size:12px;background:#2563eb;color:#fff;border-color:#1d4ed8}
    .help-icon-btn{width:32px;height:32px;border-radius:999px;background:#eff6ff;color:#1e3a8a;border:1px solid #bfdbfe;font-weight:700}
    .overflow-menu{position:relative}
    .overflow-trigger{border:1px solid #cbd5e1;border-radius:6px;padding:3px 8px;background:#f8fafc;cursor:pointer;font-size:18px;line-height:1}
    .overflow-panel{position:absolute;top:34px;right:0;z-index:20;display:grid;gap:6px;min-width:210px;padding:8px;border:1px solid #dbe1ea;border-radius:8px;background:#fff;box-shadow:0 8px 20px rgba(15,23,42,.12)}
    .overflow-panel button{text-align:left}
    .card{background:#fff;border:1px solid #dbe1ea;border-radius:10px;padding:12px;display:grid;gap:8px}
    .table-card{overflow:auto}
    .section-head{display:flex;justify-content:space-between;align-items:center;gap:8px}
    .add-btn{background:#eff6ff;border-color:#bfdbfe;color:#1e40af;font-weight:600}
    .assets-table{width:100%;border-collapse:collapse;min-width:760px}
    .assets-table th,.assets-table td{border-bottom:1px solid #e2e8f0;padding:8px 6px;font-size:12px;vertical-align:middle}
    .assets-table thead{background:#f8fafc}
    .assets-table tbody tr:hover{background:#f8fafc}
    .danger-icon-btn{color:#b91c1c;border-color:#fecaca;background:#fff1f2}
    .num{text-align:right;font-variant-numeric:tabular-nums}
    .actions-col{width:230px;text-align:right}
    input,button,select{border:1px solid #cbd5e1;border-radius:6px;padding:6px 8px;font-size:12px}
    input[readonly],input:disabled,select:disabled{background:#f1f5f9;color:#64748b;cursor:not-allowed}
    .summary-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}
    .summary-tile,.summary-toggle{border:1px solid #e2e8f0;background:#f8fafc;border-radius:10px;padding:10px;display:grid;gap:6px;align-content:start}
    .summary-label{font-size:11px;color:#64748b}
    .summary-value{font-size:18px;line-height:1.1;color:#0f172a}
    .detail-drawer{position:absolute;top:12px;right:12px;width:0;opacity:0;height:calc(100% - 24px);background:#fff;border:1px solid #dbe1ea;border-radius:10px;overflow:hidden;transition:width .18s ease,opacity .18s ease;pointer-events:none;display:flex;flex-direction:column;z-index:10}
    .detail-drawer.open{width:460px;opacity:1;pointer-events:auto}
    .drawer-header{display:flex;justify-content:space-between;align-items:center;padding:12px;border-bottom:1px solid #e5e7eb;background:#f8fafc}
    .drawer-content{padding:12px;overflow:auto;overflow-x:hidden;display:grid;gap:10px;height:calc(100% - 120px)}
    .grid{display:grid;gap:8px}
    .grid.two{grid-template-columns:minmax(0,1fr) minmax(0,1fr)}
    label{display:flex;flex-direction:column;font-size:12px;gap:4px;color:#475569;line-height:1.35;min-width:0}
    .check-row{display:flex;flex-direction:row;align-items:center;gap:8px}
    .drawer-actions{display:flex;justify-content:flex-end;gap:8px;padding:12px;border-top:1px solid #e5e7eb}
    .err{color:#b91c1c;margin:0;font-size:12px}
    .muted{color:#64748b;font-size:12px}
  `]
})
export class ResearchDevelopmentProjectsTopicComponent {
  constructor(private readonly rdShared: ResearchDevelopmentSharedService) {
    this.recalcTotals();
  }

  readonly totals = signal<FoUTotals>({
    companyNo: 101,
    year: '2025',
    totalCost: 0,
    totalTaxDeduction: 0,
    totalTaxIncrease: 0,
    appliesSvalbardTaxation: false
  });

  readonly projects = signal<FoUProjectRow[]>([
    { id: 'fou-1', projectNumber: 1, projectTitle: 'AI quality pipeline', taxDeductionPerProject: 125000, taxIncreasePerProject: 0 }
  ]);

  readonly editorOpen = signal(false);
  readonly editorIndex = signal(-1);
  readonly draft = signal<FoUProjectRow | null>(null);
  readonly editorError = signal('');
  readonly statusMessage = signal('');
  readonly menuOpen = signal(false);

  openEditor(index = -1): void {
    this.editorIndex.set(index);
    this.draft.set(index === -1 ? this.createEmptyProject(this.projects().length + 1) : { ...this.projects()[index] });
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
    if (!current.projectTitle.trim()) {
      this.editorError.set('Project title is required.');
      return;
    }
    const idx = this.editorIndex();
    if (idx === -1) {
      this.projects.update((rows) => [current, ...rows]);
      this.statusMessage.set('Project added.');
    } else {
      this.projects.update((rows) => rows.map((r, i) => (i === idx ? current : r)));
      this.statusMessage.set('Project updated.');
    }
    this.recalcTotals();
    this.closeEditor();
  }

  removeProject(index: number): void {
    this.projects.update((rows) => rows.filter((_, i) => i !== index));
    this.recalcTotals();
    this.statusMessage.set('Project deleted.');
  }

  openDetails(row: FoUProjectRow): void {
    this.rdShared.requestDetails({ projectNumber: row.projectNumber, projectTitle: row.projectTitle });
    window.dispatchEvent(new CustomEvent('annual-report:navigate-topic', { detail: { topicId: 'research-development' } }));
    this.statusMessage.set(`Opening detailed view for project ${row.projectNumber}.`);
  }

  recalcTotals(): void {
    const rows = this.projects();
    const totalTaxDeduction = rows.reduce((s, r) => s + r.taxDeductionPerProject, 0);
    const totalTaxIncrease = rows.reduce((s, r) => s + r.taxIncreasePerProject, 0);
    const totalCost = totalTaxDeduction + totalTaxIncrease;
    this.totals.update((t) => ({ ...t, totalCost, totalTaxDeduction, totalTaxIncrease }));
  }

  updateSvalbard(value: boolean): void {
    this.totals.update((t) => ({ ...t, appliesSvalbardTaxation: !!value }));
  }

  toggleMenu(event: Event): void {
    event.stopPropagation();
    this.menuOpen.update((v) => !v);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    if (this.menuOpen()) this.menuOpen.set(false);
  }

  private createEmptyProject(projectNumber: number): FoUProjectRow {
    return {
      id: `fou-${Date.now()}`,
      projectNumber,
      projectTitle: '',
      taxDeductionPerProject: 0,
      taxIncreasePerProject: 0
    };
  }
}
