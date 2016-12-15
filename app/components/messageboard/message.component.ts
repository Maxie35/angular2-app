import { Component, Input, OnInit } from '@angular/core';

import { MessageService } from '../../services/message.service';
import { Message } from './message';


@Component({
  selector: 'my-messages',
  templateUrl: 'app/components/messageboard/message.template.html',
  providers: [MessageService]
})
export class MessageComponent implements OnInit {

  @Input()
  message: Message; 

	messages: Message[];

  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
  	this.getMessages();
  }

  postMessage(): void {
  	this.messageService.postMessage(this.message)
      .subscribe(messages => this.messages = messages, err => { console.log(err);});    

      //Now clear the messagebox
      (<HTMLInputElement>document.getElementById('messagebox')).value="";
  };

  getMessages(): void {
		this.messageService.getMessages()
			.subscribe(messages => this.messages = messages, err => {console.log(err);})
	};



}