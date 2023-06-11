import { HttpClient } from "@angular/common/http";
import { TranslateService } from "@ngx-translate/core";
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

export function appInitializerFactory(translate: TranslateService) {
    return () => {
        translate.setDefaultLang('es');
        return translate.use('es').toPromise();
    };
}

export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}