import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';

export interface DividendPayment {
  id: string;
  aksjeklasse: string;
  type: 'Utbytte' | 'Tilbakebetaling';
  transaksjonstype: string;
  dato: string;
  belop: number;
  isEditing?: boolean;
  isNew?: boolean;
}

export interface Transaction {
  id: string;
  aksjeklasse: string;
  transaksjon: string;
  transaksjonstype: string;
  dato: string;
  antall: number;
  parentId?: string;
  isEditing?: boolean;
  isNew?: boolean;
}

export interface ShareholderTransactionsModalData {
  shareholderName: string;
  year: number;
  availableShareClasses: string[];
  selectedShareClasses: string[];
}

@Component({
  selector: 'app-shareholder-transactions-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatSelectModule,
    MatChipsModule
  ],
  templateUrl: './shareholder-transactions-modal.component.html',
  styleUrls: ['./shareholder-transactions-modal.component.scss']
})
export class ShareholderTransactionsModalComponent implements OnInit {
  shareholderName: string = '';
  year: number = 2025;
  selectedShareClass: string = 'Ordinære';
  selectedShareClasses: string[] = [];
  availableShareClasses: string[] = [];
  
  // Balance summary
  incomingBalance: number = 15;
  changesBalance: number = 5;
  outgoingBalance: number = 20;
  
  // Utbytte og tilbakebetaling
  dividendPayments: DividendPayment[] = [
    {
      id: '1',
      aksjeklasse: 'Ordinære',
      type: 'Utbytte',
      transaksjonstype: '',
      dato: '2025-01-15',
      belop: 50000
    },
    {
      id: '2',
      aksjeklasse: 'A',
      type: 'Tilbakebetaling',
      transaksjonstype: 'Kjøp',
      dato: '2025-02-20',
      belop: 25000
    }
  ];
  
  showDividendAddOptions: boolean = false;
  
  // Transaksjoner
  transactions: Transaction[] = [
    {
      id: 't1',
      aksjeklasse: 'Ordinære',
      transaksjon: 'Kjøp',
      transaksjonstype: 'Kjøp',
      dato: '2025-03-01',
      antall: 100
    },
    {
      id: 't2',
      aksjeklasse: 'Ordinære',
      transaksjon: 'Salg',
      transaksjonstype: 'Salg',
      dato: '2025-03-15',
      antall: -50,
      parentId: 't1'
    },
    {
      id: 't3',
      aksjeklasse: 'Ordinære',
      transaksjon: 'Salg',
      transaksjonstype: 'Salg',
      dato: '2025-03-20',
      antall: -30,
      parentId: 't1'
    },
    {
      id: 't4',
      aksjeklasse: 'A',
      transaksjon: 'Kjøp',
      transaksjonstype: 'Kjøp',
      dato: '2025-04-01',
      antall: 200
    }
  ];
  
  expandedParentIds: Set<string> = new Set();
  
  isDirty: boolean = false;
  
  constructor(
    public dialogRef: MatDialogRef<ShareholderTransactionsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ShareholderTransactionsModalData
  ) {
    this.shareholderName = data.shareholderName || '';
    this.year = data.year || 2025;
    this.availableShareClasses = data.availableShareClasses || ['Ordinære', 'A', 'B'];
    this.selectedShareClasses = data.selectedShareClasses || ['Ordinære', 'A'];
    if (this.selectedShareClasses.length > 0) {
      this.selectedShareClass = this.selectedShareClasses[0];
    }
  }

  ngOnInit(): void {
    // Initialize
  }

  onShareClassFilterChange(): void {
    // Filter logic would go here
    this.isDirty = true;
  }

  toggleShareClass(className: string): void {
    const index = this.selectedShareClasses.indexOf(className);
    if (index > -1) {
      this.selectedShareClasses.splice(index, 1);
    } else {
      this.selectedShareClasses.push(className);
    }
    this.isDirty = true;
  }

  removeShareClass(className: string): void {
    const index = this.selectedShareClasses.indexOf(className);
    if (index > -1) {
      this.selectedShareClasses.splice(index, 1);
    }
    this.isDirty = true;
  }

  showDividendAddMenu(): void {
    this.showDividendAddOptions = !this.showDividendAddOptions;
  }

  addDividend(type: 'Utbytte' | 'Tilbakebetaling'): void {
    const newDividend: DividendPayment = {
      id: `div-${Date.now()}`,
      aksjeklasse: this.selectedShareClass,
      type: type,
      transaksjonstype: type === 'Tilbakebetaling' ? 'Kjøp' : '',
      dato: new Date().toISOString().split('T')[0],
      belop: 0,
      isEditing: true,
      isNew: true
    };
    this.dividendPayments.push(newDividend);
    this.showDividendAddOptions = false;
    this.isDirty = true;
  }

  editDividend(dividend: DividendPayment): void {
    dividend.isEditing = true;
    this.isDirty = true;
  }

  cancelEditDividend(dividend: DividendPayment): void {
    if (dividend.isNew) {
      const index = this.dividendPayments.indexOf(dividend);
      if (index > -1) {
        this.dividendPayments.splice(index, 1);
      }
    } else {
      dividend.isEditing = false;
    }
  }

  saveDividend(dividend: DividendPayment): void {
    dividend.isEditing = false;
    dividend.isNew = false;
    this.isDirty = true;
  }

  deleteDividend(dividend: DividendPayment): void {
    if (confirm('Er du sikker på at du vil slette denne raden?')) {
      const index = this.dividendPayments.indexOf(dividend);
      if (index > -1) {
        this.dividendPayments.splice(index, 1);
      }
      this.isDirty = true;
    }
  }

  addTransaction(): void {
    const newTransaction: Transaction = {
      id: `trans-${Date.now()}`,
      aksjeklasse: this.selectedShareClass,
      transaksjon: 'Kjøp',
      transaksjonstype: 'Kjøp',
      dato: new Date().toISOString().split('T')[0],
      antall: 0,
      isEditing: true,
      isNew: true
    };
    this.transactions.push(newTransaction);
    this.isDirty = true;
  }

  toggleExpand(transaction: Transaction): void {
    if (this.isParent(transaction)) {
      if (this.expandedParentIds.has(transaction.id)) {
        this.expandedParentIds.delete(transaction.id);
      } else {
        // Collapse all others and expand this one
        this.expandedParentIds.clear();
        this.expandedParentIds.add(transaction.id);
      }
    }
  }

  isParent(transaction: Transaction): boolean {
    return this.transactions.some(t => t.parentId === transaction.id);
  }

  isExpanded(transaction: Transaction): boolean {
    return this.expandedParentIds.has(transaction.id);
  }

  getChildTransactions(parentId: string): Transaction[] {
    return this.transactions.filter(t => t.parentId === parentId);
  }

  getVisibleTransactions(): Transaction[] {
    const visible: Transaction[] = [];
    
    // Get all parent transactions (no parentId) that match selected share classes
    const parentTransactions = this.transactions.filter(t => !t.parentId && this.isShareClassVisible(t.aksjeklasse));
    
    parentTransactions.forEach(parent => {
      visible.push(parent);
      
      // Add children if parent is expanded
      if (this.expandedParentIds.has(parent.id)) {
        const children = this.getChildTransactions(parent.id);
        visible.push(...children);
      }
    });
    
    return visible;
  }
  
  getParentTransactions(): Transaction[] {
    return this.transactions.filter(t => !t.parentId && this.isShareClassVisible(t.aksjeklasse));
  }

  isShareClassVisible(className: string): boolean {
    return this.selectedShareClasses.includes(className);
  }

  editTransaction(transaction: Transaction): void {
    transaction.isEditing = true;
    this.isDirty = true;
  }

  cancelEditTransaction(transaction: Transaction): void {
    if (transaction.isNew) {
      const index = this.transactions.indexOf(transaction);
      if (index > -1) {
        this.transactions.splice(index, 1);
      }
    } else {
      transaction.isEditing = false;
    }
  }

  saveTransaction(transaction: Transaction): void {
    transaction.isEditing = false;
    transaction.isNew = false;
    this.isDirty = true;
  }

  deleteTransaction(transaction: Transaction): void {
    if (confirm('Er du sikker på at du vil slette denne raden?')) {
      // Also delete children if any
      const children = this.transactions.filter(t => t.parentId === transaction.id);
      children.forEach(child => {
        const index = this.transactions.indexOf(child);
        if (index > -1) {
          this.transactions.splice(index, 1);
        }
      });
      
      const index = this.transactions.indexOf(transaction);
      if (index > -1) {
        this.transactions.splice(index, 1);
      }
      this.isDirty = true;
    }
  }

  getTransactionSum(): number {
    // Sum all visible transactions (parents only, children are already included in parent's calculation)
    return this.getParentTransactions()
      .reduce((sum, parent) => {
        let total = parent.antall;
        if (this.expandedParentIds.has(parent.id)) {
          const children = this.getChildTransactions(parent.id);
          total += children.reduce((childSum, child) => childSum + child.antall, 0);
        }
        return sum + total;
      }, 0);
  }


  formatNumber(value: number): string {
    if (value === 0) return '0';
    const sign = value > 0 ? '+' : '';
    return `${sign}${value}`;
  }

  onSave(): void {
    // Validate
    const hasInvalidDates = [...this.dividendPayments, ...this.transactions].some(item => {
      if ('dato' in item && !item.dato) return true;
      return false;
    });
    
    if (hasInvalidDates) {
      alert('Alle datoer må være fylt ut');
      return;
    }
    
    // Mock save
    this.isDirty = false;
    alert('Lagret');
  }

  onCancel(): void {
    if (this.isDirty) {
      if (!confirm('Du har ikke lagrede endringer. Vil du fortsette?')) {
        return;
      }
    }
    this.dialogRef.close({ saved: false });
  }
}
