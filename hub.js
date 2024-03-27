// make a new instance of a socket server

const {Server} = require('socket.io');

const events = require('./utility.js')

const io = new Server();

io.listen(3000);


// namespace (in case someone wanted to connect to a specific socket )
const caps = io.of("/caps")


//emit == send
//on == listen

function handlePickupReady(payload, socket) {
  console.log("the pickup was requested",payload.orderId)
// socket only emits back to one socket this is demo only
socket.emit("received", {message: "pickup acknowledged"})
// emit to everyone who is prepared to listen
caps.emit(events.ready, {message: "a pickup is now ready", ...payload})

}

function handleDelivered(payload) {
  console.log(`the package for ${payload.customerId} has been delivered`);

  caps.emit(events.delivered, {orderId: payload.orderId, message: `the package for ${payload.customerId} has been delivered`})
}

function handlePickedUp(payload) {
  //pickedUp is the vendor
  console.log("the driver picked up the package", payload.orderId);

  caps.emit(events.pickedUp, payload)
}

function handleInTransit(payload) {
  console.log("the package is in transit", payload.orderId);

  caps.emit(events.inTransit, payload)
}


function handleConnection(socket) {
// handleConnection will be automatically passed a socket upon connection

console.log("We have a new connection", socket.id);
// packaged ready for pickup - driver needs to know - emit to driver ready
socket.on(events.pickup, (payload) => handlePickupReady(payload, socket));
//package picked up by driver - let the vendor know it has been picked up 
socket.on(events.pickedUp, handlePickedUp)
//package in transit - let the vendor know
socket.on(events.inTransit, handleInTransit)
//make a function that takes in the payload
// function will call the handleReadyPickup pass the payload that came into the handler
// pass the second argument which is the socket

//package delivered - tell everyone it was delivered and is complete 
socket.on(events.delivered, handleDelivered)
}

function startSocketServer() {
  console.log('This server has been started');
  // connection is a magic word that knows to react or listen to any client connect made (when a client connects route them to this channel)

  // a socket will be passed on connection
  caps.on("connection", handleConnection);
}

module.exports= {startSocketServer, handleInTransit,handleDelivered, io,caps};


// will run this code but the hub the driver and the vendor are independent from each other (this hub will only run its code, only knowing this information). 

//likewise driver index.js only requires socket.io-client and hold open a socket