import { Template } from 'meteor/templating';
import { SeatsInfo, TransportVehicles } from '../../database/collections';

import "./live.html";

var dependency = new Tracker.Dependency;
var searchCriteria = {vehicleId: '-----'};

onStartLive = function() {
    console.log("client/live/live.js onStartLive() called");
}

Template.live.helpers({
    // Find doesn't need server call
    displaySeatStatus: function() {
        console.log("client/live/live.js displaySeatStatus() called");
        dependency.depend();
        return SeatsInfo.find(searchCriteria);
    },
    getVehicles: function() {
        return TransportVehicles.find({});
    }
    // },
    // getRasps: function() {
    //     vehicle = $('input[name=vehicles]:checked', '#vehicles').val();
    //     console.log(vehicle);
    //     return TransportVehicles.find();
    // }
});

Template.live.events({ 
    'click .vehicles'(event) { 
         console.log("client/live/live.js event radioCheck called");

         vehicle = $('input[name=vehicles]:checked', '#vehicles').val();
         searchCriteria = {vehicleId: vehicle};
         dependency.changed();

        //  vehicle = $('input[name=vehicles]:checked', '#vehicles').val();
        //  SeatsInfo.find({vehicleId: vehicle})

        //  Blaze.render(Template.rasp, $('form#rasp')[0])
        //  //$('form#rasp').template('rasp');
    } 
});
