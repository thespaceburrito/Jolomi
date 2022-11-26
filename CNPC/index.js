//environment vars
require('dotenv').config();

//mongodb connection
const MongoClient = require('mongodb').MongoClient;
const connectionString = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@creativelynamedplaylist.eq6dck7.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
var db;

//routes
var loginRoute = require('./routes/login.js');
var callbackRoute = require('./routes/callback.js');
var apiRoute = require('./routes/api.js');

//express setup
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/app'));
app.use(cookieParser());
app.use(express.json()); 


app.use('/login', loginRoute);
app.use('/callback', callbackRoute);
app.use('/api', async (req, res, next) => {
        req.db = db;
        next();
    }, apiRoute);


app.get('/', (req, res) => {
    if(req.cookies['spot_refresh_token']) {
        res.render('index.ejs', {loggedIn: true});
    } else {
        res.render('index.ejs', {loggedIn: false});
    }
});

app.listen(80, async () => {
    try {
        await client.connect();
        console.log("Successfully connected to database"); 
        db = client.db("cnpcDB");
    } catch (error) {
        console.log(error);
    }
    console.log("Listening to requests on port 8888...");
});