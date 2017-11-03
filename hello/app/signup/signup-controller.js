(function(){
  angular.module('Hello')
  .controller('SignupController', ['$scope', '$state', '$http', function($scope, $state, $http){
    $scope.createUser = function(){
      $http.post('api/user/signup', $scope.newUser).success(function(response){
        $scope.emailInvalid = false;
        $scope.result = true;
      }).error(function(error){
        if (error.statusCode === 400) {
          $scope.emailInvalid = true;
        } else {
          $scope.error = true;
        }
      });
    }
  }]);
}());
