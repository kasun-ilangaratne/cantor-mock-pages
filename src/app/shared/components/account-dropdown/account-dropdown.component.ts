import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

export interface AccountOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-account-dropdown',
  templateUrl: './account-dropdown.component.html',
  styleUrls: ['./account-dropdown.component.scss']
})
export class AccountDropdownComponent implements OnInit {
  @Input() selectedValue: string = '';
  @Input() placeholder: string = 'Select Account';
  @Input() disabled: boolean = false;
  @Input() required: boolean = false;
  @Input() customAccountOptions?: AccountOption[];
  
  @Output() valueChange = new EventEmitter<string>();
  @Output() accountSelected = new EventEmitter<AccountOption>();

  // Default account options
  defaultAccountOptions: AccountOption[] = [
    { value: '1001', label: '1001 - Revenue Account Alpha' },
    { value: '1002', label: '1002 - Cost of Sales Beta' },
    { value: '1003', label: '1003 - Operating Expenses Gamma' },
    { value: '1004', label: '1004 - Financial Income Delta' },
    { value: '1005', label: '1005 - Financial Expenses Epsilon' },
    { value: '2000', label: '2000 - Share Capital' },
    { value: '2001', label: '2001 - Cash and Bank' },
    { value: '2002', label: '2002 - Accounts Receivable' },
    { value: '2003', label: '2003 - Inventory' },
    { value: '2004', label: '2004 - Fixed Assets' },
    { value: '2005', label: '2005 - Accounts Payable' },
    { value: '2006', label: '2006 - Loans and Borrowings' },
    { value: '2007', label: '2007 - Equity' },
    { value: '2008', label: '2008 - Retained Earnings' },
    { value: '2050', label: '2050 - Annen egenkapital' },
    { value: '3000', label: '3000 - Intercompany Receivable' },
    { value: '3050', label: '3050 - Intercompany Payable' },
    { value: '4000', label: '4000 - Dividend Income' },
    { value: '4050', label: '4050 - Dividend Expense' },
    { value: '5000', label: '5000 - Sales Revenue' },
    { value: '5050', label: '5050 - Cost of Sales' },
    { value: '6000', label: '6000 - Management Fee Income' },
    { value: '6050', label: '6050 - Management Fee Expense' }
  ];

  get accountOptions(): AccountOption[] {
    return this.customAccountOptions || this.defaultAccountOptions;
  }

  ngOnInit(): void {
    // Component initialization
  }

  onValueChange(selectedValue: string): void {
    this.valueChange.emit(selectedValue);
    
    // Find the selected account option and emit it
    const selectedAccount = this.accountOptions.find(acc => acc.value === selectedValue);
    if (selectedAccount) {
      this.accountSelected.emit(selectedAccount);
    }
  }

  getAccountName(accountNo: string): string {
    const account = this.accountOptions.find(acc => acc.value === accountNo);
    return account ? account.label.split(' - ')[1] : '';
  }
} 