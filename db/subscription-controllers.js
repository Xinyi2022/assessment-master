const Subscription = require('../db/Subsription');
const { sendConfirmationEmail } = require('../mailer');

exports.getAll = (req, res) => {
  Subscription.find({})
    .then(data =>
      res.status(200).send(data)
    ).catch(err =>
      res.status(400).send(err)
    );
};

exports.add = async (req, res) => {
  const { email } = req.body;
  Subscription.where({
    email: email
  }).findOne()
    .then(record => {
      if (record != null) {
        res.status(200)
          .send("You are already on the subscription list!");
      } else {
        const newSubscriber = new Subscription(req.body);
        newSubscriber.save()
          .then(_ => {
            sendConfirmationEmail(email)
              .then(_ => res.status(201)
                .send("Subscribe success!"))
              .catch(err => console.log(err));
          })
          .catch(err =>
            res.status(500)
              .send("Unable to subscribe")
          );
      }
    });
};
