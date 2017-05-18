import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { TransportVehicles, Raspberries, Settings, SeatsInfo } from '../../database/collections.js';

/////////// Raspberry Settings Server Functions \\\\\\\\\\\\

// Not Developed
getAllSettings = function() {
    console.log('username: ' + this.request.body['raspId']);
    console.log('pwd: ' + this.request.body['pwd']);

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
    raspId = this.request.body['raspId'];
    pwd = this.request.body['pwd'];
    seats = this.request.body['seats'];

    console.log('vehicleId: ' + vehicleId);
    console.log('raspId: ' + raspId);
    console.log('pwd: ' + pwd);
    console.log('seats: ' + seats);

    query = { id: raspId, belongsTo: vehicleId, pwd: pwd };
    if (Raspberries.findOne(query) == null) {
        this.response.statusCode = 401;
        this.response.setHeader("Content-Type", "application/json");
        this.response.end('{"msg": "Unauthorized access: Wrong username or pwd"}');
        return;
    }

    rasp = {
        'vehicleId': vehicleId,
        'raspId': raspId
    }

    SeatsInfo.remove(rasp);

    seats = seats.map (element => { 
        return { id: element, status: false };
    });

    console.log(seats);

    SeatsInfo.insert({
            vehicleId: vehicleId,
            raspId: raspId,
            seats: seats,
            createdAt: new Date(),
        });

    this.response.statusCode = 200;
    this.response.setHeader("Content-Type", "application/json");

    this.response.end('{"msg": "Seats updated"}');
}

getSeats = function() {
    vehicleId = this.request.body['vehicleId'];
    raspId = this.request.body['raspId'];
    pwd = this.request.body['pwd'];

    console.log('vehicleId: ' + vehicleId);
    console.log('raspId: ' + raspId);
    console.log('pwd: ' + pwd);

    query = { id: raspId, belongsTo: vehicleId, pwd: pwd };
    console.log(Raspberries.findOne(query));
    if (Raspberries.findOne(query) == null) {
        this.response.statusCode = 401;
        this.response.setHeader("Content-Type", "application/json");
        this.response.end('{"msg": "Unauthorized access: Wrong username or pwd"}');
        return;
    }

    this.response.statusCode = 200;
    this.response.setHeader("Content-Type", "application/json");

    resp = {
        'vehicleId': this.request.body['vehicleId'],
        'raspId': this.request.body['raspId']
    }

    result = JSON.stringify(SeatsInfo.findOne(resp));
    
    if (result == null)
        result = '{}'
    this.response.end(result);
}
