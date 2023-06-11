import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { HttpRequest, HttpEvent } from '@angular/common/http'
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { SecurityService } from './security.service';
import { StorageService } from './storage.service';
// Implementing a Retry-Circuit breaker policy 
// is pending to do for the SPA app
@Injectable()
export class DataService {
    constructor(private http: HttpClient, private securityService: SecurityService,
        public _storageService: StorageService) { }

    get(url: string, params?: any): Observable<Response> {
        let options = {
            params: params,
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
        };

        return this.http.get(url, this.setHeaders(options))
            .pipe(
                tap((res: Response) => {
                    return res;
                }),
                catchError(this.handleError)
            );
    }

    postWithId(url: string, data: object, params?: any): Observable<Response> {
        return this.doPost(url, data, true, params);
    }

    post(url: string, data: any, params?: any): Observable<Response> {
        return this.doPost(url, data, false, params);
    }

    putWithId(url: string, data: any, params?: any): Observable<Response> {
        return this.doPut(url, data, true, params);
    }

    private doPost(url: string, data: any, needId: boolean, params?: any): Observable<Response> {
        let options = {};
        options = this.setHeaders(options, needId);

        return this.http.post(url, data, options)
            .pipe(
                tap((res: Response) => {
                    return res;
                }),
                catchError(this.handleError)
            );
    }

    delete(url: string, params?: any) {
        let options = {};
        options = this.setHeaders(options);

        console.log('data.service deleting');

        this.http.delete(url, options)
            .subscribe((res) => {
                console.log('deleted');
            });
    }

    private handleError(error: any) {        
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('Client side network error occurred:', error.error.message);
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            console.error('Backend - ' +
                `status: ${error.status}, ` +
                `statusText: ${error.statusText}, ` +
                `message: ${error.error != null ? error.error.message : error.message}`);
        }

        // return an observable with a user-facing error message
        return throwError(error || 'server error');
    }

    private doPut(url: string, data: any, needId: boolean, params?: any): Observable<Response> {
        let options = {};
        options = this.setHeaders(options, needId);

        return this.http.put(url, JSON.stringify(data), options)
            .pipe(
                tap((res: Response) => {
                    return res;
                }),
                catchError(this.handleError)
            );
    }

    private setHeaders(options: any, needId?: boolean) {
        const httpOptions = {
            headers: new HttpHeaders()
        };

        httpOptions.headers = httpOptions.headers.set('Content-Type', 'application/json');
        httpOptions.headers = httpOptions.headers.set('Accept', 'application/json');

        const token = this._storageService.retrieve('authorizationDataIdToken');
        if (token !== '') {
            httpOptions.headers = httpOptions.headers.set('Authorization', `Bearer ${token}`);
        }

        return httpOptions;
    }

    downloadFile(url: string, data: any): Observable<HttpEvent<Blob>> {
        return this.http.request(new HttpRequest(
            'POST',
            url,
            data,
            {
                responseType: 'blob'
            }));
    }

}
