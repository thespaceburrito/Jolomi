const axios = require('axios');
var express = require('express');
var router = express.Router();

//client credientials access for fallback
var clientAccessToken = {
    lock: false                                     // so that we don't attempt to generate more than one client access token at a time
};
async function newClientAccessToken() {
    if(clientAccessToken.lock === true) {
        while(clientAccessToken.lock === true) { await new Promise(r => setTimeout(r, 2)); }    //2ms timeout to save server resources
        return; // return when whichever call to this function finishes making the token 
    }
    clientAccessToken.lock = true; // exclude our cat from being updated by anything other than this call 
    let token = await axios({
        method: 'post',
        url: 'https://accounts.spotify.com/api/token',
        params: {
            grant_type: 'client_credentials'
        },
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64')}`
        }
    });
    clientAccessToken.access_token = token.data.access_token;
    clientAccessToken.token_type = token.data.token_type;
    clientAccessToken.expires_in = token.data.expires_in;
    clientAccessToken.expires_at = (Date.now() + (1000 * (clientAccessToken.expires_in - 5))); // five second overlap to ensure uptime
    clientAccessToken.lock = false;
    console.log(clientAccessToken);
    return;
}

async function refreshUserAccessToken(refresh_token) {
    try {
        let token = await axios({
            method: 'post',
            url: 'https://accounts.spotify.com/api/token',
            params: {
                grant_type: 'refresh_token',
                refresh_token: refresh_token
            },
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64')}`
            }
        });
        return token.data;
    } catch (err) {
        return null;
    }
}


// GET /api/commonplaylistobject -- accepts query playlistlink=xxxx
//                                  responds with json body of document
router.get('/commonplaylistobject', async (req, res) => {
    //If playlistlink exists, just return that.
    if(req.query.playlistlink == null) { res.sendStatus(400); return; }
    try {
        let dbCheck = await req.db.collection("playlists").findOne({ applemusic_url: req.query.playlistlink }, {projection: {_id: 0}});
        if(dbCheck) {
            res.send(dbCheck);
            return;
        }
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
        return;
    }

    //TODO: Gen array of ISRC codes from apple music playlist
    let testPlayList = [
        'GBAYE1001387',
        'USYAH1300029',
        'USJ441600101',
        'QM24S1802715',
        'GBBRP1549306',
        'USMRG1140005',
        'AUUM71800020',
        'QMF7R1300001',
        'USCA29300105',
        'USUM71923111',
        'GBKPL1663770',
        'CAUM81700073',
        'TCACW1749848',
        'AUAP10900004',
        'USQX91301053',
        'GBARL1200767',
        'AUUM71500886'
    ];

    let newPlaylistDoc = {
        applemusic_url: "test.com",
        name: "Road Songs",
        songs: []
    };

    let at;
    if(req.cookies['spot_access_token'] != null) {
        at = req.cookies['spot_access_token'];
    } else if(req.cookies['spot_refresh_token']) {
        let token = await refreshUserAccessToken(req.cookies['spot_refresh_token']);
        if(token === null) {
            //check on client credentials and respawn if invalid
            if(clientAccessToken.expires_at < Date.now()) {
                await newClientAccessToken();
                at = clientAccessToken.access_token;
            }
        } else {
            //update user's cookies && set at = token.access_token
            res.cookie('spot_access_token', token.access_token, {httpOnly: true, maxAge: (1000 * (token.expires_in - 5))});
            at = token.access_token;
        }
    } else {
        if(clientAccessToken.expires_at < Date.now()) {
            await newClientAccessToken();
            at = clientAccessToken.access_token;
        }
        at = clientAccessToken.access_token;
    }

    for(var song of testPlayList) {
        try {
            let search = await axios({
                method: 'get',
                url: 'https://api.spotify.com/v1/search',
                params: {
                    q: `isrc:${song}`,
                    type: 'track',
                    limit: 1
                },
                headers: {
                    'content-type': 'application/json',
                    'Authorization': `Bearer ${at}`
                }
            });

            let spotifySongObj = search.data.tracks.items[0];
            if (spotifySongObj==null) {
                continue;
            }

            let mySong = {
                spotify_url: spotifySongObj.external_urls.spotify,
                spotify_uri: spotifySongObj.uri,
                spotify_id: spotifySongObj.id,
                isrc: song,
                name: spotifySongObj.name,
                artists: [],
                duration: spotifySongObj.duration_ms,
                cover: spotifySongObj.album.images[0],
                explicit: spotifySongObj.explicit
            };
            
            for (var artist of spotifySongObj.artists) {
                mySong.artists.push({
                    name: artist.name,
                    link: artist.external_urls.spotify
                });
            }
            newPlaylistDoc.songs.push(mySong);
        } catch (err) {
            console.log(err);
            res.sendStatus(502);
            return;
        }
    }

    try {
        let entry = await req.db.collection("playlists").insertOne(newPlaylistDoc);
        if(entry.acknowledged) {
            res.status(200).send(newPlaylistDoc);
        } else {
            res.sendStatus(500);
        }
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
        return;
    }
});

// POST /api/spotifyplaylist
// creates new spotify playlist on user's account and adds songs in given playlist to it
//      STATELESS -- operates only on info passed to it by request
router.post('/spotifyplaylist', async (req, res) => {
    //  reject request if no access token is present and refresh token fails to get new one
    let at;
    if(req.cookies['spot_access_token'] != null) {
        at = req.cookies['spot_access_token'];
    } else if(req.cookies['spot_refresh_token']) {
        let token = await refreshUserAccessToken(req.cookies['spot_refresh_token']);
        if(token === null) {
            //reject request
            res.sendStatus(401);
            return;
        } else {
            //update user's cookies && set at = token.access_token
            res.cookie('spot_access_token', token.access_token, {httpOnly: true, maxAge: (1000 * (token.expires_in - 5))});
            at = token.access_token;
        }
    } else {
        //reject request
        res.sendStatus(401);
        return;
    }

    //  reject if commonplaylistobject is null
    if(!req.body.commonplaylistobject) {
        res.sendStatus(400);
        return;
    }

    //  get user_id from GET https://api.spotify.com/v1/me | user_id = response.data.id
    let user_id;
    try {
        let search = await axios({
            method: 'get',
            url: 'https://api.spotify.com/v1/me',
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${at}`
            }
        });
        user_id = search.data.id;
    } catch (err) {
        res.status(401).send('Could not get spotify user data');
        return;
    }

    //  create new playlist on user's account: POST https://api.spotify.com/v1/users/${user_id}/playlists
    let playlist_id;
    let playlist_link;
    try {
        let playlist = await axios({
            method: 'post',
            url: `https://api.spotify.com/v1/users/${user_id}/playlists`,
            data: {
                name: req.body.name,
                public: req.body.public,
                collaborative: false,
                description: req.body.description
            },
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${at}`
            }
        });
        playlist_id = playlist.data.id;
        playlist_link = playlist.data.external_urls.spotify;
    } catch (err) {
        res.status(502).send('Could not create spotify playlist');
        return;
    }

    //  POST https://api.spotify.com/v1/playlists/${playlist_id}/tracks with body uris: req.body.commonplaylistobject.songs
    let songs = [];
    for (let song of req.body.commonplaylistobject.songs) {
        songs.push(song.spotify_uri);
    }

    try {
        await axios({
            method: 'post',
            url: `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`,
            data: {
                uris: songs
            },
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${at}`
            }
        });
    } catch (err) {
        res.status(502).send('Could not add tracks to spotify playlist');
        return;
    }

    //  if successful, return playlist_link
    res.json({status: 201, playlist: playlist_link});
});




newClientAccessToken();
module.exports = router;
