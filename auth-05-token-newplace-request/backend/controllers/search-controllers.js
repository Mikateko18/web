const uuid = require('uuid/v4');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const User = require('../models/user');
const Model = require('../models/model')


const search = async (req, res, next) => {
    const key = req.params.key;

    if (!key) {
        return next(new HttpError('Key is undefined', 400));
    }

    console.log(req.params); // log entire params object
    console.log(key);
    res.send('search');
};

   exports.search = search;