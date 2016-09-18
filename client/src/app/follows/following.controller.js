(function () {
  'use strict';

  angular.module('follows.module')
    .controller('followingCtrl', followingCtrl);

  function followingCtrl($scope, $stateParams, parseApi, userApi, $log) {

    var vm = this;
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
        },
        function (error) {
          // Get failed, display error message
          $log.debug('Error occurred');
          vm.errorMessage = error.message;
        });

    parseApi.getFollowing($stateParams.userId)
      .then(
        function (result) {
          vm.count = result.data.count;
          vm.followingList = [];

          angular.forEach(result.data.results, function(following) {

            parseApi.getUser(following.follows.objectId)
              .then(function(user) {
                vm.following = user.data;

                vm.pictureStyle = {'background': 'url(' + vm.following.picture.url + ') no-repeat center center / cover'};

                vm.followingList.push(
                  {
                    'followingUsername': vm.following.username, 'followingUserId': vm.following.objectId,
                    'followingUserPictureUrl': vm.following.picture.url, 'followingUserInstrument': vm.following.instrument,
                    'followingUserBio': vm.following.bio

                  });

              });
          });

          vm.followData = result.data.results;
          vm.followingNumber = vm.followData.length;


        },
        function (error) {
          // Get failed, display error message
          $log.debug('Error occurred');
          vm.errorMessage = error.message;
        });

  }

})();
