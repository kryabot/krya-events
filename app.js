const express = require('express');
const spamEvents = require('./spamEvents');
const halloweenEvents = require('./halloweenEvents');
const port = process.env.PORT || 5001;
const app = express();
const cors = require('cors');

var redis = require('redis');
var subscriber = redis.createClient({
    port:6379,
    host: 'REDIS_IP',
    password: 'REDIS_PASSWORD'
});

subscriber.on("error", function(error) {
    console.error(error);
});

subscriber.on("message", function(channel, message) {
    console.log(`${channel} -> ${message}`);
    data = JSON.parse(message)

    if (channel === 'spam.detector.response') {
        spamEvents.handleMessage(data)
    } else if (channel === 'globalevent.halloween.update') {
        halloweenEvents.handleMessage(data)
    }
});

app.get('/spambots', cors(), spamEvents.subscribe);
app.get('/halloween', cors(), halloweenEvents.subscribe);

app.listen(port, function() {
    subscriber.subscribe('spam.detector.response');
    subscriber.subscribe('globalevent.halloween.update');
});
