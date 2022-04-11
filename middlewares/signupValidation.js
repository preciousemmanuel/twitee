const { check, validationResult } = require("express-validator");
const { responseObject } = require("../helpers");
const { HTTP_BAD_REQUEST } = require("../helpers/httpCodes");

exports.validateSignup = async (req, res, next) => {
  await check("email")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Email is required")
    .normalizeEmail()
    .isEmail()
    .withMessage("Invalid Email format")
    .run(req);

  await check("password")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Password is required")
    .run(req);

  await check("name")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Name is required")
    .run(req);

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return responseObject(
      res,
      HTTP_BAD_REQUEST,
      "error",
      null,
      errors.array()[0].msg
    );
  } else {
    next();
  }
};

exports.validateSignin = async (req, res, next) => {
  await check("email")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Email is required")
    .normalizeEmail()
    .isEmail()
    .withMessage("Invalid Email format")
    .run(req);
  await check("password")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Password is required")
    .run(req);

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return responseObject(
      res,
      HTTP_BAD_REQUEST,
      "error",
      null,
      errors.array()[0].msg
    );
  } else {
    next();
  }
};
