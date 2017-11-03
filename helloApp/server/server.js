var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var path = require('path');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

var app = express();
var authentificationController = require('./auth/authentification-controller');
var profileController = require('./edit/profile-controller');
var newsController = require('./news/news-controller');
var usersController = require('./users/users-controller');

mongoose.connect('mongodb://localhost:27017/hello');

app.use(bodyParser.json());
app.use(multipartMiddleware);
app.use('/node_modules', express.static(__dirname + "/node_modules"));
app.use('/uploads', express.static(path.join(__dirname, "/../../shared/uploads")));

//CORS (Cross Origin Request Sharing)
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//Authentification
app.post('/api/user/signup', authentificationController.signup);
app.post('/api/user/login', authentificationController.login);

//Profile
app.post('/api/profile/editPhoto', multipartMiddleware, profileController.updatePhoto);
app.post('/api/profile/updateProfile', profileController.updateProfile);

//News
app.post('/api/news/postPic', multipartMiddleware, newsController.uploadPicAndPost);
app.post('/api/news/postStatus', newsController.postStatus);
app.post('/api/news/get', newsController.getNews);
app.post('/api/news/getSharedPost', newsController.getSharedPostData);

//Users
app.get('/api/users/get', usersController.getUsers);
app.post('/api/users/getFriendRequests', usersController.getFriendRequests);
app.post('/api/users/getFriendInfo', usersController.getFriendInfo);
app.post('/api/users/sendFriendRequest', usersController.sendFriendRequestToUser);
app.post('/api/users/cancelSentFriendRequest', usersController.cancelSentFriendRequestToUser);
app.post('/api/users/cancelReceivedFriendRequest', usersController.cancelReceivedFriendRequestToUser);
app.post('/api/users/acceptFriendRequest', usersController.acceptFriendRequest);
app.post('/api/users/unfriend', usersController.unfriendUser);

app.listen(process.env.PORT || 9804, function(){
  console.log("Listening at localhost", process.env.PORT || 9804);
})