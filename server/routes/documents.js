var express = require('express');
var router = express.Router();

// Implement the Documents Routing File
const sequenceGenerator = require('./sequenceGenerator');
const Document = require('../models/document');

// The router.get() method is responsible for getting the list of documents in the documents collection in the database
router.get('/', (req, res, next) => {
  Document.find()
    .then(documents => {
      res.status(200).json(documents);
    })
    .catch(error => {
      res.status(500).json({
        message: 'An error occurred',
        error: error
      });
    });
});

// The router.post() method is responsible for adding a new document to the collection in the database.
router.post('/', (req, res, next) => {
  const maxDocumentId = sequenceGenerator.nextId("documents");

  const document = new Document({
    id: maxDocumentId,
    name: req.body.name,
    description: req.body.description,
    url: req.body.url
  });

  document.save()
    .then(createdDocument => {
      res.status(201).json({
        message: 'Document added successfully',
        document: createdDocument
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'An error occurred',
        error: error
      });
    });
});

// The router.put() method is responsible for updating an existing document in the database.
router.put('/:id', (req, res, next) => {
  Document.findOne({
      id: req.params.id
    })
    .then(document => {
      document.name = req.body.name;
      document.description = req.body.description;
      document.url = req.body.url;

      Document.updateOne({
          id: req.params.id
        }, document)
        .then(result => {
          res.status(204).json({
            message: 'Document updated successfully'
          })
        })
        .catch(error => {
          res.status(500).json({
            message: 'An error occurred',
            error: error
          });
        });
    })
    .catch(error => {
      res.status(500).json({
        message: 'Document not found.',
        error: {
          document: 'Document not found'
        }
      });
    });
});

// The router.delete() method is responsible for deleting an existing document in the database.
router.delete("/:id", (req, res, next) => {
  Document.findOne({
      id: req.params.id
    })
    .then(document => {
      Document.deleteOne({
          id: req.params.id
        })
        .then(result => {
          res.status(204).json({
            message: "Document deleted successfully"
          });
        })
        .catch(error => {
          res.status(500).json({
            message: 'An error occurred',
            error: error
          });
        })
    })
    .catch(error => {
      res.status(500).json({
        message: 'Document not found.',
        error: {
          document: 'Document not found'
        }
      });
    });
});

module.exports = router;

// https://byui.instructure.com/courses/164460/pages/w11-assignment-instructions