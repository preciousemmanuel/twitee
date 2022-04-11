const jwt = require("jsonwebtoken");
const _ = require("lodash");
const { sendMail, responseObject, issueJwt, encryptPassword, decryptPassword } = require("../helpers");
require("dotenv").config();
const uuidv1 = require("uuid");
const db = require("../models");
const User = db.users;

const {
  HTTP_BAD_REQUEST,
  HTTP_FORBIDDEN,
  HTTP_OK,
  HTTP_SERVER_ERROR,
} = require("../helpers/httpCodes");
const { sendQueue } = require("../queues");

exports.signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExist = await User.findOne({ where: { email } });
    if (userExist)
      return responseObject(
        res,
        HTTP_FORBIDDEN,
        "error",
        null,
        "User with email already exist!"
      );

    const username = email.split("@")[0];

    const salt = uuidv1.v4();

   

    const encrypt = encryptPassword(password, salt);

    let user = await User.create({ name,email, password:encrypt,salt, username });
    

    console.log("here", user);
    delete user.password;
    delete user.salt;
    //create jwt token
    const token = issueJwt(user, res);
    const data = {
      token,
      user,
    };

    //call rabbitmq to send email
    const emailData = {
      to: email,
      subject: "Twit",
      html: `Hi ${name},<br/><br/>We’re excited to have you on our platform.<br/><br/>We promise you’d totally love the community 🤸🏾‍♀️. `,
    };
    sendQueue("EMAIL_SIGNUP", Buffer.from(JSON.stringify(emailData)));

    
    return responseObject(
      res,
      HTTP_OK,
      "success",
      data,
      "sign up is successfull"
    );
  } catch (error) {
    return responseObject(
      res,
      HTTP_SERVER_ERROR,
      "error",
      null,
      error.toString()
    );
  }

  // res.status(200).json({user})
};

exports.signin = async (req, res) => {
    try {
        
    
  const { email, password } = req.body;
  //try {
  console.log(req.body);
  let user = await User.findOne({ where: { email }, });
  if (!user) return responseObject(
    res,
    HTTP_FORBIDDEN,
    "error",
    null,
    "User with email do not exist!"
  );
   
  const decripted = decryptPassword(password, user.salt);

  // Did user provide correct password?
  if (decripted !== user.password) {
    //const error = new Error("Incorrect Email or Password");
    return responseObject(
      res,
      HTTP_BAD_REQUEST,
      "error",
      null,
      "Incorrect Email or Password"
    );
  }
 
  //create jwt token
  const token = issueJwt(user, res);
  const data = {
    token,
    user,
  };
  //return response to user
  return responseObject(
    res,
    HTTP_OK,
    "success",
    data,
    "sign in is successfull"
  );
} catch (error) {
    return responseObject(
        res,
        HTTP_SERVER_ERROR,
        "error",
        null,
        error.toString()
      );     
}
  // } catch (error) {
  //     return res.status(500).json({error:"failed"})
  // }
};

exports.signout = (req, res) => {
  res.clearCookie("t");
  return  responseObject(
    res,
    HTTP_OK,
    "success",
    null,
    "sign out is successfull"
  );
};

exports.forgotPassword = async (req, res) => {
  if (!req.body.email) {
    return res.status(401).json({ error: "No Email in request body" });
  }
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({ error: "User with Email do not exist" });
    }

    // generate a token with user id and secret
    const token = jwt.sign(
      { _id: user.id, iss: "NODEAPI" },
      process.env.JWT_SECRET
    );

    //email data
    const emailData = {
      from: "no-reply@node-react.com",
      to: req.body.email,
      subject: "Reset Password",
      text: `Please use the following link to reset your password: ${process.env.CLIENT_URL}/reset-password/${token}`,
      html: `<p> Please use the following link to reset your password: ${process.env.CLIENT_URL}/reset-password/${token}</p>`,
    };

    const updatedUser = await user.updateOne({ resetPasword: token });
    if (!updatedUser) {
      return res.json({ message: "error" });
    }

    sendMail(emailData);
    console.log("working email sent");
    return res.json({
      message: `Email has been sent to ${req.body.email}. Follow the instructions to reset your password.`,
    });
  } catch (e) {
    res.status(401).json({ error: e });
  }
};

exports.resetPassword = (req, res) => {
  const { resetPaswordLink, newPassword } = req.body;
  User.findOne(resetPaswordLink, (err, user) => {
    if (err || !user) {
      return res.status(401).json({ error: "Invalid link" });
    }
    const resetPasword = {
      password: newPassword,
      resetPaswordLink: "",
    };

    user = _.extend(user, resetPasword);
    user.updated_at = Date.now();
    user.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: err,
        });
      }
      res.json({
        message: `Great! Now you can login with your new password.`,
      });
    });
  });
};




