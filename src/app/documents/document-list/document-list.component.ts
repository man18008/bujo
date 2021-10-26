import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Document } from '../document.model';
import * as uuid from 'uuid';
import { DocumentService } from '../document.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'cms-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentListComponent implements OnInit {
/*   @Output() selectedDocumentEvent: EventEmitter<Document> = new EventEmitter<Document>(); */

  documents: Document[] = [];
  subscription: Subscription;

  constructor(private documentService: DocumentService) { }

  ngOnInit(): void {
    this.documents = this.documentService.getDocuments();
    this.documentService.documentChangedEvent.subscribe((documents) => this.documents = documents.slice())
    this.subscription = this.documentService.documentListChangedEvent.subscribe((documentsList: Document[]) => this.documents = documentsList.slice());
  }
  
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

/*   onSelected(document: Document): void {
    this.documentService.documentSelectedEvent.emit(document);
  } */

}