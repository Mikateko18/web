const express = require('express');
const { check } = require('express-validator');
const HttpError = require('../models/http-error');
const mongoose = require('mongoose');
const modelSchema = require('../models/model')
const fileUpload = require('../middleware/file-upload');


const verifyController = require('../controllers/verify-controllers')
const { application } = require('express');

const router = express.Router();

const Model = new mongoose.model("Model", mongoose.modelSchema);


router.get('/:verificationCode', verifyController.verify)


module.exports = router;