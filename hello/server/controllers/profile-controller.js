var User = require('../datasets/users');
var fs = require('fs-extra');
var path = require('path');

module.exports.updatePhoto = function(req, res){
  var file = req.files.file;
  var userId = req.body.userId;

  console.log(file.path + ' uploaded by ' + userId);

  var uploadDate = new Date().toISOString();
  uploadDate = uploadDate.replace(/\./g, "");
  uploadDate = uploadDate.replace(/\-/g, "");
  uploadDate = uploadDate.replace(/\:/g, "");

  var tempPath = file.path;
  // var targetPath = path.join(__dirname, '../../uploads/profile-pictures/' + userId + '_' + uploadDate + '_' + file.name.toLowerCase());
  var targetPath = path.join(__dirname, '/../../../helloApp/client/hello-app/www/uploads/profile-pictures/' + userId + '_' + uploadDate + '_' + file.name.toLowerCase());
  var savePath = '/uploads/profile-pictures/' + userId + '_' + uploadDate + '_' + file.name.toLowerCase();


  fs.rename(tempPath, targetPath, function(err) {
    if (err) {
      console.log(err);
    } else {
      User.findById(userId, function(err, userData) {
        userData.image = savePath;
        userData.save(function(err) {
          if (err) {
            console.log("failed save");
            res.json({status: 500});
          } else {
            console.log("save successful");
            res.json({data: userData.image});
          }
        });
      });
    }
  });
};

module.exports.updateBio = function(req, res) {
  var bio = req.body.bio;
  var userId = req.body.userId;

  User.findById(userId, function(err, userData) {
    var user = userData;
    user.bio = bio;

    user.save(function(err) {
      if (err) {
        console.log("fail");
        res.json({status: 500});
      } else {
        console.log("success");
        res.json({status: 200});
      }
    })
  });
};

module.exports.updateCity = function(req, res) {
  var city = req.body.city;
  var userId = req.body.userId;

  User.findById(userId, function(err, userData) {
    var user = userData;
    user.city = city;

    user.save(function(err) {
      if (err) {
        console.log("fail");
        res.json({status: 500});
      } else {
        console.log("success");
        res.json({status: 200});
      }
    })
  });
};

module.exports.updateCountry = function(req, res) {
  var country = req.body.country;
  var userId = req.body.userId;

  User.findById(userId, function(err, userData) {
    var user = userData;
    user.country = country;

    user.save(function(err) {
      if (err) {
        console.log("fail");
        res.json({status: 500});
      } else {
        console.log("success");
        res.json({status: 200});
      }
    })
  });
};
