import { Component } from '@angular/core';

interface Dimension {
  id: number; // 1‑11
  name: string;
}

interface ResultUnit {
  id: string; // "0" for Group of Companies or other unique code
  text: string;
}

@Component({
  selector: 'app-dimensions-result-units',
  template: `
    <section class="p-6 max-w-7xl mx-auto">
      <header class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <h1 class="text-2xl font-semibold">Dimensions</h1>
        <div class="flex gap-3 self-start lg:self-auto">
          <button class="btn-outline" (click)="openDimTree()">Dimension Tree</button>
          <button class="btn-outline" (click)="process()">Process</button>
        </div>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Dimensions Table -->
        <div class="card">
          <h2 class="card-title">Dimensions</h2>
          <div class="overflow-x-auto">
            <table class="table-auto w-full text-sm">
              <thead>
                <tr class="text-left text-gray-500 uppercase text-xs">
                  <th class="w-10">#</th>
                  <th>Dimension</th>
                  <th class="w-20 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let dim of dimensions" class="border-b last:border-b-0">
                  <td>{{ dim.id }}</td>
                  <td>{{ dim.name }}</td>
                  <td class="flex justify-center gap-2 py-1">
                    <button class="icon-btn" aria-label="Edit" (click)="editDimension(dim)">
                      <i class="i-edit"></i>
                    </button>
                    <button class="icon-btn" aria-label="Delete" (click)="deleteDimension(dim)">
                      <i class="i-trash"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <button class="btn-primary w-full mt-4" [disabled]="dimensions.length >= 11" (click)="createDimension()">+ New</button>
        </div>

        <!-- Result Units Table -->
        <div class="card">
          <h2 class="card-title">Result Units</h2>
          <div class="overflow-x-auto">
            <table class="table-auto w-full text-sm">
              <thead>
                <tr class="text-left text-gray-500 uppercase text-xs">
                  <th class="w-16">ID</th>
                  <th>Text</th>
                  <th class="w-20 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let ru of resultUnits" class="border-b last:border-b-0">
                  <td>
                    {{ ru.id }}
                    <span *ngIf="ru.id === '0'" class="ml-1 text-gray-500 text-xs">(Group)</span>
                  </td>
                  <td>{{ ru.text }}</td>
                  <td class="flex justify-center gap-2 py-1">
                    <button class="icon-btn" aria-label="Edit" (click)="editResultUnit(ru)">
                      <i class="i-edit"></i>
                    </button>
                    <button class="icon-btn" aria-label="Delete" (click)="deleteResultUnit(ru)">
                      <i class="i-trash"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <button class="btn-primary w-full mt-4" (click)="createResultUnit()">+ New</button>
        </div>
      </div>
    </section>
  `,
  styles: [`
    /* Utility classes (tailwind style) */
    .card { @apply bg-white shadow rounded-xl p-5 border border-gray-200; }
    .card-title { @apply text-lg font-medium mb-4; }
    .btn-primary { @apply bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition disabled:opacity-40; }
    .btn-outline { @apply border border-gray-300 hover:border-gray-400 text-gray-700 rounded-md py-2 px-4 transition; }
    .icon-btn { @apply text-gray-500 hover:text-gray-700 p-1; }
    i { @apply inline-block w-4 h-4; }
    .i-edit { mask: url('/assets/icons/edit.svg') center/contain no-repeat; background: currentColor; }
    .i-trash { mask: url('/assets/icons/trash.svg') center/contain no-repeat; background: currentColor; }
  `]
})
export class DimensionsResultUnitsComponent {
  dimensions: Dimension[] = [
    { id: 1, name: 'Department' },
    { id: 2, name: 'Project' },
    { id: 3, name: 'Company' }
    // ...more
  ];

  resultUnits: ResultUnit[] = [
    { id: '0', text: 'Group of Companies' },
    { id: '01', text: 'Ålesund' },
    { id: '02', text: 'Oslo' }
    // ...more
  ];

  /* Dimension handlers */
  createDimension() {/* open modal */}
  editDimension(dim: Dimension) {/* edit modal */}
  deleteDimension(dim: Dimension) {/* confirm & delete */}

  /* Result unit handlers */
  createResultUnit() {/* open modal */}
  editResultUnit(ru: ResultUnit) {/* edit modal */}
  deleteResultUnit(ru: ResultUnit) {/* confirm & delete */}

  /* Top buttons */
  openDimTree() {/* open dimension tree modal */}
  process() {/* trigger processing */}
} 