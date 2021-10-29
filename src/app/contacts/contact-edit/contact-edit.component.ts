import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';

@Component({
  selector: 'cms-contact-edit',
  templateUrl: './contact-edit.component.html',
  styleUrls: ['./contact-edit.component.css']
})
export class ContactEditComponent implements OnInit {
  originalContact: Contact | null = null;
  contact?: Contact;
  groupContacts: Contact[] = [];
  editMode: boolean;
  id?: string;
  lastAddSuccessful: boolean | null = null;

  constructor(
    private contactService: ContactService,
    private router: Router,
    private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = params.id;
      if (!this.id) {
        this.editMode = false;
        return;
      }
      this.originalContact = this.contactService.getContact(this.id);
      if (!this.originalContact) {
        return;
      }
      this.editMode = true;
      this.contact = JSON.parse(JSON.stringify(this.originalContact));
      if (this.contact?.group && this.contact?.group?.length > 0) {
        this.groupContacts = JSON.parse(JSON.stringify(this.originalContact.group));
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['contacts']);
  }

  onSubmit(f: NgForm): void {
    const value = f.value;
    const newContact = new Contact(value.id, value.name, value.email, value.phone, value.imageURL, this.groupContacts);
    if (this.editMode) {
      this.contactService.updateContact(this.originalContact, newContact);
    } else {
      this.contactService.addContact(newContact);
    }
    this.router.navigate(['contacts']);
  }

  // https://byui.instructure.com/courses/164460/pages/w08-assignment-instructions
  isInvalidContact(newContact: Contact) {
    if (!newContact) {
      return true;
    }
    if (this.contact && newContact.id === this.contact.id) {
      return true;
    }
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.groupContacts.length; i++) {
      if (newContact.id === this.groupContacts[i].id) { return true; }
    }
    return false;
  }

  // https://byui.instructure.com/courses/164460/pages/w08-assignment-instructions
  addToGroup($event: any): void {
    const selectedContact: Contact = $event.dragData;
    const invalidGroupContact = this.isInvalidContact(selectedContact);
    if (invalidGroupContact) {
      this.lastAddSuccessful = false;
      return;
    }
    this.lastAddSuccessful = true;
    this.groupContacts.push(selectedContact);
  }

  // https://byui.instructure.com/courses/164460/pages/w08-assignment-instructions
  onRemoveItem(index: number): void {
    if (index < 0 || index >= this.groupContacts.length) {
      return;
    }
    this.groupContacts.splice(index, 1);
    this.lastAddSuccessful = null;
  }

}
