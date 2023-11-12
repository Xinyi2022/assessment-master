const Subscription = require('../db/Subsription');

exports.getAll = (req, res) => {
  Subscription.find((err, data) => {
    if (err) {
      console.log(err);
    }
    res.status(200).send(data);
  })

};

exports.add = (req, res) => {
  console.log(req.body);
  var myData = new Subscription(req.body);
  myData.save()
    .then(item => {
      res.send("item saved to database");
    })
    .catch(err => {
      res.status(400).send("unable to save to database");
    });
};