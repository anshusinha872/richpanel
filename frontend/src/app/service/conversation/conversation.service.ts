import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ConversationService {

  constructor(
    private api: ApiService
  ) { }
  getAllConversation(param:any): Observable<any> {
    return this.api.post('conversation/getAll', param);
  }
  getAllMessages(param:any): Observable<any> {
    return this.api.post('conversation/getAllMessages', param);
  }
}
