import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { DimensionsModule } from './features/dimensions/dimensions.module';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const routes: Routes = [
  { path: 'dimensions', loadChildren: () => import('./features/dimensions/dimensions.module').then(m => m.DimensionsModule) },
  { path: 'consolidated-result-unit', loadChildren: () => import('./features/consolidated-result-unit/consolidated-result-unit.module').then(m => m.ConsolidatedResultUnitModule) },
  { path: 'tree-builder', loadChildren: () => import('./features/tree-builder/tree-builder.module').then(m => m.TreeBuilderModule) },
  { path: 'mock-equity-reconciliation', loadChildren: () => import('./features/mock-equity-reconciliation/equity-reconciliation.module').then(m => m.EquityReconciliationModule) },
  // { path: 'mock-share-classes', loadChildren: () => import('./features/share-classes/share-classes.module').then(m => m.ShareClassesModule) },  
  // { path: 'mock-share-classes/:id', loadChildren: () => import('./features/share-classes/share-classes.module').then(m => m.ShareClassesModule) },  
  {path: 'share-classes', loadChildren: () => import('./features/share-classes/share-classes.module').then(m => m.ShareClassesModule) },
  { path: 'shares', loadChildren: () => import('./features/shares/shares.module').then(m => m.SharesModule) },
  { path: 'annual-report', loadChildren: () => import('./features/annual-report/annual-report.module').then(m => m.AnnualReportModule) },
  { path: '', redirectTo: '/consolidated-result-unit', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    RouterModule.forRoot(routes),
    DimensionsModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { } 