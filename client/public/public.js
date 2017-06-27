import { Template } from 'meteor/templating';
import { SeatsData } from '../../database/collections';

import "./public.html";

onStartPublic = function() {
    console.log("client/public/public.js onStartPublic() called");
}

Template.public.helpers({
    settings: function () {
        return {
            collection: SeatsData.find({}, {sort: {createdAt: -1},limit: 200}).fetch(),
            rowsPerPage: 10,
            showFilter: true,
            fields: [
                { key: 'vehicleId', label: 'Vehicle ID' },
                { key: 'raspId', label: 'Raspberry ID' },
                { key: 'seatId', label: 'Seat ID' },
                { key: 'seatStatus', label: 'Seat Status', tmpl: Template.seatStatus },
                { key: 'createdAt', label: 'Creation Date', sortOrder: 0, sortDirection: 'descending', fn: function(createdAt){return new moment(createdAt).format("DD-MM-YYYY")}},
                { key: 'url', label: 'URL' }
            ],
            showNavigation:'auto',
            showRowCount: true,
            showColumnToggles: true
        }
      }
});

Template.public.events({
  'click .reactive-table tbody tr': function (event) {
    event.preventDefault();
    var element = this;
    if (event.target.className == "delete") {
      Posts.remove(element._id)
    }
  }
});
