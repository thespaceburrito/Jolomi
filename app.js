
const fs = require("fs");
const express = require("express");
const app = express();

const SpotifyWebApi = require('spotify-web-api-node');
var spotifyApi = new SpotifyWebApi({
    clientId: '546109c180e642bb8c373e57baf8bd00',
    clientSecret: 'ce1ae5826d724936b9c4364e47951127',
    redirectUri: 'http://localhost:8888/callback'
});

// Retrieve an access token from spotify's api.
spotifyApi.clientCredentialsGrant().then(
    function(data) {
        console.log('The access token expires in ' + data.body['expires_in']);
        console.log('The access token is ' + data.body['access_token']);
        // Save the access token so that it's used in future calls
        spotifyApi.setAccessToken(data.body['access_token']);
    },
    function(err) {
        console.log('Something went wrong when retrieving an access token', err);
    }
);

app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/app'));



/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ROUTING -- I could have these in separate files but they're small enough that it doesn't make too much of a difference
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// STEP 1: render the default page at root url -- DONE
app.get('/', function(req, res){
    res.render('defaultView.ejs');
});

// STEP 2: handle a post request to this server that syncronously sends the playlist link over to this script
// TODO: can't really do anything about this until we have the apple music api keys. For now, it'll just use dummy info
app.post('/sendplaylistdata', function(req, res){
    // I'll have to change this later. This router is going to have to check a database for existing entry, create a .dat file from the apple playlist,
    //              create a database entry linking the url and the .dat file, and then send the randomly generated file name back to the client
    // STEP 3: process the playlist link (if playlist exists on server, use the existing data file. if else, create a new data file for that playlist and upload it to the server)
    
    res.status(201).send("roadsongs"); // send dummy file back to client so they can query from our spotify router
});


// STEP 4: process the data file via spotify's api, getting the name, artist, and duration of each song and sending them back to AlphaFrontEnd.js to populate the page.
app.get('/ret', function(req, res){
    let linkToData = req.query.linktodata;
    try {
        fs.readFile('./usrdata/lists/' + linkToData + '.dat', function(err, playlist){
            if (err) {
                res.send("bad request, no such playlist");        
            } else {
                // in here, we can parse the data in this file and then get the information for each song to send back in a responsefunction parseOurPlaylist() {
                
                // parse the data file into separate ISRC codes
                let len = playlist.length;
                let songnum = (~~(len/12));
                let songs = new Array();

                for (let i=0; i<songnum; i++) {
                    let offset = i * 12;
                    songs.push(playlist.slice((offset+0),(offset+12)));
                }
                // now, the array 'songs' has a bunch of separated 12-digit ISRC codes
                // which we will send to spotify for info (and just return the first search result info)
                let songnames = new Array(songnum);
                let songpromises = new Array();
                (async function() {
                    let i = 0;
                    songs.forEach(function(song){
                        let h = i; // manually guarantee correct order given order isn't guaranteed by async api calls
                        songpromises.push(spotifyApi.searchTracks('isrc:' + song, {limit: 1}).then(
                            function(data) {
                                songnames[h] = data.body.tracks.items[0];
                            },
                            function(err) {
                                console.log('Something went wrong!', err);
                            }
                        ));
                        i++;
                    });
                    await Promise.all(songpromises);
                })().then(function(){res.send(songnames)});
                // async and promises are annoying because I don't understand them yet. I need to delay the return until all spotify api info is gathered together.
                // Because the api wrapper makes a promise, the return code below this gets sent before the api calls are returned.
                // So, we get empty, undefined information back. I need to figure out how to wait for all of my calls to finish.
                // UPDATE: This is doable by wrapping the entire thing in an anonymous async function, collecting the promises in an array, and awaiting the promises, so that this code only gets executed after.
                // I believe this is all the code we need for this route.
            }
        });
    } catch (e) {}
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




const server = app.listen(8888, function(){
    console.log('listening to port requests 8888');
});
