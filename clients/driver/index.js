const {io} = require("socket.io-client");
const events = require('../../utility.js')
const client = io("ws://localhost:3000/caps");


const {handleReady} = require('./handler.js')
//listen for announcement
client.on(events.announcement, (payload)=> {
  console.log(payload.message)
});

client.on(events.ready, handleReady);


module.exports = { client};