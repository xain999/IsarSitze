import { Template } from 'meteor/templating';
import { TransportVehicles, Respberries } from '../../database/collections.js'; //TODO: REMOVE SINCE SECURITY RISK

import "./admin.html";

onStartAdmin = function() {
    console.log("client/admin/admin.js onStartAdmin() called");
}

Template.admin.helpers({
    vehicles: function() {
        console.log("client/admin/admin.js vehicles() called");
        return TransportVehicles.find({});
    },
    respberries: function() {
        console.log("client/admin/admin.js respberries() called");
        return Respberries.find({});
    },
});

Template.admin.events({
    'submit .addVehicle'(event) {
        // Prevent default browser form submit
        event.preventDefault();
    
        // Get value from form element
        const target = event.target;
        const vehicleId = target.vehicleId.value;
    
        // Insert a transportVehicle into the collection by calling serverSide method
        Meteor.call('transportVehicles.insert', vehicleId);
    
        // Clear form
        target.vehicleId.value = '';
    },
    'click #removeAllVehicles'(event) {
        Meteor.call('transportVehicles.removeAll');
    },
    'submit .addRaspberry'(event) {
        // Prevent default browser form submit
        event.preventDefault();
    
        // Get value from form element
        const target = event.target;
        const respberryId = target.respberryId.value;
        const belongsTo = $('input[name="raspberryBelongsTo"]:checked', target).data('answer');
    
        console.log('respberryId: ' + respberryId);
        console.log('belongsTo: ' + belongsTo);

        if (respberryId == '' || belongsTo == null) {
            alert('Wrong Input');
            return;
        }

        // Insert a new Respberry into the collection by calling serverSide method
        Meteor.call('respberries.insert', respberryId, belongsTo);
    
        // Clear form
        target.respberryId.value = '';
    }
});