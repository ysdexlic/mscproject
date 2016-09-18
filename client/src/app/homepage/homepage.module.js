(function() {
  'use strict';

  angular.module('homepage.module',
    [
      'common.services.api'
    ])
    .config(config);

  function config($stateProvider) {
    $stateProvider
      .state('root.homepage', {
        url: '/home',
        views: {
          '@': {
            templateUrl: 'src/app/homepage/homepage.tpl.html',
            controller: 'homepageCtrl as vm'
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
