import { Pipe, PipeTransform } from '@angular/core';

import { Contact } from './contact.model';

@Pipe({
  name: 'contactsFilter'
})
export class ContactsFilterPipe implements PipeTransform {
  // transform() method using the array filter() method
  transform(contacts: Contact[], term) {
    let filteredContacts: Contact[] = [];
    if (term && term.length > 0) {
      filteredContacts = contacts.filter(
        (contact: Contact) => contact.name.toLowerCase().includes(term.toLowerCase())
      );
    }
    if (filteredContacts.length < 1) {
      return contacts;
    }
    return filteredContacts;
  }

}
