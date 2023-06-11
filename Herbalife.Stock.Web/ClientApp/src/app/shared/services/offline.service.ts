import { HttpClient, HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of, throwError } from "rxjs";
import { catchError, map, retry } from "rxjs/operators";
import { ConfigurationService } from "./configuration.service";

@Injectable({
  providedIn: 'root'
})
export class OfflineService {
  db: any;
  options: any;
  constructor(private http: HttpClient, private configurationService: ConfigurationService) {
    this.options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
  }

  createTable(requestName: OfflineSaveRequest, tableName: string, primaryIndexName: string, primaryFieldName: string) {
    var request = indexedDB.open(this.configurationService.indexedDBName, this.configurationService.indexedDBVersion);
    request.onupgradeneeded = (e: any) => {
      this.db = e.target.result;
      if (!this.db.objectStoreNames.contains(tableName)) {
        var objectStore = this.db.createObjectStore(tableName, {
          keyPath: primaryIndexName,
          autoIncrement: true
        });

        objectStore.createIndex(primaryIndexName, primaryFieldName);
      }
    };
    request.onsuccess = (e: any) => {
      this.db = e.target.result;
      this.addData(requestName, tableName);

    }
    request.onerror = (e) => {
    }
  }

  addData(requestBody, tableName) {
    const alreadyexistData = this.getData(tableName).then(allRecords => {
      let isDuplicate = false;
      allRecords.forEach(k => {
        if (k.apiName==requestBody.apiName && k.body==requestBody.body) {
          isDuplicate = true;
        }
      });

      if (!isDuplicate) {
        const transaction = this.db.transaction(tableName, "readwrite");
        const tableData = transaction.objectStore(tableName);
        let request = tableData.put(requestBody);
        request.onsuccess = (e: any) => {
          this.db = e.target.result;
        }
        request.onerror = (e) => {
        }
      }
    });;
  }

  getData(tableName): Promise<any> {
    const self = this;
    var request = indexedDB.open(this.configurationService.indexedDBName, this.configurationService.indexedDBVersion);
    return new Promise((resolve, reject) => {
      request.onsuccess = (e: any) => {
        this.db = e.target.result;
        let transaction = self.db.transaction(tableName); // readonly
        let tableData = transaction.objectStore(tableName);
        var allRecords = tableData.getAll();
        allRecords.onsuccess = function () {
          resolve(allRecords.result);
        };
        request.onerror = (e) => {
          reject(null);
        }
      }
    });

  }

  callGetApi(request, tableName: string) {
    const self = this;
    self.http.get(request.apiName).subscribe(k => {
      self.deleteEntry(request.api_id, tableName);
    }, error => {
    });
  }

  callPostApi(request, tableName: string) {
    const self = this;
    self.http.post(request.apiName, request.body, self.options).subscribe(k => {
      self.deleteEntry(request.api_id, tableName);
    }, error => {
      if (!!error && !!error.error) {
        self.deleteEntry(request.api_id, tableName);
      }
    });
  }

  deleteEntry(id, tableName) {
    var request = indexedDB.open(this.configurationService.indexedDBName, this.configurationService.indexedDBVersion);
    request.onsuccess = (e: any) => {
      this.db = e.target.result;
      const idValue = parseInt(id, 10);
      var transaction = this.db.transaction(tableName, 'readwrite');
      var objectStore = transaction.objectStore(tableName);
      var request = objectStore.delete(idValue);
      request.onsuccess = function (evt) {

      };
    };

  }

  callOfflineHttpRequest(request: OfflineSaveRequest, tableName) {
    const self = this;
    if (request.apiType == "POST") {
      self.callPostApi(request, tableName);
    } else if (request.apiType == "GET") {
      self.callGetApi(request, tableName);
    }
  }

  getBrowserName() {
    const self: any = document;
    if ((navigator.userAgent.indexOf("Opera") || navigator.userAgent.indexOf('OPR')) != -1) {
      return 'Opera';
    } else if (navigator.userAgent.indexOf("Chrome") != -1) {
      return 'Chrome';
    } else if (navigator.userAgent.indexOf("Safari") != -1) {
      return 'Safari';
    } else if (navigator.userAgent.indexOf("Firefox") != -1) {
      return 'Firefox';
    } else if ((navigator.userAgent.indexOf("MSIE") != -1) || (!!self.documentMode == true)) {
      return 'IE';
    } else {
      return 'unknown';
    }
  }



  getBrowserVersion() {
    let userAgent = navigator.userAgent, tem,
      matchTest = userAgent.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];

    if (/trident/i.test(matchTest[1])) {
      tem = /\brv[ :]+(\d+)/g.exec(userAgent) || [];
      return 'IE ' + (tem[1] || '');
    }

    if (matchTest[1] === 'Chrome') {
      tem = userAgent.match(/\b(OPR|Edge)\/(\d+)/);
      if (tem != null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
    }

    matchTest = matchTest[2] ? [matchTest[1], matchTest[2]] : [navigator.appName, navigator.appVersion, '-?'];
    if ((tem = userAgent.match(/version\/(\d+)/i)) != null) matchTest.splice(1, 1, tem[1]);
    return matchTest.join(' ');
  }

}


export class OfflineSaveRequest {
  apiName: string;
  apiType: string;
  body: string;
  api_id?: number;
}
