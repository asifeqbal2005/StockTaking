import { Component, OnInit } from '@angular/core';
import { SecurityService } from './shared/services/security.service';
import { ConfigurationService } from './shared/services/configuration.service';
import { LoaderService } from './shared/services/loader.service';
import { MsalService } from '@azure/msal-angular';
import { NavigationService } from './shared/services/navigation.service';
import { AzureService } from './shared/services/azure.service';
import { AuthenticationResult } from '@azure/msal-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  title = 'app';
  settingsLoaded = false;
  isIframe = false;
  loggedIn = false;
  loggedout = false;
  subscription: any;
  message: string;
  //modalRef: NgbModalRef;

  anonymousPages: string[] = ['log-out'];
  constructor(public securityService: SecurityService,
    public azureService: AzureService,
    private configurationService: ConfigurationService,
    public loaderService: LoaderService,    
    private authService: MsalService,
    private navigationService: NavigationService) {

  }

  ngOnInit() {
    
    console.log('app on init');
    if (!this.IsAnonymousPage()) {
      this.isIframe = window !== window.parent && !window.opener;
      this.loaderService.show();
      this.authService.handleRedirectObservable().subscribe({
        next: (result: AuthenticationResult) => {
          if (!!result && this.authService.instance.getAllAccounts().length > 0) {
            this.loggedIn = true;
            this.securityService.SetAuthorizationData(result.accessToken);
            this.authService.instance.setActiveAccount(result.account);
            this.azureService.loginWithRedirectAcquireToken();
          } else {
            this.azureService.login();
          }
        },
        error: (error) => console.log(error)
      });
    }
    else {
      this.loggedout = true;
    }

    //Get configuration from server environment variables:
    this.subscription = this.securityService.authenticationChallenge$.subscribe(res => {
      if (res) {
        this.loaderService.exclusiveRun = true;
        this.loaderService.show();
        this.loggedout = false;        
        this.configurationService.load();
      } else {
        this.loaderService.hide();
      }
    });

    this.navigationService.getMessage().subscribe(message => {
      this.message = message;
    });
  }

  IsAnonymousPage(): boolean {
    let anonPage = false;
    this.anonymousPages.forEach((Object) => {
      if (!(window.location.href.indexOf(Object) === -1)) {
        anonPage = true;
      }
    });

    return anonPage;
  }

  ngOnDestroy() {
    // this.broadcastService.getMSALSubject().next(1);
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
