import { Template } from 'meteor/templating';
import { TransportVehicles, Raspberries } from '../../database/collections.js'; //TODO: REMOVE SINCE SECURITY RISK

import "./admin.html";

var raspListView = [];

document.title = "Travis Mobility";

onStartAdmin = function() {
    console.log("client/admin/admin.js onStartAdmin() called");
}

ReactiveTabs.createInterface({
    template: 'basicTabs',
    onChange: function(slug, template) {
        console.log('[tabs] Tab has changed! Current tab:', slug);
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
                { key: 'raspberryIds', label: 'Raspberry IDs', fn: function(value, object, key) { var res = value[0]; for (var i = 1; i < value.length; i++) { res = res + " || " + value[i]; } return res; } },
                { key: 'delete', label: 'Delete', fn: function() { return new Spacebars.SafeString('<button type="button" class="deletebtn">Delete</button>') } },
                { key: 'edit', label: 'Edit', fn: function() { return new Spacebars.SafeString('<button type="button" class="editbtn">Edit</button>') } }
            ],
            showNavigation: 'auto',
            showRowCount: true,
            showColumnToggles: true
        }
    },
    showEditVehicleDiv: function() {
        return Session.get('showEditVehicle')
    }
});

Template.adminTabTemplate.helpers({
    tabs: function() {
        return [
            { name: 'View Vehicle', slug: 'updatevehicle' },
            { name: 'Add Vehicle', slug: 'addvechicle' }
        ];
    },
    activeTab: function() {
        return Session.get('activeTab');
    }
});

Template.addVehicleTemplate.events({
    'submit form': function(event, template) {
        // TODO: add mandatory fields
        event.preventDefault();
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
        const vehicleId = event.target.updateVehicleId.value;
        const type = event.target.updateType.value;
        const _id = Session.get('getVehicleDetails')._id;

        var inputs, raspberryIds = [];
        inputs = $('.updateRaspberryData');

        inputs.each(function(i, obj) {
            var updateId = $(obj).find('input#updateId');
            var updatePwd = $(obj).find('input#updatePwd');
            var update_id = $(obj).find('input#_id');
            raspberryIds.push({ id: updateId.val(), pwd: updatePwd.val() });

            if (i == 0) {
                updateId.val('');
                updatePwd.val('');
            }
        });
        event.target.updateVehicleId.value = '';
        event.target.updateType.value.unchecked;
        while (raspListView.length > 0) {
            Blaze.remove(raspListView.pop());
        }
        Meteor.call('transportVehicles.update', vehicleId, type, raspberryIds, _id, Session.get('getVehicleDetails').vehicleId);
        Session.set('showEditVehicle', false);
    }
});

Template.updateVehicleTemplate.helpers({
    vehicleDetails: function() {
        console.log("client/admin/admin.js raspberryDetails() called");
        return Session.get('getVehicleDetails');
    },
    isChecked: function(type) {
        return ((Session.get('getVehicleDetails').type === type) ? "checked" : "");
    },
    ras: function() {
        raspberries = Raspberries.find({ belongsTo: Session.get('getVehicleDetails').vehicleId }).fetch();
        return Session.get('getVehicleDetails');
    }
});

Template.viewVehicleTemplate.events({
    'click .reactive-table tbody tr': function(event) {
        event.preventDefault();
        var post = this;
        if (event.target.className == "deletebtn") {
            Meteor.call('transportVehicles.remove', post.vehicleId);
        }
        if (event.target.className == "editbtn") {
            Session.set('showEditVehicle', true);
            Session.set('getVehicleDetails', post);
        }
    }
});

Template.admin.events({
    'click #logout' (event) {
        Meteor.logout();
    }
});

Template.adminTabTemplate.events({
    'click #removeAllVehicles' (event) {
        Meteor.call('transportVehicles.removeAll');
    }
});