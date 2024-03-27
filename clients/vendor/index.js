const {io} = require("socket.io-client");

const events = require('../../utility.js')

// pass a value it will hold open a socket
const client = io("ws://localhost:3000/caps");

//the delivery
const payload = {
  customerId: "john smith",
  orderId: 1,
  address: "1125 Cherry Lane" 
}
// when vendor index.js starts it will emit that they have a pickupReady, hub hears it and says "I received your message".

//uses a keyword ("received") almost like a /route that will connect hub to the vendor and driver
client.emit(events.pickup, payload);
// client.on("received", (payload) => {
//   console.log(payload.message)
// })

client.on(events.announcement, (payload)=> {
  console.log(payload.message)
});

client.on(events.pickedUp, (payload)=> console.log("the package has been picked up by the driver",payload.orderId));

client.on(events.pickedUp, (payload)=> console.log("the package is in transit",payload.orderId))

client.on(events.delivered, (payload)=> console.log(payload.message,payload.orderId))


module.exports = { client};