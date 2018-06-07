const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/foodlover');

module.exports = {
  init() {
    const db = mongoose.connection;
    db.on('error', err => {
      console.log(err);
    });

    db.once('open', () => console.log('connect'));
  }
};