'use strict';


angular.module('ywsApp').factory('BdRemindService',  ['$http', '$q', 'config','$filter', '$timeout',function($http, $q, config, $filter, $timeout) {

    var service = {};

    service.list= list;
    service.create = create;
    service.create2 = create2;
    service.update = update;
    service.remove = remove;
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
        $http.post(config.endpoints.bd.Remind+'/list',params.search.predicateObject).success(function(response, status, headers, config) {
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

    function create(vo) {
        var deferred = $q.defer();
        $http.post(config.endpoints.bd.Remind, vo).success(function(response, status, headers, config) {
            //console.log("Created : " + JSON.stringify(response));
            deferred.resolve(response.data);
        }).error(function(response, status, headers, config) {
                console.log('Failed to create InvitationRemind : ' + JSON.stringify(response));
                deferred.reject(response.error);
            }
        );
        return deferred.promise;
    }

    function create2(vo) {
        var deferred = $q.defer();
        $http.post(config.endpoints.bd.Remind, vo).success(function(response, status, headers, config) {
            deferred.resolve(response);
        }).error(function(response, status, headers, config) {
              console.log('Failed to create InvitationRemind : ' + JSON.stringify(response));
              deferred.reject(response.error);
          }
        );
        return deferred.promise;
    }

    function update(vo) {
        var deferred = $q.defer();
        $http.put(config.endpoints.bd.Remind+'/'+vo.id, vo).success(function(response, status, headers, config) {
            //console.log("Updated : " + JSON.stringify(response));
            deferred.resolve(response.data);
        }).error(function(response, status, headers, config) {
                console.log('Failed to update InvitationRemind : ' + JSON.stringify(response));
                deferred.reject(response.update);
            }
        );
        return deferred.promise;
    }

    function remove(vo) {
        var deferred = $q.defer();
        $http.delete(config.endpoints.bd.Remind+'/'+vo.id).success(function(response, status, headers, config) {
            //console.log("Deleted : " + JSON.stringify(response));
            deferred.resolve(response.data);
        }).error(function(response, status, headers, config) {
                console.log('Failed to delete InvitationRemind : ' + JSON.stringify(response));
                deferred.reject(response.error);
            }
        );
        return deferred.promise;
    }

    return service;
  }
]);
