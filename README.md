# Beam

This is a music player that uses Resonate's API.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

View the [project board](https://github.com/resonatecoop/beam/projects/1) where work is tracked for this repository.

## Development

Install yarn if you don't yet have it on your machine by running:

```bash
npx install yarn
```

```bash
git clone git@github.com:resonatecoop/beam.git
cd beam
yarn install
yarn start
```

Runs the app in the development mode.\
Open [http://localhost:8080](http://localhost:8080) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### Logging in.

By default, most of the app will work without logging in, but if you want to log in you'll need a `client_secret`. Logging in will let you play complete songs, manage your playlists, etc.

First, create a local .env file:

```bash
cp .env .env.local
```

Then, you'll need to set `REACT_APP_CLIENT_SECRET` to be the client \
secret for your client app. If you're working on beam directly, \
you can message [Si](https://community.resonate.coop/u/psi/summary) \
to get a client secret.

### Production build

```bash
yarn build
```

You can then run that locally with

```bash
yarn serve
```

### Tests

for unit tests:

```bash
yarn test
```

for cypress tests:

```bash
yarn cypress:open
```

## Electron

Set up using [this blog post](https://mmazzarolo.com/blog/2021-08-12-building-an-electron-application-using-create-react-app/)

To try it locally do:

```bash
yarn electron:start
```

To build it for your system:

```bash
yarn electron:package:<linux|mac|windows>
```

## Preparing a release

In a distinct commit that _just_ bumps the version.

1. Edit the package.json with the new version `vx.x.x`.
2. `git commit -am vx.x.x`
3. `git tag vx.x.x`
4. `git push && git push --tags`
