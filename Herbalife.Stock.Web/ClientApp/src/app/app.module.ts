import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app.component';
import { NgForm } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { NgxMaskModule } from 'ngx-mask'
import { NgxTypeaheadModule } from 'ngx-typeahead';
import { DataTablesModule } from 'angular-datatables';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxLoadingModule, ngxLoadingAnimationTypes } from 'ngx-loading';
import { MsalModule, MsalInterceptor, MsalRedirectComponent, MSAL_INTERCEPTOR_CONFIG, MsalInterceptorConfiguration, MSAL_INSTANCE, MSAL_GUARD_CONFIG, MsalGuardConfiguration, MsalService, MsalGuard, MsalBroadcastService } from '@azure/msal-angular';
import { UnsavedChangesGuard } from './shared/guard/unsaved-changes.guard';
//import { RoleGuardService } from './shared/services/role-guard.service';
import { SharedModule } from './shared/shared.module';
import { LoaderService } from './shared/services/loader.service';
import { LoaderInterceptor } from './shared/services/loader.interceptor';
import { AppRoutingModule } from './app-routing.module';
import { NavigationService } from './shared/services/navigation.service';
import { NavMenuComponent } from './components/common-components/nav-menu/nav-menu.component';
import { LogOutComponent } from './components/log-out/log-out.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { ConfirmationPopup } from './shared/components/confirmation-popup/confirmation-popup';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { appInitializerFactory } from './appInitializerFactory';
import { PipeModule } from './shared/pipes/main.pipe.module';
import { MultilingualPipe } from './shared/pipes/multilingual.pipe';
import { HomeComponent } from './components/home/home.component';
import { OAuthModule } from 'angular-oauth2-oidc';
import { BrowserCacheLocation, InteractionType, IPublicClientApplication, LogLevel, PublicClientApplication } from '@azure/msal-browser';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DashboardComponent } from './components/dashboard/dashboard.component';

const isIE = window.navigator.userAgent.indexOf('MSIE ') > -1 || window.navigator.userAgent.indexOf('Trident/') > -1;

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    LogOutComponent,
    ConfirmationPopup,
    HomeComponent,    
    DashboardComponent
  ],
  entryComponents: [
    ConfirmationPopup
  ],
  exports: [
    MultilingualPipe
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    NgbModule,
    HttpClientModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    AppRoutingModule,
    MatTableModule,
    DataTablesModule,
    MatFormFieldModule,
    MatInputModule,
    BrowserAnimationsModule,
    SharedModule.forRoot(),
    ToastrModule.forRoot(),
    NgxMaskModule.forRoot(),
    NgMultiSelectDropDownModule.forRoot(),
    NgxTypeaheadModule,
    OAuthModule.forRoot(),
    NgxLoadingModule.forRoot({
      animationType: ngxLoadingAnimationTypes.threeBounce,
      backdropBackgroundColour: 'rgba(0,0,0,0.25)',
      backdropBorderRadius: '0px',
      primaryColour: '#0395d9',
      secondaryColour: '#0395d9',
      tertiaryColour: '#0395d9'
    }),
    MsalModule.forRoot(new PublicClientApplication({
      auth: {
        clientId: environment.clientId,
        authority: 'https://login.microsoftonline.com/' + environment.tenantId,
        redirectUri: 'https://localhost:44313',
        // postLogoutRedirectUri: 'https://localhost:44313/log-out'
      },
      system: {
        iframeHashTimeout: 10000,
      },
      cache: {
        cacheLocation: 'sessionStorage',
        storeAuthStateInCookie: isIE, // set to true for IE 11
      },
    }), null, null),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    TranslateModule.forRoot(),
    PipeModule,
  ],

  providers: [NgForm, NavigationService, UnsavedChangesGuard, LoaderService, //RoleGuardService,
    {
      provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true
    },
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerFactory,
      deps: [TranslateService],
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true
    },
    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory
    },
    {
      provide: MSAL_GUARD_CONFIG,
      useFactory: MSALGuardConfigFactory
    },
    {
      provide: MSAL_INTERCEPTOR_CONFIG,
      useFactory: MSALInterceptorConfigFactory
    },
    MsalService,
    MsalGuard,
    MsalBroadcastService,
    MultilingualPipe
  ],

  bootstrap: [AppComponent, MsalRedirectComponent],
})
export class AppModule { }


export function loggerCallback(logLevel: LogLevel, message: string) {
  console.log(message);
}

export function MSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication({
    auth: {
      clientId: environment.clientId,
      authority: `https://login.microsoftonline.com/${environment.tenantId}`,
      redirectUri: environment.redirectUrl,
    },
    cache: {
      cacheLocation: BrowserCacheLocation.SessionStorage,
      storeAuthStateInCookie: isIE, // set to true for IE 11
    },
    system: {
      loggerOptions: {
        loggerCallback,
        logLevel: LogLevel.Info,
        piiLoggingEnabled: false
      }
    }
  });
}

export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
  const protectedResourceMap = new Map<string, Array<string>>();
  protectedResourceMap.set(`${environment.redirectUrl}weatherforecast`, [`${environment.clientId}/.default`]);

  return {
    interactionType: InteractionType.Redirect,
    protectedResourceMap
  };
}

export function MSALGuardConfigFactory(): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Redirect,
    authRequest: {
      scopes: [`${environment.clientId}/.default`]
    },
  };
}
