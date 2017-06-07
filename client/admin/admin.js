import { Template } from 'meteor/templating';
import { TransportVehicles } from '../../database/collections.js'; //TODO: REMOVE SINCE SECURITY RISK

import "./admin.html";

var raspListView = [];

onStartAdmin = function() {
    console.log("client/admin/admin.js onStartAdmin() called");
}

ReactiveTabs.createInterface({
  template: 'basicTabs',
  onChange: function (slug, template) {
    console.log("createInterface has been called");
    console.log('[tabs] Tab has changed! Current tab:', slug);
    console.log('[tabs] Template instance calling onChange:', template);
  }
});

Template.viewVehicleTemplate.helpers({
    settings: function () {
        return {
            collection: TransportVehicles.find({}),
            rowsPerPage: 10,
            showFilter: true,
            fields: [
               {key: 'vehicleId', label: 'Vehicle ID', sortOrder: 0, sortDirection: 'descending' },
               {key: 'type', label: 'Type'},
               {key: 'raspberryIds', label: 'Raspberry IDs'},
               {key: 'delete', label: '', fn: function () { return new Spacebars.SafeString('<button type="button" class="deletebtn">Delete</button>') }},
               {key: 'edit', label: '', fn: function() {return new Spacebars.SafeString('<button type="button" class="editbtn">Edit</button>')}}
            ],
            showNavigation:'auto',
            rowsPerPage: 5,
            showRowCount: true,
            showColumnToggles: true
        }
      },
      showEditVehicleDiv:function(){
        console.log("here - helper")
        return Session.get('showEditVehicle')
      }
    });

Template.adminTabTemplate.helpers({
  tabs: function () {
    console.log("tabs helper hasb een called");
    return [
      { name: 'View Vehicle', slug: 'updatevehicle'
      // ,onRender: function(slug, template){ alert("[tabs] Things has been rendered!");}
      },
      { name: 'Add Vehicle', slug: 'addvechicle'
      // ,onRender: function(slug, template) { alert("[tabs] Things has been rendered!");}
      }];
  },
  activeTab: function () {
    return Session.get('activeTab'); // Returns "people", "places", or "things".
  }
});

Template.addVehicleTemplate.events({
  'submit .addVehicle'(event) {
      event.preventDefault();
      console.log(event);
      var btn = $(event.target).find("button[type=submit]:focus");
      if (btn) {
          if (btn[0].id === 'addVehicle') {
              const target = event.target;
              const vehicleId = target.vehicleId.value;
              const type = target.type.value;

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
              target.vehicleId.value = '';
              target.type.value.unchecked;

              while (raspListView.length > 0) {
                  Blaze.remove(raspListView.pop());
              }
              Meteor.call('transportVehicles.insert', vehicleId, type, raspberryIds);
          }
      }
  },
  'click #addRaspberryButton':function(){
      var view = Blaze.render(Template.addRaspberryTemplate, $("#addVehicleDiv")[0]);
      raspListView.push(view);
  }
});

Template.updateVehicleTemplate.events({
  'click #addRaspberryButton':function(){
      var view = Blaze.render(Template.addRaspberryTemplate, $("#addVehicleDiv")[0]);
      raspListView.push(view);
  }
});

Template.updateVehicleTemplate.helpers({
  
});

Template.viewVehicleTemplate.events({
  'click .reactive-table tbody tr': function (event) {
    console.log("click - reactive table called")
    event.preventDefault();
    var post = this;
    // checks if the actual clicked element has the class `delete`
    if (event.target.className == "deletebtn") {
      console.log("came inside");
      console.log(post.vehicleId);
      Meteor.call('transportVehicles.remove', post.vehicleId);
    }
    if (event.target.className == "editbtn"){
        console.log("here event");
        Session.set('showEditVehicle',true);
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
  'click #logout'(event) {
      Meteor.logout();
  }
});

Template.adminTabTemplate.events({
    'click #removeAllVehicles'(event) {
        Meteor.call('transportVehicles.removeAll');
    }
});

// Template.viewVehicleTemplate.onRendered(function(){
//   session.set('showEditVehicle',false);
// });
