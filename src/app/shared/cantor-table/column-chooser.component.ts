/**
 * Column chooser overlay component for showing/hiding and pinning columns
 */

import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  OnInit,
  signal,
  computed
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CantorColumn } from './state';

export interface ColumnToggleEvent {
  field: string;
  visible: boolean;
}

export interface ColumnPinEvent {
  field: string;
  pinned: boolean;
}

@Component({
  selector: 'cantor-column-chooser',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="ct-column-chooser" (click)="$event.stopPropagation()">
      <div class="ct-chooser-header">
        <h3>Column Settings</h3>
        <button 
          type="button" 
          class="ct-close-btn"
          (click)="close.emit()"
          aria-label="Close column chooser">
          ×
        </button>
      </div>
      
      <div class="ct-chooser-actions">
        <button 
          type="button" 
          class="ct-btn ct-btn-sm"
          (click)="showAll()">
          Show All
        </button>
        <button 
          type="button" 
          class="ct-btn ct-btn-sm"
          (click)="hideAll()">
          Hide All
        </button>
        <button 
          type="button" 
          class="ct-btn ct-btn-sm"
          (click)="resetToDefaults()">
          Reset
        </button>
      </div>

      <div class="ct-search-box">
        <input 
          type="text" 
          placeholder="Search columns..."
          [(ngModel)]="searchTerm"
          class="ct-search-input">
      </div>

      <div class="ct-column-list">
        <div 
          *ngFor="let col of filteredColumns(); trackBy: trackColumn"
          class="ct-column-item"
          [class.ct-column-hidden]="col.hidden">
          
          <div class="ct-column-main">
            <label class="ct-checkbox-label">
              <input 
                type="checkbox"
                [checked]="!col.hidden"
                (change)="onToggleColumn($event, col.field)"
                class="ct-checkbox">
              <span class="ct-column-name">{{ col.header || col.field }}</span>
            </label>
          </div>
          
          <div class="ct-column-actions">
            <button 
              type="button"
              class="ct-pin-btn"
              [class.ct-pin-active]="col.pinnedLeft"
              [disabled]="col.hidden"
              (click)="onTogglePin(col.field, !col.pinnedLeft)"
              [title]="col.pinnedLeft ? 'Unpin column' : 'Pin column to left'">
              📌
            </button>
          </div>
        </div>
      </div>

      <div class="ct-chooser-footer">
        <div class="ct-column-count">
          {{ visibleCount() }} of {{ columns.length }} columns visible
        </div>
      </div>
    </div>
    <div class="ct-chooser-backdrop" (click)="close.emit()"></div>
  `,
  styles: [`
    .ct-chooser-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.3);
      z-index: 999;
    }

    .ct-column-chooser {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      border-radius: 8px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
      width: 400px;
      max-width: 90vw;
      max-height: 80vh;
      z-index: 1000;
      display: flex;
      flex-direction: column;
    }

    .ct-chooser-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem;
      border-bottom: 1px solid #e5e7eb;
    }

    .ct-chooser-header h3 {
      margin: 0;
      font-size: 1.125rem;
      font-weight: 600;
      color: #111827;
    }

    .ct-close-btn {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: #6b7280;
      padding: 0.25rem;
      border-radius: 4px;
      line-height: 1;
      width: 2rem;
      height: 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .ct-close-btn:hover {
      background: #f3f4f6;
      color: #374151;
    }

    .ct-chooser-actions {
      display: flex;
      gap: 0.5rem;
      padding: 1rem;
      border-bottom: 1px solid #e5e7eb;
    }

    .ct-btn {
      padding: 0.375rem 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 4px;
      background: white;
      color: #374151;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .ct-btn:hover {
      background: #f9fafb;
      border-color: #9ca3af;
    }

    .ct-btn-sm {
      padding: 0.25rem 0.5rem;
      font-size: 0.75rem;
    }

    .ct-search-box {
      padding: 0 1rem 1rem;
    }

    .ct-search-input {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #d1d5db;
      border-radius: 4px;
      font-size: 0.875rem;
    }

    .ct-search-input:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 1px #3b82f6;
    }

    .ct-column-list {
      flex: 1;
      overflow-y: auto;
      padding: 0 1rem;
      max-height: 300px;
    }

    .ct-column-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.5rem 0;
      border-bottom: 1px solid #f3f4f6;
    }

    .ct-column-item:last-child {
      border-bottom: none;
    }

    .ct-column-hidden {
      opacity: 0.6;
    }

    .ct-column-main {
      flex: 1;
    }

    .ct-checkbox-label {
      display: flex;
      align-items: center;
      cursor: pointer;
      font-size: 0.875rem;
    }

    .ct-checkbox {
      margin-right: 0.5rem;
      cursor: pointer;
    }

    .ct-column-name {
      color: #374151;
    }

    .ct-column-actions {
      display: flex;
      gap: 0.25rem;
    }

    .ct-pin-btn {
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.25rem;
      border-radius: 3px;
      font-size: 0.875rem;
      opacity: 0.6;
      transition: all 0.15s ease;
    }

    .ct-pin-btn:hover:not(:disabled) {
      opacity: 1;
      background: #f3f4f6;
    }

    .ct-pin-btn:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }

    .ct-pin-active {
      opacity: 1;
      color: #3b82f6;
    }

    .ct-chooser-footer {
      padding: 1rem;
      border-top: 1px solid #e5e7eb;
      background: #f9fafb;
    }

    .ct-column-count {
      font-size: 0.75rem;
      color: #6b7280;
      text-align: center;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ColumnChooserComponent<T> implements OnInit {
  @Input() columns: CantorColumn<T>[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() toggle = new EventEmitter<ColumnToggleEvent>();
  @Output() pin = new EventEmitter<ColumnPinEvent>();

  searchTerm = signal('');

  filteredColumns = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) return this.columns;
    
    return this.columns.filter(col => {
      const header = (col.header || String(col.field)).toLowerCase();
      const field = String(col.field).toLowerCase();
      return header.includes(term) || field.includes(term);
    });
  });

  visibleCount = computed(() => {
    return this.columns.filter(col => !col.hidden).length;
  });

  ngOnInit(): void {
    // Focus search input on open
    setTimeout(() => {
      const searchInput = document.querySelector('.ct-search-input') as HTMLInputElement;
      if (searchInput) {
        searchInput.focus();
      }
    }, 100);
  }

  trackColumn(index: number, column: CantorColumn<T>): any {
    return column.field;
  }

  toggleColumn(field: string, visible: boolean): void {
    this.toggle.emit({ field, visible });
  }

  togglePin(field: string, pinned: boolean): void {
    this.pin.emit({ field, pinned });
  }

  showAll(): void {
    for (const column of this.columns) {
      if (column.hidden) {
        this.toggle.emit({ field: column.field as string, visible: true });
      }
    }
  }

  hideAll(): void {
    // Keep at least one column visible
    const visibleColumns = this.columns.filter(col => !col.hidden);
    if (visibleColumns.length <= 1) {
      return; // Don't hide all columns
    }

    for (const column of this.columns.slice(1)) { // Keep first column visible
      if (!column.hidden) {
        this.toggle.emit({ field: column.field as string, visible: false });
      }
    }
  }

  resetToDefaults(): void {
    for (const column of this.columns) {
      // Show all columns
      if (column.hidden) {
        this.toggle.emit({ field: column.field as string, visible: true });
      }
      
      // Unpin all columns except those that were originally pinned
      if (column.pinnedLeft) {
        this.pin.emit({ field: column.field as string, pinned: false });
      }
    }
  }

  onToggleColumn(event: Event, field: keyof T | string): void {
    const target = event.target as HTMLInputElement;
    this.toggleColumn(field as string, target.checked);
  }

  onTogglePin(field: keyof T | string, pinned: boolean): void {
    this.togglePin(field as string, pinned);
  }
}
