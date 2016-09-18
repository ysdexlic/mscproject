(function () {
  'use strict';

  angular.module('post-detail.module')
    .controller('postDetailCtrl', postDetailCtrl);

  function postDetailCtrl($stateParams, parseApi, $log, $sce, $location, $cookies) {

    if($stateParams.postId === ''){
      $location.path('/home');
    }
    else {

      var vm = this;

      parseApi.get('Posts', $stateParams.postId)
        .then(
          function (result) {
            // Successful get
            vm.data = result.data;
            if(result.data.file){
              vm.fullAudioName = result.data.file.name.substr(42);
              vm.dotIndex = vm.fullAudioName.lastIndexOf('.');
              vm.shortAudioName = vm.fullAudioName.substr(0, vm.dotIndex);

              vm.audioUrl = $sce.trustAsResourceUrl(result.data.file.url);
            }

            vm.user = result.data.user.objectId;

            parseApi.get('_User', vm.user).then(function (user) {
              vm.username = user.data.username;
            });

            vm.getComments($stateParams.postId);


          },
          function (error) {
            // Get failed, display error message
            $log.debug('Error occurred');
            vm.errorMessage = error.message;
          });


      vm.writeComment = function(commentMessage) {
        parseApi.create('PostComments',
          {'post':{'__type':'Pointer', 'className':'Posts', 'objectId':$stateParams.postId},
            'user':{'__type':'Pointer', 'className':'_User', 'objectId':$cookies.get('_userId')},
            'comment':commentMessage
          })
          .then(function(response) {
            $('#message-text').val('');
            vm.getComments($stateParams.postId);
          });
      };


      vm.getComments = function(postId) {
        vm.commentList = [];

        parseApi.getWherePost(postId)
          .then(function (response) {
            angular.forEach(response.data.results, function(comment) {
              parseApi.getUser(comment.user.objectId)
                .then(function(user) {
                  vm.commentUser = user.data;
                  vm.pictureStyle = {'background': 'url(' + user.data.picture.url + ') no-repeat center center / cover'};

                  vm.commentList.push(
                    {
                      'commentUser':vm.commentUser, 'commentContent':comment.comment, 'createdAt':comment.createdAt
                    });

                });

            });

          });
      };


    }

  }

})();
