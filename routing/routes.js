
Router.route('/live', function () {
  this.render('live');
  startLive();
});

Router.route('/', function () {
  this.render('live');
  startLive();
});

Router.route('/public', function () {
  this.render('public');
  startPublic();
});

Router.route('/admin', function () {
  this.render('admin');
  startAdmin();
});

Router.plugin('ensureSignedIn', {
    only: ['admin']
});

if (Meteor.isServer) {
  // defined in ../server/rasp/raspServer.js
  Router.route('/rasp/settings/', { where: "server" }).post(getAllSettings);
  Router.route('/rasp/seats/', { where: "server" }).put(updateSeats).post(getSeats);
}