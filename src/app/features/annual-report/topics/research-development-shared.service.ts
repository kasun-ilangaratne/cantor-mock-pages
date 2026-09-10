import { Injectable, signal } from '@angular/core';

export interface FoUDetailsRequest {
  projectNumber: number;
  projectTitle: string;
}

@Injectable({ providedIn: 'root' })
export class ResearchDevelopmentSharedService {
  readonly detailsRequest = signal<FoUDetailsRequest | null>(null);

  requestDetails(payload: FoUDetailsRequest): void {
    this.detailsRequest.set(payload);
  }

  clearDetailsRequest(): void {
    this.detailsRequest.set(null);
  }
}
