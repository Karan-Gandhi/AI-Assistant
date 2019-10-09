const express = require('express');
const app = express();

const gplay = require('google-play-scraper');
const Shell = require('node-powershell');
const Weather = require('weather');
const request = require("request");
require('dotenv').config();

// Start a server
const server = app.listen(process.env.PORT, () => console.log(`Server started at http://localhost:${process.env.PORT}/`));
app.use(express.static('public'));
app.use(express.json({ limit: '100mb' }));

const appID = process.env.WEATHER_APP_ID;
const appCode = process.env.WEATHER_APP_CODE;
const weather = new Weather({ appID, appCode });
const url = process.env.LOCATION_API;
const ps = new Shell({ executionPolicy: 'Bypass', noProfile: true });


// Get request
app.get('/gPlaySearch/:term', async (request, response) => {
    const term = request.params.term;

    gplay.search({
        term: term,
        num: 1
    }).then(data => {
        response.json(data);
    });
});

app.get('/open/:term', async (request, response) => {
    const term = request.params.term;

    ps.addCommand(`Start-Process ${term}.exe`);
    ps.invoke().then(output => {
        console.log(output);
        response.json(data);
    }).catch(err => {
        console.log(err);
        response.json(err);
    });
});

app.get('/weather/:loaction', async (request, response) => {
    const loaction = request.params.loaction;

    weather.now(loaction).then((results) => {
        response.json(results);
    });
});

app.get('/location', async (req, res) => {
    request({
        url: url,
        json: true
    }, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log(body); 
            res.json(body);
        }
    });
});

app.get('/userData/isMobile=:bool', async (request, response) => {
    const isMobile = request.params.bool;
    // console.log(isMobile);
    if (isMobile) {
        delete process.env.PORT;
        delete process.env.LOCATION_API;
        delete process.env.WEATHER_APP_ID;
        delete process.env.WEATHER_APP_CODE;
        response.json(process.env);
    } else {
        response.json("Not a mobile device");
    }
});

// Socket.io
const io = require('socket.io')(server);

io.sockets.on('connection', (socket) => {
    console.log("We have a new client: " + socket.id);
    
    socket.on('disconnect', () => console.log("Client has disconnected") );

    socket.on('userdata', (d) => socket.broadcast.emit('userdata', d) );
});