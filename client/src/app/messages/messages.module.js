(function() {
  'use strict';

  angular.module('messages.module',
    [
      'common.services.api'
    ])
    .config(config);

  function config($stateProvider) {
    $stateProvider
      .state('root.messages', {
        url: '/messages',
        views: {
          '@': {
            templateUrl: 'src/app/messages/messages.tpl.html',
            controller: 'messageCtrl as messageCtrl'
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
