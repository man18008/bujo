import { Injectable, EventEmitter, Output} from '@angular/core';
import { Contact } from './contact.model';
import { MOCKCONTACTS } from './MOCKCONTACTS';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class ContactService {
  @Output() contactSelectedEvent: EventEmitter<Contact> = new EventEmitter<Contact>();
  @Output() contactChangedEvent: EventEmitter<Contact[]> = new EventEmitter<Contact[]>();
  contactListChangedEvent = new Subject<Contact[]>();
  maxContactId: number;
  contacts: Contact[] = [];
  // contactChangedEvent: any;

  constructor(private http: HttpClient) {
    this.http.get<Contact[]>('https://cmswdd430-default-rtdb.firebaseio.com//contacts.json')
      .subscribe((contactsList: Contact[]) => {
        this.contacts = contactsList;
        this.maxContactId = this.getMaxId();
        this.contacts.sort((a, b) => parseInt(a.id) > parseInt(b.id) ? 1 : 0);
        this.contactListChangedEvent.next(this.contacts.slice());
      },
        (error: any) => {
          console.log(error);
        });
  }

  getMaxId(): number {
    let maxId = 0;
    for (const contact of this.contacts) {
      const currentId = parseInt(contact.id, 10);
      if (currentId > maxId) { maxId = currentId; }
    }
    return maxId;
  }

  getContacts(): Contact[] {
    return this.contacts.slice();
  }

  getContact(id: string): Contact {
    for (const contact of this.contacts) {
      if (contact.id === id) {
        return contact;
      }
    }
    return null;
  }

  addContact(newContact: Contact): void {
    if (!newContact) {
      return;
    }
    this.maxContactId++;
    newContact.id = this.maxContactId.toString();
    this.contacts.push(newContact);
    this.storeContacts()
    // this.contactListChangedEvent.next(this.contacts.slice());
  }

  updateContact(originalContact: Contact, newContact: Contact): void {
    if (!originalContact || !newContact) {
      return;
    }
    const position = this.contacts.indexOf(originalContact);
    if (position < 0) {
      return;
    }
    newContact.id = originalContact.id;
    this.contacts[position] = newContact;
    this.storeContacts()
    // this.contactListChangedEvent.next(this.contacts.slice());
  }

  deleteContact(contact: Contact): void {
    if (!contact) { return; }
    const pos = this.contacts.indexOf(contact);
    if (pos < 0) { return; }
    this.contacts.splice(pos, 1);
    this.storeContacts()
    // this.contactListChangedEvent.next(this.contacts.slice());
    // this.contactChangedEvent.emit(this.contacts.slice());
  }

  storeContacts() {
    const contactsJson = JSON.stringify(this.contacts);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    }
    this.http.put<Contact[]>('https://cmswdd430-default-rtdb.firebaseio.com/contacts.json', contactsJson, httpOptions).subscribe(() => this.contactListChangedEvent.next(this.contacts.slice()));
  }
}
