'use strict';

/**
 * The InvitationCommunication  service.
 *
 * @author wangzhihang@youwinedu.com
 * @version 1.0
 */

angular.module('ywsApp').factory('InvitationCommunicationService',  ['$http', '$q', 'config','$filter', '$timeout',function($http, $q, config, $filter, $timeout) {

    var service = {};
    service.list = list;
    service.create = create;
    service.update = update;
    service.remove = remove;
    service.CallSave = CallSave;

    /**
     * Gets the list of InvitationCommunication.
     * @return the InvitationCommunication
     */
    function list(start, number, params,filter) {
      var deferred = $q.defer();

      if(!params.search.predicateObject){
          params.search.predicateObject = {};
          params.search.predicateObject.pageNum = start/number+1;
          params.search.predicateObject.pageSize = number;
      }else{
          params.search.predicateObject.pageNum = start/number+1;
          params.search.predicateObject.pageSize = number;
      }
      $http.post(config.endpoints.sos.InvitationCommunication+'/list',params.search.predicateObject).success(function(response, status, headers, config) {
        deferred.resolve({
          data: response.data.list,
          numberOfPages: response.data.pages
        });
      }).error(function(response, status, headers, config) {
            console.log('Failed to get InvitationCommunication : ' + JSON.stringify(response));
            deferred.reject(response.error);
          }
      );
      return deferred.promise;
    }

    /**
     * Creates a InvitationCommunication.
     * @param InvitationCommunication to create
     * @return the InvitationCommunication
     */
    function create(CrmInvitationCommunicationVo) {
      var deferred = $q.defer();
      $http.post(config.endpoints.sos.InvitationCommunication, CrmInvitationCommunicationVo).success(function(response, status, headers, config) {
          //console.log("Created : " + JSON.stringify(response));
          deferred.resolve(response.data);
        })
        .error(function(response, status, headers, config) {
          console.log('Failed to create InvitationCommunication : ' + JSON.stringify(response));
          deferred.reject(response.error);
        }
      );
      return deferred.promise;
    }
    /**
     * Creates a InvitationCommunication.
     * @param InvitationCommunication to create
     * @return the InvitationCommunication
     */
    function CallSave(CrmInvitationCommunicationVo) {
      var deferred = $q.defer();
      $http.post(config.endpoints.sos.InvitationCommunication+'/CallSave', CrmInvitationCommunicationVo).success(function(response, status, headers, config) {
          //console.log("Created : " + JSON.stringify(response));
          deferred.resolve(response.data);
        })
        .error(function(response, status, headers, config) {
          console.log('Failed to create InvitationCommunication : ' + JSON.stringify(response));
          deferred.reject(response.error);
        }
      );
      return deferred.promise;
    }

    /**
     * Updates a InvitationCommunication.
     * @param InvitationCommunication the InvitationCommunication to update
     * @return the promise
     */
    function update(CrmInvitationCommunicationVo) {
      var deferred = $q.defer();
      $http.put(config.endpoints.sos.InvitationCommunication + '/' + CrmInvitationCommunicationVo.id, CrmInvitationCommunicationVo).success(function(response, status, headers, config) {
          //console.log("Updated : " + JSON.stringify(response));
          deferred.resolve(response.data);
        })
        .error(function(response, status, headers, config) {
          //console.log('Failed to update InvitationCommunication : ' + JSON.stringify(response));
          deferred.reject(response.update);
        }
      );
      return deferred.promise;
    }

    /**
     * Deletes the InvitationCommunication.
     * @param InvitationCommunication the InvitationCommunication to delete
     */
    function remove(CrmInvitationCommunicationVo) {
      var deferred = $q.defer();
      $http.delete(config.endpoints.sos.InvitationCommunication + '/' + CrmInvitationCommunicationVo.id).success(function(response, status, headers, config) {
          //console.log("Deleted : " + JSON.stringify(response));
          deferred.resolve(response.data);
        })
        .error(function(response, status, headers, config) {
          console.log('Failed to delete InvitationCommunication : ' + JSON.stringify(response));
          deferred.reject(response.error);
        }
      );
      return deferred.promise;
    }

    return service;
  }
]);
