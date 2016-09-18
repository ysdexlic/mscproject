(function () {
  'use strict';

  angular.module('signup.module')
    .controller('SignupCtrl', SignupCtrl);

  function SignupCtrl($log, userApi, $location, $window) {
  	$log.debug('signupCtrl Loaded!');
  	var vm = this;
    vm.signup = {};

  	vm.signUp = function (username, password, email) {
      vm.errorMessage = '';
      //console.log('call Signed up as:', username);
      if(vm.signup.password === vm.signup.confirmPassword) {

        userApi.signUp(username, password, email)
          .then(function (userProfile) {
              //successful login
              console.log(userProfile);
              $log.debug('signupCtrl signup success');
              $window.location.reload();
              $location.path('/user/' + userProfile.objectId);
            },
            function (error) {
              // Login failed, display error message
              $log.debug('SignupCtrl signup failed');
              vm.errorMessage = error.message;
            });



      }
      else {
        $log.debug('Passwords do not match');
        vm.errorMessage = 'passwords do not match';
      }
    };

    vm.isUser = function (username) {
      vm.errorMessage = '';
      userApi.isUser(username)
        .then(function (user) {
          $log.debug('isUser signup success');
        },
        function (error) {
          $log.debug('isUser signup failed');
          vm.errorMessage = error.message;
        });
    };
  }

})();
