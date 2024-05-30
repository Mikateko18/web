const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const fs = require('fs')
const nodemailer = require('nodemailer');

const modelsRoutes = require('./routes/models-routes');
const usersRoutes = require('./routes/users-routes');
const homeModelsRoutes = require('./routes/homeModels-routes');
const searchRoutes = require('./routes/search-routes');
const HttpError = require('./models/http-error');
const usersControllers = require('./controllers/users-controllers')
const verifyRoutes = require('./routes/verify-route');

const Model = require('./models/model');
const userModelsRoutes = require('./routes/homeModels-routes');
const path = require('path')
const User = require('./models/user');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/uploads/images', express.static(path.join('uploads', 'images')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

  next();
});

app.use('/api/models', modelsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/model', homeModelsRoutes);
app.use('/api/creator', userModelsRoutes);
app.use('/api/verify', verifyRoutes)

app.use((req, res, next) => {
  const error = new HttpError('Could not find this route.', 404);
  throw error;
});


app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, err => {
      console.log(err);
    });
  }
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || 'An unknown error occurred!' });
});


mongoose
  .connect('mongodb+srv://immersive2:immersive2023@cluster0.iqqzu9h.mongodb.net/model',{useNewUrlParser: true,
  useUnifiedTopology: true})
  .then(() => {
    app.listen(5000);
  })
  .catch(err => {
    console.log(err);
  });
  

 
  