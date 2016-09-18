(function() {
  'use strict';

  angular.module('new-post.module',
    [
      'common.services.api'
    ])
    .config(config);

  function config($stateProvider) {
    $stateProvider
      .state('root.new-post', {
        url: '/new-post',
        views: {
          '@': {
            templateUrl: 'src/app/new-post/new-post.tpl.html',
            controller: 'newPostCtrl as vm'
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
