(function () {
  'use strict';

  angular.module('homepage.module')
    .controller('homepageCtrl', homepageCtrl);

  function homepageCtrl(userApi, parseApi, $location) {
    var vm = this;

    vm.loading = false;
    vm.limit = 20;
    vm.skip = 0;

    userApi.currentUser().then(function (response) {
      vm.userId = response.objectId;
      vm.username = response.username;

      parseApi.getFollowing(vm.userId).then(function (response) {

        angular.forEach(response.data.results, function (data) {
          vm.getFollowingPosts('Posts', data.follows.objectId, vm.limit, vm.skip);

        });

      });

    });


    vm.uploadFile = function (files) {
      vm.loading = true;
      parseApi.uploadFile(files)
        .then(function (response) {
          console.log(files);
          vm.fileName = response.data.name;
          vm.fileUrl = response.data.url;
          vm.loading = false;

        }, function (error) {
          console.log(error);
        });
    };

    vm.post = function (userId, username, title, content) {

      vm.userPointer = {'__type': 'Pointer', 'className': '_User', 'objectId': userId};
      vm.username = username;
      vm.title = title;
      vm.content = content;
      vm.file = {'__type': 'File', 'name': vm.fileName, 'url': vm.fileUrl};

      if(vm.loading) {
        vm.errorMessage = 'please wait till the file has finished loading';
      }
      else if(vm.title === undefined || vm.content === undefined){
        vm.errorMessage = 'please finish off the post!';
      }
      else if(!vm.fileUrl) {
        vm.errorMessage = 'please upload an audio file with your post';
      }
      else {
        parseApi.create('Posts',
          {'user': vm.userPointer, 'username': vm.username, 'title': vm.title, 'content': vm.content, 'file': vm.file})
          .then(function (response) {
            //console.log(response);
            vm.newPostId = response.data.objectId;
            $location.path('/posts/' + vm.newPostId);
          },
          function(error){
            vm.errorMessage = error;
          });
      }


    };


    vm.getFollowingPosts = function(className, followId, limit, skip) {

      parseApi.getWhereUser(className, followId, limit, skip)
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

        parseApi.getFollowing(vm.userId).then(function (response) {

          angular.forEach(response.data.results, function (data) {
            vm.getFollowingPosts('Posts', data.follows.objectId, vm.limit, vm.skip);

          });

        });
      }
    };

    vm.previous = function() {
      if(vm.skip > 0) {
        vm.skip -= vm.limit;

        parseApi.getFollowing(vm.userId).then(function (response) {

          angular.forEach(response.data.results, function (data) {
            vm.getFollowingPosts('Posts', data.follows.objectId, vm.limit, vm.skip);

          });

        });
      }
    };

    vm.numberToArray = function(num) {
      return new Array(num);
    };


    vm.jumpToPage = function(pageNumber) {
      if(vm.skip !== vm.limit*(pageNumber-1)) {
        vm.skip = vm.limit * (pageNumber - 1);
        parseApi.getFollowing(vm.userId).then(function (response) {

          angular.forEach(response.data.results, function (data) {
            vm.getFollowingPosts('Posts', data.follows.objectId, vm.limit, vm.skip);

          });

        });
      }
    };



  }

})();
