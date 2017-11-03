angular.module('hello-app.controllers', [])

.controller('LogInCtrl', function($rootScope, $scope, API, $window) {
    if ($rootScope.isSessionActive()) {
        $window.location.href = ('#/main/timeline');
    }
    
    $scope.user = {
        email: "",
        password: ""
    };
    
    $scope.logUserIn = function() {
        var email = this.login.email;
        var password = this.login.password;
        $rootScope.show('Please wait... Authenticating');
        API.login({
            email: email,
            password: password
        }).success(function(data) {
            $window.localStorage.setItem('UserData', JSON.stringify(data)); //user in localStorage
            $rootScope.hide();
            $window.location.href = ('#/main/timeline');
        }).error(function(error) {
            $rootScope.hide();
            $rootScope.notify("Oops", "Invalid email or password");
        });
    }
})

.controller('SignUpCtrl', function($rootScope, $scope, API, $window) {
    $scope.user = {
        email: "",
        password: "",
        first_name: "",
        last_name: ""
    };
    
    $scope.createUser = function() {
        var email = this.newUser.email;
        var password = this.newUser.password;
        var first_name = this.newUser.first_name;
        var last_name = this.newUser.last_name;
        var username = this.newUser.first_name.toLowerCase() + this.newUser.last_name.toLowerCase();
        $rootScope.show("Please wait... Registering");
        API.signup({
            first_name: first_name,
            last_name: last_name,
            email: email,
            password: password,
            username: username
        }).success(function(data) {
            $window.localStorage.setItem('UserData', JSON.stringify(data));
            $rootScope.hide();
            $window.location.href = ('#/main/timeline');
        }).error(function(error) {
            $rootScope.hide();
            if (error.statusCode === 400) {
                $rootScope.notify('Signup failed', 'A user with this email already exists');
            } else {
                $rootScope.notify('Oops', 'Something went wrong, please try again!');
            }
        });
    }
})

.controller('TimelineCtrl', function($rootScope, $scope, API, $timeout, $window, Upload, $state, $ionicPopup) {
    $scope.user = JSON.parse($window.localStorage.getItem('UserData'));
    console.log($scope.user);
    
    $scope.sendNews = function(file) {
      if (file) {
        var request = {
          user: $scope.user.firstName + " " + $scope.user.lastName,
          userId: $scope.user._id,
          userImage: $scope.user.image,
          contentText: this.newNews,
          contentImage: file
        }
        file.upload = Upload.upload({
          url: 'http://localhost:9804/api/news/postPic',
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
          contentText: this.newNews
        }
        API.postStatus(request).success(function(response) {
            $state.reload();
        }).error(function(error) {
          console.error(error);
        });
      }
    };
    
    $scope.share = function(postId) {
        $scope.model = {};
        
        var sharePopup = $ionicPopup.show({
            template: '<textarea type="text" ng-model="model.caption" placeholder="Add a comment"></textarea>',
            title: 'Share post',
            subtitle: 'Add a comment',
            scope: $scope,
            buttons: [
                { text: 'Cancel' },
                {
                    text: '<b>Post</b>',
                    type: 'button-balanced',
                    onTap: function(e) {
                        var request = {
                            user: $scope.user.firstName + " " + $scope.user.lastName,
                            userId: $scope.user._id,
                            userImage: $scope.user.image,
                            contentText: $scope.model.caption,
                            contentShared: postId
                        }
                        API.postStatus(request).success(function(response) {
                            $state.reload();
                        }).error(function(err) {
                            console.log(err);
                        });
                    }
                },
            ]
        });
        
        sharePopup.then(function(res) {
            console.log("shared");
        });
    };
    
    $rootScope.$on('fetchAll', function() {
        var data = {};
        data.friends = angular.copy($scope.user.friends);
        data.friends.push({userId: $scope.user._id});
        API.getAll(data).success(function(response) {
            $rootScope.show("Please wait... Processing");
            $scope.news = response;
            $scope.user.posts_nb = Object.keys($scope.news).length;
            angular.forEach($scope.news, function(post) {
                $scope.getSharedPost(post);
                $scope.getFriendPic(post);
            }); 
            $rootScope.hide();
        }).error(function(data, status, headers, config) {
            $rootScope.hide();
            $rootScope.notify('Oops', "Something went wrong! Please try again later");
        });
    });
    
    $scope.getFriendPic = function(post) {
        API.getFriendInfo({
            friend_id: post.userId
        }).success(function(response) {
            return post.userInfo = response;
        }).error(function(error) {
            $rootScope.hide();
            console.log(error);
            $rootScope.notify('Oops', "Something went wrong! Please try again later");
        });
    };
    
    $scope.getSharedPost = function(post) {
      if (post.contentShared !== undefined) {
        var data = {post_id: post.contentShared};
        API.getSharedPost(data).success(function(response) {
          return post.sharedPostInfo = response;
        });
      }
    };
    
    $rootScope.$broadcast('fetchAll');
})

.controller('FriendsCtrl', function($rootScope, $scope, API, $window, $state) {
    $scope.user = JSON.parse($window.localStorage.getItem('UserData'));
    
    API.getUsers().then(function(response) {
      $scope.users = response.data;
    });
    
    API.getFriendRequests({
        userId: $scope.user._id
    }).success(function(data) {
        $scope.user.receivedFriendRequests = data;
        $window.localStorage.setItem('UserData', JSON.stringify($scope.user));
        $rootScope.hide();
        $scope.friendRequests = data;
        angular.forEach($scope.friendRequests, function(friend) {
            $scope.getFriendInfo(friend);
        });
    }).error(function(error) {
        $rootScope.hide();
        console.log(error);
        $rootScope.notify('Oops', "Something went wrong! Please try again later");
    });

    $scope.getFriendInfo = function(friend) {
        API.getFriendInfo({
            friend_id: friend.userId
        }).success(function(response) {
            return friend.info = response;
        }).error(function(error) {
            $rootScope.hide();
            console.log(error);
            $rootScope.notify('Oops', "Something went wrong! Please try again later");
        });
    };
    
    $scope.checkIsFriend = function(personId) {
      for (var i=0, len=$scope.user.friends.length; i<len; i++) {
        if ($scope.user.friends[i].userId == personId) {
          return true;
        }
      }
      return false;
    };

    $scope.checkRequestSent = function(personId) {
      for (var i=0, len=$scope.user.sentFriendRequests.length; i<len; i++) {
        if ($scope.user.sentFriendRequests[i].userId == personId) {
          return true;
        }
      }
      return false;
    };
    
    $scope.sendFriendRequest = function(userId, personId) {
      request = {userId: userId,
              personId: personId};
      API.sendFriendRequest(request).then(function(response) {
        $scope.user.sentFriendRequests = response.data;
        $window.localStorage.setItem('UserData', JSON.stringify($scope.user));
        console.log("sending friend request ", personId);
      })
    };
    
    $scope.cancelSentFriendRequest = function(userId, personId) {
      request = {userId: userId,
              personId: personId};
      API.cancelSentFriendRequest(request).then(function(response) {
        $scope.user.sentFriendRequests = response.data;
        $window.localStorage.setItem('UserData', JSON.stringify($scope.user));
        console.log("cancelling friend request ", personId);
      })
    };

    $scope.cancelReceivedFriendRequest = function(userId, personId) {
      request = {userId: userId,
              personId: personId};
      API.cancelReceivedFriendRequest(request).then(function(response) {
        $scope.user.receivedFriendRequests = response.data;
        $window.localStorage.setItem('UserData', JSON.stringify($scope.user));
        console.log("cancelling friend request ", personId);
        $state.reload();
      });
    }

    $scope.acceptFriendRequest = function(userId, personId) {
      request = {userId: userId,
              personId: personId};
      API.acceptFriendRequest(request).then(function(response) {
        $scope.user.friends = response.data;
        $window.localStorage.setItem('UserData', JSON.stringify($scope.user));
        console.log("accepting friend request from ", personId);
        $state.reload();
      });
    }

    $scope.unfriend = function(userId, personId) {
      request = {userId: userId,
              personId: personId};
      API.unfriend(request).then(function(response) {
        $scope.user.friends = response.data;
        $window.localStorage.setItem('UserData', JSON.stringify($scope.user));
        console.log("unfriending ", personId);
      });
    }

})

.controller('MoreCtrl', function($rootScope, $scope, API, $window) {
    $scope.logOut = function() {
        $rootScope.removeToken();
        $rootScope.hide();
        $window.location.href = ('#/auth/login');
        $window.location.reload(true);
    };
})

.controller('MyProfileCtrl', function($rootScope, $scope, API, $window, $ionicHistory) {
    $scope.user = JSON.parse($window.localStorage.getItem('UserData'));
    
    var data = {};
    data.friends = [{userId: $scope.user._id}];
    API.getAll(data).success(function(response) {
        $rootScope.show("Please wait... Processing");
        $scope.news = response;
        $scope.user.posts_nb = Object.keys($scope.news).length;
        angular.forEach($scope.news, function(post) {
          $scope.getSharedPost(post);
        });
        $rootScope.hide();
    }).error(function(data, status, headers, config) {
        $rootScope.hide();
        $rootScope.notify('Oops', "Something went wrong! Please try again later");
    });
    
    $scope.getSharedPost = function(post) {
      if (post.contentShared !== undefined) {
        var data = {post_id: post.contentShared};
        API.getSharedPost(data).success(function(response) {
          return post.sharedPostInfo = response;
        });
      }
    };
    
    $scope.goBack = function(){
        $ionicHistory.goBack();
    };
})

.controller('EditProfileCtrl', function($rootScope, $scope, API, $window, $ionicHistory) {
    $scope.user = JSON.parse($window.localStorage.getItem('UserData'));
    
    $scope.updateProfile = function() {
        var city = this.user.city;
        var country = this.user.country;
        var bio = this.user.bio;
        $rootScope.show("Please wait... Updating");
        API.updateProfile({
            userId: $scope.user._id,
            city: city,
            country: country,
            bio: bio
        }).success(function(data) {
            console.log("success");
            $rootScope.notify("Info updated", "");
            $window.localStorage.setItem('UserData', JSON.stringify($scope.user));
            $rootScope.hide();
        }).error(function(error) {
            $rootScope.hide();
            console.log(error);
            $rootScope.notify('Oops', "Something went wrong! Please try again later");
        });
    }
    
    $scope.goBack = function(){
        $ionicHistory.goBack();
    };
})

.controller('EditPicCtrl', function($rootScope, $scope, API, $window, $ionicHistory, Upload) {
    $scope.user = JSON.parse($window.localStorage.getItem('UserData'));
    
    $scope.upload = function (dataUrl, name) {
        Upload.upload({
            url: 'http://localhost:9804/api/profile/editPhoto',
            method: 'POST',
            data: {
              userId: $scope.user._id,
              file: Upload.dataUrltoBlob(dataUrl, name)},
        }).success(function (response) {
            console.log("success");
            $rootScope.hide();
            $scope.user.image = response.data.data;
            $window.localStorage.setItem('User-Data', JSON.stringify($scope.user));
            $rootScope.notify("Picture updated", "");
        }).error(function (error) {
            console.log(error);
        });
    };
    
    $scope.goBack = function(){
        $ionicHistory.goBack();
    };
})

.controller('OtherProfileCtrl', function($rootScope, $scope, API, $window, $ionicHistory, $stateParams, $state) {
    $scope.friend = {
        posts_nb: 0
    };
    
    API.getFriendInfo({friend_id: $stateParams.id}).success(function(response) {
        $scope.friend = response;
        $rootScope.$broadcast('fetchAll');
    });
    
    $scope.user = JSON.parse($window.localStorage.getItem('UserData'));
    
    var data = {};
    data.friends = [{userId: $stateParams.id}];
    $rootScope.$on('fetchAll', function(){
        API.getAll(data).success(function(response) {
            $rootScope.show("Please wait... Processing");
            $scope.news = response;
            $scope.friend.posts_nb = Object.keys($scope.news).length;
            angular.forEach($scope.news, function(post) {
              $scope.getSharedPost(post);
            });
            $rootScope.hide();
        }).error(function(data, status, headers, config) {
            $rootScope.hide();
            $rootScope.notify('Oops', "Something went wrong! Please try again later");
        });
    });
    
    $scope.getSharedPost = function(post) {
      if (post.contentShared !== undefined) {
        var data = {post_id: post.contentShared};
        API.getSharedPost(data).success(function(response) {
          return post.sharedPostInfo = response;
        });
      }
    };
    
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
    
    $scope.sendFriendRequest = function(userId, personId) {
      request = {userId: userId,
              personId: personId};
      API.sendFriendRequest(request).then(function(response) {
        $scope.user.sentFriendRequests = response.data;
        $window.localStorage.setItem('UserData', JSON.stringify($scope.user));
        console.log("sending friend request ", personId);
      })
    }
    
    $scope.cancelSentFriendRequest = function(userId, personId) {
      request = {userId: userId,
              personId: personId};
      API.cancelSentFriendRequest(request).then(function(response) {
        $scope.user.sentFriendRequests = response.data;
        $window.localStorage.setItem('UserData', JSON.stringify($scope.user));
        console.log("cancelling friend request ", personId);
      })
    }

    $scope.cancelReceivedFriendRequest = function(userId, personId) {
      request = {userId: userId,
              personId: personId};
      API.cancelReceivedFriendRequest(request).then(function(response) {
        $scope.user.receivedFriendRequests = response.data;
        $window.localStorage.setItem('UserData', JSON.stringify($scope.user));
        console.log("cancelling friend request ", personId);
        $state.reload();
      })
    }

    $scope.acceptFriendRequest = function(userId, personId) {
      request = {userId: userId,
              personId: personId};
      API.acceptFriendRequest(request).then(function(response) {
        $scope.user.friends = response.data;
        $window.localStorage.setItem('UserData', JSON.stringify($scope.user));
        console.log("accepting friend request from ", personId);
        $state.reload();
      })
    }

    $scope.unfriend = function(userId, personId) {
      request = {userId: userId,
              personId: personId};
      API.unfriend(request).then(function(response) {
        $scope.user.friends = response.data;
        $window.localStorage.setItem('UserData', JSON.stringify($scope.user));
        console.log("unfriending ", personId);
      })
    }
    
    $scope.goBack = function(){
        $ionicHistory.goBack();
    };
})
;
