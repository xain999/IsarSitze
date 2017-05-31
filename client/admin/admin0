import { Template } from 'meteor/templating';
import { TransportVehicles } from '../../database/collections.js'; //TODO: REMOVE SINCE SECURITY RISK

import "./admin.html";

var raspListView = [];

onStartAdmin = function() {
    console.log("client/admin/admin.js onStartAdmin() called");
}

Template.admin.helpers({
    vehicles: function() {
        console.log("client/admin/admin.js vehicles() called");
        // find doesn't need server call
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
                //if (raspberryId == '' || belongsTo == null) {
                //    alert('Wrong Input');
                //    return;
                //}

                // Get list of raspberryIds
                var inputs, raspberryIds=[];
                inputs = $('.raspberryData');

                inputs.each(function(i, obj) {
                    var id = $(obj).find('input#id');
                    var pwd = $(obj).find('input#pwd');
                    raspberryIds.push({ id: id.val(), pwd:  pwd.val() });

                    if (i == 0) {
                        id.val('');
                        pwd.val('');
                    }
                });

                // Clear form
                target.vehicleId.value = '';
                target.type.value.unchecked;
                
                while (raspListView.length > 0) {
                    Blaze.remove(raspListView.pop());
                }

                // Insert a transportVehicle into the collection by calling serverSide method
                Meteor.call('transportVehicles.insert', vehicleId, type, raspberryIds);
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
    'click #addRaspberryButton':function(){
        var view = Blaze.render(Template.addRaspberryTemplate, $("#addVehicleDiv")[0]);
        raspListView.push(view);
    },
    'click #logout'(event) {
        Meteor.logout();
    }
});