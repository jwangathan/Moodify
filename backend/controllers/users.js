const User = require('../models/user');
const usersRouter = require(express).Router();

usersRouter.get('/', async (req, res) => {
	const users = await User.find({});
	res.json(users);
});
