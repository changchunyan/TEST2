'use strict';

/**
 * The role service.
 *
 * @author ywu
 * @version 1.0
 */
angular.module('ywsApp').factory(
  'RoleService', ['$http', '$q', 'config',
  function($http, $q, config) {

    var service = {};
    service.list = list;
    service.create = create;
    service.update = update;
    service.remove = remove;
    service.getRolesByFilter = getRolesByFilter;
    service.checkExist = checkExist;

    function checkExist(role){
      var deferred = $q.defer();
      var temp = {} ;
      if(role.name != undefined){
        temp.name = role.name;
      }
      if(role.displayName != undefined){
        temp.displayName = role.displayName;
      }
      $http.get(config.endpoints.admin.role + "/checkExist?role="+ JSON.stringify(temp))
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
     * Gets the list of roles.
     * @return the promise
     */
    function list() {
      var deferred = $q.defer();
      $http.get(config.endpoints.admin.role)
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
     * Gets the list of roles by filters
     * @param role
     */
    function getRolesByFilter(role,start,number){
      var deferred = $q.defer();
      var temp = {} ;
      if(role.id != undefined){
        temp.id = role.id;
      }
      if(role.name != undefined){
        temp.name = role.name;
      }
      $http.get(config.endpoints.admin.role + "/getRolesByFilter?role="+ JSON.stringify(temp)
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
     * Creates a role.
     * @param role the role to create
     * @return the promise
     */
    function create(role) {
      var deferred = $q.defer();
      $http.post(config.endpoints.admin.role, role).success(function(response, status, headers, config) {
          deferred.resolve(response);
        })
        .error(function(response, status, headers, config) {
          deferred.reject(response);
        }
      );
      return deferred.promise;
    }

    /**
     * Updates a role.
     * @param role the role to update
     * @return the promise
     */
    function update(role) {
      var deferred = $q.defer();
      $http.put(config.endpoints.admin.role + '/' + role.id, role)
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
     * Deletes the role.
     * @param role the role to delete
     */
    function remove(role) {
      var deferred = $q.defer();
      $http.delete(config.endpoints.admin.role + '/' + role.id).success(function(response, status, headers, config) {
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
