'use strict';


angular.module('ywsApp').factory('BdApplicationService',  ['$http', '$q', 'config','$filter', '$timeout',function($http, $q, config, $filter, $timeout) {

    var service = {};
    
    service.save = save;
    service.detail = detail;

    function save(vo) {
        var deferred = $q.defer();
        $http.post(config.endpoints.bd.Application+'/save', vo)
            .success(function(response, status, headers, config) {
                deferred.resolve(response);
            })
            .error(function(response, status, headers, config) {
                deferred.reject(response.error);
            }
        );
        return deferred.promise;
    }

    function detail(id){
        var deferred = $q.defer();
        $http.get(config.endpoints.bd.Application + '/detail/' + id)
            .success(function(response, status, headers, config){
                deferred.resolve(response.data);
            })
            .error(function(response, status, headers, config){
                console.log('Failed to get Detail : ' + JSON.stringify(response));
                deferred.reject(response.error);
            }
        );
        return deferred.promise;
    }
    
    return service;
}
]);
