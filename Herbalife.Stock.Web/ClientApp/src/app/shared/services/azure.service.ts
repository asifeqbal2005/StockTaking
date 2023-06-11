import { Inject, Injectable } from '@angular/core';
import { MsalService, MsalBroadcastService, MSAL_GUARD_CONFIG, MsalGuardConfiguration } from '@azure/msal-angular';
import { AccountInfo, AuthenticationResult, InteractionStatus, InteractionType, PopupRequest, RedirectRequest } from '@azure/msal-browser';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { SecurityService } from './security.service';

@Injectable({
  providedIn: 'root'
})
export class AzureService {
  loggedIn = false;
  private readonly _destroying$ = new Subject<void>();

  constructor(
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private authService: MsalService,
    private msalBroadcastService: MsalBroadcastService,
    private securityService: SecurityService) { }

  updateLoggedInStatus() {
    this.msalBroadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) => status === InteractionStatus.None),
        takeUntil(this._destroying$)
      )
      .subscribe(() => {
        this.setLoggedIn();
        this.checkAndSetActiveAccount();
      });
  }

  login() {
    if (this.msalGuardConfig.interactionType === InteractionType.Popup) {
      this.loginWithPopup();
    } else {
      this.loginWithRedirect();
    }
  }

  getActiveAccount(): AccountInfo | null {
    return this.authService.instance.getActiveAccount();
  }

  private checkAndSetActiveAccount() {
    /**
    * If no active account set but there are accounts signed in, sets first account to active account
    * To use active account set here, subscribe to inProgress$ first in your component
    * Note: Basic usage demonstrated. Your app may require more complicated account selection logic
    */
    let activeAccount = this.authService.instance.getActiveAccount();

    if (!activeAccount && this.authService.instance.getAllAccounts().length > 0) {
      let accounts = this.authService.instance.getAllAccounts();
      this.authService.instance.setActiveAccount(accounts[0]);
    }
  }

  private setLoggedIn() {
    this.loggedIn = this.authService.instance.getAllAccounts().length > 0;
  }

  public askMailReadPermission() {
    return this.authService.acquireTokenSilent({
      scopes: ['openid', 'user.read', 'offline_access', 'mail.send']
    });
  }

  private loginWithPopup() {
    if (this.msalGuardConfig.authRequest) {
      this.authService.loginPopup({ ...this.msalGuardConfig.authRequest } as PopupRequest)
        .subscribe((response: AuthenticationResult) => {
          this.securityService.SetAuthorizationData(response.accessToken);
          this.authService.instance.setActiveAccount(response.account);
          this.authService.acquireTokenSilent({
            scopes: ['openid', 'user.read', 'offline_access']
          }).subscribe(o => {
            sessionStorage.setItem("GraphApiToken", o.accessToken);
            this.securityService.callGetUserRequest();
          });
        });
    } else {
      this.authService.loginPopup()
        .subscribe((response: AuthenticationResult) => {
          this.authService.instance.setActiveAccount(response.account);
        });
    }
  }

  private async loginWithRedirect() {
    await this.authService.instance.loginRedirect({
      scopes: [`${environment.clientId}/.default`],
      redirectUri: environment.redirectUrl
    });
  }

  public async loginWithRedirectAcquireToken() {
    this.authService.acquireTokenSilent({
      scopes: ['openid', 'user.read', 'offline_access']
    }).subscribe(o => {
      sessionStorage.setItem("GraphApiToken", o.accessToken);
      this.securityService.callGetUserRequest();
    });
  }

  logout() {
    this.authService.logout();
  }

  destroy() {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
