(function(){
  angular.module('Hello')
  .controller('MyProfileController', ['$scope', '$http', '$state', function($scope, $http, $state) {

    if (localStorage['User-Data'] !== undefined) {
      $scope.user = JSON.parse(localStorage['User-Data']);
      console.log($scope.user);
    }

    $scope.goToFriends = function() {
      $state.go('friend');
    }

    function getNews(){
      var data = {};
      data.friends = [{userId: $scope.user._id}];
      $http.post('api/news/get', data).success(function(response){
        $scope.news = response;
        $scope.user.posts_nb = Object.keys($scope.news).length;
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

    getNews();

  }]);
}());
