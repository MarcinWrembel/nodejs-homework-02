const sgMail = require("@sendgrid/mail");
require("dotenv").config();

const sendMailMessage = async (email, verificationToken) => {
  sgMail.setApiKey(process.env.SEND_GRID_API_KEY);
  const msg = {
    from: "testowanie.backend@gmail.com",
    to: email,
    subject: `email verification for registration process `,
    html: `
    <b>Please click on below link to finish registration process</b>
    <a href=http://localhost:3000/api/users/verify/${verificationToken}> confirm registration here</a>
    `,
  };
  try {
    await sgMail.send(msg);
  } catch (err) {
    console.log(err);
  }
};

module.exports = sendMailMessage;
