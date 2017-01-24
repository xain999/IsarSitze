import { TransportVehicles, Respberries, SeatsData } from '../../database/collections.js';

// Require fiber
Fiber = Npm.require('fibers');

// Turn this Flag off in debuggin if needed
const USE_MQTT = true;

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

    // 
    mqttClient.on('connect', function () {
        Fiber(function() {
            result = TransportVehicles.find().forEach(function(element) {
                
                element['respberryIds'].forEach(function(resp) {
                    subscribeToMQTT(resp, element["vehicleId"]);
                }, this);
            });
        }).run();
        
        console.log("Client ist connected.");
    });

    console.log("App Started");

    //Saving the Data on arrival
    mqttClient.on('message', function (subscribedTopic, rawMessage) {

        message = JSON.parse(rawMessage.toString());

        vehicleId = message['vehicleId'];
        respId = message['respId'];
        seatId = message['seatId'];
        seatStatus = message['status'];

        console.log("Subscription: " + subscribedTopic);
        console.log("Seat: " + seatId + '\t' + seatStatus);

        Fiber(function() {
            SeatsData.insert({
                url: subscribedTopic,
                vehicleId: vehicleId,
                respberryId: respId,
                seatId: seatId,
                seatStatus: seatStatus,
                createdAt: new Date()
            });
        }).run();
    });
}
