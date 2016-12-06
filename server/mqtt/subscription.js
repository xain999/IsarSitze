import { TransportVehicles, Respberries } from '../../database/collections.js';

// Turn this Flag off in debuggin if needed
const USE_MQTT = true;
const EXPORT_OUTPUT_TOPICS = true;

// TODO: Move this to a universal place
Fiber = Npm.require('fibers');

subscribeToMQTT = function(name, belongsTo) {
    const topic = "/" + belongsTo + "/" + name;
    mqttClient.subscribe(topic);
    console.log("subscribed to: " + topic);
}

startMQTT = function() {

    //for debugging
    if (USE_MQTT) {
        //start Mqtt connection, global instance
        mqtt = require('mqtt');
        mqttClient  = mqtt.connect('mqtt://localhost');
    }

    mqttClient.on('connect', function () {
        Fiber(function() {
            result = Respberries.find().forEach(function(element) {
                
                subscribeToMQTT(element["name"], element["belongsTo"]);
            });
        }).run();
        
        console.log("Client ist connected.");
    });

    console.log("App Started");

    //Falls eine Nachricht ankommt, in DataBase abspeichern
    mqttClient.on('message', function (subscribedTopic, rawMessage) {

    console.log("Subscription: " + subscribedTopic);
    console.log("Message: " + rawMessage.toString());
    // var d = new Date();
    // var t = d.getTime();

    //Fiber = Npm.require('fibers');
    // Fiber(function() {
    //   RawMessagesList.insert({
    //     created_at: new Date(),
    //     received: t.toString(),
    //     topic: subscribedTopic.toString(),
    //     message: rawMessage.toString() });
    // });

 });
}

//shared collection
//Messages = new Meteor.Collection("messages");
//serverside mqtt in-stream
//Messages.mqttConnect("mqtt://localhost:1883", ["topic"], {insert: bool});