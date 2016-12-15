var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var user = require('./controllers/userController');
var message = require('./controllers/messageController');
var checkAuthenticated = require('./services/checkAuthenticated');
var cors = require('./services/cors');

var app = express();

//Middleware
app.use(bodyParser.json());
app.use(cors);

//Routes
app.get('/api/message', message.get);
app.post('/api/message', message.post);
app.post('/auth/register', user.register);
app.post('/auth/login', user.login);
app.get('/api/user', checkAuthenticated, user.getUser);
app.patch('/api/user', checkAuthenticated, user.updateUser);
app.post('/auth/facebook', user.loginWithFacebook);

//Connection
mongoose.connect("mongodb://localhost:27017/mydb", function(err, db) {
	if(!err) {
		console.log("Connected to mongoDB!");	
	}
})

var server = app.listen(5000, function() {
	console.log('listening on port ', server.address().port);
})