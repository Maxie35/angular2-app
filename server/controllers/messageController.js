var Message = require('../models/message');

module.exports = {
	get: function(req, res) {
		Message.find({}).populate('user', '-pwd').exec(function(err, result) {
			if(err) {
				return res.status(500).send(err);
			}
			return res.status(200).json(result);
		});
	},
	post: function(req, res) {
		req.body.user = req.user;

		var message = new Message(req.body);
		
		message.save(function(err) {
			if(err) {
				console.log(err);
			} else {
				Message.find({}).populate('user', '-pwd').exec(function(err, result) {
					if(err) {
						return res.status(500).send(err);
					}
					return res.status(200).json(result);
				});
			}
		});	
	}
}