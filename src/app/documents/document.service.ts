import { Injectable, Output, EventEmitter } from '@angular/core';
import { Document } from './document.model';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subscription, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  @Output() documentSelectedEvent: EventEmitter<Document> = new EventEmitter<Document>();
  @Output() documentChangedEvent: EventEmitter<Document[]> = new EventEmitter<Document[]>();
  documentListChangedEvent = new Subject<Document[]>();

  maxDocumentId: number;
  documents: Document[] = [];

  // https://byui.instructure.com/courses/164460/pages/week-07-assignment-instructions

  getMaxId(): number {
    let maxId = 0;
    for (const document of this.documents) {
      const currentId = parseInt(document.id, 10);
      if (currentId > maxId) {
        maxId = currentId;
      }
    }
    return maxId;
  }

  constructor(private http: HttpClient) {
    this.http.get<Document[]>('http://localhost:3000/documents')
      .subscribe((documentsList: Document[]) => {
        this.documents = documentsList;
        this.maxDocumentId = this.getMaxId();
        this.documents.sort((a, b) => parseInt(a.id) > parseInt(b.id) ? 1 : 0);
        this.documentListChangedEvent.next(this.documents.slice());
      },
        (error: any) => {
          console.log(error);
        });
  }

  addDocument(newDocument: Document): void {
    if (!newDocument) {
      return;
    }
    newDocument.id = '';

    // add new document to documents
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    this.http.post<{ message: string, document: Document }>('http://localhost:3000/documents', newDocument, { headers: headers })
      .subscribe(
        (responseData) => {
          this.documents.push(responseData.document);
          this.documentListChangedEvent.next(this.documents.slice());
        }
      );
    // this.maxDocumentId++;
    // newDocument.id = this.maxDocumentId.toString();
    // this.documents.push(newDocument);
    // this.storeDocuments();
    // this.documentListChangedEvent.next(this.documents.slice());
  }

  updateDocument(originalDocument: Document, newDocument: Document): void {
    if (!originalDocument || !newDocument) {
      return;
    }
    const position = this.documents.indexOf(originalDocument);
    if (position < 0) {
      return;
    }
    newDocument.id = originalDocument.id;
    // update database
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    this.http.put<any>('http://localhost:3000/documents/' + originalDocument.id, newDocument, { headers: headers })
      .subscribe(
        (response: Response) => {
          this.documents[position] = newDocument;
          this.documentListChangedEvent.next(this.documents.slice());
        }
      );
    // this.documents[position] = newDocument;
    // this.storeDocuments();
    // this.documentListChangedEvent.next(this.documents.slice());
  }

  getDocuments(): Document[] {
    return this.documents.slice();
  }

  getDocument(id: string): Document {
    for (const document of this.documents) {
      if (document.id === id) {
        return document;
      }
    }
    return null;
  }

  deleteDocument(document: Document): void {
    if (!document) {
      return;
    }
    const pos = this.documents.indexOf(document);
    if (pos < 0) {
      return;
    }
    
    this.http.delete<any>('http://localhost:3000/documents/' + document.id)
    .subscribe(
      (response: Response) => {
        this.documents.splice(pos, 1);
        this.documentListChangedEvent.next(this.documents.slice());
      }
    );
    // this.documents.splice(pos, 1);
    // this.storeDocuments();
    // this.documentListChangedEvent.next(this.documents.slice());
    // this.documentChangedEvent.emit(this.documents.slice());
  }
  // NO LONGER NEEDED. SEE WEEK 11
  // https://byui.instructure.com/courses/164460/pages/w11-assignment-instructions
  // storeDocuments() {
  //   const documentsJson = JSON.stringify(this.documents);
  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json',
  //     })
  //   }

  //   this.http.put<Document[]>('http://localhost:3000/documents', documentsJson, httpOptions)
  //     .subscribe(() => this.documentListChangedEvent.next(this.documents.slice()));
  // }
  //   this.http.put<Document[]>('https://cmswdd430-default-rtdb.firebaseio.com/documents.json', documentsJson, httpOptions)
  //     .subscribe(() => this.documentListChangedEvent.next(this.documents.slice()));
  // }
}
