const uuid = require('uuid/v4');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const User = require('../models/user');
const Model = require('../models/model')


const verify = async (req, res, next) => {
    const { verificationCode } = req.params;
    User.findOne({ verificationCode }, (err, createdUser) => {
        if (err) {
          console.error(err);
          res.status(500).send('Error verifying user.');
        } else if (!createdUser) {
          res.status(404).send('User not found.');
        } else {
          // set user to verified and remove verification code
          createdUser.isVerified = true;
          //createdUser.verificationCode = undefined;
          createdUser.save(err => {
            if (err) {
              console.error(err);
              res.status(500).send('Error verifying .');
            } else {
              res.status(200).send('User verified.');
            }
          });
        }
      });

};

   exports.verify = verify;