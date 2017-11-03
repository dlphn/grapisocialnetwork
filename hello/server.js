var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var favicon = require('serve-favicon');

var app = express();
var authentificationController = require('./server/controllers/authentification-controller');
var profileController = require('./server/controllers/profile-controller');
var newsController = require('./server/controllers/news-controller');
var usersController = require('./server/controllers/users-controller');

mongoose.connect('mongodb://localhost:27017/hello');

app.use(bodyParser.json());
app.use(multipartMiddleware);
app.use('/app', express.static(__dirname + "/app"));
app.use(favicon(__dirname + '/app/images/favicon.ico'));
app.use('/node_modules', express.static(__dirname + "/node_modules"));
app.use('/uploads', express.static(__dirname + "/../helloApp/client/hello-app/www/uploads"));

app.get('/', function(req, res){
  res.sendfile('index.html');
});

//Authentification
app.post('/api/user/signup', authentificationController.signup);
app.post('/api/user/login', authentificationController.login);

//Profile
app.post('/api/profile/editPhoto', multipartMiddleware, profileController.updatePhoto);
app.post('/api/profile/updateBio', profileController.updateBio);
app.post('/api/profile/updateCity', profileController.updateCity);
app.post('/api/profile/updateCountry', profileController.updateCountry);

//News
app.post('/api/news/postPic', multipartMiddleware, newsController.uploadPicAndPost);
app.post('/api/news/postStatus', newsController.postStatus);
app.post('/api/news/get', newsController.getNews);
app.post('/api/news/getSharedPost', newsController.getSharedPostData);

//User
app.get('/api/users/get', usersController.getUsers);
app.post('/api/users/getFriendRequests', usersController.getFriendRequests);
app.post('/api/users/getFriendInfo', usersController.getFriendInfo);
app.post('/api/users/sendFriendRequest', usersController.sendFriendRequestToUser);
app.post('/api/users/cancelSentFriendRequest', usersController.cancelSentFriendRequestToUser);
app.post('/api/users/cancelReceivedFriendRequest', usersController.cancelReceivedFriendRequestToUser);
app.post('/api/users/acceptFriendRequest', usersController.acceptFriendRequest);
app.post('/api/users/unfriend', usersController.unfriendUser);

app.listen('3000', function(){
  console.log("Listening at localhost 3000");
})
