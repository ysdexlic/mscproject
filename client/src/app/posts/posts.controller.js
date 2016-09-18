(function () {
  'use strict';

  angular.module('posts.module')
    .controller('postCtrl', postCtrl);

  function postCtrl($log, userApi, parseApi) {
    $log.debug('postCtrl Loaded!');
    var vm = this;

    vm.limit = 10;
    vm.skip = 0;


    vm.numberToArray = function(num) {
      return new Array(num);
    };


    vm.jumpToPage = function(pageNumber) {
      if(vm.skip !== vm.limit*(pageNumber-1)) {
        vm.skip = vm.limit * (pageNumber - 1);
        vm.getAll(vm.limit, vm.skip);
      }
    };

    vm.next = function() {
      if(vm.skip + vm.limit < vm.count) {
        vm.skip += vm.limit;

        vm.getAll(vm.limit, vm.skip);
      }
    };

    vm.previous = function() {
      if(vm.skip > 0) {
        vm.skip -= vm.limit;

        vm.getAll(vm.limit, vm.skip);
      }
    };


    vm.getAll = function(limit, skip){
      parseApi.getAll('Posts', limit, skip).then(function(result) {
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
          //console.log(post);

          parseApi.getUser(post.user.objectId)
            .then(function(response) {
              vm.user = response.data;
              //vm.getPostComments(post.objectId);
              vm.pictureStyle = {'background': 'url(' + vm.user.picture.url + ') no-repeat center center / cover'};


              vm.postList.push(
                {
                  'postTitle':post.title, 'postContent':post.content,
                  'postFile':post.file, 'postId':post.objectId,
                  'createdAt':post.createdAt, 'username': vm.user.username,
                  'userId': vm.user.objectId, 'userPictureUrl': vm.user.picture.url,
                  'commentCount': vm.commentCount

                });
            });
        });
      });
    };


    vm.getAll(vm.limit, vm.skip);
  }

})();
