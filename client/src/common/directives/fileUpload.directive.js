(function() {
  'use strict';

  angular.module('new-post.module')
    .directive('fileUpload', fileUpload);

  function fileUpload($parse) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        var model = $parse(attrs.fileUpload);
        var modelSetter = model.assign;
        //console.log(model);

        element.bind('change', function(){
          scope.$apply(function(){
            modelSetter(scope, element[0].files[0]);
          });
        });
      }
    };
  }

})();
