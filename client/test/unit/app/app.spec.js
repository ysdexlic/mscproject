/* jshint undef:false*/
(function() {
  'use strict';

  describe('app module', function() {
    var something,
      deps,
      createController,
      vm;

    var hasModule = function(m) {
      return deps.indexOf(m) >= 0;
    };

    beforeEach(module('app'));
    beforeEach(inject(function($controller) {
      something = angular.module('app');
      deps = something.value('app').requires;

      createController = function (mockDependencies) {
        mockDependencies = mockDependencies || {};

        return $controller(
          'MainCtrl',
          _.defaults(mockDependencies)
        );
      };

    }));

    it('should be registered', function() {
      expect(something).not.toEqual(null);
    });

    it('should have a controller', function() {
      vm = createController();
      expect(vm).not.toEqual(null);
    });

    it('should have ui.router as a dependency', function() {
      expect(hasModule('ui.router')).toEqual(true);
    });

    it('should have common.services.data as a dependency', function() {
      expect(hasModule('common.services.data')).toEqual(true);
    });
  });
})();
