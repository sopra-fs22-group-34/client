# Azul Client
<p align="center">
  <img src="https://github.com/sopra-fs22-group-34/client/blob/master/src/assets/logo.png?raw=true" />
</p>

[Open Server](https://sopra-fs22-group-34-server.herokuapp.com/)

[Open Client](https://sopra-fs22-group-34-client.herokuapp.com/)

![example workflow](https://github.com/sopra-fs22-group-34/client/actions/workflows/deploy.yml/badge.svg)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=sopra-fs22-group-34_client&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=sopra-fs22-group-34_client)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=sopra-fs22-group-34_client&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=sopra-fs22-group-34_client)

# Introduction
Azul, famous for winning board game of the year 2018,  is a board game we all love to play, especially with each other. “In Azul players collect sets of similarly colored tiles which they place on their player board. When a row is filled, one of the tiles is moved into a square pattern on the right side of the player board, where it garners points depending on where it is placed in relation to other tiles on the board.” We used to play this game between lessons but then Covid struck and we couldn’t meet up anymore at the university to play. Not living close to each other makes it unfortunately very difficult to plan a date outside of university to play the game together. For this reason we created our own online version of this amazing game to play together wherever and whenever we want to. Also we thought it might be a cool idea to present the game to more peers, as most of them don’t know the game yet which we think is a pity. In our version of the game we implemented multiple automatic features (e.g. the points are calculated automatically) in order for the players to focus more on the fun while playing and the strategic aspects of the game.

# Technologies
The client application is built mostly with React.js

# High-level Components
## Game
Role: The page that displays the entire game board and allows players to click on tiles to play the game

Relations: The Lobby redirects to the Game once a lobby is full, and the Game redirects to the Overview once a game is over

[Link](https://github.com/sopra-fs22-group-34/client/blob/master/src/components/views/Game.js)

## Overview
Role: The page that allows users to start a new game, join an open lobby, or spectate a running game. They can also access the user list and rules from here

Relations: Basically every other page 

[Link](https://github.com/sopra-fs22-group-34/client/blob/master/src/components/views/Overview.js)

## Login
Role: This page allows new users to register and existing users to login

Relations: Once someone successfully logs in/registers, they reach the Overview page

[Link](https://github.com/sopra-fs22-group-34/client/blob/master/src/components/views/Login.js)

# Launch & Deployment
## Getting started

Read and go through these Tutorials. It will make your life easier!

- Read the React [Docs](https://reactjs.org/docs/getting-started.html)
- Do this React [Getting Started](https://reactjs.org/tutorial/tutorial.html) Tutorial (it doesn’t assume any existing React knowledge)
- Get an Understanding of [CSS](https://www.w3schools.com/Css/), [SCSS](https://sass-lang.com/documentation/syntax), and [HTML](https://www.w3schools.com/html/html_intro.asp)!

Next, there are two other technologies that you should look at:

* [react-router-dom](https://reacttraining.com/react-router/web/guides/quick-start) offers declarative routing for React. It is a collection of navigational components that fit nicely with the application.
* [react-hooks](https://reactrouter.com/web/api/Hooks) let you access the router's state and perform navigation from inside your components.

## Prerequisites and Installation
For your local development environment, you will need Node.js. You can download it [here](https://nodejs.org). All other dependencies, including React, get installed with:

```npm install```

Run this command before you start your application for the first time. Next, you can start the app with:

```npm run dev```

Now you can open [http://localhost:3000](http://localhost:3000) to view it in the browser.

Notice that the page will reload if you make any edits. You will also see any lint errors in the console (use Google Chrome).

### Testing
Testing is optional, and you can run the tests with `npm run test`.
This launches the test runner in an interactive watch mode. See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

> For macOS user running into a 'fsevents' error: https://github.com/jest-community/vscode-jest/issues/423

### Build
Finally, `npm run build` builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance: the build is minified, and the filenames include hashes.<br>

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Learn More

To learn React, check out the [React documentation](https://reactjs.org/).


> Thanks to Lucas Pelloni and Kyrill Hux for working on the template.

# Illustrations



# Roadmap
- Add in-game chat
- Add an overview of the game board which names the different components to the game rules page
- Private lobbies have a copy button that automatically copies the secret code in someone's clipboard

# Authors and acknowledgement
Samuel Brander, Ethan Ohlin, Nora Beringer, Robin Meister, Maximilian Hausdorf

Shoutout to:
- Whoever created the confetti in React.js
- Tiles Icon API

# License
Apache License 2.0
