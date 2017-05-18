
Router.route('/live', function () {
  this.render('live');
  startCurrent();
});

Router.route('/', function () {
  this.render('public');
  startPublic();
});

Router.route('/public', function () {
  this.render('public');
  startPublic();
});

Router.route('/admin', function () {
  this.render('admin');
  startAdmin();
});

if (Meteor.isServer) {
  // defined in ../server/rasp/raspServer.js
  Router.route('/rasp/settings/', { where: "server" }).post(getAllSettings);
  Router.route('/rasp/seats/', { where: "server" }).put(updateSeats).post(getSeats);
}