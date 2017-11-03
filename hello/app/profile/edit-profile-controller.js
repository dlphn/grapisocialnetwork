(function(){
  angular.module('Hello')
  .controller('EditProfileController', ['Upload', '$scope', '$timeout', '$state', '$http', function(Upload, $scope, $timeout, $state, $http){

    if (localStorage['User-Data'] !== undefined) {
      $scope.user = JSON.parse(localStorage['User-Data']);
      console.log($scope.user);
    }

    $scope.upload = function (dataUrl, name) {
        Upload.upload({
            url: 'api/profile/editPhoto',
            method: 'POST',
            data: {
              userId: $scope.user._id,
              file: Upload.dataUrltoBlob(dataUrl, name)},
        }).then(function (response) {
            $scope.user.image = response.data.data;
            localStorage.setItem('User-Data', JSON.stringify($scope.user));
            // $timeout(function () {
                $scope.result = true;
            // });
        }, function (response) {
            if (response.status > 0) $scope.errorMsg = response.status
                + ': ' + response.data;
        });
    }

    $scope.updateBio = function() {
      var request = {
        userId: $scope.user._id,
        bio: $scope.user.bio
      }

      $http.post('api/profile/updateBio', request).success(function() {
        console.log("success");
        localStorage.setItem('User-Data', JSON.stringify($scope.user));
      }).error(function(error) {
        console.log("error");
      })
    };

    $scope.updateCity = function() {
      var request = {
        userId: $scope.user._id,
        city: $scope.user.city
      }

      $http.post('api/profile/updateCity', request).success(function() {
        console.log("success");
        localStorage.setItem('User-Data', JSON.stringify($scope.user));
      }).error(function(error) {
        console.log("error");
      })
    };

    $scope.updateCountry = function() {
      var request = {
        userId: $scope.user._id,
        country: $scope.user.country
      }

      $http.post('api/profile/updateCountry', request).success(function() {
        console.log("success");
        localStorage.setItem('User-Data', JSON.stringify($scope.user));
      }).error(function(error) {
        console.log("error");
      })
    };

  }]);
}());
