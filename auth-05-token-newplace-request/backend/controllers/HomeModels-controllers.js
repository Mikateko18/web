const uuid = require('uuid/v4');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const User = require('../models/user');
const Model = require('../models/model');




const getModelss = async (req, res, next) => {
  
  let models;
  try {
    models = await Model.find({});
  } catch (err) {
    const error = new HttpError(
      'Fetching models failed, please try again later.',
      500
    );
    return next(error);
  }
  res.json({models: models.map(model => model.toObject({ getters: true }))});
};
const getmodelById = async (req, res, next) => {
    const modelId = req.params.pid; // { pid: 'p1' }
  


    let model;
    try {
      model = await Model.findById(modelId);
    } catch (err) {
      const error = new HttpError(
        'Something went wrong, could not find a model.',
        500
      );
      return next(error);
    }
  
    if (!model) {
      const error = new HttpError(
        'Could not find a model for the provided id.',
        404
      );
      return next(error);
    }
  
    res.json({ model: model.toObject({ getters: true }) }); // => { model } => { model: model }
  };

  const search = async (req, res, next) => {
  
   console.log(req.params.key)
   res.send("done")
  };
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
    res.json({users: users.map(user => user.toObject({ getters: true }))});
  };
  const getmodelsByUserId = async (req, res, next) => {
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



  exports.getmodelsByUserId = getmodelsByUserId;




exports.getModelss = getModelss;
exports.getUsers = getUsers;
exports.search = search;
exports.getmodelById = getmodelById
