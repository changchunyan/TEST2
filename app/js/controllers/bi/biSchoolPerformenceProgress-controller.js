'use strict';

/**
 * The biContinuousConsumeCourse controller.
 * @version 1.0
 */
angular.module('ywsApp').controller('BiSchoolPerformenceProgressController', [
	'$scope', '$modal', '$filter', '$rootScope', 'SweetAlert', 'BiSchoolPerformenceProgressService',
	'DepartmentService', 'AuthenticationService', 'localStorageService', 'CommonService', 'BiBaseService',
	function ($scope, $modal, $filter, $rootScope, SweetAlert, BiSchoolPerformenceProgressService,
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

		//初始化
		BiBaseService.setTimeScope($scope.$parent, 2);

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
		function getTabIndex(obj) {
			if (obj.title === '各校区进度') {
				$scope.channelTab = '0';
			} else if (obj.title === '区域进度') {
				$scope.channelTab = '1';
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
			if ($scope.searchModel.schoolId) {
				delete $scope.searchModel.schoolId;
			}
			BiSchoolPerformenceProgressService.getPageList($scope.searchModel)
				.then(function (result) {
					$scope.statisticsModels = result.data.list;
					angular.forEach($scope.statisticsModels, function (data, index, array) {
						if (data.marketGoal === 0) {
							data.marketRatio = '---';
							data.marketBalance = '---';
						}
						if (data.managementGoal === 0) {
							data.managementRatio = '---';
							data.managementBalance = '---';
						}
						if (data.managementGoal === 0 || data.marketGoal === 0) {
							data.totalRatio = '---';
							data.totalBalance = '---';
						}
						if (data.consumeGoal === 0) {
							data.consumeRatio = '---';
							data.consumeBalance = '---';
						}
					});
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
			if (!$scope.channelTab || $scope.channelTab === '0') {
				//设置表格状态和分页信息
				$scope.isLoading = true;
				$scope.statisticsTableState.pagination.start = 0;
				$scope.pagination = $scope.statisticsTableState.pagination;
				$scope.start = $scope.pagination.start || 0;
				$scope.number = $scope.pagination.number || 10;
				$scope.searchModel.start = $scope.start;
				$scope.searchModel.size = $scope.number;
				BiSchoolPerformenceProgressService.getPageList($scope.searchModel)
					.then(function (result) {
						$scope.statisticsModels = result.data.list;
						angular.forEach($scope.statisticsModels, function (data, index, array) {
							if (data.marketGoal === 0) {
								data.marketRatio = '---';
								data.marketBalance = '---';
							}
							if (data.managementGoal === 0) {
								data.managementRatio = '---';
								data.managementBalance = '---';
							}
							if (data.managementGoal === 0 || data.marketGoal === 0) {
								data.totalRatio = '---';
								data.totalBalance = '---';
							}
							if (data.consumeGoal === 0) {
								data.consumeRatio = '---';
								data.consumeBalance = '---';
							}
						});
						$scope.statisticsTableState.pagination.numberOfPages = result.numberOfPages;
						$scope.isLoading = false;
					});
			} else if ($scope.channelTab === '1') {
				getSummary();
			}
			BiBaseService.setTimeRange($scope.$parent);
		}
		/**
		 * 查询所有统计数据
		 */
		function getStatisticsAll() {
			BiSchoolPerformenceProgressService.getAllList($scope.searchModel)
				.then(function (result) {
					$scope.statisticsModelsAll = result.data;
					angular.forEach($scope.statisticsModelsAll, function (data, index, array) {
						if (data.marketGoal === 0) {
							data.marketRatio = '---';
							data.marketBalance = '---';
						}
						if (data.managementGoal === 0) {
							data.managementRatio = '---';
							data.managementBalance = '---';
						}
						if (data.managementGoal === 0 || data.marketGoal === 0) {
							data.totalRatio = '---';
							data.totalBalance = '---';
						}
						if (data.consumeGoal === 0) {
							data.consumeRatio = '---';
							data.consumeBalance = '---';
						}
					});
					exportStatisticsToExcel();
				});
		}
		/**
		 * 导出excel
		 */
		function exportStatisticsToExcel() {
			var statisticsExportTableStyle = {
				sheetid: '校区业绩进度统计',
				headers: true,
				caption: {
					title: '校区业绩进度-统计数据',
				},
				column: { style: 'font-size:14px; text-align:left;' },
				columns: [{ columnid: 'schoolName', title: '校区', width: '100px' },
				{ columnid: 'marketRatio', title: '营销实收完成率（月）' },
				{ columnid: 'marketBalance', title: '目标差额' },
				{ columnid: 'managementRatio', title: '学管实收完成率（月）' },
				{ columnid: 'managementBalance', title: '目标差额' },
				{ columnid: 'totalRatio', title: '总实收完成率（月）' },
				{ columnid: 'totalBalance', title: '目标差额' },
				{ columnid: 'consumeRatio', title: '消课课时完成率（月）' },
				{ columnid: 'consumeBalance', title: '目标差额' }
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
			alasql('SELECT * INTO XLS("校区业绩进度-统计数据.xls", ?) FROM ?', [statisticsExportTableStyle, $scope.statisticsModelsAll]);
		}

		/***                                                                                        ***/
		/**********************************************汇总部分*****************************************/
		/***                                                                                        ***/
		/**
		 * 得到汇总的数据
		 */
		function getSummary() {
			BiSchoolPerformenceProgressService.getAllList($scope.searchModel)
				.then(function (result) {
					$scope.statisticsModelsAll = result.data;
					if ($scope.statisticsModelsAll.length === 0) {
						$scope.summaryModel = {};
						return;
					}
					var obj = new Object();
					obj.marketGoal = 0.00;
					obj.marketRealAmount = 0.00;
					obj.managementGoal = 0.00;
					obj.managementRealAmount = 0.00;
					obj.consumeGoal = 0.00;
					obj.consumeNum = 0.00;
					angular.forEach($scope.statisticsModelsAll, function (data, index, array) {
						if ($scope.searchModel.schoolId != null) {
							obj.schoolType = data.schoolType;
						}
						obj.marketGoal = obj.marketGoal + data.marketGoal;
						obj.marketRealAmount = obj.marketRealAmount + data.marketRealAmount;
						obj.managementGoal = obj.managementGoal + data.managementGoal;
						obj.managementRealAmount = obj.managementRealAmount + data.managementRealAmount;
						obj.consumeGoal = obj.consumeGoal + data.consumeGoal;
						obj.consumeNum = obj.consumeNum + data.consumeNum;
					});
					obj.marketGoal = obj.marketGoal.toFixed(2);
					obj.marketRealAmount = obj.marketRealAmount.toFixed(2);
					obj.managementGoal = obj.managementGoal.toFixed(2);
					obj.managementRealAmount = obj.managementRealAmount.toFixed(2);
					obj.consumeGoal = obj.consumeGoal.toFixed(2);
					obj.consumeNum = obj.consumeNum.toFixed(2);
					if ($scope.searchModel.schoolType == 1) {
						obj.schoolType = '直营校区';
					}
					if ($scope.searchModel.schoolType == 2) {
						obj.schoolType = '合作校区';
					}
					if ($scope.searchModel.schoolType == 3) {
						obj.schoolType = '直盟校区';
					}
					//计算完成率和差额
					//营销目标
					if (obj.marketGoal * 1 === 0 || obj.marketGoal * 1 === 0.00) {
						obj.marketRatio = '---';
						obj.marketBalance = '---';
					} else {
						obj.marketRatio = obj.marketRealAmount * 1 / obj.marketGoal * 1;
						obj.marketRatio = obj.marketRatio * 100;
						obj.marketRatio = obj.marketRatio.toFixed(2);
						obj.marketRatio = obj.marketRatio + '%';
						obj.marketBalance = obj.marketRealAmount - obj.marketGoal;
						obj.marketBalance = obj.marketBalance.toFixed(2);
					}
					//学管目标
					if (obj.managementGoal * 1 === 0 || obj.managementGoal * 1 === 0.00) {
						obj.managementRatio = '---';
						obj.managementBalance = '---';
					} else {
						obj.managementRatio = obj.managementRealAmount * 1 / obj.managementGoal * 1;
						obj.managementRatio = obj.managementRatio * 100;
						obj.managementRatio = obj.managementRatio.toFixed(2);
						obj.managementRatio = obj.managementRatio + '%';
						obj.managementBalance = obj.managementRealAmount - obj.managementGoal;
						obj.managementBalance = obj.managementBalance.toFixed(2);
					}
					//总目标
					if (obj.managementGoal * 1 === 0 || obj.marketGoal * 1 === 0 || obj.marketGoal * 1 === 0.00 || obj.managementGoal * 1 === 0.00) {
						obj.totalRatio = '---';
						obj.totalBalance = '---';
					} else {
						obj.totalRatio = (obj.managementRealAmount * 1 + obj.marketRealAmount * 1) / (obj.managementGoal * 1 + obj.marketGoal * 1);
						obj.totalRatio = obj.totalRatio * 100;
						obj.totalRatio = obj.totalRatio.toFixed(2);
						obj.totalRatio = obj.totalRatio + '%';
						obj.totalBalance = (obj.managementRealAmount * 1 + obj.marketRealAmount * 1) - (obj.managementGoal * 1 + obj.marketGoal * 1);
						obj.totalBalance = obj.totalBalance.toFixed(2);
					}
					//消课
					if (obj.consumeGoal * 1 === 0 || obj.consumeGoal * 1 === 0.00) {
						obj.consumeRatio = '---';
						obj.consumeBalance = '---';
					} else {
						obj.consumeRatio = obj.consumeNum * 1 / obj.consumeGoal * 1;
						obj.consumeRatio = obj.consumeRatio * 100;
						obj.consumeRatio = obj.consumeRatio.toFixed(2);
						obj.consumeRatio = obj.consumeRatio + '%';
						obj.consumeBalance = obj.consumeNum - obj.consumeGoal;
						obj.consumeBalance = obj.consumeBalance.toFixed(2);
					}
					$scope.summaryModel = obj;
					$scope.summaryModel.name = $scope.selectdDepartment.name;
				});
		}
		/**
		 * 导出excel
		 */
		function exportSummaryToExcel() {
			var summaryExportTableStyle = {
				sheetid: '校区业绩进度统计',
				headers: true,
				caption: {
					title: '校区业绩进度-汇总数据',
				},
				column: { style: 'font-size:14px; text-align:left;' },
				columns: [{ columnid: 'name', title: '区域/校区', width: '100px' },
				{ columnid: 'marketRatio', title: '营销实收完成率（月）' },
				{ columnid: 'marketBalance', title: '目标差额' },
				{ columnid: 'managementRatio', title: '学管实收完成率（月）' },
				{ columnid: 'managementBalance', title: '目标差额' },
				{ columnid: 'totalRatio', title: '总实收完成率（月）' },
				{ columnid: 'totalBalance', title: '目标差额' },
				{ columnid: 'consumeRatio', title: '消课课时完成率（月）' },
				{ columnid: 'consumeBalance', title: '目标差额' }
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
			$scope.exportData = angular.copy($scope.statisticsModels);
			$scope.exportData = [];
			$scope.exportData.push($scope.summaryModel);
			alasql('SELECT * INTO XLS("校区业绩进度-汇总数据.xls", ?) FROM ?', [summaryExportTableStyle, $scope.exportData]);
		}
	}
]);
