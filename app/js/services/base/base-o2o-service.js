/**
 * Created by 毅 on 2015/11/27.
 */
angular.module('ywsApp').factory('BaseO2oService', ['$http', '$q', 'config',
    function($http, $q, config) {
        var oThis = this;
        var service = {};

        service.getTeacherByFilters = getTeacherByFilters;
        service.getOrderListService = getOrderListService;
        service.getOrderListServiceByStudentId = getOrderListServiceByStudentId;
        service.getO2oStudentCoursesService = getO2oStudentCoursesService;

        oThis.getHttp = getHttp;
        oThis.getHttp2 = getHttp2;
        oThis.postHttp = postHttp;
        oThis.putHttp = putHttp;
        oThis.deleteHttp = deleteHttp;

        function getTeacherByFilters(start, number, params,filter) {
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
            var url = config.endpoints.hr.employee + "/getEmployeesByFilters?employee=" + JSON.stringify(filter)
                + '&start=' + start + '&number=' + number;
            //var url ='partials/o2o/testDate/orderList.json';
            //$http.get(config.endpoints.hr.employee + "/getEmployeesByFilters?employee=" + JSON.stringify(temp)
            //    + '&start=' + start + '&number=' + number)
            return oThis.getHttp(url);
            /*$http.post(config.endpoints.sos.LeadsStudent+'/schoolListAll',filter).success(function(response, status, headers, config) {
             deferred.resolve({
             data: response.data.list,
             numberOfPages: response.data.pages
             });
             }).error(function(response, status, headers, config) {
             console.log('Failed to get schoolLeadsStudent : ' + JSON.stringify(response));
             deferred.reject(response.error);
             }
             );
             return deferred.promise;*/
        }
        function getOrderListService(start, number,orderFlag,filter){
            if(!filter){
                filter={};
            }
            var url = config.endpoints.o2o.orders+ '?start=' + start+'&number='+number+'&params='+JSON.stringify(filter);
            //var url ='partials/o2o/testDate/orderList.json';
            return oThis.getHttp(url);
        }
        function getOrderListServiceByStudentId(id,start, number,orderFlag,filter){
            if(!filter){
                filter={};
            }
            var url = config.endpoints.o2o.orders+ '?start=' + start+'&number='+number+'&id='+id+'&params='+JSON.stringify(filter);
            //var url ='partials/o2o/testDate/orderList.json';
            return oThis.getHttp(url);
        }
        function getO2oStudentCoursesService(start, number, params){
            var deferred = $q.defer();

            if(!params.search.predicateObject){
                params.search.predicateObject = {};
                params.search.predicateObject.pageNum = start/number+1;
                params.search.predicateObject.pageSize = number;
            }else{
                params.search.predicateObject.pageNum = start/number+1;
                params.search.predicateObject.pageSize = number;
            }
            $http.post(config.endpoints.sos.course_plan+'/O2OCoursePlanlist',params.search.predicateObject).success(function(response, status, headers, config) {
                deferred.resolve({
                    data: response.data.list,
                    numberOfPages: response.data.pages
                });
            }).error(function(response, status, headers, config) {
                    console.log('Failed to get CoursePlan : ' + JSON.stringify(response));
                    deferred.reject(response.error);
                }
            );
            return deferred.promise;
        }
        //--------------------------------------------------util----------------------------------------------
        function getHttp(url){
            var deferred = $q.defer();
            $http.get(url)
                .success(function(response, status, headers, config) {
                    deferred.resolve({
                        data: response.data.list,
                        numberOfPages: response.data.pages
                    });
                })
                .error(function(response, status, headers, config) {
                    console.log('Failed to get orders : ' + JSON.stringify(response));
                    deferred.reject(response.error);
                }
            );
            return deferred.promise;
        }
        function getHttp2(url){
            var deferred = $q.defer();
            $http.get(url)
                .success(function(response, status, headers, config) {
                    deferred.resolve({
                        data: response.data,
                        numberOfPages: response.data.pages
                    });
                })
                .error(function(response, status, headers, config) {
                    console.log('Failed to get orders : ' + JSON.stringify(response));
                    deferred.reject(response.error);
                }
            );
            return deferred.promise;
        }
        function postHttp(url,obj){
            var deferred = $q.defer();
            $http.post(url,obj)
                .success(function(response, status, headers, config) {
                    deferred.resolve({
                        data: status
                    });
                })
                .error(function(response, status, headers, config) {
                    console.log('Failed to get orders : ' + JSON.stringify(response));
                    deferred.reject(response.error);
                }
            );
            return deferred.promise;
        }
        function putHttp(url,obj){
            var deferred = $q.defer();
            $http.put(url,obj)
                .success(function(response, status, headers, config) {
                    deferred.resolve({
                        data: status
                    });
                })
                .error(function(response, status, headers, config) {
                    console.log('Failed to get orders : ' + JSON.stringify(response));
                    deferred.reject(response.error);
                }
            );
            return deferred.promise;
        }

        function deleteHttp(url){
            var deferred = $q.defer();
            $http.delete(url)
                .success(function(response, status, headers, config) {
                    deferred.resolve({
                        data: status
                    });
                })
                .error(function(response, status, headers, config) {
                    console.log('Failed to get orders : ' + JSON.stringify(response));
                    deferred.reject(response.error);
                }
            );
            return deferred.promise;
        }

        return service;
    }

]);