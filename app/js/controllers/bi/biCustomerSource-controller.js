'use strict';

/**
 * The BiClassCourseController controller.
 * @version 1.0
 */
angular.module('ywsApp').controller('BiCustomerSourceController', [       
    '$scope', '$sce', '$modal', '$filter', '$rootScope', 'SweetAlert', 'BiCustomerSourceService','CommonService','BiBaseService',
    function ($scope, $sce, $modal, $filter, $rootScope, SweetAlert, BiCustomerSourceService,CommonService,
              BiBaseService) {
        $scope.isY=true;
        // 方法声明
      
        $scope.getStatistics = getStatistics;
        $scope.getDataByFilter = getDataByFilter;
        $scope.exportStatisticsToExcel = exportStatisticsToExcel;
        $scope.getStatisticsAll = getStatisticsAll;
        $scope.orderBy=orderBy;
      

        /**
         * 共同参数
         */
        BiBaseService.setTimeScope($scope.$parent, 2);
       
        /**
         * 统计参数
         */
        $scope.statisticsModels = {};
        $scope.statisticsModelsAll = {};
         
        /***                                                                                        ***/
        /**********************************************统计部分*****************************************/
        /***                                                                                       ***/
        /**
         * 根据列表状态获取统计数据
         */
        function getStatistics(tableState) { 
        	 if($scope.searchModel.schoolId!=undefined){
        		 $scope.searchModel.departmentId=$scope.searchModel.schoolId; 
        	 }
            BiCustomerSourceService.getPageList($scope.searchModel)
            .then(function (result) {
            	$scope.statisticsModels = result.data.list;
            });
        }

        $scope.position_idFun = function () {
            return sessionStorage.getItem('com.youwin.yws.position_id') == 79 ? 1 : 0;
        }
        function _getDate() {
        	
            $scope.since = getDateFormat($scope.modelStartTime)
            $scope.until = getDateFormat($scope.modelEndTime || $scope.modelStartTime)
        }
           
       
        
       
        
        /**
         * 根据筛选条件获取统计数据
         */
        function getDataByFilter() {
            $("body").click();
            $scope.searchModel.statTime = new Date($("#statTime").val());
            BiCustomerSourceService.getPageList($scope.searchModel)
            .then(function (result) {
            	$scope.statisticsModels = result.data.list;
            });
          
            BiBaseService.setTimeRange($scope.$parent);
        }

        /**
         * 查询所有统计数据
         */
        function getStatisticsAll() {
            BiCustomerSourceService.getAllList($scope.searchModel)
                .then(function (result) {
                    $scope.statisticsModelsAll = result.data.list;
                    exportStatisticsToExcel();
                });
        }

        

        /**
         * 导出excel
         */
        function exportStatisticsToExcel() {
            var statisticsExportTableStyle = {
                sheetid: '客户来源渠道统计',
                headers: true,
                caption: {
                    title: '客户来源渠道统计-统计数据',
                },
                column: {style: 'font-size:14px; text-align:left;'},
                columns: [{columnid: 'departmentName', title: '区域/校区', width: '100px'},
                    {columnid: 'schoolName', title: '校区名称'},
                    {columnid: 'schoolType', title: ' 校区类型'},
                    {columnid: 'channelName', title: '渠道'},
                    {columnid: 'customerNum', title: '客户数量'},
                    {columnid: 'customerRate', title: '比例'},
                    {columnid: 'arrivalNum', title: '到访人数'},
                    {columnid: 'arrivalRate', title: '到访率'},
                    {columnid: 'experienceNum', title: '体验人数'},
                    {columnid: 'experienceRate', title: '体验率'},
                    {columnid: 'orderNum', title: '签单人数'},
                    {columnid: 'orderRate', title: '签单率'}
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
            alasql('SELECT * INTO XLS("客户来源渠道统计-统计数据.xls", ?) FROM ?', [statisticsExportTableStyle, $scope.statisticsModelsAll]);
        }

         function orderBy (key,value){
        	 $scope.searchModel[key] = value; 
        	  $scope.searchModel.statTime = new Date($("#statTime").val());
             BiCustomerSourceService.getPageList($scope.searchModel)
                .then(function (result) {
                	$scope.statisticsModels = result.data.list;
                });
        
          BiBaseService.setTimeRange($scope.$parent);
         }
          
    }
]);