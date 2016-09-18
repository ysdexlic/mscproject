(function () {
  'use strict';

  angular.module('other-users-profiles.module')
    .controller('otherUserProfileCtrl', otherUserProfileCtrl);

  function otherUserProfileCtrl($scope, $stateParams, parseApi, userApi, $log, $location, $cookies) {

    var vm = this;

    vm.limit = 10;
    vm.skip = 0;
    vm.otherUserId = $stateParams.userId;
    vm.isCurrentUser = false;


    if($stateParams.userId === ''){
      if($cookies.get('_userId') !== undefined || $cookies.get('_sessionToken') !== undefined){
        $location.path('/home');
      }
      else {
        $location.path('/');
        //location.reload();
      }
    }

    if($cookies.get('_userId') !== undefined || $cookies.get('_sessionToken') !== undefined) {
      userApi.currentUser().then(function (result) {
        vm.userId = result.objectId;
        if (result.objectId === $stateParams.userId) {
          vm.isCurrentUser = true;
        }
        else {
          vm.isCurrentUser = false;
          parseApi.follows(vm.userId, $stateParams.userId)
            .then(function(result) {
              vm.followString = 'Follow';
              if (result.data.results.length > 0) {
                //user is already following this user
                vm.followString = 'Unfollow';
              }
            });
        }
      });
    }


    vm.message = function() {
      //vm.messagingList = [];
      parseApi.getMessages(vm.userId)
        .then(function(response){

          angular.forEach(response.data.results, function(messaging){
            console.log(messaging);

            if(messaging.user1.objectId === $stateParams.userId || messaging.user2.objectId === $stateParams.userId){
              //already messaging with user - go to message
              vm.messaging = messaging.objectId;
            }
          });

          if(vm.messaging !== undefined) {
            $location.path('/messages/' + vm.messaging);
          }
          else {
            vm.user1 = {'__type':'Pointer', 'className':'_User', 'objectId':vm.userId};
            vm.user2 = {'__type':'Pointer', 'className':'_User', 'objectId':$stateParams.userId};

            parseApi.create('Messaging', {'user1':vm.user1, 'user2':vm.user2})
              .then(function(response){
                $location.path('/messages/' + response.data.objectId);
              });
          }

        });
    };



    vm.follow = function() {

      userApi.currentUser().then(function(result) {
        vm.userId = result.objectId;
        vm.followId = vm.id;

        parseApi.follows(vm.userId, vm.followId)
          .then(function(result) {
            $log.debug(result.data.results.length);
            if(result.data.results.length > 0 || vm.userId === vm.followId) {
              //user is already following this user
              $log.debug('Already following this user');
              parseApi.remove('Following', result.data.results[0].objectId)
                .then(function(response){
                  vm.followString = 'Follow';
                });
            }
            else {
              parseApi.follow(vm.userId, vm.followId).then(function(success) {
                  vm.followString = 'Unfollow';
                  //location.reload();
                },
                function(error) {
                  console.log(error.data.error);
                });
            }
          });
      });
    };

    parseApi.getUser($stateParams.userId)
      .then(
        function (result) {
          // Successful get
          //console.log(result);
          vm.data = result.data;
          vm.username = result.data.username;
          vm.id = result.data.objectId;
          if (vm.data.picture) {
            vm.picture = vm.data.picture.url;
          }
          else {
            vm.picture = 'assets/images/unknown.gif';
          }

          vm.pictureStyle = {'background': 'url(' + vm.picture + ') no-repeat center center / cover'};


          vm.getPostsFromUser('Posts', $stateParams.userId, vm.limit, vm.skip);

        },
        function (error) {
          // Get failed, display error message
          $log.debug('Error occurred');
          vm.errorMessage = error.message;
        });

    parseApi.getFollowing($stateParams.userId)
      .then(
        function (result) {
          vm.followData = result.data.results;
          vm.followingNumber = vm.followData.length;

        },
        function (error) {
          // Get failed, display error message
          $log.debug('Error occurred');
          vm.errorMessage = error.message;
        });

    parseApi.getFollowers($stateParams.userId)
      .then(
        function (result) {
          vm.followerData = result.data.results;
          vm.followerNumber = vm.followerData.length;

        },
        function (error) {
          // Get failed, display error message
          $log.debug('Error occurred');
          vm.errorMessage = error.message;
        });

    vm.getPostsFromUser = function(className, userId, limit, skip) {

      parseApi.getWhereUser(className, userId, limit, skip)
        .then(function(result) {
          vm.count = result.data.count;
          vm.posts = result.data.results;
          vm.postList = [];

          if((vm.count > vm.limit) && (vm.count % vm.limit === 0)) {
            vm.pages = (vm.count / vm.limit);
          }
          if((vm.count > vm.limit) && (vm.count % vm.limit > 0)) {
            vm.modulo = vm.count % vm.limit;
            vm.pages = ((vm.count - vm.modulo) / vm.limit) + 1;
          }
          if((vm.count < vm.limit) || (vm.count === vm.limit)) {
            vm.pages = 1;
          }

          angular.forEach(result.data.results, function(post) {

            parseApi.getUser(post.user.objectId)
              .then(function (response) {
                vm.user = response.data;

                vm.postList.push(
                  {
                    'postTitle':post.title, 'postContent':post.content,
                    'postFile':post.file, 'postId':post.objectId,
                    'createdAt':post.createdAt, 'username': vm.user.username,
                    'userId': vm.user.objectId, 'userPictureUrl': vm.user.picture.url

                  });
              });

          });
        });
    };

    vm.next = function() {
      if(vm.skip + vm.limit < vm.count) {
        vm.skip += vm.limit;

        vm.getPostsFromUser('Posts', $stateParams.userId, vm.limit, vm.skip);
      }
    };

    vm.previous = function() {
      if(vm.skip > 0) {
        vm.skip -= vm.limit;

        vm.getPostsFromUser('Posts', $stateParams.userId, vm.limit, vm.skip);
      }
    };

    vm.numberToArray = function(num) {
      return new Array(num);
    };


    vm.jumpToPage = function(pageNumber) {
      if(vm.skip !== vm.limit*(pageNumber-1)){
        vm.skip = vm.limit * (pageNumber-1);
        vm.getPostsFromUser('Posts', $stateParams.userId, vm.limit, vm.skip);
      }
    };


    $scope.uploadFile = function(files) {
      parseApi.uploadFile(files)
        .then(function(response) {
          vm.fileName = response.data.name;
          vm.fileUrl = response.data.url;

          userApi.editUser(vm.id, {'picture':{'__type':'File', 'name':vm.fileName, 'url':vm.fileUrl}})
            .then(function(response) {
              vm.picture = vm.fileUrl;
              vm.getPostsFromUser('Posts', $stateParams.userId);

            });

        }, function(error) {
          $log.debug(error);
        });
    };


  }

})();
