import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class FacebookService {

  constructor(
    private api: ApiService
  ) { }
  authenticate(param:any): Observable<any> {
    return this.api.post('accounts/authenticate', param);
  }
}
