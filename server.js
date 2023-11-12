/**
 * Module dependencies.
 */
const express = require('express');
const hash = require('pbkdf2-password')();
const path = require('path');
const session = require('express-session');
const db = require('./db/connector.js');
const Subscription = require('./db/subscription-controllers.js');
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
app.use((req, res, next) => {
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

hash({ password: PASSWORD }, (err, pass, salt, hash) => {
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
  hash({ password: pass, salt: user.salt }, (err, pass, salt, hash) => {
    if (err) return fn(err);
    if (hash === user.hash) return fn(null, user)
    fn(null, null)
  });
}

function restrict(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    console.log('Access denied!');
    res.redirect('/');
  }
}

/**
 * APIs
 */
app.listen(PORT, () => {
  console.log(`server starts listening on port ${PORT}`);
});

app.get('/', (req, res) => {
  res.render('index.html');
});

app.get('/parent_portal', restrict, (req, res) => {
  res.render('parent_portal.html');
});

app.post('/parent_portal', (req, res) => {
  authenticate(users.admin.name, req.body.password, (err, user) => {
    if (err) return next(err)
    if (user) {
      // Regenerate session when signing in
      // to prevent fixation
      req.session.regenerate(() => {
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

app.post('/add_subscription', Subscription.add);

app.get('/logout', (req, res) => {
  // destroy the user's session to log them out
  // will be re-created next request
  req.session.destroy(() => {
    res.redirect('/');
  });
});
