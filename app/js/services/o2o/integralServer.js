/**
 * Created by 李世明 on 2016/12/1 0001.
 * QQ:1278915838
 * TEL:18518769512
 * TODO:积分服务
 */
angular.module('ywsApp').factory('integralServer', ['$http', '$q', 'config', 'utilService', function ($http, $q, config, utilService) {
    return {
        getIntegealList:function (obj) {
            // console.log(obj)
            var url = config.endpoints.o2o.integealList+'?params='+JSON.stringify(obj)
            return utilService.getHttp(url);
        },
        getIntegealRulesList:function (obj) {
            // console.log(obj)
            var url = config.endpoints.o2o.integealRulesList+'?params='+JSON.stringify(obj)
            return utilService.getHttp2(url);
        },
        getRulesGroupById:function (id) {
            var url = config.endpoints.o2o.rulesGroupById+'/'+id
            return utilService.getHttp2(url);
        },
        add:function (obj) {
            // console.log(JSON.stringify(obj))
            var url = config.endpoints.o2o.rulesAdd
            return utilService.putHttp(url,JSON.stringify(obj));
        },
        update:function (obj) {
            var url = config.endpoints.o2o.rulesUpdate+'/'+obj.group_id+'/'+obj.state
            return utilService.putHttp(url);
        }
    }
}])