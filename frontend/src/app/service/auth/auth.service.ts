import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private api: ApiService
  ) { }
  login(param:any): Observable<any> {
    return this.api.post('login', param);
  }
  register(param:any): Observable<any> {
    return this.api.post('register', param);
  }
}
