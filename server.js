var restify = require('restify'),
    mongoose = require('mongoose'),
    twitter = require('ntwitter'),
    config = require('./config'),
    Polaroid = require('./models/Polaroid'),
    streamHandler = require('./utils/streamHandler');

// Create an express instance and set a port variable
var port = process.env.PORT || 8080;

// Connect to our mongo database
mongoose.connect(config.mongodb.uri);

var twit = new twitter(config.twitter);
var server = restify.createServer();
var startTime = Math.floor(Date.now() / 1000);

server.get('/', function (req, res, next) {
    data = {};
    data.start = startTime;
    data.elapsed = Math.floor(Date.now() / 1000) - startTime;

    res.send(data);

    if (next){
      next();
    }
});

server.listen(port, function () {
    console.log('Twitaroid-Server listening on port ' + port);
});

var ws = require("nodejs-websocket");

var webSocketServer = ws.createServer(function (conn) {
    conn.on("close", function (code, reason) {
        console.log("WebSocketServer: Client Connection closed")
    });

    conn.on("error", function (err) {
      console.log("WebSocketServer: Error;", err);
    });
}).listen(port + 1);


twit.stream('statuses/filter', {track: 'twitaroid_dev'}, function (stream) {
        streamHandler(stream, webSocketServer);
});
