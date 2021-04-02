var express = require('express');
var app = express();
var expressWs = require('express-ws')(app);
var router = express.Router();

router.ws('/'), function(ws, req) {
    ws.send('connected.')
    var number = 0
    setInterval(() => {
        ws.send(number++)
    }, 2000);
    ws.on('message', function(msg) {
        ws.send(msg);
    });
}

module.exports = router;
