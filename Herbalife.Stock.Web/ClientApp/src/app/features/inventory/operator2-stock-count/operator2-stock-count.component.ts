import { Component, OnInit } from '@angular/core';
import { StockCountingAllotmentService } from '../../../shared/services/stock-counting-allotment.service';
import { WmsInventoryService } from '../../../shared/services/wms-inventory.service';
import { map, mergeMap } from 'rxjs/operators';
import { iif } from 'rxjs';

@Component({
  selector: 'app-operator2-stock-count',
  templateUrl: './operator2-stock-count.component.html',
  styleUrls: [
    './operator2-stock-count.component.css',
    '../../../../assets/css/bootstrap-datetimepicker.min.css',
    '../../../../assets/css/bootstrap-theme.css',
    '../../../../assets/css/bootstrap-theme.min.css',
  ]
})

export class Operator2StockCountComponent implements OnInit {
  rowResult: any;
  operatorInventory: any[] = [];
  allInventory: any[] = [];
  //pageSize: number = 10;
  isEdit!: boolean;
  operatorId: number;
  //p: number = 1;
  noData: string;
  selectedRow?: string;
  isMobileResolution: boolean;

  constructor(private _wmsInventoryService: WmsInventoryService,
    private _stockAllotmentService: StockCountingAllotmentService) {

    this.noData = "noData";
    if (window.innerWidth < 768) {
      this.isMobileResolution = true;
    } else {
      this.isMobileResolution = false;
    }
  }

  ngOnInit(): void {
    this.operatorId = 4;
    this.bindOperator2RowData(this.operatorId);
    this.loadOperator2Inventory(this.operatorId);
  }

  bindOperator2RowData(operatorId: number) {
    debugger;
    this._stockAllotmentService.getOperator2StockAllotments(operatorId).subscribe((result: any) => {
      if (result != null) {
        this.rowResult = result;
      }
      // if (result != null) {
      //   this.rowResult = result.filter(o => o.operatorId2 == operatorId && ((o.isOper1Start && o.isOper1Complete) && (o.isOper2Start && !o.isOper2Complete)));
      //   if (this.rowResult.length == 0) {
      //     this.rowResult = result.filter(o => o.operatorId2 == operatorId && ((o.isOper1Start && o.isOper1Complete) && (!o.isOper2Start && !o.isOper2Complete)));
      //   }
      // }
    });
  }

  loadOperator2Inventory(operatorId: number) {
    this._stockAllotmentService.GetOperator2Inventory(operatorId).subscribe((data: any[]) => {
      this.operatorInventory = data;
    });
  }

  onRowDataSelected(rowData: any) {
    if (rowData !== undefined) {
      this.selectedRow = rowData;
      this.allInventory = this.operatorInventory.filter(o => o.row === rowData);
    }
    else {
      this.selectedRow = undefined;
      this.allInventory = [];
    }

    // if (rowData.target.value !== 'NoData' && rowData.target.value !== 'Select a row') {
    //   debugger;
    //   this.selectedRow = rowData.target.value;
    //   this.allInventory = this.operatorInventory.filter(o => o.row === rowData.target.value);
    // }
    // else {
    //   this.selectedRow = undefined;
    //   this.allInventory = [];
    // }
  }

  EditData(inv: any) {
    let foundItem = this.allInventory.find(o => o.isEdit == true);
    if (foundItem != undefined) {
      foundItem.isEdit = false;
    }
    inv.isEdit = true;
  }

  close(inv: any) {
    inv.isEdit = false;
  }

  UpdateData(inv: any) {
    inv.isEdit = false;
    inv.actualFinal = (inv.actualB == undefined || inv.actualB == 0) ? (inv.actualA == undefined ? 0 : inv.actualA) : inv.actualB;
    inv.diffFinal = (inv.actualFinal == undefined ? 0 : inv.actualFinal) - (inv.onHand_WMS == undefined ? 0 : inv.onHand_WMS);
    inv.actualBUpdated = true;

    let updateRequest: any = {
      row: inv.row
    }

    this._wmsInventoryService.UpdateInventory(inv).pipe(
      map((result: boolean) => { return result; }),
      mergeMap(res => iif(() => (res == true), this._stockAllotmentService.checkAndUpdateOper2RowInProcess(updateRequest))
      )
    ).subscribe(posts => {
      console.log('Data saved successfully');
    });

  }

  submitRow() {
    debugger;
    if (this.selectedRow !== undefined) {
      this._stockAllotmentService.updateOerator2RowComplete(this.operatorId).subscribe((result: any) => {
        debugger;
        if (result) {
          this.bindOperator2RowData(this.operatorId);
          this.selectedRow = undefined;
          this.allInventory = [];
          console.log('Row submitted successfully');
        }
        else {
          console.log('Please complete all jobs before submit the row.');
        }
      })
    }
  }

}
