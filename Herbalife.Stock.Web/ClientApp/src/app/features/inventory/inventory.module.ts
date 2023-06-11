import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';

import { InventoryRoutingModule } from './inventory-routing.module';
import { WmsInventoryComponent } from './wms-inventory/wms-inventory.component';
import { InventorySupervisorComponent } from './inventory-supervisor/inventory-supervisor.component';
import { StockCountingAllotmentComponent } from './stock-counting-allotment/stock-counting-allotment.component';
import { Operator1StockCountComponent } from './operator1-stock-count/operator1-stock-count.component';
import { Operator2StockCountComponent } from './operator2-stock-count/operator2-stock-count.component';
import { InventoryManagerComponent } from './inventory-manager/inventory-manager.component';
import { CompareInventoryComponent } from './compare-inventory/compare-inventory.component';


@NgModule({
  declarations: [
    WmsInventoryComponent,
    InventorySupervisorComponent,
    StockCountingAllotmentComponent,
    Operator1StockCountComponent,
    Operator2StockCountComponent,
    InventoryManagerComponent,
    CompareInventoryComponent
  ],
  imports: [
    CommonModule,
    InventoryRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule
  ]
})
export class InventoryModule { }
