var Users = require('../datasets/users');

module.exports.getUsers = function(req, res) {
  Users.find({}, function(err, usersData) {
    if (err) {
      res.error(err);
    } else {
      usersData.password = "";
      res.json(usersData);
    }
  });
}

module.exports.getFriendRequests = function(req, res) {
  var userId = req.body.userId;
  Users.findById(userId, function(err, user) {
    if (err) {
        res.error(err);
    } else {
        res.json(user.receivedFriendRequests);
    }
  });
}

module.exports.getFriendInfo = function(req, res) {
  var friend_id = req.body.friend_id;
  Users.findById(friend_id, function(err, user) {
    if (err) {
        res.json(err);
    } else {
        user.password="";
        res.json(user);
    }

  });
}

module.exports.sendFriendRequestToUser = function(req, res) {
  var userId = req.body.userId;
  var personId = req.body.personId;

  Users.findById(personId, function(err, person) {
    if (err) {
      res.error(err);
    } else {
      person.receivedFriendRequests.push({userId: userId});
      person.save();
    }
  });

  Users.findById(userId, function(err, follower) {
    if (err) {
      res.error(err);
    } else {
      follower.sentFriendRequests.push({userId: personId});
      follower.save();

      res.json(follower.sentFriendRequests);
    }
  });
}

module.exports.cancelSentFriendRequestToUser = function(req, res) {
  var userId = req.body.userId;
  var personId = req.body.personId;

  Users.findById(personId, function(err, person) {
    if (err) {
      res.error(err);
    } else {
      for(var i = person.receivedFriendRequests.length - 1; i >= 0; i--) {
        if(person.receivedFriendRequests[i].userId === userId) {
           person.receivedFriendRequests.splice(i, 1);
        }
      }
      person.save();
    }
  });

  Users.findById(userId, function(err, follower) {
    if (err) {
      res.error(err);
    } else {
      for(var i = follower.sentFriendRequests.length - 1; i >= 0; i--) {
        if(follower.sentFriendRequests[i].userId === personId) {
           follower.sentFriendRequests.splice(i, 1);
        }
      }
      follower.save();
      res.json(follower.sentFriendRequests);
    }
  });
}


module.exports.cancelReceivedFriendRequestToUser = function(req, res) {
  var userId = req.body.userId;
  var personId = req.body.personId;

  Users.findById(personId, function(err, person) {
    if (err) {
      res.error(err);
    } else {
      for(var i = person.sentFriendRequests.length - 1; i >= 0; i--) {
        if(person.sentFriendRequests[i].userId === userId) {
           person.sentFriendRequests.splice(i, 1);
        }
      }
      person.save();
    }
  });

  Users.findById(userId, function(err, follower) {
    if (err) {
      res.error(err);
    } else {
      for(var i = follower.receivedFriendRequests.length - 1; i >= 0; i--) {
        if(follower.receivedFriendRequests[i].userId === personId) {
          follower.receivedFriendRequests.splice(i, 1);
        }
      }
      follower.save();
      res.json(follower.receivedFriendRequests);
    }
  });
}

module.exports.acceptFriendRequest = function(req, res) {
  var userId = req.body.userId;
  var personId = req.body.personId;

  Users.findById(personId, function(err, person) {
    if (err) {
      res.error(err);
    } else {
      for(var i = person.sentFriendRequests.length - 1; i >= 0; i--) {
        if(person.sentFriendRequests[i].userId === userId) {
           person.sentFriendRequests.splice(i, 1);
        }
      }
      person.friends.push({userId: userId});
      person.save();
    }
  });

  Users.findById(userId, function(err, follower) {
    if (err) {
      res.error(err);
    } else {
      for(var i = follower.receivedFriendRequests.length - 1; i >= 0; i--) {
        if(follower.receivedFriendRequests[i].userId === personId) {
           follower.receivedFriendRequests.splice(i, 1);
        }
      }
      follower.friends.push({userId: personId});
      follower.save();
      res.json(follower.friends);
    }
  });
}

module.exports.unfriendUser = function(req, res) {
  var userId = req.body.userId;
  var personId = req.body.personId;

  Users.findById(personId, function(err, person) {
    if (err) {
      res.error(err);
    } else {
      for(var i = person.friends.length - 1; i >= 0; i--) {
        if(person.friends[i].userId === userId) {
           person.friends.splice(i, 1);
        }
      }
      person.save();
    }
  });

  Users.findById(userId, function(err, follower) {
    if (err) {
      res.error(err);
    } else {
      for(var i = follower.friends.length - 1; i >= 0; i--) {
        if(follower.friends[i].userId === personId) {
           follower.friends.splice(i, 1);
        }
      }
      follower.save();
      res.json(follower.friends);
    }
  });
}
