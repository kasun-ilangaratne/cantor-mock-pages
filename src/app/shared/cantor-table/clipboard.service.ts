/**
 * Clipboard service for copy/paste TSV functionality
 */

import { Injectable } from '@angular/core';
import { toTsv, parseTsv, formatCellValue, coerceValue } from './utils';
import { CantorColumn } from './state';

@Injectable({
  providedIn: 'root'
})
export class ClipboardService {

  /**
   * Copy text to clipboard
   */
  async copyText(text: string): Promise<void> {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for older browsers or non-secure contexts
        this.fallbackCopyText(text);
      }
    } catch (error) {
      console.warn('Failed to copy to clipboard:', error);
      this.fallbackCopyText(text);
    }
  }

  /**
   * Copy selected cells to clipboard as TSV
   */
  async copyCells<T>(
    rows: T[],
    columns: CantorColumn<T>[],
    selectedCells: Array<{ rowIndex: number; colIndex: number }>
  ): Promise<void> {
    if (selectedCells.length === 0) return;

    // Group cells by row
    const cellsByRow = new Map<number, Array<{ colIndex: number; value: string }>>();
    
    for (const cell of selectedCells) {
      if (!cellsByRow.has(cell.rowIndex)) {
        cellsByRow.set(cell.rowIndex, []);
      }
      
      const row = rows[cell.rowIndex];
      const column = columns[cell.colIndex];
      if (row && column) {
        const value = this.getCellValue(row, column);
        cellsByRow.get(cell.rowIndex)!.push({
          colIndex: cell.colIndex,
          value: formatCellValue(value, column)
        });
      }
    }

    // Convert to TSV format
    const tsvRows: string[] = [];
    const sortedRowIndices = Array.from(cellsByRow.keys()).sort((a, b) => a - b);
    
    for (const rowIndex of sortedRowIndices) {
      const cells = cellsByRow.get(rowIndex)!;
      cells.sort((a, b) => a.colIndex - b.colIndex);
      
      // Fill gaps with empty strings to maintain column alignment
      const rowValues: string[] = [];
      let lastColIndex = -1;
      
      for (const cell of cells) {
        // Fill gaps
        while (lastColIndex + 1 < cell.colIndex) {
          rowValues.push('');
          lastColIndex++;
        }
        rowValues.push(cell.value);
        lastColIndex = cell.colIndex;
      }
      
      tsvRows.push(rowValues.join('\t'));
    }

    await this.copyText(tsvRows.join('\n'));
  }

  /**
   * Copy selected rows to clipboard as TSV
   */
  async copyRows<T>(
    rows: T[],
    columns: CantorColumn<T>[],
    selectedRowIndices: number[]
  ): Promise<void> {
    if (selectedRowIndices.length === 0) return;

    const visibleColumns = columns.filter(c => !c.hidden);
    const tsvRows: string[] = [];

    // Add header row
    const headers = visibleColumns.map(c => c.header || String(c.field));
    tsvRows.push(headers.join('\t'));

    // Add selected data rows
    const sortedIndices = [...selectedRowIndices].sort((a, b) => a - b);
    for (const index of sortedIndices) {
      const row = rows[index];
      if (row) {
        const rowValues = visibleColumns.map(col => {
          const value = this.getCellValue(row, col);
          return formatCellValue(value, col);
        });
        tsvRows.push(rowValues.join('\t'));
      }
    }

    await this.copyText(tsvRows.join('\n'));
  }

  /**
   * Read text from clipboard
   */
  async readText(): Promise<string> {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        return await navigator.clipboard.readText();
      } else {
        throw new Error('Clipboard API not available');
      }
    } catch (error) {
      console.warn('Failed to read from clipboard:', error);
      return '';
    }
  }

  /**
   * Paste TSV data into table starting at specified position
   */
  async pasteIntoTable<T>(
    rows: T[],
    columns: CantorColumn<T>[],
    startRowIndex: number,
    startColIndex: number,
    onCellEdit: (rowIndex: number, field: string, oldValue: any, newValue: any) => void
  ): Promise<void> {
    try {
      const clipboardText = await this.readText();
      if (!clipboardText.trim()) return;

      const tsvData = parseTsv(clipboardText);
      if (tsvData.length === 0) return;

      const visibleColumns = columns.filter(c => !c.hidden && c.editable);
      
      // Apply pasted data
      for (let rowOffset = 0; rowOffset < tsvData.length; rowOffset++) {
        const targetRowIndex = startRowIndex + rowOffset;
        if (targetRowIndex >= rows.length) break;

        const pastedRow = tsvData[rowOffset];
        const targetRow = rows[targetRowIndex];

        for (let colOffset = 0; colOffset < pastedRow.length; colOffset++) {
          const targetColIndex = startColIndex + colOffset;
          if (targetColIndex >= visibleColumns.length) break;

          const column = visibleColumns[targetColIndex];
          if (!column || !column.editable) continue;

          const pastedValue = pastedRow[colOffset];
          const oldValue = this.getCellValue(targetRow, column);
          const newValue = coerceValue(pastedValue, column.editor || 'text');

          if (newValue !== oldValue) {
            // Update the row data
            this.setCellValue(targetRow, column, newValue);
            
            // Notify of the change
            onCellEdit(targetRowIndex, column.field as string, oldValue, newValue);
          }
        }
      }
    } catch (error) {
      console.warn('Failed to paste from clipboard:', error);
    }
  }

  /**
   * Fallback copy method for older browsers
   */
  private fallbackCopyText(text: string): void {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
    } catch (error) {
      console.warn('Fallback copy failed:', error);
    } finally {
      document.body.removeChild(textArea);
    }
  }

  /**
   * Get cell value from row using column field
   */
  private getCellValue<T>(row: T, column: CantorColumn<T>): any {
    const field = column.field as string;
    return field.split('.').reduce((obj: any, key: string) => obj?.[key], row);
  }

  /**
   * Set cell value in row using column field
   */
  private setCellValue<T>(row: T, column: CantorColumn<T>, value: any): void {
    const field = column.field as string;
    const keys = field.split('.');
    
    if (keys.length === 1) {
      (row as any)[keys[0]] = value;
    } else {
      // Handle nested properties
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

  /**
   * Check if clipboard API is available
   */
  isClipboardAvailable(): boolean {
    return !!(navigator.clipboard && window.isSecureContext);
  }

  /**
   * Copy table selection as formatted text (for display purposes)
   */
  async copySelectionAsText<T>(
    rows: T[],
    columns: CantorColumn<T>[],
    selectedRowIndices: number[]
  ): Promise<void> {
    if (selectedRowIndices.length === 0) return;

    const visibleColumns = columns.filter(c => !c.hidden);
    const lines: string[] = [];

    // Calculate column widths for alignment
    const colWidths = visibleColumns.map(col => {
      let maxWidth = (col.header || String(col.field)).length;
      for (const index of selectedRowIndices) {
        const row = rows[index];
        if (row) {
          const value = this.getCellValue(row, col);
          const formatted = formatCellValue(value, col);
          maxWidth = Math.max(maxWidth, formatted.length);
        }
      }
      return Math.min(maxWidth, 30); // Cap at 30 characters
    });

    // Add header
    const headerLine = visibleColumns.map((col, i) => {
      const header = col.header || String(col.field);
      return header.padEnd(colWidths[i]);
    }).join(' | ');
    lines.push(headerLine);

    // Add separator
    const separator = colWidths.map(width => '-'.repeat(width)).join('-+-');
    lines.push(separator);

    // Add data rows
    const sortedIndices = [...selectedRowIndices].sort((a, b) => a - b);
    for (const index of sortedIndices) {
      const row = rows[index];
      if (row) {
        const dataLine = visibleColumns.map((col, i) => {
          const value = this.getCellValue(row, col);
          const formatted = formatCellValue(value, col);
          return formatted.padEnd(colWidths[i]);
        }).join(' | ');
        lines.push(dataLine);
      }
    }

    await this.copyText(lines.join('\n'));
  }
}
