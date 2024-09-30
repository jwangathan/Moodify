const mongoose = require('mongoose');

const entrySchema = new mongoose.Schema({
	user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	situation: String,
	emotion: String,
	attributes: String,
	tracks: [
		{
			id: { type: String, required: true },
			name: { type: String, required: true },
			artists: [{ id: String, name: { type: String, required: true } }],
			album: {
				id: String,
				name: { type: String, required: true },
				image: { type: String },
			},
			previewUrl: String,
			externalUrl: String,
		},
	],
	playlist: {
		id: { type: String, default: null },
		snapshot: { type: String, default: null },
		selectedTracks: [{ type: String }],
	},
	createdAt: { type: Date, default: Date.now },
});

entrySchema.set('toJSON', {
	transform: (doc, ret) => {
		ret.id = doc._id.toString();
		delete ret._id;
		delete ret.__v;
		delete ret.passwordhash;
		return ret;
	},
});

const Entry = mongoose.model('Entry', entrySchema);

module.exports = Entry;
