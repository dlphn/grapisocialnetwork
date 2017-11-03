angular.module('hello-app.services', [])

    .factory('API', function($rootScope, $http, $ionicLoading, $window, $ionicPopup) {
        //local endpoint
        var base = "http://localhost:9804";
        $rootScope.show = function (text) {
            $rootScope.loading = $ionicLoading.show({
                content: text ? text : 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });
        };
        
        $rootScope.hide = function() {
            $ionicLoading.hide();
        };
    
        $rootScope.logout = function() {
            $rootScope.setToken("");
            $window.location.href = '#/auth/login';
        };
    
        $rootScope.notify = function(title, template) {
            $ionicPopup.alert({
                title: title,
                template: template
            });
        }
    
        $rootScope.doRefresh = function(tab) {
            if (tab == 1)
                $rootScope.$broadcast('fetchAll');
            $rootScope.$broadcast('scroll.refreshComplete');
        };
        
        $rootScope.removeToken = function() {
            return $window.localStorage.clear();
        }
        
        $rootScope.isSessionActive = function() {
            return $window.localStorage.UserData ? true : false;
        }
        
        return {
            login: function (form) {
                return $http.post(base+'/api/user/login', form);
            },
            signup: function (form) {
                return $http.post(base+'/api/user/signup', form);
            },
            getAll: function (data) {
                return $http.post(base+'/api/news/get', data);
            },
            getSharedPost: function(data) {
                return $http.post(base+'/api/news/getSharedPost', data)
            },
            postStatus: function (data) {
                return $http.post(base+'/api/news/postStatus', data);
            },
            getUsers: function() {
                return $http.get(base+'/api/users/get');
            },
            getFriendRequests: function (form) {
                return $http.post(base+'/api/users/getFriendRequests', form);
            },            
            getFriendInfo: function(data) {
                return $http.post(base+'/api/users/getFriendInfo', data);
            },
            sendFriendRequest: function(data) {
                return $http.post(base+'/api/users/sendFriendRequest', data);
            },
            cancelSentFriendRequest: function(data) {
                return $http.post(base+'/api/users/cancelSentFriendRequest', data);
            },
            cancelReceivedFriendRequest: function(data) {
                return $http.post(base+'/api/users/cancelReceivedFriendRequest', data);
            },
            acceptFriendRequest: function(data) {
               return $http.post(base+'/api/users/acceptFriendRequest', data);
            },
            unfriend: function(data) {
                return $http.post(base+'/api/users/unfriend', data);
            },
            updateProfile: function(data) {
                return $http.post(base+'/api/profile/updateProfile', data);
            }
        }
    });
