import { Template } from 'meteor/templating';
import { TransportVehicles, Raspberries } from '../../database/collections.js'; //TODO: REMOVE SINCE SECURITY RISK

import "./admin.html";

var raspListView = [];

onStartAdmin = function() {
    console.log("client/admin/admin.js onStartAdmin() called");
}

ReactiveTabs.createInterface({
    template: 'basicTabs',
    onChange: function(slug, template) {
        console.log("createInterface has been called");
        console.log('[tabs] Tab has changed! Current tab:', slug);
        console.log('[tabs] Template instance calling onChange:', template);
    }
});

Template.viewVehicleTemplate.helpers({
    settings: function() {
        return {
            collection: TransportVehicles.find({}),
            rowsPerPage: 10,
            showFilter: true,
            fields: [
                { key: 'vehicleId', label: 'Vehicle ID', sortOrder: 0, sortDirection: 'descending' },
                { key: 'type', label: 'Type' },
                { key: 'raspberryIds', label: 'Raspberry IDs' },
                { key: 'delete', label: '', fn: function() { return new Spacebars.SafeString('<button type="button" class="deletebtn">Delete</button>') } },
                { key: 'edit', label: '', fn: function() { return new Spacebars.SafeString('<button type="button" class="editbtn">Edit</button>') } }
            ],
            showNavigation: 'auto',
            rowsPerPage: 5,
            showRowCount: true,
            showColumnToggles: true
        }
    },
    showEditVehicleDiv: function() {
        console.log("here - helper")
        return Session.get('showEditVehicle')
    }
});

Template.adminTabTemplate.helpers({
    tabs: function() {
        console.log("tabs helper hasb een called");
        return [{
                name: 'View Vehicle',
                slug: 'updatevehicle'
                    // ,onRender: function(slug, template){ alert("[tabs] Things has been rendered!");}
            },
            {
                name: 'Add Vehicle',
                slug: 'addvechicle'
                    // ,onRender: function(slug, template) { alert("[tabs] Things has been rendered!");}
            }
        ];
    },
    activeTab: function() {
        return Session.get('activeTab'); // Returns "people", "places", or "things".
    }
});

Template.addVehicleTemplate.events({
    'submit form': function(event, template) {
        // TODO: add mandatory fields
        event.preventDefault();
        console.log(event);
        const vehicleId = event.target.vehicleId.value;
        const type = event.target.type.value;

        var inputs, raspberryIds = [];
        inputs = $('.raspberryData');

        inputs.each(function(i, obj) {
            var id = $(obj).find('input#id');
            var pwd = $(obj).find('input#pwd');
            raspberryIds.push({ id: id.val(), pwd: pwd.val() });

            if (i == 0) {
                id.val('');
                pwd.val('');
            }
        });
        event.target.vehicleId.value = '';
        event.target.type.value.unchecked;
        while (raspListView.length > 0) {
            Blaze.remove(raspListView.pop());
        }
        Meteor.call('transportVehicles.insert', vehicleId, type, raspberryIds);
    },
    'click #addRaspberryButton': function() {
        var view = Blaze.render(Template.addRaspberryTemplate, $("#addVehicleDiv")[0]);
        raspListView.push(view);
    }
});

Template.updateVehicleTemplate.events({
    'click #updateRaspberryButton': function() {
        var view = Blaze.render(Template.updateRaspberryTemplate, $("#updateVehicleDiv")[0]);
        raspListView.push(view);
    },
    'submit form': function(event, template) {
        // TODO: add mandatory fields
        event.preventDefault();
        console.log("event", event.target.updateRaspberryIds);
        const vehicleId = event.target.updateVehicleId.value;
        const type = event.target.updateType.value;
        const _id = Session.get('getVehicleDetails')._id;

        var inputs, raspberryIds = [];
        inputs = $('.updateRaspberryData');
        console.log("inputs", inputs)

        inputs.each(function(i, obj) {
            var updateId = $(obj).find('input#updateId');
            var updatePwd = $(obj).find('input#updatePwd');
            var update_id = $(obj).find('input#_id');
            console.log("update_id", update_id);
            raspberryIds.push({ id: updateId.val(), pwd: updatePwd.val() });

            if (i == 0) {
                updateId.val('');
                updatePwd.val('');
            }
        });
        console.log("Rasp", raspberryIds);
        event.target.updateVehicleId.value = '';
        event.target.updateType.value.unchecked;
        while (raspListView.length > 0) {
            Blaze.remove(raspListView.pop());
        }
        console.log("works till here");
        Meteor.call('transportVehicles.update', vehicleId, type, raspberryIds, _id, Session.get('getVehicleDetails').vehicleId);
        Session.set('showEditVehicle', false);
    }
});

// Template.addVehicleTypeTemplate.helpers({
//   isChecked: function(type) {
//     console.log("session now",Session.get('getVehicleDetails').type );
//     return ((Session.get('getVehicleDetails').type === type) ? "checked" : "");
//   }
// });

Template.updateVehicleTemplate.helpers({
    vehicleDetails: function() {
        console.log("client/admin/admin.js raspberryDetails() called");
        return Session.get('getVehicleDetails');
    },
    isChecked: function(type) {
        return ((Session.get('getVehicleDetails').type === type) ? "checked" : "");
    },
    ras: function() {
        console.log("respid", Session.get('getVehicleDetails').raspberryIds);
        console.log("resppwd", Session.get('getVehicleDetails').raspberryIds[0]);
        console.log(Session.get('getVehicleDetails').vehicleId);
        raspberries = Raspberries.find({ belongsTo: Session.get('getVehicleDetails').vehicleId }).fetch();
        console.log("rasbs", raspberries)
        return Session.get('getVehicleDetails');
    }
});
//
// Template.updateVehicleTemplate.rendered = function() {
//   console.log("hania this is called")
//     $('input[name="raspberryId"]').val(Session.get('getVehicleDetails').raspberryIds);
//  }

Template.viewVehicleTemplate.events({
    'click .reactive-table tbody tr': function(event) {
        console.log("click - reactive table called")
        event.preventDefault();
        var post = this;
        // checks if the actual clicked element has the class `delete`
        if (event.target.className == "deletebtn") {
            console.log("came inside");
            console.log(post.vehicleId);
            Meteor.call('transportVehicles.remove', post.vehicleId);
        }
        if (event.target.className == "editbtn") {
            console.log("here - event");
            Session.set('showEditVehicle', true);
            Session.set('getVehicleDetails', post);
            console.log("now showing for: ", (Session.get('getVehicleDetails')));
            console.log("_id: ", (Session.get('getVehicleDetails')._id));

            // document.getElementById("addVehicleId").value = post.vehicleId;
            // if(post.type == "bus")
            //   busRadio.checked=true;
            // if (post.type =="tram")
            //   tramRadio.checked=true;
            // if (post.type=="train")
            //   trainRadio.checked=true;
            // console.log(post.raspberryIds)
            //
            // document.getElementById("id").value= post.raspberryIds;
            // document.getElementById("pwd").value= post.raspberryIds;

        }
    }
});

Template.adminTabTemplate.events({
    'click #logout' (event) {
        Meteor.logout();
    }
});

Template.adminTabTemplate.events({
    'click #removeAllVehicles' (event) {
        Meteor.call('transportVehicles.removeAll');
    }
});


// Template.viewVehicleTemplate.onRendered(function(){
//   session.set('showEditVehicle',false);
// });