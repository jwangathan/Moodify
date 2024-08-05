const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	spotifyId: { type: String, required: true, unique: true },
	accessToken: String,
	refreshToken: String,
	expiresIn: Number,
	displayName: String,
	profileImage: String,
	topArtist: [String],
	topTracks: [{ name: String, id: String }],
	chatHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chat' }],
});

userSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
		delete returnedObject.passwordhash;
	},
});

const User = mongoose.model('User', userSchema);

module.exports = User;
