var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: String,
  first_name: String,
  last_name: String,
  username: String,
  password: String, //not secured
  image: String, //path to the file
  bio: String,
  city: String,
  country: String,
  friends: [{userId: String}],
  sentFriendRequests: [{userId: String}],
  receivedFriendRequests: [{userId: String}]
});

const User = mongoose.model('User', UserSchema);

module.exports = User;