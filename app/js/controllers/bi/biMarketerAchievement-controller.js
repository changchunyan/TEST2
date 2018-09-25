'use strict';

/**
 * The biMarketerAchievement controller.
 * @version 1.0
 */
angular.module('ywsApp').controller('BiMarketerAchievementController', [
	'$scope','$sce', '$modal', '$filter', '$rootScope', 'SweetAlert', 'BiMarketerAchievementService',
	'DepartmentService', 'AuthenticationService', 'localStorageService', 'CommonService', 'BiBaseService',
	function($scope,$sce, $modal, $filter, $rootScope, SweetAlert, BiMarketerAchievementService,
			DepartmentService, AuthenticationService, localStorageService, CommonService, BiBaseService) {

		/*
		 * 统计方法
		 */
		$scope.getStatistics = getStatistics;
		$scope.getDataByFilter = getDataByFilter;
		$scope.getStatisticsAll = getStatisticsAll;
		$scope.exportStatisticsToExcel = exportStatisticsToExcel;

		/**
		 * 统计参数
		 */
		$scope.statisticsModels = {};
		$scope.statisticsModelsAll = {};

		/**
		 * 根据列表状态获取统计数据
		 */
		function getStatistics(tableState) {
			$scope.statisticsTableState = tableState;
			$scope.isLoading = true;
      $scope.pagination = tableState.pagination;
      $scope.start = $scope.pagination.start || 0;
      $scope.number = $scope.pagination.number || 10;
      $scope.searchModel.start = $scope.start;
      $scope.searchModel.size = $scope.number;
      BiMarketerAchievementService.getPageList($scope.searchModel).then(function (result) {
        $scope.statisticsModels = result.data.list;
        tableState.pagination.numberOfPages = result.numberOfPages;
        $scope.isLoading = false;
      });
		}

		/**
		 * 根据筛选条件获取统计数据
		 */
		function getDataByFilter() {
			$("body").click();
			$scope.searchModel.statTime = new Date($("#statTime").val());

			$scope.isLoading = true;
			$scope.statisticsTableState.pagination.start=0;
      $scope.pagination = $scope.statisticsTableState.pagination;
			$scope.start = $scope.pagination.start || 0;
			$scope.number = $scope.pagination.number || 10;
			$scope.searchModel.start = $scope.start;
      $scope.searchModel.size = $scope.number;
      BiMarketerAchievementService.getPageList($scope.searchModel)
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
			BiMarketerAchievementService.getAllList($scope.searchModel)
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
					});
					exportStatisticsToExcel();
				});
		}

		/**
		 * 导出excel
		 */
		function exportStatisticsToExcel(){
			var titleName = '市场业绩';
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
                  {columnid:'leadsCount',title: 'Leads数'},
				          {columnid:'invitationCount',title: '邀约数'},
				          {columnid:'visitCount',title: '到访数'},
				          {columnid:'experienceCount',title: '体验数'},
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
		    alasql('SELECT * INTO XLS("市场业绩-统计数据.xls", ?) FROM ?', [statisticsExportTableStyle, $scope.statisticsModelsAll]);
		}
	}
]);
