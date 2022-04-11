const { sendMail } = require("../mails");

exports.fnConsumerEmail = async (msg, callback) => {
  const emailData = JSON.parse(msg.content);
  console.log(emailData);

  sendMail(emailData);

  callback(true);
};
