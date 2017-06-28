import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

// import './public/public.js';
// import './admin/admin.js';
// import './live/live.js';

import './main.html';
import './main.css';

console.log("client/main.js called");

startPublic = function() {
    console.log("client/main.js startPublic() called");
    onStartPublic();
}

startLive = function() {
    console.log("client/main.js startLive() called");
    onStartLive();
}

startAdmin = function() {
    console.log("client/main.js startAdmin() called");
    onStartAdmin();
}

Accounts.config({
    forbidClientAccountCreation: true
});
