import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Shared Components
import { AccountDropdownComponent } from './components/account-dropdown/account-dropdown.component';

@NgModule({
  declarations: [
    AccountDropdownComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    AccountDropdownComponent
  ]
})
export class SharedModule { } 