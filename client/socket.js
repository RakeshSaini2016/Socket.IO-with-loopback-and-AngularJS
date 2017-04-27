    'use strict';
angular.module('LoopbackSocketIntegration')

//Here LoopBackAuth service must be provided as argument for authenticating the user
.factory('socket', function(LoopBackAuth){
    //Creating connection with server
    var socket = io.connect('http://localhost:3000');
    
  return socket;

});