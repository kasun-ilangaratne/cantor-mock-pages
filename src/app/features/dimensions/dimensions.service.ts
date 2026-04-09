import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { 
  Dimension, 
  DimensionValue, 
  CreateDimensionRequest,
  UpdateDimensionRequest,
  CreateDimensionValueRequest,
  UpdateDimensionValueRequest,
  MAX_DIMENSIONS,
  GROUP_OF_COMPANIES_ID
} from './models';

@Injectable({
  providedIn: 'root'
})
export class DimensionsService {
  
  private dimensions: Dimension[] = [
    { id: 1, name: 'Department' },
    { id: 2, name: 'Project' },
    { id: 3, name: 'Company' },
    { id: 4, name: 'Location' },
    { id: 5, name: 'Product' }
  ];

  private dimensionValues: DimensionValue[] = [
    { id: GROUP_OF_COMPANIES_ID, dimensionId: 1, text: 'Group of Companies' },
    { id: '01', dimensionId: 1, text: 'Engineering' },
    { id: '02', dimensionId: 1, text: 'Marketing' },
    { id: '03', dimensionId: 1, text: 'Sales' },
    { id: '01', dimensionId: 2, text: 'Project Alpha' },
    { id: '02', dimensionId: 2, text: 'Project Beta' },
    { id: '03', dimensionId: 2, text: 'Project Gamma' },
    { id: '01', dimensionId: 3, text: 'Ålesund' },
    { id: '02', dimensionId: 3, text: 'Oslo' },
    { id: '03', dimensionId: 3, text: 'Bergen' },
    { id: '01', dimensionId: 4, text: 'Headquarters' },
    { id: '02', dimensionId: 4, text: 'Branch Office' },
    { id: '01', dimensionId: 5, text: 'Software' },
    { id: '02', dimensionId: 5, text: 'Hardware' }
  ];

  // Dimension CRUD operations
  getDimensions(): Observable<Dimension[]> {
    return of([...this.dimensions]);
  }

  getDimension(id: number): Observable<Dimension | undefined> {
    const dimension = this.dimensions.find(d => d.id === id);
    return of(dimension);
  }

  addDimension(request: CreateDimensionRequest): Observable<Dimension> {
    // Business rule: Max 11 dimensions
    if (this.dimensions.length >= MAX_DIMENSIONS) {
      return throwError(() => new Error(`Maximum of ${MAX_DIMENSIONS} dimensions allowed`));
    }

    // Business rule: Unique names
    if (this.dimensions.some(d => d.name.toLowerCase() === request.name.toLowerCase())) {
      return throwError(() => new Error('Dimension name must be unique'));
    }

    const newDimension: Dimension = {
      id: Math.max(...this.dimensions.map(d => d.id)) + 1,
      name: request.name.trim()
    };

    this.dimensions.push(newDimension);
    return of(newDimension);
  }

  updateDimension(request: UpdateDimensionRequest): Observable<Dimension> {
    const index = this.dimensions.findIndex(d => d.id === request.id);
    if (index === -1) {
      return throwError(() => new Error('Dimension not found'));
    }

    // Business rule: Unique names (excluding current dimension)
    if (this.dimensions.some(d => d.id !== request.id && d.name.toLowerCase() === request.name.toLowerCase())) {
      return throwError(() => new Error('Dimension name must be unique'));
    }

    this.dimensions[index] = { ...this.dimensions[index], name: request.name.trim() };
    return of(this.dimensions[index]);
  }

  deleteDimension(id: number): Observable<void> {
    const index = this.dimensions.findIndex(d => d.id === id);
    if (index === -1) {
      return throwError(() => new Error('Dimension not found'));
    }

    // Business rule: Cannot delete if has values
    const hasValues = this.dimensionValues.some(v => v.dimensionId === id);
    if (hasValues) {
      return throwError(() => new Error('Cannot delete dimension with existing values'));
    }

    this.dimensions.splice(index, 1);
    return of(void 0);
  }

  // DimensionValue CRUD operations
  getValues(dimensionId: number): Observable<DimensionValue[]> {
    const values = this.dimensionValues.filter(v => v.dimensionId === dimensionId);
    return of([...values]);
  }

  getValue(id: string): Observable<DimensionValue | undefined> {
    const value = this.dimensionValues.find(v => v.id === id);
    return of(value);
  }

  addValue(request: CreateDimensionValueRequest): Observable<DimensionValue> {
    // Business rule: Dimension must exist
    if (!this.dimensions.some(d => d.id === request.dimensionId)) {
      return throwError(() => new Error('Dimension not found'));
    }

    // Business rule: Unique text within dimension
    const existingValues = this.dimensionValues.filter(v => v.dimensionId === request.dimensionId);
    if (existingValues.some(v => v.text.toLowerCase() === request.text.toLowerCase())) {
      return throwError(() => new Error('Value text must be unique within dimension'));
    }

    const newValue: DimensionValue = {
      id: this.generateValueId(request.dimensionId),
      dimensionId: request.dimensionId,
      text: request.text.trim()
    };

    this.dimensionValues.push(newValue);
    return of(newValue);
  }

  updateValue(request: UpdateDimensionValueRequest): Observable<DimensionValue> {
    const index = this.dimensionValues.findIndex(v => v.id === request.id);
    if (index === -1) {
      return throwError(() => new Error('Dimension value not found'));
    }

    // Business rule: Unique text within dimension (excluding current value)
    const existingValues = this.dimensionValues.filter(v => 
      v.dimensionId === request.dimensionId && v.id !== request.id
    );
    if (existingValues.some(v => v.text.toLowerCase() === request.text.toLowerCase())) {
      return throwError(() => new Error('Value text must be unique within dimension'));
    }

    this.dimensionValues[index] = { ...this.dimensionValues[index], text: request.text.trim() };
    return of(this.dimensionValues[index]);
  }

  deleteValue(id: string): Observable<void> {
    const index = this.dimensionValues.findIndex(v => v.id === id);
    if (index === -1) {
      return throwError(() => new Error('Dimension value not found'));
    }

    this.dimensionValues.splice(index, 1);
    return of(void 0);
  }

  // Export operations (stub implementations)
  exportToPDF(): Observable<string> {
    return of('dimensions-export.pdf');
  }

  exportToExcel(): Observable<string> {
    return of('dimensions-export.xlsx');
  }

  // Helper methods
  private generateValueId(dimensionId: number): string {
    const existingIds = this.dimensionValues
      .filter(v => v.dimensionId === dimensionId)
      .map(v => v.id)
      .filter(id => id !== GROUP_OF_COMPANIES_ID);
    
    if (existingIds.length === 0) {
      return '01';
    }

    const maxId = Math.max(...existingIds.map(id => parseInt(id)));
    return (maxId + 1).toString().padStart(2, '0');
  }

  // Business rule checks
  canAddDimension(): Observable<boolean> {
    return of(this.dimensions.length < MAX_DIMENSIONS);
  }

  isGroupOfCompanies(value: DimensionValue): boolean {
    return value.id === GROUP_OF_COMPANIES_ID;
  }
} 