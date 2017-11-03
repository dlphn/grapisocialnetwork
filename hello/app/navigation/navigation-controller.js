(function(){
  angular.module('Hello')
  .controller('NavigationController', ['$scope', '$http', '$state', '$location', '$window', function($scope, $http, $state, $location,$window){
    if (localStorage['User-Data']) {
      $scope.loggedIn = true;
    } else {
      $scope.loggedIn = false;
    }

    $scope.logUserIn = function(){
      $http.post('api/user/login', $scope.login).success(function(response){
        localStorage.setItem('User-Data', JSON.stringify(response));
        $scope.login = angular.copy({});
        $scope.loggedIn = true;
        $state.go('home');
        $location.path('/')
      }).error(function(error){
        $scope.invalid = true;
      });
    }

    $scope.logOut = function() {
      localStorage.clear();
      $scope.loggedIn = false;
      $location.path('/');
      $window.location.reload();
    }
  }]);
}());
