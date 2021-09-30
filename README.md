# Waste Hunter

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

The source code repository is hosted on [github.com/derkphi/waste-hunter](https://github.com/derkphi/waste-hunter) and the production build is deployed to [waste-hunter.web.app](https://waste-hunter.web.app/).

## Prerequisites

- [Node.js](https://nodejs.org/) v14.18.0 or higher with npm.
- [Visual Studio Code](https://code.visualstudio.com/) editor (with [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) and [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) plug-ins)
- [Firebase](https://firebase.google.com/) project with Authentication, Realtime Database, Storage and Hosting.
- [Mapbox](https://www.mapbox.com) API access token.

## Installation

Clone repository and install dependencies:

```
git clone https://github.com/derkphi/waste-hunter.git
cd waste-hunter
npm install
```

Firebase configuration:

```
/src/components/maps/config.ts
```

Mapbox configuration:

```
/src/firebase/config.tsx
```

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.

## Deployment

The GitHub repository is set up with "Firebase Hosting" Actions which deploys the application to live and preview channels on merge and pull request ([Deploy via GitHub](https://firebase.google.com/docs/hosting/github-integration)).

## Folder Structure

```
waste-hunter/
    .github/
        workflows/
            firebase-hosting-merge.yml
            firebase-hosting-pull-request.yml
    .idea/
    .vscode/
    build/
    node_modules/
    public/
        index.html
        manifest.json
    src/
        assets/
        components/
            camera/
            event/
            map/
                config.ts
            report/
            statistic/
        firebase/
            config.tsx
        hooks/
        screens/
        App.tsx
        index.tsx
    .firebaserc
    .gitignore
    firebase.json
    package-lock.json
    package.json
    README.md
    tsconfig.json
```

## Tech Stack

### Core

- [React](https://reactjs.org/) component based user interface library.
- [Typescript](https://www.typescriptlang.org) typed programming language.
- [Create React App](https://github.com/facebook/create-react-app) integrated React toolchain.
- [React Router](https://reactrouter.com/web/guides/quick-start) declarative routing for React.

### API

- [Firebase (v5)](https://firebase.google.com/docs/reference/js/v8) serverless backend infrastructure.

### User Interface

- [Material UI (v4)](https://v4.mui.com/) React UI framework.
- [react-map-gl](https://visgl.github.io/react-map-gl/) React library for [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/guides/).

### Linting

- [ESLint](https://eslint.org/) for static code analysis.
- [Prettier](https://prettier.io/) as code formatter.

## To-Do's

- Migrate Material-UI v4 to MUI v5, released on September 1st, 2021 ([Guide](https://mui.com/guides/migration-v4/))
- Upgrade Firebase v8 to modular v9 Web SDK, released on August 25, 2021 ([Guide](https://firebase.google.com/docs/web/modular-upgrade#about_the_upgrade_process))
