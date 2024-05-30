const uuid = require('uuid/v4');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const mongoose = require('mongoose');
const Model = require('../models/model');
const User = require('../models/user')

const fs = require ('fs')

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


// function getmodelById() { ... }
// const getmodelById = function() { ... }

const getmodelsByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  let models;
  try {
    models = await Model.find({ _id: userId });
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





const updatemodel = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { title, description } = req.body;
  const modelId = req.params.pid;

  let model;
  try {
    model = await Model.findById(modelId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update model.',
      500
    );
    return next(error);
  }

  model.title = title;
  model.description = description;

  try {
    await model.save();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update model.',
      500
    );
    return next(error);
  }

  res.status(200).json({ model: model.toObject({ getters: true }) });
};

const deletemodel = async (req, res, next) => {
  const modelId = req.params.pid;

  let model;
  try {
    model = await Model.findById(modelId).populate('creator')
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete model.',
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

  const imagePath = model.image

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await model.remove({ session: sess });
    model.creator.models.pull(model);
    await model.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete model.',
      500
    );
    return next(error);
  }
fs.unlink(imagePath, err => {
  console.log(err)
})
  res.status(200).json({ message: 'Deleted model.' });
};


  

exports.getmodelById = getmodelById;
exports.getmodelsByUserId = getmodelsByUserId;
exports.getmodelsByUsersId = getmodelsByUsersId;
exports.updatemodel = updatemodel;
exports.deletemodel = deletemodel;
