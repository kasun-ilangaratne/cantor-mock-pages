import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ShareClassesComponent } from './share-classes.component';
import { AddShareClassDialogComponent } from './add-share-class-dialog/add-share-class-dialog.component';
import { RiskDetailsDialogComponent } from './risk-details-dialog/risk-details-dialog.component';
import { ShareClassesSelectionDialogComponent } from './share-classes-selection-dialog/share-classes-selection-dialog.component';
import { ShareholdersComponent } from './shareholders/shareholders.component';
import { ShareholderModalComponent } from './shareholder-modal/shareholder-modal.component';
import { ShareholderTransactionsModalComponent } from './shareholder-transactions-modal/shareholder-transactions-modal.component';
import { ShareholderFormPageComponent } from './shareholder-form-page/shareholder-form-page.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { BankAccountsDialogComponent } from './bank-accounts-dialog/bank-accounts-dialog.component';
import { AllocatedDividendDialogComponent } from './allocated-dividend-dialog/allocated-dividend-dialog.component';
import { AdjustedEquityDialogComponent } from './adjusted-equity-dialog/adjusted-equity-dialog.component';
import { AlternativeCurrencyDialogComponent } from './alternative-currency-dialog/alternative-currency-dialog.component';

const routes: Routes = [
  { path: '', component: ShareClassesComponent },
  { path: 'shareholders', component: ShareholdersComponent },
  { path: 'shareholders/new', component: ShareholderFormPageComponent },
  { path: 'shareholders/:id', component: ShareholderFormPageComponent }
];

@NgModule({
  declarations: [ShareClassesComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatDialogModule,
    MatInputModule,
    MatTabsModule,
    AddShareClassDialogComponent,
    RiskDetailsDialogComponent,
    ShareClassesSelectionDialogComponent,
    ShareholdersComponent,
    ShareholderModalComponent,
    ShareholderTransactionsModalComponent,
    ShareholderFormPageComponent,
    ConfirmDialogComponent,
    BankAccountsDialogComponent,
    AllocatedDividendDialogComponent,
    AdjustedEquityDialogComponent,
    AlternativeCurrencyDialogComponent
  ]
})
export class ShareClassesModule { }

