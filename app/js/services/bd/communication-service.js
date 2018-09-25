'use strict';

angular.module('ywsApp').factory('BdCommunicationService',  ['$http', '$q', 'config','$filter', '$timeout',function($http, $q, config, $filter, $timeout) {

    var service = {};
    service.list = list;
    service.create = create;
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
        console.dir(params.search.predicateObject);
        $http.post(config.endpoints.bd.Communication+'/list',params.search.predicateObject).success(function(response, status, headers, config) {
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

    function create(vo) {
        var deferred = $q.defer();
        $http.post(config.endpoints.bd.Communication, vo).success(function(response, status, headers, config) {
            //console.log("Created : " + JSON.stringify(response));
            deferred.resolve(response.data);
        }).error(function(response, status, headers, config) {
                console.log('Failed to create Communication : ' + JSON.stringify(response));
                deferred.reject(response.error);
            }
        );
        return deferred.promise;
    }

    function update(vo) {
        var deferred = $q.defer();
        $http.put(config.endpoints.bd.Communication+'/'+vo.id, vo).success(function(response, status, headers, config) {
            //console.log("Updated : " + JSON.stringify(response));
            deferred.resolve(response.data);
        }).error(function(response, status, headers, config) {
                console.log('Failed to update Communication : ' + JSON.stringify(response));
                deferred.reject(response.update);
            }
        );
        return deferred.promise;
    }

    function remove(vo) {
        var deferred = $q.defer();
        $http.delete(config.endpoints.bd.Communication+'/'+vo.id).success(function(response, status, headers, config) {
            //console.log("Deleted : " + JSON.stringify(response));
            deferred.resolve(response.data);
        }).error(function(response, status, headers, config) {
                console.log('Failed to delete Communication : ' + JSON.stringify(response));
                deferred.reject(response.error);
            }
        );
        return deferred.promise;
    }

    return service;
  }
]);
