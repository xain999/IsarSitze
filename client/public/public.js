import { Template } from 'meteor/templating';
import { SeatsData } from '../../database/collections';

import "./public.html";

onStartPublic = function() {
    console.log("client/public/public.js onStartPublic() called");
}

Template.public.helpers({
    // Find doesn't need server call
    // displaySeats: function() {
    //     console.log("client/public/public.js displaySeats() called");
    //     return SeatsData.find({}, {sort: {createdAt: -1}});
    // },
    settings: function () {
        return {
            collection: SeatsData.find({}, {sort: {createdAt: -1}}),
            rowsPerPage: 10,
            showFilter: true,
            fields: [
                { key: 'vehicleId', label: 'Vehicle ID' },
                { key: 'raspId', label: 'Raspberry ID' },
                { key: 'seatId', label: 'Seat ID' },
                { key: 'seatStatus', label: 'Seat Status' },
                { key: 'createdAt', label: 'Creation Date', sortOrder: 0, sortDirection: 'descending'  },
                { key: 'url', label: 'URL' }
            ],
            showNavigation:'auto',
            rowsPerPage: 5,
            showRowCount: true,
            showColumnToggles: true
        }
      }
});

Template.public.events({
  'click .reactive-table tbody tr': function (event) {
    event.preventDefault();
    var post = this;
    // checks if the actual clicked element has the class `delete`
    if (event.target.className == "delete") {
      Posts.remove(post._id)
    }
  }
});
