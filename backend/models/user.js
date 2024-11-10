const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	spotifyId: { type: String, required: true, unique: true },
	accessToken: String,
	refreshToken: String,
	expiresAt: Number,
	displayName: String,
	profileImage: String,
	topArtists: [{ id: String, name: String, genres: [String], url: String }],
	topTracks: [{ id: String, name: String, artists: [String], url: String }],
	topGenres: [String],
	entryHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Entry' }],
});

userSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
		delete returnedObject.passwordHash;
		return returnedObject;
	},
});

const User = mongoose.model('User', userSchema);

module.exports = User;
