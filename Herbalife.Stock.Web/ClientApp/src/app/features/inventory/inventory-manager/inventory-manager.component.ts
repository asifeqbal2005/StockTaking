import { Component, OnInit } from '@angular/core';
import { WmsInventoryService } from '../../../shared/services/wms-inventory.service';
import { StockCountingAllotmentService } from '../../../shared/services/stock-counting-allotment.service';

@Component({
  selector: 'app-inventory-manager',
  templateUrl: './inventory-manager.component.html',
  styleUrls: ['./inventory-manager.component.css']
})
export class InventoryManagerComponent implements OnInit {

  supervisorInventory: any[] = [];
  allInventory: any[] = [];
  rowResult: any;
  pageSize: number = 10;
  isEdit!: boolean;
  p: number = 1;
  noData: string;
  selectedRow?: string;

  constructor(private _wmsInventoryService: WmsInventoryService,
    private _stockAllotmentService: StockCountingAllotmentService) {
    this.noData = "noData";
  }

  ngOnInit(): void {
    this.bindRowData();
    this.loadInventoryDetails();
  }

  bindRowData() {
    this._stockAllotmentService.getManagerSubmitStockRow().subscribe((result: any) => {
      if (result != null) {
        this.rowResult = result;
      }
    });
  }

  loadInventoryDetails() {
    this._wmsInventoryService.getSupervisorInventory().subscribe((data: any[]) => {
      this.supervisorInventory = data;
    });
  }

  onRowDataSelected(rowData: any) {
    if (rowData !== undefined) {
      this.selectedRow = rowData;
      this.allInventory = this.supervisorInventory.filter(o => o.row === rowData);
    }
    else {
      this.selectedRow = undefined;
      this.allInventory = [];
    }
  }

  UpdateData(inv: any) {
    debugger;
    inv.isEdit = false;

    //Actual A
    inv.diffA = ((inv.actualA == undefined ? 0 : inv.actualA) - (inv.onHand_WMS == undefined ? 0 : inv.onHand_WMS));

    //Actual B
    inv.actualFinal = (inv.actualB == undefined || inv.actualB == 0) ? (inv.actualA == undefined ? 0 : inv.actualA) : inv.actualB;
    inv.diffFinal = (inv.actualFinal == undefined ? 0 : inv.actualFinal) - (inv.onHand_WMS == undefined ? 0 : inv.onHand_WMS);

    this._wmsInventoryService.UpdateInventory(inv).subscribe(() => {
      inv.isEdit = false;
      console.log('Data saved successfully');
    });
  }

  close(inv: any) {
    inv.isEdit = false;
  }

  EditData(inv: any) {
    let foundItem = this.allInventory.find(o => o.isEdit == true);
    if (foundItem != undefined) {
      foundItem.isEdit = false;
    }
    inv.isEdit = true;
  }

  submitRow() {
    if (this.selectedRow !== undefined) {
      let submitRequest: any = {
        row: this.selectedRow
      }

      this._stockAllotmentService.submitStockRowByManager(submitRequest)
        .subscribe((result: any) => {
          debugger;
          if (result) {
            this.bindRowData();
            this.selectedRow = undefined;
            this.allInventory = [];
            console.log('Row submitted successfully');
          }
          else {
            console.log('Please complete all jobs before submit the row.');
          }
        });
    }
  }

}
