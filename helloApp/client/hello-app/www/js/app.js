angular.module('hello-app', ['ionic', 'hello-app.controllers', 'hello-app.services', 'ngFileUpload', 'ngImgCrop'])
    .run(function($ionicPlatform) {
        $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
              cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
              cordova.plugins.Keyboard.disableScroll(true);

            }
            if (window.StatusBar) {
              // org.apache.cordova.statusbar required
              StatusBar.styleDefault();
            }
        });
    })
    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('auth', {
                url: '/auth',
                abstract: true,
                templateUrl: 'templates/auth.html'
            })
            .state('auth.login', {
                url: '/login',
                views: {
                    'auth-login': {
                        templateUrl: 'templates/auth-login.html',
                        controller: 'LogInCtrl'
                    }
                }
            })
            .state('auth.signup', {
                url: '/signup',
                views: {
                    'auth-signup': {
                        templateUrl: 'templates/auth-signup.html',
                        controller: 'SignUpCtrl'
                    }
                }
            })
            .state('main', {
                url: "/main",
                abstract: true,
                templateUrl: "templates/main.html"
            })
            .state('main.timeline', {
                cache: false,
                url: '/timeline',
                views: {
                    'main-timeline': {
                        templateUrl: 'templates/timeline.html',
                        controller: 'TimelineCtrl'
                    }
                }
            })
            .state('main.friends', {
                cache: false,
                url: '/friends',
                views: {
                    'main-friends': {
                        templateUrl: 'templates/friends.html',
                        controller: 'FriendsCtrl'
                    }
                }
            })
            .state('main.profile', {
                url: '/profile/:id',
                views: {
                    'main-friends': {
                        templateUrl: 'templates/other-profile-view.html',
                        controller: 'OtherProfileCtrl'
                    }
                }
            })
            .state('main.more', {
                url: '/more',
                views: {
                    'main-more': {
                        templateUrl: 'templates/more.html',
                        controller: 'MoreCtrl'
                    }
                }
            })
            .state('main.myProfile', {
                url: '/myProfile',
                views: {
                    'main-more': {
                        templateUrl: 'templates/my-profile-view.html',
                        controller: 'MyProfileCtrl'
                    }
                }
            })
            .state('main.editProfile', {
                url: '/editProfile',
                views: {
                    'main-more': {
                        templateUrl: 'templates/edit-profile-view.html',
                        controller: 'EditProfileCtrl'
                    }
                }
            })
            .state('main.editPicture', {
                url: '/editPicture',
                views: {
                    'main-more': {
                        templateUrl: 'templates/edit-pic-view.html',
                        controller: 'EditPicCtrl'
                    }
                }
            })

        $urlRouterProvider.otherwise('/auth/login');

    });
