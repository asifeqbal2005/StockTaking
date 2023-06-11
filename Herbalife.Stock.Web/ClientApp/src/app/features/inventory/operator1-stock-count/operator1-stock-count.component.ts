import { Component, OnInit } from '@angular/core';
import { WmsInventoryService } from '../../../shared/services/wms-inventory.service';
import { StockCountingAllotmentService } from '../../../shared/services/stock-counting-allotment.service';
import { map, mergeMap } from 'rxjs/operators';
import { iif } from 'rxjs';

@Component({
  selector: 'app-operator1-stock-count',
  templateUrl: './operator1-stock-count.component.html',
  styleUrls: [
    './operator1-stock-count.component.css',
    '../../../../assets/css/bootstrap-datetimepicker.min.css',
    '../../../../assets/css/bootstrap-theme.css',
    '../../../../assets/css/bootstrap-theme.min.css'
  ]
})

export class Operator1StockCountComponent implements OnInit {
  rowResult: any;
  operatorInventory: any[] = [];
  allInventory: any[] = [];
  pageSize: number = 10;
  isEdit!: boolean;
  operatorId: number;
  p: number = 1;
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
    this.operatorId = 3; /// Boddu
    this.bindOperator1RowData(this.operatorId);
    this.loadOperator1Inventory(this.operatorId);
  }

  bindOperator1RowData(operatorId: number) {
    this._stockAllotmentService.getOperator1StockAllotments(operatorId).subscribe((result: any) => {
      if (result != null) {
        this.rowResult = result;
      }
      // if (result != null) {
      //   this.rowResult = result.filter(o => o.operatorId1 == operatorId && (o.isOper1Start && !o.isOper1Complete));
      //   if (this.rowResult.length == 0) {
      //     this.rowResult = result.filter(o => o.operatorId1 == operatorId && (!o.isOper1Start && !o.isOper1Complete));
      //   }
      // }
    });
  }

  loadOperator1Inventory(operatorId: number) {
    this._stockAllotmentService.GetOperator1Inventory(operatorId).subscribe((data: any[]) => {
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
    inv.diffA = ((inv.actualA == undefined ? 0 : inv.actualA) - (inv.onHand_WMS == undefined ? 0 : inv.onHand_WMS));
    inv.actualFinal = (inv.actualB == undefined || inv.actualB == 0) ? (inv.actualA == undefined ? 0 : inv.actualA) : inv.actualB;
    inv.diffFinal = (inv.actualFinal == undefined ? 0 : inv.actualFinal) - (inv.onHand_WMS == undefined ? 0 : inv.onHand_WMS);
    inv.actualAUpdated = true;

    let updateRequest: any = {
      row: inv.row
    }

    this._wmsInventoryService.UpdateInventory(inv).pipe(
      map((result: boolean) => { return result; }),
      mergeMap(res => iif(() => (res == true), this._stockAllotmentService.checkAndUpdateOper1RowInProcess(updateRequest))
      )
    ).subscribe(posts => {
      console.log('Data saved successfully');
    });

    // this._wmsInventoryService.UpdateInventory(inv).pipe(
    //   map((result: boolean) => { return result; }),
    //   mergeMap(res => iif(() => (res == true), this._stockAllotmentService.checkOerator1RowInProcess(this.operatorId)
    //     .pipe(map(isFound => {
    //       return isFound
    //     }), mergeMap(isRowInProcess => iif(() => isRowInProcess == false, this._stockAllotmentService.updateOperator1RowStart(toUpdateRequest)))))
    //   )
    // ).subscribe(posts => {
    //   console.log('Data saved successfully');
    // });

  }

  submitRow() {
    if (this.selectedRow !== undefined) {
      this._stockAllotmentService.updateOerator1RowComplete(this.operatorId).subscribe((result: any) => {
        if (result) {
          this.bindOperator1RowData(this.operatorId);
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
