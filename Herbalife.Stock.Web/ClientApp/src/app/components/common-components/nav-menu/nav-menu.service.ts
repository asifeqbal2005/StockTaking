import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from '../../../shared/services/storage.service';
import { ConfigurationService } from '../../../shared/services/configuration.service';
import { DataService } from '../../../shared/services/data.service';
//import { ReserveHistoryService } from '../../../shared/services/reservehistory.service';
//import { DMSService } from '../../../shared/services/dms.service';

@Injectable({
  providedIn: 'root'
})
export class NavMenuService {
  constructor(private http: DataService, private configurationService: ConfigurationService,
    private _storageService: StorageService) {

  }

  GetCountry() {
    let url = this.configurationService.serverSettings.policyClaimsAgentUrl + '/api/Layout/GetCountry';
    return this.http.get(url);
  }

  GetLanguages() {
    let url = this.configurationService.serverSettings.policyClaimsAgentUrl + '/api/Layout/GetLanguages';
    return this.http.get(url);
  }

  changeLanguage(countryId, languageId) {
    let url = this.configurationService.serverSettings.policyClaimsAgentUrl + '/api/Layout/ChangeLanguage/language/' + languageId;
    return this.http.get(url);
  }

  GetParentChildMenu() {
    let url = this.configurationService.serverSettings.policyClaimsAgentUrl + '/api/Entity/GetParentChildMenu';
    return this.http.get(url);
  }

}
