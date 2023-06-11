import { Injectable } from '@angular/core';
import { DataService } from "./data.service";
import { ConfigurationService } from "./configuration.service";
import { HttpHeaders } from "@angular/common/http";
import * as _ from "lodash";


@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  options: any;
  baseUrl: string;

  constructor(
    private configurationService: ConfigurationService,
    private dataService: DataService) {
    this.options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    this.baseUrl = this.configurationService.serverSettings.policyClaimsAgentUrl;
  }

  GetPowerBIAccessToken(reportType) {
    let url = this.configurationService.serverSettings.policyClaimsAgentUrl + '/api/Reports/GetPowerBIAccessToken?reportType=' + reportType;
    return this.dataService.get(url);
  }

  getAllReportType(request) {
    let url = this.configurationService.serverSettings.policyClaimsAgentUrl + '/api/actionPlan/getAllActionPlanType?lookupTypeName=' + request;
    return this.dataService.post(url, JSON.stringify(request));
  }
}
