const Subscription = require('../db/Subsription');
const { sendConfirmationEmail } = require('../mailer');
const { StatusCodes } = require('http-status-codes');

exports.add = (req, res) => {
  const { email } = req.body;
  Subscription.where({
    email: email
  }).findOne()
    .then(record => {
      if (record != null) {
        res.status(StatusCodes.OK)
          .send("You are already on the subscription list!");
      } else {
        const newSubscriber = new Subscription(req.body);
        newSubscriber.save()
          .then(_ => {
            sendConfirmationEmail(email)
              .then(_ => {
                console.log('confirmation email has been sent to', email);
                res.status(StatusCodes.CREATED)
                  .send("Subscribe success!");
              })
              .catch(err => console.log(err));
          })
          .catch(err => {
            console.log(err);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR)
              .send("Unable to subscribe");
          });
      }
    });
};
