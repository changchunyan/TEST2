'use strict';
angular.module('ywsApp').factory('VersionManagementService', ['$http', '$q', 'config',
        function($http, $q, config) {
            var service = {};

            service.getVersionListByFilter = getVersionListByFilter ;
            service.createVersion = createVersion;
            service.updateVersion = updateVersion;

            function getVersionListByFilter(start, number, params,filter) {
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

                $http.post(config.endpoints.admin.version + "/getVersionListByFilter",filter)
                    .success(function(response, status, headers, config) {
                        deferred.resolve({
                            data: response.data.list,
                            numberOfPages: response.data.pages,
                            totalSize:response.data.total
                        });
                    })
                    .error(function(response, status, headers, config) {
                            console.log('Failed to get contentList : ' + JSON.stringify(response));
                            deferred.reject(response.error);
                        }
                    );
                return deferred.promise;
            }

            function createVersion(data) {
                var deferred = $q.defer();

                $http.post(config.endpoints.admin.version + "/createVersion",data)
                    .success(function(response, status, headers, config) {
                        deferred.resolve({
                            data: response.data.list
                        });
                    })
                    .error(function(response, status, headers, config) {
                            console.log('Failed to get backlog : ' + JSON.stringify(response));
                            deferred.reject(response.error);
                        }
                    );
                return deferred.promise;
            }

            function updateVersion(data) {
                var deferred = $q.defer();

                $http.post(config.endpoints.admin.version + "/updateVersion",data)
                    .success(function(response, status, headers, config) {
                        deferred.resolve({
                            data: response.data.list
                        });
                    })
                    .error(function(response, status, headers, config) {
                            console.log('Failed to get backlog : ' + JSON.stringify(response));
                            deferred.reject(response.error);
                        }
                    );
                return deferred.promise;
            }


            return service;
        }
    ]
)
