import { Meteor } from 'meteor/meteor';

import './admin/adminServer.js';


Meteor.startup(() => {
  // code to run on server at startup
  console.log("Meteor Server Started!!");
});
