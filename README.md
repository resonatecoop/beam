# Beam

This is a music player that uses Resonate's API.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

# Development

```
git clone git@github.com:simonv3/beam.git
cd beam
yarn start
```

Runs the app in the development mode.\
Open [http://localhost:8080](http://localhost:8080) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

## Production build

```
yarn build
```

You can then run that locally with

```
yarn serve
```

## Tests

```
yarn test
```

# Electron

Set up using https://mmazzarolo.com/blog/2021-08-12-building-an-electron-application-using-create-react-app/

To try it locally do:

```
yarn electron:start
```

To build it for your system:

```
yarn electron:package:<linux|mac|windows>
```

# Preparing a release

In a distinct commit that _just_ bumps the version.

1. Edit the package.json with the new version `vx.x.x`.
2. `git commit -am vx.x.x`
3. `git tag vx.x.x`
4. `git push && git push --tags`
