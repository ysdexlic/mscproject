(function() {
  'use strict';

  function headerCtrl($log, $cookies, $location, userApi, $window) {
    $log.debug('Header loaded');
    var vm = this;
    vm.userId = $cookies.get('_userId');


    vm.getClass = function(path) {
      return ($location.path().substr(0, path.length) === path);
    };

    if(userApi.currentUser()){
      vm.getProfile = function(path) {
        return ($location.path().substr(path.length, vm.userId.length) === vm.userId);
      };

      vm.isLoggedIn = true;
    }

    vm.logOut = function () {
      console.log('LOGGIN OUT');
      if (userApi.isLoggedIn()){
        //console.log('call Log Out');
        vm.errorMessage = '';

        userApi.logOut()
          .then(
            function (response) {
              //successful logout
              $log.debug('loginCtrl logout success');
              $location.path('/');
              $window.location.reload();
            },
            function (error) {
              // Logout failed, display error message
              $log.debug('loginCtrl logout failed');
              vm.errorMessage = error.message;
            });
      }
      else {
        vm.errorMessage = 'No user logged in!';
      }
    };

  }

  angular.module('common.header', [
    'ngCookies'
  ])
    .controller('HeaderCtrl', headerCtrl);
})();
