import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WmsInventoryComponent } from './wms-inventory/wms-inventory.component';
import { InventorySupervisorComponent } from './inventory-supervisor/inventory-supervisor.component';
import { StockCountingAllotmentComponent } from './stock-counting-allotment/stock-counting-allotment.component';
import { Operator1StockCountComponent } from './operator1-stock-count/operator1-stock-count.component';
import { Operator2StockCountComponent } from './operator2-stock-count/operator2-stock-count.component';
import { InventoryManagerComponent } from './inventory-manager/inventory-manager.component';
import { CompareInventoryComponent } from './compare-inventory/compare-inventory.component';

const routes: Routes = 
[
  {
    path: 'wms-inventory', component: WmsInventoryComponent
  },
  {
    path: 'inventory-supervisor', component: InventorySupervisorComponent 
  },
  {
    path: 'stock-counting-allotment', component: StockCountingAllotmentComponent 
  },
  {
    path: 'operator1-stock-count', component: Operator1StockCountComponent 
  },
  {
    path: 'operator2-stock-count', component: Operator2StockCountComponent 
  },
  {
    path: 'inventory-manager', component: InventoryManagerComponent 
  },
  {
    path: 'compare-inventory', component: CompareInventoryComponent 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventoryRoutingModule { }
