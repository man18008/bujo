import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { Message } from '../message.model';
import * as uuid from 'uuid';

@Component({
  selector: 'cms-message-edit',
  templateUrl: './message-edit.component.html',
  styleUrls: ['./message-edit.component.css']
})
export class MessageEditComponent implements OnInit {
  currentSender = 'Megan';
  @ViewChild('subject', { static: true }) subject: ElementRef;
  @ViewChild('msgText', { static: true }) msgText: ElementRef;
  @Output() addMessageEvent = new EventEmitter<Message>();
  constructor() { }

  ngOnInit(): void {
  }
  onSendMessage() {
    const id = uuid.v4();
    const subject = this.subject.nativeElement.value;
    const msgText = this.msgText.nativeElement.value;
    const newMessage = new Message(id, subject, msgText, this.currentSender);
    this.addMessageEvent.emit(newMessage);
  }

  onClear() {
    this.subject.nativeElement.value = '';
    this.msgText.nativeElement.value = '';
  }

}
