import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { ConfirmDialogComponent } from '../share-classes/confirm-dialog/confirm-dialog.component';
import { Shareholding, ShareGroup } from './shares.models';
import { SharesService } from './shares.service';
import { ShareGroupsDialogComponent } from './share-groups-dialog.component';
import { ShareImportDialogComponent } from './share-import-dialog.component';
import { ShareAssetValueDialogComponent } from './share-asset-value-dialog.component';

type SortColumn =
  | 'index'
  | 'company'
  | 'organizationNumber'
  | 'type'
  | 'group'
  | 'openingBalanceShares'
  | 'yearEndShares';
type SortDirection = 'asc' | 'desc' | null;

@Component({
  selector: 'app-shares',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatIconModule],
  templateUrl: './shares.component.html',
  styleUrls: ['./shares.component.scss']
})
export class SharesComponent implements OnInit {
  company = 'Cantor';
  year = 2025;
  readonly availableYears = [2022, 2023, 2024, 2025, 2026, 2027];

  searchTerm = '';
  showActiveOnly = false;
  sortColumn: SortColumn | null = null;
  sortDirection: SortDirection = null;

  shareholdings: Shareholding[] = [];
  groups: ShareGroup[] = [];

  constructor(
    private readonly sharesService: SharesService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      const yearParam = Number(params.get('year'));
      this.year = Number.isFinite(yearParam) && yearParam > 0 ? yearParam : 2025;
      this.reload();
    });
  }

  get filteredShareholdings(): Array<Shareholding & { index: number; groupName: string }> {
    const search = this.searchTerm.trim().toLowerCase();
    let rows = this.shareholdings.map((item, index) => ({
      ...item,
      index: index + 1,
      groupName: this.getGroupName(item.groupId)
    }));

    if (search) {
      rows = rows.filter((item) =>
        item.company.toLowerCase().includes(search) ||
        item.organizationNumber.includes(search) ||
        item.type.toLowerCase().includes(search) ||
        item.groupName.toLowerCase().includes(search)
      );
    }

    if (this.showActiveOnly) {
      rows = rows.filter((item) => item.activeAtYearEnd);
    }

    if (this.sortColumn && this.sortDirection) {
      rows = [...rows].sort((a, b) => {
        const aValue = this.getSortValue(a, this.sortColumn!);
        const bValue = this.getSortValue(b, this.sortColumn!);
        const direction = this.sortDirection === 'asc' ? 1 : -1;

        if (aValue > bValue) {
          return direction;
        }
        if (aValue < bValue) {
          return -direction;
        }
        return 0;
      });
    }

    return rows;
  }

  onYearChange(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { year: this.year },
      queryParamsHandling: 'merge'
    });
  }

  onAdd(): void {
    this.router.navigate(['/shares/new'], { queryParams: { year: this.year } });
  }

  onEdit(shareholding: Shareholding): void {
    this.router.navigate(['/shares', shareholding.id], { queryParams: { year: this.year } });
  }

  onDelete(shareholding: Shareholding): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '420px',
      maxWidth: '90vw',
      data: {
        title: 'Bekreft sletting',
        message: `Vil du slette aksjeposten for ${shareholding.company}?`
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (!confirmed) {
        return;
      }

      this.sharesService.deleteShareholding(this.year, shareholding.id);
      this.reload();
    });
  }

  onSort(column: SortColumn): void {
    if (this.sortColumn === column) {
      if (this.sortDirection === 'asc') {
        this.sortDirection = 'desc';
      } else if (this.sortDirection === 'desc') {
        this.sortColumn = null;
        this.sortDirection = null;
      }
      return;
    }

    this.sortColumn = column;
    this.sortDirection = 'asc';
  }

  getSortIcon(column: SortColumn): string {
    if (this.sortColumn !== column) {
      return '';
    }
    return this.sortDirection === 'asc' ? 'arrow_upward' : 'arrow_downward';
  }

  openImport(): void {
    const dialogRef = this.dialog.open(ShareImportDialogComponent, {
      width: '560px',
      maxWidth: '92vw',
      data: { year: this.year }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.reload();
      }
    });
  }

  openAssetValueUpdate(): void {
    const dialogRef = this.dialog.open(ShareAssetValueDialogComponent, {
      width: '560px',
      maxWidth: '92vw',
      data: { year: this.year, shareholdings: this.shareholdings }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.reload();
      }
    });
  }

  openGroups(): void {
    const dialogRef = this.dialog.open(ShareGroupsDialogComponent, {
      width: '760px',
      maxWidth: '94vw'
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.reload();
      }
    });
  }

  getGroupName(groupId: string | null): string {
    return this.groups.find((group) => group.id === groupId)?.name ?? '';
  }

  private reload(): void {
    this.groups = this.sharesService.getGroups();
    this.shareholdings = this.sharesService.getShareholdings(this.year);
  }

  private getSortValue(
    item: Shareholding & { index: number; groupName: string },
    column: SortColumn
  ): number | string {
    switch (column) {
      case 'index':
        return item.index;
      case 'company':
        return item.company.toLowerCase();
      case 'organizationNumber':
        return item.organizationNumber;
      case 'type':
        return item.type.toLowerCase();
      case 'group':
        return item.groupName.toLowerCase();
      case 'openingBalanceShares':
        return item.openingBalanceShares;
      case 'yearEndShares':
        return item.yearEndShares;
    }
  }
}
