import { Template } from 'meteor/templating';
import { SeatsInfo, TransportVehicles } from '../../database/collections';

import "./live.html";

var dependency = new Tracker.Dependency;
var searchCriteria = { vehicleId: '-----' };

onStartLive = function() {
    console.log("client/live/live.js onStartLive() called");
}

// settings for seatLayout
var settings = { cols: 4 };

Template.live.helpers({
    getVehicles: function() {
        console.log("client/live/live.js getVehicles() called");
        return TransportVehicles.find({});
    },
    seatDetails: function() {
        console.log("client/live/live.js seatDetails() called");
        var raspInVehicles = SeatsInfo.find(Session.get('searchCriteriaz')).fetch();

        var totalSeats = 0;
        for (i = 0; i < raspInVehicles.length; i++) {
            totalSeats = totalSeats + raspInVehicles[i].seats.length;
        }

        seatLayout = []
        var r = 0,
            c = 0;
        seatLayout[0] = []
        seatNumber = 1
        for (i = 0; i < raspInVehicles.length; i++) {
            for (j = 0; j < raspInVehicles[i].seats.length; j++) {
                seatLayout[r].push({
                    seatid: raspInVehicles[i].seats[j].id,
                    status: raspInVehicles[i].seats[j].status,
                    seatNumber: seatNumber
                });
                seatNumber++;
                if (c < settings.cols - 1)
                    c++;
                else if (r < (totalSeats / settings.cols) - 1) {
                    c = 0;
                    r++;
                    seatLayout[r] = []
                }
            }
        }
        return seatLayout;
    }
});

Template.seatColumn.helpers({
    isChecked: function(status) {
        if (status === true)
            return true
        return false;
    }
});

Template.live.events({
    'click #vehicleSelectID': function(event) {
        event.preventDefault();
        vehicle = event.target.innerText;
        $('#vehicleSelectID').text(vehicle);
        $('#vehicleSelectID').append('<span class = "caret custom-caret"/>');
        searchCriteria = { vehicleId: vehicle };
        dependency.changed();
        Session.set('searchCriteriaz', searchCriteria);
    }
});