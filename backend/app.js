var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var authRouter = require('./features/auth/controller.ts');
const {authMiddleware} = require("./features/middleware/auth.js");

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', express.static("../frontend/dist/"));
app.use('/api/login', authRouter.login);
app.use('/api/register', authRouter.register);
app.use('/api/me', authMiddleware, authRouter.me);


module.exports = app;
