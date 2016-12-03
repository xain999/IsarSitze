import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  // code to run on server at startup
  //start Mqtt connection, global instance
mqtt = require('mqtt');
Fiber = Npm.require('fibers');
mqttClient  = mqtt.connect('mqtt://localhost');


mqttClient.on('connect', function () {
  mqttClient.subscribe("/sitze/wagen1");
  console.log("Client ist connected.");
  //client.publish('/sitze/wagen1', 'Hello mqtt')
});

console.log("App Started");

//Falls eine Nachricht ankommt, in DataBase abspeichern
 mqttClient.on('message', function (subscribedTopic, rawMessage) {

console.log("Subscription: " + subscribedTopic);
console.log("Message: " + rawMessage.toString());
// var d = new Date();
// var t = d.getTime();

// Fiber(function() {
//   RawMessagesList.insert({
//     created_at: new Date(),
//     received: t.toString(),
//     topic: subscribedTopic.toString(),
//     message: rawMessage.toString() });
// });

 })
});


//shared collection
//Messages = new Meteor.Collection("messages");
//serverside mqtt in-stream
//Messages.mqttConnect("mqtt://localhost:1883", ["topic"], {insert: bool});