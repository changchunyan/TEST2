/**
 * The position service.
 *
 * @author ywu
 * @version 1.0
 */
angular.module('ywsApp').factory(
  'PositionService', ['$http', '$q', 'config',
  function($http, $q, config) {
    var service = {};
    service.list = list;
    service.add = add;
    service.remove = remove;
    service.edit = edit;

    /**
     * Gets the list of positions.
     * @return the promise
     */
    function list(departmentId) {
      var deferred = $q.defer();
      $http.get(config.endpoints.hr.position + '?department=' + departmentId)
        .success(function(response, status, headers, config) {
            deferred.resolve(response);
        })
        .error(function(response, status, headers, config) {
          deferred.reject(response);
        }
      );
      return deferred.promise;
    }

    /**
     * Adds position.
     * @param position the position
     * @return the promise
     */
    function add(position) {
      var deferred = $q.defer();

      $http.post(config.endpoints.hr.position, position)
        .success(function(response, status, headers, config) {
          deferred.resolve(response);
        })
        .error(function(response, status, headers, config) {
          deferred.reject(response);
        }
      );
      return deferred.promise;
    }

    /**
     * Removes position.
     * @param position the position
     * @return the promise
     */
    function remove(position) {
      var deferred = $q.defer();
      $http.delete(config.endpoints.hr.position + '/' + position.id)
        .success(function(response, status, headers, config) {
          deferred.resolve(response);
        })
        .error(function(response, status, headers, config) {
          deferred.reject(response);
        }
      );
      return deferred.promise;
    }

    /**
     * Edits position.
     * @param position the position
     * @return the promise
     */
    function edit(position) {
      var deferred = $q.defer();
      $http.put(config.endpoints.hr.position + '/' + position.id, position)
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
