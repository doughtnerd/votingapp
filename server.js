'user strict';

var express = require('express'),
		routes = require('./app/routes/index.js'),
		mongoose = require('mongoose'),
		passport = require('passport'),
		session = require('express-session'),
		bodyParser = require('body-parser'),
		sass = require('node-sass-middleware'),
		app = express();

require('dotenv').load();
require('./app/config/passport')(passport);

mongoose.connect(process.env.MONGOLAB_URI);

app.use(sass({
    src: __dirname + '/sass', 
    dest: __dirname + '/public/css',
    debug: true,
    prefix:  '/public/css',        
  })
);

app.use('/controllers', express.static(process.cwd() + '/app/controllers'));
app.use('/public', express.static(process.cwd() + '/public'));
app.use('/sass', express.static(process.cwd() + '/sass'));
app.use('/common', express.static(process.cwd() + '/app/common'));

app.use(session({
    secret: 'secretClementine',
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json());       
app.use(bodyParser.urlencoded({ extended: true })); 
app.set('views', process.cwd() + '/public');
app.set('view engine', 'jade');

routes(app, passport);

var port = process.env.PORT || 8080;
app.listen(port, function(){
	console.log('Node.js listening on port ' + port + '...');
});