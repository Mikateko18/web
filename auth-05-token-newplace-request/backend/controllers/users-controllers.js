const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const HttpError = require('../models/http-error');
const User = require('../models/user');

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, '-password');
  } catch (err) {
    const error = new HttpError(
      'Fetching users failed, please try again later.',
      500
    );
    return next(error);
  }
  res.json({ users: users.map(user => user.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { name, email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      'Signing up failed, please try again later.',
      500
    );
    return next(error);
  }

  if (existingUser && existingUser.isVerified != true) {
    const error = new HttpError(
      'User exists already, please verify your account instead.',
      422
    );
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      'User exists already, please login instead.',
      422
    );
    return next(error);
  }
  

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(
      'Could not create user, please try again.',
      500
    );
    return next(error);
  }
  const verificationCode = crypto.randomBytes(20).toString('hex');
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'nonreply18@gmail.com',
      pass: 'nvdouhayavahbguj',
    },
  });

  const createdUser = new User({
    name,
    email,
    image: 'https://live.staticflickr.com/7631/26849088292_36fc52ee90_b.jpg',
    password: hashedPassword,
    models: [],
    verificationCode,
    isVerified: false,
  });
createdUser.save(err => {
  if (err) {
    console.error(err);
    res.status(500).send('Error registering new user.');
  } else {
    // send verification email
    const mailOptions = {
      from: 'nonreply18@gmail.com',
      to: email,
      subject: 'Verify your account',
      html: `
        <p>Please click the following link to verify your account:</p>
        <p><a href="http://localhost:5000/api/verify/${verificationCode}">http://localhost:5000/api/verify/${verificationCode}</a></p>
      `,
    };

    transporter.sendMail(mailOptions, err => {
      if (err) {
        console.error(err);
        res.status(500).send('Error sending verification email.');
      } else {
        res.status(200).send('Verification email sent.');
      }
    });
  }
  

});

res.status(201).json({ user: createdUser.toObject({ getters: true }) });

}



const login = async (req, res, next) => {
  const { email, password } = req.body;
  let isVerified = true
  let existingUser;

  try {
    existingUser = await User.findOne({ email: email});
  } catch (err) {
    const error = new HttpError(
      'Logging in failed, please try again later.',
      500
    );
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError(
      'Invalid credentials, could not log you in.',
      401
    );
    return next(error);
  } 
 if(existingUser.isVerified != true){
  const error = new HttpError(
    ' User is not verified, Please verify your account.',
    401
  );
  return next(error);
 }
  

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError(
      'Could not log you in, please check your credentials and try again.',
      500
    );
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError(
      'Invalid credentials, could not log you in.',
      401
    );
    return next(error);
  }

  res.json({
    message: 'Logged in!',
    user: existingUser.toObject({ getters: true })
  })
};



exports.getUsers = getUsers;
//exports.verifiedUser = verifiedUser;
exports.signup = signup;
exports.login = login;
