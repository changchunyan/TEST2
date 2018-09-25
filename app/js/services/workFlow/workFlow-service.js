angular.module('ywsApp').factory('WorkFlowService', ['$http', '$q', 'config','utilService',function($http, $q, config,utilService) {
    var oThis = this;
    var service = {};
    service.getProcessesLists = getProcessesLists;
    service.getProcessesDetail = getProcessesDetail;

    service.deleteProcess = deleteProcess;//删除流程

    service.getOwnSponsorLists = getOwnSponsorLists;
    service.getOwnSolveLists = getOwnSolveLists;
    service.getStarLists = getStarLists;

    service.submitNextStep = submitNextStep;
    service.getFlowAddDesc = getFlowAddDesc;

    service.getFlowAddSubmit = getFlowAddSubmit;

    service.starFlowRoute = starFlowRoute;//收藏
    service.cancelStarFlowRoute = cancelStarFlowRoute;//取消收藏收藏
    service.kuaiFlowRoute = kuaiFlowRoute;//加急
    service.cancelKuaiFlowRoute = cancelKuaiFlowRoute;//取消加急

    service.saveDraft = saveDraft;//保存草稿
    service.proceedAndSaveDraft = proceedAndSaveDraft;//下一步并存草稿

    service.submitBeach = submitBeach;//批量处理

    service.uploadFile = uploadFile;
    service.getBaseUrl = getBaseUrl;

    /****************工作台*************************/
    service.getWorkStart = getWorkStart;
    service.getWorkDeal = getWorkDeal;
    service.getWorkFinish = getWorkFinish;
    service.getWorkStar = getWorkStar;

    //----------------------------------------------------service--------------------------------------------------------------------------------------------
    /**
     ** 得到流程列表
     * status不传或者0表示全部
     * int STATUS_PROCESSING = 1;//经行政
     * int STATUS_REFUSED = 2;//打回
     * int STATUS_PERFORMED = 3;//已处理
     * int STATUS_ENDED = 4;//结束
     * int STATUS_DELETED = 5; //已删除
     * int STATUS_DRAFT = 6;  //草稿
     * @param start
     * @param number
     * @param type
     * @returns {*}
     */
    function getProcessesLists(start,number,type){
        var url = config.endpoints.workFlow.getProcesses+'?pageNo=' + start + '&page=' + number+'&status='+type;
        return utilService.getHttp(url);
    }

    /**
     * 得到流程详细信息
     * @param id
     */
    function getProcessesDetail(id){
        var url = config.endpoints.workFlow.getProcessesDetail+'?id='+id;
        return utilService.getHttp2(url);
    }

    /**
     * 删除流程
     * @param obj
     */
    function deleteProcess(obj){
        var url = config.endpoints.workFlow.deleteProcess;
        return utilService.postHttp(url,obj);
    }

    /**
     * 我发起的
     * @param start
     * @param number
     * @param type
     */
    function getOwnSponsorLists(start,number,type){
        var url = config.endpoints.workFlow.getSponsorLists+'?pageNo=' + start + '&page=' + number+'&status='+type;
        return utilService.getHttp(url);
    }

    /**
     * 我处理的
     * @param start
     * @param number
     * @param type
     */
    function getOwnSolveLists(start,number,type){
        var url = config.endpoints.workFlow.getSolveLists+'?pageNo=' + start + '&page=' + number+'&type='+type;
        return utilService.getHttp(url);
    }

    /**
     * 星标列表
     * @param start
     * @param number
     * @param type
     */
    function getStarLists(start,number,type){
        var url = config.endpoints.workFlow.getStarLists+'?pageNo=' + start + '&page=' + number+'&status='+type;
        return utilService.getHttp(url);
    }

    /**
     * 开始一个流程
     * @param key
     */
    function startProcess(key){
        var url = config.endpoints.workFlow.getProcesses+'?pageNo=' + start + '&page=' + number+'&status='+type;
        return utilService.getHttp(url);
    }

    /**
     * 进行下一步
     */
    function submitNextStep(obj){
        var url = config.endpoints.workFlow.submitNextStep;
        return utilService.postDataHttp2(url,obj);
    }

    /**
     * 保存草稿
     */
    function saveDraft(obj){
        var url = config.endpoints.workFlow.saveDraft;
        return utilService.postDataHttp2(url,obj);
    }

    /**
     *  下一步并存草稿
     */
    function proceedAndSaveDraft(obj){
        var url = config.endpoints.workFlow.proceedAndSaveDraft;
        return utilService.postDataHttp2(url,obj);
    }

    /**
     * 批量处理
     * @param obj
     */
    function submitBeach(obj){
        var url = config.endpoints.workFlow.submitBeach;
        return utilService.postDataHttp2(url,obj);
    }

    /**
     * 发起工作流 需要的desc
     * @returns {*}
     */
    function getFlowAddDesc(){
        var url = config.endpoints.workFlow.getFlowAddDes;
        return utilService.getHttp2(url);
    }

    function getFlowAddSubmit(key){
        var url = config.endpoints.workFlow.getFlowAddSubmit+'?key=' + key;
        return utilService.getHttp2(url);
    }

    /**
     * 收藏
     * @param obj 中包含id
     */
    function starFlowRoute(obj){
        var url = config.endpoints.workFlow.starlowRoute+'?id='+obj.id;
        return utilService.postDataHttp2(url,obj);
    }

    /**
     * 取消收藏
     * @param obj 中包含id
     */
    function cancelStarFlowRoute(obj){
        var url = config.endpoints.workFlow.cancelStarFlowRoute+'?id='+obj.id;
        return utilService.postDataHttp2(url,obj);
    }

    /**
     * 加急
     * @param obj 中包含id
     */
    function kuaiFlowRoute(obj){
        var url = config.endpoints.workFlow.kuaiFlowRoute+'?id='+obj.id;
        return utilService.postHttp(url,obj);
    }

    /**
     * 取消加急
     * @param obj 中包含id
     */
    function cancelKuaiFlowRoute(obj){
        var url = config.endpoints.workFlow.cancelKuaiFlowRoute+'?id='+obj.id;
        return utilService.postHttp(url,obj);
    }

    function uploadFile(obj){
        var url = config.endpoints.workFlow.uploadFile;
        return utilService.postHttp(url,obj);
    }

    function getBaseUrl(){
        var url = config.endpoints.workFlow.getBaseUrl;
        return utilService.getHttp2(url);
    }

    /****************工作台*************************/
    /**
     * 我发起
     * @returns {*}
     */
    function getWorkStart(){
        var url = config.endpoints.workFlow.getWorkStart;
        return utilService.getHttp(url);
    }

    /**
     * 待我办
     * @returns {*}
     */
    function getWorkDeal(){
        var url = config.endpoints.workFlow.getWorkDeal;
        return utilService.getHttp(url);
    }

    /**
     * 我已办
     * @returns {*}
     */
    function getWorkFinish(){
        var url = config.endpoints.workFlow.getWorkFinish;
        return utilService.getHttp(url);
    }

    /**
     * 星标
     * @returns {*}
     */
    function getWorkStar(){
        var url = config.endpoints.workFlow.getWorkStar;
        return utilService.getHttp(url);
    }


    return service;
    }
    ]);