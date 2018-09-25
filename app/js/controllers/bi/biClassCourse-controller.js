'use strict';

/**
 * The BiClassCourseController controller.
 * @version 1.0
 */
angular.module('ywsApp').controller('BiClassCourseController', [       
    '$scope', '$sce', '$modal', '$filter', '$rootScope', 'SweetAlert', 'BiClassCourseService','CommonService','BiBaseService',
    function ($scope, $sce, $modal, $filter, $rootScope, SweetAlert, BiClassCourseService,CommonService,
              BiBaseService) {
        // 方法声明
      
        $scope.getStatistics = getStatistics;
        $scope.getDataByFilter = getDataByFilter;
        $scope.exportStatisticsToExcel = exportStatisticsToExcel;
        $scope.getStatisticsAll = getStatisticsAll;
        $scope.orderBy=orderBy;
       $scope.isQ=true;
        
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
        	
        	BiClassCourseService.getPageList($scope.searchModel)
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
        	BiClassCourseService.getPageList($scope.searchModel)
            .then(function (result) {
            	$scope.statisticsModels = result.data.list;
            });
          
            BiBaseService.setTimeRange($scope.$parent);
        }

        /**
         * 查询所有统计数据
         */
        function getStatisticsAll() {
        	BiClassCourseService.getAllList($scope.searchModel)
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
                sheetid: '课程类型统计',
                headers: true,
                caption: {
                    title: '课程类型统计-统计数据',
                },
                column: {style: 'font-size:14px; text-align:left;'},
                columns: [{columnid: 'className', title: '课程的名称', width: '100px'},
                    {columnid: 'courseNum', title: '课程销量'},
                    {columnid: 'realTotalAmountSum', title: ' 签单金额(元)'},
                    {columnid: 'realTotalAmountNew', title: '新签金额(元)'},
                    {columnid: 'realTotalAmountRecommend', title: '推荐金额(元)'},
                    {columnid: 'realTotalAmountRenew', title: '续费金额（元）'},
                    {columnid: 'averageAmount', title: '课程单底（元）'}
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
            alasql('SELECT * INTO XLS("课程类型统计-统计数据.xls", ?) FROM ?', [statisticsExportTableStyle, $scope.statisticsModelsAll]);
        }

         function orderBy (key,value){
        	 $scope.searchModel[key] = value; 
        	  $scope.searchModel.statTime = new Date($("#statTime").val()); 
        		BiClassCourseService.getPageList($scope.searchModel)
                .then(function (result) {
                	$scope.statisticsModels = result.data.list;
                });
        
          BiBaseService.setTimeRange($scope.$parent);
         }
          
    }
]);