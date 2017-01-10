import { Mongo } from 'meteor/mongo';
 
export const TransportVehicles = new Mongo.Collection('transportVehicles');
export const Respberries = new Mongo.Collection('respberries');
export const Seats = new Mongo.Collection('seats'); 

//TODO: Add structure of collections
// TransportVehicles structure
// {
//    "vehicleId": "",
    
// }