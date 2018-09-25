'use strict';

angular.module('ywsApp').factory(
    'SupplementCourseManagementService', ['$http', '$q',
        function($http, $q) {

            var service = {};

            service.list = list;
            service.one = one;
            service.save = save;

            function list(start, number,params, filter) {
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
                $http.post(config.endpoints.sos.crmStudentCourseAttendenceSupplement+"/querySupplementList",filter)
                    .success(function(response, status, headers, config) {
                        deferred.resolve({
                            data: response.data.list,
                            numberOfPages: response.data.pages
                        });
                    })
                    .error(function(response, status, headers, config) {
                        deferred.reject(response);
                    }
                );
                return deferred.promise;
            }

            function save(filter){
                var deferred = $q.defer();
                $http.post(config.endpoints.sos.crmStudentCourseAttendenceSupplement+"/updateSupplementCourse",filter)
                    .success(function(response, status, headers, config) {
                        deferred.resolve(response);
                    })
                    .error(function(response, status, headers, config) {
                        deferred.reject(response);
                    }
                );
                return deferred.promise;
            }

            function one(filter) {
                var deferred = $q.defer();
                filter.pageNum = 1;
                filter.pageSize = 10;
                $http.post(config.endpoints.sos.crmStudentCourseAttendenceSupplement+"/querySupplementList",filter)
                    .success(function(response, status, headers, config) {
                        deferred.resolve({
                            data: response.data.list,
                        });
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
