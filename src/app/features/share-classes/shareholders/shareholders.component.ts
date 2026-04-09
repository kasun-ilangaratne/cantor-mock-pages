import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ShareholderModalComponent } from '../shareholder-modal/shareholder-modal.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

export interface Shareholder {
  id: string;
  nr: number;
  navn: string;
  personnrOrgNr: string;
  status: 'Aktiv' | 'Inaktiv';
  percentage2024: number;
  percentage2025: number;
  /** Share capital amounts when Deltakere uses andeler (pass-through + URL flag). */
  selskapskapital2024: number;
  selskapskapital2025: number;
  hasShares: boolean; // Mock flag to determine if shareholder has shares
}

type SortColumn =
  | 'nr'
  | 'navn'
  | 'personnrOrgNr'
  | 'percentage2024'
  | 'percentage2025'
  | 'selskapskapital2024'
  | 'selskapskapital2025'
  | null;
type SortDirection = 'asc' | 'desc' | null;

@Component({
  selector: 'app-shareholders',
  templateUrl: './shareholders.component.html',
  styleUrls: ['./shareholders.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatCheckboxModule
  ]
})
export class ShareholdersComponent implements OnInit {
  companyType: 'standard' | 'passThrough' = 'standard';
  /** Synced with Selskap tab checkbox via `useAndelerDeltakere` query param. */
  useAndelerForDeltakere = false;

  // Header data
  company: string = 'Shiba Group AS';
  year: number = 2025;
  month: number = 11;

  // Mock data
  shareholders: Shareholder[] = [
    {
      id: '1',
      nr: 1,
      navn: 'John Doe',
      personnrOrgNr: '12345678901',
      status: 'Aktiv',
      percentage2024: 45.5,
      percentage2025: 45.5,
      selskapskapital2024: 455_000,
      selskapskapital2025: 455_000,
      hasShares: true
    },
    {
      id: '2',
      nr: 2,
      navn: 'Jane Smith',
      personnrOrgNr: '98765432109',
      status: 'Aktiv',
      percentage2024: 30.0,
      percentage2025: 30.0,
      selskapskapital2024: 300_000,
      selskapskapital2025: 300_000,
      hasShares: true
    },
    {
      id: '3',
      nr: 3,
      navn: 'Inactive Corp',
      personnrOrgNr: '11122233344',
      status: 'Inaktiv',
      percentage2024: 24.5,
      percentage2025: 24.5,
      selskapskapital2024: 245_000,
      selskapskapital2025: 245_000,
      hasShares: false
    }
  ];

  // Filter and search
  searchTerm: string = '';
  showOnlyActive: boolean = false;

  // Sorting
  sortColumn: SortColumn = null;
  sortDirection: SortDirection = null;

  // State
  isDirty: boolean = false;
  
  // Available share classes (should come from parent or service)
  selectedShareClasses: string[] = ['Ordinære', 'A', 'B'];

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      const typeParam = params.get('companyType');
      this.companyType = typeParam === 'passThrough' ? 'passThrough' : 'standard';
      const andelerParam = params.get('useAndelerDeltakere');
      this.useAndelerForDeltakere = andelerParam === '1' || andelerParam === 'true';
    });
  }

  get participantsTabLabel(): string {
    return this.companyType === 'passThrough' ? 'Deltakere' : 'Aksjonærer';
  }

  /** Pass-through + "Bruk andeler" — show extra Selskapskapital columns after % columns. */
  get showDeltakereAndelerColumns(): boolean {
    return this.companyType === 'passThrough' && this.useAndelerForDeltakere;
  }

  get filteredShareholders(): Shareholder[] {
    let filtered = [...this.shareholders];

    // Apply search filter
    if (this.searchTerm) {
      const search = this.searchTerm.toLowerCase();
      filtered = filtered.filter(sh => 
        sh.navn.toLowerCase().includes(search) ||
        sh.personnrOrgNr.includes(search)
      );
    }

    // Apply active filter
    if (this.showOnlyActive) {
      filtered = filtered.filter(sh => sh.status === 'Aktiv');
    }

    // Apply sorting
    if (this.sortColumn && this.sortDirection) {
      filtered.sort((a, b) => {
        let aVal: any = a[this.sortColumn!];
        let bVal: any = b[this.sortColumn!];

        if (typeof aVal === 'string') {
          aVal = aVal.toLowerCase();
          bVal = bVal.toLowerCase();
        }

        if (this.sortDirection === 'asc') {
          return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
        } else {
          return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
        }
      });
    }

    return filtered;
  }

  get totalPercentage2024(): number {
    return this.filteredShareholders.reduce((sum, sh) => sum + sh.percentage2024, 0);
  }

  get totalPercentage2025(): number {
    return this.filteredShareholders.reduce((sum, sh) => sum + sh.percentage2025, 0);
  }

  get totalSelskapskapital2024(): number {
    return this.filteredShareholders.reduce((sum, sh) => sum + sh.selskapskapital2024, 0);
  }

  get totalSelskapskapital2025(): number {
    return this.filteredShareholders.reduce((sum, sh) => sum + sh.selskapskapital2025, 0);
  }

  get isTotalWarning(): boolean {
    return (
      Math.abs(this.totalPercentage2024 - 100) > 0.01 ||
      Math.abs(this.totalPercentage2025 - 100) > 0.01
    );
  }

  onSort(column: SortColumn): void {
    if (this.sortColumn === column) {
      // Toggle direction
      if (this.sortDirection === 'asc') {
        this.sortDirection = 'desc';
      } else if (this.sortDirection === 'desc') {
        // Clear sort
        this.sortColumn = null;
        this.sortDirection = null;
      }
    } else {
      // New column, start with ascending
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
  }

  getSortIcon(column: SortColumn): string {
    if (this.sortColumn !== column) {
      return '';
    }
    return this.sortDirection === 'asc' ? 'arrow_upward' : 'arrow_downward';
  }

  onAdd(): void {
    this.router.navigate(['/share-classes/shareholders/new'], {
      queryParams: {
        companyType: this.companyType,
        useAndelerDeltakere:
          this.companyType === 'passThrough' && this.useAndelerForDeltakere ? '1' : null
      },
      queryParamsHandling: 'merge'
    });
  }

  onEdit(shareholder: Shareholder): void {
    this.router.navigate(['/share-classes/shareholders', shareholder.id], {
      queryParams: {
        companyType: this.companyType,
        useAndelerDeltakere:
          this.companyType === 'passThrough' && this.useAndelerForDeltakere ? '1' : null
      },
      queryParamsHandling: 'merge'
    });
  }

  onDelete(shareholder: Shareholder): void {
    const message = shareholder.hasShares
      ? `Aksjonæren ${shareholder.navn} har aksjer, vil du likevel slette?`
      : `Aksjonæren ${shareholder.navn} har ikke aksjer, vil du slette?`;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      maxWidth: '90vw',
      disableClose: false,
      hasBackdrop: true,
      backdropClass: 'dialog-backdrop',
      panelClass: 'confirm-dialog',
      data: {
        title: 'Bekreft sletting',
        message: message
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        const index = this.shareholders.findIndex(sh => sh.id === shareholder.id);
        if (index !== -1) {
          this.shareholders.splice(index, 1);
          // Renumber shareholders
          this.shareholders.forEach((sh, i) => {
            sh.nr = i + 1;
          });
          this.isDirty = true;
        }
      }
    });
  }

  onSave(): void {
    // Mock save
    this.isDirty = false;
    alert('Lagret');
  }

  formatPercentage(value: number): string {
    return value.toFixed(1) + '%';
  }

  formatAmount(value: number): string {
    return new Intl.NumberFormat('no-NO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })
      .format(value)
      .replace(/,/g, ' ');
  }

  getTotalWarning(year: number): boolean {
    const total = year === 2024 ? this.totalPercentage2024 : this.totalPercentage2025;
    return Math.abs(total - 100) > 0.01;
  }

  isShareClassesRoute(): boolean {
    return !this.router.url.includes('/shareholders');
  }

  isShareholdersRoute(): boolean {
    return this.router.url.includes('/shareholders');
  }

  navigateToShareClasses(): void {
    if (this.isShareClassesRoute()) {
      return;
    }
    this.router.navigate(['..'], {
      relativeTo: this.route,
      queryParams: {
        companyType: this.companyType,
        useAndelerDeltakere:
          this.companyType === 'passThrough' && this.useAndelerForDeltakere ? '1' : null
      },
      queryParamsHandling: 'merge'
    });
  }

  navigateToShareholders(): void {
    // Already on shareholders route
  }
}
