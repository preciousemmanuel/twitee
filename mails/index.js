const nodemailer=require('nodemailer');
const defaultEmailData = {from:"noreply@unshelled.com"};
const dotenv = require("dotenv");
dotenv.config();

exports.sendMail=emailData=>{
console.log(process.env.EMAIL_HOST)
  const transporter=nodemailer.createTransport({
    host:process.env.EMAIL_HOST,
    port:465,
    secure:true,
    //requireTLS:true,
    auth:{
     // user:"preciousemmanuel32@gmail.com",
     user:process.env.EMAIL_USERNAME,
     pass:process.env.EMAIL_PASSWORD
    }
  });

  return (
    transporter
    .sendMail(emailData)
    .then(info=>console.log(`Message sent: ${info.response} `))
    .catch(error=>console.log(error))
  )

}