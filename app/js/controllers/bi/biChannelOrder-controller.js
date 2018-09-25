'use strict';

/**
 * The biChannelOrder controller.
 * @version 1.0
 */
angular.module('ywsApp').controller('BiChannelOrderController', [
    '$scope', '$sce', '$modal', '$filter', '$rootScope', 'SweetAlert', 'BiChannelOrderService', 'DepartmentService',
    'AuthenticationService', 'localStorageService', 'CommonService', 'BiBaseService',
    function ($scope, $sce, $modal, $filter, $rootScope, SweetAlert, BiChannelOrderService, DepartmentService,
              AuthenticationService, localStorageService, CommonService, BiBaseService) {

        //$scope.isY=true;
        $scope.position_idFun = function () {
            return sessionStorage.getItem('com.youwin.yws.position_id') == 79 ? 1 : 0;
        }
        // 方法声明
        /**
         * 共同方法
         */
        $scope.exchangeTable = exchangeTable;
        $scope.getTabIndex = getTabIndex;
        /*
         * 统计方法
         */
        $scope.getStatistics = getStatistics;
        $scope.getStatisticsAll = getStatisticsAll;
        $scope.getDataByFilter = getDataByFilter;
        $scope.getStatisticsByFilter = getStatisticsByFilter;
        $scope.exportStatisticsToExcel = exportStatisticsToExcel;
        $scope.exportToExcel = exportToExcel;
        /*
         * 汇总方法
         */
        $scope.getSummary = getSummary;
        $scope.getChannelSummary = getChannelSummary;
        $scope.getMarketSummary = getMarketSummary;
        $scope.exportSummaryToExcel = exportSummaryToExcel;

        // 参数初始化
        /**
         * 公共参数
         */
        $scope.currentTable = '1';
        /**
         * 统计参数
         */
        $scope.channelOrders = {};  //统计表格数据
        // $scope.searchModel.viewType = '1';
        /**
         * 汇总参数
         */
        $scope.summaryChannelOrder = {};  //汇总表格数据
        $scope.exportSummaryData = [];

        $scope.tabsName = {}
        getTabs();

        function getTabs() {
            console.log($scope.searchModel)
            BiChannelOrderService.getTabs($scope.searchModel)
                .then(function (result) {
                    $scope.tabs = result.data;
                    return result.data || []
                })
                .then(function (data) {
                    data.map(function (item, index) {
                        $scope.tabsName[item.id] = item.name
                    })
                    console.log($scope.tabsName)
                });
        }

        //具体方法实现
        /***                                                                                        ***/
        /**********************************************公共部分*****************************************/

        /***                                                                                        ***/
        /**
         * 切换汇总和明细
         */
        function exchangeTable(obj) {
            if ($scope.currentTable === '1') {
                $scope.currentTable = '2';
                $scope.searchModel.viewType = '2';
            } else {
                $scope.currentTable = '1';
                $scope.searchModel.viewType = '1';
            }
        }

        /**
         * 获取页面当前tab页
         */
        function getTabIndex(obj) {
            var title = obj.title.replace('统计', '');
//			if(obj.title==='渠道统计'){
//				$scope.channelTab='0';
//			}else if(obj.title==='市场统计'){
//				$scope.channelTab='1';
//			}else if(obj.title==='媒体统计'){
//				$scope.channelTab='2';
//			}
            for (var i = 0; i < $scope.tabs.length; i++) {
                if (title == $scope.tabs[i].name) {
                    $scope.searchModel.channelParentId = $scope.tabs[i].id;
                    break;
                }
            }
            // console.log($scope.searchModel.channelParentId)
            getMarketSummary();
//			$scope.searchModel.channelType = $scope.channelTab;
        }

        /**
         * 变换日期格式为字符串
         */
        function formatDate(date) {
            var myyear = date.getFullYear();
            var mymonth = date.getMonth() + 1;
            var myweekday = date.getDate();

            if (mymonth < 10) {
                mymonth = "0" + mymonth;
            }
            if (myweekday < 10) {
                myweekday = "0" + myweekday;
            }
            return (myyear + "-" + mymonth + "-" + myweekday + " 00:00:00");
        }

        /**
         * 导出
         */
        function exportToExcel() {
            if ($scope.currentTable === '1') {
                exportSummaryToExcel();
            } else {
                getStatisticsAll();
            }
        }

        /**
         * 根据筛选条件获取数据
         */
        function getDataByFilter() {
            $("body").click();
            console.log($scope.searchModel)
            // $scope.searchModel.statTime = new Date($("#statTime").val());
//			//如果是查询汇总数据
//			if($scope.searchModel.channelType==='0'){
//				getChannelSummary();
//			}
//			else if($scope.searchModel.channelType==='1'){
            getMarketSummary();
//			}
//			//如果是查询明细数据
//			else if($scope.searchModel.viewType==='2'){
//				getStatisticsByFilter();
//			}
//             BiBaseService.setTimeRange($scope.$parent);
        }

        /***                                                                                        ***/
        /**********************************************统计部分*****************************************/

        /***                                                                                       ***/
        /**
         * 根据列表状态获取统计数据
         */
        function getStatistics(tableState) {
            //设置表格状态和分页信息
            $scope.statisticsTableState = tableState;
            $scope.isLoading = true;
            $scope.pagination = tableState.pagination;
            $scope.start = $scope.pagination.start || 0;
            $scope.number = $scope.pagination.number || 10;
            $scope.searchModel.start = $scope.start;
            $scope.searchModel.size = $scope.number;
            BiChannelOrderService.getPageList($scope.searchModel)
                .then(function (result) {
                    debugger
                    $scope.channelOrders = result.data.list;
                    tableState.pagination.numberOfPages = result.numberOfPages;
                    $scope.isLoading = false;
                });
        }

        /**
         * 根据列表状态获取统计数据
         */
        function getStatisticsByFilter() {
            //设置表格状态和分页信息
            $scope.isLoading = true;
            $scope.statisticsTableState.pagination.start = 0;
            $scope.searchModel.start = $scope.statisticsTableState.pagination.start || 0;
            $scope.searchModel.size = $scope.statisticsTableState.pagination.number || 10;
            BiChannelOrderService.getPageList($scope.searchModel)
                .then(function (result) {
                    debugger
                    $scope.channelOrders = result.data.list;
                    $scope.statisticsTableState.pagination.numberOfPages = result.numberOfPages;
                    $scope.isLoading = false;
                });
        }

        /**
         * 查询所有统计数据
         */
        function getStatisticsAll() {
            $scope.canExportDatas = false;
            //设置表格状态和分页信息
            $scope.isLoading = true;
            BiChannelOrderService.getAllList($scope.searchModel)
                .then(function (result) {
                    $scope.channelOrdersAll = result.data;
                    $scope.isLoading = false;
                    $scope.canExportDatas = true;
                    exportStatisticsToExcel();
                });
        }

        /**
         * 导出统计数据到excel
         */
        function exportStatisticsToExcel() {
            var titleName, statisticsExportTableStyle;
            if ($scope.channelTab === '0') {
                titleName = '渠道统计';
                statisticsExportTableStyle = {
                    sheetid: titleName,
                    headers: true,
                    caption: {
                        title: '渠道签约-' + titleName + '-明细数据',
                    },
                    column: {style: 'font-size:16px; text-align:left;'},
                    columns: [{columnid: 'schoolName', title: '校区', width: '100px'},
                        /*总计*/
                        {columnid: 'totalVisitCount', title: '总计到访数'},
                        {columnid: 'totalExperienceCount', title: '总计体验数'},
                        {columnid: 'totalOrderCount', title: '总计签单数'},
                        {columnid: 'totalOrderAmount', title: '总计签单金额'},
                        {columnid: 'totalRealPaymentAmount', title: '总计实收金额'},
                        /*市场*/
                        {columnid: 'marketVisitCount', title: '市场到访数'},
                        {columnid: 'marketExperienceCount', title: '市场体验数'},
                        {columnid: 'marketOrderCount', title: '市场签单数'},
                        {columnid: 'marketOrderAmount', title: '市场签单金额'},
                        {columnid: 'marketRealPaymentAmount', title: '市场实收金额'},
                        /*媒体*/
                        {columnid: 'mediaVisitCount', title: '媒体到访数'},
                        {columnid: 'mediaExperienceCount', title: '媒体体验数'},
                        {columnid: 'mediaOrderCount', title: '媒体签单数'},
                        {columnid: 'mediaOrderAmount', title: '媒体签单金额'},
                        {columnid: 'mediaRealPaymentAmount', title: '媒体实收金额'},
                        /*课程顾问介绍*/
                        {columnid: 'introduceVisitCount', title: '课程顾问介绍到访数'},
                        {columnid: 'introduceExperienceCount', title: '课程顾问介绍体验数'},
                        {columnid: 'introduceOrderCount', title: '课程顾问介绍签单数'},
                        {columnid: 'introduceOrderAmount', title: '课程顾问介绍签单金额'},
                        {columnid: 'introduceRealPaymentAmount', title: '课程顾问介绍实收金额'},
                        /*学习顾问推荐*/
                        {columnid: 'recommendVisitCount', title: '学习顾问推荐到访数'},
                        {columnid: 'recommendExperienceCount', title: '学习顾问推荐体验数'},
                        {columnid: 'recommendOrderCount', title: '学习顾问推荐签单数'},
                        {columnid: 'recommendOrderAmount', title: '学习顾问推荐签单金额'},
                        {columnid: 'recommendRealPaymentAmount', title: '学习顾问推荐实收金额'},
                        /*原始数据*/
                        {columnid: 'originalVisitCount', title: '原始数据到访数'},
                        {columnid: 'originalExperienceCount', title: '原始数据体验数'},
                        {columnid: 'originalOrderCount', title: '原始数据签单数'},
                        {columnid: 'originalOrderAmount', title: '原始数据签单金额'},
                        {columnid: 'originalRealPaymentAmount', title: '原始数据实收金额'},
                        /*线上O2O*/
                        {columnid: 'onlineVisitCount', title: '线上O2O到访数'},
                        {columnid: 'onlineExperienceCount', title: '线上O2O体验数'},
                        {columnid: 'onlineOrderCount', title: '线上O2O签单数'},
                        {columnid: 'onlineOrderAmount', title: '线上O2O签单金额'},
                        {columnid: 'onlineRealPaymentAmount', title: '线上O2O实收金额'}
                    ],
                    row: {
                        style: function (sheet, row, rowidx) {
                            return 'background:' + (rowidx % 2 ? '#E1FFFF' : '#F0E68C');
                        }
                    },
                    cells: {
                        style: 'font-size:13px; text-align:left;'
                    }
                };
            } else if ($scope.channelTab === '1') {
                titleName = '市场统计';
                statisticsExportTableStyle = {
                    sheetid: titleName,
                    headers: true,
                    caption: {
                        title: '渠道签约-' + titleName + '-明细数据',
                    },
                    column: {style: 'font-size:16px; text-align:left;'},
                    columns: [{columnid: 'schoolName', title: '校区', width: '100px'},
                        /*总计*/
                        {columnid: 'totalVisitCount', title: '总计到访数'},
                        {columnid: 'totalExperienceCount', title: '总计体验数'},
                        {columnid: 'totalOrderCount', title: '总计签单数'},
                        {columnid: 'totalOrderAmount', title: '总计签单金额'},
                        {columnid: 'totalRealPaymentAmount', title: '总计实收金额'},
                        /*直访*/
                        {columnid: 'zfVisitCount', title: '直访到访数'},
                        {columnid: 'zfExperienceCount', title: '直访体验数'},
                        {columnid: 'zfOrderCount', title: '直访签单数'},
                        {columnid: 'zfOrderAmount', title: '直访签单金额'},
                        {columnid: 'zfRealPaymentAmount', title: '直访实收金额'},
                        /*拉上*/
                        {columnid: 'lsVisitCount', title: '拉上到访数'},
                        {columnid: 'lsExperienceCount', title: '拉上体验数'},
                        {columnid: 'lsOrderCount', title: '拉上签单数'},
                        {columnid: 'lsOrderAmount', title: '拉上签单金额'},
                        {columnid: 'lsRealPaymentAmount', title: '拉上实收金额'},
                        /*渠道*/
                        {columnid: 'qdVisitCount', title: '渠道介绍到访数'},
                        {columnid: 'qdExperienceCount', title: '渠道介绍体验数'},
                        {columnid: 'qdOrderCount', title: '渠道介绍签单数'},
                        {columnid: 'qdOrderAmount', title: '渠道介绍签单金额'},
                        {columnid: 'qdRealPaymentAmount', title: '渠道介绍实收金额'},
                        /*活动*/
                        {columnid: 'hdVisitCount', title: '活动到访数'},
                        {columnid: 'hdExperienceCount', title: '活动体验数'},
                        {columnid: 'hdOrderCount', title: '活动签单数'},
                        {columnid: 'hdOrderAmount', title: '活动签单金额'},
                        {columnid: 'hdRealPaymentAmount', title: '活动实收金额'},
                        /*渠道活动*/
                        {columnid: 'qdhdVisitCount', title: '渠道活动到访数'},
                        {columnid: 'qdhdExperienceCount', title: '渠道活动体验数'},
                        {columnid: 'qdhdOrderCount', title: '渠道活动签单数'},
                        {columnid: 'qdhdOrderAmount', title: '渠道活动签单金额'},
                        {columnid: 'qdhdRealPaymentAmount', title: '渠道活动实收金额'},
                        /*收集leads*/
                        {columnid: 'leadsVisitCount', title: '收集leads到访数'},
                        {columnid: 'leadsExperienceCount', title: '收集leads体验数'},
                        {columnid: 'leadsOrderCount', title: '收集leads签单数'},
                        {columnid: 'leadsOrderAmount', title: '收集leads签单金额'},
                        {columnid: 'leadsRealPaymentAmount', title: '收集leads实收金额'},
                        /*微信社群*/
                        {columnid: 'wxsqVisitCount', title: '微信社群到访数'},
                        {columnid: 'wxsqExperienceCount', title: '微信社群体验数'},
                        {columnid: 'wxsqOrderCount', title: '微信社群签单数'},
                        {columnid: 'wxsqOrderAmount', title: '微信社群签单金额'},
                        {columnid: 'wxsqRealPaymentAmount', title: '微信社群实收金额'},
                        /*数据采购*/
                        {columnid: 'sjcgVisitCount', title: '数据采购到访数'},
                        {columnid: 'sjcgExperienceCount', title: '数据采购体验数'},
                        {columnid: 'sjcgOrderCount', title: '数据采购签单数'},
                        {columnid: 'sjcgOrderAmount', title: '数据采购签单金额'},
                        {columnid: 'sjcgRealPaymentAmount', title: '数据采购实收金额'},
                        /*会销*/
                        {columnid: 'hxVisitCount', title: '会销到访数'},
                        {columnid: 'hxExperienceCount', title: '会销体验数'},
                        {columnid: 'hxOrderCount', title: '会销签单数'},
                        {columnid: 'hxOrderAmount', title: '会销签单金额'},
                        {columnid: 'hxRealPaymentAmount', title: '会销实收金额'}
                    ],
                    row: {
                        style: function (sheet, row, rowidx) {
                            return 'background:' + (rowidx % 2 ? '#E1FFFF' : '#F0E68C');
                        }
                    },
                    cells: {
                        style: 'font-size:13px; text-align:left;'
                    }
                };
            } else if ($scope.channelTab === '2') {
                titleName = '媒体统计';
                statisticsExportTableStyle = {
                    sheetid: titleName,
                    headers: true,
                    caption: {
                        title: '渠道签约-' + titleName + '-明细数据',
                    },
                    column: {style: 'font-size:16px; text-align:left;'},
                    columns: [{columnid: 'schoolName', title: '校区', width: '100px'},
                        /*总计*/
                        {columnid: 'totalVisitCount', title: '总计到访数'},
                        {columnid: 'totalExperienceCount', title: '总计体验数'},
                        {columnid: 'totalOrderCount', title: '总计签单数'},
                        {columnid: 'totalOrderAmount', title: '总计签单金额'},
                        /*400电话*/
                        {columnid: 'p400VisitCount', title: '400电话到访数'},
                        {columnid: 'p400ExperienceCount', title: '400电话体验数'},
                        {columnid: 'p400OrderCount', title: '400电话签单数'},
                        {columnid: 'p400OrderAmount', title: '400电话签单金额'},
                        {columnid: 'p400RealPaymentAmount', title: '400电话实收金额'},
                        /*自动语音*/
                        {columnid: 'zdyyVisitCount', title: '自动语音到访数'},
                        {columnid: 'zdyyExperienceCount', title: '自动语音体验数'},
                        {columnid: 'zdyyOrderCount', title: '自动语音签单数'},
                        {columnid: 'zdyyOrderAmount', title: '自动语音签单金额'},
                        {columnid: 'zdyyRealPaymentAmount', title: '自动语音实收金额'},
                        /*短信*/
                        {columnid: 'dxVisitCount', title: '短信到访数'},
                        {columnid: 'dxExperienceCount', title: '短信体验数'},
                        {columnid: 'dxOrderCount', title: '短信签单数'},
                        {columnid: 'dxOrderAmount', title: '短信签单金额'},
                        {columnid: 'dxRealPaymentAmount', title: '短信实收金额'},
                        /*BD*/
                        {columnid: 'bdVisitCount', title: 'BD到访数'},
                        {columnid: 'bdExperienceCount', title: 'BD体验数'},
                        {columnid: 'bdOrderCount', title: 'BD签单数'},
                        {columnid: 'bdOrderAmount', title: 'BD签单金额'},
                        {columnid: 'bdRealPaymentAmount', title: 'BD实收金额'},
                        /*网络推广*/
                        {columnid: 'wltgVisitCount', title: '网络推广到访数'},
                        {columnid: 'wltgExperienceCount', title: '网络推广体验数'},
                        {columnid: 'wltgOrderCount', title: '网络推广签单数'},
                        {columnid: 'wltgOrderAmount', title: '网络推广签单金额'},
                        {columnid: 'wltgRealPaymentAmount', title: '网络推广实收金额'},
                        /*广告*/
                        {columnid: 'ggVisitCount', title: '广告到访数'},
                        {columnid: 'ggExperienceCount', title: '广告体验数'},
                        {columnid: 'ggOrderCount', title: '广告签单数'},
                        {columnid: 'ggOrderAmount', title: '广告签单金额'},
                        {columnid: 'ggRealPaymentAmount', title: '广告实收金额'},
                        /*TMK*/
                        {columnid: 'tmkVisitCount', title: 'TMK到访数'},
                        {columnid: 'tmkExperienceCount', title: 'TMK体验数'},
                        {columnid: 'tmkOrderCount', title: 'TMK签单数'},
                        {columnid: 'tmkOrderAmount', title: 'TMK签单金额'},
                        {columnid: 'tmkRealPaymentAmount', title: 'TMK实收金额'},
                        /*数据采购*/
                        {columnid: 'sjcgVisitCount', title: '数据采购到访数'},
                        {columnid: 'sjcgExperienceCount', title: '数据采购体验数'},
                        {columnid: 'sjcgOrderCount', title: '数据采购签单数'},
                        {columnid: 'sjcgOrderAmount', title: '数据采购签单金额'},
                        {columnid: 'sjcgRealPaymentAmount', title: '数据采购实收金额'}
                    ],
                    row: {
                        style: function (sheet, row, rowidx) {
                            return 'background:' + (rowidx % 2 ? '#E1FFFF' : '#F0E68C');
                        }
                    },
                    cells: {
                        style: 'font-size:13px; text-align:left;'
                    }
                };
            }
            alasql('SELECT * INTO XLS("渠道签约-' + titleName + '-明细.xls", ?) FROM ?', [statisticsExportTableStyle, $scope.channelOrdersAll]);
        }

        /***                                                                                        ***/

        /**********************************************汇总部分*****************************************/
        /***
         * 获取汇总数据
         */
        function getSummary() {
            $scope.canExportDatas = false;
            BiChannelOrderService.queryBySummary($scope.searchModel)
                .then(function (result) {
                    $scope.summaryModels = result.data;

                    var dataIndex = 0;
                    $scope.summaryModelForTotal = {};
                    $scope.summaryModelForTotal.visitCount = 0;
                    $scope.summaryModelForTotal.visitOrderCount = 0;
                    $scope.summaryModelForTotal.experienceCount = 0;
                    $scope.summaryModelForTotal.experienceOrderCount = 0;
                    $scope.summaryModelForTotal.visitExperienceCount = 0;
                    $scope.summaryModelForTotal.orderCount = 0;
                    $scope.summaryModelForTotal.orderAmount = 0.00;
                    $scope.summaryModelForTotal.realPaymentAmount = 0.00;
                    $scope.summaryModelForTotal.finalPaymentAmount = 0.00;
                    $scope.summaryModelForTotal.averageAmount = 0.00;
                    $scope.summaryModelForTotal.visitOrderRatio = '0.00%';
                    $scope.summaryModelForTotal.experienceOrderRatio = '0.00%';
                    $scope.summaryModelForTotal.visitExperienceRatio = '0.00%';
                    //求和
                    angular.forEach($scope.summaryModels, function (data, index, array) {
                        $scope.summaryModelForTotal.visitCount = $scope.summaryModelForTotal.visitCount + data.visitCount;
                        $scope.summaryModelForTotal.visitOrderCount = $scope.summaryModelForTotal.visitOrderCount + data.visitOrderCount;
                        $scope.summaryModelForTotal.experienceCount = $scope.summaryModelForTotal.experienceCount + data.experienceCount;
                        $scope.summaryModelForTotal.experienceOrderCount = $scope.summaryModelForTotal.experienceOrderCount + data.experienceOrderCount;
                        $scope.summaryModelForTotal.visitExperienceCount = $scope.summaryModelForTotal.visitExperienceCount + data.visitExperienceCount;
                        $scope.summaryModelForTotal.orderCount = $scope.summaryModelForTotal.orderCount + data.orderCount;
                        $scope.summaryModelForTotal.orderAmount = $scope.summaryModelForTotal.orderAmount + data.orderAmount;
                        $scope.summaryModelForTotal.realPaymentAmount = $scope.summaryModelForTotal.realPaymentAmount + data.realPaymentAmount;
                        $scope.summaryModelForTotal.finalPaymentAmount = $scope.summaryModelForTotal.finalPaymentAmount + data.finalPaymentAmount;
                        dataIndex = dataIndex + 1;
                    });
                    $scope.summaryModelForTotal.orderAmount = $scope.summaryModelForTotal.orderAmount.toFixed(2);
                    $scope.summaryModelForTotal.realPaymentAmount = $scope.summaryModelForTotal.realPaymentAmount.toFixed(2);
                    $scope.summaryModelForTotal.finalPaymentAmount = $scope.summaryModelForTotal.finalPaymentAmount.toFixed(2);
                    //计算到访签单率
                    if ($scope.summaryModelForTotal.visitCount > 0) {
                        $scope.summaryModelForTotal.visitOrderRatio = $scope.summaryModelForTotal.visitOrderCount / $scope.summaryModelForTotal.visitCount;
                        $scope.summaryModelForTotal.visitOrderRatio = '' + ($scope.summaryModelForTotal.visitOrderRatio * 100).toFixed(2) + '%';
                    }
                    //计算体验签单率
                    if ($scope.summaryModelForTotal.experienceCount > 0) {
                        $scope.summaryModelForTotal.experienceOrderRatio = $scope.summaryModelForTotal.experienceOrderCount / $scope.summaryModelForTotal.experienceCount;
                        $scope.summaryModelForTotal.experienceOrderRatio = '' + ($scope.summaryModelForTotal.experienceOrderRatio * 100).toFixed(2) + '%';
                    }
                    //计算到访体验率
                    if ($scope.summaryModelForTotal.visitCount > 0) {
                        $scope.summaryModelForTotal.visitExperienceRatio = $scope.summaryModelForTotal.visitExperienceCount / $scope.summaryModelForTotal.visitCount;
                        $scope.summaryModelForTotal.visitExperienceRatio = '' + ($scope.summaryModelForTotal.visitExperienceRatio * 100).toFixed(2) + '%';
                    }
                    //计算平均单底
                    if ($scope.summaryModelForTotal.orderCount > 0) {
                        $scope.summaryModelForTotal.averageAmount = $scope.summaryModelForTotal.orderAmount / $scope.summaryModelForTotal.orderCount;
                        $scope.summaryModelForTotal.averageAmount = $scope.summaryModelForTotal.averageAmount.toFixed(2);
                    } else {
                        $scope.summaryModelForTotal.averageAmount = 0.00;
                    }
                    $scope.canExportDatas = true;
                    if ($scope.position_idFun()) {
                        _getDate()
                        // iframeLoading()
                        loadingPre()
                    }
                });
        }


        /**
         * 拿到渠道统计
         */
        function getChannelSummary() {
            $scope.canExportDatas = false;
            BiChannelOrderService.queryByChannelSummary($scope.searchModel)
                .then(function (result) {
                    $scope.summaryModels = result.data.list;

                    $scope.canExportDatas = true;
                    if ($scope.position_idFun()) {
                        _getDate()
                        // iframeLoading()
                        loadingPre()
                    }
                });
        }

        $scope.pageParamsInit = function () {
            $scope.pageParams = {}
        }
        $scope.channelOrdersDetail = []

        /**
         * 拿到市场转化统计
         */
        function getMarketSummary(name, id) {
            var params = {}
            // if ($scope.searchModel.channelParentId == -1 || $scope.searchModel.channelParentId == 5) {
            //     tableState = tableState || {}
            //     if (!tableState.pagination) {
            //         tableState.pagination = {}
            //     }
            //     var pagination = tableState.pagination
            //     pagination.start = pagination.start || 0
            //     pagination.number = pagination.number || 10
            //     params = {
            //         start: pagination.start,
            //         number: pagination.number
            //     }
            // }
            if (!$scope.searchModel.departmentId) {
                $scope.searchModel.departmentId = localStorageService
                    .get('department_id')
            }
            params = Object.assign(params, $scope.searchModel)
            $scope.canExportDatas = false;
            if (name) {
                params.isExport = 1
            } else {
                $scope.summaryModels = [];
                $scope.channelOrders = [];
            }
            BiChannelOrderService.queryByMarketSummary(params)
                .then(function (result) {
                    var data = result.data || {}
                    if (name) {
                        // $scope.channelOrdersDetail = data.list || []
                        setTimeout(function () {
                            $scope.$parent.exportableV1(name, id,data.list || [])
                        }, 1000)
                    } else {
                        // $scope.channelOrders = data.list || [];
                        data.list = data.list || [];
                        for (var i = 0, len = data.list.length; i < len && i < 10; i++) {
                            $scope.channelOrders.push(data.list[i])
                        }
                        // 导出模板用
                        window.sessionStorage.setItem('__exp__', JSON.stringify(data.list || []))
                        /*if ($scope.searchModel.channelParentId == 4 || $scope.searchModel.channelParentId == 49) {
                            $scope.summaryModels = data.list || [];
                        } else {
                            // $scope.channelOrders = data.list || [];
                            for (var i = 0, len = data.list.length; i < len && i < 10; i++) {
                                $scope.channelOrders.push(data.list[i])
                            }
                            // 导出模板用
                            window.sessionStorage.setItem('__exp__', JSON.stringify(data.list || []))
                        }*/
                        // tableState.pagination.numberOfPages = result.numberOfPages;
                        $scope.canExportDatas = true;
                        if ($scope.position_idFun()) {
                            _getDate()
                            // iframeLoading()
                            loadingPre()
                        }
                    }
                });
        }

        /**
         * 导出汇总数据到excel
         */
        function exportSummaryToExcel() {
            var titleName;
            if ($scope.channelTab === '0') {
                titleName = '渠道统计';
            } else if ($scope.channelTab === '1') {
                titleName = '市场统计';
            } else if ($scope.channelTab === '2') {
                titleName = '媒体统计';
            }
            var summaryExportTableStyle = {
                sheetid: titleName,
                headers: true,
                caption: {title: '渠道签约-' + titleName + '汇总数据',},
                column: {style: 'font-size:16px; text-align:left;'},
                columns: [
                    {columnid: 'channelType', title: '区域/校区'},
                    {columnid: 'channelType', title: '校区名称'},
                    {columnid: 'channelType', title: '校区类型'},
                    {columnid: 'channelName', title: '渠道'},
                    {columnid: 'arrivalNum', title: '到访量'},
                    {columnid: 'experienceNum', title: '体验量'},
                    {columnid: 'orderNum', title: '签单量'},
                    {columnid: 'orderAmount', title: '签单金额'},
                    {columnid: 'payAmount', title: '实收金额'},
                    {columnid: 'averageAmount', title: '平均单底'},
                    {columnid: 'visitExperienceRatio', title: '到访体验率'},
                    {columnid: 'experienceOrderRatio', title: '体验签单率'},
                    {columnid: 'visitOrderRatio', title: '到访签单率'}
                ],
                row: {
                    style: function (sheet, row, rowidx) {
                        return 'background:' + (rowidx % 2 ? '#E1FFFF' : '#F0E68C');
                    }
                },
                cells: {
                    style: 'font-size:13px; text-align:left;'
                }
            };
            alasql('SELECT * INTO XLS("渠道签约-' + titleName + '-汇总.xls", ?) FROM ?', [summaryExportTableStyle, $scope.summaryModels]);
        }

        //统计图形
        // $sce.trustAsResourceUrl(pdfUrl)
        // $scope.
        //一级渠道平均单底
        //$scope.searchModel.statTime
        function _getDate() {
            $scope.modelStartTime = $scope.searchModel.startTime || new Date()
            $scope.modelEndTime = $scope.searchModel.endTime || new Date()
            $scope.since = getDateFormat($scope.modelStartTime)
            $scope.until = getDateFormat($scope.modelEndTime || $scope.modelStartTime)
        }

        function loadingPre() {
            $scope.iframeList = [{
                title: '一级渠道平均单底排名',
                url: $sce.trustAsResourceUrl(STATISTICS_1 + '/superset/explore/table/' + STATISTICS_1_PARAM + '/?viz_type=dist_bar&granularity_sqla=contract_start_date&time_grain_sqla=Time+Column&since=' + $scope.since + '&until=' + $scope.until + '&groupby=mc1&metrics=avg__real_total_amount&row_limit=50000&show_legend=y&show_legend=false&show_bar_value=false&bar_stacked=false&y_axis_format=.4r&bottom_margin=auto&x_axis_label=&y_axis_label=&reduce_x_ticks=false&contribution=false&show_controls=false&order_bars=false&having=&flt_col_0=&flt_op_0=in&flt_eq_0=&slice_id=&slice_name=&collapsed_fieldsets=&action=&userid=1&goto_dash=false&datasource_name=view_students&datasource_id=13&datasource_type=table&previous_viz_type=dist_bar&rdo_save=saveas&new_slice_name=&add_to_dash=false&save_to_dashboard_id=&new_dashboard_name=&where=is_deleted%3D0++and+order_status+!%3D5+and+order_category+in+(1%2C3)++and+order_type+%3D1+and+media_channel_id_1+is+not+null+and+belong_school_id+%3D' + sessionStorage.getItem('com.youwin.yws.school_id')),
                top: '-1531px',
                height: '700px'
            },
                {
                    title: '二级渠道平均单底排名',
                    url: $sce.trustAsResourceUrl(STATISTICS_1 + '/superset/explore/table/' + STATISTICS_1_PARAM + '/?viz_type=dist_bar&granularity_sqla=contract_start_date&time_grain_sqla=Time+Column&since=' + $scope.since + '&until=' + $scope.until + '&groupby=mc2&metrics=avg__real_total_amount&row_limit=50000&show_legend=y&show_legend=false&show_bar_value=false&bar_stacked=false&y_axis_format=.4r&bottom_margin=auto&x_axis_label=&y_axis_label=&reduce_x_ticks=false&contribution=false&show_controls=false&order_bars=false&having=&flt_col_0=&flt_op_0=in&flt_eq_0=&slice_id=&slice_name=&collapsed_fieldsets=&action=&userid=1&goto_dash=false&datasource_name=view_students&datasource_id=13&datasource_type=table&previous_viz_type=dist_bar&rdo_save=saveas&new_slice_name=&add_to_dash=false&save_to_dashboard_id=&new_dashboard_name=&where=is_deleted%3D0++and+order_status+!%3D5+and+order_category+in+(1%2C3)++and+order_type+%3D1+and+media_channel_id_2+is+not+null+and+belong_school_id+%3D' + sessionStorage.getItem('com.youwin.yws.school_id')),
                    top: '-1531px',
                    height: '700px'
                },
                {
                    title: '客户渠道分布',
                    url: $sce.trustAsResourceUrl(STATISTICS_1 + '/superset/explore/table/' + STATISTICS_1_PARAM + '/?viz_type=sunburst&granularity_sqla=contract_start_date&time_grain_sqla=Time+Column&since=' + $scope.since + '&until=' + $scope.until + '&groupby=mc1&groupby=mc2&metric=count&secondary_metric=count&row_limit=50000&having=&flt_col_0=&flt_op_0=in&flt_eq_0=&slice_id=&slice_name=&collapsed_fieldsets=&action=&userid=1&goto_dash=false&datasource_name=view_students&datasource_id=13&datasource_type=table&previous_viz_type=sunburst&rdo_save=saveas&new_slice_name=&add_to_dash=false&save_to_dashboard_id=&new_dashboard_name=&where=is_deleted%3D0++and+order_status+!%3D5+and+order_category+in+(1%2C3)++and+order_type+%3D1+and+belong_school_id+%3D' + sessionStorage.getItem('com.youwin.yws.school_id')),
                    top: '-1262px',
                    bgpy: '1262px !important',
                    height: '700px'
                }
            ]
        }
    }
]);