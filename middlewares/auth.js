const jwt = require('jsonwebtoken');

const expressJwt = require("express-jwt");
const { responseObject } = require('../helpers');
const { HTTP_UNAUTHORIZED } = require('../helpers/httpCodes');



//express jwt is used to protect routes
exports.requiredSignin = expressJwt({
  //if the token is valid ,expres jwt appends the verified users id
  //in an auth key to the request object
  secret: process.env.JWT_SECRET,
  userProperty: "auth",
  algorithms: ['HS256']
});


exports.hasAuthorization=(req,res,next)=>{
  let authorized=req.post && req.auth && req.post.userId==req.auth.id;
  // let adminUser=req.profile && req.auth && req.auth.role==="admin";
    // const authorized=sameUser || adminUser;

    if(!authorized) return responseObject(res,
      HTTP_UNAUTHORIZED,
      'error',
      null,
      "Unauthorize"
      )
    next()
}


