(function () {
  'use strict';

  angular.module('common.directives.post', [])
    .directive('posts', posts);

  function posts() {
    return {
      restrict: 'E',
      templateUrl: 'src/app/posts/posts.tpl.html',
      templateCtrl: 'src/app/posts/posts.controller.js'
    };
  }

})();
