var User = require('../datasets/users');
var bcrypt = require('bcrypt');

module.exports.signup = function(req, res) {
    User.find({email: req.body.email}, function(err, results) {
        if (err) {
          res.writeHead(500, {
            'Content-Type': 'application/json; charset=utf-8'
          });
          res.end(JSON.stringify({
            error: "Problem with the find() function"
          }));
        }
        if (results.length !== 0) {
          res.writeHead(400, {
            'Content-Type': 'application/json; charset=utf-8'
          });
          res.end(JSON.stringify({
            statusCode: 400,
            error: "A user with this email already exists"
          }));
        } else {
          bcrypt.hash(req.body.password, 10, function(err, hash) {
            req.body.password = hash;
            req.body.username = req.body.first_name.replace(/\s+/g, '').toLowerCase() + req.body.last_name.replace(/\s+/g, '').toLowerCase();
            req.body.image = '/uploads/profile-pictures/no_profile.jpg';
            var user = new User(req.body);
            user.save();
            res.json(user);
            });
        }
      });
};
    
module.exports.login = function(req, res) {
    var entered_password = req.body.password;
    User.find({email: req.body.email}, function(err, results){
        if (err) {
          res.writeHead(500, {
            'Content-Type': 'application/json; charset=utf-8'
          });
          res.end(JSON.stringify({
            error: "Problem with the find() function"
          }));
        }
        if (results.length !== 0) {
          bcrypt.compare(entered_password, results[0].password, function(error, response) {
            if (error) {
              console.log(error);
            } else {
              if (response === true) {
                var userData = results[0];
                res.json({email: req.body.email,
                          _id: userData._id,
                          userName: userData.username,
                          firstName: userData.first_name,
                          lastName: userData.last_name,
                          image: userData.image,
                          bio: userData.bio,
                          city: userData.city,
                          country: userData.country,
                          friends: userData.friends,
                          sentFriendRequests: userData.sentFriendRequests,
                          receivedFriendRequests: userData.receivedFriendRequests
                        });
              } else {
                res.writeHead(403, {
                  'Content-Type': 'application/json; charset=utf-8'
                });
                res.end(JSON.stringify({
                  error: "Invalid User"
                }));
              }
            }
          });
        } else {
            res.writeHead(403, {
                'Content-Type': 'application/json; charset=utf-8'
            });
            res.end(JSON.stringify({
                error: "Invalid User"
            }));
        }
    });    
};