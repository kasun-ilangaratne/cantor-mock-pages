import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { ConfirmDialogComponent } from '../share-classes/confirm-dialog/confirm-dialog.component';
import { ShareAssetValueDialogComponent } from './share-asset-value-dialog.component';
import { ShareFormPageComponent } from './share-form-page.component';
import { ShareGroupsDialogComponent } from './share-groups-dialog.component';
import { ShareImportDialogComponent } from './share-import-dialog.component';
import { SharesComponent } from './shares.component';
import { SharesInitialValueDialogComponent } from './initial-value-dialog/initial-value-dialog.component';

const routes: Routes = [
  { path: '', component: SharesComponent },
  { path: 'new', component: ShareFormPageComponent },
  { path: ':id', component: ShareFormPageComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharesComponent,
    ShareFormPageComponent,
    ShareGroupsDialogComponent,
    ShareImportDialogComponent,
    ShareAssetValueDialogComponent,
    SharesInitialValueDialogComponent,
    ConfirmDialogComponent
  ]
})
export class SharesModule {}
