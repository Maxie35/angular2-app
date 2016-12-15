var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var messageSchema = new Schema({
	email: String,
	pwd: String,
	firstName: String,
	lastName: String,
	birthDate: Date,
	facebook: String,
	picture: String,
	displayName: String
}, {
	timestamps: {
		createdAt: 'created_at'
	}
});

module.exports = mongoose.model('User', messageSchema);