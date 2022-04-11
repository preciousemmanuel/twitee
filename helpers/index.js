const crypto = require('crypto');
 const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

exports.verificationCode = () => {
  const code = Math.floor(100000 + Math.random() * 900000);
  return code;
};

exports.encryptPassword = (password, salt) => {
  if (!password) return '';
  try {
    return crypto.createHmac('sha1', salt).update(password).digest('hex');
  } catch (error) {
    return '';
  }
};

exports.decryptPassword = (password, salt) => {
  if (!password) return '';
  try {
    const hash = crypto.createHmac('sha1', salt).update(password).digest('hex');
    return hash;
  } catch (error) {
    console.log(error);
    return '';
  }
};

// VERIFY JWT tokens to users
// exports.verifyJwt = (token) => {
//   return jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//     if (err) {
//       console.log(err);
//       return false;
//     }

//     return decoded;
//   });
// };

// Issues JWT tokens to users
exports.issueJwt = (user,res) => {
  const payload = {
    id: user.id,
    email: user.email
  };

  const token = jwt.sign(payload,process.env.JWT_SECRET)
   //persist the token as 't' in cookie with expiry date
   res.cookie('t',token,{expire:Date.now()+9999})

  
  return token;
};

// Returns a Backend response object
exports.responseObject = (response, code, status, data, message) => {
  if (status === 'error' || (code === 'success' && !data)) {
    return response.status(code).json({
      status,
      message
    });
  } else {
    return response.status(code).json({
      status,
      // resultCount: data ? data.length : 0,
      data,
      message
    });
  }
};
