(function() {
  'use strict';

  angular.module('follows.module',
    [
      'common.services.api',
      'common.directives.followers'
    ])
    .config(config);

  function config($stateProvider) {
    $stateProvider
      .state('root.following', {
        url: '/user/:userId/following',
        views: {
          '@': {
            templateUrl: 'src/app/follows/following.tpl.html',
            controller: 'followingCtrl as vm'
          }
        },
        resolve: {
          auth: authentication
        }
      })
      .state('root.followers', {
      url: '/user/:userId/followers',
      views: {
        '@': {
          templateUrl: 'src/app/follows/followers.tpl.html',
          controller: 'followersCtrl as vm'
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
