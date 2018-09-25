'use strict';
/**
 * The Coupon management controller.
 * @author 曹毅
 * @version 1.0
 */
var ywsApp = angular.module('ywsApp');
/**
 * 控制台父controller 所有的控制台页面都都继承
 * 1.负责角色判断与处理
 * 2.封装公共动态事件 函数
 */
ywsApp.controller('workbenchCtl',
    ['$scope', '$modal', '$rootScope','$location', 'SweetAlert','workbenchSvc','WorkFlowService',
        function($scope, $modal, $rootScope,$location, SweetAlert,workbenchSvc,WorkFlowService) {
            $scope.views = {
               /* showRoles:{
                    courseConsultant:false  //课程顾问
                },*/
                isShowTop10:false, //是否显示top10
                isShowDetail:false //是否显示明细
            };//存放页面显示参数
            $scope.selectedCycle = selectedCycle;
            $scope.selectedCount = selectedCount;
            $scope.selectedDetail = selectedDetail;

            $scope.ifShowDetail = ifShowDetail;
            $scope.ifShowTop10 = ifShowTop10;

            $scope.getPieDate = getPieDate;

            $scope.getLineDateByCycle = getLineDateByCycle;
            $scope.getLineDateByCount = getLineDateByCount;

            /****************工作台*************************/
            $scope.getWorkStart = getWorkStart;
            $scope.getWorkDeal = getWorkDeal;
            $scope.getWorkFinish = getWorkFinish;
            $scope.getWorkStar = getWorkStar;

                $scope.detailFlowRoute = detailFlowRoute;


            //---------------------------------------util---------------------------------------
            $scope.ifResponseSuccess = ifResponseSuccess;

            $scope.responsePieData = responsePieData;
            $scope.responseWarnData = responseWarnData;
            $scope.responseZheData = responseZheData;
            $scope.responseTop10Data = responseTop10Data;
            $scope.requestTop10Stort = requestTop10Stort;

            $scope.callDataCountDetail = callDataCountDetail;


            $scope._getSortedTop10 = _getSortedTop10;
            $scope.getMingxi = getMingxi;
            $scope._getMingxi = _getMingxi;

            $scope.toLeadsOrStudent = toLeadsOrStudent;
            $scope.check = []
            $scope.checkNow = function (obj) {
                $(obj)
                // $scope.check[index] = true
            }
            $scope.deleteNow = function (index) {
                $scope.check[index] = false
            }
            /**
             * 查看详细的建议
             */
            $scope.openTextWindow = function(text){
            	SweetAlert.swal(text);
            }
            
            /**
             * 跳转到教师日差评页面
             */
            $scope.goTeacherDay = function(){
            	$location.url('/bi-admin/studentTeacherCommunication');
            }
            
            /**
             * 跳转到学管月差评页面
             */
            $scope.goTeacherMasterMonth = function(){
            	$location.url('/bi-admin/learningComment');
            }
            $scope.indexUrls = [
                {
                	id:35,
                    url:'partials/workbench/wb.jiaoshi.html',
                    title:'教师'
                },{
                    id:79,
                    url:'partials/workbench/wb.xiaozhang.html',
                    title:'校长'
                },{
                    id:205,
                    url:'partials/workbench/wb.oneToOneManager.html',
                    title:'一对一经理'
                },{
                    id:86,
                    url:'partials/workbench/wb.xuexi.html',
                    title:'学习顾问'
                },{
                    id:87,
                    url:'partials/workbench/wb.xuexiMaster.html',
                    title:'学习主管'
                },{
                    id:40,
                    url:'partials/workbench/wb.kecheng.html',
                    title:'课程顾问'
                },{
                    id:41,
                    url:'partials/workbench/wb.kechengMaster.html',
                    title:'课程主管'
                },{
                    id:38,
                    url:'partials/workbench/wb.jiaoshiMaster.html',
                    title:'教务主管'
                },{
                    id:24,
                    url:'partials/workbench/wb.hujiao.html',
                    title:'呼叫专员'
                },{
                    id:9,
                    url:'partials/workbench/wb.chengshiMaster.html',
                    title:'城市总监'
                },{
                    id:202,
                    url:'partials/workbench/wb.director.html',
                    title:'执行董事'
                },{
                    id:201,
                    url:'partials/workbench/wb.director.html',
                    title:'董事长'
                },{
                    id:90,
                    url:'partials/workbench/wb.yuanzhang.html',
                    title:'院长'
                },{
                    id:207,
                    url:'partials/workbench/wb.daQuMaster.html',
                    title:'大区总监'
                },{
                    id:51,
                    url:'partials/workbench/wb.quyu.html',
                    title:'区域总监'
                }
            ];
            $scope.indexUrl = ''

            /**
             * 判断控制台显示 by 岗位
             */
            function _isViewsByRole(){
                $scope.POSITION_ID = angular.copy($rootScope.currentUser.position_id);
                if(judgePosition($scope.POSITION_ID) == false){//如果没有控制台显示 则显示背景大图
                    $scope.views.background = true;
                }
            }

            /**
             * 通过判断岗位  选择显示页面
             * @param id
             * @returns {boolean}
             */
            function judgePosition(id){
                var getIndexUrlById = function () {
                    for (var i = 0 , max = $scope.indexUrls.length ; i<max;i++){
                        if(id == $scope.indexUrls[i].id){
                            $scope.indexUrl = $scope.indexUrls[i].url
                            return false
                        }
                    }
                }
                switch (id){
                	case 35:
                		$rootScope._dataCount = true
                        getIndexUrlById(id)
                        break;
                    case 79:
                        $rootScope._dataCount = true
                        getIndexUrlById(id)
                        break;
                    case 205:getIndexUrlById(id)
                        break;
                    case 86:
                        $rootScope._dataCount = true
                        getIndexUrlById(id)
                        break;
                    case 87:
                        $rootScope._dataCount = true
                        getIndexUrlById(id)
                        break;
                    case 40:getIndexUrlById(id)
                        break;
                    case 41:getIndexUrlById(id)
                        break;
                    case 38:getIndexUrlById(id)
                        break;
                    case 9:getIndexUrlById(id)
                        break;
                    case 202:getIndexUrlById(id)
                        break;
                    case 201:getIndexUrlById(id)
                        break;
                    case 90:getIndexUrlById(id)
                        break;
                    case 207:getIndexUrlById(id)
                        break;
                    case 51:getIndexUrlById(id)
                        break;
                }
            }

            /**
             * 选择周期
             *  控制button的active和
             * @param node
             * @param type
             * @param callback
             * @param that
             */
            function selectedCycle(node,type,callback,that){
                removeActive(node);
                if(type =='day'){
                    $('.'+node+' .cycle-day').addClass('chart-active');
                    callback(type,that);
                }else if(type =='week'){
                    $('.'+node+' .cycle-week').addClass('chart-active');
                    callback(type,that);
                }else if(type =='month'){
                    $('.'+node+' .cycle-month').addClass('chart-active');
                    callback(type,that);
                }else{
                    $('.'+node+' .cycle-day').addClass('chart-active');
                    callback(type,that);
                }
            }

            /**
             * 选择数量
             * 1、到访量  2、签单量  3、签单金额  4、推荐量  5、体验量 6、试听课时 7、成功订单 8、 消课课时
             * @param node
             * @param type
             * @param callback
             * @param that
             */
            function selectedCount(node,type,callback,that){
                removeActive(node);
                if(type =='visitCount'){//到访量
                    $('.'+node+' .line-visit-count').addClass('chart-active');
                    callback(type,that);
                }else if(type =='signedCount'){//签单量
                    $('.'+node+' .line-signed-count').addClass('chart-active');
                    callback(type,that);
                }else if(type =='signedMoney') {//签单金额
                    $('.' + node + ' .line-signed-money').addClass('chart-active');
                    callback(type,that);
                }else if(type =='referralCount'){//推荐量
                    $('.'+node+' .line-referral-count').addClass('chart-active');
                    callback(type,that);
                }else if(type =='tiyanCount'){//体验量
                    $('.'+node+' .line-tiyan-count').addClass('chart-active');
                    callback(type,that);
                }else if(type =='sitingCount'){//试听课时
                    $('.'+node+' .line-siting-count').addClass('chart-active');
                    callback(type,that);
                }else if(type =='chenggongCount'){//成功订单
                    $('.'+node+' .line-chenggong-count').addClass('chart-active');
                    callback(type,that);
                }else if(type =='xiaokeCount'){//消课课时
                    $('.'+node+' .line-xiaoke-count').addClass('chart-active');
                    callback(type,that);
                }else{
                    $('.'+node+' .line-visit-count').addClass('chart-active');
                    callback(type,that);
                }
            }

            function selectedDetail(node,type,callback,that){
                removeActive(node);
                if(type =='notShowDetail'){//不显示明细
                    $('.'+node+' .not-show-detail').addClass('chart-active');
                    callback(false,that);
                }else if(type =='showDetail'){//显示明细
                    $('.'+node+' .show-detail').addClass('chart-active');
                    callback(true,that);
                }else{
                    $('.'+node+' .not-show-detail').addClass('chart-active');
                    callback(false,that);
                }
            }

            function removeActive(ele){
                $('.'+ele).find('.chart-active').removeClass('chart-active');
            }
            function addActive(ele){
                $('.'+ele,function(e){
                    e.addClass('chart-active')
                });
            }

            //---------------------------------------调用Service方法---------------------------------------
           /* /!**
             *得到图标数据
             * @param dataType
             * @param dateType
             *!/
            function getChartData(dataType,dateType){

            }

            /!**
             * 得到前十数据
             *!/
            function getTop10Data(){

            }

            /!**
             * 得到提醒数据
             * @param type
             *!/
            function getWarnData(type){

            }*/

            //---------------------------------------util---------------------------------------

            /**
             * 是否显示明细
             * @param isBl
             * @param that
             */
            function ifShowDetail(isBl,that){
                if(isBl){
                    that.views.isShowDetail = true;
                }else{
                    that.views.isShowDetail = false;
                }
            }
            /**
             * 是否显示top10 排行
             * @param isBl
             * @param that
             */
            function ifShowTop10(isBl,that){
                if(isBl){
                    that.views.isShowTop10 = true;
                   /* var obj = {
                        positionId  :$scope.POSITION_ID,
                        dataType:that.requestDataType //计数据维度 1、个人数据     2、团队数据
                    };
                    that._getSortedTop10(obj);*/

                }else{
                    that.views.isShowTop10 = false;
                }
            }

            /**
             * 得到饼图数据
             * @param type
             * @param that
             */
            function getPieDate(type,that){
                if(type =='day'){
                    that.pieConfig.dateType = 1;
                    that.views.updateTimeDsc = '日统计数据每30分钟更新一次，最新统计时间：'+Hours30(new Date());
                    that.callDataCount();
                    if(that.requestDataType ==2 ){
                        $scope.getMingxi(that);
                    }else if(that.requestDataType ==3){
                        $scope.getMingxi(that);
                        that.views.updateTimeDsc = '日差评为当天提交评价，月差评为当月提交差评；提分率与满意度为当月统计数据。';
                    }
                }else if(type =='week'){
                    that.pieConfig.dateType = 2;
                    that.views.updateTimeDsc = '周统计数据每日更新两次，中午12:00和凌晨00:00，最新统计时间：'+Date12(new Date());
                    that.callDataCount();
                    if(that.requestDataType ==2 ) {
                        $scope.getMingxi(that);
                    }else if(that.requestDataType ==3){
                        $scope.getMingxi(that);
                        that.views.updateTimeDsc = '日差评为当天提交评价，月差评为当月提交差评；提分率与满意度为当月统计数据。';
                    }

                    /*that.views.pieData ={
                        visitCount:11,//到访量
                        signedCount:12,//签单量
                        signedMoney:13,//签单金额
                        referralCount:14//推荐量
                    };*/
                }else if(type =='month'){
                    that.pieConfig.dateType = 3;
                    that.views.updateTimeDsc = '月统计数据每日更新两次，中午12:00和凌晨00:00，最新统计时间：'+Date12(new Date());
                    that.callDataCount();
                    if(that.requestDataType ==2 ){
                        $scope.getMingxi(that);
                    }
                }else{
                    that.pieConfig.dateType = 1;
                    that.callDataCount();
                    if(that.requestDataType ==2 ){
                        $scope.getMingxi(that);
                    }
                }
            }
            /**
             * 得到折线数据 by 周期
             * @param type
             * @param that
             */
            function getLineDateByCycle(type, that){
                if(type =='day'){
                    that.views.isLineMonth = false;
                    that.lineConfig.dateType = 1;
                    $scope.callDataCountDetail(that);
                    /* that.lineData.datapoints= [
                     { x: '星期1', y: 2 },
                     { x: '星期2', y: 0 },
                     { x: '星期3', y: 4 },
                     { x: '星期4', y: 2 },
                     { x: '星期5', y: 3 },
                     { x: '星期6', y: 0 },
                     { x: '星期7', y: 2 }
                     ];*/
                    /*lineData.datapoints.shift();*/
                }else if(type =='week'){
                    that.views.isLineMonth = false;
                    that.lineConfig.dateType = 2;
                    $scope.callDataCountDetail(that);
                   /* that.lineData.datapoints= [
                        { x: '星期1', y: 2 },
                        { x: '星期2', y: 0 },
                        { x: '星期3', y: 4 },
                        { x: '星期4', y: 2 },
                        { x: '星期5', y: 3 },
                        { x: '星期6', y: 0 },
                        { x: '星期7', y: 2 }
                    ];*/
                    /*lineData.datapoints.shift();*/
                }else if(type =='month'){
                    that.views.isLineMonth = true;
                    that.lineConfig.dateType = 3;
                    $scope.callDataCountDetail(that);
                   /* that.lineData.datapoints= [
                        { x: '第一周', y: 12 },
                        { x: '', y: 0 },
                        { x: '第二周', y: 10 },
                        { x: '', y: 0 },
                        { x: '第三周', y: 14 },
                        { x: '', y: 0 },
                        { x: '第四周', y: 12 }
                    ];*/
                    /*lineData.datapoints.shift();*/
                }else{
                    that.lineConfig.dateType = 2;
                    that.callDataCountDetail();
                }

            }
            /**
             * 得到折线数据 by 数量类型
             *  1、到访量  2、签单量  3、签单金额  4、推荐量  5、体验量 6、试听课时 7、成功订单 8、 消课课时
             * @param type
             * @param that
             */
            function getLineDateByCount(type,that){
                if(type =='visitCount'){
                    that.lineConfig.zoushiFlag = 1;
                    $scope.callDataCountDetail(that);
                }else if(type =='signedCount'){
                    that.lineConfig.zoushiFlag = 2;
                    $scope.callDataCountDetail(that);
                   /* that.lineData.datapoints= [
                        { x: '第一周', y: 12 },
                        { x: '', y: 0 },
                        { x: '第二周', y: 10 },
                        { x: '', y: 0 },
                        { x: '第三周', y: 14 },
                        { x: '', y: 0 },
                        { x: '第四周', y: 12 }
                    ];*/
                }else if(type =='signedMoney'){
                    that.lineConfig.zoushiFlag = 3;
                    $scope.callDataCountDetail(that);
                   /* that.lineData.datapoints= [
                        { x: '星期1', y: 2 },
                        { x: '星期2', y: 0 },
                        { x: '星期3', y: 4 },
                        { x: '星期4', y: 2 },
                        { x: '星期5', y: 3 },
                        { x: '星期6', y: 0 },
                        { x: '星期7', y: 2 }
                    ];*/
                }else if(type =='referralCount'){
                    that.lineConfig.zoushiFlag = 4;
                    $scope.callDataCountDetail(that);
                    /*that.lineData.datapoints= [
                        { x: '第一周', y: 12 },
                        { x: '', y: 0 },
                        { x: '第二周', y: 10 },
                        { x: '', y: 0 },
                        { x: '第三周', y: 14 },
                        { x: '', y: 0 },
                        { x: '第四周', y: 12 }
                    ];*/
                }else if(type =='tiyanCount'){
                    that.lineConfig.zoushiFlag = 5;//体验数
                    $scope.callDataCountDetail(that);
                    /*that.lineData.datapoints= [
                     { x: '第一周', y: 12 },
                     { x: '', y: 0 },
                     { x: '第二周', y: 10 },
                     { x: '', y: 0 },
                     { x: '第三周', y: 14 },
                     { x: '', y: 0 },
                     { x: '第四周', y: 12 }
                     ];*/
                }else if(type =='sitingCount'){
                    that.lineConfig.zoushiFlag = 6;//试听课时
                    $scope.callDataCountDetail(that);
                    /*that.lineData.datapoints= [
                     { x: '第一周', y: 12 },
                     { x: '', y: 0 },
                     { x: '第二周', y: 10 },
                     { x: '', y: 0 },
                     { x: '第三周', y: 14 },
                     { x: '', y: 0 },
                     { x: '第四周', y: 12 }
                     ];*/
                }else if(type =='chenggongCount'){//成功单数
                    that.lineConfig.zoushiFlag = 7;
                    $scope.callDataCountDetail(that);
                    /*that.lineData.datapoints= [
                     { x: '第一周', y: 12 },
                     { x: '', y: 0 },
                     { x: '第二周', y: 10 },
                     { x: '', y: 0 },
                     { x: '第三周', y: 14 },
                     { x: '', y: 0 },
                     { x: '第四周', y: 12 }
                     ];*/
                }else if(type =='xiaokeCount'){//消课数
                    that.lineConfig.zoushiFlag = 8;
                    $scope.callDataCountDetail(that);
                    /*that.lineData.datapoints= [
                     { x: '第一周', y: 12 },
                     { x: '', y: 0 },
                     { x: '第二周', y: 10 },
                     { x: '', y: 0 },
                     { x: '第三周', y: 14 },
                     { x: '', y: 0 },
                     { x: '第四周', y: 12 }
                     ];*/
                }else{
                    that.lineConfig.zoushiFlag = 1;
                    $scope.callDataCountDetail(that);
                    /*that.lineData.datapoints= [
                        { x: '星期1', y: 2 },
                        { x: '星期2', y: 0 },
                        { x: '星期3', y: 4 },
                        { x: '星期4', y: 2 },
                        { x: '星期5', y: 3 },
                        { x: '星期6', y: 0 },
                        { x: '星期7', y: 2 }
                    ];*/
                }
            }

            /**
             * 处理后台返回值
             * @param response
             * @returns {boolean}
             */
            function ifResponseSuccess(response){
                if(response.data.status == 'FAILURE'){
                    SweetAlert.swal(response.data.data);
                    return false;
                }else{
                    return true;
                }
            }


            /**
             * 处理warn返回data
             * @param type
             * @param that
             */
            function responseWarnData(type,that,result){
                if(type == 1){
                    that.infoWarn= result.data.data.list;
                }else if(type ==2){
                    that.visitWarn= result.data.data.list;
                }else if(type ==3){
                    that.courseWarn= result.data.data.list;
                }else if(type ==4){
                    that.xufeiWarn= result.data.data.list;
                }else if(type ==5){
                    that.listenWarn= result.data.data.list;
                }else if(type ==6){
                    that.dayTeacherWarn= result.data.data.list;
                }else if(type ==7){
                    that.monthTeacherMasterWarn= result.data.data.list;
                }
            }
            /**
             * 处理饼图返回data
             * @param data
             */
            function responsePieData(data){
                return {
                    visitCount:data.data.daoFangCount+'个' || 0+'个',//到访量
                    signedCount:data.data.qianYueCount+'单' || 0+'单',//签单量
                    signedMoney:data.data.qianYueMoney+'元' || 0+'元',//签单金额
                    referralCount:data.data.tuiJianCount+'个' || 0+'个',//推荐量
                    shitingCount:data.data.freeListeningTime+'小时' || 0 +'小时', //试听
                    sucessCount: data.data.qianYueCount+'单' || 0+'单', //成功单数
                    xiaoKeTimeCount:data.data.xiaoKeTime+'小时' || 0 +'小时', //消课数
                    tiyanCount:data.data.tiyanCount+'个' || 0+'个',//体验数

                    riChaPing:data.data.riChaPing+'个' || 0+'个',//日差评
                    yueChaPing:data.data.yueChaPing+'个' || 0+'个',//月差评
                    tiFenLv:data.data.tiFenLv+'%' || 0+'%',//提分率
                    manYiDu:data.data.manYiDu+'%' || 0+'%'//满意度
                }
            }
            /**
             * 处理折线返回data
             * @param type
             * @param that
             * @param data
             */
            function responseZheData(type,that,data){
                //处理  3校长  24 城市总监 7 学习顾问主管  10 课程顾问主管  25教务主管
                _dealResponseZheDataBy2(type,that,data);
               /* if(that.requestDataType==2 && (that.requestRoleId==3 || that.requestRoleId==24 || that.requestRoleId==7  || that.requestRoleId==10  || that.requestRoleId==25)) {
                    _dealResponseZheDataBy2(type,that,data);
                }else if(that.requestDataType==1  && (that.requestRoleId==10 || that.requestRoleId==9)){//课程顾问和课程顾问主管
                    _dealResponseZheDataBy2(type,that,data);
                }*/
               /* else{
                    if(type==2 || type==1){//补丁 修复当前个人数据从周开始
                        that.lineData = {
                            name: '数量',
                            datapoints: [
                                { x: '星期一', y: data.data.zoushi.星期一 || 0},
                                { x: '星期二', y: data.data.zoushi.星期二 || 0},
                                { x: '星期三', y: data.data.zoushi.星期三 || 0},
                                { x: '星期四', y: data.data.zoushi.星期四 || 0},
                                { x: '星期五', y: data.data.zoushi.星期五 || 0},
                                { x: '星期六', y: data.data.zoushi.星期六 || 0},
                                { x: '星期日', y: data.data.zoushi.星期日 || 0}
                            ]
                        };
                    }else if(type ==3){
                        that.lineData = {
                            name: '数量',
                            datapoints: [
                                { x: '第一周', y: data.data.zoushi.第一周 || 0},
                                { x: '第二周', y: data.data.zoushi.第二周 || 0},
                                { x: '第三周', y: data.data.zoushi.第三周 || 0},
                                { x: '第四周', y: data.data.zoushi.第四周 || 0}
                            ]
                        };
                        if(data.data.zoushi.第五周 != undefined){
                            var temp = { x: '第五周', y: data.data.zoushi.第五周 || 0};
                            that.lineData.datapoints.push(temp);
                            /!*  temp = { x: '',y: 0 };
                             that.lineData.datapoints.push(temp);
                             that.lineData.datapoints.push(temp);*!/
                        }
                        if(data.data.zoushi.第六周 != undefined){
                            var temp = { x: '第六周', y: data.data.zoushi.第六周 || 0};
                            that.lineData.datapoints.push(temp);
                            /!* temp = { x: '',y: 0 };
                             that.lineData.datapoints.push(temp);*!/
                        }
                    }
                }*/
            }
                /**
                 * 处理折线图数据
                 * @param type
                 * @param that
                 * @param data
                 * @private
                 */
                function _dealResponseZheDataBy2(type,that,data){
                    if(!check_null(data.data.zoushi)){
                        data.data.zoushi = {};
                    }
                    var dayNum = getMonthDayNumber();
                    if (type == 1) {
                        that.lineData = {
                            name: '数量',
                            datapoints: [
                                {x: '1号', y: data.data.zoushi['1'] || 0},
                                {x: '2号', y: data.data.zoushi['2'] || 0},
                                {x: '3号', y: data.data.zoushi['3'] || 0},
                                {x: '4号', y: data.data.zoushi['4'] || 0},
                                {x: '5号', y: data.data.zoushi['5'] || 0},
                                {x: '6号', y: data.data.zoushi['6'] || 0},
                                {x: '7号', y: data.data.zoushi['7'] || 0},
                                {x: '8号', y: data.data.zoushi['8'] || 0},
                                {x: '9号', y: data.data.zoushi['9'] || 0},
                                {x: '10号', y: data.data.zoushi['10'] || 0},
                                {x: '11号', y: data.data.zoushi['11'] || 0},
                                {x: '12号', y: data.data.zoushi['12'] || 0},
                                {x: '13号', y: data.data.zoushi['13'] || 0},
                                {x: '14号', y: data.data.zoushi['14'] || 0},
                                {x: '15号', y: data.data.zoushi['15'] || 0},
                                {x: '16号', y: data.data.zoushi['16'] || 0},
                                {x: '17号', y: data.data.zoushi['17'] || 0},
                                {x: '18号', y: data.data.zoushi['18'] || 0},
                                {x: '19号', y: data.data.zoushi['19'] || 0},
                                {x: '20号', y: data.data.zoushi['20'] || 0},
                                {x: '21号', y: data.data.zoushi['21'] || 0},
                                {x: '22号', y: data.data.zoushi['22'] || 0},
                                {x: '23号', y: data.data.zoushi['23'] || 0},
                                {x: '24号', y: data.data.zoushi['24'] || 0},
                                {x: '25号', y: data.data.zoushi['25'] || 0},
                                {x: '26号', y: data.data.zoushi['26'] || 0},
                                {x: '27号', y: data.data.zoushi['27'] || 0}
                            ]
                        };
                        if (data.data.zoushi['28']!=undefined || 28<=dayNum) {
                            var temp = {x: '28号', y: data.data.zoushi['28'] || 0};
                            that.lineData.datapoints.push(temp);
                            /*  temp = { x: '',y: 0 };
                             that.lineData.datapoints.push(temp);
                             that.lineData.datapoints.push(temp);*/
                        }
                        if (data.data.zoushi['29'] != undefined || 29<=dayNum ) {
                            var temp = {x: '29号', y: data.data.zoushi['29'] || 0};
                            that.lineData.datapoints.push(temp);
                            /* temp = { x: '',y: 0 };
                             that.lineData.datapoints.push(temp);*/
                        }
                        if (data.data.zoushi['30'] != undefined || 30<=dayNum)  {
                            var temp = {x: '30号', y: data.data.zoushi['30'] || 0};
                            that.lineData.datapoints.push(temp);
                            /* temp = { x: '',y: 0 };
                             that.lineData.datapoints.push(temp);*/
                        }
                        if (data.data.zoushi['31'] != undefined || 31<=dayNum) {
                            var temp = {x: '31号', y: data.data.zoushi['31'] || 0};
                            that.lineData.datapoints.push(temp);
                            /* temp = { x: '',y: 0 };
                             that.lineData.datapoints.push(temp);*/
                        }
                    } else if (type == 2) {
                        that.lineData = {
                            name: '数量',
                            datapoints: [
                                {x: '1周', y: data.data.zoushi['1'] || 0},
                                {x: '2周', y: data.data.zoushi['2'] || 0},
                                {x: '3周', y: data.data.zoushi['3'] || 0},
                                {x: '4周', y: data.data.zoushi['4'] || 0},
                                {x: '5周', y: data.data.zoushi['5'] || 0},
                                {x: '6周', y: data.data.zoushi['6'] || 0},
                                {x: '7周', y: data.data.zoushi['7'] || 0},
                                {x: '8周', y: data.data.zoushi['8'] || 0},
                                {x: '9周', y: data.data.zoushi['9'] || 0},
                                {x: '10周', y: data.data.zoushi['10'] || 0},
                                {x: '11周', y: data.data.zoushi['11'] || 0},
                                {x: '12周', y: data.data.zoushi['12'] || 0},
                                {x: '13周', y: data.data.zoushi['13'] || 0},
                                {x: '14周', y: data.data.zoushi['14'] || 0},
                                {x: '15周', y: data.data.zoushi['15'] || 0},
                                {x: '16周', y: data.data.zoushi['16'] || 0},
                                {x: '17周', y: data.data.zoushi['17'] || 0},
                                {x: '18周', y: data.data.zoushi['18'] || 0},
                                {x: '19周', y: data.data.zoushi['19'] || 0},
                                {x: '20周', y: data.data.zoushi['20'] || 0},
                                {x: '21周', y: data.data.zoushi['21'] || 0},
                                {x: '22周', y: data.data.zoushi['22'] || 0},
                                {x: '23周', y: data.data.zoushi['23'] || 0},
                                {x: '24周', y: data.data.zoushi['24'] || 0},
                                {x: '25周', y: data.data.zoushi['25'] || 0},
                                {x: '26周', y: data.data.zoushi['26'] || 0},
                                {x: '27周', y: data.data.zoushi['27'] || 0},
                                {x: '28周', y: data.data.zoushi['28'] || 0},
                                {x: '29周', y: data.data.zoushi['29'] || 0},
                                {x: '30周', y: data.data.zoushi['30'] || 0},
                                {x: '31周', y: data.data.zoushi['31'] || 0},
                                {x: '32周', y: data.data.zoushi['32'] || 0},
                                {x: '33周', y: data.data.zoushi['33'] || 0},
                                {x: '34周', y: data.data.zoushi['34'] || 0},
                                {x: '35周', y: data.data.zoushi['35'] || 0},
                                {x: '36周', y: data.data.zoushi['36'] || 0},
                                {x: '37周', y: data.data.zoushi['37'] || 0},
                                {x: '38周', y: data.data.zoushi['38'] || 0},
                                {x: '39周', y: data.data.zoushi['39'] || 0},
                                {x: '40周', y: data.data.zoushi['40'] || 0},
                                {x: '41周', y: data.data.zoushi['41'] || 0},
                                {x: '42周', y: data.data.zoushi['42'] || 0},
                                {x: '43周', y: data.data.zoushi['43'] || 0},
                                {x: '44周', y: data.data.zoushi['44'] || 0},
                                {x: '45周', y: data.data.zoushi['45'] || 0},
                                {x: '46周', y: data.data.zoushi['46'] || 0},
                                {x: '47周', y: data.data.zoushi['47'] || 0},
                                {x: '48周', y: data.data.zoushi['48'] || 0},
                                {x: '49周', y: data.data.zoushi['49'] || 0},
                                {x: '50周', y: data.data.zoushi['50'] || 0},
                                {x: '51周', y: data.data.zoushi['51'] || 0},
                                {x: '52周', y: data.data.zoushi['52'] || 0}

                            ]
                        };
                        if (data.data.zoushi['53'] != undefined ) {
                            var temp = {x: '31号', y: data.data.zoushi['31'] || 0};
                            that.lineData.datapoints.push(temp);
                            /* temp = { x: '',y: 0 };
                             that.lineData.datapoints.push(temp);*/
                        }
                    } else if (type == 3) {
                        that.lineData = {
                            name: '数量',
                            datapoints: [
                                {x: '1月', y: data.data.zoushi['1'] || 0},
                                {x: '2月', y: data.data.zoushi['2'] || 0},
                                {x: '3月', y: data.data.zoushi['3'] || 0},
                                {x: '4月', y: data.data.zoushi['4'] || 0},
                                {x: '5月', y: data.data.zoushi['5'] || 0},
                                {x: '6月', y: data.data.zoushi['6'] || 0},
                                {x: '7月', y: data.data.zoushi['7'] || 0},
                                {x: '8月', y: data.data.zoushi['8'] || 0},
                                {x: '9月', y: data.data.zoushi['9'] || 0},
                                {x: '10月', y: data.data.zoushi['10']|| 0},
                                {x: '11月', y: data.data.zoushi['11']|| 0},
                                {x: '12月', y: data.data.zoushi['12']|| 0}
                            ]
                        };
                        /*  if(data.data.zoushi.第五周 != undefined){
                         var temp = { x: '第五周', y: data.data.zoushi.第五周 || 0};
                         that.lineData.datapoints.push(temp);
                         /!*  temp = { x: '',y: 0 };
                         that.lineData.datapoints.push(temp);
                         that.lineData.datapoints.push(temp);*!/
                         }
                         if(data.data.zoushi.第六周 != undefined){
                         var temp = { x: '第六周', y: data.data.zoushi.第六周 || 0};
                         that.lineData.datapoints.push(temp);
                         /!* temp = { x: '',y: 0 };
                         that.lineData.datapoints.push(temp);*!/
                         }*/
                    }
                }

            /**
             * 处理top10 数据
             * @param that
             * @param data
             */
            function responseTop10Data(that,data){
                if(check_null(data.topTenMap)){
                    that.rank = data.topTenMap.rank || 0;
                    that.dataTop10 = data.topTenMap.list;
                }else{
                    that.rank = 0;
                }

            }

            /**
             * 添加top10 排序参数
             * @param that
             */
            function requestTop10Stort(that,tableState,obj){
                if(check_null(tableState.sort.predicate)){
                    //1、到访量  2、签单量  3、签单金额  4、推荐量  5、体验量 6、试听课时 7、成功订单 8、 消课课时
                    if(tableState.sort.predicate == 'daofang'){
                        obj.zoushiFlag = 1;
                    }else if(tableState.sort.predicate == 'qidan'){//2、签单量
                        obj.zoushiFlag = 2;
                    }else if(tableState.sort.predicate == 'jine'){// 3、签单金额
                        obj.zoushiFlag = 3;
                    }else if(tableState.sort.predicate == 'tuijian'){//4、推荐量
                        obj.zoushiFlag = 4;
                    }else if(tableState.sort.predicate == 'tiyan'){//5、体验量
                        obj.zoushiFlag = 5;
                    }else if(tableState.sort.predicate == 'shiting'){//6、试听课时
                        obj.zoushiFlag = 6;
                    }else if(tableState.sort.predicate == 'chenggong'){//7、成功订单
                        obj.zoushiFlag = 7;
                    }else if(tableState.sort.predicate == 'xiaoke'){//8、 消课课时
                        obj.zoushiFlag = 8;
                    }else if(tableState.sort.predicate == 'daofang'){
                        obj.zoushiFlag = 3;
                    }

                }
            }


            /**
             * 初始化  得到个人数据/团队数据 折线
             */
            function callDataCountDetail(that){
                var obj = {
                    positionId  :$scope.POSITION_ID,
                    dateType:that.lineConfig.dateType,//统计时间维度 1、日     2、周    3、月
                    dataType:that.requestDataType, //计数据维度 1、个人数据     2、团队数据
                    zoushiFlag:that.lineConfig.zoushiFlag
                };
                if(that.requestRoleId == 3||that.requestRoleId == 24 ){//校长和城市总监需要这个参数
                    obj.schoolMasterType=that.requestDataSchoolMasterType;//校长特有
                }
                //if(that.requestRoleId != 24 ) {//城市总监需要这个参数
                    _getDataCountDetail(obj, that);
                //}
            }


            /**
             * 调用Service 得到个人数据/团队数据 折线
             * @param obj
             *      dateType：统计时间维度 1、日   2、周   3、月
             *      dataType:计数据维度 1、个人数据 2、团队数据
             * @private
             */
            function _getDataCountDetail(obj,that){
               /* if(obj.dataType ==1 &&  obj.dateType==1 && (obj.requestRoleId!=9 && obj.requestRoleId!=10 )){//修复问题
                    obj.dateType = 2;
                }*/
                workbenchSvc.dataCountDetailService(obj).then(function (result) {
                    if($scope.ifResponseSuccess(result)){
                        $scope.responseZheData(obj.dateType,that,result.data);//调用处理data
                        if(obj.dateType == 1){
                            that.views.lineDayData = [ that.lineData ];//将返回数据写入页面
                        }else if(obj.dateType == 2){
                            that.views.lineData = [ that.lineData ];//将返回数据写入页面
                        }else if(obj.dateType == 3){
                            that.views.lineMonthData = [ that.lineData ];//将返回数据写入页面
                        }

                    }
                });
            }

            function getMingxi(that){
                if(that.pieConfig.dateType == 1){
                    if(!check_null(that.tableStateDay)){
                        that.tableStateDay = {
                            pagination:{}
                        };
                    }
                    _getMingxi(that,that.tableStateDay);
                }else if(that.pieConfig.dateType == 2){
                    if(!check_null(that.tableStateWeek)){
                        that.tableStateWeek = {
                            pagination:{}
                        };
                    }
                    _getMingxi(that,that.tableStateWeek);
                }else if(that.pieConfig.dateType == 3){
                    if(!check_null(that.tableStateMonth)){
                        that.tableStateMonth = {
                            pagination:{}
                        };
                    }
                    _getMingxi(that,that.tableStateMonth);
                }
            }

            /**
             * 调用Service层 得到明细list
             * {"type":1}提醒信息列表 {"type":2}到访信息列表 {"type":3}排课信息列表 {"type":4}续费信息列表  {"type":5}试听排课信息列表
             * @param that
             * @param tableState 分页参数
             * @private
             */
            function _getMingxi(that,tableState){
                var pagination = tableState.pagination;
                var obj = {
                    positionId:$scope.POSITION_ID,
                    dataType:that.requestDataType, //计数据维度 1、个人数据     2、团队数据
                    dateType:that.pieConfig.dateType,//统计时间维度 1、日     2、周    3、月
                    pageNum:pagination.start || 0,
                    pageSize:pagination.number || 10
                };
                if(that.requestRoleId == 3 ||that.requestRoleId == 24 ){//校长和城市总监需要这个参数
                    obj.schoolMasterType=that.requestDataSchoolMasterType;//校长特有
                    if( obj.schoolMasterType == 1){
                        return;//补丁， 校长 校区汇总 当前是不查查询明细
                    }

                }
                obj.pageNum = obj.pageNum/obj.pageSize +1;//分页必须的从1开始
                workbenchSvc.mingxiService(obj).then(function (result) {
                    if($scope.ifResponseSuccess(result)){
                        that.dataMingxi = result.data.data.page.list;
                        if(!check_null(that.tableState)){
                            that.tableState = tableState;
                        }
                        //tableState.pagination.numberOfPages = result.numberOfPages.pages;
                        that.tableState.pagination.numberOfPages = result.numberOfPages.pages || 0;//set the number of pages so the pagination can update
                        _setMingxiTableState(that,tableState);
                        that.tableState.pagination.start = (result.numberOfPages.pageNum-1) *result.numberOfPages.pageSize;
                    }
                });
            }
            function _setMingxiTableState(that,tableState){
                if(that.pieConfig.dateType == 1){
                    that.tableStateDay = tableState;
                }else if(that.pieConfig.dateType == 2){
                    that.tableStateWeek= tableState;
                }else if(that.pieConfig.dateType == 3){
                    that.tableStateMonth= tableState;
                }
            }

            /**
             * 调用Service 得到10强排名
             * @param obj.type排序条件
             * @private
             */
            function _getSortedTop10(that,tableState){
                var obj = {
                     positionId:$scope.POSITION_ID,
                    dataType:that.requestDataType, //计数据维度 1、个人数据     2、团队数据
                    dateType:3,//统计时间维度 1、日     2、周    3、月
                    sortedtype:2,//排序标识 1、正序 2、倒叙
                    zoushiFlag:3 //1、到访量  2、签单量  3、签单金额  4、推荐量  5、体验量 6、试听课时 7、成功订单 8、 消课课时
                };
                if(that.requestRoleId ==25){//教务主管 初始化条件特殊
                    obj.zoushiFlag = 8;
                }
                if(that.requestRoleId == 3||that.requestRoleId == 24 ){//校长和城市总监需要这个参数
                    obj.schoolMasterType=that.requestDataSchoolMasterType;//校长特有
                }
                $scope.requestTop10Stort(that,tableState,obj);

                workbenchSvc.sortedTop10Service(obj).then(function (result) {
                    if($scope.ifResponseSuccess(result,tableState)){
                        var data = result.data.data;
                        if(obj.zoushiFlag == 3){
                            tableState.sort.predicate ='jine' ;
                        }
                        if(that.requestRoleId ==25){//教务主管 初始化条件特殊
                            if(obj.zoushiFlag == 8){
                                tableState.sort.predicate ='xiaoke' ;
                            }
                        }

                        $scope.responseTop10Data(that,data);
                        tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                    }
                });
            }

            /**
             * 提醒 详情 判读是跳到leads 还是学员
             * state  1：学员  2：leads
             * @param datas
             */
            function toLeadsOrStudent(student){
                var data = angular.copy(student);
                var id =0;
                if(check_null(data.crm_student_id)){
                    id = data.crm_student_id;
                }else if(check_null(data.crmStudentId)){
                    id = data.crmStudentId;
                }
                if(check_null(data.state)){
                    if(data.state == 1){
                        $location.path('/sos-admin/customer_student/'+id);
                    }else if(data.state == 2){
                        $location.path('/fb-admin/leads_student/'+id);
                    }
                }
            }


            /****************工作流*************************/
            /**
             * 我发起
             * @returns {*}
             */
            function getWorkStart(that,tableState){
                WorkFlowService.getWorkStart().then(function (data) {
                  that.startLists =  _dealResponseData(data.data);
                },function(err){
                    SweetAlert.swal("查询失败")
                });
            }

            /**
             * 待我办
             * @returns {*}
             */
            function getWorkDeal(that,tableState){
                WorkFlowService.getWorkDeal().then(function (data) {
                    that.dealLists =  _dealResponseData(data.data);
                },function(err){
                    SweetAlert.swal("查询失败")
                });
            }

            /**
             * 我已办
             * @returns {*}
             */
            function getWorkFinish(that,tableState){
                WorkFlowService.getWorkFinish().then(function (data) {
                    that.finishLists =  _dealResponseData(data.data);
                },function(err){
                    SweetAlert.swal("查询失败")
                });
            }

            /**
             * 星标
             * @returns {*}
             */
            function getWorkStar(that,tableState){
                WorkFlowService.getWorkStar().then(function (data) {
                    that.starLists = _dealResponseData(data.data);
                },function(err){
                    SweetAlert.swal("查询失败")
                });
            }

            /**
             * 通过id 跳转到工作流详情
             * @param flow
             * @param type
             */
            function detailFlowRoute(flow,type){
                if(!check_null(type)){
                    type = 0;
                }
                if(check_null(flow.currentTaskId)){
                    $location.path('/workflowManager-admin/detail_workflow/'+flow.currentTaskId+'/'+type);
                }
            }

            function _dealResponseData(lists){
                if(lists && lists.length>0) {
                    for (var i = 0; i < lists.length; i++) {
                        var nameData = '';
                        nameData += lists[i].name + ' -- ' + lists[i].initOperator;
                        var stepData = '';
                        if (lists[i].status == 1 || lists[i].status == 3) {
                            stepData += '由' + lists[i].initOperator + '发起';
                            if (lists[i].lastOperator) {
                                stepData += ', ' + lists[i].lastOperator + '处理'
                            }
                        } else if (lists[i].status == 2) {
                            stepData += lists[i].lastOperator + '打回';
                            if (lists[i].reason) {
                                stepData += '， 原因：' + lists[i].reason;
                            }

                        } else if (lists[i].status == 4) {
                            stepData += '由' + lists[i].initOperator + '发起';
                            if (lists[i].lastOperator) {
                                stepData += ', ' + lists[i].lastOperator + '结束'
                            }
                        } else if (lists[i].status == 2) {
                            stepData += '草稿';
                        } else if (lists[i].status == 5) {
                            stepData += '已删除:'+lists[i].deleteReason;
                        } else {
                            stepData += '其它';
                        }
                        lists[i].stepData = stepData;
                        lists[i].nameData = nameData;
                    }
                }
                return lists;

            }

            /*************************************************************************************************************
             * *********************************************************************************************************/
            (function init(angular){
                _isViewsByRole();
                $scope.config = {
                    title: '',
                    width:document.body.clientWidth/3,
                    debug: true,
                    showXAxis: true,
                    showYAxis: true,
                    showLegend: true,
                    stack: false
                };
               /* $(window).resize(function(){//页面大小改变时 重新加载页面 因为
                    location.reload();
                });*/
            })(angular);

        }]);


    /**
     * 执行董事36 || 董事长39 角色对应的controller
     * 一个角色对应的controller 每一个角色对应一个controller
     */
    ywsApp.controller('workbench.directorCtrl',
        ['$scope', '$modal', '$rootScope', 'SweetAlert','workbenchSvc','$interval',
            function($scope, $modal, $rootScope, SweetAlert,workbenchSvc,$interval) {

                var oThis = this;

                $scope.callInfoWarn = callInfoWarn;
                $scope.callVisitWarn = callVisitWarn;
                $scope.callCourseWarn = callCourseWarn;
                $scope.callXufeiWarn = callXufeiWarn;
                $scope.callListenWarn = callListenWarn;

                /****************工作流*************************/
                $scope.callWorkStart =  callWorkStart;
                $scope.callWorkDeal  =  callWorkDeal;
                $scope.callWorkFinish = callWorkFinish;
                $scope.callWorkStar =   callWorkStar;

                /**
                 * 信息提醒
                 * @param tableState
                 */
                function callInfoWarn(tableState){
                    var pagination = tableState.pagination;
                    var obj = {
                        reminedType:1,
                        pageNum:pagination.start || 0,
                        pageSize:pagination.number || 10,
                        positionId  :$scope.POSITION_ID
                        /*positionId:$scope.POSITION_ID*/
                    };
                    _getWarnData(obj,tableState,1);

                }
                /**
                 * 到访提醒
                 * @param tableState
                 */
                function callVisitWarn(tableState){
                    var pagination = tableState.pagination;
                    var obj = {
                        reminedType:2,
                        pageNum:pagination.start || 0,
                        pageSize:pagination.number || 10,
                        positionId:$scope.POSITION_ID
                    };
                    _getWarnData(obj,tableState,2);
                }
                /**
                 * 上课提醒
                 * @param tableState
                 */
                function callCourseWarn(tableState){
                    var pagination = tableState.pagination;
                    var obj = {
                        reminedType:3,
                        pageNum:pagination.start || 0,
                        pageSize:pagination.number || 10,
                        positionId:$scope.POSITION_ID
                    };
                    _getWarnData(obj,tableState,3);
                }
                /**
                 * 续费提醒
                 * @param tableState
                 */
                function callXufeiWarn(tableState){
                    var pagination = tableState.pagination;
                    var obj = {
                        reminedType:4,
                        pageNum:pagination.start || 0,
                        pageSize:pagination.number || 10,
                        positionId:$scope.POSITION_ID
                    };
                    _getWarnData(obj,tableState,4);
                }
                /**
                 * 试听提醒
                 * @param tableState
                 */
                function callListenWarn(tableState){
                    var pagination = tableState.pagination;
                    var obj = {
                        reminedType:5,
                        pageNum:pagination.start || 0,
                        pageSize:pagination.number || 10,
                        positionId:$scope.POSITION_ID
                    };
                    _getWarnData(obj,tableState,5);
                }

                /****************工作流*************************/
                function callWorkStart(tableState){
                    $scope.getWorkStart(oThis,tableState);
                }
                function callWorkDeal(tableState){
                    $scope.getWorkDeal(oThis,tableState);
                }
                function callWorkFinish(tableState){
                    $scope.getWorkFinish(oThis,tableState);
                }
                function callWorkStar(tableState){
                    $scope.getWorkStar(oThis,tableState);
                }

                /**
                 * 调用Service层 得到信息list
                 * {"type":1}提醒信息列表 {"type":2}到访信息列表 {"type":3}排课信息列表 {"type":4}续费信息列表  {"type":5}试听排课信息列表
                 * @param obj
                 * @param tableState 分页参数
                 * @param type
                 * @private
                 */
                function _getWarnData(obj,tableState,type){
                    obj.pageNum = obj.pageNum/obj.pageSize +1;//分页必须的从1开始
                    workbenchSvc.remindService(obj).then(function (result) {
                        if($scope.ifResponseSuccess(result)){
                            $scope.responseWarnData(type,oThis,result);
                            tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                        }
                    });
                }

                (function init(){
                    //callInfoWarn
                    /*$scope.requestRoleId = 36;//初始化当前controller角色id  TODO id 是36和39*/
                })();
            }]);

    /**
     * 院长90 角色对应的controller
     * 一个角色对应的controller 每一个角色对应一个controller
     */
    ywsApp.controller('workbench.yuanzhangCtrl',
        ['$scope', '$modal', '$rootScope', 'SweetAlert','workbenchSvc','$interval',
            function($scope, $modal, $rootScope, SweetAlert,workbenchSvc,$interval) {

                var oThis = this;

                $scope.callInfoWarn = callInfoWarn;
                $scope.callVisitWarn = callVisitWarn;
                $scope.callCourseWarn = callCourseWarn;
                $scope.callXufeiWarn = callXufeiWarn;
                $scope.callListenWarn = callListenWarn;

                /****************工作流*************************/
                $scope.callWorkStart =  callWorkStart;
                $scope.callWorkDeal  =  callWorkDeal;
                $scope.callWorkFinish = callWorkFinish;
                $scope.callWorkStar =   callWorkStar;

                /**
                 * 信息提醒
                 * @param tableState
                 */
                function callInfoWarn(tableState){
                    var pagination = tableState.pagination;
                    var obj = {
                        reminedType:1,
                        pageNum:pagination.start || 0,
                        pageSize:pagination.number || 10,
                        positionId  :$scope.POSITION_ID
                        /*positionId:$scope.POSITION_ID*/
                    };
                    _getWarnData(obj,tableState,1);

                }
                /**
                 * 到访提醒
                 * @param tableState
                 */
                function callVisitWarn(tableState){
                    var pagination = tableState.pagination;
                    var obj = {
                        reminedType:2,
                        pageNum:pagination.start || 0,
                        pageSize:pagination.number || 10,
                        positionId:$scope.POSITION_ID
                    };
                    _getWarnData(obj,tableState,2);
                }
                /**
                 * 上课提醒
                 * @param tableState
                 */
                function callCourseWarn(tableState){
                    var pagination = tableState.pagination;
                    var obj = {
                        reminedType:3,
                        pageNum:pagination.start || 0,
                        pageSize:pagination.number || 10,
                        positionId:$scope.POSITION_ID
                    };
                    _getWarnData(obj,tableState,3);
                }
                /**
                 * 续费提醒
                 * @param tableState
                 */
                function callXufeiWarn(tableState){
                    var pagination = tableState.pagination;
                    var obj = {
                        reminedType:4,
                        pageNum:pagination.start || 0,
                        pageSize:pagination.number || 10,
                        positionId:$scope.POSITION_ID
                    };
                    _getWarnData(obj,tableState,4);
                }
                /**
                 * 试听提醒
                 * @param tableState
                 */
                function callListenWarn(tableState){
                    var pagination = tableState.pagination;
                    var obj = {
                        reminedType:5,
                        pageNum:pagination.start || 0,
                        pageSize:pagination.number || 10,
                        positionId:$scope.POSITION_ID
                    };
                    _getWarnData(obj,tableState,5);
                }

                /****************工作流*************************/
                function callWorkStart(tableState){
                    $scope.getWorkStart(oThis,tableState);
                }
                function callWorkDeal(tableState){
                    $scope.getWorkDeal(oThis,tableState);
                }
                function callWorkFinish(tableState){
                    $scope.getWorkFinish(oThis,tableState);
                }
                function callWorkStar(tableState){
                    $scope.getWorkStar(oThis,tableState);
                }

                /**
                 * 调用Service层 得到信息list
                 * {"type":1}提醒信息列表 {"type":2}到访信息列表 {"type":3}排课信息列表 {"type":4}续费信息列表  {"type":5}试听排课信息列表
                 * @param obj
                 * @param tableState 分页参数
                 * @param type
                 * @private
                 */
                function _getWarnData(obj,tableState,type){
                    obj.pageNum = obj.pageNum/obj.pageSize +1;//分页必须的从1开始
                    workbenchSvc.remindService(obj).then(function (result) {
                        if($scope.ifResponseSuccess(result)){
                            $scope.responseWarnData(type,oThis,result);
                            tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                        }
                    });
                }

                (function init(){
                    //callInfoWarn
                    /*$scope.requestRoleId = 36;//初始化当前controller角色id  TODO id 是36和39*/
                })();
            }]);
        /**
         * 评价汇总数据对应的controller
         * 每种数据类型对应一个controller
         */
        ywsApp.controller('workbench.yuanzhang.pingjiaCtrl',
            ['$scope', '$modal', '$rootScope', 'SweetAlert','workbenchSvc','$interval',
                function($scope, $modal, $rootScope, SweetAlert,workbenchSvc,$interval) {
                    var oThis = this;
                    oThis.views = {
                        isShowTop10:false,
                        isShowDetail:false,
                        isLineMonth:false,
                        updateTimeDsc:'日差评为当天提交评价，月差评为当月提交差评；提分率与满意度为当月统计数据。',
                    };

                    oThis._getDataCount = _getDataCount;

                    $scope.views.lineData =[];

                    oThis.callDataCount = callDataCount;
                    oThis.callDataTop10 = callDataTop10;
                    oThis.callDataMinxi = callDataMinxi;

                    //---------------------------------------ctrl方法-------------------------------------

                    /**
                     * 得到个人数据/团队数据 饼图
                     */
                    function callDataCount(){
                        var obj = {
                            positionId:$scope.POSITION_ID,
                            dateType:oThis.pieConfig.dateType,//统计时间维度 1、日     2、周    3、月
                            schoolMasterType:oThis.requestDataSchoolMasterType,//校长特有
                            dataType:oThis.requestDataType //计数据维度 1、个人数据     2、团队数据
                        };
                        _getDataCount(obj);
                    }
                    /**
                     * 调用Service 得到个人数据/团队数据 饼图
                     * @param obj
                     *      dateType：统计时间维度 1、日   2、周   3、月
                     *      dataType:计数据维度 1、个人数据 2、团队数据
                     * @private
                     */
                    function _getDataCount(obj){
                        workbenchSvc.dataCountService(obj).then(function (result) {
                            if($scope.ifResponseSuccess(result)){
                                var data = result.data;
                                oThis.views.pieData =$scope.responsePieData(data);
                            }
                        });
                    }

                    /**
                     * 得到top10 数据
                     * 因为使用smartTable  callDataTop10的参数必须是tableState 所以callDataTop10 无法抽取为父类方法
                     * @param tableState
                     */
                    function callDataTop10(tableState){
                        var obj = {
                            positionId:$scope.POSITION_ID,
                            dataType:oThis.requestDataType //计数据维度 1、个人数据     2、团队数据
                        };
                        $scope._getSortedTop10(oThis,tableState);
                    }

                    function callDataMinxi(tableState){
                        oThis.tableState = tableState;
                        $scope._getMingxi(oThis,tableState);

                    }

                    /*************************************************************************************************************
                     * *********************************************************************************************************/
                    (function init($scope){
                        oThis.requestRoleId = $scope.requestRoleId;//得到角色id
                        oThis.requestDataType = 3;// dataType:计数据维度 1、个人数据 2、团队数据 3评价汇总
                        oThis.requestDataSchoolMasterType =7;// 校长页面tab类型 1、校长数据  2、营销数据（课程顾问主管数据） 3、学管数据  4、教务数据  5、外呼数据  6、市场数据 7、评价tab
                        oThis.pieConfig ={
                            dateType:1,
                            dataType:oThis.requestDataType
                        };
                        oThis.lineConfig = {
                            dateType:1,
                            dataType:oThis.requestDataType,
                            zoushiFlag:1
                        };

                        oThis.classDataType = 'workbench-xiaozhang-huizong';

                        oThis.callDataCount();
                        $scope.callDataCountDetail(oThis);


                    })($scope);
                }]);
    /**
     * 区域总监51 角色对应的controller
     * 一个角色对应的controller 每一个角色对应一个controller
     */
    ywsApp.controller('workbench.quyuCtrl',
        ['$scope', '$modal', '$rootScope', 'SweetAlert','workbenchSvc','$interval',
            function($scope, $modal, $rootScope, SweetAlert,workbenchSvc,$interval) {

                var oThis = this;

                $scope.callInfoWarn = callInfoWarn;
                $scope.callVisitWarn = callVisitWarn;
                $scope.callCourseWarn = callCourseWarn;
                $scope.callXufeiWarn = callXufeiWarn;
                $scope.callListenWarn = callListenWarn;

                /****************工作流*************************/
                $scope.callWorkStart =  callWorkStart;
                $scope.callWorkDeal  =  callWorkDeal;
                $scope.callWorkFinish = callWorkFinish;
                $scope.callWorkStar =   callWorkStar;

                /**
                 * 信息提醒
                 * @param tableState
                 */
                function callInfoWarn(tableState){
                    var pagination = tableState.pagination;
                    var obj = {
                        reminedType:1,
                        pageNum:pagination.start || 0,
                        pageSize:pagination.number || 10,
                        positionId  :$scope.POSITION_ID
                        /*positionId:$scope.POSITION_ID*/
                    };
                    _getWarnData(obj,tableState,1);

                }
                /**
                 * 到访提醒
                 * @param tableState
                 */
                function callVisitWarn(tableState){
                    var pagination = tableState.pagination;
                    var obj = {
                        reminedType:2,
                        pageNum:pagination.start || 0,
                        pageSize:pagination.number || 10,
                        positionId:$scope.POSITION_ID
                    };
                    _getWarnData(obj,tableState,2);
                }
                /**
                 * 上课提醒
                 * @param tableState
                 */
                function callCourseWarn(tableState){
                    var pagination = tableState.pagination;
                    var obj = {
                        reminedType:3,
                        pageNum:pagination.start || 0,
                        pageSize:pagination.number || 10,
                        positionId:$scope.POSITION_ID
                    };
                    _getWarnData(obj,tableState,3);
                }
                /**
                 * 续费提醒
                 * @param tableState
                 */
                function callXufeiWarn(tableState){
                    var pagination = tableState.pagination;
                    var obj = {
                        reminedType:4,
                        pageNum:pagination.start || 0,
                        pageSize:pagination.number || 10,
                        positionId:$scope.POSITION_ID
                    };
                    _getWarnData(obj,tableState,4);
                }
                /**
                 * 试听提醒
                 * @param tableState
                 */
                function callListenWarn(tableState){
                    var pagination = tableState.pagination;
                    var obj = {
                        reminedType:5,
                        pageNum:pagination.start || 0,
                        pageSize:pagination.number || 10,
                        positionId:$scope.POSITION_ID
                    };
                    _getWarnData(obj,tableState,5);
                }

                /****************工作流*************************/
                function callWorkStart(tableState){
                    $scope.getWorkStart(oThis,tableState);
                }
                function callWorkDeal(tableState){
                    $scope.getWorkDeal(oThis,tableState);
                }
                function callWorkFinish(tableState){
                    $scope.getWorkFinish(oThis,tableState);
                }
                function callWorkStar(tableState){
                    $scope.getWorkStar(oThis,tableState);
                }

                /**
                 * 调用Service层 得到信息list
                 * {"type":1}提醒信息列表 {"type":2}到访信息列表 {"type":3}排课信息列表 {"type":4}续费信息列表  {"type":5}试听排课信息列表
                 * @param obj
                 * @param tableState 分页参数
                 * @param type
                 * @private
                 */
                function _getWarnData(obj,tableState,type){
                    obj.pageNum = obj.pageNum/obj.pageSize +1;//分页必须的从1开始
                    workbenchSvc.remindService(obj).then(function (result) {
                        if($scope.ifResponseSuccess(result)){
                            $scope.responseWarnData(type,oThis,result);
                            tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                        }
                    });
                }

                (function init(){
                    //callInfoWarn
                    /*$scope.requestRoleId = 36;//初始化当前controller角色id  TODO id 是36和39*/
                })();
            }]);
        /**
         * 评价汇总数据对应的controller
         * 每种数据类型对应一个controller
         */
        ywsApp.controller('workbench.quyu.pingjiaCtrl',
            ['$scope', '$modal', '$rootScope', 'SweetAlert','workbenchSvc','$interval',
                function($scope, $modal, $rootScope, SweetAlert,workbenchSvc,$interval) {
                    var oThis = this;
                    oThis.views = {
                        isShowTop10:false,
                        isShowDetail:false,
                        isLineMonth:false,
                        updateTimeDsc:'日差评为当天提交评价，月差评为当月提交差评；提分率与满意度为当月统计数据。',
                    };

                    oThis._getDataCount = _getDataCount;

                    $scope.views.lineData =[];

                    oThis.callDataCount = callDataCount;
                    oThis.callDataTop10 = callDataTop10;
                    oThis.callDataMinxi = callDataMinxi;

                    //---------------------------------------ctrl方法-------------------------------------

                    /**
                     * 得到个人数据/团队数据 饼图
                     */
                    function callDataCount(){
                        var obj = {
                            positionId:$scope.POSITION_ID,
                            dateType:oThis.pieConfig.dateType,//统计时间维度 1、日     2、周    3、月
                            schoolMasterType:oThis.requestDataSchoolMasterType,//校长特有
                            dataType:oThis.requestDataType //计数据维度 1、个人数据     2、团队数据
                        };
                        _getDataCount(obj);
                    }
                    /**
                     * 调用Service 得到个人数据/团队数据 饼图
                     * @param obj
                     *      dateType：统计时间维度 1、日   2、周   3、月
                     *      dataType:计数据维度 1、个人数据 2、团队数据
                     * @private
                     */
                    function _getDataCount(obj){
                        workbenchSvc.dataCountService(obj).then(function (result) {
                            if($scope.ifResponseSuccess(result)){
                                var data = result.data;
                                oThis.views.pieData =$scope.responsePieData(data);
                            }
                        });
                    }

                    /**
                     * 得到top10 数据
                     * 因为使用smartTable  callDataTop10的参数必须是tableState 所以callDataTop10 无法抽取为父类方法
                     * @param tableState
                     */
                    function callDataTop10(tableState){
                        var obj = {
                            positionId:$scope.POSITION_ID,
                            dataType:oThis.requestDataType //计数据维度 1、个人数据     2、团队数据
                        };
                        $scope._getSortedTop10(oThis,tableState);
                    }

                    function callDataMinxi(tableState){
                        oThis.tableState = tableState;
                        $scope._getMingxi(oThis,tableState);

                    }

                    /*************************************************************************************************************
                     * *********************************************************************************************************/
                    (function init($scope){
                        oThis.requestRoleId = $scope.requestRoleId;//得到角色id
                        oThis.requestDataType = 3;// dataType:计数据维度 1、个人数据 2、团队数据 3评价汇总
                        oThis.requestDataSchoolMasterType =7;// 校长页面tab类型 1、校长数据  2、营销数据（课程顾问主管数据） 3、学管数据  4、教务数据  5、外呼数据  6、市场数据 7、评价tab
                        oThis.pieConfig ={
                            dateType:1,
                            dataType:oThis.requestDataType
                        };
                        oThis.lineConfig = {
                            dateType:1,
                            dataType:oThis.requestDataType,
                            zoushiFlag:1
                        };

                        oThis.classDataType = 'workbench-xiaozhang-huizong';

                        oThis.callDataCount();
                        $scope.callDataCountDetail(oThis);


                    })($scope);
                }]);

    /**
     * 大区总监 角色对应的controller
     * 一个角色对应的controller 每一个角色对应一个controller
     */
    ywsApp.controller('workbench.daQuMasterCtrl',
        ['$scope', '$modal', '$rootScope', 'SweetAlert','workbenchSvc','$interval',
            function($scope, $modal, $rootScope, SweetAlert,workbenchSvc,$interval) {

                var oThis = this;

                $scope.callInfoWarn = callInfoWarn;
                $scope.callVisitWarn = callVisitWarn;
                $scope.callCourseWarn = callCourseWarn;
                $scope.callXufeiWarn = callXufeiWarn;
                $scope.callListenWarn = callListenWarn;

                /****************工作流*************************/
                $scope.callWorkStart =  callWorkStart;
                $scope.callWorkDeal  =  callWorkDeal;
                $scope.callWorkFinish = callWorkFinish;
                $scope.callWorkStar =   callWorkStar;

                /**
                 * 信息提醒
                 * @param tableState
                 */
                function callInfoWarn(tableState){
                    var pagination = tableState.pagination;
                    var obj = {
                        reminedType:1,
                        pageNum:pagination.start || 0,
                        pageSize:pagination.number || 10,
                        positionId  :$scope.POSITION_ID
                        /*positionId:$scope.POSITION_ID*/
                    };
                    _getWarnData(obj,tableState,1);

                }
                /**
                 * 到访提醒
                 * @param tableState
                 */
                function callVisitWarn(tableState){
                    var pagination = tableState.pagination;
                    var obj = {
                        reminedType:2,
                        pageNum:pagination.start || 0,
                        pageSize:pagination.number || 10,
                        positionId:$scope.POSITION_ID
                    };
                    _getWarnData(obj,tableState,2);
                }
                /**
                 * 上课提醒
                 * @param tableState
                 */
                function callCourseWarn(tableState){
                    var pagination = tableState.pagination;
                    var obj = {
                        reminedType:3,
                        pageNum:pagination.start || 0,
                        pageSize:pagination.number || 10,
                        positionId:$scope.POSITION_ID
                    };
                    _getWarnData(obj,tableState,3);
                }
                /**
                 * 续费提醒
                 * @param tableState
                 */
                function callXufeiWarn(tableState){
                    var pagination = tableState.pagination;
                    var obj = {
                        reminedType:4,
                        pageNum:pagination.start || 0,
                        pageSize:pagination.number || 10,
                        positionId:$scope.POSITION_ID
                    };
                    _getWarnData(obj,tableState,4);
                }
                /**
                 * 试听提醒
                 * @param tableState
                 */
                function callListenWarn(tableState){
                    var pagination = tableState.pagination;
                    var obj = {
                        reminedType:5,
                        pageNum:pagination.start || 0,
                        pageSize:pagination.number || 10,
                        positionId:$scope.POSITION_ID
                    };
                    _getWarnData(obj,tableState,5);
                }

                /****************工作流*************************/
                function callWorkStart(tableState){
                    $scope.getWorkStart(oThis,tableState);
                }
                function callWorkDeal(tableState){
                    $scope.getWorkDeal(oThis,tableState);
                }
                function callWorkFinish(tableState){
                    $scope.getWorkFinish(oThis,tableState);
                }
                function callWorkStar(tableState){
                    $scope.getWorkStar(oThis,tableState);
                }

                /**
                 * 调用Service层 得到信息list
                 * {"type":1}提醒信息列表 {"type":2}到访信息列表 {"type":3}排课信息列表 {"type":4}续费信息列表  {"type":5}试听排课信息列表
                 * @param obj
                 * @param tableState 分页参数
                 * @param type
                 * @private
                 */
                function _getWarnData(obj,tableState,type){
                    obj.pageNum = obj.pageNum/obj.pageSize +1;//分页必须的从1开始
                    workbenchSvc.remindService(obj).then(function (result) {
                        if($scope.ifResponseSuccess(result)){
                            $scope.responseWarnData(type,oThis,result);
                            tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                        }
                    });
                }

                (function init(){
                    //callInfoWarn
                    /*$scope.requestRoleId = 36;//初始化当前controller角色id  TODO id 是36和39*/
                })();
            }]);
        /**
         * 评价汇总数据对应的controller
         * 每种数据类型对应一个controller
         */
        ywsApp.controller('workbench.daQuMaster.pingjiaCtrl',
            ['$scope', '$modal', '$rootScope', 'SweetAlert','workbenchSvc','$interval',
                function($scope, $modal, $rootScope, SweetAlert,workbenchSvc,$interval) {
                    var oThis = this;
                    oThis.views = {
                        isShowTop10:false,
                        isShowDetail:false,
                        isLineMonth:false,
                        updateTimeDsc:'日差评为当天提交评价，月差评为当月提交差评；提分率与满意度为当月统计数据。',
                    };

                    oThis._getDataCount = _getDataCount;

                    $scope.views.lineData =[];

                    oThis.callDataCount = callDataCount;
                    oThis.callDataTop10 = callDataTop10;
                    oThis.callDataMinxi = callDataMinxi;

                    //---------------------------------------ctrl方法-------------------------------------

                    /**
                     * 得到个人数据/团队数据 饼图
                     */
                    function callDataCount(){
                        var obj = {
                            positionId:$scope.POSITION_ID,
                            dateType:oThis.pieConfig.dateType,//统计时间维度 1、日     2、周    3、月
                            schoolMasterType:oThis.requestDataSchoolMasterType,//校长特有
                            dataType:oThis.requestDataType //计数据维度 1、个人数据     2、团队数据
                        };
                        _getDataCount(obj);
                    }
                    /**
                     * 调用Service 得到个人数据/团队数据 饼图
                     * @param obj
                     *      dateType：统计时间维度 1、日   2、周   3、月
                     *      dataType:计数据维度 1、个人数据 2、团队数据
                     * @private
                     */
                    function _getDataCount(obj){
                        workbenchSvc.dataCountService(obj).then(function (result) {
                            if($scope.ifResponseSuccess(result)){
                                var data = result.data;
                                oThis.views.pieData =$scope.responsePieData(data);
                            }
                        });
                    }

                    /**
                     * 得到top10 数据
                     * 因为使用smartTable  callDataTop10的参数必须是tableState 所以callDataTop10 无法抽取为父类方法
                     * @param tableState
                     */
                    function callDataTop10(tableState){
                        var obj = {
                            positionId:$scope.POSITION_ID,
                            dataType:oThis.requestDataType //计数据维度 1、个人数据     2、团队数据
                        };
                        $scope._getSortedTop10(oThis,tableState);
                    }

                    function callDataMinxi(tableState){
                        oThis.tableState = tableState;
                        $scope._getMingxi(oThis,tableState);

                    }

                    /*************************************************************************************************************
                     * *********************************************************************************************************/
                    (function init($scope){
                        oThis.requestRoleId = $scope.requestRoleId;//得到角色id
                        oThis.requestDataType = 3;// dataType:计数据维度 1、个人数据 2、团队数据 3评价汇总
                        oThis.requestDataSchoolMasterType =7;// 校长页面tab类型 1、校长数据  2、营销数据（课程顾问主管数据） 3、学管数据  4、教务数据  5、外呼数据  6、市场数据 7、评价tab
                        oThis.pieConfig ={
                            dateType:1,
                            dataType:oThis.requestDataType
                        };
                        oThis.lineConfig = {
                            dateType:1,
                            dataType:oThis.requestDataType,
                            zoushiFlag:1
                        };

                        oThis.classDataType = 'workbench-xiaozhang-huizong';

                        oThis.callDataCount();
                        $scope.callDataCountDetail(oThis);


                    })($scope);
                }]);

    /**
     * 一对一经理对应的controller
     * 一个角色对应的controller 每一个角色对应一个controller
     */
    ywsApp.controller('workbench.oneToOneCtrl',
        ['$scope', '$modal', '$rootScope', 'SweetAlert','workbenchSvc','$interval',
            function($scope, $modal, $rootScope, SweetAlert,workbenchSvc,$interval) {

                var oThis = this;

                $scope.callInfoWarn = callInfoWarn;
                $scope.callVisitWarn = callVisitWarn;
                $scope.callCourseWarn = callCourseWarn;
                $scope.callXufeiWarn = callXufeiWarn;
                $scope.callListenWarn = callListenWarn;

                /****************工作流*************************/
                $scope.callWorkStart =  callWorkStart;
                $scope.callWorkDeal  =  callWorkDeal;
                $scope.callWorkFinish = callWorkFinish;
                $scope.callWorkStar =   callWorkStar;

                /**
                 * 信息提醒
                 * @param tableState
                 */
                function callInfoWarn(tableState){
                    var pagination = tableState.pagination;
                    var obj = {
                        reminedType:1,
                        pageNum:pagination.start || 0,
                        pageSize:pagination.number || 10,
                        positionId  :$scope.POSITION_ID
                        /*positionId:$scope.POSITION_ID*/
                    };
                    _getWarnData(obj,tableState,1);

                }
                /**
                 * 到访提醒
                 * @param tableState
                 */
                function callVisitWarn(tableState){
                    var pagination = tableState.pagination;
                    var obj = {
                        reminedType:2,
                        pageNum:pagination.start || 0,
                        pageSize:pagination.number || 10,
                        positionId:$scope.POSITION_ID
                    };
                    _getWarnData(obj,tableState,2);
                }
                /**
                 * 上课提醒
                 * @param tableState
                 */
                function callCourseWarn(tableState){
                    var pagination = tableState.pagination;
                    var obj = {
                        reminedType:3,
                        pageNum:pagination.start || 0,
                        pageSize:pagination.number || 10,
                        positionId:$scope.POSITION_ID
                    };
                    _getWarnData(obj,tableState,3);
                }
                /**
                 * 续费提醒
                 * @param tableState
                 */
                function callXufeiWarn(tableState){
                    var pagination = tableState.pagination;
                    var obj = {
                        reminedType:4,
                        pageNum:pagination.start || 0,
                        pageSize:pagination.number || 10,
                        positionId:$scope.POSITION_ID
                    };
                    _getWarnData(obj,tableState,4);
                }
                /**
                 * 试听提醒
                 * @param tableState
                 */
                function callListenWarn(tableState){
                    var pagination = tableState.pagination;
                    var obj = {
                        reminedType:5,
                        pageNum:pagination.start || 0,
                        pageSize:pagination.number || 10,
                        positionId:$scope.POSITION_ID
                    };
                    _getWarnData(obj,tableState,5);
                }

                /****************工作流*************************/
                function callWorkStart(tableState){
                    $scope.getWorkStart(oThis,tableState);
                }
                function callWorkDeal(tableState){
                    $scope.getWorkDeal(oThis,tableState);
                }
                function callWorkFinish(tableState){
                    $scope.getWorkFinish(oThis,tableState);
                }
                function callWorkStar(tableState){
                    $scope.getWorkStar(oThis,tableState);
                }

                /**
                 * 调用Service层 得到信息list
                 * {"type":1}提醒信息列表 {"type":2}到访信息列表 {"type":3}排课信息列表 {"type":4}续费信息列表  {"type":5}试听排课信息列表
                 * @param obj
                 * @param tableState 分页参数
                 * @param type
                 * @private
                 */
                function _getWarnData(obj,tableState,type){
                    obj.pageNum = obj.pageNum/obj.pageSize +1;//分页必须的从1开始
                    workbenchSvc.remindService(obj).then(function (result) {
                        if($scope.ifResponseSuccess(result)){
                            $scope.responseWarnData(type,oThis,result);
                            tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                        }
                    });
                }

                (function init(){
                    //callInfoWarn
                   /* $scope.requestRoleId = 36;//初始化当前controller角色id  TODO id 是36和39*/
                })();
            }]);
        /**
         * 评价汇总数据对应的controller
         * 每种数据类型对应一个controller
         */
        ywsApp.controller('workbench.oneToOne.pingjiaCtrl',
            ['$scope', '$modal', '$rootScope', 'SweetAlert','workbenchSvc','$interval',
                function($scope, $modal, $rootScope, SweetAlert,workbenchSvc,$interval) {
                    var oThis = this;
                    oThis.views = {
                        isShowTop10:false,
                        isShowDetail:false,
                        isLineMonth:false,
                        updateTimeDsc:'日差评为当天提交评价，月差评为当月提交差评；提分率与满意度为当月统计数据。',
                    };

                    oThis._getDataCount = _getDataCount;

                    $scope.views.lineData =[];

                    oThis.callDataCount = callDataCount;
                    oThis.callDataTop10 = callDataTop10;
                    oThis.callDataMinxi = callDataMinxi;

                    //---------------------------------------ctrl方法-------------------------------------

                    /**
                     * 得到个人数据/团队数据 饼图
                     */
                    function callDataCount(){
                        var obj = {
                            positionId:$scope.POSITION_ID,
                            dateType:oThis.pieConfig.dateType,//统计时间维度 1、日     2、周    3、月
                            schoolMasterType:oThis.requestDataSchoolMasterType,//校长特有
                            dataType:oThis.requestDataType //计数据维度 1、个人数据     2、团队数据
                        };
                        _getDataCount(obj);
                    }
                    /**
                     * 调用Service 得到个人数据/团队数据 饼图
                     * @param obj
                     *      dateType：统计时间维度 1、日   2、周   3、月
                     *      dataType:计数据维度 1、个人数据 2、团队数据
                     * @private
                     */
                    function _getDataCount(obj){
                        workbenchSvc.dataCountService(obj).then(function (result) {
                            if($scope.ifResponseSuccess(result)){
                                var data = result.data;
                                oThis.views.pieData =$scope.responsePieData(data);
                            }
                        });
                    }

                    /**
                     * 得到top10 数据
                     * 因为使用smartTable  callDataTop10的参数必须是tableState 所以callDataTop10 无法抽取为父类方法
                     * @param tableState
                     */
                    function callDataTop10(tableState){
                        var obj = {
                            positionId:$scope.POSITION_ID,
                            dataType:oThis.requestDataType //计数据维度 1、个人数据     2、团队数据
                        };
                        $scope._getSortedTop10(oThis,tableState);
                    }

                    function callDataMinxi(tableState){
                        oThis.tableState = tableState;
                        $scope._getMingxi(oThis,tableState);

                    }

                    /*************************************************************************************************************
                     * *********************************************************************************************************/
                    (function init($scope){
                        oThis.requestRoleId = $scope.requestRoleId;//得到角色id
                        oThis.requestDataType = 3;// dataType:计数据维度 1、个人数据 2、团队数据 3评价汇总
                        oThis.requestDataSchoolMasterType =7;// 校长页面tab类型 1、校长数据  2、营销数据（课程顾问主管数据） 3、学管数据  4、教务数据  5、外呼数据  6、市场数据 7、评价tab
                        oThis.pieConfig ={
                            dateType:1,
                            dataType:oThis.requestDataType
                        };
                        oThis.lineConfig = {
                            dateType:1,
                            dataType:oThis.requestDataType,
                            zoushiFlag:1
                        };

                        oThis.classDataType = 'workbench-xiaozhang-huizong';

                        oThis.callDataCount();
                        $scope.callDataCountDetail(oThis);


                    })($scope);
                }]);

    /**
     * 校长 角色对应的controller
     * 一个角色对应的controller 每一个角色对应一个controller
     */
    ywsApp.controller('workbench.xiaozhangCtrl',
        ['$scope', '$modal', '$rootScope', 'SweetAlert','workbenchSvc','$interval',
            function($scope, $modal, $rootScope, SweetAlert,workbenchSvc,$interval) {

                var oThis = this;

                $scope.callInfoWarn = callInfoWarn;
                $scope.callVisitWarn = callVisitWarn;
                $scope.callCourseWarn = callCourseWarn;
                $scope.callXufeiWarn = callXufeiWarn;
                $scope.callListenWarn = callListenWarn;

                /****************工作流*************************/
                $scope.callWorkStart =  callWorkStart;
                $scope.callWorkDeal  =  callWorkDeal;
                $scope.callWorkFinish = callWorkFinish;
                $scope.callWorkStar =   callWorkStar;

                /**
                 * 信息提醒
                 * @param tableState
                 */
                function callInfoWarn(tableState){
                    var pagination = tableState.pagination;
                    var obj = {
                        reminedType:1,
                        pageNum:pagination.start || 0,
                        pageSize:pagination.number || 10,
                        positionId:$scope.POSITION_ID
                    };
                    _getWarnData(obj,tableState,1);

                }
                /**
                 * 到访提醒
                 * @param tableState
                 */
                function callVisitWarn(tableState){
                    var pagination = tableState.pagination;
                    var obj = {
                        reminedType:2,
                        pageNum:pagination.start || 0,
                        pageSize:pagination.number || 10,
                        positionId:$scope.POSITION_ID
                    };
                    _getWarnData(obj,tableState,2);
                }
                /**
                 * 上课提醒
                 * @param tableState
                 */
                function callCourseWarn(tableState){
                    var pagination = tableState.pagination;
                    var obj = {
                        reminedType:3,
                        pageNum:pagination.start || 0,
                        pageSize:pagination.number || 10,
                        positionId:$scope.POSITION_ID
                    };
                    _getWarnData(obj,tableState,3);
                }
                /**
                 * 续费提醒
                 * @param tableState
                 */
                function callXufeiWarn(tableState){
                    var pagination = tableState.pagination;
                    var obj = {
                        reminedType:4,
                        pageNum:pagination.start || 0,
                        pageSize:pagination.number || 10,
                        positionId:$scope.POSITION_ID
                    };
                    _getWarnData(obj,tableState,4);
                }
                /**
                 * 试听提醒
                 * @param tableState
                 */
                function callListenWarn(tableState){
                    var pagination = tableState.pagination;
                    var obj = {
                        reminedType:5,
                        pageNum:pagination.start || 0,
                        pageSize:pagination.number || 10,
                        positionId:$scope.POSITION_ID
                    };
                    _getWarnData(obj,tableState,5);
                }

                /****************工作流*************************/
                function callWorkStart(tableState){
                    $scope.getWorkStart(oThis,tableState);
                }
                function callWorkDeal(tableState){
                    $scope.getWorkDeal(oThis,tableState);
                }
                function callWorkFinish(tableState){
                    $scope.getWorkFinish(oThis,tableState);
                }
                function callWorkStar(tableState){
                    $scope.getWorkStar(oThis,tableState);
                }

                /**
                 * 调用Service层 得到信息list
                 * {"type":1}提醒信息列表 {"type":2}到访信息列表 {"type":3}排课信息列表 {"type":4}续费信息列表  {"type":5}试听排课信息列表
                 * @param obj
                 * @param tableState 分页参数
                 * @param type
                 * @private
                 */
                function _getWarnData(obj,tableState,type){
                    obj.pageNum = obj.pageNum/obj.pageSize +1;//分页必须的从1开始
                    workbenchSvc.remindService(obj).then(function (result) {
                        if($scope.ifResponseSuccess(result)){
                            $scope.responseWarnData(type,oThis,result);
                            tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                        }
                    });
                }

                (function init(){
                    //callInfoWarn
                    $scope.requestRoleId = 3;//初始化当前controller角色id
                })();
            }]);

        /**
         * 校区汇总数据对应的controller
         * 每种数据类型对应一个controller
         */
        ywsApp.controller('workbench.xiaozhang.huizongCtrl',
            ['$scope', '$modal', '$rootScope', 'SweetAlert','workbenchSvc','$interval',
                function($scope, $modal, $rootScope, SweetAlert,workbenchSvc,$interval) {
                    var oThis = this;
                    oThis.views = {
                        isShowTop10:false,
                        isShowDetail:false,
                        isLineMonth:false,
                        updateTimeDsc:'日统计数据每30分钟更新一次，最新统计时间：'+Hours30(new Date()),
                    };

                    oThis._getDataCount = _getDataCount;

                    $scope.views.lineData =[];

                    oThis.callDataCount = callDataCount;
                    oThis.callDataTop10 = callDataTop10;
                    oThis.callDataMinxi = callDataMinxi;

                    //---------------------------------------ctrl方法-------------------------------------

                    /**
                     * 得到个人数据/团队数据 饼图
                     */
                    function callDataCount(){
                        var obj = {
                            positionId:$scope.POSITION_ID,
                            dateType:oThis.pieConfig.dateType,//统计时间维度 1、日     2、周    3、月
                            schoolMasterType:oThis.requestDataSchoolMasterType,//校长特有
                            dataType:oThis.requestDataType //计数据维度 1、个人数据     2、团队数据
                        };
                        _getDataCount(obj);
                    }
                    /**
                     * 调用Service 得到个人数据/团队数据 饼图
                     * @param obj
                     *      dateType：统计时间维度 1、日   2、周   3、月
                     *      dataType:计数据维度 1、个人数据 2、团队数据
                     * @private
                     */
                    function _getDataCount(obj){
                        workbenchSvc.dataCountService(obj).then(function (result) {
                            if($scope.ifResponseSuccess(result)){
                                var data = result.data;
                                oThis.views.pieData =$scope.responsePieData(data);
                            }
                        });
                    }

                    /**
                     * 得到top10 数据
                     * 因为使用smartTable  callDataTop10的参数必须是tableState 所以callDataTop10 无法抽取为父类方法
                     * @param tableState
                     */
                    function callDataTop10(tableState){
                        var obj = {
                            positionId:$scope.POSITION_ID,
                            dataType:oThis.requestDataType //计数据维度 1、个人数据     2、团队数据
                        };
                        $scope._getSortedTop10(oThis,tableState);
                    }

                    function callDataMinxi(tableState){
                        oThis.tableState = tableState;
                        $scope._getMingxi(oThis,tableState);

                    }

                    /*************************************************************************************************************
                     * *********************************************************************************************************/
                    (function init($scope){
                        oThis.requestRoleId = $scope.requestRoleId;//得到角色id
                        oThis.requestDataType = 2;// dataType:计数据维度 1、个人数据 2、团队数据
                        oThis.requestDataSchoolMasterType =1;// 校长页面tab类型 1、校长数据  2、营销数据（课程顾问主管数据） 3、学管数据  4、教务数据  5、外呼数据  6、市场数据
                        oThis.pieConfig ={
                            dateType:1,
                            dataType:oThis.requestDataType
                        };
                        oThis.lineConfig = {
                            dateType:1,
                            dataType:oThis.requestDataType,
                            zoushiFlag:1
                        };

                        oThis.classDataType = 'workbench-xiaozhang-huizong';

                        oThis.callDataCount();
                        $scope.callDataCountDetail(oThis);


                    })($scope);
                }]);
        /**
         * 营销数据对应的controller
         * 每种数据类型对应一个controller
         */
        ywsApp.controller('workbench.xiaozhang.yingxiaoCtrl',
            ['$scope', '$modal', '$rootScope', 'SweetAlert','workbenchSvc','$interval',
                function($scope, $modal, $rootScope, SweetAlert,workbenchSvc,$interval) {
                    var oThis = this;
                    oThis.views = {
                        isShowTop10:false,
                        isShowDetail:false,
                        isLineMonth:false,
                        updateTimeDsc:'日统计数据每30分钟更新一次，最新统计时间：'+Hours30(new Date()),
                    };

                    oThis._getDataCount = _getDataCount;

                    $scope.views.lineData =[];

                    oThis.callDataCount = callDataCount;
                    oThis.callDataTop10 = callDataTop10;
                    oThis.callDataMinxi = callDataMinxi;

                    //---------------------------------------ctrl方法-------------------------------------

                    /**
                     * 得到个人数据/团队数据 饼图
                     */
                    function callDataCount(){
                        var obj = {
                            positionId:$scope.POSITION_ID,
                            dateType:oThis.pieConfig.dateType,//统计时间维度 1、日     2、周    3、月
                            schoolMasterType:oThis.requestDataSchoolMasterType,//校长特有
                            dataType:oThis.requestDataType //计数据维度 1、个人数据     2、团队数据
                        };
                        _getDataCount(obj);
                    }
                    /**
                     * 调用Service 得到个人数据/团队数据 饼图
                     * @param obj
                     *      dateType：统计时间维度 1、日   2、周   3、月
                     *      dataType:计数据维度 1、个人数据 2、团队数据
                     * @private
                     */
                    function _getDataCount(obj){
                        workbenchSvc.dataCountService(obj).then(function (result) {
                            if($scope.ifResponseSuccess(result)){
                                var data = result.data;
                                oThis.views.pieData =$scope.responsePieData(data);
                            }
                        });
                    }

                    /**
                     * 得到top10 数据
                     * 因为使用smartTable  callDataTop10的参数必须是tableState 所以callDataTop10 无法抽取为父类方法
                     * @param tableState
                     */
                    function callDataTop10(tableState){
                        var obj = {
                            positionId:$scope.POSITION_ID,
                            dataType:oThis.requestDataType //计数据维度 1、个人数据     2、团队数据
                        };
                        $scope._getSortedTop10(oThis,tableState);
                    }

                    function callDataMinxi(tableState){
                        oThis.tableState = tableState;
                        $scope._getMingxi(oThis,tableState);

                    }

                    /*************************************************************************************************************
                     * *********************************************************************************************************/
                    (function init($scope){
                        oThis.requestRoleId = $scope.requestRoleId;//得到角色id
                        oThis.requestDataType = 2;// dataType:计数据维度 1、个人数据 2、团队数据
                        oThis.requestDataSchoolMasterType =2;// 校长页面tab类型 1、校长数据  2、营销数据（课程顾问主管数据） 3、学管数据  4、教务数据  5、外呼数据  6、市场数据
                        oThis.pieConfig ={
                            dateType:1,
                            dataType:oThis.requestDataType
                        };
                        oThis.lineConfig = {
                            dateType:1,
                            dataType:oThis.requestDataType,
                            zoushiFlag:1
                        };

                        oThis.classDataType = 'workbench-xiaozhang-yingxiao';

                        oThis.callDataCount();
                        $scope.callDataCountDetail(oThis);

                    })($scope);
                }]);
        /**
         * 学管数据对应的controller
         * 每种数据类型对应一个controller
         */
        ywsApp.controller('workbench.xiaozhang.xueguanCtrl',
            ['$scope', '$modal', '$rootScope', 'SweetAlert','workbenchSvc','$interval',
                function($scope, $modal, $rootScope, SweetAlert,workbenchSvc,$interval) {
                    var oThis = this;
                    oThis.views = {
                        isShowTop10:false,
                        isShowDetail:false,
                        isLineMonth:false,
                        updateTimeDsc:'日统计数据每30分钟更新一次，最新统计时间：'+Hours30(new Date()),
                    };

                    oThis._getDataCount = _getDataCount;

                    $scope.views.lineData =[];

                    oThis.callDataCount = callDataCount;
                    oThis.callDataTop10 = callDataTop10;
                    oThis.callDataMinxi = callDataMinxi;

                    //---------------------------------------ctrl方法-------------------------------------

                    /**
                     * 得到个人数据/团队数据 饼图
                     */
                    function callDataCount(){
                        var obj = {
                            positionId:$scope.POSITION_ID,
                            dateType:oThis.pieConfig.dateType,//统计时间维度 1、日     2、周    3、月
                            schoolMasterType:oThis.requestDataSchoolMasterType,//校长特有
                            dataType:oThis.requestDataType //计数据维度 1、个人数据     2、团队数据
                        };
                        _getDataCount(obj);
                    }
                    /**
                     * 调用Service 得到个人数据/团队数据 饼图
                     * @param obj
                     *      dateType：统计时间维度 1、日   2、周   3、月
                     *      dataType:计数据维度 1、个人数据 2、团队数据
                     * @private
                     */
                    function _getDataCount(obj){
                        workbenchSvc.dataCountService(obj).then(function (result) {
                            if($scope.ifResponseSuccess(result)){
                                var data = result.data;
                                oThis.views.pieData =$scope.responsePieData(data);
                            }
                        });
                    }

                    /**
                     * 得到top10 数据
                     * 因为使用smartTable  callDataTop10的参数必须是tableState 所以callDataTop10 无法抽取为父类方法
                     * @param tableState
                     */
                    function callDataTop10(tableState){
                        var obj = {
                            positionId:$scope.POSITION_ID,
                            dataType:oThis.requestDataType //计数据维度 1、个人数据     2、团队数据
                        };
                        $scope._getSortedTop10(oThis,tableState);
                    }

                    function callDataMinxi(tableState){
                        oThis.tableState = tableState;
                        $scope._getMingxi(oThis,tableState);

                    }

                    /*************************************************************************************************************
                     * *********************************************************************************************************/
                    (function init($scope){
                        oThis.requestRoleId = $scope.requestRoleId;//得到角色id
                        oThis.requestDataType = 2;// dataType:计数据维度 1、个人数据 2、团队数据
                        oThis.requestDataSchoolMasterType =3;// 校长页面tab类型 1、校长数据  2、营销数据（课程顾问主管数据） 3、学管数据  4、教务数据  5、外呼数据  6、市场数据
                        oThis.pieConfig ={
                            dateType:1,
                            dataType:oThis.requestDataType
                        };
                        oThis.lineConfig = {
                            dateType:1,
                            dataType:oThis.requestDataType,
                            zoushiFlag:1
                        };

                        oThis.classDataType = 'workbench-xiaozhang-xueguan';

                        oThis.callDataCount();
                        $scope.callDataCountDetail(oThis);

                    })($scope);
                }]);
        /**
         * 教务数据对应的controller
         * 每种数据类型对应一个controller
         */
        ywsApp.controller('workbench.xiaozhang.jiaowuCtrl',
            ['$scope', '$modal', '$rootScope', 'SweetAlert','workbenchSvc','$interval',
                function($scope, $modal, $rootScope, SweetAlert,workbenchSvc,$interval) {
                    var oThis = this;
                    oThis.views = {
                        isShowTop10:false,
                        isShowDetail:false,
                        isLineMonth:false,
                        updateTimeDsc:'日统计数据每30分钟更新一次，最新统计时间：'+Hours30(new Date()),
                    };

                    oThis._getDataCount = _getDataCount;

                    $scope.views.lineData =[];

                    oThis.callDataCount = callDataCount;
                    oThis.callDataTop10 = callDataTop10;
                    oThis.callDataMinxi = callDataMinxi;

                    //---------------------------------------ctrl方法-------------------------------------

                    /**
                     * 得到个人数据/团队数据 饼图
                     */
                    function callDataCount(){
                        var obj = {
                            positionId:$scope.POSITION_ID,
                            dateType:oThis.pieConfig.dateType,//统计时间维度 1、日     2、周    3、月
                            schoolMasterType:oThis.requestDataSchoolMasterType,//校长特有
                            dataType:oThis.requestDataType //计数据维度 1、个人数据     2、团队数据
                        };
                        _getDataCount(obj);
                    }
                    /**
                     * 调用Service 得到个人数据/团队数据 饼图
                     * @param obj
                     *      dateType：统计时间维度 1、日   2、周   3、月
                     *      dataType:计数据维度 1、个人数据 2、团队数据
                     * @private
                     */
                    function _getDataCount(obj){
                        workbenchSvc.dataCountService(obj).then(function (result) {
                            if($scope.ifResponseSuccess(result)){
                                var data = result.data;
                                oThis.views.pieData =$scope.responsePieData(data);
                            }
                        });
                    }

                    /**
                     * 得到top10 数据
                     * 因为使用smartTable  callDataTop10的参数必须是tableState 所以callDataTop10 无法抽取为父类方法
                     * @param tableState
                     */
                    function callDataTop10(tableState){
                        var obj = {
                            positionId:$scope.POSITION_ID,
                            dataType:oThis.requestDataType //计数据维度 1、个人数据     2、团队数据
                        };
                        $scope._getSortedTop10(oThis,tableState);
                    }

                    function callDataMinxi(tableState){
                        oThis.tableState = tableState;
                        $scope._getMingxi(oThis,tableState);

                    }

                    /*************************************************************************************************************
                     * *********************************************************************************************************/
                    (function init($scope){
                        oThis.requestRoleId = $scope.requestRoleId;//得到角色id
                        oThis.requestDataType = 2;// 教务
                        oThis.requestDataSchoolMasterType =4;// 校长页面tab类型 1、校长数据  2、营销数据（课程顾问主管数据） 3、学管数据  4、教务数据  5、外呼数据  6、市场数据
                        oThis.pieConfig ={
                            dateType:1,
                            dataType:oThis.requestDataType
                        };
                        oThis.lineConfig = {
                            dateType:1,
                            dataType:oThis.requestDataType,
                            zoushiFlag:6
                        };

                        oThis.classDataType = 'workbench-xiaozhang-jiaowu';

                        oThis.callDataCount();
                        $scope.callDataCountDetail(oThis);

                    })($scope);
                }]);
        /**
         * 外呼数据对应的controller
         * 每种数据类型对应一个controller
         */
        ywsApp.controller('workbench.xiaozhang.waihuCtrl',
            ['$scope', '$modal', '$rootScope', 'SweetAlert','workbenchSvc','$interval',
                function($scope, $modal, $rootScope, SweetAlert,workbenchSvc,$interval) {
                    var oThis = this;
                    oThis.views = {
                        isShowTop10:false,
                        isShowDetail:false,
                        isLineMonth:false,
                        updateTimeDsc:'日统计数据每30分钟更新一次，最新统计时间：'+Hours30(new Date()),
                    };

                    oThis._getDataCount = _getDataCount;

                    $scope.views.lineData =[];

                    oThis.callDataCount = callDataCount;
                    oThis.callDataTop10 = callDataTop10;
                    oThis.callDataMinxi = callDataMinxi;

                    //---------------------------------------ctrl方法-------------------------------------

                    /**
                     * 得到个人数据/团队数据 饼图
                     */
                    function callDataCount(){
                        var obj = {
                            positionId:$scope.POSITION_ID,
                            dateType:oThis.pieConfig.dateType,//统计时间维度 1、日     2、周    3、月
                            schoolMasterType:oThis.requestDataSchoolMasterType,//校长特有
                            dataType:oThis.requestDataType //计数据维度 1、个人数据     2、团队数据
                        };
                        _getDataCount(obj);
                    }
                    /**
                     * 调用Service 得到个人数据/团队数据 饼图
                     * @param obj
                     *      dateType：统计时间维度 1、日   2、周   3、月
                     *      dataType:计数据维度 1、个人数据 2、团队数据
                     * @private
                     */
                    function _getDataCount(obj){
                        workbenchSvc.dataCountService(obj).then(function (result) {
                            if($scope.ifResponseSuccess(result)){
                                var data = result.data;
                                oThis.views.pieData =$scope.responsePieData(data);
                            }
                        });
                    }

                    /**
                     * 得到top10 数据
                     * 因为使用smartTable  callDataTop10的参数必须是tableState 所以callDataTop10 无法抽取为父类方法
                     * @param tableState
                     */
                    function callDataTop10(tableState){
                        var obj = {
                            positionId:$scope.POSITION_ID,
                            dataType:oThis.requestDataType //计数据维度 1、个人数据     2、团队数据
                        };
                        $scope._getSortedTop10(oThis,tableState);
                    }

                    function callDataMinxi(tableState){
                        oThis.tableState = tableState;
                        $scope._getMingxi(oThis,tableState);

                    }
                    /*************************************************************************************************************
                     * *********************************************************************************************************/
                    (function init($scope){
                        oThis.requestRoleId = $scope.requestRoleId;//得到角色id
                        oThis.requestDataType = 2;// 外呼
                        oThis.requestDataSchoolMasterType =5;// 校长页面tab类型 1、校长数据  2、营销数据（课程顾问主管数据） 3、学管数据  4、教务数据  5、外呼数据  6、市场数据
                        oThis.pieConfig ={
                            dateType:1,
                            dataType:oThis.requestDataType
                        };
                        oThis.lineConfig = {
                            dateType:1,
                            dataType:oThis.requestDataType,
                            zoushiFlag:1
                        };

                        oThis.classDataType = 'workbench-xiaozhang-waihu';

                        oThis.callDataCount();
                        $scope.callDataCountDetail(oThis);

                    })($scope);
                }]);
        /**
         * 市场数据对应的controller
         * 每种数据类型对应一个controller
         */
        ywsApp.controller('workbench.xiaozhang.shichangCtrl',
            ['$scope', '$modal', '$rootScope', 'SweetAlert','workbenchSvc','$interval',
                function($scope, $modal, $rootScope, SweetAlert,workbenchSvc,$interval) {
                    var oThis = this;
                    oThis.views = {
                        isShowTop10:false,
                        isShowDetail:false,
                        isLineMonth:false,
                        updateTimeDsc:'日统计数据每30分钟更新一次，最新统计时间：'+Hours30(new Date()),
                    };

                    oThis._getDataCount = _getDataCount;

                    $scope.views.lineData =[];

                    oThis.callDataCount = callDataCount;
                    oThis.callDataTop10 = callDataTop10;
                    oThis.callDataMinxi = callDataMinxi;

                    //---------------------------------------ctrl方法-------------------------------------

                    /**
                     * 得到个人数据/团队数据 饼图
                     */
                    function callDataCount(){
                        var obj = {
                            positionId:$scope.POSITION_ID,
                            dateType:oThis.pieConfig.dateType,//统计时间维度 1、日     2、周    3、月
                            schoolMasterType:oThis.requestDataSchoolMasterType,//校长特有
                            dataType:oThis.requestDataType //计数据维度 1、个人数据     2、团队数据
                        };
                        _getDataCount(obj);
                    }
                    /**
                     * 调用Service 得到个人数据/团队数据 饼图
                     * @param obj
                     *      dateType：统计时间维度 1、日   2、周   3、月
                     *      dataType:计数据维度 1、个人数据 2、团队数据
                     * @private
                     */
                    function _getDataCount(obj){
                        workbenchSvc.dataCountService(obj).then(function (result) {
                            if($scope.ifResponseSuccess(result)){
                                var data = result.data;
                                oThis.views.pieData =$scope.responsePieData(data);
                            }
                        });
                    }

                    /**
                     * 得到top10 数据
                     * 因为使用smartTable  callDataTop10的参数必须是tableState 所以callDataTop10 无法抽取为父类方法
                     * @param tableState
                     */
                    function callDataTop10(tableState){
                        var obj = {
                            positionId:$scope.POSITION_ID,
                            dataType:oThis.requestDataType //计数据维度 1、个人数据     2、团队数据
                        };
                        $scope._getSortedTop10(oThis,tableState);
                    }

                    function callDataMinxi(tableState){
                        oThis.tableState = tableState;
                        $scope._getMingxi(oThis,tableState);

                    }

                    /*************************************************************************************************************
                     * *********************************************************************************************************/
                    (function init($scope){
                        oThis.requestRoleId = $scope.requestRoleId;//得到角色id
                        oThis.requestDataType = 2;// 市场
                        oThis.requestDataSchoolMasterType =6;// 校长页面tab类型 1、校长数据  2、营销数据（课程顾问主管数据） 3、学管数据  4、教务数据  5、外呼数据  6、市场数据
                        oThis.pieConfig ={
                            dateType:1,
                            dataType:oThis.requestDataType
                        };
                        oThis.lineConfig = {
                            dateType:1,
                            dataType:oThis.requestDataType,
                            zoushiFlag:1
                        };

                        oThis.classDataType = 'workbench-xiaozhang-shichang';

                        oThis.callDataCount();
                        $scope.callDataCountDetail(oThis);

                    })($scope);
                }]);
        /**
         * 评价汇总数据对应的controller
         * 每种数据类型对应一个controller
         */
        ywsApp.controller('workbench.xiaozhang.pingjiaCtrl',
            ['$scope', '$modal', '$rootScope', 'SweetAlert','workbenchSvc','$interval',
                function($scope, $modal, $rootScope, SweetAlert,workbenchSvc,$interval) {
                    var oThis = this;
                    oThis.views = {
                        isShowTop10:false,
                        isShowDetail:false,
                        isLineMonth:false,
                        updateTimeDsc:'日差评为当天提交评价，月差评为当月提交差评；提分率与满意度为当月统计数据。',
                    };

                    oThis._getDataCount = _getDataCount;

                    $scope.views.lineData =[];

                    oThis.callDataCount = callDataCount;
                    oThis.callDataTop10 = callDataTop10;
                    oThis.callDataMinxi = callDataMinxi;

                    //---------------------------------------ctrl方法-------------------------------------

                    /**
                     * 得到个人数据/团队数据 饼图
                     */
                    function callDataCount(){
                        var obj = {
                            positionId:$scope.POSITION_ID,
                            dateType:oThis.pieConfig.dateType,//统计时间维度 1、日     2、周    3、月
                            schoolMasterType:oThis.requestDataSchoolMasterType,//校长特有
                            dataType:oThis.requestDataType //计数据维度 1、个人数据     2、团队数据
                        };
                        _getDataCount(obj);
                    }
                    /**
                     * 调用Service 得到个人数据/团队数据 饼图
                     * @param obj
                     *      dateType：统计时间维度 1、日   2、周   3、月
                     *      dataType:计数据维度 1、个人数据 2、团队数据
                     * @private
                     */
                    function _getDataCount(obj){
                        workbenchSvc.dataCountService(obj).then(function (result) {
                            if($scope.ifResponseSuccess(result)){
                                var data = result.data;
                                oThis.views.pieData =$scope.responsePieData(data);
                            }
                        });
                    }

                    /**
                     * 得到top10 数据
                     * 因为使用smartTable  callDataTop10的参数必须是tableState 所以callDataTop10 无法抽取为父类方法
                     * @param tableState
                     */
                    function callDataTop10(tableState){
                        var obj = {
                            positionId:$scope.POSITION_ID,
                            dataType:oThis.requestDataType //计数据维度 1、个人数据     2、团队数据
                        };
                        $scope._getSortedTop10(oThis,tableState);
                    }

                    function callDataMinxi(tableState){
                        oThis.tableState = tableState;
                        $scope._getMingxi(oThis,tableState);

                    }

                    /*************************************************************************************************************
                     * *********************************************************************************************************/
                    (function init($scope){
                        oThis.requestRoleId = $scope.requestRoleId;//得到角色id
                        oThis.requestDataType = 3;// dataType:计数据维度 1、个人数据 2、团队数据 3评价汇总
                        oThis.requestDataSchoolMasterType =7;// 校长页面tab类型 1、校长数据  2、营销数据（课程顾问主管数据） 3、学管数据  4、教务数据  5、外呼数据  6、市场数据 7、评价tab
                        oThis.pieConfig ={
                            dateType:1,
                            dataType:oThis.requestDataType
                        };
                        oThis.lineConfig = {
                            dateType:1,
                            dataType:oThis.requestDataType,
                            zoushiFlag:1
                        };

                        oThis.classDataType = 'workbench-xiaozhang-huizong';

                        oThis.callDataCount();
                        $scope.callDataCountDetail(oThis);


                    })($scope);
                }]);

    /**
     * 城市总监 角色对应的controller
     * 一个角色对应的controller 每一个角色对应一个controller
     */
    ywsApp.controller('workbench.chengshiMasterCtrl',
        ['$scope', '$modal', '$rootScope', 'SweetAlert','workbenchSvc','$interval',
            function($scope, $modal, $rootScope, SweetAlert,workbenchSvc,$interval) {

                var oThis = this;

                $scope.callInfoWarn = callInfoWarn;
                $scope.callVisitWarn = callVisitWarn;
                $scope.callCourseWarn = callCourseWarn;
                $scope.callXufeiWarn = callXufeiWarn;
                $scope.callListenWarn = callListenWarn;

                /****************工作流*************************/
                $scope.callWorkStart =  callWorkStart;
                $scope.callWorkDeal  =  callWorkDeal;
                $scope.callWorkFinish = callWorkFinish;
                $scope.callWorkStar =   callWorkStar;

                /**
                 * 信息提醒
                 * @param tableState
                 */
                function callInfoWarn(tableState){
                    var pagination = tableState.pagination;
                    var obj = {
                        reminedType:1,
                        pageNum:pagination.start || 0,
                        pageSize:pagination.number || 10,
                        positionId:$scope.POSITION_ID
                    };
                    _getWarnData(obj,tableState,1);

                }
                /**
                 * 到访提醒
                 * @param tableState
                 */
                function callVisitWarn(tableState){
                    var pagination = tableState.pagination;
                    var obj = {
                        reminedType:2,
                        pageNum:pagination.start || 0,
                        pageSize:pagination.number || 10,
                        positionId:$scope.POSITION_ID
                    };
                    _getWarnData(obj,tableState,2);
                }
                /**
                 * 上课提醒
                 * @param tableState
                 */
                function callCourseWarn(tableState){
                    var pagination = tableState.pagination;
                    var obj = {
                        reminedType:3,
                        pageNum:pagination.start || 0,
                        pageSize:pagination.number || 10,
                        positionId:$scope.POSITION_ID
                    };
                    _getWarnData(obj,tableState,3);
                }
                /**
                 * 续费提醒
                 * @param tableState
                 */
                function callXufeiWarn(tableState){
                    var pagination = tableState.pagination;
                    var obj = {
                        reminedType:4,
                        pageNum:pagination.start || 0,
                        pageSize:pagination.number || 10,
                        positionId:$scope.POSITION_ID
                    };
                    _getWarnData(obj,tableState,4);
                }
                /**
                 * 试听提醒
                 * @param tableState
                 */
                function callListenWarn(tableState){
                    var pagination = tableState.pagination;
                    var obj = {
                        reminedType:5,
                        pageNum:pagination.start || 0,
                        pageSize:pagination.number || 10,
                        positionId:$scope.POSITION_ID,
                    };
                    _getWarnData(obj,tableState,5);
                }

                /****************工作流*************************/
                function callWorkStart(tableState){
                    $scope.getWorkStart(oThis,tableState);
                }
                function callWorkDeal(tableState){
                    $scope.getWorkDeal(oThis,tableState);
                }
                function callWorkFinish(tableState){
                    $scope.getWorkFinish(oThis,tableState);
                }
                function callWorkStar(tableState){
                    $scope.getWorkStar(oThis,tableState);
                }

                /**
                 * 调用Service层 得到信息list
                 * {"type":1}提醒信息列表 {"type":2}到访信息列表 {"type":3}排课信息列表 {"type":4}续费信息列表  {"type":5}试听排课信息列表
                 * @param obj
                 * @param tableState 分页参数
                 * @param type
                 * @private
                 */
                function _getWarnData(obj,tableState,type){
                    obj.pageNum = obj.pageNum/obj.pageSize +1;//分页必须的从1开始
                    workbenchSvc.remindService(obj).then(function (result) {
                        if($scope.ifResponseSuccess(result)){
                            $scope.responseWarnData(type,oThis,result);
                            tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                        }
                    });
                }

                (function init(){
                    //callInfoWarn
                    $scope.requestRoleId = 24;//初始化当前controller角色id
                })();
            }]);

        /**
         * 校区汇总数据对应的controller
         * 每种数据类型对应一个controller
         */
        ywsApp.controller('workbench.chengshiMaster.huizongCtrl',
            ['$scope', '$modal', '$rootScope', 'SweetAlert','workbenchSvc','$interval',
                function($scope, $modal, $rootScope, SweetAlert,workbenchSvc,$interval) {
                    var oThis = this;
                    oThis.views = {
                        isShowTop10:false,
                        isShowDetail:false,
                        isLineMonth:false
                        ,updateTimeDsc:'日统计数据每30分钟更新一次，最新统计时间：'+Hours30(new Date()),
                    };

                    oThis._getDataCount = _getDataCount;

                    $scope.views.lineData =[];

                    oThis.callDataCount = callDataCount;
                    oThis.callDataTop10 = callDataTop10;
                    oThis.callDataMinxi = callDataMinxi;

                    //---------------------------------------ctrl方法-------------------------------------

                    /**
                     * 得到个人数据/团队数据 饼图
                     */
                    function callDataCount(){
                        var obj = {
                            positionId:$scope.POSITION_ID,
                            dateType:oThis.pieConfig.dateType,//统计时间维度 1、日     2、周    3、月
                            schoolMasterType:oThis.requestDataSchoolMasterType,//校长特有
                            dataType:oThis.requestDataType //计数据维度 1、个人数据     2、团队数据
                        };
                        _getDataCount(obj);
                    }
                    /**
                     * 调用Service 得到个人数据/团队数据 饼图
                     * @param obj
                     *      dateType：统计时间维度 1、日   2、周   3、月
                     *      dataType:计数据维度 1、个人数据 2、团队数据
                     * @private
                     */
                    function _getDataCount(obj){
                        workbenchSvc.dataCountService(obj).then(function (result) {
                            if($scope.ifResponseSuccess(result)){
                                var data = result.data;
                                oThis.views.pieData =$scope.responsePieData(data);
                            }
                        });
                    }

                    /**
                     * 得到top10 数据
                     * 因为使用smartTable  callDataTop10的参数必须是tableState 所以callDataTop10 无法抽取为父类方法
                     * @param tableState
                     */
                    function callDataTop10(tableState){
                        var obj = {
                            positionId:$scope.POSITION_ID,
                            dataType:oThis.requestDataType //计数据维度 1、个人数据     2、团队数据
                        };
                        $scope._getSortedTop10(oThis,tableState);
                    }

                    function callDataMinxi(tableState){
                        oThis.tableState = tableState;
                        $scope._getMingxi(oThis,tableState);

                    }

                    /*************************************************************************************************************
                     * *********************************************************************************************************/
                    (function init($scope){
                        oThis.requestRoleId = $scope.requestRoleId;//得到角色id
                        oThis.requestDataType = 2;// dataType:计数据维度 1、个人数据 2、团队数据
                        oThis.requestDataSchoolMasterType =1;// 校长页面tab类型 1、校长数据  2、营销数据（课程顾问主管数据） 3、学管数据  4、教务数据  5、外呼数据  6、市场数据
                        oThis.pieConfig ={
                            dateType:1,
                            dataType:oThis.requestDataType
                        };
                        oThis.lineConfig = {
                            dateType:1,
                            dataType:oThis.requestDataType,
                            zoushiFlag:1
                        };

                        oThis.classDataType = 'workbench-xiaozhang-huizong';

                        oThis.callDataCount();
                        $scope.callDataCountDetail(oThis);

                    })($scope);
                }]);
        /**
         * 营销数据对应的controller
         * 每种数据类型对应一个controller
         */
        ywsApp.controller('workbench.chengshiMaster.yingxiaoCtrl',
            ['$scope', '$modal', '$rootScope', 'SweetAlert','workbenchSvc','$interval',
                function($scope, $modal, $rootScope, SweetAlert,workbenchSvc,$interval) {
                    var oThis = this;
                    oThis.views = {
                        isShowTop10:false,
                        isShowDetail:false,
                        isLineMonth:false,
                        updateTimeDsc:'日统计数据每30分钟更新一次，最新统计时间：'+Hours30(new Date()),
                    };

                    oThis._getDataCount = _getDataCount;

                    $scope.views.lineData =[];

                    oThis.callDataCount = callDataCount;
                    oThis.callDataTop10 = callDataTop10;
                    oThis.callDataMinxi = callDataMinxi;

                    //---------------------------------------ctrl方法-------------------------------------

                    /**
                     * 得到个人数据/团队数据 饼图
                     */
                    function callDataCount(){
                        var obj = {
                            positionId:$scope.POSITION_ID,
                            dateType:oThis.pieConfig.dateType,//统计时间维度 1、日     2、周    3、月
                            schoolMasterType:oThis.requestDataSchoolMasterType,//校长特有
                            dataType:oThis.requestDataType //计数据维度 1、个人数据     2、团队数据
                        };
                        _getDataCount(obj);
                    }
                    /**
                     * 调用Service 得到个人数据/团队数据 饼图
                     * @param obj
                     *      dateType：统计时间维度 1、日   2、周   3、月
                     *      dataType:计数据维度 1、个人数据 2、团队数据
                     * @private
                     */
                    function _getDataCount(obj){
                        workbenchSvc.dataCountService(obj).then(function (result) {
                            if($scope.ifResponseSuccess(result)){
                                var data = result.data;
                                oThis.views.pieData =$scope.responsePieData(data);
                            }
                        });
                    }

                    /**
                     * 得到top10 数据
                     * 因为使用smartTable  callDataTop10的参数必须是tableState 所以callDataTop10 无法抽取为父类方法
                     * @param tableState
                     */
                    function callDataTop10(tableState){
                        var obj = {
                            positionId:$scope.POSITION_ID,
                            dataType:oThis.requestDataType //计数据维度 1、个人数据     2、团队数据
                        };
                        $scope._getSortedTop10(oThis,tableState);
                    }

                    function callDataMinxi(tableState){
                        oThis.tableState = tableState;
                        $scope._getMingxi(oThis,tableState);

                    }

                    /*************************************************************************************************************
                     * *********************************************************************************************************/
                    (function init($scope){
                        oThis.requestRoleId = $scope.requestRoleId;//得到角色id
                        oThis.requestDataType = 2;// dataType:计数据维度 1、个人数据 2、团队数据
                        oThis.requestDataSchoolMasterType =2;// 校长页面tab类型 1、校长数据  2、营销数据（课程顾问主管数据） 3、学管数据  4、教务数据  5、外呼数据  6、市场数据
                        oThis.pieConfig ={
                            dateType:1,
                            dataType:oThis.requestDataType
                        };
                        oThis.lineConfig = {
                            dateType:1,
                            dataType:oThis.requestDataType,
                            zoushiFlag:1
                        };

                        oThis.classDataType = 'workbench-xiaozhang-yingxiao';

                        oThis.callDataCount();
                        $scope.callDataCountDetail(oThis);

                    })($scope);
                }]);
        /**
         * 学管数据对应的controller
         * 每种数据类型对应一个controller
         */
        ywsApp.controller('workbench.chengshiMaster.xueguanCtrl',
            ['$scope', '$modal', '$rootScope', 'SweetAlert','workbenchSvc','$interval',
                function($scope, $modal, $rootScope, SweetAlert,workbenchSvc,$interval) {
                    var oThis = this;
                    oThis.views = {
                        isShowTop10:false,
                        isShowDetail:false,
                        isLineMonth:false,
                        updateTimeDsc:'日统计数据每30分钟更新一次，最新统计时间：'+Hours30(new Date()),
                    };

                    oThis._getDataCount = _getDataCount;

                    $scope.views.lineData =[];

                    oThis.callDataCount = callDataCount;
                    oThis.callDataTop10 = callDataTop10;
                    oThis.callDataMinxi = callDataMinxi;

                    //---------------------------------------ctrl方法-------------------------------------

                    /**
                     * 得到个人数据/团队数据 饼图
                     */
                    function callDataCount(){
                        var obj = {
                            positionId:$scope.POSITION_ID,
                            dateType:oThis.pieConfig.dateType,//统计时间维度 1、日     2、周    3、月
                            schoolMasterType:oThis.requestDataSchoolMasterType,//校长特有
                            dataType:oThis.requestDataType //计数据维度 1、个人数据     2、团队数据
                        };
                        _getDataCount(obj);
                    }
                    /**
                     * 调用Service 得到个人数据/团队数据 饼图
                     * @param obj
                     *      dateType：统计时间维度 1、日   2、周   3、月
                     *      dataType:计数据维度 1、个人数据 2、团队数据
                     * @private
                     */
                    function _getDataCount(obj){
                        workbenchSvc.dataCountService(obj).then(function (result) {
                            if($scope.ifResponseSuccess(result)){
                                var data = result.data;
                                oThis.views.pieData =$scope.responsePieData(data);
                            }
                        });
                    }

                    /**
                     * 得到top10 数据
                     * 因为使用smartTable  callDataTop10的参数必须是tableState 所以callDataTop10 无法抽取为父类方法
                     * @param tableState
                     */
                    function callDataTop10(tableState){
                        var obj = {
                            positionId:$scope.POSITION_ID,
                            dataType:oThis.requestDataType //计数据维度 1、个人数据     2、团队数据
                        };
                        $scope._getSortedTop10(oThis,tableState);
                    }

                    function callDataMinxi(tableState){
                        oThis.tableState = tableState;
                        $scope._getMingxi(oThis,tableState);

                    }

                    /*************************************************************************************************************
                     * *********************************************************************************************************/
                    (function init($scope){
                        oThis.requestRoleId = $scope.requestRoleId;//得到角色id
                        oThis.requestDataType = 2;// dataType:计数据维度 1、个人数据 2、团队数据
                        oThis.requestDataSchoolMasterType =3;// 校长页面tab类型 1、校长数据  2、营销数据（课程顾问主管数据） 3、学管数据  4、教务数据  5、外呼数据  6、市场数据
                        oThis.pieConfig ={
                            dateType:1,
                            dataType:oThis.requestDataType
                        };
                        oThis.lineConfig = {
                            dateType:1,
                            dataType:oThis.requestDataType,
                            zoushiFlag:1
                        };

                        oThis.classDataType = 'workbench-xiaozhang-xueguan';

                        oThis.callDataCount();
                        $scope.callDataCountDetail(oThis);

                    })($scope);
                }]);
        /**
         * 教务数据对应的controller
         * 每种数据类型对应一个controller
         */
        ywsApp.controller('workbench.chengshiMaster.jiaowuCtrl',
            ['$scope', '$modal', '$rootScope', 'SweetAlert','workbenchSvc','$interval',
                function($scope, $modal, $rootScope, SweetAlert,workbenchSvc,$interval) {
                    var oThis = this;
                    oThis.views = {
                        isShowTop10:false,
                        isShowDetail:false,
                        isLineMonth:false,
                        updateTimeDsc:'日统计数据每30分钟更新一次，最新统计时间：'+Hours30(new Date()),
                    };

                    oThis._getDataCount = _getDataCount;

                    $scope.views.lineData =[];

                    oThis.callDataCount = callDataCount;
                    oThis.callDataTop10 = callDataTop10;
                    oThis.callDataMinxi = callDataMinxi;

                    //---------------------------------------ctrl方法-------------------------------------

                    /**
                     * 得到个人数据/团队数据 饼图
                     */
                    function callDataCount(){
                        var obj = {
                            positionId:$scope.POSITION_ID,
                            dateType:oThis.pieConfig.dateType,//统计时间维度 1、日     2、周    3、月
                            schoolMasterType:oThis.requestDataSchoolMasterType,//校长特有
                            dataType:oThis.requestDataType //计数据维度 1、个人数据     2、团队数据
                        };
                        _getDataCount(obj);
                    }
                    /**
                     * 调用Service 得到个人数据/团队数据 饼图
                     * @param obj
                     *      dateType：统计时间维度 1、日   2、周   3、月
                     *      dataType:计数据维度 1、个人数据 2、团队数据
                     * @private
                     */
                    function _getDataCount(obj){
                        workbenchSvc.dataCountService(obj).then(function (result) {
                            if($scope.ifResponseSuccess(result)){
                                var data = result.data;
                                oThis.views.pieData =$scope.responsePieData(data);
                            }
                        });
                    }

                    /**
                     * 得到top10 数据
                     * 因为使用smartTable  callDataTop10的参数必须是tableState 所以callDataTop10 无法抽取为父类方法
                     * @param tableState
                     */
                    function callDataTop10(tableState){
                        var obj = {
                            positionId:$scope.POSITION_ID,
                            dataType:oThis.requestDataType //计数据维度 1、个人数据     2、团队数据
                        };
                        $scope._getSortedTop10(oThis,tableState);
                    }

                    function callDataMinxi(tableState){
                        oThis.tableState = tableState;
                        $scope._getMingxi(oThis,tableState);

                    }

                    /*************************************************************************************************************
                     * *********************************************************************************************************/
                    (function init($scope){
                        oThis.requestRoleId = $scope.requestRoleId;//得到角色id
                        oThis.requestDataType = 2;// 教务
                        oThis.requestDataSchoolMasterType =4;// 校长页面tab类型 1、校长数据  2、营销数据（课程顾问主管数据） 3、学管数据  4、教务数据  5、外呼数据  6、市场数据
                        oThis.pieConfig ={
                            dateType:1,
                            dataType:oThis.requestDataType
                        };
                        oThis.lineConfig = {
                            dateType:1,
                            dataType:oThis.requestDataType,
                            zoushiFlag:6
                        };

                        oThis.classDataType = 'workbench-xiaozhang-jiaowu';

                        oThis.callDataCount();
                        $scope.callDataCountDetail(oThis);

                    })($scope);
                }]);
        /**
         * 外呼数据对应的controller
         * 每种数据类型对应一个controller
         */
        ywsApp.controller('workbench.chengshiMaster.waihuCtrl',
            ['$scope', '$modal', '$rootScope', 'SweetAlert','workbenchSvc','$interval',
                function($scope, $modal, $rootScope, SweetAlert,workbenchSvc,$interval) {
                    var oThis = this;
                    oThis.views = {
                        isShowTop10:false,
                        isShowDetail:false,
                        isLineMonth:false,
                        updateTimeDsc:'日统计数据每30分钟更新一次，最新统计时间：'+Hours30(new Date()),
                    };

                    oThis._getDataCount = _getDataCount;

                    $scope.views.lineData =[];

                    oThis.callDataCount = callDataCount;
                    oThis.callDataTop10 = callDataTop10;
                    oThis.callDataMinxi = callDataMinxi;

                    //---------------------------------------ctrl方法-------------------------------------

                    /**
                     * 得到个人数据/团队数据 饼图
                     */
                    function callDataCount(){
                        var obj = {
                            positionId:$scope.POSITION_ID,
                            dateType:oThis.pieConfig.dateType,//统计时间维度 1、日     2、周    3、月
                            schoolMasterType:oThis.requestDataSchoolMasterType,//校长特有
                            dataType:oThis.requestDataType //计数据维度 1、个人数据     2、团队数据
                        };
                        _getDataCount(obj);
                    }
                    /**
                     * 调用Service 得到个人数据/团队数据 饼图
                     * @param obj
                     *      dateType：统计时间维度 1、日   2、周   3、月
                     *      dataType:计数据维度 1、个人数据 2、团队数据
                     * @private
                     */
                    function _getDataCount(obj){
                        workbenchSvc.dataCountService(obj).then(function (result) {
                            if($scope.ifResponseSuccess(result)){
                                var data = result.data;
                                oThis.views.pieData =$scope.responsePieData(data);
                            }
                        });
                    }

                    /**
                     * 得到top10 数据
                     * 因为使用smartTable  callDataTop10的参数必须是tableState 所以callDataTop10 无法抽取为父类方法
                     * @param tableState
                     */
                    function callDataTop10(tableState){
                        var obj = {
                            positionId:$scope.POSITION_ID,
                            dataType:oThis.requestDataType //计数据维度 1、个人数据     2、团队数据
                        };
                        $scope._getSortedTop10(oThis,tableState);
                    }

                    function callDataMinxi(tableState){
                        oThis.tableState = tableState;
                        $scope._getMingxi(oThis,tableState);

                    }
                    /*************************************************************************************************************
                     * *********************************************************************************************************/
                    (function init($scope){
                        oThis.requestRoleId = $scope.requestRoleId;//得到角色id
                        oThis.requestDataType = 2;// 外呼
                        oThis.requestDataSchoolMasterType =5;// 校长页面tab类型 1、校长数据  2、营销数据（课程顾问主管数据） 3、学管数据  4、教务数据  5、外呼数据  6、市场数据
                        oThis.pieConfig ={
                            dateType:1,
                            dataType:oThis.requestDataType
                        };
                        oThis.lineConfig = {
                            dateType:1,
                            dataType:oThis.requestDataType,
                            zoushiFlag:1
                        };

                        oThis.classDataType = 'workbench-xiaozhang-waihu';

                        oThis.callDataCount();
                        $scope.callDataCountDetail(oThis);

                    })($scope);
                }]);
        /**
         * 市场数据对应的controller
         * 每种数据类型对应一个controller
         */
        ywsApp.controller('workbench.chengshiMaster.shichangCtrl',
            ['$scope', '$modal', '$rootScope', 'SweetAlert','workbenchSvc','$interval',
                function($scope, $modal, $rootScope, SweetAlert,workbenchSvc,$interval) {
                    var oThis = this;
                    oThis.views = {
                        isShowTop10:false,
                        isShowDetail:false,
                        isLineMonth:false,
                        updateTimeDsc:'日统计数据每30分钟更新一次，最新统计时间：'+Hours30(new Date()),
                    };

                    oThis._getDataCount = _getDataCount;

                    $scope.views.lineData =[];

                    oThis.callDataCount = callDataCount;
                    oThis.callDataTop10 = callDataTop10;
                    oThis.callDataMinxi = callDataMinxi;

                    //---------------------------------------ctrl方法-------------------------------------

                    /**
                     * 得到个人数据/团队数据 饼图
                     */
                    function callDataCount(){
                        var obj = {
                            positionId:$scope.POSITION_ID,
                            dateType:oThis.pieConfig.dateType,//统计时间维度 1、日     2、周    3、月
                            schoolMasterType:oThis.requestDataSchoolMasterType,//校长特有
                            dataType:oThis.requestDataType //计数据维度 1、个人数据     2、团队数据
                        };
                        _getDataCount(obj);
                    }
                    /**
                     * 调用Service 得到个人数据/团队数据 饼图
                     * @param obj
                     *      dateType：统计时间维度 1、日   2、周   3、月
                     *      dataType:计数据维度 1、个人数据 2、团队数据
                     * @private
                     */
                    function _getDataCount(obj){
                        workbenchSvc.dataCountService(obj).then(function (result) {
                            if($scope.ifResponseSuccess(result)){
                                var data = result.data;
                                oThis.views.pieData =$scope.responsePieData(data);
                            }
                        });
                    }

                    /**
                     * 得到top10 数据
                     * 因为使用smartTable  callDataTop10的参数必须是tableState 所以callDataTop10 无法抽取为父类方法
                     * @param tableState
                     */
                    function callDataTop10(tableState){
                        var obj = {
                            positionId:$scope.POSITION_ID,
                            dataType:oThis.requestDataType //计数据维度 1、个人数据     2、团队数据
                        };
                        $scope._getSortedTop10(oThis,tableState);
                    }

                    function callDataMinxi(tableState){
                        oThis.tableState = tableState;
                        $scope._getMingxi(oThis,tableState);

                    }

                    /*************************************************************************************************************
                     * *********************************************************************************************************/
                    (function init($scope){
                        oThis.requestRoleId = $scope.requestRoleId;//得到角色id
                        oThis.requestDataType = 2;// 市场
                        oThis.requestDataSchoolMasterType =6;// 校长页面tab类型 1、校长数据  2、营销数据（课程顾问主管数据） 3、学管数据  4、教务数据  5、外呼数据  6、市场数据
                        oThis.pieConfig ={
                            dateType:1,
                            dataType:oThis.requestDataType
                        };
                        oThis.lineConfig = {
                            dateType:1,
                            dataType:oThis.requestDataType,
                            zoushiFlag:1
                        };

                        oThis.classDataType = 'workbench-xiaozhang-shichang';

                        oThis.callDataCount();
                        $scope.callDataCountDetail(oThis);

                    })($scope);
                }]);
        /**
         * 评价汇总数据对应的controller
         * 每种数据类型对应一个controller
         */
        ywsApp.controller('workbench.chengshiMaster.pingjiaCtrl',
            ['$scope', '$modal', '$rootScope', 'SweetAlert','workbenchSvc','$interval',
                function($scope, $modal, $rootScope, SweetAlert,workbenchSvc,$interval) {
                    var oThis = this;
                    oThis.views = {
                        isShowTop10:false,
                        isShowDetail:false,
                        isLineMonth:false,
                        updateTimeDsc:'日差评为当天提交评价，月差评为当月提交差评；提分率与满意度为当月统计数据。',
                    };

                    oThis._getDataCount = _getDataCount;

                    $scope.views.lineData =[];

                    oThis.callDataCount = callDataCount;
                    oThis.callDataTop10 = callDataTop10;
                    oThis.callDataMinxi = callDataMinxi;

                    //---------------------------------------ctrl方法-------------------------------------

                    /**
                     * 得到个人数据/团队数据 饼图
                     */
                    function callDataCount(){
                        var obj = {
                            positionId:$scope.POSITION_ID,
                            dateType:oThis.pieConfig.dateType,//统计时间维度 1、日     2、周    3、月
                            schoolMasterType:oThis.requestDataSchoolMasterType,//校长特有
                            dataType:oThis.requestDataType //计数据维度 1、个人数据     2、团队数据
                        };
                        _getDataCount(obj);
                    }
                    /**
                     * 调用Service 得到个人数据/团队数据 饼图
                     * @param obj
                     *      dateType：统计时间维度 1、日   2、周   3、月
                     *      dataType:计数据维度 1、个人数据 2、团队数据
                     * @private
                     */
                    function _getDataCount(obj){
                        workbenchSvc.dataCountService(obj).then(function (result) {
                            if($scope.ifResponseSuccess(result)){
                                var data = result.data;
                                oThis.views.pieData =$scope.responsePieData(data);
                            }
                        });
                    }

                    /**
                     * 得到top10 数据
                     * 因为使用smartTable  callDataTop10的参数必须是tableState 所以callDataTop10 无法抽取为父类方法
                     * @param tableState
                     */
                    function callDataTop10(tableState){
                        var obj = {
                            positionId:$scope.POSITION_ID,
                            dataType:oThis.requestDataType //计数据维度 1、个人数据     2、团队数据
                        };
                        $scope._getSortedTop10(oThis,tableState);
                    }

                    function callDataMinxi(tableState){
                        oThis.tableState = tableState;
                        $scope._getMingxi(oThis,tableState);

                    }

                    /*************************************************************************************************************
                     * *********************************************************************************************************/
                    (function init($scope){
                        oThis.requestRoleId = $scope.requestRoleId;//得到角色id
                        oThis.requestDataType = 3;// dataType:计数据维度 1、个人数据 2、团队数据 3评价汇总
                        oThis.requestDataSchoolMasterType =7;// 校长页面tab类型 1、校长数据  2、营销数据（课程顾问主管数据） 3、学管数据  4、教务数据  5、外呼数据  6、市场数据 7、评价tab
                        oThis.pieConfig ={
                            dateType:1,
                            dataType:oThis.requestDataType
                        };
                        oThis.lineConfig = {
                            dateType:1,
                            dataType:oThis.requestDataType,
                            zoushiFlag:1
                        };

                        oThis.classDataType = 'workbench-xiaozhang-huizong';

                        oThis.callDataCount();
                        $scope.callDataCountDetail(oThis);


                    })($scope);
                }]);

    /**
     * 学习顾问 角色对应的controller
     * 一个角色对应的controller 每一个角色对应一个controller
     */
    ywsApp.controller('workbench.xuexiCtrl',
        ['$scope', '$modal', '$rootScope', 'SweetAlert','workbenchSvc','$interval',
            function($scope, $modal, $rootScope, SweetAlert,workbenchSvc,$interval) {
                var oThis = this;

                $scope.callInfoWarn = callInfoWarn;
                $scope.callVisitWarn = callVisitWarn;
                $scope.callCourseWarn = callCourseWarn;
                $scope.callXufeiWarn = callXufeiWarn;
                $scope.callListenWarn = callListenWarn;
                $scope.callDayTeacherWarn = callDayTeacherWarn;
                $scope.callMonthTeacherMasterWarn = callMonthTeacherMasterWarn;

                /**
                 * 信息提醒
                 * @param tableState
                 */
                function callInfoWarn(tableState){
                    var pagination = tableState.pagination;
                    var obj = {
                        reminedType:1,
                        pageNum:pagination.start || 0,
                        pageSize:pagination.number || 10,
                        positionId:$scope.POSITION_ID
                    };
                    _getWarnData(obj,tableState,1);

                }
                /**
                 * 到访提醒
                 * @param tableState
                 */
                function callVisitWarn(tableState){
                    var pagination = tableState.pagination;
                    var obj = {
                        reminedType:2,
                        pageNum:pagination.start || 0,
                        pageSize:pagination.number || 10,
                        positionId:$scope.POSITION_ID
                    };
                    _getWarnData(obj,tableState,2);
                }
                /**
                 * 上课提醒
                 * @param tableState
                 */
                function callCourseWarn(tableState){
                    var pagination = tableState.pagination;
                    var obj = {
                        reminedType:3,
                        pageNum:pagination.start || 0,
                        pageSize:pagination.number || 10,
                        positionId:$scope.POSITION_ID
                    };
                    _getWarnData(obj,tableState,3);
                }
                /**
                 * 续费提醒
                 * @param tableState
                 */
                function callXufeiWarn(tableState){
                    var pagination = tableState.pagination;
                    var obj = {
                        reminedType:4,
                        pageNum:pagination.start || 0,
                        pageSize:pagination.number || 10,
                        positionId:$scope.POSITION_ID
                    };
                    _getWarnData(obj,tableState,4);
                }
                /**
                 * 试听提醒
                 * @param tableState
                 */
                function callListenWarn(tableState){
                    var pagination = tableState.pagination;
                    var obj = {
                        reminedType:5,
                        pageNum:pagination.start || 0,
                        pageSize:pagination.number || 10,
                        positionId:$scope.POSITION_ID
                    };
                    _getWarnData(obj,tableState,5);
                }
                /**
                 * 教师日差评提醒
                 * @param tableState
                 */
                function callDayTeacherWarn(tableState){
                    var pagination = tableState.pagination;
                    var obj = {
                        reminedType:6,
                        pageNum:pagination.start || 0,
                        pageSize:pagination.number || 10,
                        positionId:$scope.POSITION_ID
                    };
                    _getWarnData(obj,tableState,6);
                }
                /**
                 * 学管月差评提醒
                 * @param tableState
                 */
                function callMonthTeacherMasterWarn(tableState){
                    var pagination = tableState.pagination;
                    var obj = {
                        reminedType:7,
                        pageNum:pagination.start || 0,
                        pageSize:pagination.number || 10,
                        positionId:$scope.POSITION_ID
                    };
                    _getWarnData(obj,tableState,7);
                }



                /**
                 * 调用Service层 得到信息list
                 * {"type":1}提醒信息列表 {"type":2}到访信息列表 {"type":3}排课信息列表 {"type":4}续费信息列表  {"type":5}试听排课信息列表
                 * @param obj
                 * @param tableState 分页参数
                 * @param type
                 * @private
                 */
                function _getWarnData(obj,tableState,type){
                    obj.pageNum = obj.pageNum/obj.pageSize +1;//分页必须的从1开始
                    workbenchSvc.remindService(obj).then(function (result) {
                        if($scope.ifResponseSuccess(result)){
                            $scope.responseWarnData(type,oThis,result);
                            tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                        }


                    });
                }

                (function init(){
                    //callInfoWarn
                    $scope.requestRoleId = 6;//初始化当前controller角色id
                })();
            }]);

        /**
         * 个人数据/团队数据对应的controller
         * 每种数据类型对应一个controller
         */
        ywsApp.controller('workbench.xuexi.oneSelfCtrl',
            ['$scope', '$modal', '$rootScope', 'SweetAlert','workbenchSvc','$interval',
                function($scope, $modal, $rootScope, SweetAlert,workbenchSvc,$interval) {
                    var oThis = this;
                    oThis.views = {
                        isShowTop10:false,
                        isShowDetail:false,
                        isLineMonth:false,
                        updateTimeDsc:'日统计数据每30分钟更新一次，最新统计时间：'+Hours30(new Date()),
                    };

                    oThis._getDataCount = _getDataCount;

                    $scope.views.lineData =[];

                    oThis.callDataCount = callDataCount;
                    oThis.callDataTop10 = callDataTop10;

                    //---------------------------------------ctrl方法-------------------------------------

                    /**
                     * 得到个人数据/团队数据 饼图
                     */
                    function callDataCount(){
                        var obj = {
                            positionId:$scope.POSITION_ID,
                            dateType:oThis.pieConfig.dateType,//统计时间维度 1、日     2、周    3、月
                            dataType:oThis.requestDataType //计数据维度 1、个人数据     2、团队数据
                        };
                        _getDataCount(obj);
                    }
                    /**
                     * 调用Service 得到个人数据/团队数据 饼图
                     * @param obj
                     *      dateType：统计时间维度 1、日   2、周   3、月
                     *      dataType:计数据维度 1、个人数据 2、团队数据
                     * @private
                     */
                    function _getDataCount(obj){
                        workbenchSvc.dataCountService(obj).then(function (result) {
                            if($scope.ifResponseSuccess(result)){
                                var data = result.data;
                                oThis.views.pieData =$scope.responsePieData(data);
                            }
                        });
                    }

                    /**
                     * 得到top10 数据
                     * 因为使用smartTable  callDataTop10的参数必须是tableState 所以callDataTop10 无法抽取为父类方法
                     * @param tableState
                     */
                    function callDataTop10(tableState){
                        $scope._getSortedTop10(oThis,tableState);
                    }


                    /*************************************************************************************************************
                     * *********************************************************************************************************/
                    (function init($scope){
                        oThis.requestRoleId = $scope.requestRoleId;//得到角色id
                        oThis.requestDataType = 1;// dataType:计数据维度 1、个人数据 2、团队数据
                        oThis.pieConfig ={
                            dateType:1,
                            dataType:oThis.requestDataType
                        };
                        oThis.lineConfig = {
                            dateType:2,
                            dataType:oThis.requestDataType,
                            zoushiFlag:1
                        };

                        oThis.classDataType = 'workbench-xuexi-oneSelf';

                        oThis.callDataCount();
                        $scope.callDataCountDetail(oThis);

                    })($scope);
                }]);

    /**
     * 学习顾问主管 角色对应的controller
     * 一个角色对应的controller 每一个角色对应一个controller
     */
    ywsApp.controller('workbench.xuexiMasterCtrl',
        ['$scope', '$modal', '$rootScope', 'SweetAlert','workbenchSvc','$interval',
            function($scope, $modal, $rootScope, SweetAlert,workbenchSvc,$interval) {

                var oThis = this;

                $scope.callInfoWarn = callInfoWarn;
                $scope.callVisitWarn = callVisitWarn;
                $scope.callCourseWarn = callCourseWarn;
                $scope.callXufeiWarn = callXufeiWarn;
                $scope.callListenWarn = callListenWarn;
                $scope.callDayTeacherWarn = callDayTeacherWarn;
                $scope.callMonthTeacherMasterWarn = callMonthTeacherMasterWarn;

                /**
                 * 信息提醒
                 * @param tableState
                 */
                function callInfoWarn(tableState){
                    var pagination = tableState.pagination;
                    var obj = {
                        reminedType:1,
                        pageNum:pagination.start || 0,
                        pageSize:pagination.number || 10,
                        positionId:$scope.POSITION_ID
                    };
                    _getWarnData(obj,tableState,1);

                }
                /**
                 * 到访提醒
                 * @param tableState
                 */
                function callVisitWarn(tableState){
                    var pagination = tableState.pagination;
                    var obj = {
                        reminedType:2,
                        pageNum:pagination.start || 0,
                        pageSize:pagination.number || 10,
                        positionId:$scope.POSITION_ID
                    };
                    _getWarnData(obj,tableState,2);
                }
                /**
                 * 上课提醒
                 * @param tableState
                 */
                function callCourseWarn(tableState){
                    var pagination = tableState.pagination;
                    var obj = {
                        reminedType:3,
                        pageNum:pagination.start || 0,
                        pageSize:pagination.number || 10,
                        positionId:$scope.POSITION_ID
                    };
                    _getWarnData(obj,tableState,3);
                }
                /**
                 * 续费提醒
                 * @param tableState
                 */
                function callXufeiWarn(tableState){
                    var pagination = tableState.pagination;
                    var obj = {
                        reminedType:4,
                        pageNum:pagination.start || 0,
                        pageSize:pagination.number || 10,
                        positionId:$scope.POSITION_ID
                    };
                    _getWarnData(obj,tableState,4);
                }
                /**
                 * 试听提醒
                 * @param tableState
                 */
                function callListenWarn(tableState){
                    var pagination = tableState.pagination;
                    var obj = {
                        reminedType:5,
                        pageNum:pagination.start || 0,
                        pageSize:pagination.number || 10,
                        positionId:$scope.POSITION_ID
                    };
                    _getWarnData(obj,tableState,5);
                }

                /**
                 * 教师日差评提醒
                 * @param tableState
                 */
                function callDayTeacherWarn(tableState){
                    var pagination = tableState.pagination;
                    var obj = {
                        reminedType:6,
                        pageNum:pagination.start || 0,
                        pageSize:pagination.number || 10,
                        positionId:$scope.POSITION_ID
                    };
                    _getWarnData(obj,tableState,6);
                }
                /**
                 * 学管月差评提醒
                 * @param tableState
                 */
                function callMonthTeacherMasterWarn(tableState){
                    var pagination = tableState.pagination;
                    var obj = {
                        reminedType:7,
                        pageNum:pagination.start || 0,
                        pageSize:pagination.number || 10,
                        positionId:$scope.POSITION_ID
                    };
                    _getWarnData(obj,tableState,7);
                }


                /**
                 * 调用Service层 得到信息list
                 * {"type":1}提醒信息列表 {"type":2}到访信息列表 {"type":3}排课信息列表 {"type":4}续费信息列表  {"type":5}试听排课信息列表
                 * @param obj
                 * @param tableState 分页参数
                 * @param type
                 * @private
                 */
                function _getWarnData(obj,tableState,type){
                    obj.pageNum = obj.pageNum/obj.pageSize +1;//分页必须的从1开始
                    workbenchSvc.remindService(obj).then(function (result) {
                        if($scope.ifResponseSuccess(result)){
                            $scope.responseWarnData(type,oThis,result);
                            tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                        }


                    });
                }

                (function init(){
                    //callInfoWarn
                    $scope.requestRoleId = 7;//初始化当前controller角色id
                })();
            }]);

        /**
         * 个人数据对应的controller
         * 每种数据类型对应一个controller
         */
        ywsApp.controller('workbench.xuexiMaster.oneSelfCtrl',
        ['$scope', '$modal', '$rootScope', 'SweetAlert','workbenchSvc','$interval',
            function($scope, $modal, $rootScope, SweetAlert,workbenchSvc,$interval) {
                var oThis = this;
                oThis.views = {
                    isShowTop10:false,
                    isShowDetail:false,
                    isLineMonth:false,
                    updateTimeDsc:'日统计数据每30分钟更新一次，最新统计时间：'+Hours30(new Date()),
                };

                oThis._getDataCount = _getDataCount;

                $scope.views.lineData =[];

                oThis.callDataCount = callDataCount;
                oThis.callDataTop10 = callDataTop10;

                //---------------------------------------ctrl方法-------------------------------------

                /**
                 * 得到个人数据/团队数据 饼图
                 */
                function callDataCount(){
                    var obj = {
                        positionId:$scope.POSITION_ID,
                        dateType:oThis.pieConfig.dateType,//统计时间维度 1、日     2、周    3、月
                        dataType:oThis.requestDataType //计数据维度 1、个人数据     2、团队数据
                    };
                    _getDataCount(obj);
                }
                /**
                 * 调用Service 得到个人数据/团队数据 饼图
                 * @param obj
                 *      dateType：统计时间维度 1、日   2、周   3、月
                 *      dataType:计数据维度 1、个人数据 2、团队数据
                 * @private
                 */
                function _getDataCount(obj){
                    workbenchSvc.dataCountService(obj).then(function (result) {
                        if($scope.ifResponseSuccess(result)){
                            var data = result.data;
                            oThis.views.pieData =$scope.responsePieData(data);
                        }
                    });
                }

                /**
                 * 得到top10 数据
                 * 因为使用smartTable  callDataTop10的参数必须是tableState 所以callDataTop10 无法抽取为父类方法
                 * @param tableState
                 */
                function callDataTop10(tableState){
                    var obj = {
                        positionId:$scope.POSITION_ID,
                        dataType:oThis.requestDataType //计数据维度 1、个人数据     2、团队数据
                    };
                    $scope._getSortedTop10(oThis,tableState);
                }

                /*************************************************************************************************************
                 * *********************************************************************************************************/
                (function init($scope){
                    oThis.requestRoleId = $scope.requestRoleId;//得到角色id
                    oThis.requestDataType = 1;// dataType:计数据维度 1、个人数据 2、团队数据
                    oThis.pieConfig ={
                        dateType:1,
                        dataType:oThis.requestDataType
                    };
                    oThis.lineConfig = {
                        dateType:2,
                        dataType:oThis.requestDataType,
                        zoushiFlag:1
                    };

                    oThis.classDataType = 'workbench-xuexiMaster-oneSelf';

                    oThis.callDataCount();
                    $scope.callDataCountDetail(oThis);

                })($scope);
            }]);
        /**
         * 团队数据对应的controller
         * 每种数据类型对应一个controller
         */
        ywsApp.controller('workbench.xuexiMaster.teamCtrl',
            ['$scope', '$modal', '$rootScope', 'SweetAlert','workbenchSvc','$interval',
                function($scope, $modal, $rootScope, SweetAlert,workbenchSvc,$interval) {
                    var oThis = this;
                    oThis.views = {
                        isShowTop10:false,
                        isShowDetail:false,
                        isLineMonth:false,
                        updateTimeDsc:'日统计数据每30分钟更新一次，最新统计时间：'+Hours30(new Date()),
                    };

                    oThis._getDataCount = _getDataCount;

                    $scope.views.lineData =[];

                    oThis.callDataCount = callDataCount;
                    oThis.callDataTop10 = callDataTop10;
                    oThis.callDataMinxi = callDataMinxi;

                    //---------------------------------------ctrl方法-------------------------------------

                    /**
                     * 得到个人数据/团队数据 饼图
                     */
                    function callDataCount(){
                        var obj = {
                            positionId:$scope.POSITION_ID,
                            dateType:oThis.pieConfig.dateType,//统计时间维度 1、日     2、周    3、月
                            dataType:oThis.requestDataType //计数据维度 1、个人数据     2、团队数据
                        };
                        _getDataCount(obj);
                    }
                    /**
                     * 调用Service 得到个人数据/团队数据 饼图
                     * @param obj
                     *      dateType：统计时间维度 1、日   2、周   3、月
                     *      dataType:计数据维度 1、个人数据 2、团队数据
                     * @private
                     */
                    function _getDataCount(obj){
                        workbenchSvc.dataCountService(obj).then(function (result) {
                            if($scope.ifResponseSuccess(result)){
                                var data = result.data;
                                oThis.views.pieData =$scope.responsePieData(data);
                            }
                        });
                    }

                    /**
                     * 得到top10 数据
                     * 因为使用smartTable  callDataTop10的参数必须是tableState 所以callDataTop10 无法抽取为父类方法
                     * @param tableState
                     */
                    function callDataTop10(tableState){
                        var obj = {
                            positionId:$scope.POSITION_ID,
                            dataType:oThis.requestDataType //计数据维度 1、个人数据     2、团队数据
                        };
                        $scope._getSortedTop10(oThis,tableState);
                    }

                    function callDataMinxi(tableState){
                        oThis.tableState = tableState;
                        $scope._getMingxi(oThis,tableState);

                    }


                    /*************************************************************************************************************
                     * *********************************************************************************************************/
                    (function init($scope){
                        oThis.requestRoleId = $scope.requestRoleId;//得到角色id
                        oThis.requestDataType = 2;// dataType:计数据维度 1、个人数据 2、团队数据
                        oThis.pieConfig ={
                            dateType:1,
                            dataType:oThis.requestDataType
                        };
                        oThis.lineConfig = {
                            dateType:1,
                            dataType:oThis.requestDataType,
                            zoushiFlag:1
                        };

                        oThis.classDataType = 'workbench-kechengMaster-team';

                        oThis.callDataCount();
                        $scope.callDataCountDetail(oThis);

                    })($scope);
                }]);
        /**
         * 评价汇总数据对应的controller
         * 每种数据类型对应一个controller
         */
        ywsApp.controller('workbench.xuexiMaster.pingjiaCtrl',
            ['$scope', '$modal', '$rootScope', 'SweetAlert','workbenchSvc','$interval',
                function($scope, $modal, $rootScope, SweetAlert,workbenchSvc,$interval) {
                    var oThis = this;
                    oThis.views = {
                        isShowTop10:false,
                        isShowDetail:false,
                        isLineMonth:false,
                        updateTimeDsc:'日差评为当天提交评价，月差评为当月提交差评；提分率与满意度为当月统计数据。',
                    };

                    oThis._getDataCount = _getDataCount;

                    $scope.views.lineData =[];

                    oThis.callDataCount = callDataCount;
                    oThis.callDataTop10 = callDataTop10;
                    oThis.callDataMinxi = callDataMinxi;

                    //---------------------------------------ctrl方法-------------------------------------

                    /**
                     * 得到个人数据/团队数据 饼图
                     */
                    function callDataCount(){
                        var obj = {
                            positionId:$scope.POSITION_ID,
                            dateType:oThis.pieConfig.dateType,//统计时间维度 1、日     2、周    3、月
                           /* schoolMasterType:oThis.requestDataSchoolMasterType,//校长特有*/
                            dataType:oThis.requestDataType //计数据维度 1、个人数据     2、团队数据
                        };
                        _getDataCount(obj);
                    }
                    /**
                     * 调用Service 得到个人数据/团队数据 饼图
                     * @param obj
                     *      dateType：统计时间维度 1、日   2、周   3、月
                     *      dataType:计数据维度 1、个人数据 2、团队数据
                     * @private
                     */
                    function _getDataCount(obj){
                        workbenchSvc.dataCountService(obj).then(function (result) {
                            if($scope.ifResponseSuccess(result)){
                                var data = result.data;
                                oThis.views.pieData =$scope.responsePieData(data);
                            }
                        });
                    }

                    /**
                     * 得到top10 数据
                     * 因为使用smartTable  callDataTop10的参数必须是tableState 所以callDataTop10 无法抽取为父类方法
                     * @param tableState
                     */
                    function callDataTop10(tableState){
                        var obj = {
                            positionId:$scope.POSITION_ID,
                            dataType:oThis.requestDataType //计数据维度 1、个人数据     2、团队数据
                        };
                        $scope._getSortedTop10(oThis,tableState);
                    }

                    function callDataMinxi(tableState){
                        oThis.tableState = tableState;
                        $scope._getMingxi(oThis,tableState);

                    }

                    /*************************************************************************************************************
                     * *********************************************************************************************************/
                    (function init($scope){
                        oThis.requestRoleId = $scope.requestRoleId;//得到角色id
                        oThis.requestDataType = 3;// dataType:计数据维度 1、个人数据 2、团队数据 3评价汇总
                        oThis.requestDataSchoolMasterType =7;// 校长页面tab类型 1、校长数据  2、营销数据（课程顾问主管数据） 3、学管数据  4、教务数据  5、外呼数据  6、市场数据 7、评价tab
                        oThis.pieConfig ={
                            dateType:1,
                            dataType:oThis.requestDataType
                        };
                        oThis.lineConfig = {
                            dateType:1,
                            dataType:oThis.requestDataType,
                            zoushiFlag:1
                        };

                        oThis.classDataType = 'workbench-xiaozhang-huizong';

                        oThis.callDataCount();
                        $scope.callDataCountDetail(oThis);


                    })($scope);
                }]);


    /**
     * 课程顾问 角色对应的controller
     * 一个角色对应的controller 每一个角色对应一个controller
     */
    ywsApp.controller('workbench.kechengCtrl',
        ['$scope', '$modal', '$rootScope', 'SweetAlert','workbenchSvc','$interval',
            function($scope, $modal, $rootScope, SweetAlert,workbenchSvc,$interval) {
                var oThis = this;

                $scope.callInfoWarn = callInfoWarn;
                $scope.callVisitWarn = callVisitWarn;
                $scope.callCourseWarn = callCourseWarn;
                $scope.callXufeiWarn = callXufeiWarn;
                $scope.callListenWarn = callListenWarn;

                /**
                 * 信息提醒
                 * @param tableState
                 */
                function callInfoWarn(tableState){
                    var pagination = tableState.pagination;
                    var obj = {
                        reminedType:1,
                        pageNum:pagination.start || 0,
                        pageSize:pagination.number || 10,
                        positionId:$scope.POSITION_ID
                    };
                    _getWarnData(obj,tableState,1);

                }
                /**
                 * 到访提醒
                 * @param tableState
                 */
                function callVisitWarn(tableState){
                    var pagination = tableState.pagination;
                    var obj = {
                        reminedType:2,
                        pageNum:pagination.start || 0,
                        pageSize:pagination.number || 10,
                        positionId:$scope.POSITION_ID
                    };
                    _getWarnData(obj,tableState,2);
                }
                /**
                 * 上课提醒
                 * @param tableState
                 */
                function callCourseWarn(tableState){
                    var pagination = tableState.pagination;
                    var obj = {
                        reminedType:3,
                        pageNum:pagination.start || 0,
                        pageSize:pagination.number || 10,
                        positionId:$scope.POSITION_ID
                    };
                    _getWarnData(obj,tableState,3);
                }
                /**
                 * 续费提醒
                 * @param tableState
                 */
                function callXufeiWarn(tableState){
                    var pagination = tableState.pagination;
                    var obj = {
                        reminedType:4,
                        pageNum:pagination.start || 0,
                        pageSize:pagination.number || 10,
                        positionId:$scope.POSITION_ID
                    };
                    _getWarnData(obj,tableState,4);
                }
                /**
                 * 试听提醒
                 * @param tableState
                 */
                function callListenWarn(tableState){
                    var pagination = tableState.pagination;
                    var obj = {
                        reminedType:5,
                        pageNum:pagination.start || 0,
                        pageSize:pagination.number || 10,
                        positionId:$scope.POSITION_ID
                    };
                    _getWarnData(obj,tableState,5);
                }


                /**
                 * 调用Service层 得到信息list
                 * {"type":1}提醒信息列表 {"type":2}到访信息列表 {"type":3}排课信息列表 {"type":4}续费信息列表  {"type":5}试听排课信息列表
                 * @param obj
                 * @param tableState 分页参数
                 * @param type
                 * @private
                 */
                function _getWarnData(obj,tableState,type){
                    obj.pageNum = obj.pageNum/obj.pageSize +1;//分页必须的从1开始
                    workbenchSvc.remindService(obj).then(function (result) {
                        if($scope.ifResponseSuccess(result)){
                            $scope.responseWarnData(type,oThis,result);
                            tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                        }


                    });
                }

                (function init(){
                    //callInfoWarn
                    $scope.requestRoleId = 9;//初始化当前controller角色id
                })();
            }]);

        /**
         * 个人数据/团队数据对应的controller
         * 每种数据类型对应一个controller
         */
        ywsApp.controller('workbench.kecheng.oneSelfCtrl',
            ['$scope', '$modal', '$rootScope', 'SweetAlert','workbenchSvc','$interval',
                function($scope, $modal, $rootScope, SweetAlert,workbenchSvc,$interval) {
                    var oThis = this;
                    oThis.views = {
                        isShowTop10:false,
                        isShowDetail:false,
                        isLineMonth:false,
                        updateTimeDsc:'日统计数据每30分钟更新一次，最新统计时间：'+Hours30(new Date()),
                    };

                    oThis._getDataCount = _getDataCount;

                    $scope.views.lineData =[];

                    oThis.callDataCount = callDataCount;
                    oThis.callDataTop10 = callDataTop10;

                    //---------------------------------------ctrl方法-------------------------------------

                    /**
                     * 得到个人数据/团队数据 饼图
                     */
                    function callDataCount(){
                        var obj = {
                            positionId:$scope.POSITION_ID,
                            dateType:oThis.pieConfig.dateType,//统计时间维度 1、日     2、周    3、月
                            dataType:oThis.requestDataType //计数据维度 1、个人数据     2、团队数据
                        };
                        _getDataCount(obj);
                    }
                    /**
                     * 调用Service 得到个人数据/团队数据 饼图
                     * @param obj
                     *      dateType：统计时间维度 1、日   2、周   3、月
                     *      dataType:计数据维度 1、个人数据 2、团队数据
                     * @private
                     */
                    function _getDataCount(obj){
                        workbenchSvc.dataCountService(obj).then(function (result) {
                            if($scope.ifResponseSuccess(result)){
                                var data = result.data;
                                oThis.views.pieData =$scope.responsePieData(data);
                            }
                        });
                    }

                    /**
                     * 得到top10 数据
                     * 因为使用smartTable  callDataTop10的参数必须是tableState 所以callDataTop10 无法抽取为父类方法
                     * @param tableState
                     */
                    function callDataTop10(tableState){
                        var obj = {
                            positionId:$scope.POSITION_ID,
                            dataType:oThis.requestDataType //计数据维度 1、个人数据     2、团队数据
                        };
                        $scope._getSortedTop10(oThis,tableState);
                    }

                    /*************************************************************************************************************
                     * *********************************************************************************************************/
                    (function init($scope){
                        oThis.requestRoleId = $scope.requestRoleId;//得到角色id
                        oThis.requestDataType = 1;// dataType:计数据维度 1、个人数据 2、团队数据
                        oThis.pieConfig ={
                            dateType:1,
                            dataType:oThis.requestDataType
                        };
                        oThis.lineConfig = {
                            dateType:1,
                            dataType:oThis.requestDataType,
                            zoushiFlag:1
                        };

                        oThis.classDataType = 'workbench-kecheng-oneSelf';

                        oThis.callDataCount();
                        $scope.callDataCountDetail(oThis);

                    })($scope);
                }]);

    /**
     * 课程顾问主管 角色对应的controller
     * 一个角色对应的controller 每一个角色对应一个controller
     */
    ywsApp.controller('workbench.kechengMasterCtrl',
        ['$scope', '$modal', '$rootScope', 'SweetAlert','workbenchSvc','$interval',
            function($scope, $modal, $rootScope, SweetAlert,workbenchSvc,$interval) {

                var oThis = this;
                oThis.infoWarn =[];

                $scope.callInfoWarn = callInfoWarn;
                $scope.callVisitWarn = callVisitWarn;
                $scope.callCourseWarn = callCourseWarn;
                $scope.callXufeiWarn = callXufeiWarn;
                $scope.callListenWarn = callListenWarn;

                /**
                 * 信息提醒
                 * @param tableState
                 */
                function callInfoWarn(tableState){
                    var pagination = tableState.pagination;
                    var obj = {
                        reminedType:1,
                        pageNum:pagination.start || 0,
                        pageSize:pagination.number || 10,
                        positionId:$scope.POSITION_ID
                    };
                    _getWarnData(obj,tableState,1);

                }
                /**
                 * 到访提醒
                 * @param tableState
                 */
                function callVisitWarn(tableState){
                    var pagination = tableState.pagination;
                    var obj = {
                        reminedType:2,
                        pageNum:pagination.start || 0,
                        pageSize:pagination.number || 10,
                        positionId:$scope.POSITION_ID
                    };
                    _getWarnData(obj,tableState,2);
                }
                /**
                 * 上课提醒
                 * @param tableState
                 */
                function callCourseWarn(tableState){
                    var pagination = tableState.pagination;
                    var obj = {
                        reminedType:3,
                        pageNum:pagination.start || 0,
                        pageSize:pagination.number || 10,
                        positionId:$scope.POSITION_ID
                    };
                    _getWarnData(obj,tableState,3);
                }
                /**
                 * 续费提醒
                 * @param tableState
                 */
                function callXufeiWarn(tableState){
                    var pagination = tableState.pagination;
                    var obj = {
                        reminedType:4,
                        pageNum:pagination.start || 0,
                        pageSize:pagination.number || 10,
                        positionId:$scope.POSITION_ID
                    };
                    _getWarnData(obj,tableState,4);
                }
                /**
                 * 试听提醒
                 * @param tableState
                 */
                function callListenWarn(tableState){
                    var pagination = tableState.pagination;
                    var obj = {
                        reminedType:5,
                        pageNum:pagination.start || 0,
                        pageSize:pagination.number || 10,
                        positionId:$scope.POSITION_ID
                    };
                    _getWarnData(obj,tableState,5);
                }


                /**
                 * 调用Service层 得到信息list
                 * {"type":1}提醒信息列表 {"type":2}到访信息列表 {"type":3}排课信息列表 {"type":4}续费信息列表  {"type":5}试听排课信息列表
                 * @param obj
                 * @param tableState 分页参数
                 * @param type
                 * @private
                 */
                function _getWarnData(obj,tableState,type){
                    obj.pageNum = obj.pageNum/obj.pageSize +1;//分页必须的从1开始
                    workbenchSvc.remindService(obj).then(function (result) {
                        if($scope.ifResponseSuccess(result)){
                            $scope.responseWarnData(type,oThis,result);
                            tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                        }


                    });
                }

                (function init(){
                    //callInfoWarn

                    $scope.requestRoleId =10;//初始化当前controller角色id
                })();
            }]);

        /**
         * 个人数据对应的controller
         * 每种数据类型对应一个controller
         */
        ywsApp.controller('workbench.kechengMaster.oneSelfCtrl',
            ['$scope', '$modal', '$rootScope', 'SweetAlert','workbenchSvc','$interval',
                function($scope, $modal, $rootScope, SweetAlert,workbenchSvc,$interval) {
                    var oThis = this;
                    oThis.views = {
                        isShowTop10:false,
                        isShowDetail:false,
                        isLineMonth:false,
                        updateTimeDsc:'日统计数据每30分钟更新一次，最新统计时间：'+Hours30(new Date()),
                    };

                    oThis._getDataCount = _getDataCount;

                    $scope.views.lineData =[];

                    oThis.callDataCount = callDataCount;
                    oThis.callDataTop10 = callDataTop10;

                    //---------------------------------------ctrl方法-------------------------------------

                    /**
                     * 得到个人数据/团队数据 饼图
                     */
                    function callDataCount(){
                        var obj = {
                            positionId:$scope.POSITION_ID,
                            dateType:oThis.pieConfig.dateType,//统计时间维度 1、日     2、周    3、月
                            dataType:oThis.requestDataType //计数据维度 1、个人数据     2、团队数据
                        };
                        _getDataCount(obj);
                    }
                    /**
                     * 调用Service 得到个人数据/团队数据 饼图
                     * @param obj
                     *      dateType：统计时间维度 1、日   2、周   3、月
                     *      dataType:计数据维度 1、个人数据 2、团队数据
                     * @private
                     */
                    function _getDataCount(obj){
                        workbenchSvc.dataCountService(obj).then(function (result) {
                            if($scope.ifResponseSuccess(result)){
                                var data = result.data;
                                oThis.views.pieData =$scope.responsePieData(data);
                            }
                        });
                    }

                    /**
                     * 得到top10 数据
                     * 因为使用smartTable  callDataTop10的参数必须是tableState 所以callDataTop10 无法抽取为父类方法
                     * @param tableState
                     */
                    function callDataTop10(tableState){
                        var obj = {
                            positionId:$scope.POSITION_ID,
                            dataType:oThis.requestDataType //计数据维度 1、个人数据     2、团队数据
                        };
                        $scope._getSortedTop10(oThis,tableState);
                    }


                    /*************************************************************************************************************
                     * *********************************************************************************************************/
                    (function init($scope){
                        oThis.requestRoleId = $scope.requestRoleId;//得到角色id
                        oThis.requestDataType = 1;// dataType:计数据维度 1、个人数据 2、团队数据
                        oThis.pieConfig ={
                            dateType:1,
                            dataType:oThis.requestDataType
                        };
                        oThis.lineConfig = {
                            dateType:2,
                            dataType:oThis.requestDataType,
                            zoushiFlag:1
                        };

                        oThis.classDataType = 'workbench-kechengMaster-oneSelf';

                        oThis.callDataCount();
                        $scope.callDataCountDetail(oThis);

                    })($scope);
                }]);
        /**
         * 团队数据对应的controller
         * 每种数据类型对应一个controller
         */
        ywsApp.controller('workbench.kechengMaster.teamCtrl',
            ['$scope', '$modal', '$rootScope', 'SweetAlert','workbenchSvc','$interval',
                function($scope, $modal, $rootScope, SweetAlert,workbenchSvc,$interval) {
                    var oThis = this;
                    oThis.views = {
                        isShowTop10:false,
                        isShowDetail:false,
                        isLineMonth:false,
                        updateTimeDsc:'日统计数据每30分钟更新一次，最新统计时间：'+Hours30(new Date()),
                    };

                    oThis._getDataCount = _getDataCount;

                    $scope.views.lineData =[];

                    oThis.callDataCount = callDataCount;
                    oThis.callDataTop10 = callDataTop10;
                    oThis.callDataMinxi = callDataMinxi;

                    //---------------------------------------ctrl方法-------------------------------------

                    /**
                     * 得到个人数据/团队数据 饼图
                     */
                    function callDataCount(){
                        var obj = {
                            positionId:$scope.POSITION_ID,
                            dateType:oThis.pieConfig.dateType,//统计时间维度 1、日     2、周    3、月
                            dataType:oThis.requestDataType //计数据维度 1、个人数据     2、团队数据
                        };
                        _getDataCount(obj);
                    }
                    /**
                     * 调用Service 得到个人数据/团队数据 饼图
                     * @param obj
                     *      dateType：统计时间维度 1、日   2、周   3、月
                     *      dataType:计数据维度 1、个人数据 2、团队数据
                     * @private
                     */
                    function _getDataCount(obj){
                        workbenchSvc.dataCountService(obj).then(function (result) {
                            if($scope.ifResponseSuccess(result)){
                                var data = result.data;
                                oThis.views.pieData =$scope.responsePieData(data);
                            }
                        });
                    }

                    /**
                     * 得到top10 数据
                     * 因为使用smartTable  callDataTop10的参数必须是tableState 所以callDataTop10 无法抽取为父类方法
                     * @param tableState
                     */
                    function callDataTop10(tableState){
                        var obj = {
                            positionId:$scope.POSITION_ID,
                            dataType:oThis.requestDataType //计数据维度 1、个人数据     2、团队数据
                        };
                        $scope._getSortedTop10(oThis,tableState);
                    }

                    function callDataMinxi(tableState){
                        oThis.tableState = tableState;
                        $scope._getMingxi(oThis,tableState);

                    }


                    /*************************************************************************************************************
                     * *********************************************************************************************************/
                    (function init($scope){
                        oThis.requestRoleId = $scope.requestRoleId;//得到角色id
                        oThis.requestDataType = 2;// dataType:计数据维度 1、个人数据 2、团队数据
                        oThis.pieConfig ={
                            dateType:1,
                            dataType:oThis.requestDataType
                        };
                        oThis.lineConfig = {
                            dateType:2,
                            dataType:oThis.requestDataType,
                            zoushiFlag:1
                        };

                        oThis.classDataType = 'workbench-kechengMaster-team';

                        oThis.callDataCount();
                        $scope.callDataCountDetail(oThis);

                    })($scope);
                }]);

    /**
     * 教师 角色对应的controller
     * 一个角色对应的controller 每一个角色对应一个controller
     */
    ywsApp.controller('workbench.jiaoshiCtrl',
        ['$scope', '$modal', '$rootScope', 'SweetAlert','workbenchSvc','$interval','CoursePlanService',
            function($scope, $modal, $rootScope, SweetAlert,workbenchSvc,$interval,CoursePlanService) {

                var oThis = this;

                $scope.callInfoWarn = callInfoWarn;
                $scope.callVisitWarn = callVisitWarn;
                $scope.callCourseWarn = callCourseWarn;
                $scope.callXufeiWarn = callXufeiWarn;
                $scope.callListenWarn = callListenWarn;
                
                /**
                 * 获取今日上课安排
                 */
                $scope.getTodayCourse = function(tableState){
                	$scope.isLoading = true;
                	$scope.todayCourseTableState = tableState;
                	var pagination = tableState.pagination;
                    var start = pagination.start || 0; 
                    var number = pagination.number || 5;
                    CoursePlanService.getTeacherTodayCourse(start, number, $scope.todayCourseTableState).then(function (result) {
                    	$scope.todayCourse = result.data.data.page.list;
                    	tableState.pagination.numberOfPages = result.data.data.page.pages;
                    	$scope.dayOfWeek = result.data.data.dayOfWeek;
                		$scope.dateStr = result.data.data.dateStr;
                        $scope.isLoading = false;
                    });
                }
                
                $scope.getTodayCoursePackBefore = function(tableState){
                	$scope.isLoading = true;
                	$scope.todayCoursePackBeforeTableState = tableState;
                	$scope.todayCoursePackBeforeTableState.search = {};
                	$scope.todayCoursePackBeforeTableState.search.predicateObject = {};
                	$scope.todayCoursePackBeforeTableState.search.predicateObject.before = 1;
                	var pagination = tableState.pagination;
                    var start = pagination.start || 0; 
                    var number = pagination.number || 5;
                    CoursePlanService.getTeacherTodayCourse(start, number, $scope.todayCoursePackBeforeTableState).then(function (result) {
                    	$scope.todayCoursePackBefore = result.data.data.page.list;
                    	tableState.pagination.numberOfPages = result.data.data.page.pages;//set the number of pages so the pagination can update
                        $scope.isLoading = false;
                    });
                }
                
                $scope.getTodayCoursePackAfter = function(tableState){
                	$scope.isLoading = true;
                	$scope.todayCoursePackAfterTableState = tableState;
                	$scope.todayCoursePackAfterTableState.search = {};
                	$scope.todayCoursePackAfterTableState.search.predicateObject = {};
                	$scope.todayCoursePackAfterTableState.search.predicateObject.after = 1;
                	var pagination = tableState.pagination;
                    var start = pagination.start || 0; 
                    var number = pagination.number || 5;
                    CoursePlanService.getTeacherTodayCourse(start, number, $scope.todayCoursePackAfterTableState).then(function (result) {
                    	$scope.todayCoursePackAfter = result.data.data.page.list;
                    	tableState.pagination.numberOfPages = result.data.data.page.pages;
                        $scope.isLoading = false;
                    });
                }
            	
                /**
                 * 信息提醒
                 * @param tableState
                 */
                function callInfoWarn(tableState){
                    var pagination = tableState.pagination;
                    var obj = {
                        reminedType:1,
                        pageNum:pagination.start || 0,
                        pageSize:pagination.number || 10,
                        positionId:$scope.POSITION_ID
                    };
                    _getWarnData(obj,tableState,1);

                }
                /**
                 * 到访提醒
                 * @param tableState
                 */
                function callVisitWarn(tableState){
                    var pagination = tableState.pagination;
                    var obj = {
                        reminedType:2,
                        pageNum:pagination.start || 0,
                        pageSize:pagination.number || 10,
                        positionId:$scope.POSITION_ID
                    };
                    _getWarnData(obj,tableState,2);
                }
                /**
                 * 上课提醒
                 * @param tableState
                 */
                function callCourseWarn(tableState){
                    var pagination = tableState.pagination;
                    var obj = {
                        reminedType:3,
                        pageNum:pagination.start || 0,
                        pageSize:pagination.number || 10,
                        positionId:$scope.POSITION_ID
                    };
                    _getWarnData(obj,tableState,3);
                }
                /**
                 * 续费提醒
                 * @param tableState
                 */
                function callXufeiWarn(tableState){
                    var pagination = tableState.pagination;
                    var obj = {
                        reminedType:4,
                        pageNum:pagination.start || 0,
                        pageSize:pagination.number || 10,
                        positionId:$scope.POSITION_ID
                    };
                    _getWarnData(obj,tableState,4);
                }
                /**
                 * 试听提醒
                 * @param tableState
                 */
                function callListenWarn(tableState){
                    var pagination = tableState.pagination;
                    var obj = {
                        reminedType:5,
                        pageNum:pagination.start || 0,
                        pageSize:pagination.number || 10,
                        positionId:$scope.POSITION_ID
                    };
                    _getWarnData(obj,tableState,5);
                }


                /**
                 * 调用Service层 得到信息list
                 * {"type":1}提醒信息列表 {"type":2}到访信息列表 {"type":3}排课信息列表 {"type":4}续费信息列表  {"type":5}试听排课信息列表
                 * @param obj
                 * @param tableState 分页参数
                 * @param type
                 * @private
                 */
                function _getWarnData(obj,tableState,type){
                    obj.pageNum = obj.pageNum/obj.pageSize +1;//分页必须的从1开始
                    workbenchSvc.remindService(obj).then(function (result) {
                        if($scope.ifResponseSuccess(result)){
                            $scope.responseWarnData(type,oThis,result);
                            tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                        }


                    });
                }

                (function init(){
                    //callInfoWarn
                    $scope.requestRoleId = 12;//初始化当前controller角色id
                })();
            }]);

        /**
         * 个人数据/团队数据对应的controller
         * 每种数据类型对应一个controller
         */
        ywsApp.controller('workbench.jiaoshi.oneSelfCtrl',
            ['$scope', '$modal', '$rootScope', 'SweetAlert','workbenchSvc','$interval',
                function($scope, $modal, $rootScope, SweetAlert,workbenchSvc,$interval) {
                    var oThis = this;
                    oThis.views = {
                        isShowTop10:false,
                        isShowDetail:false,
                        isLineMonth:false,
                        updateTimeDsc:'日统计数据每30分钟更新一次，最新统计时间：'+Hours30(new Date()),
                    };

                    oThis._getDataCount = _getDataCount;

                    $scope.views.lineData =[];

                    oThis.callDataCount = callDataCount;
                    oThis.callDataTop10 = callDataTop10;

                    //---------------------------------------ctrl方法-------------------------------------

                    /**
                     * 得到个人数据/团队数据 饼图
                     */
                    function callDataCount(){
                        var obj = {
                            positionId:$scope.POSITION_ID,
                            dateType:oThis.pieConfig.dateType,//统计时间维度 1、日     2、周    3、月
                            dataType:oThis.requestDataType //计数据维度 1、个人数据     2、团队数据
                        };
                        _getDataCount(obj);
                    }
                    /**
                     * 调用Service 得到个人数据/团队数据 饼图
                     * @param obj
                     *      dateType：统计时间维度 1、日   2、周   3、月
                     *      dataType:计数据维度 1、个人数据 2、团队数据
                     * @private
                     */
                    function _getDataCount(obj){
                        workbenchSvc.dataCountService(obj).then(function (result) {
                            if($scope.ifResponseSuccess(result)){
                                var data = result.data;
                                oThis.views.pieData =$scope.responsePieData(data);
                            }
                        });
                    }

                    /**
                     * 得到top10 数据
                     * 因为使用smartTable  callDataTop10的参数必须是tableState 所以callDataTop10 无法抽取为父类方法
                     * @param tableState
                     */
                    function callDataTop10(tableState){
                        var obj = {
                            positionId:$scope.POSITION_ID,
                            dataType:oThis.requestDataType //计数据维度 1、个人数据     2、团队数据
                        };
                        $scope._getSortedTop10(oThis,tableState);
                    }

                    /*************************************************************************************************************
                     * *********************************************************************************************************/
                    (function init($scope){
                        oThis.requestRoleId = $scope.requestRoleId;//得到角色id
                        oThis.requestDataType = 1;// dataType:计数据维度 1、个人数据 2、团队数据
                        oThis.pieConfig ={
                            dateType:1,
                            dataType:oThis.requestDataType
                        };
                        oThis.lineConfig = {
                            dateType:2,
                            dataType:oThis.requestDataType,
                            zoushiFlag:1
                        };

                        oThis.classDataType = 'workbench-jiaoshi-oneSelf';

                        oThis.callDataCount();
                        $scope.callDataCountDetail(oThis);

                    })($scope);
                }]);

    /**
     * 教务主管 角色对应的controller
     * 一个角色对应的controller 每一个角色对应一个controller
     */
    ywsApp.controller('workbench.jiaoshiMasterCtrl',
        ['$scope', '$modal', '$rootScope', 'SweetAlert','workbenchSvc','$interval',
            function($scope, $modal, $rootScope, SweetAlert,workbenchSvc,$interval) {
                var oThis = this;
                oThis.views = {
                    isShowTop10:false,
                    isShowDetail:false,
                    isLineMonth:false,
                    updateTimeDsc:'日统计数据每30分钟更新一次，最新统计时间：'+Hours30(new Date()),
                };

                oThis._getDataCount = _getDataCount;

                $scope.views.lineData =[];

                oThis.callDataCount = callDataCount;
                oThis.callDataTop10 = callDataTop10;
                oThis.callDataMinxi = callDataMinxi;

                //---------------------------------------ctrl方法-------------------------------------

                /**
                 * 得到个人数据/团队数据 饼图
                 */
                function callDataCount(){
                    var obj = {
                        positionId:$scope.POSITION_ID,
                        dateType:oThis.pieConfig.dateType,//统计时间维度 1、日     2、周    3、月
                        dataType:oThis.requestDataType //计数据维度 1、个人数据     2、团队数据
                    };
                    _getDataCount(obj);
                }
                /**
                 * 调用Service 得到个人数据/团队数据 饼图
                 * @param obj
                 *      dateType：统计时间维度 1、日   2、周   3、月
                 *      dataType:计数据维度 1、个人数据 2、团队数据
                 * @private
                 */
                function _getDataCount(obj){
                    workbenchSvc.dataCountService(obj).then(function (result) {
                        if($scope.ifResponseSuccess(result)){
                            var data = result.data;
                            oThis.views.pieData =$scope.responsePieData(data);
                        }
                    });
                }

                /**
                 * 得到top10 数据
                 * 因为使用smartTable  callDataTop10的参数必须是tableState 所以callDataTop10 无法抽取为父类方法
                 * @param tableState
                 */
                function callDataTop10(tableState){
                    var obj = {
                        positionId:$scope.POSITION_ID,
                        dataType:oThis.requestDataType //计数据维度 1、个人数据     2、团队数据
                    };
                    $scope._getSortedTop10(oThis,tableState);
                }

                function callDataMinxi(tableState){
                    $scope._getMingxi(oThis,tableState);
                }

                (function init(){
                    //callInfoWarn
                    $scope.requestRoleId = 25;//初始化当前controller角色id
                })();
            }]);

        /**
         * 个人数据/团队数据对应的controller
         * 每种数据类型对应一个controller
         */
        ywsApp.controller('workbench.jiaoshiMaster.oneSelfCtrl',
            ['$scope', '$modal', '$rootScope', 'SweetAlert','workbenchSvc','$interval',
                function($scope, $modal, $rootScope, SweetAlert,workbenchSvc,$interval) {
                    var oThis = this;
                    oThis.views = {
                        isShowTop10:false,
                        isShowDetail:false,
                        isLineMonth:false,
                        updateTimeDsc:'日统计数据每30分钟更新一次，最新统计时间：'+Hours30(new Date()),
                    };

                    oThis._getDataCount = _getDataCount;

                    $scope.views.lineData =[];

                    oThis.callDataCount = callDataCount;
                    oThis.callDataTop10 = callDataTop10;
                    oThis.callDataMinxi = callDataMinxi;

                    //---------------------------------------ctrl方法-------------------------------------

                    /**
                     * 得到个人数据/团队数据 饼图
                     */
                    function callDataCount(){
                        var obj = {
                            positionId:$scope.POSITION_ID,
                            dateType:oThis.pieConfig.dateType,//统计时间维度 1、日     2、周    3、月
                            dataType:oThis.requestDataType //计数据维度 1、个人数据     2、团队数据
                        };
                        _getDataCount(obj);
                    }
                    /**
                     * 调用Service 得到个人数据/团队数据 饼图
                     * @param obj
                     *      dateType：统计时间维度 1、日   2、周   3、月
                     *      dataType:计数据维度 1、个人数据 2、团队数据
                     * @private
                     */
                    function _getDataCount(obj){
                        workbenchSvc.dataCountService(obj).then(function (result) {
                            if($scope.ifResponseSuccess(result)){
                                var data = result.data;
                                oThis.views.pieData =$scope.responsePieData(data);
                            }
                        });
                    }

                    /**
                     * 得到top10 数据
                     * 因为使用smartTable  callDataTop10的参数必须是tableState 所以callDataTop10 无法抽取为父类方法
                     * @param tableState
                     */
                    function callDataTop10(tableState){
                        var obj = {
                            positionId:$scope.POSITION_ID,
                            dataType:oThis.requestDataType //计数据维度 1、个人数据     2、团队数据
                        };
                        $scope._getSortedTop10(oThis,tableState);
                    }

                    function callDataMinxi(tableState){
                        oThis.tableState = tableState;
                        $scope._getMingxi(oThis,tableState);

                    }




                    /*************************************************************************************************************
                     * *********************************************************************************************************/
                    (function init($scope){
                        oThis.requestRoleId = $scope.requestRoleId;//得到角色id
                        oThis.requestDataType = 2;// dataType:计数据维度 1、个人数据 2、团队数据
                        oThis.pieConfig ={
                            dateType:1,
                            dataType:oThis.requestDataType
                        };
                        oThis.lineConfig = {
                            dateType:1,
                            dataType:oThis.requestDataType,
                            zoushiFlag:6
                        };

                        oThis.classDataType = 'workbench-jiaoshiMaster-oneSelf';

                        oThis.callDataCount();
                        $scope.callDataCountDetail(oThis);

                    })($scope);
                }]);
        /**
         * 评价汇总数据对应的controller
         * 每种数据类型对应一个controller
         */
        ywsApp.controller('workbench.jiaoshiMaster.pingjiaCtrl',
            ['$scope', '$modal', '$rootScope', 'SweetAlert','workbenchSvc','$interval',
                function($scope, $modal, $rootScope, SweetAlert,workbenchSvc,$interval) {
                    var oThis = this;
                    oThis.views = {
                        isShowTop10:false,
                        isShowDetail:false,
                        isLineMonth:false,
                        updateTimeDsc:'日差评为当天提交评价；提分率与满意度为当月统计数据。',
                    };

                    oThis._getDataCount = _getDataCount;

                    $scope.views.lineData =[];

                    oThis.callDataCount = callDataCount;
                    oThis.callDataTop10 = callDataTop10;
                    oThis.callDataMinxi = callDataMinxi;

                    //---------------------------------------ctrl方法-------------------------------------

                    /**
                     * 得到个人数据/团队数据 饼图
                     */
                    function callDataCount(){
                        var obj = {
                            positionId:$scope.POSITION_ID,
                            dateType:oThis.pieConfig.dateType,//统计时间维度 1、日     2、周    3、月
                           /* schoolMasterType:oThis.requestDataSchoolMasterType,//校长特有*/
                            dataType:oThis.requestDataType //计数据维度 1、个人数据     2、团队数据
                        };
                        _getDataCount(obj);
                    }
                    /**
                     * 调用Service 得到个人数据/团队数据 饼图
                     * @param obj
                     *      dateType：统计时间维度 1、日   2、周   3、月
                     *      dataType:计数据维度 1、个人数据 2、团队数据
                     * @private
                     */
                    function _getDataCount(obj){
                        workbenchSvc.dataCountService(obj).then(function (result) {
                            if($scope.ifResponseSuccess(result)){
                                var data = result.data;
                                oThis.views.pieData =$scope.responsePieData(data);
                            }
                        });
                    }

                    /**
                     * 得到top10 数据
                     * 因为使用smartTable  callDataTop10的参数必须是tableState 所以callDataTop10 无法抽取为父类方法
                     * @param tableState
                     */
                    function callDataTop10(tableState){
                        var obj = {
                            positionId:$scope.POSITION_ID,
                            dataType:oThis.requestDataType //计数据维度 1、个人数据     2、团队数据
                        };
                        $scope._getSortedTop10(oThis,tableState);
                    }

                    function callDataMinxi(tableState){
                        oThis.tableState = tableState;
                        $scope._getMingxi(oThis,tableState);

                    }

                    /*************************************************************************************************************
                     * *********************************************************************************************************/
                    (function init($scope){
                        oThis.requestRoleId = $scope.requestRoleId;//得到角色id
                        oThis.requestDataType = 3;// dataType:计数据维度 1、个人数据 2、团队数据 3评价汇总
                       /* oThis.requestDataSchoolMasterType =7;// 校长页面tab类型 1、校长数据  2、营销数据（课程顾问主管数据） 3、学管数据  4、教务数据  5、外呼数据  6、市场数据 7、评价tab*/
                        oThis.pieConfig ={
                            dateType:1,
                            dataType:oThis.requestDataType
                        };
                        oThis.lineConfig = {
                            dateType:1,
                            dataType:oThis.requestDataType,
                            zoushiFlag:1
                        };

                        oThis.classDataType = 'workbench-jiaoshiMaster-huizong';

                        oThis.callDataCount();
                        $scope.callDataCountDetail(oThis);


                    })($scope);
                }]);

    /**
     * 呼叫专业 角色对应的controller
     * 一个角色对应的controller 每一个角色对应一个controller
     */
    ywsApp.controller('workbench.hujiaoCtrl',
        ['$scope', '$modal', '$rootScope', 'SweetAlert','workbenchSvc','$interval',
            function($scope, $modal, $rootScope, SweetAlert,workbenchSvc,$interval) {

                var oThis = this;

                $scope.callInfoWarn = callInfoWarn;
                $scope.callVisitWarn = callVisitWarn;
                $scope.callCourseWarn = callCourseWarn;
                $scope.callXufeiWarn = callXufeiWarn;
                $scope.callListenWarn = callListenWarn;

                /**
                 * 信息提醒
                 * @param tableState
                 */
                function callInfoWarn(tableState){
                    var pagination = tableState.pagination;
                    var obj = {
                        reminedType:1,
                        pageNum:pagination.start || 0,
                        pageSize:pagination.number || 10,
                        positionId:$scope.POSITION_ID
                    };
                    _getWarnData(obj,tableState,1);

                }
                /**
                 * 到访提醒
                 * @param tableState
                 */
                function callVisitWarn(tableState){
                    var pagination = tableState.pagination;
                    var obj = {
                        reminedType:2,
                        pageNum:pagination.start || 0,
                        pageSize:pagination.number || 10,
                        positionId:$scope.POSITION_ID
                    };
                    _getWarnData(obj,tableState,2);
                }
                /**
                 * 上课提醒
                 * @param tableState
                 */
                function callCourseWarn(tableState){
                    var pagination = tableState.pagination;
                    var obj = {
                        reminedType:3,
                        pageNum:pagination.start || 0,
                        pageSize:pagination.number || 10,
                        positionId:$scope.POSITION_ID
                    };
                    _getWarnData(obj,tableState,3);
                }
                /**
                 * 续费提醒
                 * @param tableState
                 */
                function callXufeiWarn(tableState){
                    var pagination = tableState.pagination;
                    var obj = {
                        reminedType:4,
                        pageNum:pagination.start || 0,
                        pageSize:pagination.number || 10,
                        positionId:$scope.POSITION_ID
                    };
                    _getWarnData(obj,tableState,4);
                }
                /**
                 * 试听提醒
                 * @param tableState
                 */
                function callListenWarn(tableState){
                    var pagination = tableState.pagination;
                    var obj = {
                        reminedType:5,
                        pageNum:pagination.start || 0,
                        pageSize:pagination.number || 10,
                        positionId:$scope.POSITION_ID
                    };
                    _getWarnData(obj,tableState,5);
                }


                /**
                 * 调用Service层 得到信息list
                 * {"type":1}提醒信息列表 {"type":2}到访信息列表 {"type":3}排课信息列表 {"type":4}续费信息列表  {"type":5}试听排课信息列表
                 * @param obj
                 * @param tableState 分页参数
                 * @param type
                 * @private
                 */
                function _getWarnData(obj,tableState,type){
                    obj.pageNum = obj.pageNum/obj.pageSize +1;//分页必须的从1开始
                    workbenchSvc.remindService(obj).then(function (result) {
                        if($scope.ifResponseSuccess(result)){
                            oThis.rank = 0;
                            $scope.responseWarnData(type,oThis,result);
                            tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                        }


                    });
                }

                (function init(){
                    //callInfoWarn
                    $scope.requestRoleId = 14;//初始化当前controller角色id
                })();
            }]);

        /**
         * 个人数据/团队数据对应的controller
         * 每种数据类型对应一个controller
         */
        ywsApp.controller('workbench.hujiao.oneSelfCtrl',
            ['$scope', '$modal', '$rootScope', 'SweetAlert','workbenchSvc','$interval',
                function($scope, $modal, $rootScope, SweetAlert,workbenchSvc,$interval) {
                    var oThis = this;
                    oThis.views = {
                        isShowTop10:false,
                        isShowDetail:false,
                        isLineMonth:false,
                        updateTimeDsc:'日统计数据每30分钟更新一次，最新统计时间：'+Hours30(new Date()),
                    };

                    oThis._getDataCount = _getDataCount;

                    $scope.views.lineData =[];

                    oThis.callDataCount = callDataCount;
                    oThis.callDataTop10 = callDataTop10;

                    //---------------------------------------ctrl方法-------------------------------------

                    /**
                     * 得到个人数据/团队数据 饼图
                     */
                    function callDataCount(){
                        var obj = {
                            positionId:$scope.POSITION_ID,
                            dateType:oThis.pieConfig.dateType,//统计时间维度 1、日     2、周    3、月
                            dataType:oThis.requestDataType //计数据维度 1、个人数据     2、团队数据
                        };
                        _getDataCount(obj);
                    }
                    /**
                     * 调用Service 得到个人数据/团队数据 饼图
                     * @param obj
                     *      dateType：统计时间维度 1、日   2、周   3、月
                     *      dataType:计数据维度 1、个人数据 2、团队数据
                     * @private
                     */
                    function _getDataCount(obj){
                        workbenchSvc.dataCountService(obj).then(function (result) {
                            if($scope.ifResponseSuccess(result)){
                                var data = result.data;
                                oThis.views.pieData =$scope.responsePieData(data);
                            }
                        });
                    }

                    /**
                     * 得到top10 数据
                     * 因为使用smartTable  callDataTop10的参数必须是tableState 所以callDataTop10 无法抽取为父类方法
                     * @param tableState
                     */
                    function callDataTop10(tableState){
                        var obj = {
                            positionId:$scope.POSITION_ID,
                            dataType:oThis.requestDataType //计数据维度 1、个人数据     2、团队数据
                        };
                        $scope._getSortedTop10(oThis,tableState);
                    }


                    /*************************************************************************************************************
                     * *********************************************************************************************************/
                    (function init($scope){
                        oThis.requestRoleId = $scope.requestRoleId;//得到角色id
                        oThis.requestDataType = 1;// dataType:计数据维度 1、个人数据 2、团队数据
                        oThis.pieConfig ={
                            dateType:1,
                            dataType:oThis.requestDataType
                        };
                        oThis.lineConfig = {
                            dateType:2,
                            dataType:oThis.requestDataType,
                            zoushiFlag:1
                        };

                        oThis.classDataType = 'workbench-hujiao-oneSelf';

                        oThis.callDataCount();
                        $scope.callDataCountDetail(oThis);

                    })($scope);
                }]);

    /**
     * 呼叫主管 角色对应的controller
     * 一个角色对应的controller 每一个角色对应一个controller
     */
    ywsApp.controller('workbench.hujiaoMasterCtrl',
        ['$scope', '$modal', '$rootScope', 'SweetAlert','workbenchSvc','$interval',
            function($scope, $modal, $rootScope, SweetAlert,workbenchSvc,$interval) {
                var oThis = this;

                $scope.callInfoWarn = callInfoWarn;
                $scope.callVisitWarn = callVisitWarn;
                $scope.callCourseWarn = callCourseWarn;
                $scope.callXufeiWarn = callXufeiWarn;
                $scope.callListenWarn = callListenWarn;

                /**
                 * 信息提醒
                 * @param tableState
                 */
                function callInfoWarn(tableState){
                    var pagination = tableState.pagination;
                    var obj = {
                        reminedType:1,
                        pageNum:pagination.start || 0,
                        pageSize:pagination.number || 10,
                        positionId:$scope.POSITION_ID
                    };
                    _getWarnData(obj,tableState,1);

                }
                /**
                 * 到访提醒
                 * @param tableState
                 */
                function callVisitWarn(tableState){
                    var pagination = tableState.pagination;
                    var obj = {
                        reminedType:2,
                        pageNum:pagination.start || 0,
                        pageSize:pagination.number || 10,
                        positionId:$scope.POSITION_ID
                    };
                    _getWarnData(obj,tableState,2);
                }
                /**
                 * 上课提醒
                 * @param tableState
                 */
                function callCourseWarn(tableState){
                    var pagination = tableState.pagination;
                    var obj = {
                        reminedType:3,
                        pageNum:pagination.start || 0,
                        pageSize:pagination.number || 10,
                        positionId:$scope.POSITION_ID
                    };
                    _getWarnData(obj,tableState,3);
                }
                /**
                 * 续费提醒
                 * @param tableState
                 */
                function callXufeiWarn(tableState){
                    var pagination = tableState.pagination;
                    var obj = {
                        reminedType:4,
                        pageNum:pagination.start || 0,
                        pageSize:pagination.number || 10,
                        positionId:$scope.POSITION_ID
                    };
                    _getWarnData(obj,tableState,4);
                }
                /**
                 * 试听提醒
                 * @param tableState
                 */
                function callListenWarn(tableState){
                    var pagination = tableState.pagination;
                    var obj = {
                        reminedType:5,
                        pageNum:pagination.start || 0,
                        pageSize:pagination.number || 10,
                        positionId:$scope.POSITION_ID
                    };
                    _getWarnData(obj,tableState,5);
                }


                /**
                 * 调用Service层 得到信息list
                 * {"type":1}提醒信息列表 {"type":2}到访信息列表 {"type":3}排课信息列表 {"type":4}续费信息列表  {"type":5}试听排课信息列表
                 * @param obj
                 * @param tableState 分页参数
                 * @param type
                 * @private
                 */
                function _getWarnData(obj,tableState,type){
                    obj.pageNum = obj.pageNum/obj.pageSize +1;//分页必须的从1开始
                    workbenchSvc.remindService(obj).then(function (result) {
                        if($scope.ifResponseSuccess(result)){
                            $scope.responseWarnData(type,oThis,result);
                            tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                        }


                    });
                }

                (function init(){
                    //callInfoWarn
                    $scope.requestRoleId = 13;//初始化当前controller角色id
                })();
            }]);

        /**
         * 个人数据/团队数据对应的controller
         * 每种数据类型对应一个controller
         */
        ywsApp.controller('workbench.hujiaoMaster.oneSelfCtrl',
            ['$scope', '$modal', '$rootScope', 'SweetAlert','workbenchSvc','$interval',
                function($scope, $modal, $rootScope, SweetAlert,workbenchSvc,$interval) {
                    var oThis = this;
                    oThis.views = {
                        isShowTop10:false,
                        isShowDetail:false,
                        isLineMonth:false,
                        updateTimeDsc:'日统计数据每30分钟更新一次，最新统计时间：'+Hours30(new Date()),
                    };

                    oThis._getDataCount = _getDataCount;

                    $scope.views.lineData =[];

                    oThis.callDataCount = callDataCount;
                    oThis.callDataTop10 = callDataTop10;

                    //---------------------------------------ctrl方法-------------------------------------

                    /**
                     * 得到个人数据/团队数据 饼图
                     */
                    function callDataCount(){
                        var obj = {
                            positionId:$scope.POSITION_ID,
                            dateType:oThis.pieConfig.dateType,//统计时间维度 1、日     2、周    3、月
                            dataType:oThis.requestDataType //计数据维度 1、个人数据     2、团队数据
                        };
                        _getDataCount(obj);
                    }
                    /**
                     * 调用Service 得到个人数据/团队数据 饼图
                     * @param obj
                     *      dateType：统计时间维度 1、日   2、周   3、月
                     *      dataType:计数据维度 1、个人数据 2、团队数据
                     * @private
                     */
                    function _getDataCount(obj){
                        workbenchSvc.dataCountService(obj).then(function (result) {
                            if($scope.ifResponseSuccess(result)){
                                var data = result.data;
                                oThis.views.pieData =$scope.responsePieData(data);
                            }
                        });
                    }

                    /**
                     * 得到top10 数据
                     * 因为使用smartTable  callDataTop10的参数必须是tableState 所以callDataTop10 无法抽取为父类方法
                     * @param tableState
                     */
                    function callDataTop10(tableState){
                        var obj = {
                            positionId:$scope.POSITION_ID,
                            dataType:oThis.requestDataType //计数据维度 1、个人数据     2、团队数据
                        };
                        $scope._getSortedTop10(oThis,tableState);
                    }



                    /*************************************************************************************************************
                     * *********************************************************************************************************/
                    (function init($scope){
                        oThis.requestRoleId = $scope.requestRoleId;//得到角色id
                        oThis.requestDataType = 1;// dataType:计数据维度 1、个人数据 2、团队数据
                        oThis.pieConfig ={
                            dateType:1,
                            dataType:oThis.requestDataType
                        };
                        oThis.lineConfig = {
                            dateType:2,
                            dataType:oThis.requestDataType,
                            zoushiFlag:1
                        };

                        oThis.classDataType = 'workbench-hujiaoMaster-oneSelf';

                        oThis.callDataCount();
                        //$scope.callDataMinxi(oThis);
                        $scope.callDataCountDetail(oThis);

                    })($scope);
                }]);
        /**
         * 团队数据对应的controller
         * 每种数据类型对应一个controller
         */
        ywsApp.controller('workbench.hujiaoMaster.teamCtrl',
             ['$scope', '$modal', '$rootScope', 'SweetAlert','workbenchSvc','$interval',
        function($scope, $modal, $rootScope, SweetAlert,workbenchSvc,$interval) {
            var oThis = this;
            oThis.views = {
                isShowTop10:false,
                isShowDetail:false,
                isLineMonth:false,
                updateTimeDsc:'日统计数据每30分钟更新一次，最新统计时间：'+Hours30(new Date()),
            };

            oThis._getDataCount = _getDataCount;

            $scope.views.lineData =[];

            oThis.callDataCount = callDataCount;
            oThis.callDataTop10 = callDataTop10;
            oThis.callDataMinxi = callDataMinxi;

            //---------------------------------------ctrl方法-------------------------------------

            /**
             * 得到个人数据/团队数据 饼图
             */
            function callDataCount(){
                var obj = {
                    positionId:$scope.POSITION_ID,
                    dateType:oThis.pieConfig.dateType,//统计时间维度 1、日     2、周    3、月
                    dataType:oThis.requestDataType //计数据维度 1、个人数据     2、团队数据
                };
                _getDataCount(obj);
            }
            /**
             * 调用Service 得到个人数据/团队数据 饼图
             * @param obj
             *      dateType：统计时间维度 1、日   2、周   3、月
             *      dataType:计数据维度 1、个人数据 2、团队数据
             * @private
             */
            function _getDataCount(obj){
                workbenchSvc.dataCountService(obj).then(function (result) {
                    if($scope.ifResponseSuccess(result)){
                        var data = result.data;
                        oThis.views.pieData =$scope.responsePieData(data);
                    }
                });
            }

            /**
             * 得到top10 数据
             * 因为使用smartTable  callDataTop10的参数必须是tableState 所以callDataTop10 无法抽取为父类方法
             * @param tableState
             */
            function callDataTop10(tableState){
                var obj = {
                    positionId:$scope.POSITION_ID,
                    dataType:oThis.requestDataType //计数据维度 1、个人数据     2、团队数据
                };
                $scope._getSortedTop10(oThis,tableState);
            }

            function callDataMinxi(tableState){
                oThis.tableState = tableState;
                $scope._getMingxi(oThis,tableState);

            }


            /*************************************************************************************************************
             * *********************************************************************************************************/
            (function init($scope){
                oThis.requestRoleId = $scope.requestRoleId;//得到角色id
                oThis.requestDataType = 2;// dataType:计数据维度 1、个人数据 2、团队数据
                oThis.pieConfig ={
                    dateType:1,
                    dataType:oThis.requestDataType
                };
                oThis.lineConfig = {
                    dateType:2,
                    dataType:oThis.requestDataType,
                    zoushiFlag:1
                };

                oThis.classDataType = 'workbench-kechengMaster-team';

                oThis.callDataCount();
                $scope.callDataCountDetail(oThis);

            })($scope);
        }]);