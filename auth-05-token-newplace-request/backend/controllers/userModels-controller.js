const uuid = require('uuid/v4');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const mongoose = require('mongoose');
const Model = require('../models/model');
const User = require('../models/user')


const getmodelsByUsersId = async (req, res, next) => {
    const userId = req.params.uid;
  
    let models;
    try {
      models = await Model.find({ creator: userId });
    } catch (err) {
      const error = new HttpError(
        'Fetching models failed, please try again later',
        500
      );
      return next(error);
    }
  
    if (!models || models.length === 0) {
      return next(
        new HttpError('Could not find models for the provided user id.', 404)
      );
    }
  
    res.json({ models: models.map(model => model.toObject({ getters: true })) });
  };
  exports.getmodelsByUsersId = getmodelsByUsersId;