# Waste Hunter

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

The source code repository is hosted on [github.com/derkphi/waste-hunter](https://github.com/derkphi/waste-hunter) and the production build is deployed to [waste-hunter.web.app](https://waste-hunter.web.app/).

## Prerequisites

- [Node.js](https://nodejs.org/) v14.18.0 or higher with npm.
- [WebStorm](https://www.jetbrains.com/webstorm/) or [Visual Studio Code](https://code.visualstudio.com/) editor (with [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) and [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) plug-ins)
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
src/components/maps/config.ts
```

Mapbox configuration:

```
src/firebase/config.tsx
```

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

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
        favicon.ico
        index.html
        manifest.json
        robots.txt
    src/
        assets/
        components/
            camera/
            event/
            map/
                config.ts
            report/
            statistic/
            customRoute.tsx
            header.tsx
        firebase/
            config.tsx
            firebase_types.ts
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

### API and UI

- [Firebase](https://firebase.google.com/) serverless backend infrastructure.
- [Material UI](https://mui.com) React UI framework.
- [react-map-gl](https://visgl.github.io/react-map-gl/) React library for [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/guides/).

### Unit Testing

- [Jest](https://jestjs.io/) as testing framework.

### Linting

- [ESLint](https://eslint.org/) for static code analysis.
- [Prettier](https://prettier.io/) as code formatter.
