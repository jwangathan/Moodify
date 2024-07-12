const clientId = 'd6e8cb2bc548473da9a1e88322188df4';
const redirectUrl = 'http://localhost:5173';
const authorizationEndpoint = 'https://accounts.spotify.com/authorize';
const tokenEndpoint = 'https://accounts.spotify.com/api/token';
const scope = 'user-read-private user-read-email';

export const redirectToSpotifyAuthorize = async () => {
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

	window.localStorage.setItem('code_verifier', code_verifier);

	const authUrl = new URL(authorizationEndpoint);
	const params = {
		response_type: 'code',
		client_id: clientId,
		scope: scope,
		code_challenge_method: 'S256',
		code_challenge: code_challenge_base64,
		redirect_uri: redirectUrl,
	};

	authUrl.search = new URLSearchParams(params).toString();
	window.location.href = authUrl.toString(); // Redirect the user to the authorization server for login
};
