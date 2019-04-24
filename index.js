const helmet = require('helmet');
const compression = require('compression');
const config = require('config');
const mongoose = require('mongoose');
const express = require('express');
const users = require('./routes/users');
const auth = require('./routes/auth');
const app = express();

if(!config.get('jwtPrivateKey')) {
  console.error('FATAL ERROR: jwtPrivateKey is not defined.');
  process.exit(1);
}

mongoose.connect('mongodb://localhost/ternium', { useNewUrlParser: true })
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...'));

  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.use(express.json());
app.use('/api/users', users);
app.use('/api/auth', auth);
app.use(helmet());
app.use(compression());



const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Listening on port ${port}...`));