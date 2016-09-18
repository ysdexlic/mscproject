(function () {
  'use strict';

  angular.module('homepage.module')
    .directive('newPostForm', newPostForm);

  function newPostForm() {
    return {
      restrict: 'E',
      templateUrl: 'src/app/new-post/new-post.tpl.html',
      templateCtrl: 'src/app/new-post/new-post.controller.js'
    };
  }

})();
