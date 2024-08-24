const mongoose = require('mongoose');

const entrySchema = new mongoose.Schema({
	user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	situation: String,
	emotion: String,
	attributes: String,
	recommendations: {
		seedTracks: String,
		seedArtists: String,
		seedGenres: String,
		tracks: [
			{
				id: { type: String, required: true },
				name: { type: String, required: true },
				artists: [{ id: String, name: { type: String, required: true } }],
				album: {
					id: String,
					name: { type: String, required: true },
					image: { type: String, required: true },
				},
				previewUrl: String,
				externalUrl: String,
			},
		],
	},
	createdAt: { type: Date, default: Date.now },
});

entrySchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
		delete returnedObject.passwordhash;
	},
});

const Entry = mongoose.model('Entry', entrySchema);

module.exports = Entry;
