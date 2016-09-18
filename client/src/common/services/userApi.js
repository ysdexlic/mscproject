(function () {
  'use strict';

  angular.module('common.services.api')
    .factory('userApi', userApi);


  function userApi($log, $q, $http, $cookies, PARSE_CREDENTIALS, PARSE_URLS) {
    var service = {};

    service.isLoggedIn = function () {
      return $cookies.get('_sessionToken') !== undefined;
    };

    service.getSession = function () {
      var deferred = $q.defer(),
        config = {
          headers: {
            'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
            'X-Parse-REST-API-Key': PARSE_CREDENTIALS.REST_API_KEY,
            'X-Parse-Session-Token': $cookies.get('_sessionToken')
          },
          params: {
            where: {'user':{'__type':'Pointer', 'className':'_User', 'objectId':$cookies.get('_userId')}}
          }
        };

      $http.get(PARSE_URLS.SESSION, config)
        .then(function (response) {
            return deferred.resolve(response.data);
          },
          function (error) {
            //console.log('unsuccessful user query');
            return deferred.reject({'status': error.status, 'message': 'Invalid username or password'});
          });
      return deferred.promise;
    };

    service.revokeSession = function (sessionId) {
      var deferred = $q.defer(),
        config = {
          headers: {
            'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
            'X-Parse-REST-API-Key': PARSE_CREDENTIALS.REST_API_KEY,
            'X-Parse-Session-Token': $cookies.get('_sessionToken')
          }
        };

      $http.delete(PARSE_URLS.SESSION + '/' + sessionId, config)
        .then(function (response) {
            return deferred.resolve(response.data);
          },
          function (error) {
            //console.log('unsuccessful user query');
            return deferred.reject({'status': error.status, 'message': 'Invalid username or password'});
          });
      return deferred.promise;
    };

    service.isUser = function (username) {
      var deferred = $q.defer(),
        config = {
          headers: {
            'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
            'X-Parse-REST-API-Key': PARSE_CREDENTIALS.REST_API_KEY
          },
          params: {
            where: {'username': username}
          }
        };

      $http.get(PARSE_URLS.USERS, config)
        .then(function (response) {
          return deferred.resolve(response.data);
        },
        function (error) {
          //console.log('unsuccessful user query');
          return deferred.reject({'status': error.status, 'message': 'Invalid username or password'});
        });
      return deferred.promise;
    };

    service.signUp = function (username, password, email) {
      var deferred = $q.defer(),
        config = {
        headers: {
          'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
          'X-Parse-REST-API-Key': PARSE_CREDENTIALS.REST_API_KEY,
          'Content-Type': 'application/json'
        }
      };

      $http.post(PARSE_URLS.SIGNUP, {'username': username, 'password': password, 'email': email}, config)
        .then(function (response) {
          //$log.debug('Signed Up');
          var sessionToken = response.data.sessionToken,
            userId = response.data.objectId,
            expireDate = new Date();

            expireDate.setFullYear(expireDate.getFullYear() +1);

          $cookies.put('_sessionToken', sessionToken, {'expires': expireDate});
          $cookies.put('_userId', userId, {'expires': expireDate});
          return deferred.resolve(response.data);
        },
        function (error) {
          return deferred.reject({'status': error.status, 'message': 'Invalid username or password'});
        });
      return deferred.promise;
    };

    service.logIn = function (username, password) {
      var deferred = $q.defer(),
        config = {
          headers: {
            'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
            'X-Parse-REST-API-Key': PARSE_CREDENTIALS.REST_API_KEY
          },
          params: {
            'username': username,
            'password': password
          }
        };


      $http.get(PARSE_URLS.LOGIN, config)
        .then(function (response) {
          $log.debug('Logged In As:', response.data.username);
          var sessionToken = response.data.sessionToken,
            userId = response.data.objectId,
            expireDate = new Date();

            expireDate.setFullYear(expireDate.getFullYear() +1);

            $cookies.put('_sessionToken', sessionToken, {'expires': expireDate});
            $cookies.put('_userId', userId, {'expires': expireDate});
          return deferred.resolve(response.data);
        },
        function (error) {
          return deferred.reject({'status': error.status, 'message': 'Invalid username or password'});
        });
      return deferred.promise;
    };

    service.logOut = function () {
      var deferred = $q.defer(),
        sessionToken = $cookies.get('_sessionToken'),
        emptyData = {},
        headers = {
          headers: {
            'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
            'X-Parse-REST-API-Key': PARSE_CREDENTIALS.REST_API_KEY,
            'X-Parse-Session-Token': sessionToken
          }
        };
      $http.post(PARSE_URLS.LOGOUT, emptyData, headers)
        .then(function (response) {
          //$log.debug('Logged Out');
          $cookies.remove('_sessionToken');
          $cookies.remove('_userId');
          return deferred.resolve(response.data);
        }, function (error) {
          return deferred.reject({'status': error.status, 'message': 'An error occurred'});
        });
      return deferred.promise;
    };

    service.currentUser = function () {
      var deferred = $q.defer(),
        sessionToken = $cookies.get('_sessionToken');
      if (sessionToken !== undefined) {
        $http.get(PARSE_URLS.CURRENT_USER, {
          headers: {
            'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
            'X-Parse-REST-API-Key': PARSE_CREDENTIALS.REST_API_KEY,
            'X-Parse-Session-Token': sessionToken
          }
        }).then (function (response) {
          return deferred.resolve(response.data);
        }, function (error) {
          return deferred.reject({'status': error.status, 'message': 'An error occurred'});
        });
        return deferred.promise;
      }
      return false;
    };


    service.editUser = function (userId, data) {
      var deferred = $q.defer(),
        sessionToken = $cookies.get('_sessionToken'),
        config = {
          headers: {
            'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
            'X-Parse-REST-API-Key': PARSE_CREDENTIALS.REST_API_KEY,
            'X-Parse-Session-Token': sessionToken
          }
        };

      $http.put(PARSE_URLS.USERS + '/' + userId, data, config)
        .then(function (response) {
            return deferred.resolve(response.data);
          },
          function (error) {
            return deferred.reject({'status': error.status, 'message': 'Invalid username or password'});
          });
      return deferred.promise;
    };



    return service;
  }

})();
