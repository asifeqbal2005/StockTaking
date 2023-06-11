import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ConfigurationService } from './configuration.service';
import { DataService } from './data.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class DMSService {

  private claimHandlerUrl: string = "/api/dms/";

  constructor(private dataService: DataService, private configurationService: ConfigurationService, private http: HttpClient) {
    if (this.configurationService.isReady || this.configurationService.serverSettings != undefined)
      this.claimHandlerUrl = this.configurationService.serverSettings.policyClaimsAgentUrl + this.claimHandlerUrl;
    else
      this.configurationService.settingsLoaded$.subscribe(x => this.claimHandlerUrl = this.configurationService.serverSettings.policyClaimsAgentUrl + this.claimHandlerUrl);

  }
  getDMSURL() {
    let url = this.claimHandlerUrl;
    return this.dataService.get(url);
  }
  //getClaimHandler(claimHandlerId: any) {
  //  let url = this.claimHandlerUrl + "getClaimHandlerById";
  //  return this.dataService.get(url, { claimHandlerId: claimHandlerId });
  //}
}
