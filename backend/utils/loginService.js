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

const generateRandomString = (length) => {
	let text = '';
	const possible =
		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < length; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
};

module.exports = {
	generateCode,
	generateRandomString,
};
