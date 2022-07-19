const crypto = require('crypto');
const url = require('url');
var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
    //TODO: if already logged in with valid auth token or invalid auth token but valid refresh token, then redirect to '/'
    //else:
    let rand = crypto.randomBytes(16);
    let state = Buffer.from(JSON.stringify({
     securityToken: rand.toString('ascii'),
     state: req.query.state || null
    })).toString('base64');
    res.cookie('state', state, {httpOnly: true});

    let params = new url.URLSearchParams({
        client_id: process.env.SPOTIFY_CLIENT_ID,
        response_type: 'code',
        redirect_uri: 'http://localhost:8888/callback',
        state: state,
        scope: 'playlist-modify-private playlist-modify-public',
        show_dialog: false
    });
    res.redirect('https://accounts.spotify.com/authorize?' + params.toString());
});

module.exports = router;