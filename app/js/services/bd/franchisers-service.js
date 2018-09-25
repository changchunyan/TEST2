'use strict';


angular.module('ywsApp').factory('BdFranchisersService',  ['$http', '$q', 'config','$filter', '$timeout',function($http, $q, config, $filter, $timeout) {

    var service = {};
    service.list = list;
    service.getDictionary = getDictionary;
    service.detail = detail;
    service.approve = approve;
    service.reject = reject;
    service.invalid = invalid;
    service.save = save;

    function list(start, number, params,filter) {
      var deferred = $q.defer();
      //console.dir(params.search.predicateObject);
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
      $http.post(config.endpoints.bd.Franchiser+'/list',filter).success(function(response, status, headers, config) {
        deferred.resolve({
          data: response.data.list,
          numberOfPages: response.data.pages
        });
      }).error(function(response, status, headers, config) {
            console.log('Failed to get Franchiser : ' + JSON.stringify(response));
            deferred.reject(response.error);
          }
      );
      return deferred.promise;
    }


    function getDictionary(type, key) {
        var url = config.endpoints.bd.Common + "/";
        if(type == "FranchiseType") {
            url += "getAllFranchiseTypes";
        } else if(type == "StockPartnership") {
            url += "getAllStockPartnerships";
        } else if(type == "PostponeTime") {
            url += "getAllPostponeTimes";
        } else if(type == "CityLevel") {
            url += "getAllCityLevels";
        } else if(type == "CctvPeriod") {
            url += "getAllCctvPeriods";
        } else if(type == "ContractStatus") {
            url += "getAllContractStatuses";
        } else if(type == "ProjectDetail") {
            url += "getAllProjectDetails/" + key;
        } else if(type == "FranchiseJoinForm") {
            url += "getAllFranchiseJoinForms";
        }
        var deferred = $q.defer();
        $http.get(url)
            .success(function(response, status, headers, config) {
                deferred.resolve({
                    data: response.data
                });
            })
            .error(function(response, status, headers, config) {
                deferred.reject(response.error);
            }
        );
        return deferred.promise;
    }
/*
    function save(vo) {
        var deferred = $q.defer();
        $http.post(config.endpoints.bd.Franchiser+'/save', BdLeadsVo)
            .success(function(response, status, headers, config) {
                deferred.resolve(response);
            })
            .error(function(response, status, headers, config) {
                deferred.reject(response.error);
            }
        );
        return deferred.promise;
    }
*/
    function detail(id){
        var deferred = $q.defer();
        $http.get(config.endpoints.bd.Franchiser + '/detail/' + id)
            .success(function(response, status, headers, config){
                deferred.resolve(response.data);
            })
            .error(function(response, status, headers, config){
                console.log('Failed to get Detail : ' + JSON.stringify(response));
                deferred.reject(response.error);
            })
        return deferred.promise;
    }

    function approve(id) {
        var deferred = $q.defer();
        $http.put(config.endpoints.bd.Franchiser + '/approve/' + id, {})
            .success(function(response, status, headers, config){
                deferred.resolve(response.data);
            })
            .error(function(response, status, headers, config){
                deferred.reject(response.error);
            })
        return deferred.promise;
    }

    function reject(id) {
        var deferred = $q.defer();
        $http.put(config.endpoints.bd.Franchiser + '/reject/' + id, {})
            .success(function(response, status, headers, config){
                deferred.resolve(response.data);
            })
            .error(function(response, status, headers, config){
                deferred.reject(response.error);
            })
        return deferred.promise;
    }

    function invalid(id) {
        var deferred = $q.defer();
        $http.put(config.endpoints.bd.Franchiser + '/invalid/' + id)
            .success(function(response, status, headers, config){
                deferred.resolve(response.data);
            })
            .error(function(response, status, headers, config){
                deferred.reject(response.error);
            })
        return deferred.promise;
    }

    function save(vo) {
        var deferred = $q.defer();
        $http.post(config.endpoints.bd.Franchiser+'/save', vo)
            .success(function(response, status, headers, config) {
                deferred.resolve(response);
            })
            .error(function(response, status, headers, config) {
                deferred.reject(response.error);
            }
        );
        return deferred.promise;
    }

    return service;
  }
]);
