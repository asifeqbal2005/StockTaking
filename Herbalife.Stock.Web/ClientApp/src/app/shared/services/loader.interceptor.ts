import { Injectable, OnDestroy } from "@angular/core";
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";
import { finalize } from "rxjs/operators";

import { LoaderService } from '../services/loader.service';
import { OfflineSaveRequest, OfflineService } from "./offline.service";
import { ConnectionService } from 'ng-connection-service';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
  isConnected = true;
  status = "ONLINE";
  private requests: HttpRequest<any>[] = [];
  constructor(
    public loaderService: LoaderService,
    private offlineService: OfflineService,
    private connectionService: ConnectionService) {
    this.connectionService.monitor().subscribe(isConnected => {
      this.isConnected = isConnected;
      if (this.isConnected) {
        this.status = "ONLINE";
        this.offlineService.getData("OfflineRequest").then(allRecords => {
          allRecords.forEach(k => {
            this.offlineService.callOfflineHttpRequest(k, "OfflineRequest");
          });
        });
      }
      else {
        this.status = "OFFLINE";
      }
    });
  }

  removeRequest(req: HttpRequest<any>) {
    const i = this.requests.indexOf(req);
    if (i >= 0) {
      this.requests.splice(i, 1);
    }
    this.loaderService.isLoading.next(this.requests.length > 0);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isConnected) {
      const inputRequest: OfflineSaveRequest = {
        apiName: req.url,
        apiType: req.method,
        body: req.body
      };
      this.offlineService.createTable(inputRequest, "OfflineRequest", "api_id", "apiName");
    } else {
      this.requests.push(req);
      setTimeout(() => { this.loaderService.show(); }, 0);
      return this.callHttpRequest(req, next);
    }
  }


  callHttpRequest(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      finalize(() => setTimeout(() => { this.removeRequest(req); }, 0))
    );
  }
}
