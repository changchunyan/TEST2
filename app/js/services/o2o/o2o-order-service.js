angular.module('ywsApp').factory('O2oOrderManagementService', ['$http', '$q', 'config',function($http, $q, config) {
    var oThis = this;
    var service = {};
    service.getOrderListService = getOrderListService;
    service.getCouponsListService = getCouponsListService;
    service.addOrderService = addOrderService;
    service.updateOrderService = updateOrderService;
    service.deleteOrderService = deleteOrderService;
    service.addMembershipCardOrderService = addMembershipCardOrderService;
    service.updateMembershipCardOrderService = updateMembershipCardOrderService;
    service.deleteMembershipCardOrderService = deleteMembershipCardOrderService;
    service.getOrderCoursesService = getOrderCoursesService;

    service.getCoursesTypeByTeacherId = getCoursesTypeByTeacherId;
    service.getCoursesByTeacherId = getCoursesByTeacherId;
    service.updateCoursePlanStateService = updateCoursePlanStateService;//更新订单课程状态

    oThis.getHttp = getHttp;
    oThis.getHttp2 = getHttp2;
    oThis.postHttp = postHttp;
    oThis.putHttp = putHttp;
    oThis.deleteHttp = deleteHttp;


    function getOrderListService(start, number,filter){
        if(!filter){
            filter={};
        }
        var url = config.endpoints.o2o.orders+ '?start=' + start+'&number='+number+'&params='+JSON.stringify(filter);
        //var url ='partials/o2o/testDate/orderList.json';
        return oThis.getHttp(url);
    }
    function getCouponsListService(start, number,filter){
        if(!filter){
            filter={};
        }
        var url = config.endpoints.o2o.orderMembershipCard+ '?start=' + start+'&number='+number+'&params='+JSON.stringify(filter);
        return oThis.getHttp(url);
    }
    function addOrderService(obj){
        var url = config.endpoints.o2o.orders;
        return oThis.postHttp(url,obj);
    }
    function updateOrderService(obj){
        var url = config.endpoints.o2o.orders;
        return oThis.putHttp(url,obj);
    }
    function deleteOrderService(obj){
        var url = config.endpoints.o2o.orders+'/'+obj.id;
        return oThis.deleteHttp(url);
    }

    function addMembershipCardOrderService(obj){
        var url = config.endpoints.o2o.orderMembershipCard;
        return oThis.postHttp(url,obj);
    }
    function updateMembershipCardOrderService(obj){
        var url = config.endpoints.o2o.orderMembershipCard;
        return oThis.putHttp(url,obj);
    }
    function deleteMembershipCardOrderService(obj){
        var url = config.endpoints.o2o.orderMembershipCard+JSON.stringify(obj.id);
        return oThis.deleteHttp(url);
    }
    function getOrderCoursesService(obj){
        var url = config.endpoints.o2o.orders+'/getOrderCourseListOrderNo'+'?orderNo='+obj.orderNo;
        return oThis.getHttp2(url);
    }

    function getCoursesTypeByTeacherId(id){
        var url = config.endpoints.o2o.orders+'/teacherAvailableCourseTypes/'+id;
        return oThis.getHttp2(url);
    }
    function getCoursesByTeacherId(id){
        var url = config.endpoints.o2o.orders+'/teacherAvailableCourses/'+id;
        return oThis.getHttp2(url);
    }
    function updateCoursePlanStateService(obj){
        var url = config.endpoints.o2o.orders+'/updateCoursePlanState';
        return oThis.putHttp(url,obj);
    }

    //util
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