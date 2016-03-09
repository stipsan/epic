const oneDay = 86400000;
const port = process.env.PORT || 5000;
var express = require('express');
var path = require('path');
var html = require('./server/html');

var app = express();
var server  = require('http').createServer(app);
var io = require('socket.io')(server);

// Security reasons
app.set('x-powered-by', false);

// We are on Heroku after all, behind load balancers
app.enable('trust proxy');

if(process.env.NODE_ENV !== 'production') {
  var webpackDevMiddleware = require("webpack-dev-middleware");
  var webpack = require("webpack");
  var config = require('./webpack.config');
  var compiler = webpack(config);
  app.use(webpackDevMiddleware(compiler, {
      publicPath: config.output.publicPath,
      noInfo: true,
  }));
  app.use(require('webpack-hot-middleware')(compiler));
}

app.use(express.static('public'));
app.use(html());

server.listen(port, function() {
  console.log('Node app is running on port', port);
});

const users = new Map();
io.on('connection', function(socket){
  console.log('a user connected');
  socket.broadcast.emit('user connected');
  socket.on('login', function (data) {
    console.log('join', data);
    if(!users.has(data.username)) {
      users.set(data.username, data);
      socket.emit('successful login', {
        users: Array.from(users.values()),
        viewer: {
          username: data.username,
          invites: [],
          requests: [],
        }
      });
      socket.broadcast.emit('join', data);
    } else {
      socket.emit('failed login', {message: 'Username is taken!'});
    }
  });
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});