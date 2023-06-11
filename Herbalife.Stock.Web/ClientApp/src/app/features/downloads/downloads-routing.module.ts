import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeclarationLetterComponent } from './declaration-letter/declaration-letter.component';
import { StockOnHandComponent } from './stock-on-hand/stock-on-hand.component';

const routes: Routes = 
[
  {
    path: 'declaration-letter', component: DeclarationLetterComponent 
  },
  {
    path: 'stock-on-hand', component: StockOnHandComponent 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DownloadsRoutingModule { }
