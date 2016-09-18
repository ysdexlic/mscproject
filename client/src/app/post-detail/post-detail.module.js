(function() {
  'use strict';

  angular.module('post-detail.module',
    [
      'common.services.api'
    ])
    .config(config);

  function config($stateProvider) {
    $stateProvider
      .state('root.post-detail', {
        url: '/posts/:postId',
        views: {
          '@': {
            templateUrl: 'src/app/post-detail/post-detail.tpl.html',
            controller: 'postDetailCtrl as postDetailCtrl'
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
