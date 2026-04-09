/**
 * Demo component to test the Cantor Table implementation
 */

import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CantorTableComponent, CantorColumn } from './index';

interface DemoData {
  id: number;
  name: string;
  email: string;
  age: number;
  salary: number;
  department: string;
  joinDate: Date;
  active: boolean;
  rating: number;
}

@Component({
  selector: 'cantor-table-demo',
  standalone: true,
  imports: [CommonModule, CantorTableComponent],
  template: `
    <div class="demo-container">
      <h2>Cantor Table Demo</h2>
      
      <div class="demo-controls">
        <button (click)="addRandomRow()">Add Random Row</button>
        <button (click)="removeSelectedRows()">Remove Selected</button>
        <button (click)="exportData()">Export CSV</button>
        <button (click)="saveState()">Save State</button>
        <button (click)="loadState()">Load State</button>
        <span class="selection-count">Selected: {{ selectedRows.length }} rows</span>
      </div>

      <cantor-table
        [rows]="data"
        [columns]="columns"
        [height]="'600px'"
        [mode]="'virtual'"
        [selection]="'multiple'"
        [enableCellSelection]="true"
        (selectionChange)="onSelectionChange($event)"
        (cellEdited)="onCellEdit($event)"
        (sortChanged)="onSortChange($event)"
        (filterChanged)="onFilterChange($event)"
        (columnsChanged)="onColumnsChange($event)">
        
        <div slot="toolbar-left">
          <button (click)="addRandomRow()">➕ Add</button>
          <button (click)="removeSelectedRows()" [disabled]="selectedRows.length === 0">🗑️ Delete</button>
        </div>
        
        <div slot="toolbar-right">
          <span>{{ data.length }} total records</span>
        </div>
      </cantor-table>

      <div class="demo-info">
        <h3>Demo Features</h3>
        <ul>
          <li>✅ Virtual scrolling with 1000+ rows</li>
          <li>✅ Column sorting (single and multi-column)</li>
          <li>✅ Column filtering (text, number, date)</li>
          <li>✅ Column resizing and reordering</li>
          <li>✅ In-cell editing with different editor types</li>
          <li>✅ Row and cell selection</li>
          <li>✅ Copy/paste functionality</li>
          <li>✅ CSV export</li>
          <li>✅ State persistence</li>
        </ul>
      </div>
    </div>
  `,
  styles: [`
    .demo-container {
      padding: 20px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .demo-controls {
      display: flex;
      gap: 10px;
      align-items: center;
      margin-bottom: 20px;
      padding: 15px;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .demo-controls button {
      padding: 8px 16px;
      border: 1px solid #ddd;
      border-radius: 4px;
      background: white;
      cursor: pointer;
      transition: all 0.2s;
    }

    .demo-controls button:hover:not(:disabled) {
      background: #e9ecef;
      border-color: #adb5bd;
    }

    .demo-controls button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .selection-count {
      margin-left: auto;
      font-weight: 500;
      color: #495057;
    }

    .demo-info {
      margin-top: 30px;
      padding: 20px;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .demo-info h3 {
      margin-top: 0;
      color: #495057;
    }

    .demo-info ul {
      columns: 2;
      column-gap: 30px;
    }

    .demo-info li {
      margin-bottom: 8px;
      break-inside: avoid;
    }

    h2 {
      color: #212529;
      margin-bottom: 20px;
    }
  `]
})
export class CantorTableDemoComponent {
  @ViewChild(CantorTableComponent) table!: CantorTableComponent<DemoData>;

  selectedRows: DemoData[] = [];
  
  columns: CantorColumn<DemoData>[] = [
    { 
      field: 'id', 
      header: 'ID', 
      width: 80, 
      sortable: true, 
      filter: 'number',
      pinnedLeft: true,
      editable: false
    },
    { 
      field: 'name', 
      header: 'Full Name', 
      width: 180, 
      filter: 'text',
      editable: true,
      editor: 'text'
    },
    { 
      field: 'email', 
      header: 'Email Address', 
      width: 220, 
      filter: 'text',
      editable: true,
      editor: 'text'
    },
    { 
      field: 'age', 
      header: 'Age', 
      width: 80, 
      filter: 'number',
      editable: true,
      editor: 'number'
    },
    { 
      field: 'department', 
      header: 'Department', 
      width: 140, 
      filter: 'text',
      editable: true,
      editor: 'select',
      options: [
        { label: 'Engineering', value: 'Engineering' },
        { label: 'Sales', value: 'Sales' },
        { label: 'Marketing', value: 'Marketing' },
        { label: 'HR', value: 'HR' },
        { label: 'Finance', value: 'Finance' }
      ]
    },
    { 
      field: 'salary', 
      header: 'Salary', 
      width: 120, 
      filter: 'number',
      editable: true,
      editor: 'number'
    },
    { 
      field: 'joinDate', 
      header: 'Join Date', 
      width: 130, 
      filter: 'date',
      editable: true,
      editor: 'date'
    },
    { 
      field: 'active', 
      header: 'Active', 
      width: 80, 
      filter: false,
      editable: true,
      editor: 'checkbox'
    },
    { 
      field: 'rating', 
      header: 'Performance', 
      width: 100, 
      filter: 'number',
      editable: true,
      editor: 'number'
    }
  ];

  data: DemoData[] = [];

  constructor() {
    this.generateSampleData(1000);
  }

  generateSampleData(count: number): void {
    const firstNames = ['John', 'Jane', 'Mike', 'Sarah', 'David', 'Lisa', 'Tom', 'Anna', 'Chris', 'Emma'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
    const departments = ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance'];
    
    this.data = Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      name: `${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}`,
      email: `user${i + 1}@company.com`,
      age: 22 + Math.floor(Math.random() * 40),
      department: departments[i % departments.length],
      salary: 40000 + Math.floor(Math.random() * 100000),
      joinDate: new Date(2020 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
      active: Math.random() > 0.2,
      rating: Math.round((3 + Math.random() * 2) * 10) / 10
    }));
  }

  addRandomRow(): void {
    const newId = Math.max(...this.data.map(d => d.id)) + 1;
    const departments = ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance'];
    const firstNames = ['Alex', 'Jordan', 'Casey', 'Morgan', 'Riley'];
    const lastNames = ['Taylor', 'Parker', 'Cooper', 'Reed', 'Bailey'];
    
    const newRow: DemoData = {
      id: newId,
      name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
      email: `newuser${newId}@company.com`,
      age: 25 + Math.floor(Math.random() * 35),
      department: departments[Math.floor(Math.random() * departments.length)],
      salary: 50000 + Math.floor(Math.random() * 80000),
      joinDate: new Date(),
      active: true,
      rating: Math.round((3.5 + Math.random() * 1.5) * 10) / 10
    };
    
    this.data = [...this.data, newRow];
  }

  removeSelectedRows(): void {
    const selectedIds = new Set(this.selectedRows.map(row => row.id));
    this.data = this.data.filter(row => !selectedIds.has(row.id));
    this.selectedRows = [];
  }

  exportData(): void {
    if (this.table) {
      this.table.getApi().exportCsv('cantor-demo-data.csv');
    }
  }

  saveState(): void {
    if (this.table) {
      const state = this.table.getApi().getState();
      localStorage.setItem('cantorTableDemoState', JSON.stringify(state));
      alert('Table state saved!');
    }
  }

  loadState(): void {
    const saved = localStorage.getItem('cantorTableDemoState');
    if (saved && this.table) {
      const state = JSON.parse(saved);
      this.table.getApi().setState(state);
      alert('Table state loaded!');
    } else {
      alert('No saved state found!');
    }
  }

  onSelectionChange(selectedRows: DemoData[]): void {
    this.selectedRows = selectedRows;
    console.log('Selection changed:', selectedRows.length, 'rows selected');
  }

  onCellEdit(event: any): void {
    console.log('Cell edited:', event);
    // Update the data array to reflect the change
    const rowIndex = this.data.findIndex(row => row.id === event.row.id);
    if (rowIndex >= 0) {
      (this.data[rowIndex] as any)[event.field] = event.newValue;
    }
  }

  onSortChange(sortModel: any[]): void {
    console.log('Sort changed:', sortModel);
  }

  onFilterChange(filterModel: any): void {
    console.log('Filter changed:', filterModel);
  }

  onColumnsChange(columns: CantorColumn<DemoData>[]): void {
    console.log('Columns changed:', columns.length, 'columns');
  }
}
