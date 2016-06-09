'use strict';

var bodyParser = require('body-parser');
var express = require('express');
var request = require('request');

var router = express.Router();
var app = express();

app.set('port', process.env.PORT || '3000');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/', router);

router.get('/reboot', function (req, res) {
    var name = req.query.name;
    var options = {
        url: 'https://api.heroku.com/apps/' + name + '/dynos/web.1',
        method: 'DELETE',
        headers: {
            Accept: 'application/vnd.heroku+json; version=3',
            Authorization: 'Bearer ' + process.env.HEROKU_APP_KEY
        }
    };
    request(options, function (err, response) {
        if (response && response.statusCode === 202) {
            console.log(name.toUpperCase() + ' has been successfully restarted');
            res.status(200).json({message: 'DONE'});
        } else if (err) {
            console.log('Failed to reboot: [' + err.message + ']');
            res.status(410).json({message: 'FAILED'});
        } else {
            console.log('Failed to reboot', 'Status: [' + response.statusCode + ']', 'Message: [' + response.statusMessage + ']');
            res.status(500).json({message: 'FAILED'});
        }
    });
});

app.listen(app.get('port'), function () {
    console.log('REWAKER is up & running on port #' + app.get('port'));
});

module.exports = app;