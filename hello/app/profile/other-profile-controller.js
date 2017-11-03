(function(){
  angular.module('Hello')
  .controller('OtherProfileController', ['$scope', '$state', '$stateParams', '$http', function($scope, $state, $stateParams, $http){

    $http.post('api/users/getFriendInfo', {friend_id: $stateParams.id}).success(function(response) {
      $scope.friend = response;
      getNews();
    });

    if (localStorage['User-Data'] !== undefined) {
      $scope.user = JSON.parse(localStorage['User-Data']);
      console.log($scope.user);
    }

    function getNews(){
      var data = {};
      data.friends = [{userId: $stateParams.id}];
      $http.post('api/news/get', data).success(function(response){
        $scope.news = response;
        $scope.friend.posts_nb = Object.keys($scope.news).length;
        angular.forEach($scope.news, function(post) {
          $scope.getSharedPost(post);
        });
      });
    }

    $scope.getSharedPost = function(post) {
      if (post.contentShared !== undefined) {
        var data = {post_id: post.contentShared};
        $http.post('api/news/getSharedPost', data).success(function(response) {
          return post.sharedPostInfo = response;
        });
      }
    };


    $scope.sendFriendRequest = function(userId, personId) {
      request = {userId: userId,
              personId: personId};
      $http.post('api/users/sendFriendRequest', request).then(function(response) {
        $scope.user.sentFriendRequests = response.data;
        localStorage.setItem('User-Data', JSON.stringify($scope.user));
        console.log("sending friend request ", personId);
        $state.reload();
      })
    }

    $scope.cancelSentFriendRequest = function(userId, personId) {
      request = {userId: userId,
              personId: personId};
      $http.post('api/users/cancelSentFriendRequest', request).then(function(response) {
        $scope.user.sentFriendRequests = response.data;
        localStorage.setItem('User-Data', JSON.stringify($scope.user));
        console.log("cancelling friend request ", personId);
        $state.reload();
      })
    }


    $scope.unfriend = function(userId, personId) {
      request = {userId: userId,
              personId: personId};
      $http.post('api/users/unfriend', request).then(function(response) {
        $scope.user.friends = response.data;
        localStorage.setItem('User-Data', JSON.stringify($scope.user));
        console.log("unfriending ", personId);
        $state.reload();
      })
    }

    $scope.checkIsFriend = function(personId) {
      for (var i=0, len=$scope.user.friends.length; i<len; i++) {
        if ($scope.user.friends[i].userId == personId) {
          return true;
        }
      }
      return false;
    }

    $scope.checkRequestSent = function(personId) {
      for (var i=0, len=$scope.user.sentFriendRequests.length; i<len; i++) {
        if ($scope.user.sentFriendRequests[i].userId == personId) {
          return true;
        }
      }
      return false;
    }


  }]);
}());
