import { Template } from 'meteor/templating';
import { SeatsData } from '../../database/collections';

import "./public.html";

onStartPublic = function() {
    console.log("client/public/public.js onStartPublic() called");
}

Template.public.helpers({
    displaySeats: function() {
        console.log("client/public/public.js displaySeats() called");
        return SeatsData.find({}, {sort: {createdAt: -1}});
    }
});