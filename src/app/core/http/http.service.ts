import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from 'src/app/config.service';
import { environment } from 'src/environments/environment';
// import { ConfigService } from 'src/app/config-service';

@Injectable({
  providedIn: 'root',
})

/**
 * Manipulate the HTTP requests for the whole app
 * handle the main POST, GET, UPDATE, DELETE methods
 */
export class HttpService {
  // readonly baseUrl = APIURL.prod;
  readonly baseUrl;
  config;
  country: any;
  getBaseUrl() {
    return this.baseUrl;
  }

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.config = this.configService.readConfig();
    this.baseUrl = environment[this.config.config]?.apiEndpointUrl;
    this.country = environment[this.config.config]?.country || 'EG';
  }

  /**
   * Post request using angular httpClient module
   * @param {string} url - the end point url
   * @param {any} data - request paiload
   * @return {Observable} Observable of response, comes from the end point
   */
  postReq(url: string, data: any): Observable<any> {
    return this.http.post(this.baseUrl + url, data);
  }
  postReqWithHeader(url: string, data: any, headers): Observable<any> {
    return this.http.post(this.baseUrl + url, data, headers);
  }

  postReqWithUrlHeader(url: string, data: any, urlHeader): Observable<any> {
    return this.http.post(this.baseUrl + url + '/' + urlHeader, data);
  }

  /**
   * Post request using angular httpClient module
   * @param {string} url - the end point url
   * @param {any} data - request paiload
   * @return {Observable} Observable of response, comes from the end point
   */
  postDolphine(url: string, data: any): Observable<any> {
    return this.http.post(url, JSON.stringify(data));
  }

  /**
   * Get request using angular httpClient module
   * @param {string} url - the end point url
   * @param {?any} [data] - request paiload
   * @return {Observable} Observable of response, comes from the end point
   */
  getReq(url: string, data?: any): Observable<any> {
    return this.http.get(this.baseUrl + url, data);
  }

  /**
   * Get request using angular httpClient module
   * you can bass a parameter (data) in the url seperated by '/'
   * @param {string} url - the end point url
   * @param {string} data - request paiload
   * @return {Observable} Observable of response, comes from the end point
   */
  getHeaderReq(url: string, data: string): Observable<any> {
    return this.http.get(this.baseUrl + url + '/' + data);
  }

  /**
   * PUT request using angular httpClient module
   * you can bass a parameter (data) in the url seperated by '/'
   * @param {string} url - the end point url
   * @param {?any} data - request paiload
   * @return {Observable} Observable of response, comes from the end point
   */
  putReq(url: string, data?: any): Observable<any> {
    return this.http.put(this.baseUrl + url, data);
  }

  /**
   * DELETE request using angular httpClient module
   * you can bass a parameter (data) in the url seperated by '/'
   * @param {string} url - the end point url
   * @param {?any} data - request paiload
   * @return {Observable} Observable of response, comes from the end point
   */
  deleteReq(url: string, data?: any): Observable<any> {
    return this.http.delete(this.baseUrl + url + '/' + data);
  }
}
