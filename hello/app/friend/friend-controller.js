(function(){
  angular.module('Hello')
  .controller('FriendController', ['$scope', '$http', '$state', '$location', function($scope, $http, $state, $location) {

    if (localStorage['User-Data'] !== undefined) {
      $scope.user = JSON.parse(localStorage['User-Data']);
      console.log($scope.user);
    }

    $http.get('api/users/get').then(function(response) {
      $scope.users = response.data;
    })

    $http.post('api/users/getFriendRequests', {userId: $scope.user._id}).then(function(response) {
      $scope.user.receivedFriendRequests = response.data;
      localStorage.setItem('User-Data', JSON.stringify($scope.user));
      $scope.friendRequests = response.data;
      angular.forEach($scope.friendRequests, function(friend) {
        $scope.getFriendInfo(friend);
      });
    })

    $scope.getFriendInfo = function(friend) {
      var data = {friend_id: friend.userId};
      $http.post('api/users/getFriendInfo', data).success(function(response) {
        return friend.info = response;
      });
    };

    $scope.toProfile = function(id) {
      $location.path('/profile/' + id);
      // $state.go('profile', {friend_id: id});
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

    $scope.cancelReceivedFriendRequest = function(userId, personId) {
      request = {userId: userId,
              personId: personId};
      $http.post('api/users/cancelReceivedFriendRequest', request).then(function(response) {
        $scope.user.receivedFriendRequests = response.data;
        localStorage.setItem('User-Data', JSON.stringify($scope.user));
        console.log("cancelling friend request ", personId);
        $state.reload();
      })
    }

    $scope.acceptFriendRequest = function(userId, personId) {
      request = {userId: userId,
              personId: personId};
      $http.post('api/users/acceptFriendRequest', request).then(function(response) {
        $scope.user.friends = response.data;
        localStorage.setItem('User-Data', JSON.stringify($scope.user));
        console.log("accepting friend request from ", personId);
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
