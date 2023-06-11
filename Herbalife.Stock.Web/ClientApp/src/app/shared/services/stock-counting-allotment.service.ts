import { Injectable } from '@angular/core';
import { DataService } from "./data.service";
import { ConfigurationService } from './configuration.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StockCountingAllotmentService {
  
  baseUrl: string; 

  constructor(private dataService: DataService,
    private configurationService: ConfigurationService) {
    this.baseUrl = this.configurationService.serverSettings.policyClaimsAgentUrl;
  }

  getStockAllotments(){
    let resourceUrl = this.baseUrl + '/api/StockAllotment/getStockAllotments';
    return this.dataService.get(resourceUrl);
  }

  getAssignedStockAllotments()
  {
    let resourceUrl = this.baseUrl + '/api/StockAllotment/getAssignedStockAllotments';
    return this.dataService.get(resourceUrl);
  }

  getUnassignedStockAllotments()
  {
    let resourceUrl = this.baseUrl + '/api/StockAllotment/getUnassignedStockAllotments';
    return this.dataService.get(resourceUrl);
  }

  saveStockAllotment(data: any) {
    let resourceUrl = this.baseUrl + '/api/StockAllotment/saveStockAllotment';
    return this.dataService.post(resourceUrl, data);
  }  

  GetOperator1Inventory(operatorId: number): Observable<any> {
    let resourceUrl = this.baseUrl + '/api/StockAllotment/getOperatorInventoryData/'+ operatorId;
    return this.dataService.get(resourceUrl);
  }

  GetOperator2Inventory(operatorId: number): Observable<any> {
    let resourceUrl = this.baseUrl + '/api/StockAllotment/getOperator2InventoryData/'+ operatorId;
    return this.dataService.get(resourceUrl);
  }

  // updateOperator1RowStart(data: any) {
  //   let resourceUrl = this.baseUrl + '/api/StockAllotment/updateOper1StockRowStart';
  //   return this.dataService.post(resourceUrl, data);
  // }

  // checkOerator1RowInProcess(operatorId: number): Observable<any> {
  //   let resourceUrl = this.baseUrl + '/api/StockAllotment/checkOerator1RowInProcess/'+ operatorId;
  //   return this.dataService.get(resourceUrl);
  // }

  // checkOerator2RowInProcess(operatorId: number): Observable<any> {
  //   let resourceUrl = this.baseUrl + '/api/StockAllotment/checkOerator2RowInProcess/'+ operatorId;
  //   return this.dataService.get(resourceUrl);
  // }

  // updateOperator2RowStart(data: any) {
  //   let resourceUrl = this.baseUrl + '/api/StockAllotment/updateOper2StockRowStart';
  //   return this.dataService.post(resourceUrl, data);
  // }

  checkAndUpdateOper1RowInProcess(data: any) {
    let resourceUrl = this.baseUrl + '/api/StockAllotment/checkAndUpdateOper1RowInProcess';
    return this.dataService.post(resourceUrl, data);
  }

  checkAndUpdateOper2RowInProcess(data: any) {
    let resourceUrl = this.baseUrl + '/api/StockAllotment/checkAndUpdateOper2RowInProcess';
    return this.dataService.post(resourceUrl, data);
  }

  updateOerator1RowComplete(operatorId: number): Observable<any> {
    let resourceUrl = this.baseUrl + '/api/StockAllotment/updateOerator1RowComplete/'+ operatorId;
    return this.dataService.get(resourceUrl);
  }

  updateOerator2RowComplete(operatorId: number): Observable<any> {
    let resourceUrl = this.baseUrl + '/api/StockAllotment/updateOerator2RowComplete/'+ operatorId;
    return this.dataService.get(resourceUrl);
  }

  getSupervisorSubmitStockRow(): Observable<any> {
    return this.dataService.get(this.baseUrl + '/api/StockAllotment/getSupervisorSubmitStockRow');
  }

  getOperator1StockAllotments(operatorId: number): Observable<any> {
    let resourceUrl = this.baseUrl + '/api/StockAllotment/getOperator1StockAllotments/'+ operatorId;
    return this.dataService.get(resourceUrl);
  }

  getOperator2StockAllotments(operatorId: number): Observable<any> {
    let resourceUrl = this.baseUrl + '/api/StockAllotment/getOperator2StockAllotments/'+ operatorId;
    return this.dataService.get(resourceUrl);
  }

  submitRowBySupervisor(data: any) {
    let resourceUrl = this.baseUrl + '/api/StockAllotment/submitStockRowBySupervisor';
    return this.dataService.post(resourceUrl, data);
  }

  getManagerSubmitStockRow(): Observable<any> {
    return this.dataService.get(this.baseUrl + '/api/StockAllotment/getManagerSubmitStockRow');
  }

  submitStockRowByManager(data: any) {
    let resourceUrl = this.baseUrl + '/api/StockAllotment/submitStockRowByManager';
    return this.dataService.post(resourceUrl, data);
  }  

}
