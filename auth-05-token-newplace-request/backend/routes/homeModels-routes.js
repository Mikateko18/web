const express = require('express');
const { check } = require('express-validator');
const HttpError = require('../models/http-error');
const mongoose = require('mongoose');
const modelSchema = require('../models/model')
const fileUpload = require('../middleware/file-upload');


const homeModelsController = require('../controllers/HomeModels-controllers');

const router = express.Router();

const Model = new mongoose.model("Model", mongoose.modelSchema);

router.get('/',fileUpload.single('image'), homeModelsController.getModelss);

router.get("/:uid", homeModelsController.getmodelsByUserId)



module.exports = router;