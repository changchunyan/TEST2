/**
 * Created by 李世明 on 2017/1/17 0017.
 * QQ:1278915838
 * TEL:18518769512
 * TODO:升班设置服务
 */
angular.module('ywsApp').factory('PromotionMTServer',['utilService', function (utilService) {
    return {
        getPageList:function(obj){
            return utilService.postDataHttp(crm_server+'/crmClassUpgradeReference/queryForPage', obj)
        },
        queryUpgradeStudentList:function(obj){
            return utilService.postDataHttp(crm_server+'/crmClassUpgradeReference/queryUpgradeStudentList', obj)
        },
        queryUpgradeClassList:function(obj){
            return utilService.postDataHttp(crm_server+'/crmClassUpgradeReference/queryUpgradeClassList', obj)
        },
    	
        createOrUpdate:function(obj){
    		return utilService.postDataHttp2(crm_server+'/crmClassUpgradeReference/createOrUpdate', obj)
    	},
        upgradeClass:function(obj){
    		return utilService.postDataHttp2(crm_server+'/crmClassUpgradeReference/upgradeClass', obj)
    	},
        
        remove:function(obj){
        	return utilService.postDataHttp2(crm_server+'/crmClassUpgradeReference/deleteByReferenceId', obj)
        },
        removeUpgradeClass:function(obj){
        	return utilService.postDataHttp2(crm_server+'/crmClassUpgradeReference/removeUpgradeClass', obj)
        },
    	
    	check:function(obj){
    		return utilService.postDataHttp2(crm_server+'/crmClassUpgradeReference/check', obj)
    	},

    	queryById:function(id){
    		return utilService.postDataHttp2(crm_server+'/crmClassUpgradeReference/queryById/'+id)
    	}
}
}])
