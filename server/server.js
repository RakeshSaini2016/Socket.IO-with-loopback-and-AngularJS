'use strict';

var loopback = require('loopback');
var boot = require('loopback-boot');
var bodyParser=require('body-parser');
var jsonparser=bodyParser.json();
var app = module.exports = loopback();

app.use('/', loopback.static('../client/'));
app.use('/scripts', loopback.static(__dirname + '/node_modules/angular/'));
app.use('/node_modules', loopback.static('../node_modules/'));

app.start = function () {
  // start the web server
  return app.listen(function () {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function (err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module) {
    //app.start();
    //Start the Socket Server
    app.io = require('socket.io')(app.start());
    app.io.on('connection', function (socket) {
      
      console.log('a user connected');

      socket.on('disconnect', function () {
        console.log('user disconnected');
      });

    });
  }

});
