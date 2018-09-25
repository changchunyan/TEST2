/**
 * The teacher service.
 *
 * @author sunqc
 * @version 1.0
 */
angular.module('ywsApp').factory('CreatePlanService', ['$http', '$q', 'config','utilService',function($http, $q,config,utilService) {
    /*
    product == course
     */
    var oThis = this;
    var service = {};
    service.addPlans =addPlans;
    service.deletePlans = deletePlans;

    //----------------------------------------------------service--------------------------------------------------------------------------------------------
    function addPlans(requestDate){
        var url = arguments[1]==1?config.endpoints.sos.creatCourseAlready:config.endpoints.sos.creatCoursePlan;
        return utilService.postDataHttp2(url,requestDate);
    }
    function deletePlans(requestDate){
        var url = config.endpoints.sos.deletePlans;
        return utilService.postDataHttp2(url,requestDate);
    }

    return service;
  }
]);
