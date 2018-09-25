'use strict';

/**
 * The InvitationRemind  service.
 *
 * @author wangzhihang@youwinedu.com
 * @version 1.0
 */

angular.module('ywsApp').factory('InvitationRemindService',  ['$http', '$q', 'config','$filter', '$timeout',function($http, $q, config, $filter, $timeout) {

    var service = {};
    service.list = list;
    service.create = create;
    service.update = update;
    service.remove = remove;

    /**
     * Gets the list of InvitationRemind.
     * @return the InvitationRemind
     */
    function list(start, number, params) {
      var deferred = $q.defer();
      
      if(!params.search.predicateObject){
          params.search.predicateObject = {};
          params.search.predicateObject.pageNum = start/number+1;
          params.search.predicateObject.pageSize = number;
      }else{
          params.search.predicateObject.pageNum = start/number+1;
          params.search.predicateObject.pageSize = number;
      }
      $http.post(config.endpoints.sos.InvitationRemind+'/list',params.search.predicateObject).success(function(response, status, headers, config) {
        deferred.resolve({
          data: response.data.list,
          numberOfPages: response.data.pages
        });
      }).error(function(response, status, headers, config) {
            console.log('Failed to get InvitationRemind : ' + JSON.stringify(response));
            deferred.reject(response.error);
          }
      );
      return deferred.promise;
    }

    /**
     * Creates a InvitationRemind.
     * @param InvitationRemind to create
     * @return the InvitationRemind
     */
    function create(CrmInvitationRemindVo) {
      var deferred = $q.defer();
      $http.post(config.endpoints.sos.InvitationRemind, CrmInvitationRemindVo).success(function(response, status, headers, config) {
          //console.log("Created : " + JSON.stringify(response));
          deferred.resolve(response.data);
        })
        .error(function(response, status, headers, config) {
          console.log('Failed to create InvitationRemind : ' + JSON.stringify(response));
          deferred.reject(response.error);
        }
      );
      return deferred.promise;
    }

    /**
     * Updates a InvitationRemind.
     * @param InvitationRemind the InvitationRemind to update
     * @return the promise
     */
    function update(CrmInvitationRemindVo) {
      var deferred = $q.defer();
      $http.put(config.endpoints.sos.InvitationRemind + '/' + CrmInvitationRemindVo.id, CrmInvitationRemindVo).success(function(response, status, headers, config) {
          //console.log("Updated : " + JSON.stringify(response));
          deferred.resolve(response.data);
        })
        .error(function(response, status, headers, config) {
          console.log('Failed to update InvitationRemind : ' + JSON.stringify(response));
          deferred.reject(response.update);
        }
      );
      return deferred.promise;
    }

    /**
     * Deletes the InvitationRemind.
     * @param InvitationRemind the InvitationRemind to delete
     */
    function remove(CrmInvitationRemindVo) {
      var deferred = $q.defer();
      $http.delete(config.endpoints.sos.InvitationRemind + '/' + CrmInvitationRemindVo.id).success(function(response, status, headers, config) {
          //console.log("Deleted : " + JSON.stringify(response));
          deferred.resolve(response.data);
        })
        .error(function(response, status, headers, config) {
          console.log('Failed to delete InvitationRemind : ' + JSON.stringify(response));
          deferred.reject(response.error);
        }
      );
      return deferred.promise;
    }

    return service;
  }
]);
