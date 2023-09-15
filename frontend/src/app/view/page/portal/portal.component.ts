import { Component, OnInit } from '@angular/core';
import { ConversationService } from 'src/app/service/conversation/conversation.service';

@Component({
  selector: 'app-portal',
  templateUrl: './portal.component.html',
  styleUrls: ['./portal.component.css']
})
export class PortalComponent implements OnInit{
  userName: string = '';
  pageInfo: any;
  chatData: any;
  conversationList: any;
  conversation: any;
  activatedConversation: any;
  replyMessage: string = '';
  constructor(
    private conversationService: ConversationService,
  ) {
    const navigation = window.history.state;
    this.pageInfo = navigation.item;
    console.log(this.pageInfo);
   }
  ngOnInit(): void {
    this.getConversation();
    // this.getMessage(this.activatedConversation);
  }
  getConversation(){
    this.conversationService.getAllConversation(this.pageInfo).subscribe((res:any)=>{
      // console.log(res);
      // this.conversation = [];
      this.conversationList = res.data;
      console.log(this.conversationList);
    })
  }
  getMessage(conversation:any){
    console.log(conversation);
    // this.activatedConversation = conversation;
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
      this.chatData = res.data;
      this.activatedConversation = res.data;
      // console.log(this.chatData[0].from.name);
      this.userName = this.chatData[0].from.name;
      // this.userName = this.chatData[0].conversation.participants.data[0].name;
    });
  }
  // formatDate(createdTime: string): string {
  //   const date = new Date(createdTime);
  //   const formattedDate = this.datePipe.transform(date, 'MMM dd, yyyy, h:mm a');
  //   return formattedDate;
  // }
  reply(){
    console.log(this.replyMessage);
    console.log(this.conversation);
    let param = {
      senderId: this.conversation.id,
      pageId: this.pageInfo.id,
      access_token: this.pageInfo.access_token,
      pageName: this.pageInfo.name,
      message: this.replyMessage
    }
    console.log(param);
    this.conversationService.reponseMessage(param).subscribe((res:any)=>{
      console.log(res);
      this.replyMessage = '';
      this.getConversation();
      setTimeout(() => {
        for (let i = 0; i < this.conversationList.length; i++) {
          if (this.conversationList[i].id === this.conversation.id) {
            // this.conversationList[i] = res.data; // Update with the new conversation data
            this.conversation = this.conversationList[i]; // Update the selected conversation
            this.activeConversation(this.conversation);
            break;
          }
        }
      }, 2000);
      // this.getConversation();


      // console.log(this.chatData);
    });
  }
  activeConversation(conversation){
    this.conversation = conversation;
    console.log(this.conversation);
    this.chatData = this.conversation.message;
    console.log(this.chatData);
  }
  refresh(){
    this.getConversation();
    this.conversation = null;
    this.chatData = null;
  }
}
