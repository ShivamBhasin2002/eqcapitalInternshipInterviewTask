const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: [true, 'Username cannot be blank'],
		unique: [true, 'Username should be unique']
	},
	password: {
		type: String,
		required: [true, 'Password cannot be blank']
	},
	courses: {
		type: String
	}
});

module.exports = mongoose.model('User', userSchema);
