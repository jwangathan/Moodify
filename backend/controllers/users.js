const usersRouter = require('express').Router();
const User = require('../models/user');

usersRouter.post('/', async (req, res) => {
	const { code, code_verifier } = req.body;
});

module.exports = usersRouter;
