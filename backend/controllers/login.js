const loginRouter = require('express').Router();

const generateCode = async () => {
	const possible =
		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const randomValues = crypto.getRandomValues(new Uint8Array(64));
	const randomString = randomValues.reduce(
		(acc, x) => acc + possible[x % possible.length],
		''
	);

	const code_verifier = randomString;
	const data = new TextEncoder().encode(code_verifier);
	const hashed = await crypto.subtle.digest('SHA-256', data);
	const code_challenge_base64 = btoa(
		String.fromCharCode(...new Uint8Array(hashed))
	)
		.replace(/=/g, '')
		.replace(/\+/g, '-')
		.replace(/\//g, '_');

	return { code_verifier, code_challenge_base64 };
};

loginRouter.get('/', (req, res) => {
	const { code_verifier, code_challenge } = generateCode();
	req.session.codeVerifier = code_verifier;
	const authUrl = new URL(process.env.AUTH_ENDPOINT);
	const params = {
		response_type: 'code',
		client_id: process.env.CLIENT_ID,
		scope: process.env.SCOPE,
		code_challenge_method: 'S256',
		code_challenge: code_challenge,
		redirect_uri: process.env.REDIRECT_URI,
	};

	authUrl.search = new URLSearchParams(params).toString();
	res.redirect(authUrl.toString());
});

module.exports = loginRouter;
