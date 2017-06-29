import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { TransportVehicles, Raspberries, SeatsInfo } from '../../database/collections.js';

Meteor.methods({
    /////////// TransportVehicles Functions \\\\\\\\\\\\

    'transportVehicles.getAll' () {
        return TransportVehicles.find({});
    },
    'transportVehicles.insert' (vehicleId, type, raspberryIds) {
        check(vehicleId, String);
        check(type, String);
        check(raspberryIds, [{ id: String, pwd: String }]);

        for (i = 0; i < raspberryIds.length; i++) {
            item = {
                id: raspberryIds[i].id,
                belongsTo: vehicleId,
                pwd: raspberryIds[i].pwd
            };
            Raspberries.insert(item);
            raspberryIds[i] = raspberryIds[i].id;

            // subscribing to urls using MQTT
            subscribeToMQTT(raspberryIds[i], vehicleId);
        }

        // adding transport vehicle to Database
        TransportVehicles.insert({
            vehicleId: vehicleId,
            type: type,
            raspberryIds: raspberryIds,
            createdAt: new Date(),
        });
    },


    'transportVehicles.update' (vehicleId, type, raspberryIds, _id, originalVec) {
        console.log("comes to transportVehicles.update .. adminserver")
        check(vehicleId, String);
        check(type, String);
        check(raspberryIds, [{ id: String, pwd: String }]);

        var raspData = Raspberries.find({ belongsTo: originalVec }).fetch();

        var seatsData = SeatsInfo.find({ vehicleId: originalVec }).fetch();

        for (i = 0; i < raspberryIds.length; i++) {
            item = {
                id: raspberryIds[i].id,
                belongsTo: vehicleId,
                pwd: raspberryIds[i].pwd
            };

            if (seatsData[i] != undefined) {
                let newSeatRasp = { vehicleId: vehicleId, raspId: raspberryIds[i].id, seats: seatsData[i].seats };
                SeatsInfo.update({ _id: seatsData[i]._id }, { $set: newSeatRasp });
            }
            if (raspData[i] == undefined) {
                var p = Raspberries.insert(item);
            } else {
                Raspberries.update({ _id: raspData[i]._id }, { $set: item });
            }
            raspberryIds[i] = raspberryIds[i].id;
            subscribeToMQTT(raspberryIds[i], vehicleId);
        }
        TransportVehicles.update({ _id: _id }, {
            $set: { vehicleId: vehicleId, type: type, raspberryIds: raspberryIds, createdAt: new Date() }
        });
        console.log("completed")
    },


    'transportVehicles.removeAll' () {
        //TODO: UPDATE AFTER ADDING SECURITY
        TransportVehicles.remove({});
        Raspberries.remove({});
        SeatsInfo.remove({});
    },
    'transportVehicles.remove' (vehicleId) {

        // unsubscribing
        raspberries = Raspberries.find({ belongsTo: vehicleId }).fetch();
        for (i = 0; i < raspberries.length; i++) {
            unsubscribeToMQTT(raspberries[i].id, raspberries[i].belongsTo);
        }

        TransportVehicles.remove({ vehicleId: vehicleId });
        Raspberries.remove({ belongsTo: vehicleId });
        SeatsInfo.remove({ vehicleId: vehicleId });
    }
});