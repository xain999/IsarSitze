import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { TransportVehicles, Respberries, Settings, SeatsInfo } from '../../database/collections.js';

/////////// Respberry Settings Server Functions \\\\\\\\\\\\

getAllSettings = function() {
    console.log('username: ' + this.request.body['respId']);
    console.log('password: ' + this.request.body['password']);

    // TODO: ADD PWD CHECK HERE
    // if (username or pwd wrong) {
    //      THROW();
    // }

    this.response.statusCode = 200;
    this.response.setHeader("Content-Type", "application/json");

    this.response.end(JSON.stringify(Settings.find().fetch()));
}

updateSeats = function() {
    vehicleId = this.request.body['vehicleId'];
    respId = this.request.body['respId'];
    pwd = this.request.body['password'];
    seats = this.request.body['seats'];

    console.log('vehicleId: ' + vehicleId);
    console.log('respId: ' + respId);
    console.log('password: ' + pwd);
    console.log('seats: ' + seats);

    // TODO: ADD PWD CHECK HERE
    // if (username or pwd wrong) {
    //      THROW();
    // }

    resp = {
        'vehicleId': vehicleId,
        'respberryId': respId
    }

    SeatsInfo.remove(resp);

    SeatsInfo.insert({
            vehicleId: vehicleId,
            respberryId: respId,
            seats: seats,
            createdAt: new Date(),
        });

    this.response.statusCode = 200;
    this.response.setHeader("Content-Type", "application/json");

    this.response.end('{"msg": "Seats updated"}');
}

getSeats = function() {
    console.log('vehicleId: ' + this.request.body['vehicleId']);
    console.log('respId: ' + this.request.body['respId']);
    console.log('password: ' + this.request.body['password']);

    // TODO: ADD PWD CHECK HERE
    // if (username or pwd wrong) {
    //      THROW();
    // }

    this.response.statusCode = 200;
    this.response.setHeader("Content-Type", "application/json");

    resp = {
        'vehicleId': this.request.body['vehicleId'],
        'respberryId': this.request.body['respId']
    }

    result = JSON.stringify(SeatsInfo.findOne(resp));
    console.log (result);
    if (result == null)
        result = '{}'
    this.response.end(result);
}
