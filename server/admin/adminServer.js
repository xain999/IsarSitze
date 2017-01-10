import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { TransportVehicles, Respberries } from '../../database/collections.js';

Meteor.methods({
    /////////// TransportVehicles Functions \\\\\\\\\\\\

    'transportVehicles.getAll'() {
        return TransportVehicles.find({});
    },
    'transportVehicles.insert'(vehicleId, type, respberryIds) {
        check(vehicleId, String);
        check(type, String);
        check(respberryIds, [String]);
 
        // TODO: UPDATE AFTER ADDING SECURITY
        // Make sure the user is logged in before inserting a task
        // if (! this.userId) {
        //   throw new Meteor.Error('not-authorized');
        // }
 
        TransportVehicles.insert({
            vehicleId: vehicleId,
            type: type,
            respberryIds: respberryIds,
            createdAt: new Date(),
        });
    },
    'transportVehicles.removeAll'() {
        //TODO: UPDATE AFTER ADDING SECURITY
        TransportVehicles.remove({});
        //Respberries.remove({});
    }
});