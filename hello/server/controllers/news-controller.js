var News = require('../datasets/news');
var fs = require('fs-extra');
var path = require('path');

module.exports.uploadPicAndPost = function(req, res) {
  var userId = req.body.userId;
  var file = req.files.contentImage;
  var uploadDate = new Date().toISOString();
  uploadDate = uploadDate.replace(/\./g, "");
  uploadDate = uploadDate.replace(/\-/g, "");
  uploadDate = uploadDate.replace(/\:/g, "");

  var tempPath = file.path;
  // var targetPath = path.join(__dirname, '../../uploads/posted-images/' + userId + '_' + uploadDate + '_' + file.name.toLowerCase());
  var targetPath = path.join(__dirname, '/../../../helloApp/client/hello-app/www/uploads/posted-images/' + userId + '_' + uploadDate + '_' + file.name.toLowerCase());
  var savePath = '/uploads/posted-images/' + userId + '_' + uploadDate + '_' + file.name.toLowerCase();

  fs.rename(tempPath, targetPath, function(err) {
    if (err) {
      console.log(err);
    } else {
        req.body.contentImage = savePath;
        var news = new News(req.body);
        news.save(function(err) {
          if (err) {
            console.log("failed save");
            res.json({status: 500});
          } else {
            console.log("save successful");
            res.json({status: 200});
          }
        });
    }
  });
}

module.exports.postStatus = function(req, res) {
  var news = new News(req.body);
  news.save(function(err) {
    if (err) {
      console.log("failed save");
      res.json({status: 500});
    } else {
      console.log("save successful");
      res.json({status: 200});
    }
  });
}

module.exports.getNews = function(req, res) {
  if (!req.body.friends) {
    res.error('no friend yet');
  } else {
    var requestedNews = [];
    for (var i=0, len=req.body.friends.length; i<len; i++) {
      requestedNews.push({userId: req.body.friends[i].userId});
    }
    News.find({$or: requestedNews})
        .sort({date: -1})
        .exec(function(err, allNews) {
          if (err) {
            res.json(err);
          } else {
            res.json(allNews);
          }
        })
  };
}

module.exports.getSharedPostData = function(req, res) {
    var post_id = req.body.post_id;
    News.findById(post_id, function(err, post) {
      if (err) {
        res.json(err);
      } else {
        res.json(post);
      }
    });
}
