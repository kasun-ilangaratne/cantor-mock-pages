/**
 * Main Cantor Table Component - Excel-like data grid with minimal dependencies
 */

import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy,
  signal,
  computed,
  effect,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import { A11yModule } from '@angular/cdk/a11y';
import { DragDropModule, CdkDragDrop } from '@angular/cdk/drag-drop';
import { OverlayModule } from '@angular/cdk/overlay';

import {
  CantorColumn,
  CantorTableState,
  SortModel,
  FilterModel,
  CellPosition,
  CellEditEvent,
  SelectionMode,
  TableMode,
  CantorTableApi,
  InternalTableState,
  DEFAULT_COLUMN_CONFIG,
  FILTER_OPERATORS
} from './state';
import {
  buildComparator,
  applyFilters,
  toCsv,
  formatCellValue,
  coerceValue,
  calculateAutoWidth,
  deepClone,
  debounce
} from './utils';
import { ClipboardService } from './clipboard.service';
import { ResizeHandleDirective, ResizableColumnDirective } from './resize-handle.directive';
import { ColumnReorderService } from './drag-reorder.directive';
import { ColumnChooserComponent } from './column-chooser.component';

@Component({
  selector: 'cantor-table',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ScrollingModule,
    A11yModule,
    DragDropModule,
    OverlayModule,
    ResizeHandleDirective,
    ResizableColumnDirective,
    ColumnChooserComponent
  ],
  templateUrl: './cantor-table.component.html',
  styleUrl: './cantor-table.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CantorTableComponent<T = any> implements OnInit, OnDestroy {
  // Inputs
  @Input() rows: T[] = [];
  @Input() columns: CantorColumn<T>[] = [];
  @Input() height = '70vh';
  @Input() mode: TableMode = 'virtual';
  @Input() pageSize = 50;
  @Input() selection: SelectionMode = 'multiple';
  @Input() enableCellSelection = true;
  @Input() set quickFilterText(v: string | undefined) { 
    this.quickFilter.set(v ?? ''); 
  }
  @Input() set state(v: CantorTableState | null) { 
    if (v) this.loadState(v); 
  }

  // Outputs
  @Output() selectionChange = new EventEmitter<T[]>();
  @Output() cellEdited = new EventEmitter<CellEditEvent<T>>();
  @Output() sortChanged = new EventEmitter<SortModel[]>();
  @Output() filterChanged = new EventEmitter<Record<string, FilterModel>>();
  @Output() columnsChanged = new EventEmitter<CantorColumn<T>[]>();

  // ViewChild references
  @ViewChild(CdkVirtualScrollViewport) viewport?: CdkVirtualScrollViewport;
  @ViewChild('tableContainer') tableContainer?: ElementRef<HTMLDivElement>;

  // Signals for reactive state management
  quickFilter = signal('');
  sortModel = signal<SortModel[]>([]);
  filterModel = signal<Record<string, FilterModel>>({});
  columnModel = signal<CantorColumn<T>[]>([]);
  currentPage = signal(0);
  
  // Internal state
  internalState: InternalTableState = {
    selectedRowIndices: new Set(),
    selectedCells: [],
    editingCell: null,
    focusedCell: null,
    lastClickedRowIndex: null
  };

  // UI state
  showColumnChooser = signal(false);
  editingValue = signal('');
  
  // Computed values
  viewColumns = computed(() => {
    const cols = this.columnModel().filter(c => !c.hidden);
    ColumnReorderService.calculatePinnedOffsets(cols);
    return cols;
  });

  filteredRows = computed(() => {
    const q = this.quickFilter();
    const filters = this.filterModel();
    const cols = this.viewColumns();
    return applyFilters(this.rows, cols, filters, q);
  });

  sortedRows = computed(() => {
    const filtered = this.filteredRows();
    const sorts = this.sortModel();
    if (sorts.length === 0) return filtered;
    
    const comparator = buildComparator<T>(sorts);
    return [...filtered].sort(comparator);
  });

  viewRows = computed(() => {
    const sorted = this.sortedRows();
    if (this.mode === 'paged') {
      const start = this.currentPage() * this.pageSize;
      return sorted.slice(start, start + this.pageSize);
    }
    return sorted;
  });

  totalPages = computed(() => {
    if (this.mode !== 'paged') return 1;
    return Math.ceil(this.filteredRows().length / this.pageSize);
  });

  // Debounced filter update
  private updateFiltersDebounced = debounce(() => {
    this.filterChanged.emit(this.filterModel());
  }, 300);

  constructor(
    private cdr: ChangeDetectorRef,
    private clipboardService: ClipboardService
  ) {
    // Set up reactive effects
    effect(() => {
      this.sortChanged.emit(this.sortModel());
    });

    effect(() => {
      this.updateFiltersDebounced();
    });

    effect(() => {
      this.columnsChanged.emit(this.columnModel());
    });
  }

  ngOnInit(): void {
    this.initializeColumns();
    this.setupKeyboardHandlers();
  }

  ngOnDestroy(): void {
    this.removeKeyboardHandlers();
  }

  // Column Management
  private initializeColumns(): void {
    const initialColumns = this.columns.map((col, index) => ({
      ...DEFAULT_COLUMN_CONFIG,
      ...col,
      order: col.order ?? index
    }));
    this.columnModel.set(initialColumns);
  }

  // Sorting
  toggleSort(column: CantorColumn<T>, event?: MouseEvent): void {
    if (!column.sortable) return;

    const field = column.field as string;
    const currentSorts = [...this.sortModel()];
    const existingIndex = currentSorts.findIndex(s => s.field === field);
    
    if (event?.shiftKey || event?.ctrlKey) {
      // Multi-column sort
      if (existingIndex >= 0) {
        const existing = currentSorts[existingIndex];
        if (existing.dir === 'asc') {
          currentSorts[existingIndex] = { field, dir: 'desc' };
        } else {
          currentSorts.splice(existingIndex, 1); // Remove sort
        }
      } else {
        currentSorts.push({ field, dir: 'asc' });
      }
    } else {
      // Single column sort
      if (existingIndex >= 0) {
        const existing = currentSorts[existingIndex];
        if (existing.dir === 'asc') {
          this.sortModel.set([{ field, dir: 'desc' }]);
        } else {
          this.sortModel.set([]); // Clear sort
        }
      } else {
        this.sortModel.set([{ field, dir: 'asc' }]);
      }
    }
    
    if (event?.shiftKey || event?.ctrlKey) {
      this.sortModel.set(currentSorts);
    }
  }

  getSortIndicator(column: CantorColumn<T>): string {
    const field = column.field as string;
    const sort = this.sortModel().find(s => s.field === field);
    if (!sort) return '';
    
    const index = this.sortModel().findIndex(s => s.field === field);
    const indicator = sort.dir === 'asc' ? '↑' : '↓';
    return this.sortModel().length > 1 ? `${indicator}${index + 1}` : indicator;
  }

  getAriaSort(column: CantorColumn<T>): string | null {
    const field = column.field as string;
    const sort = this.sortModel().find(s => s.field === field);
    if (!sort) return null;
    return sort.dir === 'asc' ? 'ascending' : 'descending';
  }

  // Filtering
  setColumnFilter(field: string, operator: string, value: any, value2?: any): void {
    const filters = { ...this.filterModel() };
    
    if (value == null || value === '') {
      delete filters[field];
    } else {
      filters[field] = { op: operator, value, value2 };
    }
    
    this.filterModel.set(filters);
  }

  clearFilters(): void {
    this.filterModel.set({});
  }

  // Column Operations
  setColumnWidth(field: string, width: number): void {
    const columns = this.columnModel().map(col => 
      col.field === field ? { ...col, width } : col
    );
    this.columnModel.set(columns);
  }

  autoSizeColumn(field: string): void {
    const column = this.columnModel().find(c => c.field === field);
    if (!column) return;

    const headerText = column.header || String(column.field);
    const sampleValues = this.rows.slice(0, 100).map(row => 
      this.getCellValue(row, column)
    );
    
    const width = calculateAutoWidth(
      headerText, 
      sampleValues, 
      column.minWidth, 
      column.maxWidth
    );
    
    this.setColumnWidth(field, width);
  }

  onColumnReordered(event: CdkDragDrop<CantorColumn<T>[]>): void {
    const reordered = ColumnReorderService.reorderColumns(
      this.columnModel(),
      event.previousIndex,
      event.currentIndex
    );
    this.columnModel.set(reordered);
  }

  toggleColumnVisibility(field: string, visible: boolean): void {
    const columns = this.columnModel().map(col => 
      col.field === field ? { ...col, hidden: !visible } : col
    );
    this.columnModel.set(columns);
  }

  toggleColumnPin(field: string, pinned: boolean): void {
    const columns = this.columnModel().map(col => 
      col.field === field ? { ...col, pinnedLeft: pinned } : col
    );
    this.columnModel.set(columns);
  }

  // Selection
  onRowClick(rowIndex: number, event: MouseEvent): void {
    if (this.selection === 'none') return;

    const isCtrlOrCmd = event.ctrlKey || event.metaKey;
    const isShift = event.shiftKey;

    if (this.selection === 'single') {
      this.internalState.selectedRowIndices.clear();
      this.internalState.selectedRowIndices.add(rowIndex);
    } else {
      if (isShift && this.internalState.lastClickedRowIndex != null) {
        // Range selection
        const start = Math.min(this.internalState.lastClickedRowIndex, rowIndex);
        const end = Math.max(this.internalState.lastClickedRowIndex, rowIndex);
        
        if (!isCtrlOrCmd) {
          this.internalState.selectedRowIndices.clear();
        }
        
        for (let i = start; i <= end; i++) {
          this.internalState.selectedRowIndices.add(i);
        }
      } else if (isCtrlOrCmd) {
        // Toggle selection
        if (this.internalState.selectedRowIndices.has(rowIndex)) {
          this.internalState.selectedRowIndices.delete(rowIndex);
        } else {
          this.internalState.selectedRowIndices.add(rowIndex);
        }
      } else {
        // Single selection
        this.internalState.selectedRowIndices.clear();
        this.internalState.selectedRowIndices.add(rowIndex);
      }
    }

    this.internalState.lastClickedRowIndex = rowIndex;
    this.emitSelectionChange();
  }

  onCellClick(rowIndex: number, colIndex: number, event: MouseEvent): void {
    if (!this.enableCellSelection) {
      this.onRowClick(rowIndex, event);
      return;
    }

    this.internalState.focusedCell = { rowIndex, colIndex };
    
    // Handle cell selection logic here if needed
    this.cdr.markForCheck();
  }

  selectAll(): void {
    if (this.selection === 'none') return;
    
    this.internalState.selectedRowIndices.clear();
    for (let i = 0; i < this.viewRows().length; i++) {
      this.internalState.selectedRowIndices.add(i);
    }
    this.emitSelectionChange();
  }

  clearSelection(): void {
    this.internalState.selectedRowIndices.clear();
    this.internalState.selectedCells = [];
    this.emitSelectionChange();
  }

  private emitSelectionChange(): void {
    const selectedRows = Array.from(this.internalState.selectedRowIndices)
      .map(index => this.viewRows()[index])
      .filter(row => row != null);
    this.selectionChange.emit(selectedRows);
    this.cdr.markForCheck();
  }

  // Cell Editing
  startEdit(rowIndex: number, column: CantorColumn<T>): void {
    if (!column.editable) return;

    const row = this.viewRows()[rowIndex];
    if (!row) return;

    this.internalState.editingCell = { rowIndex, colIndex: this.viewColumns().indexOf(column) };
    const currentValue = this.getCellValue(row, column);
    this.editingValue.set(String(currentValue ?? ''));
    
    this.cdr.markForCheck();
    
    // Focus the input after change detection
    setTimeout(() => {
      const input = document.querySelector('.ct-cell-editor input, .ct-cell-editor select, .ct-cell-editor textarea') as HTMLInputElement;
      if (input) {
        input.focus();
        input.select();
      }
    });
  }

  commitEdit(): void {
    const editingCell = this.internalState.editingCell;
    if (!editingCell) return;

    const row = this.viewRows()[editingCell.rowIndex];
    const column = this.viewColumns()[editingCell.colIndex];
    if (!row || !column) return;

    const oldValue = this.getCellValue(row, column);
    const newValue = coerceValue(this.editingValue(), column.editor || 'text');

    if (newValue !== oldValue) {
      this.setCellValue(row, column, newValue);
      this.cellEdited.emit({
        row,
        rowIndex: editingCell.rowIndex,
        field: column.field as string,
        oldValue,
        newValue
      });
    }

    this.cancelEdit();
  }

  cancelEdit(): void {
    this.internalState.editingCell = null;
    this.editingValue.set('');
    this.cdr.markForCheck();
  }

  // Cell Value Operations
  getCellValue(row: T, column: CantorColumn<T>): any {
    const field = column.field as string;
    return field.split('.').reduce((obj: any, key: string) => obj?.[key], row);
  }

  setCellValue(row: T, column: CantorColumn<T>, value: any): void {
    const field = column.field as string;
    const keys = field.split('.');
    
    if (keys.length === 1) {
      (row as any)[keys[0]] = value;
    } else {
      let current = row as any;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
    }
  }

  displayCell(row: T, column: CantorColumn<T>): string {
    const value = this.getCellValue(row, column);
    return formatCellValue(value, column);
  }

  // Keyboard Handlers
  private setupKeyboardHandlers(): void {
    document.addEventListener('keydown', this.onKeyDown.bind(this));
  }

  private removeKeyboardHandlers(): void {
    document.removeEventListener('keydown', this.onKeyDown.bind(this));
  }

  private onKeyDown(event: KeyboardEvent): void {
    const focused = this.internalState.focusedCell;
    if (!focused || !this.enableCellSelection) return;

    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        this.moveFocus(focused.rowIndex - 1, focused.colIndex);
        break;
      case 'ArrowDown':
        event.preventDefault();
        this.moveFocus(focused.rowIndex + 1, focused.colIndex);
        break;
      case 'ArrowLeft':
        event.preventDefault();
        this.moveFocus(focused.rowIndex, focused.colIndex - 1);
        break;
      case 'ArrowRight':
        event.preventDefault();
        this.moveFocus(focused.rowIndex, focused.colIndex + 1);
        break;
      case 'Enter':
        if (!this.internalState.editingCell) {
          event.preventDefault();
          const column = this.viewColumns()[focused.colIndex];
          this.startEdit(focused.rowIndex, column);
        }
        break;
      case 'Escape':
        if (this.internalState.editingCell) {
          event.preventDefault();
          this.cancelEdit();
        }
        break;
      case 'Tab':
        if (this.internalState.editingCell) {
          event.preventDefault();
          this.commitEdit();
          this.moveFocus(focused.rowIndex, focused.colIndex + (event.shiftKey ? -1 : 1));
        }
        break;
    }
  }

  private moveFocus(rowIndex: number, colIndex: number): void {
    const maxRow = this.viewRows().length - 1;
    const maxCol = this.viewColumns().length - 1;
    
    const newRowIndex = Math.max(0, Math.min(maxRow, rowIndex));
    const newColIndex = Math.max(0, Math.min(maxCol, colIndex));
    
    this.internalState.focusedCell = { rowIndex: newRowIndex, colIndex: newColIndex };
    this.cdr.markForCheck();
  }

  // Clipboard Operations
  async copySelection(): Promise<void> {
    const selectedIndices = Array.from(this.internalState.selectedRowIndices);
    if (selectedIndices.length > 0) {
      await this.clipboardService.copyRows(this.viewRows(), this.viewColumns(), selectedIndices);
    }
  }

  async pasteFromClipboard(): Promise<void> {
    const focused = this.internalState.focusedCell;
    if (!focused) return;

    await this.clipboardService.pasteIntoTable(
      this.viewRows(),
      this.viewColumns(),
      focused.rowIndex,
      focused.colIndex,
      (rowIndex, field, oldValue, newValue) => {
        const row = this.viewRows()[rowIndex];
        this.cellEdited.emit({ row, rowIndex, field, oldValue, newValue });
      }
    );
  }

  // Export
  exportCsv(filename = 'cantor-table-export.csv'): void {
    const csv = toCsv(this.viewRows(), this.viewColumns());
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  }

  // State Management
  getState(): CantorTableState {
    return {
      columns: this.columnModel().map(col => ({
        field: col.field as string,
        width: col.width,
        order: col.order || 0,
        hidden: col.hidden,
        pinnedLeft: col.pinnedLeft
      })),
      sort: this.sortModel(),
      filters: this.filterModel(),
      quickFilter: this.quickFilter(),
      pageSize: this.pageSize,
      currentPage: this.currentPage()
    };
  }

  loadState(state: CantorTableState): void {
    if (state.sort) this.sortModel.set(state.sort);
    if (state.filters) this.filterModel.set(state.filters);
    if (state.quickFilter) this.quickFilter.set(state.quickFilter);
    if (state.currentPage) this.currentPage.set(state.currentPage);
    
    if (state.columns) {
      const updatedColumns = this.columnModel().map(col => {
        const stateCol = state.columns.find(sc => sc.field === col.field);
        if (stateCol) {
          return {
            ...col,
            width: stateCol.width ?? col.width,
            order: stateCol.order,
            hidden: stateCol.hidden ?? col.hidden,
            pinnedLeft: stateCol.pinnedLeft ?? col.pinnedLeft
          };
        }
        return col;
      });
      this.columnModel.set(updatedColumns);
    }
  }

  // Public API
  getApi(): CantorTableApi<T> {
    return {
      autoSizeColumns: (fields?: string[]) => {
        const fieldsToResize = fields || this.viewColumns().map(c => c.field as string);
        fieldsToResize.forEach(field => this.autoSizeColumn(field));
      },
      getSelectedRows: () => Array.from(this.internalState.selectedRowIndices)
        .map(index => this.viewRows()[index])
        .filter(row => row != null),
      setQuickFilter: (text: string) => this.quickFilter.set(text),
      clearFilters: () => this.clearFilters(),
      setFilter: (field: string, model: FilterModel | null) => {
        if (model) {
          this.setColumnFilter(field, model.op, model.value, model.value2);
        } else {
          this.setColumnFilter(field, '', null);
        }
      },
      getState: () => this.getState(),
      setState: (state: CantorTableState) => this.loadState(state),
      exportCsv: (filename?: string) => this.exportCsv(filename),
      copySelection: () => this.copySelection(),
      pasteFromClipboard: () => this.pasteFromClipboard(),
      selectAll: () => this.selectAll(),
      clearSelection: () => this.clearSelection(),
      focusCell: (rowIndex: number, colIndex: number) => {
        this.internalState.focusedCell = { rowIndex, colIndex };
        this.cdr.markForCheck();
      }
    };
  }

  // Track functions for ngFor
  trackRow = (index: number, row: T): any => index;
  trackColumn = (index: number, col: CantorColumn<T>): any => col.field;

  // Pagination
  goToPage(page: number): void {
    this.currentPage.set(Math.max(0, Math.min(this.totalPages() - 1, page)));
  }

  nextPage(): void {
    this.goToPage(this.currentPage() + 1);
  }

  prevPage(): void {
    this.goToPage(this.currentPage() - 1);
  }

  // Helper methods for template
  isRowSelected(index: number): boolean {
    return this.internalState.selectedRowIndices.has(index);
  }

  isCellEditing(rowIndex: number, colIndex: number): boolean {
    const editing = this.internalState.editingCell;
    return editing?.rowIndex === rowIndex && editing?.colIndex === colIndex;
  }

  isCellFocused(rowIndex: number, colIndex: number): boolean {
    const focused = this.internalState.focusedCell;
    return focused?.rowIndex === rowIndex && focused?.colIndex === colIndex;
  }

  getFilterOperators(filterType: string) {
    return FILTER_OPERATORS[filterType as keyof typeof FILTER_OPERATORS] || [];
  }

  // Helper methods for template
  getFilterCount(): number {
    return Object.keys(this.filterModel()).length;
  }

  getSelectedCount(): number {
    return this.internalState.selectedRowIndices.size;
  }

  hasFilters(): boolean {
    return this.viewColumns().some(col => col.filter !== false);
  }

  // Make Math and Array available in template
  Math = Math;
  Array = Array;

  // Helper methods for template type safety
  getFieldAsString(field: keyof T | string): string {
    return field as string;
  }

  onCheckboxChange(event: Event, rowIndex: number): void {
    const target = event.target as HTMLInputElement;
    const mouseEvent = new MouseEvent('click', {
      ctrlKey: (event as any).ctrlKey,
      shiftKey: (event as any).shiftKey,
      metaKey: (event as any).metaKey
    });
    this.onRowClick(rowIndex, mouseEvent);
  }

  getColumnAriaLabel(column: CantorColumn<T>): string {
    const header = column.header || String(column.field);
    const sortIndicator = this.getSortIndicator(column);
    const ariaSort = this.getAriaSort(column);
    return header + (sortIndicator ? ` - sorted ${ariaSort}` : '');
  }

  getFilterAriaLabel(column: CantorColumn<T>): string {
    return `Filter ${column.header || String(column.field)}`;
  }

  onNumberFilterChange(field: string, operator: string, value1: string, value2?: string): void {
    this.setColumnFilter(field, operator, value1, value2 || null);
  }

  onDateFilterChange(field: string, operator: string, value1: string, value2?: string): void {
    this.setColumnFilter(field, operator, value1, value2 || null);
  }

  isEditingValueTrue(): boolean {
    const value = this.editingValue();
    return value === 'true' || value === 'True' || value === '1' || String(value) === 'true';
  }
}
