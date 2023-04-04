## Project Overview

This is a web app that enables the transferring of playlist between different music streaming platforms. The app can currently transfer playlist from Deezer to Spotify.

### Prerequisites

Requirements for the software and other tools to build, test and push

- Node.js
- Git Bash
- MongoDB cluster with database named 'cnpcDB' and collection named 'playlists'

## How To Use

To start, download project zip folder and after downloading the zip folder, double click it to uncompress it and access the contents of this project. Use your preffered source-code editor to view the contents.

### Installing

Open the root project directory in Git Bash terminal.

Install npm packages

    npm install

Create new file .env with contents

    SPOTIFY_CLIENT_ID="your Spotify api Client ID"
    SPOTIFY_CLIENT_SECRET="your Spotify api secret"
    MONGODB_CONNECTION_STR="your MongoDB Cluster connection string"

Run npm

    npm start

view app in a web browser at port 80

    https://localhost:80

## Deployment

To be deployed as a web app. Currently hosted at http://cn-pc.tech/

*had to revoke api key to make repository public, web app deployment will be back to working status on 1/21/2023*

## Authors

**Jonathan Obi** - **Andrew Robinson**
