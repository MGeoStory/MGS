import { NgModule,ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import {PostReceiptComponent} from './post-receipt.component';
import {DropdownListComponent} from './dropdown-list/dropdown-list.component';
@NgModule({
  imports: [CommonModule],
  declarations: [
      PostReceiptComponent,
      DropdownListComponent
  ],
  exports: [PostReceiptComponent,DropdownListComponent]
})
export class PostReceiptModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: PostReceiptModule,
      providers: []
    }
  }
}