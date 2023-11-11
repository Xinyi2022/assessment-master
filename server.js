const express = require('express');

const PORT = 3000;

const app = express();
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);
app.use(express.static(__dirname + '/public'));

app.listen(PORT, () => {
  console.log(`server starts listening on port ${PORT}`);
});

app.get('/', (req, res) => {
  res.render('index.html');
});