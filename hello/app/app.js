//wrap in an anonymous function to prevent ports collision
(function(){
  angular.module('Hello', ['ui.router', 'ngFileUpload', 'ngImgCrop'])
          .config(function($stateProvider, $urlRouterProvider){

          $urlRouterProvider.otherwise('/');

          $stateProvider
              .state('home', {
                url: "/",
                onEnter: function($state) {
                  if (localStorage['User-Data'] !== undefined) {
                    $state.go('main');
                  } else  {
                    $state.go('presentation');
                  }
                }
              })
              .state('main', {
                templateUrl: "app/main/main.html",
                controller: "MainController"
              })
              .state('presentation', {
                templateUrl: "app/main/presentation.html"
              })
              .state('signUp', {
                url: "/signup",
                templateUrl: "app/signup/signup.html",
                controller: "SignupController"
              })
              .state('editProfile', {
                url: "/edit-profile",
                templateUrl: "app/profile/edit-profile-view.html",
                controller: "EditProfileController"
              })
              .state('myProfile', {
                url: "/myProfile",
                templateUrl: "app/profile/my-profile-view.html",
                controller: "MyProfileController"
              })
              .state('profile', {
                url: "/profile/:id",
                templateUrl: "app/profile/other-profile-view.html",
                controller: "OtherProfileController"
              })
              .state('friend', {
                url: "/add-friends",
                templateUrl: "app/friend/friend.html",
                controller: "FriendController"
              })
      })
})();
