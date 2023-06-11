import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigurationService } from "./configuration.service";
import { StockOnHandModel } from '../models/stock-allotment.model';

@Injectable({
  providedIn: 'root'
})
export class WmsInventoryService {

  options: any;
  baseUrl: string;

  constructor(private http: HttpClient, private configurationService: ConfigurationService) {
    this.options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    this.baseUrl = this.configurationService.serverSettings.policyClaimsAgentUrl;
  }

  UploadExcel(formData: FormData) {

    let headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    const httpOptions = { headers: headers };

    return this.http.post<any>(this.baseUrl + '/api/Inventory/uploadInventoryFile', formData, httpOptions);
  }

  BindInventoryDetails(): Observable<any> {
    return this.http.get<any>(this.baseUrl + '/api/Inventory/bindInventoryDetails');
  }

  getRowDataToFilter(): Observable<any> {
    return this.http.get<any>(this.baseUrl + '/api/Inventory/getRowDataToFilter');
  }

  getSupervisorInventory(): Observable<any> {
    return this.http.get<any>(this.baseUrl + '/api/Inventory/getSupervisorInventory');
  }

  UpdateInventory(request: any) {
    let url = this.baseUrl + '/api/Inventory/UpdateInventory';
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    let options = {
      headers: headers
    }
    return this.http.put<any>(url, request, options);
  }

  getStockOnHandInventory(): Observable<StockOnHandModel[]> {
    return this.http.get<StockOnHandModel[]>(this.baseUrl + '/api/Inventory/getStockOnHandInventory');
  }

}
