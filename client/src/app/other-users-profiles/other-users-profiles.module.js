(function() {
  'use strict';

  angular.module('other-users-profiles.module',
    [
      'common.services.api'
    ])
    .config(config);

  function config($stateProvider) {
    $stateProvider
      .state('root.other-users-profiles', {
        url: '/user/:userId',
        views: {
          '@': {
            templateUrl: 'src/app/other-users-profiles/other-users-profiles.tpl.html',
            controller: 'otherUserProfileCtrl as vm'
          }
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
