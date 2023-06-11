import { Component, OnInit } from '@angular/core';
import { StockAllotmentModel } from '../../../shared/models/stock-allotment.model';
import { UserGroupService } from '../../../shared/services/usergroupservice';
import { StockCountingAllotmentService } from '../../../shared/services/stock-counting-allotment.service';
import { NotificationService } from '../../../shared/services/notification.service';

@Component({
  selector: 'app-stock-counting-allotment',
  templateUrl: './stock-counting-allotment.component.html',
  styleUrls: ['./stock-counting-allotment.component.css']
})
export class StockCountingAllotmentComponent implements OnInit {

  stockAllotmentRecords: StockAllotmentModel[];
  isShown: boolean = false;
  inputData: any = {};
  operator1Result: any[];
  operator2Result: any[];
  isEditMode: boolean = false;
  pageSize: number = 10;
  p: number = 1;

  constructor(
    private userService: UserGroupService,
    private notificationService: NotificationService,
    private stockAllotmentService: StockCountingAllotmentService) {

  }

  ngOnInit(): void {
    this.inputData = {};
    this.getOperator1List();
    this.getStockAllotments();
  }

  getStockAllotments() {
    this.stockAllotmentService.getStockAllotments().subscribe((result: any) => {
      if (result != null) {
        this.stockAllotmentRecords = result.filter(o => o.row != null);
      }
    });
  }

  bindStockAllotments(rowResult: any) {
    let stockAllotmentArray: StockAllotmentModel[] = [];
    rowResult.forEach(function (rowItem) {
      if (rowItem != null && rowItem != undefined && rowItem.row != null) {
        stockAllotmentArray.push({ row: rowItem.row, operatorId1: rowItem.operatorId1, operatorId2: rowItem.operatorId2 })
      }
    });
    this.stockAllotmentRecords = stockAllotmentArray;
  }

  getOperator1List() {
    this.userService.getClaimHandlers().subscribe((response: any) => {
      if (response.data != null) {
        this.operator1Result = response.data.filter(o => o.groupName == 'Operator');
      }
    });
  }

  getOperator2List(operator1: any) {
    this.userService.getClaimHandlers().subscribe((response: any) => {
      if (response.data != null) {
        this.operator2Result = response.data.filter(o => o.groupName == 'Operator' && o.userId != operator1);
      }
    });
  }

  onOperator1Change(operatorId1: any) {
    this.inputData.operatorId2 = 0;
    this.getOperator2List(operatorId1);
  }

  onEditAllotment(item: any) {
    this.inputData = {};
    this.inputData.row = item.row;
    this.inputData.operatorId1 = item.operatorId1;

    this.getOperator2List(this.inputData.operatorId1);
    this.inputData.operatorId2 = item.operatorId2;

    this.isShown = true;
    this.isEditMode = true;
  }

  onSubmit() {
    if (this.inputData.operatorId1 == this.inputData.operatorId2) {
      this.inputData.operatorId2 = 0;
      this.notificationService.printSuccessMessage('You cannot assign same operator to both operators.');
      return;
    }

    this.stockAllotmentService.saveStockAllotment(this.inputData).subscribe((result: any) => {
      if (result) {
        this.notificationService.printSuccessMessage('Item saved');
        this.cancelStockAllotment();
        this.getStockAllotments();
      }
    }, error => {
      this.notificationService.printSuccessMessage(`status: ${error.status}, ` +
        `statusText: ${error.statusText}, ` +
        `message: ${error.message}`);
    })

  }

  cancelStockAllotment() {
    this.isShown = false;
    this.inputData = {};
  }


}
