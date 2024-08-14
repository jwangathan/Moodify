require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const PORT = process.env.PORT;
const MONGODB_URI =
	process.env.NODE_ENV === 'test'
		? process.env.TEST_MONGODB_URI
		: process.env.MONGODB_URI;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

module.exports = {
	MONGODB_URI,
	PORT,
	model,
};
