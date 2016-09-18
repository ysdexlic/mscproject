(function () {
  'use strict';

  angular.module('follows.module')
    .controller('followersCtrl', followersCtrl);

  function followersCtrl($scope, $stateParams, parseApi, userApi, $log) {

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

    parseApi.getFollowers($stateParams.userId)
      .then(
        function (result) {

          vm.count = result.data.count;
          vm.followerList = [];

          angular.forEach(result.data.results, function(followers) {

            parseApi.getUser(followers.user.objectId)
              .then(function(user) {
                vm.follower = user.data;

                vm.pictureStyle = {'background': 'url(' + vm.follower.picture.url + ') no-repeat center center / cover'};

                vm.followerList.push(
                  {
                    'followerUsername': vm.follower.username, 'followerUserId': vm.follower.objectId,
                    'followerUserPictureUrl': vm.follower.picture.url, 'followerUserInstrument': vm.follower.instrument,
                    'followerUserBio': vm.follower.bio

                  });

              });
          });

          vm.followData = result.data.results;
          vm.followerNumber = vm.followData.length;

        },
        function (error) {
          // Get failed, display error message
          $log.debug('Error occurred');
          vm.errorMessage = error.message;
        });

  }

})();
