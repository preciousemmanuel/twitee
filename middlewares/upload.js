const aws = require('aws-sdk');
const multer = require('multer');
const multers3 = require('multer-s3');
const { responseObject } = require('../helpers');
const {
  HTTP_FORBIDDEN,
  HTTP_BAD_REQUEST,
  HTTP_SERVER_ERROR
} = require('../helpers/httpCodes');

const s3 = new aws.S3({
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  region: 'af-south-1'
});

exports.uploadS3 = (req, res, next) => {
  const upload = multer({
    storage: multers3({
      s3: s3,
      bucket: process.env.S3_BUCKET_NAME || 'test',
      acl: 'public-read',
      metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname });
      },
      key: function (req, file, cb) {
        cb(null, Date.now().toString() + file.originalname);
      }
    })
  }).array('files');

  // Custom error handling for multer
  upload(req, res, (error) => {
    if (error instanceof multer.MulterError)
      return responseObject(
        res,
        HTTP_BAD_REQUEST,
        'error',
        null,
        error.toString()
      );

    if (error)
      return responseObject(
        res,
        HTTP_SERVER_ERROR,
        'error',
        null,
        error.toString()
      );
    console.log('Upload successful.');
    next();
  });
};
