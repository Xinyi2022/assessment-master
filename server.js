/**
 * Module dependencies.
 */
const express = require('express');

const PORT = 3000;
const app = express();

/**
 * configs
 */
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);
app.use(express.static(__dirname + '/public'));


/**
 * APIs
 */
app.listen(PORT, () => {
  console.log(`server starts listening on port ${PORT}`);
});

app.get('/', (req, res) => {
  res.render('index.html');
});

app.post('/parent_portal', (req, res) => {
  console.log('password submitted:', req.body);
  res.render('parent_portal.html');
});
