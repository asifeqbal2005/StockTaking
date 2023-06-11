import { Injectable } from '@angular/core';
import { DataService } from "./data.service";
import { ConfigurationService } from "./configuration.service";
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
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

  getAllLocations() {
    let url = this.baseUrl + '/api/Location/getLocations';
    return this.http.get(url);
  }

  insertLocation(request: any) {
    let url = this.baseUrl + '/api/Location/insertLocation';
    return this.http.post(url, JSON.stringify(request));
  }

  updateLocation(request: any) {
    let url = this.baseUrl + '/api/Location/updateLocation';
    return this.http.post(url, JSON.stringify(request));
  }

  deleteLocation(locationid) {
    let url = this.baseUrl + '/api/Location/DeleteLocation/'+locationid;
    return this.http.get(url);
  }
}
