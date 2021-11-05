import { EventEmitter, Injectable, Output } from '@angular/core';
import { Message } from './message.model';
import { MOCKMESSAGES } from './MOCKMESSAGES';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class MessageService {
  @Output() messageChangedEvent: EventEmitter<Message[]> = new EventEmitter<Message[]>();
  messageListChangedEvent = new Subject<Message[]>();
  
  messages: Message[] = [];
  maxMessageId: number = 0;

  constructor(private http: HttpClient) {
    this.http.get<Message[]>('https://cmswdd430-default-rtdb.firebaseio.com/messages.json')
      .subscribe((messagesList: Message[]) => {
        this.messages = messagesList;
        this.maxMessageId = this.getMaxId();
        this.messages.sort((a, b) => parseInt(a.id) > parseInt(b.id) ? 1 : 0);
        this.messageListChangedEvent.next(this.messages.slice());
      },
        (error: any) => {
          console.log(error);
        });
  }

  getMaxId(): number {
    let maxId = 0;
    for (const message of this.messages) {
      let currentId = parseInt(message.id);
      if (currentId > maxId) {
        maxId = currentId;
      }
    }
    return maxId;
  }

  getMessages(): Message[] {
    return this.messages.slice();
  }

  getMessage(id: string): Message {
    for (const message of this.messages) {
      if (message.id === id) {
        return message;
      }
    }
    return null;
  }

  addMessage(newMessage: Message) {
    if (!newMessage) {
      return;
    }
    this.maxMessageId++;
    newMessage.id = this.maxMessageId.toString();
    this.messages.push(newMessage);
    this.storeMessages();
  }

  updateMessage(originalMessage: Message, newMessage: Message) {
    if (!originalMessage || !newMessage) {
      return;
    }
    const position = this.messages.indexOf(originalMessage);
    if (position < 0) {
      return;
    }
    newMessage.id = originalMessage.id;
    this.messages[position] = newMessage;
    this.storeMessages();
  }

  deleteMessage(message: Message) {
    if (!message) {
      return;
    }
    const position = this.messages.indexOf(message);
    if (position < 0) {
      return;
    }
    this.messages.splice(position, 1);
    this.storeMessages();
  }


  storeMessages() {
    const messagesJson = JSON.stringify(this.messages);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    }
    this.http.put<Message[]>('https://cmswdd430-default-rtdb.firebaseio.com/messages.json', messagesJson, httpOptions).subscribe(() => this.messageListChangedEvent.next(this.messages.slice()));

  }
}