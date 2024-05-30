const express = require('express');
const { check } = require('express-validator');
const HttpError = require('../models/http-error');
const mongoose = require('mongoose');
const modelSchema = require('../models/model')

const searchController = require('../controllers/search-controllers');

const router = express.Router();

const Model = new mongoose.model("Model", mongoose.modelSchema);


router.get("/", searchController.search)






module.exports = router;