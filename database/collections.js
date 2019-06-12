import { Mongo } from 'meteor/mongo';

// stores the TransportVehicles Data
// 'vehicleId: ---'                        Id of the vehicle
// 'type: ---'                             Type of the Vehicle
// 'raspberryIds: [---]'                   List of resberries without passwords
// 'createdAt': Date()                     Time of Creating
export const TransportVehicles = new Mongo.Collection('transportVehicles');

// stores Id and passwords for the raspberries
// 'id: ---'                                Id of the raspberry
// 'belongsTo: ---'                         The current vehicle it is in at
// 'pwd: ---'                               Password of the raspberry
export const Raspberries = new Mongo.Collection('raspberries');

// NOT WORKING AT THE MOMENT
// stores raspberry settings that will be pulled on startup
// 'settingsUpdateInterval: ---'            Time after which settings should be updated (in ms)
// 'maxIdleInterval: ---'                   Time after which location data will be pushed to the server.
//                                          This will also be considered keeplive signal (in ms)
export const Settings = new Mongo.Collection('settings');

// stores seat information
// 'vehicleId: ---'                         Which Transport the Seats Belongs to
// 'raspId: ---'                            Which Raspberry the seats Belongs to
// 'seats: [ { id: ---, status: --- } ]'    Array of Seats
export const SeatsInfo = new Mongo.Collection('seatsInfo');

// stores information for each seat
// 'vehicleId: ---'
// 'raspId: ---'
// 'seatId: ---'
// 'seatStatus: ---'
// 'time: ---'
// NOTE: This table entries won't be deleted and can be used for Machine learning
export const SeatsData = new Mongo.Collection('seatsData');