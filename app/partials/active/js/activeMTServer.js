/**
 * Created by 李世明 on 2017/1/17 0017.
 * QQ:1278915838
 * TEL:18518769512
 * TODO:活动消课服务
 */
angular.module('ywsApp').factory('ActiveMTServer',['utilService', function (utilService) {
    return {
        /**
         * 提交审核
         * @param obj
         * @returns {*}
         */
        audit:function (obj) {
            var _param = angular.copy(obj)
            for(var key in _param.list){
                if(key==='active'){
                    delete _param.list.active
                }
            }
            return utilService.postDataHttp2(oms_server+'course_plan/CreatactivityCoursePlan', _param)
        }

}
}])
