(function(){
  angular.module('Hello')
  .controller('MainController', ['Upload', '$scope', '$http', '$interval', '$timeout', '$state', '$location', function(Upload, $scope, $http, $interval, $timeout, $state, $location) {

    if (localStorage['User-Data'] !== undefined) {
      $scope.user = JSON.parse(localStorage['User-Data']);
      console.log($scope.user);
      $scope.loggedIn = true;
    } else {
      $scope.loggedIn = false;
    }

    $scope.sendNews = function(file) {
      if (file) {
        var request = {
          user: $scope.user.firstName + " " + $scope.user.lastName,
          userId: $scope.user._id,
          userImage: $scope.user.image,
          contentText: $scope.newNews,
          contentImage: file
        }
        file.upload = Upload.upload({
          url: 'api/news/postPic',
          method: 'POST',
          data: request,
        }).then(function (response) {
          $timeout(function () {
            $state.reload();
          });
        }, function (response) {
          if (response.status > 0)
            console.error(error);
        });
      } else {
        var request = {
          user: $scope.user.firstName + " " + $scope.user.lastName,
          userId: $scope.user._id,
          userImage: $scope.user.image,
          contentText: $scope.newNews
        }
        $http.post('api/news/postStatus', request).success(function(response) {
          $state.reload();
        }).error(function(error) {
          console.error(error);
        });
      }
    };

    $scope.model = {};

    $scope.shareThis = function(id, index) {
      var request = {
        user: $scope.user.firstName + " " + $scope.user.lastName,
        userId: $scope.user._id,
        userImage: $scope.user.image,
        contentText: $scope.model.caption[index],
        contentShared: id
      }
      $http.post('api/news/postStatus', request).success(function(response) {
        $state.reload();
      }).error(function(err) {
        console.log(err);
      });
    };

    function getNews(initial) {
      var data = {};
      data.friends = angular.copy($scope.user.friends);
      data.friends.push({userId: $scope.user._id});
      $http.post('api/news/get', data).success(function(response){
        if (initial) {
          $scope.news = response;
          angular.forEach($scope.news, function(post) {
            $scope.getSharedPost(post);
            $scope.getFriendPic(post);
          })
        } else {
          if (response.length > $scope.news.length) {
            $scope.incomingNews = response;
          }
        }
      })
    };

    $scope.getFriendPic = function(post) {
      var data = {friend_id: post.userId};
      $http.post('api/users/getFriendInfo', data).success(function(response) {
        return post.userInfo = response;
      });
    };

    $scope.getSharedPost = function(post) {
      if (post.contentShared !== undefined) {
        var data = {post_id: post.contentShared};
        $http.post('api/news/getSharedPost', data).success(function(response) {
          return post.sharedPostInfo = response;
        });
      }
    };

    $scope.toProfile = function(id) {
      $location.path('/profile/' + id);
      // $state.go('profile', {friend_id: id});
    };

    $interval(function(){
      getNews(false);
      if ($scope.incomingNews) {
        $scope.difference = $scope.incomingNews.length - $scope.news.length;
      }
      console.log("this is working");
    }, 5000); //refreshes every 5 seconds

    $scope.setNewNews = function() {
      $scope.news = angular.copy($scope.incomingNews);
      $scope.incomingNews = undefined;
    };

    //Init
    getNews(true);

  }]);

}());
