# Experiment/playground to use GitHub's OAuth API in a node JS application
- Dummy/throwaway code for using GitHub's OAuth API in a Node JS REST API app
- To use this app, you will need to create a GitHub application at https://github.com/settings/applications/new
  - Rename `./my.env` to `./env`, and update it with the client ID & secret for the created app, as well as details of the port number and callback URL you specified when creating the app

## To build and run
```bash
git clone https://github.com/dylankenneally/github-oauth-experiment.git
cd github-oauth-experiment
npm install

# create your GitHub application at https://github.com/settings/applications/new
cp ./my.env ./.env
# update `.env` as detailed above

npm start

# navigate to `http://localhost:3000`
```

## TODO notes
- store users bearer token client side
  - use that to establish if the user is already logged in, if not - ask them do
- better 'your logged in' result
- logout (of our app, not of GitHub)
- use the users bearer token to determine if a REST API can be used
  - store the registered users ID (mongo, flat file, etc.)
  - create a dummy 'authorisation required' API
  - when a REST request comes in for that API, use the bearer token to get the users ID
    - if the ID is out our stored list - permit the REST API
    - if not - 401: unauthorised
- use the users bearer token to establish if they have agreed to an EULA
  - can EULA be updated? does it need to be re-accepted?
- kick out a 'welcome' email for new users?

