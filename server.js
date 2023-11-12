/**
 * Module dependencies.
 */
const express = require('express');
const hash = require('pbkdf2-password')();
const path = require('path');
const session = require('express-session');
const db = require('./db/db');
const Subscription = require('./db/subscription.js');
require('dotenv').config();

const app = express();

/**
 * constants
 */
const PORT = process.env.PORT || 8080;
const PASSWORD = process.env.PASSWORD;

/**
 * configs
 */
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);
app.use(express.static(__dirname + '/public'));

/**
 * middleware
 */
app.use(express.urlencoded({ extended: false }))
app.use(session({
  resave: false, // don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
  secret: 'shhhh, very secret'
}));


/**
 * Session-persisted message middleware
 */
app.use(function (req, res, next) {
  var err = req.session.error;
  var msg = req.session.success;
  delete req.session.error;
  delete req.session.success;
  res.locals.message = '';
  if (err) res.locals.message = '<p class="msg error">' + err + '</p>';
  if (msg) res.locals.message = '<p class="msg success">' + msg + '</p>';
  next();
});

/**
 * dummy database
 */
const users = {
  admin: { name: 'admin' }
};

hash({ password: PASSWORD }, function (err, pass, salt, hash) {
  if (err) throw err;
  // store the salt & hash in the "db"
  users.admin.salt = salt;
  users.admin.hash = hash;
});

function authenticate(name, pass, fn) {
  if (!module.parent) console.log('authenticating %s:%s', name, pass);
  var user = users[name];
  // query the db for the given username
  if (!user) return fn(null, null)
  // apply the same algorithm to the POSTed password, applying
  // the hash against the pass / salt, if there is a match we
  // found the user
  hash({ password: pass, salt: user.salt }, function (err, pass, salt, hash) {
    if (err) return fn(err);
    if (hash === user.hash) return fn(null, user)
    fn(null, null)
  });
}

/**
 * APIs
 */
app.listen(PORT, () => {
  console.log(`server starts listening on port ${PORT}`);
});


/*
database APIs
*/
app.get('/subscriptions', Subscription.getAll);
app.post('/subscriptions', Subscription.add);


/*
server APIs
*/
app.get('/', (req, res) => {
  res.render('index.html');
});

app.get('/parent_portal', (req, res) => {
  debugger;
  res.render('parent_portal.html');
});


app.post('/parent_portal', (req, res) => {
  // console.log('password submitted:', req.body.password);
  debugger;
  authenticate(users.admin.name, req.body.password, function (err, user) {
    if (err) return next(err)
    if (user) {
      // Regenerate session when signing in
      // to prevent fixation
      req.session.regenerate(function () {
        // Store the user's primary key
        // in the session store to be retrieved,
        // or in this case the entire user object
        req.session.user = user;
      });
      res.render('parent_portal.html');
    } else {
      res.redirect('/');
    }
  });
});

app.get('/logout', function (req, res) {
  // destroy the user's session to log them out
  // will be re-created next request
  req.session.destroy(function () {
    res.redirect('/');
  });
});
