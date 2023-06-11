import { NgModule, ModuleWithProviders, APP_INITIALIZER } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HttpClientJsonpModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxMaskModule } from 'ngx-mask'
import { DataTablesModule } from 'angular-datatables';
// Services
import { LoaderService } from './services/loader.service';
import { LoaderInterceptor } from './services/loader.interceptor';
import { DataService } from './services/data.service';
import { SecurityService } from './services/security.service';
import { ConfigurationService } from './services/configuration.service';
import { StorageService } from './services/storage.service';
import { NotificationService } from './services/notification.service';
import { AuthService } from './services/auth.service';

// Components:
import { DatepickerPopupComponent } from './components/datepicker/datepicker-popup.component';
import { AccessDeniedComponent } from './components/access-denied/access-denied.component';

// Pipes:
import { UppercasePipe } from './pipes/uppercase.pipe';
import { FilterDeleted } from './pipes/filterdeleted.pipe';

//directives
import { OnlynumberDirective } from './directives/onlynumber.directive';
import { SelectRequiredValidatorDirective } from './directives/select-required-validator.directive';

@NgModule({
  imports: [
    CommonModule,
    DataTablesModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgbModule,
    // No need to export as these modules don't expose any components/directive etc'
    HttpClientModule,
    HttpClientJsonpModule,
    NgxMaskModule.forRoot()
  ],
  declarations: [
     DatepickerPopupComponent,
    UppercasePipe,
    OnlynumberDirective,
    SelectRequiredValidatorDirective,
    FilterDeleted,
    AccessDeniedComponent    
  ],
  exports: [
    // Modules
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgbModule,
    UppercasePipe,
    FilterDeleted,
    DatepickerPopupComponent,
    SelectRequiredValidatorDirective,
  ]
})


export class SharedModule {
  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: [
        // Providers
        DataService,
        SecurityService,
        ConfigurationService, { provide: APP_INITIALIZER, useFactory: InitApp, deps: [ConfigurationService], multi: true },
        LoaderService,
        StorageService,
        NotificationService,
        AuthService
      ]
    };
  }
}

export function InitApp(configurationService: ConfigurationService) {
  configurationService.load();
  return () => configurationService.settingsLoaded$.subscribe();
}
