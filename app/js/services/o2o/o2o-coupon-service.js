angular.module('ywsApp').factory('O2oCouponManagementService', ['$http', '$q', 'config','utilService',function($http, $q, config,utilService) {
    var oThis = this;
    var service = {};

    //----------------------------------------------------service--------------------------------------------------------------------------------------------
    service.getCouponListService = getCouponListService;
    service.detailCouponByIdService = detailCouponByIdService;

    service.deleteCouponService = deleteCouponService;
    service.updateCouponService = updateCouponService;
    service.addCouponService = addCouponService;

    service.searchCourseTree = searchCourseTree;
    service.upDownShelveService = upDownShelveService;
    service.couponListv2 = couponListv2;
    service.createV2 = createV2;
    service.getFullInfo = getFullInfo;
    service.updateV2 = updateV2;
    service.getUrl = getUrl;
        //----------------------------------------------------util--------------------------------------------------------------------------------------------


    //----------------------------------------------------service--------------------------------------------------------------------------------------------
    function getCouponListService(start,number,params){
       /* var predicate = params.predicateObject;
        var parameters ={};//查询条件*/
        var url = config.endpoints.o2o.coupon+'?start=' + start + '&number=' + number+'&params='+JSON.stringify({});
        return utilService.getHttp(url);
    }

    function getUrl(){
        var deferred = $q.defer();
        //var url = 'http://localhost:9080/yws-api-o2o/course/getRecommendCourseListForMainPageCity?city=110200';
        //var url = 'http://localhost:9080/yws-api-o2o/course/searchCourse?start=0&number=10';
        //var url = 'http://localhost:9080/yws-api-o2o/course/getCourseDetail?courseId=103&userId=1550';
        //var url = 'http://localhost:9080/yws-api-o2o/teacher/getTeacherDetail?teacherId=10194&userId=17954';
        var url = 'http://localhost:9080/yws-api-o2o/order/courseAvaliablePurchaseAcquiredCoupon?courseId=29&totalMoney=444';
        $http.get(url)
          .success(function(response, status, headers, config) {
              deferred.resolve(response);
          })
          .error(function(response, status, headers, config) {
              console.log('Failed to get coupon : ' + JSON.stringify(response));
              deferred.reject(response);
          }
        );
        return deferred.promise;
    }

    function couponListv2(start, number,filter) {
        var deferred = $q.defer();
        filter.pageNum = start/number+1;
        filter.pageSize = number;
        //console.dir(filter);
        $http.post(config.endpoints.o2o.coupon+'/list',filter).success(function(response, status, headers, config) {
            //console.log(response);
            deferred.resolve(response);
        }).error(function(response, status, headers, config) {
              console.log('Failed to get couponListv2 : ' + JSON.stringify(response));
              deferred.reject(response);
          }
        );
        return deferred.promise;
    }

    function createV2(obj) {
        var deferred = $q.defer();
        var start = obj.validitystarttime;
        var end = obj.validityendtime;
        obj.validitystarttime = Date.parse(start);
        obj.validityendtime = Date.parse(end);

        $http.post(config.endpoints.o2o.coupon+'/createv2',obj).success(function(response, status, headers, config) {
            obj.validitystarttime = start;
            obj.validityendtime = end;
            deferred.resolve(response);
        }).error(function(response, status, headers, config) {
              console.log('Failed to get createv2 : ' + JSON.stringify(response));
              deferred.reject(response);
          }
        );
        return deferred.promise;
    }

    function updateV2(obj) {
        var deferred = $q.defer();
        var start = obj.validitystarttime;
        var end = obj.validityendtime;
        obj.validitystarttime = Date.parse(start);
        obj.validityendtime = Date.parse(end);

        $http.post(config.endpoints.o2o.coupon+'/updatev2',obj).success(function(response, status, headers, config) {
            obj.validitystarttime = start;
            obj.validityendtime = end;
            deferred.resolve(response);
        }).error(function(response, status, headers, config) {
              console.log('Failed to get createv2 : ' + JSON.stringify(response));
              deferred.reject(response);
          }
        );
        return deferred.promise;
    }

    function getFullInfo(id) {
        var deferred = $q.defer();
        $http.get(config.endpoints.o2o.coupon+'/getfullinfo?id=' + id)
          .success(function(response, status, headers, config) {
              deferred.resolve(response);
          })
          .error(function(response, status, headers, config) {
              console.log('Failed to get coupon : ' + JSON.stringify(response));
              deferred.reject(response);
          }
        );
        return deferred.promise;
    }

    /**
     * 得到优惠券详细信息
     * @param id
     * @returns {*}
     */
    function detailCouponByIdService(id){
        var url = config.endpoints.o2o.coupon+'/'+id;
        return utilService.getHttp2(url);
    }
    
    function deleteCouponService(id){
        var url = config.endpoints.o2o.coupon+'/'+id;
        return utilService.deleteHttp(url);
    }
    function updateCouponService(obj){
        var url = config.endpoints.o2o.coupon;
        return utilService.putHttp(url,obj);
    }
    function addCouponService(obj){
        var url = config.endpoints.o2o.coupon;
        return utilService.postHttp(url,obj);
    }

    function searchCourseTree(){
        var url = config.endpoints.o2o.coupon+'/listO2oCourse';
        return utilService.getHttp2(url);
    }

    /**
     * 优惠券上下架
     * @param obj 参数中 必须包括 IsShelve 和coupon.id
     * @returns {*}
     */
    function upDownShelveService(obj){
        var url = config.endpoints.o2o.coupon+'/status';
        return utilService.putHttp(url,obj);
    }

    //----------------------------------------------------util--------------------------------------------------------------------------------------------




    return service;
    }
    ]);