var User = require('../models/user');
var jwt = require('jwt-simple');
var moment = require('moment');
var config = require('../config');
var request = require('request');

module.exports = {
	register: function(req, res) {
		User.findOne({email: req.body.email}, function(err, existingUser) {

			if(existingUser)  {
				return res.status(409).send({message: 'Email is already registered!'});
			}
			
			var user = new User(req.body);

			user.save(function(err, result){
				if(err) {
					res.status(500).send({
						message: err.message
					});
				} 
				res.status(200).send({token: createToken(result)});
			});
		});	
	},
	login: function(req, res) {
		User.findOne({email: req.body.email}, function(err, user) {

			if(!user) {
				return res.status(401).send({message: 'Email or Password invalid'});
			}

			if(req.body.pwd == user.pwd) {
				res.send({token: createToken(user)});
			} else {
				return res.status(401).send({message: 'Invalid email or password'});
			}

		});
	},
	getUser: function(req, res) {

		User.findOne({'_id': req.user}).exec(function(err, result) {
			if(err) {
				return res.status(500).send(err);
			}
			return res.status(200).json(result);
		});
	},
	updateUser: function(req, res) {
		User.findOneAndUpdate({'_id': req.user}, req.body.updateData, {new: true}).exec(function(err, result) {
			if(err) {
				return res.status(500).send(err);
			} else {
				return res.status(200).json(result);
			}
		});	
	},
	loginWithFacebook: function(req, res) {
		var fields = ['id', 'email', 'first_name', 'last_name', 'link', 'name', 'birthday'];
		var accessTokenUrl = 'https://graph.facebook.com/v2.5/oauth/access_token';
		var graphApiUrl = 'https://graph.facebook.com/v2.5/me?fields=' + fields.join(',');
		var params = {
			code: req.body.code,
			client_id: req.body.clientId,
			client_secret: config.FACEBOOK_SECRET,
			redirect_uri: req.body.redirectUri
		};

		// Step 1. Exchange authorization code for access token.
		request.get({ url: accessTokenUrl, qs: params, json: true }, function(err, response, accessToken) {
			if (response.statusCode !== 200) {
				return res.status(500).send({ message: accessToken.error.message });
			}

		// Step 2. Retrieve profile information about the current user.
		request.get({ url: graphApiUrl, qs: accessToken, json: true }, function(err, response, profile) {
				if (response.statusCode !== 200) {
					return res.status(500).send({ message: profile.error.message });
				}
				if (req.header('Authorization')) {
					User.findOne({ facebook: profile.id }, function(err, existingUser) {
						if (existingUser) {
							return res.status(409).send({ message: 'There is already a Facebook account that belongs to you' });
						}
						var token = req.header('Authorization').split(' ')[1];
						var payload = jwt.decode(token, config.TOKEN_SECRET);
						User.findById(payload.sub, function(err, user) {
							if (!user) {
								return res.status(400).send({ message: 'User not found' });
							}
							user.facebook = profile.id;
							user.picture = user.picture || 'https://graph.facebook.com/v2.3/' + profile.id + '/picture?type=large';
							user.displayName = user.displayName || profile.name;
							user.save(function() {
								var token = createToken(user);
								res.send({ token: token });
							});
						});
					});
				} else {
			    // Step 3. Create a new user account or return an existing one.
			    console.log('Trying to find:', profile.id);
			    User.findOne({ facebook: profile.id }, function(err, existingUser) {
			    	if (existingUser) {
			    		console.log('this already exists!');
			    		var token = createToken(existingUser);
			    		return res.send({ token: token });
			    	}
			    	var user = new User();
			    	console.log('created the new user');
			    	user.facebook = profile.id;
			    	user.firstName = profile.first_name;
			    	user.lastName = profile.last_name;
			    	user.email = profile.email;
			    	user.picture = 'https://graph.facebook.com/' + profile.id + '/picture?type=large';
			    	user.displayName = profile.name;
			    	user.save(function() {
			    		var token = createToken(user);
			    		console.log('saved the user!');
			    		res.send({ token: token });
			    	});
			    });
			}
		});
		});
	}
}

function createToken(user) {
	var payload = {
		sub: user._id,
		iat: moment().unix(),
		exp: moment().add(14, 'days').unix()
	};
	return jwt.encode(payload, 'secret');
}
/*
  var fields = ['id', 'email', 'first_name', 'last_name', 'link', 'name'];
  var accessTokenUrl = 'https://graph.facebook.com/v2.5/oauth/access_token';
  var graphApiUrl = 'https://graph.facebook.com/v2.5/me?fields=' + fields.join(',');
  var params = {
    code: req.body.code,
    client_id: req.body.clientId,
    client_secret: config.FACEBOOK_SECRET,
    redirect_uri: req.body.redirectUri
  };

  // Step 1. Exchange authorization code for access token.
  request.get({ url: accessTokenUrl, qs: params, json: true }, function(err, response, accessToken) {
    if (response.statusCode !== 200) {
      return res.status(500).send({ message: accessToken.error.message });
    }

    // Step 2. Retrieve profile information about the current user.
    request.get({ url: graphApiUrl, qs: accessToken, json: true }, function(err, response, profile) {
      if (response.statusCode !== 200) {
        return res.status(500).send({ message: profile.error.message });
      }
      if (req.header('Authorization')) {
        User.findOne({ facebook: profile.id }, function(err, existingUser) {
          if (existingUser) {
            return res.status(409).send({ message: 'There is already a Facebook account that belongs to you' });
          }
          var token = req.header('Authorization').split(' ')[1];
          var payload = jwt.decode(token, config.TOKEN_SECRET);
          User.findById(payload.sub, function(err, user) {
            if (!user) {
              return res.status(400).send({ message: 'User not found' });
            }
            user.facebook = profile.id;
            user.picture = user.picture || 'https://graph.facebook.com/v2.3/' + profile.id + '/picture?type=large';
            user.displayName = user.displayName || profile.name;
            user.save(function() {
              var token = createToken(user);
              res.send({ token: token });
            });
          });
        });
      } else {
        // Step 3. Create a new user account or return an existing one.
        User.findOne({ facebook: profile.id }, function(err, existingUser) {
          if (existingUser) {
            var token = createJWT(existingUser);
            return res.send({ token: token });
          }
          var user = new User();
          user.facebook = profile.id;
          user.picture = 'https://graph.facebook.com/' + profile.id + '/picture?type=large';
          user.displayName = profile.name;
          user.save(function() {
            var token = createJWT(user);
            res.send({ token: token });
          });
        });
      }
    });
  });
  */
