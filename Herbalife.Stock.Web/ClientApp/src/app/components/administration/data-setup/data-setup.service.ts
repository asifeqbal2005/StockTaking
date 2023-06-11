import { Injectable } from '@angular/core';
import { DataService } from 'src/app/shared/services/data.service';
import { ConfigurationService } from 'src/app/shared/services/configuration.service';
import { Lookup, LookupType } from './data-setup.model';

@Injectable({
  providedIn: 'root'
})
export class LookupDatasetupService {
  private lookuptypeUrl: string = '';
  baseUrl: string;

  constructor(private dataService: DataService, private configurationService: ConfigurationService) {
    this.baseUrl = this.configurationService.serverSettings.policyClaimsAgentUrl;
  }

  getAllLookupTypes() {
    this.lookuptypeUrl = this.baseUrl + '/api/lookupType';
    return this.dataService.get(this.lookuptypeUrl);
  }

  getLookupsByTypeId(id: number): any {
    let lookupUrl = this.baseUrl + '/api/lookup/' + 'getLookupsByTypeId?id=' + id;
    return this.dataService.get(lookupUrl);
  }

  postLookup(lookup: Lookup) {
    let url = this.baseUrl + '/api/lookup/' + "createLookup";
    return this.dataService.post(url, lookup);
  }

  putLookup(lookup: Lookup) {
    let url = this.baseUrl + '/api/lookup/' + "updateLookup";
    return this.dataService.putWithId(url, lookup);
  }

  postLookupType(lookup: LookupType) {
    let url = this.baseUrl + '/api/LookupType/' + "createLookupType";
    return this.dataService.post(url, lookup);
  }

  putLookupType(lookup: LookupType) {
    let url = this.baseUrl + '/api/LookupType/' + "updateLookupType";
    return this.dataService.putWithId(url, lookup);
  }

  deleteLookupItem(lookup: Lookup) {
    let url = this.baseUrl + '/api/lookup/' + "deleteLookupItem";
    return this.dataService.post(url, lookup);
  }

}
