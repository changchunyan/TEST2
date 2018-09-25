angular.module('ywsApp').factory('workbenchSvc', ['$http', '$q', 'config','utilService',function($http, $q, config,utilService) {
    var oThis = this;
    var service = {};

    service.remindService = remindService;
    service.dataCountService = dataCountService;
    service.dataCountDetailService = dataCountDetailService;
    service.sortedTop10Service = sortedTop10Service;
    service.mingxiService = mingxiService;

    //----------------------------------------------------service--------------------------------------------------------------------------------------------

    /**
     * 获取提醒信息
     * {"type":1}提醒信息列表 {"type":2}到访信息列表 {"type":3}排课信息列表 {"type":4}续费信息列表  {"type":5}试听排课信息列表
     * @param obj
     * @returns {*}
     */
    function remindService(obj){
        var url = config.endpoints.workbench.remindTypeList;
        return utilService.postDataHttp(url,obj);
    }

    /**
     * 得到饼图数据
     * @param obj
     * @returns {*}
     */
    function dataCountService(obj){
        var url = config.endpoints.workbench.dataCountList;
        return utilService.postDataHttp(url,obj);
    }

    /**
     * 得到折线数据
     * @param obj
     * @returns {*}
     */
    function dataCountDetailService(obj){
        var url = config.endpoints.workbench.dataCountDetailList;
        return utilService.postDataHttp(url,obj);
    }

    /**
     * 得到top10数据
     * @param obj
     * @returns {*}
     */
    function sortedTop10Service(obj){
        var url = config.endpoints.workbench.sortedTopTen;
        return utilService.postDataHttp(url,obj);
    }

    /**
     * 得到明细数据
     * @param obj
     * @returns {*}
     */
    function mingxiService(obj){
        var url = config.endpoints.workbench.mingxiList;
        return utilService.postDataHttpPage(url,obj);
    }





    return service;
    }
    ]);