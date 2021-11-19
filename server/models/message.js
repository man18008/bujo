const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  subject: {
    type: String
  },
  msgText: {
    type: String,
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.String,
    ref: 'Contact'
  }
});

module.exports = mongoose.model('Message', messageSchema);

//See link bellow code. The other model .js files are based on this.
//https://byui.instructure.com/courses/164460/pages/w11-assignment-instructions