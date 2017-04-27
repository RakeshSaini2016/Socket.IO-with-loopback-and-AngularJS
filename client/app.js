var app = angular.module("LoopbackSocketIntegration", ["ngRoute","ngResource"]);

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: '/index.html'
  });
}]);

app.factory('socket', ['$rootScope', function($rootScope) {
  var socket = io.connect();

  return {
    on: function(eventName, callback){
      socket.on(eventName, function(){
        var args=arguments;
        $rootScope.$apply(function(){
            callback.apply(socket,args);
        });
      });
    },
    emit: function(eventName, data,callback) {
      socket.emit(eventName, data,function(){
        var args=arguments;
        $rootScope.$apply(function(){
          if(callback){
              callback.apply(socket,args);
          }
        });
      });
    }
  };
}]);

// app.factory('orders',['$resource',function($resource){

//   var server=$resource('/api/orders/getAllSubmitOrders');
//   return {
//     query:function(){
//       return server.query();
//     };
//   };

// }])

app.controller('MainController', function($scope, socket,$http) {
  $scope.orders = [{'ordercontent':'order1','posted_at':'01-jan-2016'}];
  GetALLOrders();

  socket.on('addorder', function(alldata) {
            console.log(alldata);
            $scope.orders=alldata;
        });

  function GetALLOrders() {
          
          // var data={'ordercontent':'Order3','posted_at':new Date()};  // these below two lines for Register event
          // $http.post('api/orders/submitOrder', data);

          $http.get("api/orders/getAllSubmitOrders")
              .then(function (response) { 
                var data=response.data;
                 _.each(data.orders,function(obj){
                      $scope.orders.push({'ordercontent':obj.ordercontent,'posted_at':obj.posted_at});
                   });
                  console.log($scope.orders); 
           });

      }; 
  

  $scope.SubmitOrder=function(ordercontent){

        // socket.emit('add-order', $scope.currentOrder);
        //     };
        var data={'ordercontent':ordercontent,'posted_at':null};

        $http.post('api/orders/submitOrder', data);
        // .success(function (successCallback) {
        //         console.log(successCallback);
        //         if (successCallback == true) {
        //             console.log('Order Succesfully Save !!', 'Information');
        //         }
        //         else
        //             console.log('Something went wrong', 'Error');
        // });

        
        

    };

});


