const mongoose = require('mongoose');

const contactSchema = mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String
  },
  imageUrl: {
    type: String
  },
  group: [{
    type: mongoose.Schema.Types.String,
    ref: 'Contact'
    

  }]
});

module.exports = mongoose.model('Contact', contactSchema);

//Notes:
//The objects in the contacts collection contain a group property that is an array of ObjectId values.

// SEE HERE: CHANGED GROUPS (ORIGINAL BELOW)
// group: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Contact' }]