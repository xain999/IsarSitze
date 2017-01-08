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
        const type = target.type.value;
        const respberryId = target.respberryId.value;
    
        // Insert a transportVehicle into the collection by calling serverSide method
        Meteor.call('transportVehicles.insert', vehicleId, type, respberryId);
    
        // Clear form
        target.vehicleId.value = '';
        target.type.value.unchecked;
        target.respberryId.value = '';
    },
    'click #removeAllVehicles'(event) {
        Meteor.call('transportVehicles.removeAll');
    },
    'click #addRespberryButton'(event){
      console.log("addRespberryButton called");
      Blaze.render(function(){
      return Template.Add;
      }, ".addVechicle"
      );

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