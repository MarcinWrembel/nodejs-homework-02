const sgMail = require("@sendgrid/mail");
require("dotenv").config();

const sendMailMessage = async (email) => {
  sgMail.setApiKey(process.env.SEND_GRID_API_KEY);
  const msg = {
    to: "mw84.mm@gmail.com",
    from: "mw84.mm@gmail.com",
    subject: `Sending email -test `,
    text:"coś tam"
  };
  try {
    await sgMail.send(msg);
    console.log("email send sucessfully");
  } catch (err) {
    console.log(err);
  }
};

module.exports = sendMailMessage;
