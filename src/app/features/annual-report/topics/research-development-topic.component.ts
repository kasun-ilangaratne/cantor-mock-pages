import { CommonModule } from '@angular/common';
import { Component, HostListener, effect, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ResearchDevelopmentSharedService } from './research-development-shared.service';

interface OffentligStotteRow {
  id: string;
  payerName: string;
  amount: number;
}

interface SamarbeidVirksomhetRow {
  id: string;
  organizationNumber: string;
  description: string;
}

interface ArbeidspakkeRow {
  id: string;
  workPackageId: string;
  title: string;
  projectCategory: string;
  costInYear: number;
  personnelCost: number;
  ownHours: number;
  priorYearCost: number;
  maxAllowedPublicSupportShare: number;
  publicSupportReceived: number;
}

interface FoUProjectDetail {
  id: string;
  projectNumber: number;
  projectTitle: string;
  projectStatus: string;
  projectRequiresAuditorConfirmation: boolean;
  isCollaborationProject: boolean;
  collaborationSharePercent: number;
  comprehensiveDissemination: boolean;
  financiallyDistressedAtApplication: boolean;
  soughtOtherPublicSupportInNorway: boolean;
  businessCategory: string;
  basisDocumentation: string;
  basisDocumentationDate: string;
  priorYearsNetTaxDeduction: number;
  netTaxDeductionBeforeReduction: number;
  taxDeductionPerProject: number;
  taxIncreasePerProject: number;
  totalGrossPublicSupportInProjectPeriod: number;
  approvedGrossPublicSupportMax: number;
  supportBeyondApprovedGrossMax: number;
  publiclySupportedReducedEmployerTax: number;
  approvedSkattefunnStart: string;
  approvedSkattefunnEnd: string;
  totalCostInWholeProjectPeriod: number;
  offentligStotte: OffentligStotteRow[];
  samarbeidendeVirksomheter: SamarbeidVirksomhetRow[];
  arbeidspakker: ArbeidspakkeRow[];
}

@Component({
  selector: 'app-research-development-topic',
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
              <button type="button" (click)="recalculateProject(); closeMenu()">Recalculate project</button>
              <button type="button" (click)="statusMessage.set('Print is not wired yet.'); closeMenu()">Print</button>
              <button type="button" (click)="statusMessage.set('Help document is not wired yet.'); closeMenu()">Open help</button>
            </div>
          </div>
          <button type="button" class="help-icon-btn" (click)="statusMessage.set('Help is not wired yet.')" aria-label="Help" title="Help">?</button>
        </div>
      </div>

      <article class="card table-card">
        <div class="section-head">
          <h4>Project details</h4>
          <button type="button" class="add-btn" (click)="openEditor()">Add new</button>
        </div>
        <div class="table-wrap">
          <table class="assets-table">
            <thead>
              <tr>
                <th>Project no</th>
                <th>Title</th>
                <th>Status</th>
                <th class="num">Tax deduction</th>
                <th class="num">Tax increase</th>
                <th>Auditor confirms</th>
                <th>Collaboration</th>
                <th>Business category</th>
                <th class="actions-col">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let row of projects(); let i = index">
                <td>{{ row.projectNumber }}</td>
                <td>{{ row.projectTitle }}</td>
                <td>{{ row.projectStatus }}</td>
                <td class="num">{{ row.taxDeductionPerProject | number: '1.0-0' }}</td>
                <td class="num">{{ row.taxIncreasePerProject | number: '1.0-0' }}</td>
                <td>{{ row.projectRequiresAuditorConfirmation ? 'Yes' : 'No' }}</td>
                <td>{{ row.isCollaborationProject ? 'Yes' : 'No' }}</td>
                <td>{{ row.businessCategory || '-' }}</td>
                <td class="actions-col">
                  <button type="button" class="icon-btn" (click)="openEditor(i)">✎</button>
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
            <h4>{{ editorIndex() === -1 ? 'New project detail' : 'Edit project detail' }}</h4>
            <small>SM_ForskningOgUtvikling</small>
          </div>
          <button type="button" class="close-btn" (click)="closeEditor()">Close</button>
        </div>
        <div class="drawer-content" *ngIf="draft() as current">
          <div class="tab-strip">
            <button type="button" [class.active]="childTab() === 'details'" (click)="childTab.set('details')">Details</button>
            <button type="button" [class.active]="childTab() === 'collaboration'" (click)="childTab.set('collaboration')">Collaboration companies</button>
            <button type="button" [class.active]="childTab() === 'support'" (click)="childTab.set('support')">Other public support</button>
            <button type="button" [class.active]="childTab() === 'work-packages'" (click)="childTab.set('work-packages')">Work packages</button>
          </div>

          <div class="grid two" *ngIf="childTab() === 'details'">
            <label>Project number<input type="number" [(ngModel)]="current.projectNumber" /></label>
            <label>Project title<input [(ngModel)]="current.projectTitle" /></label>
            <label>Project status
              <select [(ngModel)]="current.projectStatus">
                <option *ngFor="let option of projectStatusOptions" [value]="option">{{ option }}</option>
              </select>
            </label>
            <label>Business category
              <select [(ngModel)]="current.businessCategory">
                <option *ngFor="let option of businessCategoryOptions" [value]="option">{{ option }}</option>
              </select>
            </label>
            <label>Basis documentation
              <select [(ngModel)]="current.basisDocumentation">
                <option *ngFor="let option of basisDocumentationOptions" [value]="option">{{ option }}</option>
              </select>
            </label>
            <label>Basis documentation date<input type="date" [(ngModel)]="current.basisDocumentationDate" /></label>
            <label>Net tax deduction from prior years<input type="number" [(ngModel)]="current.priorYearsNetTaxDeduction" /></label>
            <label>Collaboration project share (%)<input type="number" [(ngModel)]="current.collaborationSharePercent" /></label>
            <label>Tax deduction per project<input type="number" [(ngModel)]="current.taxDeductionPerProject" /></label>
            <label>Tax increase per project<input type="number" [(ngModel)]="current.taxIncreasePerProject" /></label>
            <label>Net tax deduction before reduction<input type="number" [(ngModel)]="current.netTaxDeductionBeforeReduction" /></label>
            <label>Total gross public support<input type="number" [(ngModel)]="current.totalGrossPublicSupportInProjectPeriod" /></label>
            <label>Approved gross support max<input type="number" [(ngModel)]="current.approvedGrossPublicSupportMax" /></label>
            <label>Support beyond approved max<input type="number" [(ngModel)]="current.supportBeyondApprovedGrossMax" /></label>
            <label>Skattefunn approved start<input [(ngModel)]="current.approvedSkattefunnStart" /></label>
            <label>Skattefunn approved end<input [(ngModel)]="current.approvedSkattefunnEnd" /></label>
            <label>Total project period cost<input type="number" [(ngModel)]="current.totalCostInWholeProjectPeriod" /></label>
            <label>Reduced employer tax support<input type="number" [(ngModel)]="current.publiclySupportedReducedEmployerTax" /></label>
          </div>

          <div class="toggle-grid" *ngIf="childTab() === 'details'">
            <label class="check-row"><input type="checkbox" [(ngModel)]="current.projectRequiresAuditorConfirmation" /> Project requires auditor confirmation</label>
            <label class="check-row"><input type="checkbox" [(ngModel)]="current.isCollaborationProject" /> Collaboration project</label>
            <label class="check-row"><input type="checkbox" [(ngModel)]="current.comprehensiveDissemination" /> Comprehensive dissemination via conferences/publications</label>
            <label class="check-row"><input type="checkbox" [(ngModel)]="current.financiallyDistressedAtApplication" /> Financially distressed at application</label>
            <label class="check-row"><input type="checkbox" [(ngModel)]="current.soughtOtherPublicSupportInNorway" /> Sought other public support in Norway</label>
          </div>

          <section class="subtype-section" *ngIf="childTab() === 'collaboration'">
            <div class="section-head">
              <h5>Collaboration companies</h5>
              <button type="button" class="add-btn" (click)="addCollaborationCompany(current)">Add</button>
            </div>
            <div class="table-wrap">
              <table class="assets-table work-packages-table">
                <thead><tr><th>Org no</th><th>Description</th><th class="actions-col">Actions</th></tr></thead>
                <tbody>
                  <tr *ngFor="let row of current.samarbeidendeVirksomheter; let i = index">
                    <td><input [(ngModel)]="row.organizationNumber" /></td>
                    <td><input [(ngModel)]="row.description" /></td>
                    <td class="actions-col"><button type="button" class="icon-btn danger-icon-btn" title="Delete" aria-label="Delete" (click)="removeCollaborationCompany(current, i)">🗑</button></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section class="subtype-section" *ngIf="childTab() === 'support'">
            <div class="section-head">
              <h5>Other public support</h5>
              <button type="button" class="add-btn" (click)="addPublicSupport(current)">Add</button>
            </div>
            <div class="table-wrap">
              <table class="assets-table">
                <thead><tr><th>Payer name</th><th class="num">Amount</th><th class="actions-col">Actions</th></tr></thead>
                <tbody>
                  <tr *ngFor="let row of current.offentligStotte; let i = index">
                    <td><input [(ngModel)]="row.payerName" /></td>
                    <td class="num"><input type="number" [(ngModel)]="row.amount" /></td>
                    <td class="actions-col"><button type="button" class="icon-btn danger-icon-btn" title="Delete" aria-label="Delete" (click)="removePublicSupport(current, i)">🗑</button></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section class="subtype-section" *ngIf="childTab() === 'work-packages'">
            <div class="section-head">
              <h5>Work packages</h5>
              <button type="button" class="add-btn" (click)="openWorkPackageEditor()">Add</button>
            </div>
            <div class="table-wrap">
              <table class="assets-table">
                <thead>
                  <tr>
                    <th>WP ID</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th class="num">Cost in year</th>
                    <th class="actions-col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let row of current.arbeidspakker; let i = index">
                    <td>{{ row.workPackageId || '-' }}</td>
                    <td>{{ row.title || '-' }}</td>
                    <td>{{ row.projectCategory || '-' }}</td>
                    <td class="num">{{ row.costInYear | number: '1.0-0' }}</td>
                    <td class="actions-col">
                      <button type="button" class="icon-btn" (click)="openWorkPackageEditor(i)">✎</button>
                      <button type="button" class="icon-btn danger-icon-btn" title="Delete" aria-label="Delete" (click)="removeWorkPackage(current, i)">🗑</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <section class="work-package-editor" *ngIf="workPackageEditorOpen() && workPackageDraft() as wp">
              <div class="section-head">
                <h5>{{ workPackageEditorIndex() === -1 ? 'New work package details' : 'Edit work package details' }}</h5>
              </div>
              <div class="grid two">
                <label>WP ID<input [(ngModel)]="wp.workPackageId" /></label>
                <label>Title<input [(ngModel)]="wp.title" /></label>
                <label>Category
                  <select [(ngModel)]="wp.projectCategory">
                    <option *ngFor="let option of projectCategoryOptions" [value]="option">{{ option }}</option>
                  </select>
                </label>
                <label>Cost in year<input type="number" [(ngModel)]="wp.costInYear" /></label>
                <label>Personnel cost<input type="number" [(ngModel)]="wp.personnelCost" /></label>
                <label>Own hours<input type="number" [(ngModel)]="wp.ownHours" /></label>
                <label>Cost from prior years<input type="number" [(ngModel)]="wp.priorYearCost" /></label>
                <label>Max public support share<input type="number" step="0.01" [(ngModel)]="wp.maxAllowedPublicSupportShare" /></label>
                <label>Public support per package<input type="number" [(ngModel)]="wp.publicSupportReceived" /></label>
              </div>
              <p class="err" *ngIf="workPackageEditorError()">{{ workPackageEditorError() }}</p>
              <div class="drawer-actions work-package-actions">
                <button type="button" (click)="closeWorkPackageEditor()">Cancel</button>
                <button type="button" class="add-btn" (click)="saveWorkPackageEditor(current)">Save work package</button>
              </div>
            </section>
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
    .topic{display:grid;gap:10px;position:relative;min-height:620px;align-content:start}
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
    .assets-table{width:100%;border-collapse:collapse;table-layout:fixed}
    .assets-table th,.assets-table td{border-bottom:1px solid #e2e8f0;padding:8px 6px;font-size:12px;vertical-align:middle;text-align:left}
    .assets-table thead{background:#f8fafc}
    .assets-table tbody tr:hover{background:#f8fafc}
    .danger-icon-btn{color:#b91c1c;border-color:#fecaca;background:#fff1f2}
    .assets-table th.num,.assets-table td.num{text-align:right;font-variant-numeric:tabular-nums}
    .actions-col{width:120px;text-align:right}
    input,button,select{border:1px solid #cbd5e1;border-radius:6px;padding:6px 8px;font-size:12px}
    input[readonly],input:disabled,select:disabled{background:#f1f5f9;color:#64748b;cursor:not-allowed}
    .detail-drawer{position:absolute;top:12px;right:12px;width:0;opacity:0;height:calc(100% - 24px);background:#fff;border:1px solid #dbe1ea;border-radius:10px;overflow:hidden;transition:width .18s ease,opacity .18s ease;pointer-events:none;display:flex;flex-direction:column;z-index:10}
    .detail-drawer.open{width:640px;opacity:1;pointer-events:auto}
    .drawer-header{display:flex;justify-content:space-between;align-items:center;padding:12px;border-bottom:1px solid #e5e7eb;background:#f8fafc}
    .drawer-content{padding:12px;overflow:auto;overflow-x:hidden;display:grid;gap:10px;height:calc(100% - 120px)}
    .grid{display:grid;gap:8px}
    .grid.two{grid-template-columns:minmax(0,1fr) minmax(0,1fr)}
    label{display:flex;flex-direction:column;font-size:12px;gap:4px;color:#475569;line-height:1.35;min-width:0}
    .check-row{display:flex;flex-direction:row;align-items:center;gap:8px}
    .toggle-grid{display:grid;gap:6px}
    .tab-strip{display:flex;align-items:flex-start;gap:6px;flex-wrap:wrap;border-bottom:1px solid #e5e7eb;padding:0 0 8px;margin:0 0 8px;background:#fff}
    .tab-strip button{display:inline-flex;flex:0 0 auto;align-items:center;justify-content:center;height:34px;background:#f8fafc;border:1px solid #cbd5e1;border-radius:6px;font-size:12px;padding:6px 10px;white-space:nowrap;line-height:1.2;color:#1f2937}
    .tab-strip button.active{background:#dbeafe;border-color:#93c5fd;color:#1e40af;font-weight:600}
    .subtype-section{border:1px solid #e2e8f0;border-radius:8px;padding:8px;display:grid;gap:6px}
    .subtype-section h5{margin:0;font-size:12px}
    .table-wrap{overflow-x:hidden;max-width:100%}
    .subtype-section .assets-table input,.subtype-section .assets-table select{min-width:0;width:100%}
    .work-package-editor{border:1px solid #dbe1ea;border-radius:8px;padding:10px;background:#f8fafc;display:grid;gap:8px}
    .work-package-actions{padding:0;border-top:none}
    .drawer-actions{display:flex;justify-content:flex-end;gap:8px;padding:12px;border-top:1px solid #e5e7eb}
    .err{color:#b91c1c;margin:0;font-size:12px}
    .muted{color:#64748b;font-size:12px}
  `]
})
export class ResearchDevelopmentTopicComponent {
  constructor(private readonly rdShared: ResearchDevelopmentSharedService) {
    effect(() => {
      const request = this.rdShared.detailsRequest();
      if (!request) return;
      const index = this.ensureProjectFromRequest(request.projectNumber, request.projectTitle);
      this.openEditor(index);
      this.statusMessage.set(`Detailed view opened for project ${request.projectNumber}.`);
      this.rdShared.clearDetailsRequest();
    });
  }

  readonly businessCategoryOptions = ['SMB', 'Large enterprise', 'Research institution'];
  readonly basisDocumentationOptions = ['Technical report', 'Audit documentation', 'Skattefunn approval letter'];
  readonly projectCategoryOptions = ['Industrial research', 'Experimental development', 'Feasibility study'];
  readonly projectStatusOptions = ['Approved', 'Pending', 'Rejected', 'Completed'];
  readonly projects = signal<FoUProjectDetail[]>([this.createSeedProject()]);
  readonly editorOpen = signal(false);
  readonly editorIndex = signal(-1);
  readonly draft = signal<FoUProjectDetail | null>(null);
  readonly childTab = signal<'details' | 'collaboration' | 'support' | 'work-packages'>('details');
  readonly workPackageEditorOpen = signal(false);
  readonly workPackageEditorIndex = signal(-1);
  readonly workPackageDraft = signal<ArbeidspakkeRow | null>(null);
  readonly workPackageEditorError = signal('');
  readonly editorError = signal('');
  readonly statusMessage = signal('');
  readonly menuOpen = signal(false);

  openEditor(index = -1): void {
    this.editorIndex.set(index);
    this.draft.set(index === -1 ? this.createEmptyProject(this.projects().length + 1) : structuredClone(this.projects()[index]));
    this.childTab.set('details');
    this.editorError.set('');
    this.editorOpen.set(true);
  }

  closeEditor(): void {
    this.editorOpen.set(false);
    this.draft.set(null);
    this.childTab.set('details');
    this.closeWorkPackageEditor();
    this.editorError.set('');
  }

  saveEditor(): void {
    const current = this.draft();
    if (!current) return;
    if (!current.projectTitle.trim()) {
      this.editorError.set('Project title is required.');
      return;
    }
    this.recalculateProjectFor(current);
    if (!current.isCollaborationProject) {
      current.collaborationSharePercent = 0;
      current.samarbeidendeVirksomheter = [];
    }
    const idx = this.editorIndex();
    if (idx === -1) {
      this.projects.update((rows) => [current, ...rows]);
      this.statusMessage.set('Project detail added.');
    } else {
      this.projects.update((rows) => rows.map((r, i) => (i === idx ? current : r)));
      this.statusMessage.set('Project detail updated.');
    }
    this.closeEditor();
  }

  removeProject(index: number): void {
    this.projects.update((rows) => rows.filter((_, i) => i !== index));
    this.statusMessage.set('Project detail deleted.');
  }

  recalculateProject(): void {
    const idx = this.editorIndex();
    const current = this.draft();
    if (idx !== -1 && current) {
      this.recalculateProjectFor(current);
      this.statusMessage.set('Project recalculated.');
    } else {
      this.statusMessage.set('Open a project in drawer to recalculate.');
    }
  }

  addPublicSupport(project: FoUProjectDetail): void {
    project.offentligStotte.push({ id: `stotte-${Date.now()}`, payerName: '', amount: 0 });
    this.recalculateProjectFor(project);
  }

  removePublicSupport(project: FoUProjectDetail, index: number): void {
    project.offentligStotte.splice(index, 1);
    this.recalculateProjectFor(project);
  }

  addCollaborationCompany(project: FoUProjectDetail): void {
    project.samarbeidendeVirksomheter.push({ id: `virk-${Date.now()}`, organizationNumber: '', description: '' });
  }

  removeCollaborationCompany(project: FoUProjectDetail, index: number): void {
    project.samarbeidendeVirksomheter.splice(index, 1);
  }

  openWorkPackageEditor(index = -1): void {
    const project = this.draft();
    if (!project) return;
    this.workPackageEditorIndex.set(index);
    this.workPackageDraft.set(index === -1 ? this.createEmptyWorkPackage() : structuredClone(project.arbeidspakker[index]));
    this.workPackageEditorError.set('');
    this.workPackageEditorOpen.set(true);
  }

  closeWorkPackageEditor(): void {
    this.workPackageEditorOpen.set(false);
    this.workPackageEditorIndex.set(-1);
    this.workPackageDraft.set(null);
    this.workPackageEditorError.set('');
  }

  saveWorkPackageEditor(project: FoUProjectDetail): void {
    const wp = this.workPackageDraft();
    if (!wp) return;
    if (!wp.workPackageId.trim()) {
      this.workPackageEditorError.set('Work package ID is required.');
      return;
    }
    if (!wp.title.trim()) {
      this.workPackageEditorError.set('Work package title is required.');
      return;
    }
    const idx = this.workPackageEditorIndex();
    if (idx === -1) {
      project.arbeidspakker.push(wp);
    } else {
      project.arbeidspakker[idx] = wp;
    }
    this.recalculateProjectFor(project);
    this.closeWorkPackageEditor();
  }

  removeWorkPackage(project: FoUProjectDetail, index: number): void {
    project.arbeidspakker.splice(index, 1);
    this.recalculateProjectFor(project);
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

  private recalculateProjectFor(project: FoUProjectDetail): void {
    const workPackageCost = project.arbeidspakker.reduce((s, w) => s + w.costInYear, 0);
    const priorYearCost = project.arbeidspakker.reduce((s, w) => s + w.priorYearCost, 0);
    const publicSupport = project.offentligStotte.reduce((s, p) => s + p.amount, 0);
    project.totalGrossPublicSupportInProjectPeriod = publicSupport;
    project.totalCostInWholeProjectPeriod = workPackageCost + priorYearCost;
    project.netTaxDeductionBeforeReduction = Math.max(0, workPackageCost - publicSupport + project.priorYearsNetTaxDeduction);
    project.taxDeductionPerProject = Math.round(project.netTaxDeductionBeforeReduction * 0.19);
    project.taxIncreasePerProject = Math.max(0, publicSupport - project.approvedGrossPublicSupportMax);
    project.supportBeyondApprovedGrossMax = Math.max(0, publicSupport - project.approvedGrossPublicSupportMax);
  }

  private createSeedProject(): FoUProjectDetail {
    const row: FoUProjectDetail = {
      ...this.createEmptyProject(1),
      id: 'fou-detail-1',
      projectNumber: 1,
      projectTitle: 'AI quality pipeline',
      projectStatus: 'Approved',
      businessCategory: 'SMB',
      basisDocumentation: 'Technical report',
      basisDocumentationDate: '2025-03-15',
      priorYearsNetTaxDeduction: 25000,
      projectRequiresAuditorConfirmation: true,
      isCollaborationProject: true,
      approvedGrossPublicSupportMax: 180000,
      offentligStotte: [{ id: 'st-1', payerName: 'Innovation Norway', amount: 100000 }],
      samarbeidendeVirksomheter: [{ id: 'sv-1', organizationNumber: '987654321', description: 'Joint development partner' }],
      arbeidspakker: [{
        id: 'ap-1',
        workPackageId: 'AP-01',
        title: 'Data preparation',
        projectCategory: 'Industrial research',
        costInYear: 350000,
        personnelCost: 250000,
        ownHours: 1200,
        priorYearCost: 0,
        maxAllowedPublicSupportShare: 0.35,
        publicSupportReceived: 100000
      }]
    };
    this.recalculateProjectFor(row);
    return row;
  }

  private createEmptyProject(projectNumber = 1): FoUProjectDetail {
    return {
      id: `fou-detail-${Date.now()}`,
      projectNumber,
      projectTitle: '',
      projectStatus: '',
      projectRequiresAuditorConfirmation: false,
      isCollaborationProject: false,
      collaborationSharePercent: 0,
      comprehensiveDissemination: false,
      financiallyDistressedAtApplication: false,
      soughtOtherPublicSupportInNorway: false,
      businessCategory: '',
      basisDocumentation: '',
      basisDocumentationDate: '',
      priorYearsNetTaxDeduction: 0,
      netTaxDeductionBeforeReduction: 0,
      taxDeductionPerProject: 0,
      taxIncreasePerProject: 0,
      totalGrossPublicSupportInProjectPeriod: 0,
      approvedGrossPublicSupportMax: 0,
      supportBeyondApprovedGrossMax: 0,
      publiclySupportedReducedEmployerTax: 0,
      approvedSkattefunnStart: '',
      approvedSkattefunnEnd: '',
      totalCostInWholeProjectPeriod: 0,
      offentligStotte: [],
      samarbeidendeVirksomheter: [],
      arbeidspakker: []
    };
  }

  private createEmptyWorkPackage(): ArbeidspakkeRow {
    return {
      id: `ap-${Date.now()}`,
      workPackageId: '',
      title: '',
      projectCategory: '',
      costInYear: 0,
      personnelCost: 0,
      ownHours: 0,
      priorYearCost: 0,
      maxAllowedPublicSupportShare: 0,
      publicSupportReceived: 0
    };
  }

  private ensureProjectFromRequest(projectNumber: number, projectTitle: string): number {
    const existing = this.projects().findIndex((row) => row.projectNumber === projectNumber);
    if (existing !== -1) return existing;
    const row = this.createEmptyProject(projectNumber);
    row.projectTitle = projectTitle;
    this.projects.update((rows) => [row, ...rows]);
    return 0;
  }
}
