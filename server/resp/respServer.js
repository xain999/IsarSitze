import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { TransportVehicles, Respberries, Settings } from '../../database/collections.js';

/////////// Respberry Settings Server Functions \\\\\\\\\\\\

getAllSettings = function() {
    console.log('username: ' + this.request.body['username']);
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
    console.log('username: ' + this.request.body['username']);
    console.log('password: ' + this.request.body['password']);

    this.response.statusCode = 200;
    this.response.setHeader("Content-Type", "application/json");

    this.response.end('{"msg": "Seats updated"}');
}

