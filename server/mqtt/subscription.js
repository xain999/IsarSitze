import { TransportVehicles, Raspberries, SeatsData, SeatsInfo } from '../../database/collections.js';

// Require fiber
Fiber = Npm.require('fibers');

// Turn this Flag off in debuggin if needed
const USE_MQTT = true;

// Can be moved to a universal place if multiple accesses required
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
                
                element['raspberryIds'].forEach(function(rasp) {
                    subscribeToMQTT(rasp, element["vehicleId"]);
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
        raspId = message['raspId'];
        seatId = message['seatId'];
        pwd = message['pwd'];
        seatStatus = message['status'];

        console.log("Subscription: " + subscribedTopic);
        console.log("Seat: " + seatId + '\t' + seatStatus);
        console.log ('RaspId: ' + raspId);

        Fiber(function() {
            query = { id: raspId, belongsTo: vehicleId, pwd: pwd };
            if (Raspberries.findOne(query) == null) {
                console.warn("Invalid Username or pwd: Discarding the data...");
                return;
            }

            SeatsData.insert({
                url: subscribedTopic,
                vehicleId: vehicleId,
                raspId: raspId,
                seatId: seatId,
                seatStatus: seatStatus,
                createdAt: new Date()
            });

            item = SeatsInfo.findOne({
                vehicleId: vehicleId,
                raspId: raspId
            });

            seats = item['seats'];

            for (i = 0; i < seats.length; i++) {
                if (seats[i]['id'] == seatId) {
                    seats[i]['status'] = seatStatus;
                    break;
                }
            }
            SeatsInfo.update(item._id, item);
        }).run();
    });
}
