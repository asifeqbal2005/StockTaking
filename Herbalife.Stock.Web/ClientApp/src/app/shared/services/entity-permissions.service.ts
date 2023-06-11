import { Injectable } from '@angular/core';
import { DataService } from "./data.service";
import { ConfigurationService } from "./configuration.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import * as _ from "lodash";
import { EntityPermission, EntityPermissionFilter } from '../../components/administration/entity-permissions/entity-permissions.model';

@Injectable({
  providedIn: 'root'
})

export class EntityPermissionsService {
  public entityUrl: string = '';
  public apiController: string = '/api/EntityPermissions/';
  constructor(private dataService: DataService, private configurationService: ConfigurationService, private http: HttpClient) {
  }

  getLookupsByTypeId(): any {
    this.entityUrl = this.configurationService.serverSettings.policyClaimsAgentUrl + this.apiController + 'getLookupsByTypeId';
    return this.dataService.get(this.entityUrl);
  }

  getAllEntityPermissions() {
    this.entityUrl = this.configurationService.serverSettings.policyClaimsAgentUrl + this.apiController;
    return this.dataService.get(this.entityUrl);
  }

  getEntityPermissionsItemByName(name: string): any {
    this.entityUrl = this.configurationService.serverSettings.policyClaimsAgentUrl + this.apiController + 'entityPermissionByName';
    return this.dataService.get(this.entityUrl, { entityName: name });
  }

  getEntityPermissionByTypeId(id: number): any {
    this.entityUrl = this.configurationService.serverSettings.policyClaimsAgentUrl + this.apiController + 'entityPermissionById';
    return this.dataService.get(this.entityUrl, { entityPermissionId: id });
  }

  putEntityPermissions(entityPermission: EntityPermission) {
    this.entityUrl = this.configurationService.serverSettings.policyClaimsAgentUrl + this.apiController + "updateEntityPermission";
    let body = JSON.stringify(entityPermission);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    let options = {
      headers: headers
    }
    return this.http.put<any>(this.entityUrl, entityPermission, options);
  }

  getAllEntityPermissionsItems(data: EntityPermissionFilter) {
    this.entityUrl = this.configurationService.serverSettings.policyClaimsAgentUrl + this.apiController+ "getAllEntityPermissionItem";
    let body = JSON.stringify(data);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    let options = {
      headers: headers
    }
    return this.http.post<any>(this.entityUrl, data, options);
  }

  deleteEntityPermissionItem(entityPermission: EntityPermission) {
    this.entityUrl = this.configurationService.serverSettings.policyClaimsAgentUrl + this.apiController + "deleteEntityPermissionItem";
    let body = JSON.stringify(entityPermission);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    let options = {
      headers: headers
    }
    return this.http.post<any>(this.entityUrl, entityPermission, options);
  }
}
