const mongoose = require('mongoose');

const documentSchema = mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  url: {
    type: String,
    required: true
  },
  children: {
    type: [{
      id: String,
      name: String,
      url: String
    }]
  }
});

module.exports = mongoose.model('Document', documentSchema);

//Notes:
//The children property in the documents collection is an array of child documents that are related to the document.