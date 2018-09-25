'use strict';

/**
 * The user service.
 *
 * @author JeanZhang
 * @version 1.0
 */
angular.module('ywsApp').factory(
  'UserService', ['$http', '$q', 'config',
  function($http, $q, config) {

    var service = {};
    service.get = get;

    /**
     * Gets the list of permissions.
     * @return the promise
     */
    function get(userId) {
      var deferred = $q.defer();
      $http.get(config.endpoints.admin.user + '/' + userId)
          .success(function(response, status, headers, config) {
            deferred.resolve(response);
          })
          .error(function(response, status, headers, config) {
            deferred.reject(response);
          }
      );
      return deferred.promise;
    }

    return service;
  }
]);
