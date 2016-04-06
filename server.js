var express = require('express');
var app = express();
var http = require('http').Server(app);

app.use(express.static('public'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/Kool.html');
});

app.get('/main.html', function(req, res) {
  res.sendFile(__dirname + '/public/main.html');
});

app.get('/old', function(req, res) {
  res.sendFile(__dirname + '/public/old/weather.html');
});

http.listen(4000, function(){
  console.log('Server up on *:4000');
});