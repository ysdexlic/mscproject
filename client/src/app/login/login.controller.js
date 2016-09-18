(function () {
  'use strict';

  angular.module('login.module')
    .controller('LoginCtrl', LoginCtrl);

  function LoginCtrl($log, userApi, $location, $window) {
    $log.debug('loginCtrl Loaded');
    var vm = this;

    vm.logIn = function (username, password) {
      if (userApi.isLoggedIn()){
        vm.errorMessage = 'You are already logged in!';
        $log.debug(vm.errorMessage);
        return;
      }
      //console.log('call Logged In As:', username);
      vm.errorMessage = '';

      userApi.logIn(username, password)
        .then(
        function (userProfile) {
          console.log(userProfile);
          vm.userId = userProfile.objectId;
          vm.sessionToken = userProfile.sessionToken;

          $log.debug('loginCtrl login success');
          $window.location.reload();
          $location.path('/home');
          // have to reload to allow cookies to be recognised


        },
        function (error) {
          // Login failed, display error message
          $log.debug('loginCtrl login failed');
          vm.errorMessage = error.message;
        });
    };

    vm.logOut = function () {
      if (userApi.isLoggedIn()){
        //console.log('call Log Out');
        vm.errorMessage = '';

        userApi.logOut()
          .then(
          function (response) {
            //successful logout
            $log.debug('loginCtrl logout success');
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

})();
