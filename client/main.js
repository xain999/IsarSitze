import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './public/public.js';

import './main.html';

console.log("client/main.js called");

startPublic = function() {
    console.log("client/main.js startPublic() called");
    onStartPublic();
}

startAdmin = function() {
    console.log("client/main.js startAdmin() called");
    onStartAdmin();
}