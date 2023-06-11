import { Component, OnInit } from '@angular/core';
import { WmsInventoryService } from '../../../shared/services/wms-inventory.service';
import { StockOnHandModel } from '../../../shared/models/stock-allotment.model';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-stock-on-hand',
  templateUrl: './stock-on-hand.component.html',
  styleUrls: ['./stock-on-hand.component.css']
})
export class StockOnHandComponent implements OnInit {

  stockOnHandInventory: StockOnHandModel[] = [];
  pageSize: number = 10;
  downloadEnabled: boolean = false;

  constructor(private _wmsInventoryService: WmsInventoryService) { }

  ngOnInit(): void {
    this.loadInventoryDetails();
  }

  loadInventoryDetails() {
    this._wmsInventoryService.getStockOnHandInventory().subscribe((data: StockOnHandModel[]) => {
      this.stockOnHandInventory = data;
    });
  }

  downloadStockOnHand() {
    /* pass here the table id */
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.stockOnHandInventory);

     /* generate workbook and add the worksheet */
     const wb: XLSX.WorkBook = XLSX.utils.book_new();
     XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
     /* save to file */
    XLSX.writeFile(wb, 'downloadStockOnHand.xlsx');
  }

  



}
