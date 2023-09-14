import { Component, OnInit } from '@angular/core';
import { ConversationService } from 'src/app/service/conversation/conversation.service';
@Component({
  selector: 'app-portal',
  templateUrl: './portal.component.html',
  styleUrls: ['./portal.component.css']
})
export class PortalComponent implements OnInit{
  pageInfo: any;
  conversationList: any;
  constructor(
    private conversationService: ConversationService
  ) {
    const navigation = window.history.state;
    this.pageInfo = navigation.item;
    console.log(this.pageInfo);
   }
  ngOnInit(): void {
    this.conversationService.getAllConversation(this.pageInfo).subscribe((res:any)=>{
      // console.log(res);
      this.conversationList = res.data;
      console.log(this.conversationList);
    })
  }
  getMessage(conversation:any){
    console.log(conversation);
    console.log(this.pageInfo);
    let param = {
      conversationId: conversation.id,
      pageId: this.pageInfo.id,
      access_token: this.pageInfo.access_token,
      pageName: this.pageInfo.name
    }
    console.log(param);
    this.conversationService.getAllMessages(param).subscribe((res:any)=>{
      console.log(res);
    });
  }
}
