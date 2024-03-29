> 🛠 **Status: Active Development | Stable**
>
> This project is under active development.
>
> ⚠️ ⚠️ The `main` branch works with [api](https://github.com/resonatecoop/api). If you want to fix a bug in the currently **live** version of Beam, which works with the active id.resonate.coop services, please submit them to the [v0.5-maintenance](https://github.com/resonatecoop/beam/tree/v0.5-maintenance) branch.

# Beam

This is a music player that uses Resonate's API.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

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

### Running against the API

The client is set up to run against a locally running version of the [API](https://github.com/resonatecoop/api). Check instructions there for how to get it to run. You can also run the client against our stage server (please be nice to it), but for that you'll have to ask us to add a client to the server.

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
