'use strict';

/**
 * The biO2oNum controller.
 * @version 1.0
 */
angular.module('ywsApp').controller('BiO2oNumController', [
	'$scope', '$modal', '$filter', '$rootScope', 'SweetAlert', 'BiO2oNumService', 'DepartmentService',
	'AuthenticationService', 'localStorageService', 'CommonService', 'BiBaseService',
	function($scope, $modal, $filter, $rootScope, SweetAlert, BiO2oNumService, DepartmentService, 
			AuthenticationService, localStorageService, CommonService, BiBaseService) {
		// 方法声明
		/**
		 * 共同方法
		 */
		$scope.exchangeTable = exchangeTable;
		$scope.getDataByFilter = getDataByFilter;
		$scope.exportData = exportData;
		/*
		 * 统计方法
		 */
		$scope.getStatistics = getStatistics;
		$scope.getStatisticsAll = getStatisticsAll;
		$scope.getStatisticsByFilter = getStatisticsByFilter;
		$scope.exportStatisticsToExcel = exportStatisticsToExcel;
		/**
		 * 汇总方法
		 */
		$scope.getSummary = getSummary;
		$scope.getTotal = getTotal;
		// 参数初始化
		/**
		 * 统计参数
		 */
		$scope.statisticsModels = {};  //统计表格数据 
		if($scope.showPermissions('O2ONumSummary')){
			$scope.searchModel.viewType = '1';
			$scope.currentTable = '1';
		}else{
			$scope.searchModel.viewType = '2';
			$scope.currentTable = '2';
		}
		/**
		 * 汇总参数
		 */
		$scope.summaryChannelOrder = {};  //汇总表格数据 
		$scope.exportSummaryData = [];
		
		//具体方法实现
		/***                                                                                        ***/
		/**********************************************公共部分*****************************************/
		/***                                                                                        ***/
		function exportData(){
			//如果是查询汇总数据
			if($scope.searchModel.viewType==='1'){
				exportSummaryToExcel();
			}
			//如果是查询明细数据
			else if($scope.searchModel.viewType==='2'){
				getStatisticsAll();
			}
		}
		/**
		 * 条件查询
		 */
		function getDataByFilter(){
			$("body").click();
			$scope.searchModel.statTime = new Date($("#statTime").val());
			//如果是查询汇总数据
			if($scope.searchModel.viewType==='1'){
				getSummary();
			}
			//如果是查询明细数据
			else if($scope.searchModel.viewType==='2'){
				getStatisticsByFilter();
			}
			BiBaseService.setTimeRange($scope.$parent);
		}
		/**
		 * 切换汇总和明细
		 */
		function exchangeTable(obj){
			if($scope.currentTable === '1'){
				$scope.currentTable = '2';
				$scope.searchModel.viewType = '2';
			}else{
				$scope.currentTable = '1';
				$scope.searchModel.viewType = '1';
			}
		}
		/**
		 * 变换日期格式为字符串
		 */
		function formatDate(date){
			var myyear = date.getFullYear();
	        var mymonth = date.getMonth() + 1;
	        var myweekday = date.getDate();

	        if(mymonth < 10){
	            mymonth = "0" + mymonth;
	        }
	        if(myweekday < 10){
	            myweekday = "0" + myweekday;
	        }
	        return (myyear + "-" + mymonth + "-" + myweekday + " 00:00:00");
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
            BiO2oNumService.getPageList($scope.searchModel)
				.then(function (result) {
					$scope.statisticsModels = result.data.list;
					angular.forEach($scope.statisticsModels, function(data, index, array){
						data.loginRatio = '0.00%';
						if(data.recommendNum>0){
							data.loginRatio=data.loginNum/data.recommendNum;
							data.loginRatio = '' + (data.loginRatio*100).toFixed(2) + '%';
						}
					});
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
			BiO2oNumService.getPageList($scope.searchModel)
				.then(function (result) {
					$scope.statisticsModels = result.data.list;
					angular.forEach($scope.statisticsModels, function(data, index, array){
						data.loginRatio = '0.00%';
						if(data.recommendNum>0){
							data.loginRatio=data.loginNum/data.recommendNum;
							data.loginRatio = '' + (data.loginRatio*100).toFixed(2) + '%';
						}
					});
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
			BiO2oNumService.getAllList($scope.searchModel)
				.then(function (result) {
					$scope.statisticsModelsAll = result.data;
					angular.forEach($scope.statisticsModelsAll, function(data, index, array){
						data.loginRatio = '0.00%';
						if(data.recommendNum>0){
							data.loginRatio=data.loginNum/data.recommendNum;
							data.loginRatio = '' + (data.loginRatio*100).toFixed(2) + '%';
						}
					});
					$scope.isLoading = false;
					$scope.canExportDatas = true;
					exportStatisticsToExcel();
				});
		}
		/**
		 * 导出统计数据到excel
		 */
		function exportStatisticsToExcel() {
			var titleName = 'O2O用户-明细数据';
			var statisticsExportTableStyle = {
		        sheetid: titleName,
		        headers: true,
		        caption: {
		        	title: titleName,
		        },
		        column: {style:'font-size:16px; text-align:left;'},
		        columns: [
		                  {columnid:'schoolName',title: '校区',width: '100px'},
		                  {columnid:'recommendNum',title: '推荐用户数'},
		                  {columnid:'studentRecommendNum',title: '学生推荐用户数'},
		                  {columnid:'teacherRecommendNum',title: '教师推荐用户数'},
		                  {columnid:'loginNum',title: '激活数'},
		                  {columnid:'loginRatio',title: '激活率'}
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
		    alasql('SELECT * INTO XLS("O2O用户-明细数据.xls", ?) FROM ?', [statisticsExportTableStyle, $scope.statisticsModelsAll]);
		}
		/***                                                                                        ***/
		/**********************************************汇总部分*****************************************/
		/***
		 * 获取汇总数据
		 */
		function getSummary(){
			$scope.canExportDatas = false;
			BiO2oNumService.queryBySummary($scope.searchModel)
				.then(function (result) {
					$scope.summaryModels = result.data;
					if($scope.summaryModels===null){
						$scope.summaryModels = {};
						$scope.summaryModels.o2oNum = 0;
						$scope.summaryModels.registerNum = 0;
						$scope.summaryModels.recommendNum = 0;
						$scope.summaryModels.studentRecommendNum = 0;
						$scope.summaryModels.teacherRecommendNum = 0;
						$scope.summaryModels.loginNum = 0;
						$scope.summaryModels.loginRatio = '0.00%';
					}
					$scope.summaryModels.loginRatio = '0.00%';
					if($scope.summaryModels.o2oNum>0){
						$scope.summaryModels.loginRatio=$scope.summaryModels.loginNum/$scope.summaryModels.o2oNum;
						$scope.summaryModels.loginRatio = '' + ($scope.summaryModels.loginRatio*100).toFixed(2) + '%';
					}
					$scope.canExportDatas = true;
				});
		}
		/**
		 * 导出汇总数据到excel
		 */
		function exportSummaryToExcel() {
			var titleName = 'O2O用户-汇总数据';
			var summaryExportTableStyle = {
					sheetid: titleName,
					headers: true,
					caption: {
						title: titleName,
					},
					column: {style:'font-size:16px; text-align:left;'},
					columns: [
							  {columnid:'o2oNum',title: '新增用户数'},
							  {columnid:'registerNum',title: '自然用户数'},
							  {columnid:'recommendNum',title: '推荐用户数'},
							  {columnid:'studentRecommendNum',title: '学生推荐用户数'},
							  {columnid:'teacherRecommendNum',title: '教师推荐用户数'},
							  {columnid:'loginNum',title: '激活数'},
							  {columnid:'loginRatio',title: '激活率'}
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
			var exportDate = [];
			exportDate.push($scope.summaryModels);
			alasql('SELECT * INTO XLS("O2O用户-汇总数据.xls", ?) FROM ?', [summaryExportTableStyle, exportDate]);
		}
		/**
		 * 获取累计数据
		 */
		function getTotal(){
			var searchTotalModel=angular.copy($scope.searchModel);
			searchTotalModel.statTime = null;
			searchTotalModel.timeScope = null;
			BiO2oNumService.queryBySummary(searchTotalModel).then(function(result){
				$scope.totalModel = result.data;
				if($scope.totalModel===null){
					$scope.totalModel = {};
					$scope.totalModel.o2oNum = 0;
					$scope.totalModel.registerNum = 0;
					$scope.totalModel.recommendNum = 0;
					$scope.totalModel.studentRecommendNum = 0;
					$scope.totalModel.teacherRecommendNum = 0;
					$scope.totalModel.loginNum = 0;
					$scope.totalModel.loginRatio = '0.00%';
				}
				$scope.totalModel.loginRatio = '0.00%';
				if($scope.totalModel.o2oNum>0){
					$scope.totalModel.loginRatio=$scope.totalModel.loginNum/$scope.totalModel.o2oNum;
					$scope.totalModel.loginRatio = '' + ($scope.totalModel.loginRatio*100).toFixed(2) + '%';
				}
			});
		}
		
	}
]);