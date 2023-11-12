const mongoose = require('mongoose');

const mongoURI = 'mongodb://0.0.0.0:27017/subscriptions';

const db = mongoose.connect(mongoURI);

db
  .then(db => console.log(`DB connected to: ${mongoURI}`))
  .catch(err => {
    console.log(`There was a problem connecting to mongo at: ${mongoURI}`);
    console.log(err);
  });

module.exports = db;
