const userRouter = require('express').Router();
const User = require('../models/user');

userRouter.get('/:id', async (req, res) => {
	const id = req.params.id;
	try {
		const user = await User.find(
			{ id },
			'accessToken expiresAt topArtists topGenres topTracks spotifyId displayName profileImage'
		).exec();
		if (!user) {
			return res
				.status(404)
				.json({ error: `User not found with Spotify Id ${id}` });
		}
		res.json(user);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

module.exports = userRouter;
