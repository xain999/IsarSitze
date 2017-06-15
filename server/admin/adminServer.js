import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { TransportVehicles, Raspberries, SeatsInfo } from '../../database/collections.js';

Meteor.methods({
    /////////// TransportVehicles Functions \\\\\\\\\\\\

    'transportVehicles.getAll'() {
        return TransportVehicles.find({});
    },
    'transportVehicles.insert'(vehicleId, type, raspberryIds) {
        check(vehicleId, String);
        check(type, String);
        check(raspberryIds, [ { id: String, pwd: String } ]);

        // TODO: UPDATE AFTER ADDING SECURITY
        // Make sure the user is logged in before inserting a task
        // if (! this.userId) {
        //   throw new Meteor.Error('not-authorized');
        // }

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


  'transportVehicles.update'(vehicleId, type, raspberryIds, _id, originalVec) {
    console.log("comes to transportVehicles.update .. adminserver")
      check(vehicleId, String);
      check(type, String);
      check(raspberryIds, [ { id: String, pwd: String } ]);

      // TODO: UPDATE AFTER ADDING SECURITY
      // Make sure the user is logged in before inserting a task
      // if (! this.userId) {
      //   throw new Meteor.Error('not-authorized');
      // }
      console.log("dfdfg", vehicleId, type, raspberryIds);
      console.log("length",raspberryIds.length);
      console.log("id to fetch", originalVec);
      var raspData = Raspberries.find({belongsTo: originalVec}).fetch();
      console.log("fetch raspData", raspData);

      for (i = 0; i < raspberryIds.length; i++) {
          item = {
              id: raspberryIds[i].id,
              belongsTo: vehicleId,
              pwd: raspberryIds[i].pwd
          };
          console.log("raspdata", raspData[i]);
          if(raspData[i] == undefined){
            var p = Raspberries.insert(item);
            console.log(p);
            raspberryIds[i] = raspberryIds[i].id;

            subscribeToMQTT(raspberryIds[i].id, vehicleId);}
          else
            {Raspberries.update( {_id: raspData[i]._id},
            {$set: item});
            raspberryIds[i] = raspberryIds[i].id;

          }
      }
      TransportVehicles.update(
          {_id: _id},
          { $set: { vehicleId: vehicleId, type: type, raspberryIds: raspberryIds, createdAt: new Date()}
          }
    );
    console.log("completed")
    },


    'transportVehicles.removeAll'() {
        //TODO: UPDATE AFTER ADDING SECURITY
        TransportVehicles.remove({});
        Raspberries.remove({});
        SeatsInfo.remove({});
    },
    'transportVehicles.remove'(vehicleId){

        // unsubscribing
        raspberries =  Raspberries.find({ belongsTo: vehicleId }).fetch();
        for (i = 0; i < raspberries.length; i++) {
            unsubscribeToMQTT(raspberries[i].id, raspberries[i].belongsTo);
        }

        TransportVehicles.remove({ vehicleId: vehicleId });
        Raspberries.remove({ belongsTo: vehicleId });
        SeatsInfo.remove({vehicleId: vehicleId});
    }
});
