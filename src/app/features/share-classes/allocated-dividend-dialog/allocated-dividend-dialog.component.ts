import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface AllocatedDividendEntry {
  id: string;
  date: string; // dd.mm.yyyy
  time: string; // hh:mm
  amount: number;
  _editing?: boolean;
  _isNew?: boolean;
  _draft?: { date: string; time: string; amount: number };
  _backup?: { date: string; time: string; amount: number };
}

export interface AllocatedDividendDialogData {
  entries: AllocatedDividendEntry[];
}

@Component({
  selector: 'app-allocated-dividend-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './allocated-dividend-dialog.component.html',
  styleUrls: ['./allocated-dividend-dialog.component.scss']
})
export class AllocatedDividendDialogComponent {
  entries: AllocatedDividendEntry[] = [];

  constructor(
    public dialogRef: MatDialogRef<AllocatedDividendDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AllocatedDividendDialogData
  ) {
    this.entries = (data.entries ?? []).map((entry) => ({
      ...entry,
      _editing: false,
      _isNew: false
    }));
  }

  addRow(): void {
    this.entries.unshift({
      id: `alloc-div-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      date: '',
      time: '',
      amount: 0,
      _editing: true,
      _isNew: true,
      _draft: { date: '', time: '', amount: 0 }
    });
  }

  startEdit(row: AllocatedDividendEntry): void {
    if (row._editing) {
      return;
    }
    row._editing = true;
    row._backup = { date: row.date, time: row.time, amount: row.amount };
    row._draft = { date: row.date, time: row.time, amount: row.amount };
  }

  saveRow(row: AllocatedDividendEntry): void {
    if (!row._draft) {
      return;
    }
    row.date = this.normalizeDate(row._draft.date);
    row.time = this.normalizeTime(row._draft.time);
    row.amount = Number(row._draft.amount) || 0;
    row._editing = false;
    row._isNew = false;
    row._backup = undefined;
    row._draft = undefined;
  }

  cancelRow(row: AllocatedDividendEntry): void {
    if (row._isNew) {
      this.deleteRow(row);
      return;
    }
    if (row._backup) {
      row.date = row._backup.date;
      row.time = row._backup.time;
      row.amount = row._backup.amount;
    }
    row._editing = false;
    row._backup = undefined;
    row._draft = undefined;
  }

  deleteRow(row: AllocatedDividendEntry): void {
    const i = this.entries.indexOf(row);
    if (i >= 0) {
      this.entries.splice(i, 1);
    }
  }

  onSave(): void {
    const normalized = this.entries
      .filter((e) => !e._editing)
      .map((e) => ({ id: e.id, date: this.normalizeDate(e.date), time: this.normalizeTime(e.time), amount: Number(e.amount) || 0 }));
    this.dialogRef.close({ saved: true, entries: normalized });
  }

  onCancel(): void {
    this.dialogRef.close({ saved: false });
  }

  private normalizeDate(value: string): string {
    const v = (value || '').trim();
    if (!v) return '';
    const dmy = /^(\d{2})\.(\d{2})\.(\d{4})$/;
    if (dmy.test(v)) return v;
    const ymd = /^(\d{4})-(\d{2})-(\d{2})$/;
    const m = v.match(ymd);
    if (m) return `${m[3]}.${m[2]}.${m[1]}`;
    const dt = new Date(v);
    if (Number.isNaN(dt.getTime())) return v;
    return `${String(dt.getDate()).padStart(2, '0')}.${String(dt.getMonth() + 1).padStart(2, '0')}.${dt.getFullYear()}`;
  }

  private normalizeTime(value: string): string {
    const v = (value || '').trim();
    if (!v) return '';
    const hhmm = /^(\d{2}):(\d{2})$/;
    if (hhmm.test(v)) return v;
    const hhmmss = /^(\d{2}):(\d{2}):(\d{2})$/;
    const m = v.match(hhmmss);
    if (m) return `${m[1]}:${m[2]}`;
    const dt = new Date(`2000-01-01T${v}`);
    if (Number.isNaN(dt.getTime())) return v;
    return `${String(dt.getHours()).padStart(2, '0')}:${String(dt.getMinutes()).padStart(2, '0')}`;
  }
}

