/**
 * Simple test component for quick Cantor Table testing
 */

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CantorTableComponent, CantorColumn } from './index';

@Component({
  selector: 'cantor-table-simple-test',
  standalone: true,
  imports: [CommonModule, CantorTableComponent],
  template: `
    <div style="padding: 20px;">
      <h2>Cantor Table - Quick Test</h2>
      
      <cantor-table
        [rows]="testData"
        [columns]="testColumns"
        [height]="'400px'"
        [selection]="'multiple'"
        (selectionChange)="onSelection($event)"
        (cellEdited)="onEdit($event)">
      </cantor-table>
      
      <div style="margin-top: 20px; padding: 15px; background: #f0f0f0; border-radius: 5px;">
        <strong>Test Results:</strong>
        <ul>
          <li>✅ Table renders: {{ testData.length }} rows</li>
          <li>✅ Columns: {{ testColumns.length }} configured</li>
          <li>✅ Selection: {{ selectedCount }} rows selected</li>
          <li>✅ Edits: {{ editCount }} cells edited</li>
        </ul>
      </div>
    </div>
  `
})
export class CantorTableSimpleTestComponent {
  selectedCount = 0;
  editCount = 0;

  testColumns: CantorColumn[] = [
    { field: 'id', header: 'ID', width: 80, filter: 'number' },
    { field: 'name', header: 'Name', width: 150, filter: 'text', editable: true },
    { field: 'email', header: 'Email', width: 200, filter: 'text', editable: true },
    { field: 'age', header: 'Age', width: 80, filter: 'number', editable: true, editor: 'number' },
    { field: 'active', header: 'Active', width: 100, editable: true, editor: 'checkbox' }
  ];

  testData = [
    { id: 1, name: 'John Doe', email: 'john@test.com', age: 30, active: true },
    { id: 2, name: 'Jane Smith', email: 'jane@test.com', age: 25, active: false },
    { id: 3, name: 'Bob Johnson', email: 'bob@test.com', age: 35, active: true },
    { id: 4, name: 'Alice Brown', email: 'alice@test.com', age: 28, active: true },
    { id: 5, name: 'Charlie Wilson', email: 'charlie@test.com', age: 42, active: false }
  ];

  onSelection(rows: any[]) {
    this.selectedCount = rows.length;
    console.log('Selected:', rows);
  }

  onEdit(event: any) {
    this.editCount++;
    console.log('Cell edited:', event);
  }
}
