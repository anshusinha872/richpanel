import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private APIEndpoint = environment.APIEndpoint; // Base URL for API

  constructor(private http: HttpClient) { }

  public get(endpoint: string): Observable<any> {
    const url = `${this.APIEndpoint}${endpoint}`;
    const headers = this.createHeaders();
    return this.http.get(url, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  public post(endpoint: string, data: any): Observable<any> {
    const url = `${this.APIEndpoint}${endpoint}`;
    const headers = this.createHeaders();
    return this.http.post(url, data, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }
  public put(endpoint: string, data: any): Observable<any> {
    const url = `${this.APIEndpoint}${endpoint}`;
    const headers = this.createHeaders();
    return this.http.put(url, data, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  public patch(endpoint: string, data: any): Observable<any> {
    const url = `${this.APIEndpoint}${endpoint}`;
    const headers = this.createHeaders();
    return this.http.patch(url, data, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  public delete(endpoint: string): Observable<any> {
    const url = `${this.APIEndpoint}${endpoint}`;
    const headers = this.createHeaders();
    return this.http.delete(url, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  private createHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    return headers;
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.error instanceof ErrorEvent) {
      // Client-side error occurred
      console.error('Client-side error:', error.error.message);
    } else {
      // Server-side error occurred
      console.error('Server-side error:', error);

      // Extract the error message and status code from the error response
      const errorMessage = error.error?.message || 'Something went wrong.';
      const statusCode = error.status || 500;

      // Handle specific error cases
      if (statusCode === 500) {
        // Handle specific error codes or messages
        if (error.error?.error?.code === 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD') {
          // Handle the specific error code
          return throwError('Invalid value for a field.');
        }
      }

      // Return a generic error message
      return throwError(errorMessage);
    }

    // Default return statement
    return throwError('An error occurred.');
  }
}
