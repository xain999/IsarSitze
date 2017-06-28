import { Template } from 'meteor/templating';
import { SeatsInfo, TransportVehicles } from '../../database/collections';

import "./live.html";

var dependency = new Tracker.Dependency;
var searchCriteria = { vehicleId: '-----' };

onStartLive = function() {
    console.log("client/live/live.js onStartLive() called");
}

// settings for seatLayout
var settings = { cols: 4, rowSpace: 2, colSpace: 2 };

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
            c = 0,
            rSpace = 0;
        cSpace = 0;
        seatLayout[0] = []
        seatNumber = 1
        for (i = 0; i < raspInVehicles.length; i++) {
            for (j = 0; j < raspInVehicles[i].seats.length; j++) {
                seatLayout[r].push({
                    seatid: raspInVehicles[i].seats[j].id,
                    status: raspInVehicles[i].seats[j].status,
                    seatNumber: seatNumber,
                    isSeat: true
                });
                seatNumber++;
                if (c < settings.cols - 1) {
                    c++;
                    cSpace++;

                    if (cSpace == settings.colSpace) {
                        cSpace = 0;
                        seatLayout[r].push({ isSeat: false });
                    }
                } else {
                    rSpace++;
                    if (rSpace == settings.rowSpace) {
                        rSpace = 0;
                        seatLayout[r + 1] = [];
                        for (let i of seatLayout[r]) {
                            seatLayout[r + 1].push({ isSeat: false });
                        }
                        r++;
                    }

                    c = 0;
                    cSpace = 0;
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
        if (vehicle.indexOf("Choose") === -1) {
            $('.vehicle').css('display', 'block');
        }
        searchCriteria = { vehicleId: vehicle };
        dependency.changed();
        Session.set('searchCriteriaz', searchCriteria);
    }
});