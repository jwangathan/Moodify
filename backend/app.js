const express = require('express');
const mongoose = require('mongoose');
const app = express();
require('express-async-errors');
const usersRouter = require('./controllers/users');

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

app.use(express.static('dist'));
app.use(express.json());

app.use('/api/users', usersRouter);

module.exports = app;
