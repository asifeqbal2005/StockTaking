import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { ConfigurationService } from './configuration.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AutoEmailSetupService {
  private settingUrl = '';
  constructor(private dataService: DataService, private configurationService: ConfigurationService, private http: HttpClient) { }

  
  putHandlingOrganisationSetting(data): object {

    const url = this.configurationService.serverSettings.policyClaimsAgentUrl + '/api/handlingOrganisationSetting/' + "updateHOSetting";

    return this.dataService.putWithId(url, data);
  } 

}
