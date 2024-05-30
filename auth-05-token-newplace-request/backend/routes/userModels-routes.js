const express = require('express');
const { check } = require('express-validator');
const { validationResult } = require('express-validator');

const userModelsControllers = require('../controllers/userModels-controller');
const HttpError = require('../models/http-error');
const mongoose = require('mongoose');

const router = express.Router();
const Model = require('../models/model');
const User = require('../models/user')


router.get('/:uid', userModelsControllers.getmodelsByUsersId);