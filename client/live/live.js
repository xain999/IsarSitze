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
        console.log(SeatsInfo.find(searchCriteria));
        return SeatsInfo.find(searchCriteria);
    },
    getVehicles: function() {
        return TransportVehicles.find({});
    }
});

var settings = {
               rows: 9,
               cols: 4,
               rowCssPrefix: 'row--',
             };

Template.live.events({
    'change select': function(event){
        event.preventDefault();
        vehicle = event.target.value;
        console.log(vehicle);
        searchCriteria = {vehicleId: vehicle};
        dependency.changed();
        dependency.depend();
        var vehiclesRaspberrys= SeatsInfo.find(searchCriteria).fetch();
        console.log(vehiclesRaspberrys[0]);
        var totalSeats=0;
        for (i=0; i<vehiclesRaspberrys.length; i++){
          totalSeats = totalSeats + vehiclesRaspberrys[i].seats.length;
        }
        // console.log("allseats",allSeats);
         var str = [], seatNo, className, k=0, l=0;
         str.push('<ol class="cabin fuselage">');
         for (i = 0; i < (totalSeats/settings.cols); i++) {
           str.push('<li class= "row ' + settings.rowCssPrefix + i.toString() + '">' +
                    '<ol class="seats" type="A"' + '>'
                   );
             for (j = 0; j < settings.cols; j++) {
               flag=false;
               if(vehiclesRaspberrys[k].seats[l] !== undefined){
                  seatNo=vehiclesRaspberrys[k].raspId + "-" + vehiclesRaspberrys[k].seats[l].id;
                  seatstatus= vehiclesRaspberrys[k].seats[l].status;
                  l++;
                  flag=true;
                }else if(vehiclesRaspberrys[k+1] !== undefined) {
                  k++;
                  l=0;
                  seatNo=vehiclesRaspberrys[k].raspId + "-" + vehiclesRaspberrys[k].seats[l].id ;
                  seatstatus= vehiclesRaspberrys[k].seats[l].status;
                  l++;
                  flag=true;
                }
                 if (flag) {
                   if(seatstatus){
                     str.push('<li class="seat">'+
                   '<input type="checkbox"  id="' + seatNo + '" checked />' +
                   '<label for="' + seatNo+ '">' + seatNo + '</label>'+
                   '</li>');
                 } else {str.push('<li class="seat">'+
               '<input type="checkbox"  id="' + seatNo + '" />' +
               '<label for="' + seatNo+ '">' + seatNo + '</label>'+
               '</li>');}
               }
             }
             str.push('</ol>');
           }
           str.push('</ol>');
          //  console.log("string",str);
         $('#place').html(str.join(''));
      }
});
