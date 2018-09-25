'use strict';

/**
 * The biSchoolManagementPerformence controller.
 * @version 1.0
 */
angular.module('ywsApp').controller('BiSchoolManagementPerformenceController', [
	'$scope','$sce', '$modal', '$filter', '$rootScope', 'SweetAlert', 'BiSchoolManagementPerformenceService', 'DepartmentService',
	'AuthenticationService', 'localStorageService', 'CommonService', 'BiBaseService',
	function($scope,$sce, $modal, $filter, $rootScope, SweetAlert, BiSchoolManagementPerformenceService, DepartmentService,
			AuthenticationService, localStorageService, CommonService, BiBaseService) {
		// 方法声明
		/**
		 * 共同方法
		 */
		$scope.getTabIndex = getTabIndex;
		/*
		 * 统计方法
		 */
		$scope.getStatistics = getStatistics;
		$scope.getStatisticsAll = getStatisticsAll;
		$scope.getDataByFilter = getDataByFilter;
		$scope.exportStatisticsToExcel = exportStatisticsToExcel;
		// 参数初始化
		/**
		 * 统计参数
		 */
		$scope.statisticsModels = {};  //统计表格数据
		/**
		 * 汇总参数
		 */
		$scope.summaryChannelOrder = {};  //汇总表格数据
		$scope.exportSummaryData = [];

		//具体方法实现
		/***                                                                                        ***/
		/**********************************************公共部分*****************************************/
		/***                                                                                        ***/
		/**
		 * 获取页面当前tab页
		 */
		function getTabIndex(obj){
			if(obj.title==='续费'){
				$scope.channelTab='1';
				$scope.searchModel.statModel='1';
			}else if(obj.title==='推荐'){
				$scope.channelTab='2';
				$scope.searchModel.statModel='2';
			}else if(obj.title==='课时消耗'){
				$scope.channelTab='3';
				$scope.searchModel.statModel='3';
			}
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
            BiSchoolManagementPerformenceService.getPageList($scope.searchModel)
				.then(function (result) {
					$scope.statisticsModels = result.data.list;
					tableState.pagination.numberOfPages = result.numberOfPages;
					$scope.isLoading = false;
				});
		}
        $scope.position_idFun = function () {
            return sessionStorage.getItem('com.youwin.yws.position_id')==79?1:0;
        }
        function _getDate() {
            $scope.since = getDateFormat($scope.modelStartTime)
            $scope.until = getDateFormat($scope.modelEndTime||$scope.modelStartTime)
        }
		/**
		 * 根据列表状态获取统计数据
		 */
		function getDataByFilter() {
			$("body").click();
			$scope.searchModel.statTime = new Date($("#statTime").val());
			//设置表格状态和分页信息
			$scope.isLoading = true;
			$scope.statisticsTableState.pagination.start = 0;
			$scope.searchModel.start = $scope.statisticsTableState.pagination.start || 0;
			$scope.searchModel.size = $scope.statisticsTableState.pagination.number || 10;
			BiSchoolManagementPerformenceService.getPageList($scope.searchModel)
				.then(function (result) {
					$scope.statisticsModels = result.data.list;
					$scope.statisticsTableState.pagination.numberOfPages = result.numberOfPages;
					$scope.isLoading = false;
				});
			BiBaseService.setTimeRange($scope.$parent);
		}
		/**
		 * 查询所有统计数据
		 */
		function getStatisticsAll() {
			$scope.canExportDatas = false;
			//设置表格状态和分页信息
			$scope.isLoading = true;
			BiSchoolManagementPerformenceService.getAllList($scope.searchModel)
				.then(function (result) {
					$scope.statisticsModelsAll = result.data;
					$scope.isLoading = false;
					$scope.canExportDatas = true;
					exportStatisticsToExcel();
				});
		}
		/**
		 * 导出统计数据到excel
		 */
		function exportStatisticsToExcel() {
			var titleName = '学管业绩';
			var statisticsExportTableStyle = {
		        sheetid: titleName,
		        headers: true,
		        caption: {
		        	title:titleName + '-统计数据',
		        },
		        column: {style:'font-size:16px; text-align:left;'},
		        columns: [{columnid:'schoolName',title: '校区',width: '100px'},
				          {columnid:'userName',title: '姓名'},
				          {columnid:'positionName',title: '岗位名称'},
				          {columnid:'orderCount',title: '签单数'},
				          {columnid:'orderAmount',title: '签单金额'},
				          {columnid:'orderRealAmount',title: '实收金额'}
				         ],
		        row: {
		        	style: function(sheet, row, rowidx){
		        		return 'background:'+(rowidx%2?'#E1FFFF':'#F0E68C');
		        	}
		        },
		        cells: {
	                style: 'font-size:13px; text-align:left;'
		       }
		    };
		    alasql('SELECT * INTO XLS("学管业绩-统计数据.xls", ?) FROM ?', [statisticsExportTableStyle, $scope.statisticsModelsAll]);
		}
	}
]);
