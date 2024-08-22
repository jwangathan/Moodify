const User = require('../models/user');
const axios = require('axios');

const tokenExtractor = (req, res, next) => {
	const authorization = req.get('authorization');
	if (authorization && authorization.startsWith('Bearer ')) {
		const token = authorization.replace('Bearer ', '');
		req.token = token;
	}
	next();
};

const userExtractor = async (req, res, next) => {
	const token = req.token;
	if (!token) {
		return res.status(401).json({
			error: 'token invalid',
		});
	}

	try {
		const userRes = await axios.get('https://api.spotify.com/v1/me', {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		const spotifyId = userRes.data.id;

		let user = await User.findOne({ spotifyId });
		req.user = user;
		next();
	} catch (error) {
		res.status(401).json({ message: error });
	}
};

module.exports = {
	tokenExtractor,
	userExtractor,
};
