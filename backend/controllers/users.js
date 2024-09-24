const userRouter = require('express').Router();
const User = require('../models/user');

userRouter.get('/:id', async (req, res) => {
	const spotifyId = req.params.id;
	try {
		const user = await User.findOne(
			{ spotifyId },
			'accessToken expiresAt topArtists topGenres topTracks spotifyId displayName profileImage'
		).exec();
		if (!user) {
			return res
				.status(404)
				.json({ error: `User not found with Spotify Id ${id}` });
		}
		res.status(200).json({
			token: user.accessToken,
			expiresAt: user.expiresAt,
			topArtists: user.topArtists,
			topGenres: user.topGenres,
			topTracks: user.topTracks,
			user: {
				spotifyId: user.spotifyId,
				displayName: user.displayName,
				profileImage: user.profileImage,
			},
		});
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

module.exports = userRouter;
