const express = require('express');
const helmet = require('helmet');
const axios = require('axios');

// loads the environment variables we need (i.e. that should not be stored in code, like our app ID and secret)
require('dotenv').config();

const app = express();
app.use(helmet());
app.use(express.static(__dirname + '/public'))

const gitHubApi = {
	accessToken: 'https://github.com/login/oauth/access_token',
	userDetails: 'https://api.github.com/user',
};

// gets this applications client ID
app.get('/oauth/client-id', (req, res) => {
	res.json({ clientId: process.env.CLIENT_ID });
});

// called by GitHib with a login token, we then exchange that for the users bearer token
app.get(process.env.CALLBACK, (req, res) => {
	const request = {
		method: 'post',
		url: `${gitHubApi.accessToken}?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&code=${req.query.code}`,
		headers: { accept: 'application/json' }
	};

	let haveEmailScope = false;

	axios(request)
		.then(response => {
			// we've asked for the 'user:email' scope - did the user grant it?
			haveEmailScope = response.data.scope === 'user:email';
			if (!haveEmailScope) {
				throw new Error('No user:email scope granted');
			}

			request.method = 'get';
			request.url = gitHubApi.userDetails,
			request.headers = { Authorization: `${response.data.token_type} ${response.data.access_token}`};
			return axios(request);
		})
		.then(response => {
			res.json({ user: response.data });
		})
		.catch(error => {
			console.error(error);
			if (!haveEmailScope) {
				res.status(401).send('We need your email address');
			}
		});
});

app.listen(process.env.PORT, () => {
	let package = require('./package.json');
	console.log(`${package.name} v${package.version} is listening on port ${process.env.PORT}.`);
});
