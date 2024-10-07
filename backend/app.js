const express = require('express');
const path = require('path');
const session = require('express-session');
const mongoose = require('mongoose');
const app = express();
require('express-async-errors');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const loginRouter = require('./controllers/login');
const entryRouter = require('./controllers/entries');
const userRouter = require('./controllers/users');

const middleware = require('./utils/middleware');
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
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'dist')));
app.use(express.json());

app.use(
	session({
		secret: process.env.SECRET,
		resave: false,
		saveUninitialized: true,
		cookie: {
			secure: true,
			sameSite: 'lax',
		},
	})
);
app.use(middleware.tokenExtractor);

app.use('/api/auth', loginRouter);
app.use('/api/user', userRouter);
app.use('/api/entry', middleware.userExtractor, entryRouter);

app.get('/*', (req, res) => {
	res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

module.exports = app;
