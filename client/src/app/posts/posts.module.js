(function() {
  'use strict';

  angular.module('posts.module',
    [
      'common.services.api'
    ])
    .config(config);

  function config($stateProvider) {
    $stateProvider
      .state('root.posts', {
        url: '/posts',
        views: {
          '@': {
            templateUrl: 'src/app/posts/posts.tpl.html',
            controller: 'postCtrl as vm'
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
