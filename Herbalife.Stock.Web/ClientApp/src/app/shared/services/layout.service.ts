import { Injectable } from '@angular/core';
import { ConfigurationService } from 'src/app/shared/services/configuration.service';
import { DataService } from 'src/app/shared/services/data.service';

@Injectable({
    providedIn: 'root'
})
export class LayoutService {
    constructor(private http: DataService, private configurationService: ConfigurationService) {

    }

    GetCountry() {
        let url = this.configurationService.serverSettings.policyClaimsAgentUrl + '/api/Layout/GetCountry';
        return this.http.get(url);
    }

    GetEntities() {
        let url = this.configurationService.serverSettings.policyClaimsAgentUrl + '/api/Layout/GetEntityList';
        return this.http.get(url);
    }

    GetLanguages() {
        let url = this.configurationService.serverSettings.policyClaimsAgentUrl + '/api/Layout/GetLanguages';
        return this.http.get(url);
    }

    ChangeLanguageWithoutEntity(languageId) {
        let url = this.configurationService.serverSettings.policyClaimsAgentUrl + '/api/Layout/ChangeLanguageWithoutEntity/language/' + languageId;
        return this.http.get(url);
    }

    changeLanguage(languageId, entityName) {
        let url = this.configurationService.serverSettings.policyClaimsAgentUrl + '/api/Layout/ChangeLanguage/language/' + languageId + "/entity/" + entityName.toString();
        return this.http.get(url);
    }

    saveTranslatedWord(request) {
        let url = this.configurationService.serverSettings.policyClaimsAgentUrl + '/api/Layout/AddWordByEntity';
        return this.http.post(url, request);
    }

    UpdateWordByEntity(request: any) {
        let url = this.configurationService.serverSettings.policyClaimsAgentUrl + '/api/Layout/UpdateWordByEntity';
        return this.http.post(url, JSON.stringify(request));
    }

    GetWordByEntities(request: any) {
        let url = this.configurationService.serverSettings.policyClaimsAgentUrl + '/api/Layout/GetWordByEntities';
        return this.http.post(url, JSON.stringify(request));
    }

    GetWordByEntitiesById(id) {
        let url = this.configurationService.serverSettings.policyClaimsAgentUrl + '/api/Layout/GetWordByEntitiesById?id=' + id;
        return this.http.get(url);
    }

    DeleteWordByEntitiesById(id) {
        let url = this.configurationService.serverSettings.policyClaimsAgentUrl + '/api/Layout/DeleteWordByEntitiesById?id=' + id;
        return this.http.get(url);
    }
}
