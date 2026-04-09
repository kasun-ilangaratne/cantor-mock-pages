/**
 * Cantor Table - Public API exports
 */

// Main component
export { CantorTableComponent } from './cantor-table.component';

// State and interfaces
export {
  CantorColumn,
  CantorTableState,
  CantorTableInput,
  CantorTableApi,
  SortModel,
  FilterModel,
  CellPosition,
  CellEditEvent,
  SelectionMode,
  TableMode,
  FilterKind,
  CellEditor,
  InternalTableState,
  DEFAULT_COLUMN_CONFIG,
  FILTER_OPERATORS
} from './state';

// Services
export { ClipboardService } from './clipboard.service';

// Directives
export { 
  ResizeHandleDirective, 
  ResizableColumnDirective 
} from './resize-handle.directive';

export { 
  DragReorderDirective,
  DraggableColumnDirective,
  DropZoneDirective,
  ColumnReorderService
} from './drag-reorder.directive';

// Components
export { 
  ColumnChooserComponent,
  ColumnToggleEvent,
  ColumnPinEvent
} from './column-chooser.component';

// Utilities
export {
  buildComparator,
  applyFilters,
  toCsv,
  parseTsv,
  toTsv,
  formatCellValue,
  coerceValue,
  calculateAutoWidth,
  deepClone,
  generateId,
  debounce
} from './utils';
