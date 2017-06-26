import { Template } from 'meteor/templating';
import { SeatsInfo, TransportVehicles } from '../../database/collections';

import "./live.html";

var dependency = new Tracker.Dependency;
var searchCriteria = {vehicleId: '-----'};

onStartLive = function() {
    console.log("client/live/live.js onStartLive() called");
}

Template.live.helpers({
    getVehicles: function() {
        return TransportVehicles.find({});
    },
    seatDetails: function(){
      // return Session.get('seatLayout');
      var vehiclesRasp= SeatsInfo.find(Session.get('searchCriteriaz')).fetch();

      var totalSeats=0;
      for (i=0; i<vehiclesRasp.length; i++){
           totalSeats=totalSeats+vehiclesRasp[i].seats.length;
      }

      seatLayout=[]
      var r=0,c=0;
      seatLayout[0]=[]
      for (i=0; i<vehiclesRasp.length; i++){
        for (j = 0; j < vehiclesRasp[i].seats.length; j++){
          // if(c < settings.cols)}{}
          seatLayout[r].push({
              id: vehiclesRasp[i].raspId,
              seatid:vehiclesRasp[i].seats[j].id,
              status:vehiclesRasp[i].seats[j].status,
              column:c
          });
          if(c < settings.cols-1)
            c++;
          else if(r < (totalSeats/settings.cols)-1){
            c=0;
            r++;
            seatLayout[r]=[]
          }
        }
      }
      console.log("returning", seatLayout);
      if(seatLayout === undefined || seatLayout == null || seatLayout.length <= 0)
        return {};
      return seatLayout;

    }, check: function(column){
      console.log("came to check..");
      console.log("culmn", column);
      if(column>settings.cols)
        return "<ol>";
      else {
        return ;
      }
    }, isChecked: function(status){
      if (status === true)
        return true
      else {
        return false;
      }
    }
});

Template.seatColumn.helpers({
  isChecked: function(status){
    if (status === true)
      return true
    else {
      return false;
    }
  }
//   seatDetails: function(){
//     // return Session.get('seatLayout');
//     var vehiclesRasp= SeatsInfo.find(Session.get('searchCriteriaz')).fetch();
//
//     var totalSeats=0;
//     for (i=0; i<vehiclesRasp.length; i++){
//          totalSeats=totalSeats+vehiclesRasp[i].seats.length;
//     }
//
//     seatLayout=[]
//     var r=1,c=1;
//     for (i=0; i<vehiclesRasp.length; i++){
//       for (j = 0; j < vehiclesRasp[i].seats.length; j++){
//         seatLayout.push({
//             id: vehiclesRasp[i].raspId,
//             seatid:vehiclesRasp[i].seats[j].id,
//             status:vehiclesRasp[i].seats[j].status,
//             row:r,
//             column:c
//             });
//         if(c < settings.cols)
//           c++;
//         else if(r < (totalSeats/settings.cols)){
//           c=1;
//           r++;
//         }
//       }
//     }
//     return seatLayout;
//   }
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
        var vehiclesRasp= SeatsInfo.find(searchCriteria).fetch();
        Session.set('searchCriteriaz', searchCriteria);

        // var totalSeats=0;
        // for (i=0; i<vehiclesRasp.length; i++){
        //      totalSeats=totalSeats+vehiclesRasp[i].seats.length;
        // }
        //
        // seatLayout=[]
        // var r=0,c=0;
        // seatLayout[0]=[]
        // for (i=0; i<vehiclesRasp.length; i++){
        //   for (j = 0; j < vehiclesRasp[i].seats.length; j++){
        //     // if(c < settings.cols)}{}
        //     seatLayout[r].push({
        //         id: vehiclesRasp[i].raspId,
        //         seatid:vehiclesRasp[i].seats[j].id,
        //         status:vehiclesRasp[i].seats[j].status,
        //         column:c
        //     });
        //     if(c < settings.cols-1)
        //       c++;
        //     else if(r < (totalSeats/settings.cols)-1){
        //       c=0;
        //       r++;
        //       seatLayout[r]=[]
        //     }
        //   }
        // }
        // Session.set("seatLayout", seatLayout);
        // console.log("seatLayout",seatLayout);
      }
});
