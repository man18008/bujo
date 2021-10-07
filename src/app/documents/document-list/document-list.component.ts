import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Document } from '../document.model';


@Component({
  selector: 'cms-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentListComponent implements OnInit {

  @Output() selectedDocumentEvent: EventEmitter<Document> = new EventEmitter<Document>();

  documents: Document[] = [
    new Document('0', 'CIT 260 - Object Oriented Programming', 'In this course you will learn Object Oriented Programming and the Java programming language by designing and creating a simple game.', 'https://content.byui.edu/file/22c0260d-e1b7-43a2-8903-8d8f948041ee/4/syllabus.html', []),
    new Document('1', 'CIT 366 - Full Web Stack Development', 'This course will teach you how to design and build interactive web based applications using HTML, CSS, JavaScript, and a web development stack.', 'https://www.byui.edu/', []),
    new Document('2', 'CIT 425 - Data Warehousing', 'This course defines the theory and practice of data analysis. The course will compare and contrast the operational and analytical database models. Students will learn how to define, implement and query a database warehouse by leveraging sample data warehouses built from Enterprise Resource Planning (ERP) and Customer Resource Management (CRM) solutions.', 'https://www.byui.edu/', []),
    new Document('3', 'CIT 460 - Enterprise Development', ' This course covers the architecture for N-tier applications by focusing on the use of effective design patterns. Different technologies to implement the MVC control pattern will be explored.', 'https://www.byui.edu/', []),
    new Document('4', 'CIT 495 - Senior Practicum', 'This is a capstone experience for the Computer Information Technology major. There are two options available: A research paper on a relevant Information Technology topic or participate in service learning. The purpose of this course is to build on the knowledge that students have learned in the Computer Information Technology major.', 'https://www.byui.edu/', []),
  ];
  constructor() { }

  ngOnInit(): void {
  }

  onSelected(document: Document): void {
    this.selectedDocumentEvent.emit(document);
  }

}
