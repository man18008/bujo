import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ContactService } from '../contact.service';
import { Contact } from './../contact.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'cms-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})

export class ContactListComponent implements OnInit {
  /*   @Output() selectedContactEvent = new EventEmitter<Contact>(); */
  contacts: Contact[] = [];
  subscription: Subscription;
  term: string;
  /*   contacts: Contact[] = [
      new Contact('1', 'R. Kent Jackson', 'jacksonk@byui.edu', '208-496-3771', '../../assets/images/jacksonk.jpg', null),
      new Contact('2', 'Rex Barzee', 'barzeer@byui.edu', '208-496-3768', '../../assets/images/barzeer.jpg', null),
    ];

    onSelected(contact: Contact): void {
      this.contactService.contactSelectedEvent.emit(contact);
    } */
    
  search(value: string) {

    this.term = value;

  }
  
  constructor(private contactService: ContactService) { }

  ngOnInit(): void {
    this.contacts = this.contactService.getContacts();
    this.contactService.contactChangedEvent.subscribe((contacts) => this.contacts = contacts.slice());
    this.subscription = this.contactService.contactListChangedEvent.subscribe((contactsList: Contact[]) => this.contacts = contactsList.slice());
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe(); 
  }

}