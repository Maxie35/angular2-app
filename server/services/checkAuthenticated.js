var jwt = require('jwt-simple');
var moment = require('moment');
var config = require('../config');

module.exports = function checkAuthenticated(req, res, next) {
	if(!req.header('Authorization')) {
		return res.status(401).send({message: 'No auth header'});
	}

	var token = req.header('Authorization').split(' ')[1];

	var payload = jwt.decode(token, config.TOKEN_SECRET);

	if(payload.exp <= moment().unix()) {
		return res.status(401).send({message: 'Token has expired'});
	}

	req.user = payload.sub;

	next();
}