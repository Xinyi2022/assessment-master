const nodeMailer = require('nodemailer');
require('dotenv').config();

const content = `
  <h1>Success!</h1>
  <p>
    Thank you for subscribing to our program!
    We are delighted to have you on board and look forward to
    delivering exciting content directly to your inbox.
  </p>

  <p>
    If you have any questions or concerns, feel free to reach out to us.
  </p>
  <p>
    Thank you again for joining our community. We can't wait to share the latest news, insights, and exclusive offers
    with you.
  </p>

  <br>
  <p>Best regards,
    <br>
    <br>
    John Doe
    <br>
    Program Manager
  </p>
`;

exports.sendConfirmationEmail = async (receiver_email) => {
  const transporter = nodeMailer.createTransport({
    host: process.env.SENDER_EMAIL_HOST,
    port: 465,
    secure: true,
    auth: {
      user: process.env.SENDER_EMAIL_ADDR,
      pass: process.env.SENDER_EMAIL_PASSWORD
    }
  });

  await transporter.sendMail({
    from: `Basketball Program <${process.env.SENDER_EMAIL_HOST}>`,
    to: receiver_email,
    subject: '[no-reply] Subscription Confirmed!!',
    html: content,
  });
};
