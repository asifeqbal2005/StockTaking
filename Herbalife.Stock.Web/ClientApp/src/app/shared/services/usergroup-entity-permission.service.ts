import { Injectable } from '@angular/core';
import { DataService } from "./data.service";
import { ConfigurationService } from "./configuration.service";
import { StorageService } from "./storage.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UserGroupEntityPermissionService {
    options: any;
    baseUrl = "";
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

    SaveUserGroupEntity(request: any) {
        let url = this.baseUrl + '/api/UserGroupEntity/SaveUserGroupEntity/';
        return this.http.post(url, JSON.stringify(request));
    }

    UpdateUserGroupEntity(request: any) {
        let url = this.baseUrl + '/api/UserGroupEntity/UpdateUserGroupEntity/';
        return this.http.post(url, JSON.stringify(request));
    }

    GetUserGroupEntitys() {
        let url = this.baseUrl + '/api/UserGroupEntity/GetUserGroupEntitys/';
        return this.http.post(url, null);
    }

    GetUserGroupEntityById(id) {
        let url = this.baseUrl + '/api/UserGroupEntity/GetUserGroupEntityById?groupId=' + id;
        return this.http.get(url);
    }


    DeleteUserGroupEntityById(id) {
        let url = this.baseUrl + '/api/UserGroupEntity/DeleteUserGroupEntityById?id=' + id;
        return this.http.get(url);
    }

    GetUserGroup() {
        let url = this.baseUrl + '/api/UserGroupEntity/GetUserGroups';
        return this.http.get(url);
    }

    GetEntities() {
        let url = this.baseUrl + '/api/UserGroupEntity/GetEntities';
        return this.http.post(url, null);
    }

    GetCountries() {
        let url = this.baseUrl + '/api/Master/GetCountry';
        return this.http.get(url);
    }

    GetCityByCountryId(countryId: any) {
        let url = this.baseUrl + '/api/Master/GetCityByCountryId?countryId=' + countryId;
        return this.http.post(url, countryId);
    }

    GetRegionByCityId(cityId: any) {
        let url = this.baseUrl + '/api/Master/GetRegionByCityId?cityId=' + cityId;
        return this.http.post(url, cityId);
    }


}
