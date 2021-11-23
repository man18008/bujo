import { EventEmitter, Injectable, Output } from '@angular/core';
import { Message } from './message.model';
import { MOCKMESSAGES } from './MOCKMESSAGES';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Subscription, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
// @Injectable()

export class MessageService {
  @Output() messageChangedEvent: EventEmitter<Message[]> = new EventEmitter<Message[]>();
  messageListChangedEvent = new Subject<Message[]>();
  
  messages: Message[] = [];
  maxMessageId: number = 0;

  constructor(private http: HttpClient) {
    this.http.get<Message[]>('http://localhost:3000/messages')
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

  getMessages(): Message[] {
    return this.messages.slice();
  }

  getMaxId(): number {
    let maxId = 0;
    for (const message of this.messages) {
      // const currentId = parseInt(message.id);
      let currentId = parseInt(message.id);
      if (currentId > maxId) {
        maxId = currentId;
      }
    }
    return maxId;
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
    newMessage.id = '';

    // add new message to messages
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    this.http.post<{ statusMessage: string, message: Message }>('http://localhost:3000/messages', newMessage, { headers: headers })
      .subscribe(
        (responseData) => {
          this.messages.push(responseData.message);
          this.messageListChangedEvent.next(this.messages.slice());
        }
      );
    // this.maxMessageId++;
    // newMessage.id = this.maxMessageId.toString();
    // this.messages.push(newMessage);
    // this.storeMessages();
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
    // update database
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    this.http.put<any>('http://localhost:3000/messages/' + originalMessage.id, newMessage, { headers: headers })
      .subscribe(
        (response: Response) => {
          this.messages[position] = newMessage;
          this.messageListChangedEvent.next(this.messages.slice());
        }
      );
    // this.messages[position] = newMessage;
    // this.storeMessages();
  }

  deleteMessage(message: Message) {
    if (!message) {
      return;
    }
    const position = this.messages.indexOf(message);
    if (position < 0) {
      return;
    }
    // delete from database
    this.http.delete<any>('http://localhost:3000/messages/' + message.id)
      .subscribe(
        (response: Response) => {
          this.messages.splice(position, 1);
          this.messageListChangedEvent.next(this.messages.slice());
        }
      );
    // this.messages.splice(position, 1);
    // this.storeMessages();
  }


  // storeMessages() {
  //   const messagesJson = JSON.stringify(this.messages);
  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json',
  //     })
  //   }
  //   this.http.put<Message[]>('https://cmswdd430-default-rtdb.firebaseio.com/messages.json', messagesJson, httpOptions).subscribe(() => this.messageListChangedEvent.next(this.messages.slice()));

  // }
}