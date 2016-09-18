(function () {
  'use strict';

  angular.module('common.services.api')
    .factory('parseApi', parseApi);


  function parseApi($http, PARSE_CREDENTIALS, PARSE_URLS, $cookies) {
    var service = {};

    /**                                *
     *                                 *
     *             GETTERS             *
     *                                 *
     *                                 *
     *                                 */

    service.getAll = function (chosenClass, limit, skip) {
      limit = (typeof limit === 'undefined') ? 10 : limit;
      skip = (typeof skip === 'undefined') ? 0 : skip;
      return $http.get(PARSE_URLS.CLASSES + chosenClass, {
        headers:{
          'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
          'X-Parse-REST-API-Key': PARSE_CREDENTIALS.REST_API_KEY
        },
        params:{
          limit: limit,
          skip: skip,
          order: '-createdAt',
          count: 1
        }
      });
    };

    service.get = function (chosenClass, id) {
      return $http.get(PARSE_URLS.CLASSES + chosenClass + '/' + id, {
        headers:{
          'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
          'X-Parse-REST-API-Key': PARSE_CREDENTIALS.REST_API_KEY
        }
      });
    };

    service.getWhereUser = function (chosenClass, userId, limit, skip) {
      limit = (typeof limit === 'undefined') ? 10 : limit;
      skip = (typeof skip === 'undefined') ? 0 : skip;
      return $http.get(PARSE_URLS.CLASSES + chosenClass, {
        headers:{
          'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
          'X-Parse-REST-API-Key': PARSE_CREDENTIALS.REST_API_KEY
        },
        params:{
          where: {'user':{'__type':'Pointer', 'className':'_User', 'objectId':userId}},
          limit: limit,
          skip: skip,
          order: '-createdAt',
          count: 1
        }
      });
    };

    service.getWherePost = function (postId, limit, skip) {
      limit = (typeof limit === 'undefined') ? 10 : limit;
      skip = (typeof skip === 'undefined') ? 0 : skip;
      return $http.get(PARSE_URLS.CLASSES + 'PostComments', {
        headers:{
          'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
          'X-Parse-REST-API-Key': PARSE_CREDENTIALS.REST_API_KEY
        },
        params:{
          where: {'post':{'__type':'Pointer', 'className':'Posts', 'objectId':postId}},
          limit: limit,
          skip: skip,
          count: 1
        }
      });
    };

    service.getMessages = function (userId, limit, skip) {
      limit = (typeof limit === 'undefined') ? 10 : limit;
      skip = (typeof skip === 'undefined') ? 0 : skip;
      return $http.get(PARSE_URLS.CLASSES + 'Messaging', {
        headers:{
          'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
          'X-Parse-REST-API-Key': PARSE_CREDENTIALS.REST_API_KEY
        },
        params:{
          where: {'$or':[{'user1':{'__type':'Pointer', 'className':'_User', 'objectId':userId}},
            {'user2':{'__type':'Pointer', 'className':'_User', 'objectId':userId}}]},
          limit: limit,
          skip: skip,
          count: 1
        }
      });
    };

    service.getMessagesBetween = function(messageId, limit, skip) {
      limit = (typeof limit === 'undefined') ? 10 : limit;
      skip = (typeof skip === 'undefined') ? 0 : skip;
      return $http.get(PARSE_URLS.CLASSES + 'Messaging/' + messageId , {
        headers:{
          'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
          'X-Parse-REST-API-Key': PARSE_CREDENTIALS.REST_API_KEY
        },
        params:{
          limit: limit,
          skip: skip,
          count: 1
        }
      });
    };

    service.getMessagesFrom = function (messageId, limit, skip) {
      limit = (typeof limit === 'undefined') ? 10 : limit;
      skip = (typeof skip === 'undefined') ? 0 : skip;
      return $http.get(PARSE_URLS.CLASSES + 'Messages', {
        headers:{
          'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
          'X-Parse-REST-API-Key': PARSE_CREDENTIALS.REST_API_KEY
        },
        params:{
          where: {'message':{'__type':'Pointer', 'className':'Messaging', 'objectId':messageId}},
          limit: limit,
          skip: skip,
          count: 1,
          order: '-createdAt'
        }
      });
    };

    service.getUser = function (id) {
      return $http.get(PARSE_URLS.CLASSES + '_User' + '/' + id, {
        headers: {
          'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
          'X-Parse-REST-API-Key': PARSE_CREDENTIALS.REST_API_KEY
        }
      });
    };

    service.getFollowing = function (id) {
      return $http.get(PARSE_URLS.CLASSES + 'Following', {
        headers: {
          'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
          'X-Parse-REST-API-Key': PARSE_CREDENTIALS.REST_API_KEY
        },
        params: {
          where: {'user' : {'__type':'Pointer', 'className':'_User', 'objectId':id}},
          count: 1
        }
      });
    };

    service.follows = function(userId, followId){
      return $http.get(PARSE_URLS.CLASSES + 'Following', {
        headers: {
          'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
          'X-Parse-REST-API-Key': PARSE_CREDENTIALS.REST_API_KEY
        },
        params: {
          where: {'user' : {'__type':'Pointer', 'className':'_User', 'objectId':userId},
            'follows' : {'__type':'Pointer', 'className':'_User', 'objectId':followId}}
        }
      });
    };

    service.getFollowers = function (id) {
      return $http.get(PARSE_URLS.CLASSES + 'Following', {
        headers: {
          'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
          'X-Parse-REST-API-Key': PARSE_CREDENTIALS.REST_API_KEY
        },
        params: {
          where: {'follows' : {'__type':'Pointer', 'className':'_User', 'objectId':id}},
          count: 1
        }
      });
    };

    /**                                *
     *                                 *
     *             SETTERS             *
     *                                 *
     *                                 *
     *                                 */

    service.create = function (chosenClass, data) {
      return $http.post(PARSE_URLS.CLASSES + chosenClass, data, {
        headers:{
          'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
          'X-Parse-REST-API-Key': PARSE_CREDENTIALS.REST_API_KEY,
          'Content-Type':'application/json'
        }
      });
    };

    service.uploadFile = function(files){
      return $http.post(PARSE_URLS.FILES + '/' + files[0].name, files[0], {
        withCredentials: false,
        headers: {
          'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
          'X-Parse-REST-API-Key': PARSE_CREDENTIALS.REST_API_KEY,
          'Content-Type': 'audio/*'
        },
        transformRequest: angular.identity
      });
    };
    

    service.follow = function (userId, followId) {

        return $http.post(PARSE_URLS.CLASSES + 'Following',
          {
            'user': {'__type': 'Pointer', 'className': '_User', 'objectId': userId},
            'follows': {'__type': 'Pointer', 'className': '_User', 'objectId': followId}
          }, {
            headers: {
              'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
              'X-Parse-REST-API-Key': PARSE_CREDENTIALS.REST_API_KEY,
              'Content-Type': 'application/json'
            }
          });
    };

    service.edit = function (chosenClass, id, data) {
      return $http.put(PARSE_URLS.CLASSES + chosenClass + '/' + id, data, {
        headers:{
          'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
          'X-Parse-REST-API-Key': PARSE_CREDENTIALS.REST_API_KEY,
          'Content-Type':'application/json'
        }
      });
    };

    service.remove = function (chosenClass, id) {
      return $http.delete(PARSE_URLS.CLASSES + chosenClass + '/' + id, {
        headers:{
          'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
          'X-Parse-REST-API-Key': PARSE_CREDENTIALS.REST_API_KEY,
          'Content-Type':'application/json'
        }
      });
    };
    

    return service;
  }

})();

