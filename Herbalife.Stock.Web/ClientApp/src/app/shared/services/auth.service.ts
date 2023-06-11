import { Injectable } from '@angular/core';
import { ConfigurationService } from './configuration.service';
import { DataService } from './data.service';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { SecurityService } from './security.service';

@Injectable()
export class AuthService {
  private authUrl = '/api/auth/'

  constructor(private service: DataService, private configurationService: ConfigurationService, private http: HttpClient, private securityService: SecurityService) {
    if (this.configurationService.isReady || this.configurationService.serverSettings !== undefined)
      this.authUrl = this.configurationService.serverSettings.policyClaimsAgentUrl + this.authUrl;
    else
      this.configurationService.settingsLoaded$.subscribe(() => this.authUrl = this.configurationService.serverSettings.policyClaimsAgentUrl + this.authUrl);
  }


  checkClaimAccessiblity(claimId: number, organisationId: number): object {
    //let url = this.authUrl + 'isClaimAccessible? claimId=' + claimId + '& handlingOrganisationId= ' + organisationId
    const url = this.authUrl + 'isClaimAccessible';
    return this.service.get(url, { claimId: claimId , handlingOrganisationId: organisationId}).pipe<object>(tap((response: object) => {
      return response;
    }));
  }

  checkPolicyAccessiblity(PolicyId: number, organisationId: number): object {
    //let url = this.authUrl + 'isClaimAccessible? claimId=' + claimId + '& handlingOrganisationId= ' + organisationId
    const url = this.authUrl + 'isPolicyAccessible';
    return this.service.get(url, { policyId: PolicyId, handlingOrganisationId: organisationId }).pipe<object>(tap((response: object) => {
      return response;
    }));
  }
}
