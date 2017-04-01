import { Meteor } from 'meteor/meteor';

import './admin/adminServer.js';
import './mqtt/subscription.js';


Meteor.startup(() => {
    // code to run on server at startup
    console.log("Meteor Server Started!!");
    
    startMQTT();
});
