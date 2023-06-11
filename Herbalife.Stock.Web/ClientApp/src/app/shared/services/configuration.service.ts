import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { IConfiguration } from '../models/configuration.model';
import { StorageService } from './storage.service';

import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class ConfigurationService {

  serverSettings: IConfiguration;
  indexedDBName: string;
  indexedDBVersion: number;
  // observable that is fired when settings are loaded from server
  private settingsLoadedSource = new Subject();
  settingsLoaded$ = this.settingsLoadedSource.asObservable();
  isReady = false;

  constructor(private http: HttpClient, private storageService: StorageService) {

  }

  loadDefaultUrlsFromStorage() {
    this.serverSettings = {
      policyClaimsAgentUrl: environment.apiUrl
    }
  }

  load() {
    this.loadDefaultUrlsFromStorage();
    this.indexedDBName = "HerbalifeDB";
    this.indexedDBVersion = 1;
    const baseURI = document.baseURI.endsWith('/') ? document.baseURI : `${document.baseURI}/`;
    console.log('server settings loaded');
    this.serverSettings = {
      policyClaimsAgentUrl: environment.apiUrl
    };
    this.storageService.store('policyClaimsAgentUrl', this.serverSettings.policyClaimsAgentUrl);
    this.isReady = true;
    this.settingsLoadedSource.next();
    return;
  }
}
