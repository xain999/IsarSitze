import { Mongo } from 'meteor/mongo';
 
export const TransportVehicles = new Mongo.Collection('transportVehicles');
export const Respberries = new Mongo.Collection('respberries');


// stores respberry settings that will be pulled on startup
// 'settingsUpdateInterval: ---'    Time after which settings should be updated (in ms)
// 'maxIdleInterval: ---'           Time after which location data will be pushed to the server.
//                                  This will also be considered keeplive signal (in ms)
export const Settings = new Mongo.Collection('settings');

// stores seat information
// 'transportId: ---'               Which Transport the Seats Belongs to
// 'respId: ---'                    Which Respberry the seats Belongs to
// 'seats: [---]'                   Array of Seats
export const SeatsInfo = new Mongo.Collection('seatsInfo');

// stores information for each seat
// 'transportId: ---'
// 'respId: ---'
// 'seatId: ---'
// 'time: ---'
export const SeatsData = new Mongo.Collection('seatsData'); 

//TODO: Add structure of collections
// TransportVehicles structure
// {
//    "vehicleId": "",
    
// }
