'use strict';

/**
 * The biO2oOrder controller.
 * @version 1.0
 */
angular.module('ywsApp').controller('BiO2oOrderController', [
	'$scope', '$modal', '$filter', '$rootScope', 'SweetAlert', 'BiO2oOrderService', 'DepartmentService',
	'AuthenticationService', 'localStorageService', 'CommonService', 'BiBaseService',
	function($scope, $modal, $filter, $rootScope, SweetAlert, BiO2oOrderService, DepartmentService, 
			AuthenticationService, localStorageService, CommonService, BiBaseService) {
		// 方法声明
		/*
		 * 统计方法
		 */
		$scope.getStatistics = getStatistics;
		$scope.getStatisticsAll = getStatisticsAll;
		$scope.getDataByFilter = getDataByFilter;
		$scope.exportToExcel = exportToExcel;
		// 参数初始化
		
		 /**
         * 共同参数
         */
        BiBaseService.setTimeScope($scope.$parent, 2);
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
            BiO2oOrderService.getPageList($scope.searchModel)
				.then(function (result) {
					$scope.statisticsModels = result.data.list;
					angular.forEach($scope.statisticsModels, function(data, index, array){
						data.successOrderRatio = '0.00%';
						if(data.orderCount>0){
							data.successOrderRatio = data.successOrderCount/data.orderCount;
							data.successOrderRatio = '' + (data.successOrderRatio*100).toFixed(2) + '%';
						}
					});
					tableState.pagination.numberOfPages = result.numberOfPages;
					$scope.isLoading = false;
					getStatisticsAll(); //总计
				});
		}
		/**
		 * 根据列表状态获取统计数据
		 */
		function getDataByFilter() {
			//设置表格状态和分页信息
			 $("body").click();
	            $scope.searchModel.statTime = new Date($("#statTime").val()); 
			$scope.isLoading = true;
			$scope.statisticsTableState.pagination.start = 0;
			$scope.searchModel.start = $scope.statisticsTableState.pagination.start || 0;
			$scope.searchModel.size = $scope.statisticsTableState.pagination.number || 10;
			 //$scope.searchModel.statTime='2017-03-06';
			BiO2oOrderService.getPageList($scope.searchModel)
				.then(function (result) {
					$scope.statisticsModels = result.data.list;
					angular.forEach($scope.statisticsModels, function(data, index, array){
						data.successOrderRatio = '0.00%';
						if(data.orderCount>0){
							data.successOrderRatio = data.successOrderCount/data.orderCount;
							data.successOrderRatio = '' + (data.successOrderRatio*100).toFixed(2) + '%';
						}
					});
					$scope.statisticsTableState.pagination.numberOfPages = result.numberOfPages;
					$scope.isLoading = false;
					getStatisticsAll();  //总计
				});
			 BiBaseService.setTimeRange($scope.$parent);
		}
		/**
		 * 查询所有统计数据导出
		 */
		function getStatisticsAll() {
			//设置表格状态和分页信息
			$scope.isLoading = true;
			BiO2oOrderService.getAllList($scope.searchModel)
				.then(function (result) {
					$scope.statisticsModelsAll = result.data;
					//求和
					$scope.summaryModelForTotal = {};
					$scope.summaryModelForTotal.orderCount = 0;
					$scope.summaryModelForTotal.orderNum = 0;
					$scope.summaryModelForTotal.successOrderCount = 0;
					$scope.summaryModelForTotal.successOrderNum = 0;
					$scope.summaryModelForTotal.successOrderAmount = 0.00;
					$scope.summaryModelForTotal.successOrderRatio = '0.00%';
					angular.forEach($scope.statisticsModelsAll, function(data, index, array){
						$scope.summaryModelForTotal.orderCount = $scope.summaryModelForTotal.orderCount + data.orderCount;
						$scope.summaryModelForTotal.orderNum = $scope.summaryModelForTotal.orderNum + data.orderNum;
						$scope.summaryModelForTotal.successOrderCount = $scope.summaryModelForTotal.successOrderCount + data.successOrderCount;
						$scope.summaryModelForTotal.successOrderNum = $scope.summaryModelForTotal.successOrderNum + data.successOrderNum;
						$scope.summaryModelForTotal.successOrderAmount = $scope.summaryModelForTotal.successOrderAmount + data.successOrderAmount;
						data.successOrderRatio = '0.00%';
						if(data.orderCount>0){
							data.successOrderRatio = data.successOrderCount/data.orderCount;
							data.successOrderRatio = '' + (data.successOrderRatio*100).toFixed(2) + '%';
						}
					});
					if($scope.summaryModelForTotal.orderCount>0){
						$scope.summaryModelForTotal.successOrderRatio = $scope.summaryModelForTotal.successOrderCount/$scope.summaryModelForTotal.orderCount;
						$scope.summaryModelForTotal.successOrderRatio = '' + ($scope.summaryModelForTotal.successOrderRatio*100).toFixed(2) + '%';
					}
					$scope.isLoading = false;
				});
		}
		/**
		 * 导出统计数据到excel
		 */
		function exportToExcel() {
			var titleName = 'O2O订单';
			var statisticsExportTableStyle = {
		        sheetid: titleName,
		        headers: true,
		        caption: {
		        	title:titleName + '-统计数据',
		        },
		        column: {style:'font-size:16px; text-align:left;'},
		        columns: [{columnid:'schoolName',title: '校区',width: '100px'},
		                  {columnid:'orderCount',title: '下单数'},
		                  {columnid:'orderNum',title: '下单人数'},
		                  {columnid:'successOrderCount',title: '支付成功订单数'},
		                  {columnid:'successOrderNum',title: '支付成功人数'},
		                  {columnid:'successOrderAmount',title: '支付成功总金额'},
		                  {columnid:'successOrderRatio',title: '支付成功率'},
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
		    alasql('SELECT * INTO XLS("O2O订单-统计数据.xls", ?) FROM ?', [statisticsExportTableStyle, $scope.statisticsModelsAll]);
		}
	}
]);