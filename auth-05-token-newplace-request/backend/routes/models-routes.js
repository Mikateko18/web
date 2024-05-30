const express = require('express');
const { check } = require('express-validator');
const { validationResult } = require('express-validator');

const modelsControllers = require('../controllers/models-controllers');
const HttpError = require('../models/http-error');
const mongoose = require('mongoose');

const router = express.Router();
const Model = require('../models/model');
const User = require('../models/user')
const fileUpload = require('../middleware/file-upload');
const checkAuth = require('../middleware/check-auth')

router.get('/:pid', modelsControllers.getmodelById);

router.get('/user/:uid', modelsControllers.getmodelsByUserId);
router.get('/creator/:uid', modelsControllers.getmodelsByUsersId);



router.post(
  '/', fileUpload.single('image'),
  [
    check('title')
      .not()
      .isEmpty(),
    check('description').isLength({ min: 5 })
   
  ],
  async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(
        new HttpError('Invalid inputs passed, please check your data.', 422)
      );
    }

    const newModel = new Model({
      
      title: req.body.title,
      description: req.body.description,
      image: req.file.path,
      creator: req.body.creator,
    });
  const creator = req.body.creator;
  let user;
  try {
    user = await User.findById(creator);
  } catch (err) {
    const error = new HttpError('Creating model failed, please try again', 500);
    return next(error);
  }
  if (!user) {
    const error = new HttpError('Could not find user for provided id', 404);
    return next(error);
  }

  console.log(user);


    try {
      const sess = await mongoose.startSession();
      sess.startTransaction();
     await newModel.save({ session: sess });
      user.models.push(newModel);
     await user.save({ session: sess });
     await  sess.commitTransaction();
    } catch (err) {
      const error = new HttpError(
        'Creating model failed, please try again.',
        500
      );
      return next(error);
    }
  
    res.status(201).json({ model: newModel });
  }
);

router.patch(
  '/:pid',
  [
    check('title')
      .not()
      .isEmpty(),
    check('description').isLength({ min: 5 })
  ],
  modelsControllers.updatemodel
);

router.delete('/:pid', modelsControllers.deletemodel);

module.exports = router;
