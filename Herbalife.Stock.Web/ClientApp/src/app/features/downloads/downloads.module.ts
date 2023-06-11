import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DownloadsRoutingModule } from './downloads-routing.module';
import { DeclarationLetterComponent } from './declaration-letter/declaration-letter.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { StockOnHandComponent } from './stock-on-hand/stock-on-hand.component';


@NgModule({
  declarations: [
    DeclarationLetterComponent,
    StockOnHandComponent
  ],
  imports: [
    CommonModule,
    DownloadsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule
  ]
})
export class DownloadsModule { }
