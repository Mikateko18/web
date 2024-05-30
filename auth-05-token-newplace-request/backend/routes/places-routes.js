const express = require('express');
const { check } = require('express-validator');

const modelsControllers = require('../controllers/models-controllers');
const fileUpload = require('../middleware/file-upload');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.get('/:pid', modelsControllers.getmodelById);

router.get('/user/:uid', modelsControllers.getmodelsByUserId);

router.use(checkAuth);

router.post(
  '/',
  fileUpload.single('image'),
  [
    check('title')
      .not()
      .isEmpty(),
    check('description').isLength({ min: 5 }),
    check('address')
      .not()
      .isEmpty()
  ],
  modelsControllers.createmodel
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
