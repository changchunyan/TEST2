'use strict';

/**
 * The permission service.
 *
 * @author ywu
 * @version 1.0
 */
angular.module('ywsApp').factory(
  'PermissionService', ['$http', '$q', 'config',
  function($http, $q, config) {

    var service = {};
    service.list = list;
    service.create = create;
    service.update = update;
    service.remove = remove;
    service.getPermissionsByFilter = getPermissionsByFilter;
    service.getPermissionTree = getPermissionTree;

    /**
     * Gets the list of permissions.
     * @return the promise
     */
    function list() {
      var deferred = $q.defer();
      $http.get(config.endpoints.admin.permission)
          .success(function(response, status, headers, config) {
            deferred.resolve(response);
          })
          .error(function(response, status, headers, config) {
            deferred.reject(response);
          }
      );
      return deferred.promise;
    }

    function getPermissionTree(){
      var deferred = $q.defer();
      $http.get(config.endpoints.admin.permission)
          .success(function(response, status, headers, config) {
            deferred.resolve(response);
          })
          .error(function(response, status, headers, config) {
            deferred.reject(response);
          }
      );
      return deferred.promise;
    }

    function getPermissionsByFilter(permission,start,number){
      var deferred = $q.defer();
      var temp = {} ;
      if(permission.name != undefined){
        temp.name = permission.name;
      }
      if(permission.displayName != undefined){
        temp.displayName = permission.displayName;
      }
      $http.get(config.endpoints.admin.permission + "/getPermissionsByFilter?permission="+ JSON.stringify(temp)
          + '&start=' + start + '&number=' + number)
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
     * Creates a permission.
     * @param permission the permission to create
     * @return the promise
     */
    function create(permission) {
      var deferred = $q.defer();
      $http.post(config.endpoints.admin.permission, permission)
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
     * Updates a permission.
     * @param permission the permission to update
     * @return the promise
     */
    function update(permission) {
      var deferred = $q.defer();
      $http.put(config.endpoints.admin.permission + '/' + permission.id, permission)
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
     * Deletes the permission.
     * @param permission the permission to delete
     */
    function remove(permission) {
      var deferred = $q.defer();
      $http.delete(config.endpoints.admin.permission + '/' + permission.id).success(function(response, status, headers, config) {
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
