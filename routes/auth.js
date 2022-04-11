const {
    validateSignup,
    validateSignin
  } = require('../middlewares/signupValidation');
  
  const express = require('express');
  const {
    signin,
    signup,
    signout
    
  } = require('../controllers/auth');
  
  
  const router = express.Router();
  
  router.post('/signup',validateSignup, signup);
  router.post('/signin',validateSignin, signin);
  router.get('/signout', signout);
  

  
  module.exports = router;
  