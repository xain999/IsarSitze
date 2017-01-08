import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { TransportVehicles, Respberries } from '../../database/collections.js';

Meteor.methods({
    /////////// TransportVehicles Functions \\\\\\\\\\\\

    // TODO: DOESN'T WORK
    'transportVehicles.getAll'() {
        return TransportVehicles.find({});
    },
    'transportVehicles.insert'(vehicleId, type, respberryId) {
        check(vehicleId, String);
        check(type, String);
        //check(respberryID, [String]);
        check(respberryId, String);

 
        // TODO: UPDATE AFTER ADDING SECURITY
        // Make sure the user is logged in before inserting a task
        // if (! this.userId) {
        //   throw new Meteor.Error('not-authorized');
        // }
 
        TransportVehicles.insert({
            vehicleId: vehicleId,
            type: type,
            respberryId: respberryId,
            createdAt: new Date(),
        });
    },
    'transportVehicles.removeAll'() {
        //TODO: UPDATE AFTER ADDING SECURITY
        TransportVehicles.remove({});
        Respberries.remove({});
    },

    /////////// Respberry Functions \\\\\\\\\\\\\\

    'respberries.insert'(respberryId, belongsTo) {
        Respberries.insert({
            respberryId: respberryId,
            belongsTo: belongsTo
        });
        subscribeToMQTT(respberryId, belongsTo);
    }
});