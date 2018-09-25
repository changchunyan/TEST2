'use strict';

/**
 * 招商Leads service层
 * @author philliu@youwinedu.com
 * @version 1.0
 */
angular.module('ywsApp').factory('BdInvitationService',  ['$http', '$q', 'config','$filter', '$timeout',function($http, $q, config, $filter, $timeout) {

    var service = {};

    service.list = list;
    service.create = create;
    service.update = update;
    service.remove = remove;
    service.visit = visit;
    service.unvisit = unvisit;
    function list(start, number, params, filter) {
        var deferred = $q.defer();

        if(!params.search.predicateObject){
            params.search.predicateObject = {};
            params.search.predicateObject.pageNum = start/number+1;
            params.search.predicateObject.pageSize = number;
        }else{
            params.search.predicateObject.pageNum = start/number+1;
            params.search.predicateObject.pageSize = number;
        }
        filter.pageNum = params.search.predicateObject.pageNum;
        filter.pageSize = params.search.predicateObject.pageSize;
        $http.post(config.endpoints.bd.Invitation+'/list',filter).success(function(response, status, headers, config) {
            deferred.resolve({
                data: response.data.list,
                numberOfPages: response.data.pages
            });
        }).error(function(response, status, headers, config) {
                console.log('Failed to get InvitationDetail : ' + JSON.stringify(response));
                deferred.reject(response.error);
            }
        );
        return deferred.promise;
    }

    function create(vo) {
        var deferred = $q.defer();
        $http.post(config.endpoints.bd.Invitation, vo).success(function(response, status, headers, config) {
            //console.log("Created : " + JSON.stringify(response));
            deferred.resolve(response.data);
        }).error(function(response, status, headers, config) {
                console.log('Failed to create Invitation : ' + JSON.stringify(response));
                deferred.reject(response.error);
            }
        );
        return deferred.promise;
    }

    function update(vo) {
        var deferred = $q.defer();
        $http.put(config.endpoints.bd.Invitation+'/'+vo.id, vo).success(function(response, status, headers, config) {
            //console.log("Updated : " + JSON.stringify(response));
            deferred.resolve(response.data);
        }).error(function(response, status, headers, config) {
                console.log('Failed to update Invitation : ' + JSON.stringify(response));
                deferred.reject(response.update);
            }
        );
        return deferred.promise;
    }

    function remove(vo) {
        var deferred = $q.defer();
        $http.delete(config.endpoints.bd.Invitation+'/'+vo.id).success(function(response, status, headers, config) {
            //console.log("Deleted : " + JSON.stringify(response));
            deferred.resolve(response.data);
        }).error(function(response, status, headers, config) {
                console.log('Failed to delete Invitation : ' + JSON.stringify(response));
                deferred.reject(response.error);
            }
        );
        return deferred.promise;
    }

    function visit(vo) {
        var deferred = $q.defer();
        $http.put(config.endpoints.bd.Invitation+'/'+vo.id+"/visited", vo).success(function(response, status, headers, config) {
            //console.log("Deleted : " + JSON.stringify(response));
            deferred.resolve(response);
        }).error(function(response, status, headers, config) {
                console.log('Failed to visit Invitation : ' + JSON.stringify(response));
                deferred.reject(response);
            }
        );
        return deferred.promise;
    }

    function unvisit(vo) {
        var deferred = $q.defer();
        $http.put(config.endpoints.bd.Invitation+'/'+vo.id+"/unvisited", vo).success(function(response, status, headers, config) {
            //console.log("Deleted : " + JSON.stringify(response));
            deferred.resolve(response);
        }).error(function(response, status, headers, config) {
              console.log('Failed to unvisit Invitation : ' + JSON.stringify(response));
              deferred.reject(response);
          }
        );
        return deferred.promise;
    }

    return service;
  }
]);
