const axios = require('axios');
var express = require('express');
var router = express.Router();

router.get('/', async (req, res) => {
    let state = req.query.state || null;
    let code = req.query.code || null;

    if(state == req.cookies['state']) {
        // the state matches that which was provided at login request
        if(req.query.error) {
            res.send("An error occurred while logging in or access was denied. Please try again.");
            return;
        }

        try {
            let token = await axios({
                method: 'post',
                url: 'https://accounts.spotify.com/api/token',
                params: {
                    grant_type: 'authorization_code',
                    code: code,
                    redirect_uri: 'http://localhost:8888/callback'
                },
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'Authorization': `Basic ${Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64')}`
                }
            });
            
            res.clearCookie('state');
            res.cookie('spot_access_token', token.data.access_token, {httpOnly: true, maxAge: (1000 * (token.data.expires_in - 5))});
            res.cookie('spot_refresh_token', token.data.refresh_token, {httpOnly: true, maxAge: (1000 * 86400 * 365)});
            // res.cookie('expires_in', token.data.expires_in);
            // res.cookie('expires_at', (Date.now() + (1000 * (clientAccessToken.expires_in - 5)))); // five second overlap to ensure uptime
            
            //  TODO: get any user data we may want and set cookie
            
            //decode state object and get state.state
            redirect = JSON.parse(Buffer.from(state, 'base64').toString('ascii')).state;
            if(redirect) {
                res.redirect(`/?link=${redirect}`);
            } else {
                res.redirect('/');
            }

        } catch (err) {
            res.send("Could not login with spotify: error " + err.response.status);
        }
    } else {
        res.send("Could not login with spotify: error state_mismatch. Please try again.");
    }
});

module.exports = router;