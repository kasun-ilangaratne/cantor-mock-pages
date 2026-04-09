/**
 * State models and interfaces for the Cantor Table component
 */

export type FilterKind = 'text' | 'number' | 'date';
export type CellEditor = 'text' | 'number' | 'date' | 'select' | 'checkbox';
export type SortDirection = 'asc' | 'desc';
export type SelectionMode = 'none' | 'single' | 'multiple';
export type TableMode = 'virtual' | 'paged';

export interface CantorColumn<T = any> {
  field: keyof T | string;
  header?: string;
  width?: number;         // px
  minWidth?: number;      // px, default 50
  maxWidth?: number;      // px, default 500
  sortable?: boolean;     // default true
  filter?: false | FilterKind; // default 'text'
  editable?: boolean;     // default false
  editor?: CellEditor;    // default 'text'
  options?: Array<{label: string; value: any}>; // for select editor
  pinnedLeft?: boolean;   // default false
  hidden?: boolean;       // default false
  order?: number;         // internal: column order
  _left?: number;         // internal: computed left offset for pinned columns
}

export interface SortModel {
  field: string;
  dir: SortDirection;
}

export interface FilterModel {
  op: string;
  value: any;
  value2?: any; // for between operations
}

export interface CellPosition {
  rowIndex: number;
  colIndex: number;
}

export interface CellEditEvent<T = any> {
  row: T;
  rowIndex: number;
  field: string;
  oldValue: any;
  newValue: any;
}

export interface CantorTableState {
  columns: Array<{
    field: string;
    width?: number;
    order: number;
    hidden?: boolean;
    pinnedLeft?: boolean;
  }>;
  sort: SortModel[];
  filters: Record<string, FilterModel>;
  quickFilter?: string;
  pageSize?: number;
  currentPage?: number;
}

export interface CantorTableInput<T = any> {
  rows: T[];
  columns: CantorColumn<T>[];
  height?: string;            // e.g., '70vh'
  mode?: TableMode;           // default 'virtual'
  pageSize?: number;          // for paged mode, default 50
  selection?: SelectionMode;  // default 'multiple'
  enableCellSelection?: boolean; // default true
  quickFilterText?: string;
  state?: CantorTableState | null; // initial state restore
}

export interface CantorTableApi<T = any> {
  autoSizeColumns(fields?: string[]): void;
  getSelectedRows(): T[];
  setQuickFilter(text: string): void;
  clearFilters(): void;
  setFilter(field: string, model: FilterModel | null): void;
  getState(): CantorTableState;
  setState(state: CantorTableState): void;
  exportCsv(filename?: string): void;
  copySelection(): void;
  pasteFromClipboard(): Promise<void>;
  selectAll(): void;
  clearSelection(): void;
  focusCell(rowIndex: number, colIndex: number): void;
}

// Internal state for tracking selection and editing
export interface InternalTableState {
  selectedRowIndices: Set<number>;
  selectedCells: CellPosition[];
  editingCell: CellPosition | null;
  focusedCell: CellPosition | null;
  lastClickedRowIndex: number | null;
}

// Default column configuration
export const DEFAULT_COLUMN_CONFIG: Partial<CantorColumn> = {
  width: 120,
  minWidth: 50,
  maxWidth: 500,
  sortable: true,
  filter: 'text',
  editable: false,
  editor: 'text',
  pinnedLeft: false,
  hidden: false
};

// Filter operators by type
export const FILTER_OPERATORS = {
  text: [
    { value: 'contains', label: 'Contains' },
    { value: 'equals', label: 'Equals' },
    { value: 'startsWith', label: 'Starts with' },
    { value: 'endsWith', label: 'Ends with' },
    { value: 'notContains', label: 'Does not contain' },
    { value: 'isEmpty', label: 'Is empty' },
    { value: 'isNotEmpty', label: 'Is not empty' }
  ],
  number: [
    { value: '=', label: 'Equals' },
    { value: '!=', label: 'Not equals' },
    { value: '>', label: 'Greater than' },
    { value: '>=', label: 'Greater than or equal' },
    { value: '<', label: 'Less than' },
    { value: '<=', label: 'Less than or equal' },
    { value: 'between', label: 'Between' }
  ],
  date: [
    { value: '=', label: 'On' },
    { value: '!=', label: 'Not on' },
    { value: '>', label: 'After' },
    { value: '>=', label: 'On or after' },
    { value: '<', label: 'Before' },
    { value: '<=', label: 'On or before' },
    { value: 'between', label: 'Between' }
  ]
};
