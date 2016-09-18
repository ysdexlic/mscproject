(function () {
  'use strict';

  angular.module('new-post.module')
    .controller('newPostCtrl', newPostCtrl);

  function newPostCtrl($log, userApi, parseApi, $scope) {
    var vm = this;

    userApi.currentUser().then(function(response) {
      vm.username = response.username;
      vm.userId = response.objectId;
    }, function(error){
      console.log(error);
    });

    vm.post = function (userId, username, title, content) {

      vm.userPointer = {'__type':'Pointer', 'className':'_User', 'objectId':userId};
      vm.username = username;
      vm.title = title;
      vm.content = content;
      vm.file = {'__type':'File', 'name':vm.fileName, 'url':vm.fileUrl};

      parseApi.create('Posts',
        {'user':vm.userPointer, 'username':vm.username, 'title':vm.title, 'content':vm.content, 'file':vm.file})
        .then(function(response) {
          //console.log(response);
        });
    };


    vm.uploadFile = function(files) {
      parseApi.uploadFile(files)
        .then(function(response) {
          vm.fileName = response.data.name;
          vm.fileUrl = response.data.url;

        }, function(error) {
          console.log(error);
        });
    };

  }

})();
