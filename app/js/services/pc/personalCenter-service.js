'use strict';

/**
 * The personal center service.
 *
 * @author czq
 * @version 1.0
 */
angular.module('ywsApp').factory(
  'PersonalCenterService', ['$http', '$q', 'config',
  function($http, $q, config) {

	var service = {};
    service.getPackList = getPackList;
    service.deletePack = deletePack;
    
    /**
     * 删除
     */
    function deletePack(row){
    	var deferred = $q.defer();
    	$http.post(config.endpoints.personalCenter.personalCenter+'/deletePack',row).success(function(response, status, headers, config) {
            deferred.resolve(response);
        }).error(function(response, status, headers, config) {
                deferred.reject(response.error);
            }
        );
        return deferred.promise;
    }
    
    /**
     * Get the pesonal handouts list by filter.
     */
    function getPackList(start, number,params, filter) {
        var deferred = $q.defer();
        if(!params.search){
            params.search = {};
        }
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
        $http.post(config.endpoints.personalCenter.personalCenter+'/getPackList',filter).success(function(response, status, headers, config) {
            deferred.resolve({
                data: response.data.list,
                numberOfPages: response.data.pages
            });
        }).error(function(response, status, headers, config) {
                deferred.reject(response.error);
            }
        );
        return deferred.promise;
    }

    return service;
  }
]);
