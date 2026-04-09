/**
 * Utility functions for sorting, filtering, CSV export, and data manipulation
 */

import { CantorColumn, SortModel, FilterModel } from './state';

/**
 * Build a comparator function from sort models
 */
export function buildComparator<T>(sortModels: SortModel[]): (a: T, b: T) => number {
  if (sortModels.length === 0) {
    return () => 0;
  }

  return (a: T, b: T): number => {
    for (const sort of sortModels) {
      const aVal = getNestedValue(a, sort.field);
      const bVal = getNestedValue(b, sort.field);
      const comparison = compareValues(aVal, bVal);
      
      if (comparison !== 0) {
        return sort.dir === 'asc' ? comparison : -comparison;
      }
    }
    return 0;
  };
}

/**
 * Compare two values with proper type handling
 */
function compareValues(a: any, b: any): number {
  // Handle null/undefined
  if (a == null && b == null) return 0;
  if (a == null) return -1;
  if (b == null) return 1;

  // Convert to comparable types
  const aComp = toComparable(a);
  const bComp = toComparable(b);

  if (aComp < bComp) return -1;
  if (aComp > bComp) return 1;
  return 0;
}

/**
 * Convert value to comparable format
 */
function toComparable(value: any): any {
  if (value == null) return '';
  if (typeof value === 'string') return value.toLowerCase();
  if (value instanceof Date) return value.getTime();
  if (typeof value === 'boolean') return value ? 1 : 0;
  return value;
}

/**
 * Get nested property value from object
 */
function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

/**
 * Apply filters to rows
 */
export function applyFilters<T>(
  rows: T[],
  columns: CantorColumn<T>[],
  filterModel: Record<string, FilterModel>,
  quickFilter: string
): T[] {
  let filtered = rows;

  // Apply column filters
  for (const [field, filter] of Object.entries(filterModel)) {
    if (!filter || filter.value == null) continue;
    
    const column = columns.find(c => c.field === field);
    if (!column) continue;

    filtered = filtered.filter(row => {
      const cellValue = getNestedValue(row, field);
      return applyColumnFilter(cellValue, filter, column.filter || 'text');
    });
  }

  // Apply quick filter
  if (quickFilter.trim()) {
    const searchTerm = quickFilter.toLowerCase();
    const visibleColumns = columns.filter(c => !c.hidden);
    
    filtered = filtered.filter(row => {
      return visibleColumns.some(col => {
        const value = getNestedValue(row, col.field as string);
        const stringValue = formatCellValue(value).toLowerCase();
        return stringValue.includes(searchTerm);
      });
    });
  }

  return filtered;
}

/**
 * Apply individual column filter
 */
function applyColumnFilter(cellValue: any, filter: FilterModel, filterType: string): boolean {
  const { op, value, value2 } = filter;

  if (filterType === 'text') {
    const cellStr = String(cellValue || '').toLowerCase();
    const filterStr = String(value || '').toLowerCase();

    switch (op) {
      case 'contains': return cellStr.includes(filterStr);
      case 'equals': return cellStr === filterStr;
      case 'startsWith': return cellStr.startsWith(filterStr);
      case 'endsWith': return cellStr.endsWith(filterStr);
      case 'notContains': return !cellStr.includes(filterStr);
      case 'isEmpty': return cellStr === '';
      case 'isNotEmpty': return cellStr !== '';
      default: return true;
    }
  }

  if (filterType === 'number') {
    const cellNum = parseFloat(cellValue);
    const filterNum = parseFloat(value);
    const filterNum2 = value2 != null ? parseFloat(value2) : null;

    if (isNaN(cellNum) || isNaN(filterNum)) return false;

    switch (op) {
      case '=': return cellNum === filterNum;
      case '!=': return cellNum !== filterNum;
      case '>': return cellNum > filterNum;
      case '>=': return cellNum >= filterNum;
      case '<': return cellNum < filterNum;
      case '<=': return cellNum <= filterNum;
      case 'between': 
        return filterNum2 != null && cellNum >= Math.min(filterNum, filterNum2) && cellNum <= Math.max(filterNum, filterNum2);
      default: return true;
    }
  }

  if (filterType === 'date') {
    const cellDate = new Date(cellValue);
    const filterDate = new Date(value);
    const filterDate2 = value2 ? new Date(value2) : null;

    if (isNaN(cellDate.getTime()) || isNaN(filterDate.getTime())) return false;

    const cellTime = cellDate.getTime();
    const filterTime = filterDate.getTime();
    const filterTime2 = filterDate2?.getTime();

    switch (op) {
      case '=': return isSameDay(cellDate, filterDate);
      case '!=': return !isSameDay(cellDate, filterDate);
      case '>': return cellTime > filterTime;
      case '>=': return cellTime >= filterTime;
      case '<': return cellTime < filterTime;
      case '<=': return cellTime <= filterTime;
      case 'between':
        return filterTime2 != null && cellTime >= Math.min(filterTime, filterTime2) && cellTime <= Math.max(filterTime, filterTime2);
      default: return true;
    }
  }

  return true;
}

/**
 * Check if two dates are on the same day
 */
function isSameDay(date1: Date, date2: Date): boolean {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
}

/**
 * Format cell value for display
 */
export function formatCellValue(value: any, column?: CantorColumn): string {
  if (value == null) return '';
  
  if (column?.editor === 'checkbox' || typeof value === 'boolean') {
    return value ? '✓' : '';
  }
  
  if (column?.editor === 'date' || value instanceof Date) {
    return value instanceof Date ? value.toLocaleDateString() : new Date(value).toLocaleDateString();
  }
  
  if (typeof value === 'number') {
    return value.toLocaleString();
  }
  
  return String(value);
}

/**
 * Convert rows to CSV format
 */
export function toCsv<T>(rows: T[], columns: CantorColumn<T>[]): string {
  const visibleColumns = columns.filter(c => !c.hidden);
  const headers = visibleColumns.map(c => c.header || String(c.field));
  const csvRows: string[] = [];

  // Add header row
  csvRows.push(headers.map(h => escapeCsvValue(h)).join(','));

  // Add data rows
  for (const row of rows) {
    const csvRow = visibleColumns.map(col => {
      const value = getNestedValue(row, col.field as string);
      const formatted = formatCellValue(value, col);
      return escapeCsvValue(formatted);
    });
    csvRows.push(csvRow.join(','));
  }

  return csvRows.join('\n');
}

/**
 * Escape CSV value according to RFC 4180
 */
function escapeCsvValue(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

/**
 * Parse TSV (Tab Separated Values) data
 */
export function parseTsv(tsvData: string): string[][] {
  if (!tsvData.trim()) return [];
  
  const lines = tsvData.split(/\r?\n/);
  return lines.map(line => line.split('\t'));
}

/**
 * Convert data to TSV format
 */
export function toTsv(data: string[][]): string {
  return data.map(row => row.join('\t')).join('\n');
}

/**
 * Coerce value to specific type
 */
export function coerceValue(value: any, type: string): any {
  if (value == null || value === '') return null;

  switch (type) {
    case 'number':
      const num = parseFloat(String(value));
      return isNaN(num) ? null : num;
    
    case 'date':
      const date = new Date(value);
      return isNaN(date.getTime()) ? null : date;
    
    case 'checkbox':
      if (typeof value === 'boolean') return value;
      if (typeof value === 'string') {
        const lower = value.toLowerCase();
        return lower === 'true' || lower === '1' || lower === 'yes' || lower === '✓';
      }
      return Boolean(value);
    
    case 'text':
    case 'select':
    default:
      return String(value);
  }
}

/**
 * Calculate column auto-size width
 */
export function calculateAutoWidth(
  headerText: string,
  sampleValues: any[],
  minWidth: number = 50,
  maxWidth: number = 500
): number {
  // Create temporary element to measure text
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  
  if (!context) return Math.max(headerText.length * 8 + 32, minWidth);

  context.font = '14px Arial'; // Approximate table font
  
  // Measure header
  let maxWidth_measured = context.measureText(headerText).width;
  
  // Measure sample values
  for (const value of sampleValues.slice(0, 10)) { // Sample first 10 values
    const text = formatCellValue(value);
    const width = context.measureText(text).width;
    maxWidth_measured = Math.max(maxWidth_measured, width);
  }
  
  // Add padding and constrain to bounds
  const calculatedWidth = maxWidth_measured + 32; // 16px padding on each side
  return Math.min(Math.max(calculatedWidth, minWidth), maxWidth);
}

/**
 * Deep clone object
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as any;
  if (Array.isArray(obj)) return obj.map(item => deepClone(item)) as any;
  
  const cloned = {} as T;
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  return cloned;
}

/**
 * Generate unique ID
 */
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: any;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(null, args), wait);
  };
}
