(function() {
  'use strict';

  angular.module('message-detail.module',
    [
      'common.services.api'
    ])
    .config(config);

  function config($stateProvider) {
    $stateProvider
      .state('root.message-detail', {
        url: '/messages/:messageId',
        views: {
          '@': {
            templateUrl: 'src/app/message-detail/message-detail.tpl.html',
            controller: 'messageDetailCtrl as vm'
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
