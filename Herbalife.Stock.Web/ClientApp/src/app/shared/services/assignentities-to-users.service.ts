import { Injectable } from '@angular/core';
import { DataService } from "./data.service";
import { ConfigurationService } from "./configuration.service";
import { StorageService } from "./storage.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import * as _ from "lodash";
import { Subject } from "rxjs";
import { tap } from "rxjs/operators";
import { AssignentitiesToUser, AssignentitiesToUserFilter } from '../../components/administration/assignentities-to-users/assignentities-to-users.model';

@Injectable({
  providedIn: 'root'
})

export class AssignEntitiesToUsersService {
  public entityUrl: string = '';
  public apiController: string = '/api/AssignEntitiesToUsers/';

  constructor(private dataService: DataService, private configurationService: ConfigurationService, private http: HttpClient) {
  }

  getAllClaimHandler() {
    this.entityUrl = this.configurationService.serverSettings.policyClaimsAgentUrl + this.apiController + 'getAllClaimHandler';
    return this.dataService.get(this.entityUrl);
  }

  getAllEntityName() {
    this.entityUrl = this.configurationService.serverSettings.policyClaimsAgentUrl + this.apiController + 'getAllEntityName';
    return this.dataService.get(this.entityUrl);
  }

  getAllAssignEntityToUsersItems(data: AssignentitiesToUserFilter) {
    this.entityUrl = this.configurationService.serverSettings.policyClaimsAgentUrl + this.apiController + "getAllAssignEntityUsersItem";
    let body = JSON.stringify(data);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    let options = {
      headers: headers
    }
    return this.http.post<any>(this.entityUrl, data, options);
  }

  addAddAssignEntityToUser(assignEntity: AssignentitiesToUser) {
    this.entityUrl = this.configurationService.serverSettings.policyClaimsAgentUrl + this.apiController + "addAssignEntityToUser";
    let body = JSON.stringify(assignEntity);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    let options = {
      headers: headers
    }
    return this.http.put<any>(this.entityUrl, assignEntity, options);
  }

  deleteAssignEntityToUserItem(assignEntity: AssignentitiesToUser) {
    this.entityUrl = this.configurationService.serverSettings.policyClaimsAgentUrl + this.apiController + "deleteAssignEntityToUserItem";
    let body = JSON.stringify(assignEntity);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    let options = {
      headers: headers
    }
    return this.http.post<any>(this.entityUrl, assignEntity, options);
  }
}

