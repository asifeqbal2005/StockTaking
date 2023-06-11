import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ConfigurationService } from './configuration.service';
import { StorageService } from './storage.service';
import { MsalService } from '@azure/msal-angular';
import { enumUserRole } from '../models/common.enum';
import { environment } from 'src/environments/environment';
import { InteractionRequiredAuthError } from '@azure/msal-common';

@Injectable()
export class SecurityService {

  private actionUrl: string;
  private headers: HttpHeaders;
  private storage: StorageService;
  private authenticationSource = new Subject<boolean>();
  authenticationChallenge$ = this.authenticationSource.asObservable();
  private userDataLoaded = new Subject<boolean>();
  userDataLoaded$ = this.userDataLoaded.asObservable();
  private authorityUrl = '';
  private menuCrudPermission = new Subject<any>();
  loginDisplay: boolean;
  public IsAuthorized: boolean;
  public UserData: any;

  constructor(
    private _http: HttpClient,
    private _router: Router,
    private _configurationService: ConfigurationService,
    private _storageService: StorageService,
    private authService: MsalService) {

    this.headers = new HttpHeaders();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.storage = _storageService;

    if (this.storage.retrieve('IsAuthorized') !== '') {
      this.IsAuthorized = this.storage.retrieve('IsAuthorized');
      this.authenticationSource.next(true);
      this.UserData = this.storage.retrieve('userData');
    }
    this.storage.removeItem('isAuthorizeById');
  }

  public GetToken(): any {
    return this.storage.retrieve('authorizationDataIdToken');
  }

  public ResetAuthorizationData() {
    this.storage.clear();
  }

  public getUserData() {
    return this.storage.retrieve('userData');
  }

  public SetAuthorizationData(id_token: any) {
    this.storage.store('authorizationDataIdToken', id_token);
    this.IsAuthorized = true;
    this.storage.store('IsAuthorized', true);
    this.authenticationSource.next(true);
  }

  public callGetUserRequest() {
    this.getUserDataFromServer()
      .subscribe(data => {
        this.storage.store('isAuthorizeById', true);
        this.UserData = data;
        this.storage.store('userData', data);
        // emit observable
        if (this.UserData == null) {
          this._router.navigate(['access-denied']);
        }
        this.userDataLoaded.next(true);
        this.authenticationSource.next(true);
      },
        error => this.HandleError(error),
        () => {
          console.log(this.UserData);
        });
  }

  get isAuthorizeById() {
    return this.storage.retrieve('isAuthorizeById');
  }

  public HandleError(error: any) {
    console.log(error);
    if (error.status == 403) {
      this._router.navigate(['/Forbidden']);
    }
    else if (error.status == 401) {
      this._router.navigate(['/Unauthorized']);
    }
  }

  private urlBase64Decode(str: string) {
    let output = str.replace('-', '+').replace('_', '/');
    switch (output.length % 4) {
      case 0:
        break;
      case 2:
        output += '==';
        break;
      case 3:
        output += '=';
        break;
      default:
        throw 'Illegal base64url string!';
    }
    return window.atob(output);
  }

  public getUserDataFromServer = (): Observable<string[]> => {
    this.authorityUrl = this._configurationService.serverSettings.policyClaimsAgentUrl;
    const options = this.setHeaders();
    const data = {
      accessToken: sessionStorage.getItem("GraphApiToken")
    };
    return this._http.post<string[]>(`${this.authorityUrl}/api/auth/getLoggedInUser`, data, options)
      .pipe<string[]>((info: any) => info);
  }

  private setHeaders(): any {
    const httpOptions = {
      headers: new HttpHeaders()
    };

    httpOptions.headers = httpOptions.headers.set('Content-Type', 'application/json');
    httpOptions.headers = httpOptions.headers.set('Accept', 'application/json');

    const token = this.GetToken();
    if (token !== '') {
      httpOptions.headers = httpOptions.headers.set('Authorization', `Bearer ${token}`);
    }
    return httpOptions;
  }

  checkAccount() {
    return !!this.authService.instance.getAllAccounts();
  }

  login() {
    const isIE = window.navigator.userAgent.indexOf('MSIE ') > -1 || window.navigator.userAgent.indexOf('Trident/') > -1;
    if (isIE) {
      this.authService.loginRedirect();
    } else {
      this.openLoginPopup();
    }
  }

  openLoginPopup() {
    const self = this;
    this.authService.loginPopup()
      .subscribe({
        next: (result) => {
          self.acquireTokenSilent();
        },
        error: (error) => {
          console.log(error)
        }
      });
  }

  acquireTokenSilent() {
    const account = this.authService.instance.getAllAccounts()[0];
    const accessTokenRequest = {
      // scopes: ["api://" + environment.appClientId + "/user.read"],
      scopes: ['GroupMember.Read.All', 'OnlineMeetings.Read', 'OnlineMeetings.ReadWrite', 'openid', 'profile', 'User.Invite.All', 'User.Read', 'User.Read.All', 'User.ReadWrite', 'User.ReadWrite.All', 'email'],
      account: account
    }

    const self = this;
    this.authService.acquireTokenSilent(accessTokenRequest).subscribe((result: any) => {
      let accessToken = result.accessToken;
      sessionStorage.setItem("GraphApiToken", accessToken);
      self.SetAuthorizationData(result.idToken);
    }, error => {
      if (error instanceof InteractionRequiredAuthError) {
        self.authService.acquireTokenPopup(accessTokenRequest).subscribe((result: any) => {
          let accessToken = result.accessToken;
          sessionStorage.setItem("GraphApiToken", accessToken);
          self.SetAuthorizationData(result.idToken);
        }, error => {
          // Acquire token interactive failure
          console.log(error);
        });
      }
    });
  }

  logout() {
    this.authService.logout();
    this.ResetAuthorizationData();
  }

  getAccessOnPage(pagePermissionId: string): boolean {
    let isaccessible = false;
    if (this.getUserData() !== null) {
      let userPermissions: any[] = this.getUserData().userPermission;
      userPermissions = userPermissions.filter(c => c.entityName === pagePermissionId);
      if (userPermissions !== null && userPermissions.length > 0) {
        isaccessible = true;
      }
    }
    return isaccessible;
  }

  getActionPermissionsOnPage(pagePermissionId: string): any[] {
    let permissionsForActions: any[];
    if (this.getUserData() !== null) {
      let userPermissions: any[] = this.getUserData().userPermission;
      userPermissions = userPermissions.filter(c => c.entityName === pagePermissionId);
      if (userPermissions !== null && userPermissions.length > 0) {
        permissionsForActions = userPermissions[0].permission.split('|');
      }
    }
    return permissionsForActions;
  }

  accuireToken() {
    const accessTokenRequest = {
      scopes: ["api://" + environment.appClientId + "/user.read"]
    }

    const accessTokenPromptRequest = {
      scopes: ["api://" + environment.appClientId + "/user.read"],
      prompt: 'login'
    }
    let that = this;
  }

  checkCrudMenuPermissionData() {
    this.menuCrudPermission.next();
  }

  getCrudMenuPermissionData(): Observable<any> {
    return this.menuCrudPermission.asObservable();
  }
}
