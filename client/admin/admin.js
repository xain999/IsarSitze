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
    }
});

Template.admin.events({
    'submit .addVehicle'(event) {
        // Prevent default browser form submit
        event.preventDefault();
    
        console.log(event);
        // Get value from form element
        var btn = $(event.target).find("input[type=submit]:focus");
        if (btn) {
            if (btn[0].id === 'addVehicle') {
                const target = event.target;
                const vehicleId = target.vehicleId.value;
                const type = target.type.value;

                // TODO: Check for wrong input
                //if (respberryId == '' || belongsTo == null) {
                //    alert('Wrong Input');
                //    return;
                //}

                // Get list of respberryIds
                var inputs, index, respberryIds=[];
                inputs = document.getElementsByName('respberryId');
                for (index = 0; index < inputs.length; ++index) {
                    respberryIds.push(inputs[index].value); 
                }

                // Insert a transportVehicle into the collection by calling serverSide method
                Meteor.call('transportVehicles.insert', vehicleId, type, respberryIds);

                // Clear form
                target.vehicleId.value = '';
                target.type.value.unchecked;
                for (index = 0; index < inputs.length; ++index) {
                    inputs[index].value = ''; 
                }
            } else {
                const vehicleId = event.target.vehicleId.value;
                // Insert a transportVehicle into the collection by calling serverSide method
                var retrievedData = TransportVehicles.findOne({vehicleId:vehicleId});
                //Meteor.call('transportVehicles.fetch', vehicleId);
                console.log(retrievedData.respberryIds);
                event.target.vehicleId.value = retrievedData.vehicleId;
                event.target.type.value = retrievedData.type;
                event.target.respberryId.value = retrievedData.respberryIds;
                
            }
        } 
    },
    'click #removeAllVehicles'(event) {
        Meteor.call('transportVehicles.removeAll');
    },    
    'submit .deleteSpecificVehicleForm'(event){
        event.preventDefault();
        const vehicleId = event.target.vehicleId.value;
        Meteor.call('transportVehicles.remove', vehicleId);
        event.target.vehicleId.value='';
    },
    'click #addRespberryButton':function(){
        Blaze.render(Template.addRespberryTemplate, $("#addVehicleDiv")[0]);
    }
});