(function() {
  'use strict';

  angular.module('profile.module',
    [
      'common.services.api'
    ])
    .config(config);

  function config($stateProvider) {
    $stateProvider
      .state('root.profile', {
        url: '/profile',
        views: {
          '@': {
            templateUrl: 'src/app/user-profile/profile.tpl.html',
            controller: 'profileCtrl as profileCtrl'
          }
        },
        resolve: {
          auth: authentication
        }
      });

    function authentication ($q, userApi) {

      if (userApi.currentUser()) {
        return $q.resolve({ 'authenticated': true });
      } else {
        return $q.reject({ 'authenticated': false });
      }
    }
  }

})();
