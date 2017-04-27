'use strict';
var orders=[{'ordercontent':'order1','posted_at':'01-jan-2016'},{'ordercontent':'order2','posted_at':'02-jan-2016'}];

module.exports = function (Order) {
    Order.remoteMethod('submitOrder',
        {
            accepts:
            [
                { arg: 'order', type: 'object', http: { source: 'body' } }
            ],
            returns: { arg: 'success', type: 'boolean' },
            http: { path: '/submitOrder', verb: 'post' }
        });

    


    Order.submitOrder = function (order, cb) {
        // order.posted_at= new Date();
        // orders.push(order);
        // Order.app.io.emit('addorder', orders);
        // return cb(null,true);

        var allOrders=[];
        
        Order.create({
            'ordercontent': order.ordercontent,
            'posted_at': new Date()
        },
            function (err, mess) {
                if(err)
                {
                    console.log('aa gaya error');
                    return cb(err,mess);;
                }
                 else{
                   Order.find({},function(err,data){
                       
                       data.forEach(function(obj) 
                         {
                           allOrders.push({'ordercontent':obj.ordercontent,'posted_at':obj.posted_at});
                        });
                        Order.app.io.emit('addorder', allOrders); //the order is sent to the other clients using the emit() method of Socket.io
                        return cb(null,true);
                   });
                }
            });
       }




    Order.remoteMethod('getAllSubmitOrders',
            {
                accepts:[],
                returns: { arg: 'orders', type: ['order'] },
                http: { path: '/getAllSubmitOrders', verb: 'get' }
            });


    Order.getAllSubmitOrders = function (cb) {
       var temp=[]
      Order.find({},function(err,data){ 
          data.forEach(function(obj) 
            {
                temp.push({'ordercontent':obj.ordercontent,'posted_at':obj.posted_at});
            });
             Order.app.io.emit('addorder', temp); //the order is sent to the other clients using the emit() method of Socket.io
          return cb(null,temp);
      });

      //return cb(null,orders);
    }

};
