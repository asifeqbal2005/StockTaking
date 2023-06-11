import { Injectable } from '@angular/core';
import { DataService } from "./data.service";
import { ConfigurationService } from "./configuration.service";
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LocatorService {
  options: any;
  baseUrl: string;

  constructor(private configurationService: ConfigurationService, private http: DataService) {
    this.baseUrl = this.configurationService.serverSettings.policyClaimsAgentUrl;

    this.options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
  }

  getAllLocators() {
    let url = this.baseUrl + '/api/Locator/getLocators';
    return this.http.get(url);
  }

  insertLocator(request: any) {
    let url = this.baseUrl + '/api/Locator/insertLocator';
    return this.http.post(url, JSON.stringify(request));
  }

  updateLocator(request: any) {
    let url = this.baseUrl + '/api/Locator/updateLocator';
    return this.http.post(url, JSON.stringify(request));
  }

  deleteLocator(locatorid) {
    let url = this.baseUrl + '/api/Locator/deleteLocator/'+locatorid;
    return this.http.get(url);
  }


}
