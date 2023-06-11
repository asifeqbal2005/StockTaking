import { Injectable } from '@angular/core';
import { DataService } from "./data.service";
import { ConfigurationService } from "./configuration.service";

import { HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  options: any;
  baseUrl: string;
  constructor(
    private configurationService: ConfigurationService,
    private http: DataService) {
    this.options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    this.baseUrl = this.configurationService.serverSettings.policyClaimsAgentUrl;
  }

  GetAllCountries() {
    let url = this.baseUrl + '/api/Country/GetCountries';
    return this.http.get(url);
  }

  GetCountryById(id) {
    let url = this.baseUrl + '/api/Country/GetCountryById?id=' + id;
    return this.http.get(url);
  } 
  
  addCountry(request: any) {
    let url = this.baseUrl + '/api/Country/AddCountry';
    return this.http.post(url, JSON.stringify(request));
  }
  
  updateCountry(request: any) {
    let url = this.baseUrl + '/api/Country/UpdateCountry';
    return this.http.post(url, JSON.stringify(request));
  }

  deleteCountry(id) {
    let url = this.baseUrl + '/api/Country/deleteCountry/'+id;
    return this.http.get(url);
  }
  
}
