'use strict';

/**
 * The biContinuousConsumeCourse controller.
 * @version 1.0
 */
angular.module('ywsApp').controller('BiContinuousConsumeCourseController', [
	'$scope', '$modal', '$filter', '$rootScope', 'SweetAlert', 'BiContinuousConsumeCourseService',
	'DepartmentService', 'AuthenticationService', 'localStorageService', 'CommonService', 'BiBaseService',
	function($scope, $modal, $filter, $rootScope, SweetAlert, BiContinuousConsumeCourseService,
			DepartmentService, AuthenticationService, localStorageService, CommonService, BiBaseService) {
		// 方法声明
		/**
		 * 共同方法
		 */
		$scope.getTabIndex = getTabIndex;
		/*
		 * 统计方法
		 */
		$scope.getStatistics = getStatistics;
		$scope.getDataByFilter = getDataByFilter;
		$scope.getStatisticsAll = getStatisticsAll;
		$scope.exportStatisticsToExcel = exportStatisticsToExcel;
		/*
		 * 汇总方法
		 */
		$scope.getSummary = getSummary;
		$scope.exportSummaryToExcel = exportSummaryToExcel;
		// 参数初始化
		/**
		 * 统计参数
		 */
		$scope.statisticsModels = {};
		$scope.statisticsModelsAll = {};
		/**
		 * 汇总参数
		 */
		$scope.summaryModel = {};
		//具体方法实现
		/***                                                                                        ***/
		/**********************************************公共部分*****************************************/
		/***                                                                                        ***/
		/**
		 * tab切换
		 */
		function getTabIndex(obj){
			if(obj.title==='数据明细表'){
				$scope.channelTab='0';
			}else if(obj.title==='数据汇总表'){
				$scope.channelTab='1';
			}
		}
		/**
		 * 封装model，加入合计
		 */
		function packageModel(obj){
			obj.totalVisitCount = obj.renewVisitCount + obj.recommendVisitCount;
			obj.totalVisitTimes = obj.renewVisitTimes + obj.recommendVisitTimes;
			obj.totalOrderCount = obj.renewOrderCount + obj.recommendOrderCount;
			obj.totalOrderAmount = obj.renewOrderAmount + obj.recommendOrderAmount;
			return obj;
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
            BiContinuousConsumeCourseService.getPageList($scope.searchModel)
	        	.then(function (result) {
	                $scope.statisticsModels = result.data.list;
	                tableState.pagination.numberOfPages = result.numberOfPages;
	                $scope.isLoading = false;
	                angular.forEach($scope.statisticsModels, function(data, index){
	                	data = packageModel(data);
	                });
	            });
		}
		/**
		 * 根据筛选条件获取统计数据
		 */
		function getDataByFilter() {
			$("body").click();
			$scope.searchModel.statTime = new Date($("#statTime").val());
			if(!$scope.channelTab || $scope.channelTab==='0'){
				//设置表格状态和分页信息
				$scope.isLoading = true;
				$scope.statisticsTableState.pagination.start=0;
				$scope.pagination = $scope.statisticsTableState.pagination;
				$scope.start = $scope.pagination.start || 0;
				$scope.number = $scope.pagination.number || 10;
				$scope.searchModel.start = $scope.start;
				$scope.searchModel.size = $scope.number;
				BiContinuousConsumeCourseService.getPageList($scope.searchModel)
				.then(function (result) {
					$scope.statisticsModels = result.data.list;
					$scope.statisticsTableState.pagination.numberOfPages = result.numberOfPages;
					angular.forEach($scope.statisticsModels, function(data, index){
						data = packageModel(data);
					});
					$scope.isLoading = false;
				});
			}else if($scope.channelTab==='1'){
				getSummary();
			}
			BiBaseService.setTimeRange($scope.$parent);
		}
		/**
		 * 查询所有统计数据
		 */
		function getStatisticsAll() {
			BiContinuousConsumeCourseService.getAllList($scope.searchModel)
				.then(function (result) {
					$scope.statisticsModelsAll = result.data;
					angular.forEach($scope.statisticsModelsAll, function(data, index){
						if ($scope.searchModel.schoolType == 1) {
							data.schoolType = '直营校区';
						}
						if ($scope.searchModel.schoolType == 2) {
							data.schoolType = '合作校区';
						}
						if ($scope.searchModel.schoolType == 3) {
							data.schoolType = '直盟校区';
						}
						data = packageModel(data);
					});
					exportStatisticsToExcel();
				});
		}
		/**
		 * 导出excel
		 */
		function exportStatisticsToExcel(){
			var statisticsExportTableStyle = {
		        sheetid: '续推消课',
		        headers: true,
		        caption: {
		        	title:'续推消课-统计数据',
		        },
		        column: {style:'font-size:14px; text-align:left;'},
		        columns: [{columnid:'schoolName',title: '校区',width: '100px'},
				          {columnid:'renewVisitCount',title: '续费明细到访数'},
				          {columnid:'renewVisitTimes',title: '续费明细到访人次数'},
				          {columnid:'renewOrderCount',title: '续费明细签单数'},
				          {columnid:'renewOrderAmount', title: '续费明细签单金额'},
				          {columnid:'recommendVisitCount',title: '推荐明细到访数'},
				          {columnid:'recommendVisitTimes',title: '推荐明细到访人次数'},
				          {columnid:'recommendAuditionCount',title: '推荐明细试听数'},
				          {columnid:'recommendAuditionHourCount',title: '推荐明细试听课时量'},
				          {columnid:'recommendOrderCount',title: '推荐明细签单数'},
				          {columnid:'recommendOrderAmount',title: '推荐明细签单金额'},
				          {columnid:'totalVisitCount',title: '合计到访数'},
				          {columnid:'totalVisitTimes',title: '合计到访人次数'},
				          {columnid:'totalOrderCount',title: '合计签单数'},
				          {columnid:'totalOrderAmount',title: '合计签单金额'},
				          {columnid:'classHourCount',title: '课时消耗课时任务'},
				          {columnid:'realClassHourCount',title: '课时消耗实际课时量'},
				          {columnid:'realClassHours',title: '课时消耗实际课时小时数'},
				          {columnid:'auditionClassHourCount',title: '课时消耗实际课时量'},
				          {columnid:'auditionClassHours',title: '课时消耗实际课时小时数'}
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
		    alasql('SELECT * INTO XLS("续推消课-统计数据.xls", ?) FROM ?', [statisticsExportTableStyle, $scope.statisticsModelsAll]);
		}

		/***                                                                                        ***/
		/**********************************************汇总部分*****************************************/
		/***                                                                                        ***/
		/**
		 * 得到汇总的数据
		 */
		function getSummary(){
			BiContinuousConsumeCourseService.getAllList($scope.searchModel)
				.then(function (result) {
					$scope.statisticsModelsAll = result.data;
					angular.forEach($scope.statisticsModelsAll, function(data, index){
						if ($scope.searchModel.schoolType == 1) {
							data.schoolType = '直营校区';
						}
						if ($scope.searchModel.schoolType == 2) {
							data.schoolType = '合作校区';
						}
						if ($scope.searchModel.schoolType == 3) {
							data.schoolType = '直盟校区';
						}
						data = packageModel(data);
					});
					var obj = new Object();
					obj.renewVisitCount = 0;
					obj.renewVisitTimes = 0;
					obj.renewOrderCount = 0;
					obj.renewOrderAmount = 0.00;
					obj.recommendVisitCount = 0;
					obj.recommendVisitTimes = 0;
					obj.recommendAuditionCount = 0;
					obj.recommendAuditionHourCount = 0.0;
					obj.recommendOrderCount = 0;
					obj.recommendOrderAmount = 0.00;
					obj.classHourCount = 0;
					obj.realClassHourCount = 0;
					obj.realClassHours = 0;
					obj.auditionClassHourCount = 0;
					obj.auditionClassHours = 0;
					angular.forEach($scope.statisticsModelsAll, function(data, index, array) {
						obj.renewVisitCount = obj.renewVisitCount + data.renewVisitCount;
						obj.renewVisitTimes = obj.renewVisitTimes + data.renewVisitTimes;
						obj.renewOrderCount = obj.renewOrderCount + data.renewOrderCount;
						obj.renewOrderAmount = obj.renewOrderAmount + data.renewOrderAmount;
						obj.recommendVisitCount = obj.recommendVisitCount + data.recommendVisitCount;
						obj.recommendVisitTimes = obj.recommendVisitTimes + data.recommendVisitTimes;
						obj.recommendAuditionCount = obj.recommendAuditionCount + data.recommendAuditionCount;
						obj.recommendAuditionHourCount = obj.recommendAuditionHourCount + data.recommendAuditionHourCount;
						obj.recommendOrderCount = obj.recommendOrderCount + data.recommendOrderCount;
						obj.recommendOrderAmount = obj.recommendOrderAmount + data.recommendOrderAmount;
						obj.classHourCount = obj.classHourCount + data.classHourCount;
						obj.realClassHourCount = obj.realClassHourCount + data.realClassHourCount;
						obj.realClassHours = obj.realClassHours + data.realClassHours;
						obj.auditionClassHourCount = obj.auditionClassHourCount + data.auditionClassHourCount;
						obj.auditionClassHours = obj.auditionClassHours + data.auditionClassHours;
					});
					obj.renewOrderAmount = obj.renewOrderAmount.toFixed(2);
					obj.recommendOrderAmount = obj.recommendOrderAmount.toFixed(2);
					if ($scope.searchModel.schoolType == 1) {
						obj.schoolType = '直营校区';
					}
					if ($scope.searchModel.schoolType == 2) {
						obj.schoolType = '合作校区';
					}
					if ($scope.searchModel.schoolType == 3) {
						obj.schoolType = '直盟校区';
					}
					$scope.summaryModel = obj;
					$scope.summaryModel.name = $scope.selectdDepartment.name;
					$scope.summaryModel = packageModel($scope.summaryModel);
				});
		}
		/**
		 * 导出excel
		 */
		function exportSummaryToExcel(){
			var summaryExportTableStyle = {
		        sheetid: '续推消课',
		        headers: true,
		        caption: {
		        	title:'续推消课-汇总数据',
		        },
		        column: {style:'font-size:14px; text-align:left;'},
		        columns: [{columnid:'name',title: '区域/校区',width: '100px'},
				          {columnid:'renewVisitCount',title: '续费明细到访数'},
				          {columnid:'renewVisitTimes',title: '续费明细到访人次数'},
				          {columnid:'renewOrderCount',title: '续费明细签单数'},
				          {columnid:'renewOrderAmount', title: '续费明细签单金额'},
				          {columnid:'recommendVisitCount',title: '推荐明细到访数'},
				          {columnid:'recommendVisitTimes',title: '推荐明细到访人次数'},
				          {columnid:'recommendAuditionCount',title: '推荐明细试听数'},
				          {columnid:'recommendAuditionHourCount',title: '推荐明细试听课时量'},
				          {columnid:'recommendOrderCount',title: '推荐明细签单数'},
				          {columnid:'recommendOrderAmount',title: '推荐明细签单金额'},
				          {columnid:'totalVisitCount',title: '合计到访数'},
				          {columnid:'totalVisitTimes',title: '合计到访人次数'},
				          {columnid:'totalOrderCount',title: '合计签单数'},
				          {columnid:'totalOrderAmount',title: '合计签单金额'},
				          {columnid:'classHourCount',title: '课时消耗课时任务'},
				          {columnid:'realClassHourCount',title: '课时消耗实际课时量'},
				          {columnid:'realClassHours',title: '课时消耗实际课时小时数'},
				          {columnid:'auditionClassHourCount',title: '课时消耗实际课时量'},
				          {columnid:'auditionClassHours',title: '课时消耗实际课时小时数'}
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
			$scope.exportData = angular.copy($scope.statisticsModels);
			$scope.exportData = [];
			$scope.exportData.push($scope.summaryModel);
		    alasql('SELECT * INTO XLS("续推消课-汇总数据.xls", ?) FROM ?', [summaryExportTableStyle, $scope.exportData]);
		}
	}
]);
