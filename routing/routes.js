
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

// defined in ../server/resp/respServer.js
Router.route('/resp/settings/', { where: "server" }).post(getAllSettings);
Router.route('/resp/seats/', { where: "server" }).put(updateSeats).post(getSeats);
