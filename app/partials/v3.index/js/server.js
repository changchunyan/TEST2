/**
 * Created by 李世明 on 2016/12/15 0015.
 * QQ:1278915838
 * TEL:18518769512
 * TODO:v3.indexServer
 */
'use strict';
angular.module('ywsApp').factory('V3IndexServer', ['utilService', function (utilService) {
    return {
        /**
         * 获取首页数据
         * @param arg
         * 查询和分页信息
         */
        findIndexData: function (arg) {
            return utilService.postDataHttp(admin_server + 'homePage/getHomePageData/' + arg + (arg == 3 ? '?level=1' : ''))
        },

        findIndexDataMore:function(arg) {
            return utilService.postDataHttp(bi_server + 'biSchoolPerformenceProgress/queryForPage',arg)
        },

        getEvents: function (startDate, endDate) {
            return utilService.getHttp2(crm_server + '/event?startDate=' + startDate + '&endDate=' + endDate);
        }
    }
}])
