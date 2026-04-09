export interface Dimension { 
  id: number; // 1-11
  name: string; 
}

export interface DimensionValue { 
  id: string; // "0" for Group of Companies
  dimensionId: number; 
  text: string; 
}

export interface CreateDimensionRequest {
  name: string;
}

export interface UpdateDimensionRequest {
  id: number;
  name: string;
}

export interface CreateDimensionValueRequest {
  dimensionId: number;
  text: string;
}

export interface UpdateDimensionValueRequest {
  id: string;
  dimensionId: number;
  text: string;
}

// Business rule constants
export const MAX_DIMENSIONS = 11;
export const GROUP_OF_COMPANIES_ID = '0'; 