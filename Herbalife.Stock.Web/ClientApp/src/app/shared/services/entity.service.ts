import { Injectable } from '@angular/core';
import { DataService } from "./data.service";
import { ConfigurationService } from "./configuration.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})

export class EntityService {
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

  saveEntity(request: any) {
    let url = this.baseUrl + '/api/Entity/SaveEntity';
    return this.http.post(url, JSON.stringify(request));
  }

  updateEntity(request: any) {
    let url = this.baseUrl + '/api/Entity/UpdateEntity';
    return this.http.post(url, JSON.stringify(request));
  }

  getEntities() {
    let url = this.baseUrl + '/api/Entity/GetEntities';
    return this.http.get(url);
  }

  GetEntityById(id) {
    let url = this.baseUrl + '/api/Entity/GetEntityById?id=' + id;
    return this.http.get(url);
  }


  deleteEntity(id) {
    let url = this.baseUrl + '/api/Entity/DeleteEntityById?id=' + id;
    return this.http.get(url);
  }

  GetParentEntities() {
    let url = this.baseUrl + '/api/Entity/GetParentEntities';
    return this.http.get(url);
  }


  GetCountries(entityName: string = "EntityMaster") {
    let url = this.baseUrl + '/api/Master/GetCountry/entityName/' + entityName;
    return this.http.get(url);
  }

  GetCityByRegionId(countryId: any, entityName: string = "EntityMaster") {
    let url = this.baseUrl + '/api/Master/GetCityByRegionId/entityName/' + entityName;
    return this.http.post(url, countryId);
  }

  GetRegionByCountryId(cityId: any, entityName: string = "EntityMaster") {
    let url = this.baseUrl + '/api/Master/GetRegionByCountryId/entityName/' + entityName;
    return this.http.post(url, cityId);
  }

}

