(function() {
  'use strict';

  angular.module('common.directives.followers', [])
    .directive('followersDirective', followersDirective);

  function followersDirective() {
    return {
      restrict: 'E',
      transclude: true,
      replace: true,
      template: '<a href="#/user/{{followerUserId}}">{{followerUsername}}</a>',
      scope:{
        src: '@'
      },
      /*jshint unused:false*/
      controller: function($scope, parseApi) {
        parseApi.getUser($scope.src).then(function(result) {
          $scope.followerUsername = result.data.username;
          $scope.followerUserId = result.data.objectId;
        });

      }
    };
  }

})();
