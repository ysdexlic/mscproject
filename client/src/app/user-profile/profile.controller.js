(function () {
  'use strict';

  angular.module('profile.module')
    .controller('profileCtrl', profileCtrl);

  function profileCtrl($scope, $stateParams, parseApi, userApi, $log) {

    var vm = this;

    userApi.currentUser()
      .then(
        function (result) {
          // Successful get
          vm.username = result.username;
          vm.id = result.objectId;

          if (result.picture) {
            vm.picture = result.picture.url;
          }
          else {
            vm.picture = 'assets/images/unknown.gif';
          }

          parseApi.getFollowing(vm.id)
            .then(
              function (result) {
                vm.followData = result.data.results;
                vm.followingNumber = vm.followData.length;

              },
              function (error) {
                // Get failed, display error message
                $log.debug(error);
                vm.errorMessage = error.message;
              });

          parseApi.getFollowers(vm.id)
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

        },
        function (error) {
          // Get failed, display error message
          $log.debug('Error occurred');
          vm.errorMessage = error.message;
        });

    $scope.uploadFile = function(files) {
      parseApi.uploadFile(files)
        .then(function(response) {
          vm.fileName = response.data.name;
          vm.fileUrl = response.data.url;

          userApi.editUser(vm.id, {'picture':{'__type':'File', 'name':vm.fileName, 'url':vm.fileUrl}})
            .then(function(response) {

            });

        }, function(error) {
          $log.debug(error);
        });
    };

  }

})();
