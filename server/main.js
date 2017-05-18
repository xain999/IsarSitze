import { Meteor } from 'meteor/meteor';
import { TransportVehicles, SeatsData, SeatsInfo } from '../database/collections.js';

import './admin/adminServer.js';
import './mqtt/subscription.js';


Meteor.startup(() => {
    // code to run on server at startup
    console.log("Meteor Server Started!!");

    startMQTT();
});

if (Meteor.isServer) {
    Meteor.publish(null, function() {
        return TransportVehicles.find();
    });

    Meteor.publish(null, function() {
        return SeatsInfo.find();
    });

    Meteor.publish(null, function() {
        return SeatsData.find();
    });
}
