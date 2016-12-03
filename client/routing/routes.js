import "../main.js";

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