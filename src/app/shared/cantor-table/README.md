# Cantor Table - Excel-like Angular Data Grid

A powerful, production-ready data grid component for Angular 17+ with minimal dependencies. Built using only Angular core and CDK, providing Excel-like functionality including sorting, filtering, column management, cell editing, and more.

## Features

✅ **Sorting**: Single & multi-column sorting with ternary states (asc → desc → none)  
✅ **Filtering**: Per-column filters (text/number/date) + global quick search  
✅ **Column Operations**: Resize, reorder, show/hide, pin left  
✅ **Selection**: Row and cell selection with keyboard navigation  
✅ **Editing**: In-cell editing with multiple editor types  
✅ **Clipboard**: Copy/paste TSV data  
✅ **Export**: CSV export with current view state  
✅ **Virtualization**: Virtual scrolling or pagination  
✅ **State Management**: Export/import grid state  
✅ **Accessibility**: Full ARIA support and keyboard navigation  
✅ **Responsive**: Mobile-friendly design  

## Dependencies

- `@angular/core` (17+)
- `@angular/common`
- `@angular/forms`
- `@angular/cdk` (table, scrolling, overlay, drag-drop, a11y)

**No third-party table libraries required!**

## Installation

1. Copy the `cantor-table` folder to your `src/app/shared/` directory
2. Import the component where needed:

```typescript
import { CantorTableComponent } from './shared/cantor-table/cantor-table.component';

@Component({
  imports: [CantorTableComponent],
  // ...
})
export class MyComponent {
  // ...
}
```

## Basic Usage

### Simple Table

```html
<cantor-table
  [rows]="data"
  [columns]="columns"
  [height]="'500px'"
  (selectionChange)="onSelectionChange($event)"
  (cellEdited)="onCellEdit($event)">
</cantor-table>
```

```typescript
export class MyComponent {
  data = [
    { id: 1, name: 'John Doe', email: 'john@example.com', active: true, salary: 50000 },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', active: false, salary: 60000 },
    // ... more data
  ];

  columns = [
    { 
      field: 'id', 
      header: 'ID', 
      width: 80, 
      sortable: true, 
      filter: 'number',
      pinnedLeft: true 
    },
    { 
      field: 'name', 
      header: 'Full Name', 
      width: 200, 
      filter: 'text',
      editable: true 
    },
    { 
      field: 'email', 
      header: 'Email Address', 
      width: 250, 
      filter: 'text',
      editable: true,
      editor: 'text'
    },
    { 
      field: 'active', 
      header: 'Active', 
      width: 100, 
      filter: false,
      editable: true,
      editor: 'checkbox'
    },
    { 
      field: 'salary', 
      header: 'Salary', 
      width: 120, 
      filter: 'number',
      editable: true,
      editor: 'number'
    }
  ];

  onSelectionChange(selectedRows: any[]) {
    console.log('Selected rows:', selectedRows);
  }

  onCellEdit(event: any) {
    console.log('Cell edited:', event);
    // Handle the edit - update your data source
  }
}
```

## Column Configuration

```typescript
interface CantorColumn<T = any> {
  field: keyof T | string;        // Property path (supports nested: 'user.name')
  header?: string;                // Display header text
  width?: number;                 // Column width in pixels
  minWidth?: number;              // Minimum width (default: 50)
  maxWidth?: number;              // Maximum width (default: 500)
  sortable?: boolean;             // Enable sorting (default: true)
  filter?: false | 'text' | 'number' | 'date';  // Filter type (default: 'text')
  editable?: boolean;             // Enable editing (default: false)
  editor?: 'text' | 'number' | 'date' | 'select' | 'checkbox';  // Editor type
  options?: Array<{label: string; value: any}>;  // Options for select editor
  pinnedLeft?: boolean;           // Pin to left side (default: false)
  hidden?: boolean;               // Hide column (default: false)
}
```

## Advanced Features

### Column Editors

```typescript
columns = [
  // Text editor
  { field: 'name', editable: true, editor: 'text' },
  
  // Number editor
  { field: 'age', editable: true, editor: 'number' },
  
  // Date editor
  { field: 'birthDate', editable: true, editor: 'date' },
  
  // Select dropdown
  { 
    field: 'status', 
    editable: true, 
    editor: 'select',
    options: [
      { label: 'Active', value: 'active' },
      { label: 'Inactive', value: 'inactive' },
      { label: 'Pending', value: 'pending' }
    ]
  },
  
  // Checkbox
  { field: 'verified', editable: true, editor: 'checkbox' }
];
```

### Filtering

```html
<!-- The table automatically shows filter inputs based on column configuration -->
<cantor-table
  [rows]="data"
  [columns]="columns"
  [quickFilterText]="globalSearch"
  (filterChanged)="onFiltersChange($event)">
</cantor-table>
```

```typescript
// Text filters support: contains, equals, startsWith, endsWith, notContains
// Number filters support: =, !=, >, >=, <, <=, between
// Date filters support: =, !=, >, >=, <, <=, between

onFiltersChange(filters: Record<string, any>) {
  console.log('Active filters:', filters);
}
```

### Selection Modes

```html
<!-- No selection -->
<cantor-table [selection]="'none'" ...>

<!-- Single row selection -->
<cantor-table [selection]="'single'" ...>

<!-- Multiple row selection (default) -->
<cantor-table [selection]="'multiple'" ...>

<!-- Enable cell selection -->
<cantor-table [enableCellSelection]="true" ...>
```

### Virtual Scrolling vs Pagination

```html
<!-- Virtual scrolling (default) -->
<cantor-table [mode]="'virtual'" [height]="'400px'" ...>

<!-- Pagination -->
<cantor-table [mode]="'paged'" [pageSize]="25" ...>
```

### State Management

```typescript
@ViewChild(CantorTableComponent) table!: CantorTableComponent;

// Save state
saveTableState() {
  const state = this.table.getApi().getState();
  localStorage.setItem('tableState', JSON.stringify(state));
}

// Restore state
restoreTableState() {
  const saved = localStorage.getItem('tableState');
  if (saved) {
    const state = JSON.parse(saved);
    this.table.getApi().setState(state);
  }
}

// Or use the state input
<cantor-table [state]="savedState" ...>
```

## API Methods

Access the table API using ViewChild:

```typescript
@ViewChild(CantorTableComponent) table!: CantorTableComponent;

ngAfterViewInit() {
  const api = this.table.getApi();
  
  // Auto-size all columns
  api.autoSizeColumns();
  
  // Auto-size specific columns
  api.autoSizeColumns(['name', 'email']);
  
  // Get selected rows
  const selected = api.getSelectedRows();
  
  // Set quick filter
  api.setQuickFilter('search term');
  
  // Clear all filters
  api.clearFilters();
  
  // Set specific filter
  api.setFilter('name', { op: 'contains', value: 'John' });
  
  // Export CSV
  api.exportCsv('my-data.csv');
  
  // Copy selection to clipboard
  api.copySelection();
  
  // Paste from clipboard
  api.pasteFromClipboard();
  
  // Select all rows
  api.selectAll();
  
  // Clear selection
  api.clearSelection();
  
  // Focus specific cell
  api.focusCell(0, 1);
}
```

## Keyboard Navigation

- **Arrow Keys**: Navigate between cells
- **Enter**: Start editing focused cell
- **Escape**: Cancel editing
- **Tab**: Commit edit and move to next cell
- **Shift+Tab**: Commit edit and move to previous cell
- **Ctrl/Cmd+A**: Select all rows
- **Ctrl/Cmd+C**: Copy selection
- **Ctrl/Cmd+V**: Paste from clipboard

## Toolbar Customization

```html
<cantor-table [rows]="data" [columns]="columns">
  <!-- Left toolbar content -->
  <div slot="toolbar-left">
    <button (click)="addNew()">Add New</button>
    <button (click)="deleteSelected()">Delete</button>
  </div>
  
  <!-- Right toolbar content -->
  <div slot="toolbar-right">
    <button (click)="refresh()">Refresh</button>
    <span>{{ data.length }} total records</span>
  </div>
</cantor-table>
```

## Event Handling

```typescript
// Selection changes
onSelectionChange(selectedRows: any[]) {
  this.selectedCount = selectedRows.length;
}

// Cell editing
onCellEdit(event: CellEditEvent) {
  console.log('Edited:', {
    row: event.row,
    field: event.field,
    oldValue: event.oldValue,
    newValue: event.newValue
  });
  
  // Update your data source
  // this.updateRecord(event.row.id, event.field, event.newValue);
}

// Sorting changes
onSortChange(sortModel: SortModel[]) {
  console.log('Sort changed:', sortModel);
}

// Column changes (resize, reorder, visibility)
onColumnsChange(columns: CantorColumn[]) {
  console.log('Columns changed:', columns);
  // Optionally save column state
}
```

## Styling Customization

The table uses CSS custom properties for easy theming:

```css
cantor-table {
  --ct-primary-color: #3b82f6;
  --ct-border-color: #e5e7eb;
  --ct-header-bg: #f9fafb;
  --ct-row-hover-bg: #f9fafb;
  --ct-selected-bg: #eff6ff;
}
```

Or override specific classes:

```css
/* Custom header styling */
.ct-header-cell {
  background: linear-gradient(to bottom, #f8f9fa, #e9ecef);
  font-weight: bold;
}

/* Custom row styling */
.ct-row-selected {
  background: #e3f2fd !important;
  border-left: 3px solid #2196f3;
}
```

## Performance Tips

1. **Use trackBy functions** for large datasets
2. **Enable virtual scrolling** for 1000+ rows
3. **Limit visible columns** - hide unused columns
4. **Debounce filter inputs** for better performance
5. **Use OnPush change detection** in parent components

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Accessibility Features

- Full ARIA support with proper roles and labels
- Keyboard navigation
- Screen reader announcements
- High contrast mode support
- Focus management
- Reduced motion support

## Migration from Other Libraries

### From AG-Grid

```typescript
// AG-Grid style
columnDefs = [
  { field: 'name', sortable: true, filter: 'agTextColumnFilter' }
];

// Cantor Table equivalent
columns = [
  { field: 'name', sortable: true, filter: 'text' }
];
```

### From PrimeNG Table

```typescript
// PrimeNG style
<p-table [value]="data" [columns]="cols">

// Cantor Table equivalent
<cantor-table [rows]="data" [columns]="columns">
```

## Troubleshooting

### Common Issues

1. **Virtual scrolling not working**
   - Ensure container has fixed height
   - Check that `mode="virtual"` is set

2. **Columns not resizing**
   - Verify resize handles are visible
   - Check min/max width constraints

3. **Filtering not working**
   - Ensure filter type matches data type
   - Check filter operators are supported

4. **Performance issues**
   - Enable virtual scrolling for large datasets
   - Use OnPush change detection
   - Implement proper trackBy functions

### Debug Mode

Enable debug logging:

```typescript
// In development
if (!environment.production) {
  window['cantorTableDebug'] = true;
}
```

## Contributing

1. Follow Angular style guide
2. Add tests for new features
3. Update documentation
4. Ensure accessibility compliance

## License

This component is part of the Cantor project and follows the same licensing terms.

---

## Built with ❤️ for the Cantor project
