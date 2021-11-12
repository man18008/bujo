import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { Message } from '../message.model';
import * as uuid from 'uuid';
import { MessageService } from '../message.service';

@Component({
  selector: 'cms-message-edit',
  templateUrl: './message-edit.component.html',
  styleUrls: ['./message-edit.component.css']
})

export class MessageEditComponent implements OnInit {

  // @Output() addMessageEvent = new EventEmitter<Message>();
  @Output() addMessageEvent: EventEmitter<Message> = new EventEmitter<Message>();

  currentSender = '19';

  @ViewChild('subject', { static: true }) subject: ElementRef;
  @ViewChild('msgText', { static: true }) msgText: ElementRef;

  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
  }

  onSendMessage() {
    const id = uuid.v4();
    const sender = this.currentSender;
    const subject = this.subject.nativeElement.value;
    const msgText = this.msgText.nativeElement.value;
    const newMessage = new Message(id, subject, msgText, sender);
    this.messageService.addMessage(newMessage);
    //this.addMessageEvent.emit(newMessage);
  }

  onClear() {
    this.subject.nativeElement.value = '';
    this.msgText.nativeElement.value = '';
  }

}
