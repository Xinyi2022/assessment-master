const Subscription = require('../db/Subsription');

exports.getAll = (req, res) => {
  Subscription.find({})
    .then(data =>
      res.status(200).send(data)
    ).catch(err =>
      res.status(400).send(err)
    );
};

exports.add = async (req, res) => {
  Subscription.where({
    email: req.body.email
  }).findOne()
    .then(record => {
      if (record != null) {
        res.status(200)
          .send("You are already on the subscription list!");
      } else {
        const newSubscriber = new Subscription(req.body);
        newSubscriber.save()
          .then(item =>
            res.status(201)
              .send("Subscribe success!")
          )
          .catch(err =>
            res.status(500)
              .send("Unable to subscribe")
          );
      }
    });
};
