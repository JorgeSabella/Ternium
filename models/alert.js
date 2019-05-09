const mongoose = require('mongoose');
const sessionSchema = require('./session');

const alertSchema = new mongoose.Schema({
  date: {
    type: Date, 
    required: true,
    default: Date.now
  },
  session: {
      type: sessionSchema,
      required: true
  },
  type: {
    type: String,
    required: true
  }
});

const Alert = mongoose.model('Alert', alertSchema);

exports.alertSchema = alertSchema;
exports.Alert = Alert; 