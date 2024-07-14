const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const app = express();
require('express-async-errors');
const cors = require('cors');
const loginRouter = require('./controllers/login');

const config = require('./utils/config');
const logger = require('./utils/logger');
mongoose.set('strictQuery', false);

logger.info('connecting to', config.MONGODB_URI);

mongoose
	.connect(config.MONGODB_URI)
	.then(() => {
		logger.info('connected to MongoDB');
	})
	.catch((error) => {
		logger.error('error.connecting to MongoDB:', error.message);
	});

app.use(cors());
app.use(express.static('dist'));
app.use(express.json());
app.use(
	session({
		secret: process.env.SECRET,
		resave: false,
		saveUninitialized: true,
	})
);

app.use('/auth', loginRouter);

module.exports = app;
