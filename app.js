/*eslint-env node*/

//------------------------------------------------------------------------------
// hello world app is based on node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// create a new express server
var app = express();

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

app.use(bodyparser.urlencoded({extended:true}));
app.use(bodyparser.json());

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

console.log('Finished initializaitons....');

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {

	// print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});

app.get('/webhook', (req, res) => {
  if (req.query['hub.mode'] && req.query['hub.verify_token'] === 'tuxedo_cat') {
    res.status(200).send(req.query['hub.challenge']);
  } else {
    res.status(403).end();
  }
});

/* Handling all messenges */
app.post('/webhook', (req, res) => {
  console.log(req.body);
  if (req.body.object === 'page') {
    req.body.entry.forEach((entry) => {
      entry.messaging.forEach((event) => {
        if (event.message && event.message.text) {
          sendMessage(event);
        }
      });
    });
    res.status(200).end();
  }
});

const request = require('request');

function sendMessage(event) {
  "use strict";	
  console.log('entered the sendMessage() function');
	
  
  let sender = event.sender.id;
  let text = event.message.text;

  request({
    url: 'https://graph.facebook.com/v2.9/me/messages',
    qs: {access_token: 'EAACwHGVDi1sBAJFU6uBNMeitmQ6MaChQsJfxhysFTP1MSrFcVJZA9iQ1fSub5QNOVTP4KRJYbzcTvOIMVZBNa9mZBhBgmduZCqvl7RWoU6NoC5sjHPVgUmdj9cZC78l2HcAhLfd5ITNN0Y6KQS1BrfeZB71z0WKWKawnrRV1JUFwZDZD'},
    method: 'POST',
    json: {
      recipient: {id: sender},
      message: {text: text}
    }
  }, function (error, response) {
    
    console.log('Entered last function for some reason..');
    
    if (error) {
        console.log('Error sending message: ', error);
    } else if (response.body.error) {
        console.log('Error: ', response.body.error);
    }
  });
}
