import { Injectable } from '@angular/core';
import { DataService } from "./data.service";
import { ConfigurationService } from "./configuration.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { UserGroup } from '../../components/administration/usergroup/usergroup.model';


@Injectable({
  providedIn: 'root'
})
export class UserGroupService {
  options: any;
  baseUrl: string;

  constructor(
    private dataService: DataService, private configurationService: ConfigurationService, private http: HttpClient) {

    this.options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    this.baseUrl = this.configurationService.serverSettings.policyClaimsAgentUrl;
  }

  getClaimHandlers(): any {
    let url = this.baseUrl + '/api/userGroup/getClaimHandlers';
    return this.dataService.get(url);
  }

  getAllClaimHandler(data: UserGroup) {
    let options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }

    let url = this.baseUrl + '/api/userGroup/getAllClaimHandler';    
    return this.http.post<any>(url, data, options);
  }  

  getAllUserGroup(): any {
    let url = this.baseUrl + '/api/userGroup/getAllUserGroup';
    return this.dataService.get(url);
  }

  createUserGroup(data) {
    let url = this.baseUrl + '/api/userGroup/createUserGroup';
    return this.http.post<any>(url, data, this.options);
  }

  updateUserGroup(data) {
    let url = this.baseUrl + '/api/userGroup/updateUserGroup';
    return this.http.post<any>(url, data, this.options);
  }

  deleteUserGroup(data) {
    let url = this.baseUrl + '/api/userGroup/deleteUserGroup';
    return this.http.post<any>(url, data, this.options);
  }

  getUserGroupList(): any {
    let url = this.baseUrl + '/api/GroupMaster/getGroupList';
    return this.dataService.get(url);
  }

}
