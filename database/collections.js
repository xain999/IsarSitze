import { Mongo } from 'meteor/mongo';
 
export const TransportVehicles = new Mongo.Collection('transportVehicles');
export const Respberries = new Mongo.Collection('respberries');


// stores respberry settings that will be pulled on startup
// 'settingsUpdateInterval: ---'    Time after which settings should be updated (in ms)
// 'maxIdleInterval: ---'           Time after which location data will be pushed to the server.
//                                  This will also be considered keeplive signal (in ms)
export const Settings = new Mongo.Collection('settings');
export const Seats = new Mongo.Collection('seats'); 

//TODO: Add structure of collections
// TransportVehicles structure
// {
//    "vehicleId": "",
    
// }
