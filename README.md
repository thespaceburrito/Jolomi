## Project Overview

This is a web app that enables the transferring of playlist between different music streaming platforms. The app can currently transfer playlist from Deezer to Spotify.

### Prerequisites

Requirements for the software and other tools to build, test and push

- Node.js
- Git Bash

## How To Use

To start, download project zip folder and after downloading the zip folder, double click it to uncompress it and access the contents of this project. Use your preffered source-code editor to view the contents.

### Installing

Open the root project directory in Git Bash terminal.

Install npm packages

    npm install

Setup .env with your Spotify API key and MongoDB Connection String

    Create new file .env with contents
    SPOTIFY_CLIENT_ID="your Spotify api Client ID"
    SPOTIFY_CLIENT_SECRET="your Spotify api secret"
    MONGODB_CONNECTION_STR="your MongoDB Cluster connection string"

Run npm

    npm start

run index.js

    node index.js

view app in a web browser at port 80

    https://localhost:80

## Deployment

To be deployed as a web app. Currently hosted at http://cn-pc.tech/

## Authors

**Jonathan Obi** - **Andrew Robinsion**
