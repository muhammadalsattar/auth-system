const nodemailer = require("nodemailer");
const dotenv = require('dotenv')

dotenv.config()

const main = async(first_name, email, link)=>{

  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASSWORD,
    },
  });
  let info = await transporter.sendMail({
    from: "Sender", // sender address
    to: email, // list of receivers
    subject: "Verify your email", // Subject line
    html: `<h4>Hi ${first_name},<br>Please verify your email to access your account.<br>Click <b><a href="${link}">here</a></b> to verify your email.<br></h4>`, // html body
  });
}

module.exports = main
