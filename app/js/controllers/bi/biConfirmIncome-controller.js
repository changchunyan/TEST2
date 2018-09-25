'use strict';

/**
 * The biConfirmIncome controller.
 *
 * @version 1.0
 */
angular.module('ywsApp').controller('BiConfirmIncomeController',
	['$scope', '$modal', '$filter', '$rootScope', 'SweetAlert',
	'BiConfirmIncomeService', 'DepartmentService', 'AuthenticationService', 'localStorageService', 'CommonService', 'BiBaseService', 'StuDetail', '$mtModal',
	function($scope, $modal, $filter, $rootScope, SweetAlert,
			BiConfirmIncomeService, DepartmentService, AuthenticationService, localStorageService, CommonService, BiBaseService, StuDetail, $mtModal) {

		$scope.getSchoolIncome = getSchoolIncome;
		$scope.getSchoolIncomeSummary = getSchoolIncomeSummary;
		$scope.getStatisticsForST = getStatisticsForST;

		$scope.exportSchoolIncome = exportSchoolIncome;
		$scope.exportSummary = exportSummary;
		$scope.exportOrderToExcel = exportOrderToExcel;

		$scope.getPageAll=getPageAll;
		$scope.isShow = false;
		$scope.getTabIndex = getTabIndex;

		$scope.statisticsModels = {};
		$scope.statisticsModelsAll = {};
		$scope.statisticsModelsNew = {};

		$scope.summaryModel = {};

		$scope.normalOrdersModel = {};
		$scope.normalOrdersModelNew = {};
		$scope.normalOrders = {};

		$scope.searchModel.startTime = $scope.searchModel.startTime.Format("yyyy-MM-dd");
		$scope.searchModel.endTime = $scope.searchModel.endTime.Format("yyyy-MM-dd");

		$scope.options = {
			layout: {
				padding: 20
			},
			legend: {
				display: true,
				position: 'top',
				labels: {
					boxWidth: 20,
					fontSize: 9,
					padding: 10
				}
			},
			tooltips: {
				mode: 'point',
				position: 'nearest'
			},
			};

		/**
		 * 获取校区确认收入统计分页数据。这个函数与 getStatistics 区别是它由查询按钮触发，会重置翻页状态。
		 */
		function getSchoolIncome() {
			$scope.searchModel.startTime = $("#startTime").val();
			$scope.searchModel.endTime = $("#endTime").val();

			$scope.statisticsTableState.pagination.start = 0;
			$scope.searchModel.start = $scope.statisticsTableState.pagination.start || 0;
			$scope.searchModel.size = $scope.statisticsTableState.pagination.number || 10;

			$scope.isLoading = true;
			BiConfirmIncomeService.getConfirmInfos($scope.searchModel).then(function(result) {
				$scope.isLoading = false;
				$scope.statisticsModels = result.data.list;
				$scope.statisticsModelsNew = copySchoolIncome($scope.statisticsModels);

				// 重置翻页状态
				$scope.statisticsTableState.pagination.start = 0;
				$scope.statisticsTableState.pagination.numberOfPages = result.numberOfPages;

				// 如果当前用户是校区用户，读取和显示趋势图
				if ($scope.isSchoolUser) {
					BiConfirmIncomeService.getSchoolConfirmInfo($scope.searchModel.departmentId, $scope.searchModel.startTime, $scope.searchModel.endTime).then(function(result) {
						$scope.labelsSummary = [];
						$scope.seriesSummary = ['消课课时','消课时长','确认收入'];
						$scope.dataSummary = [];
						var courseNumData = [];
						var courseHoursCountData = [];
						var confirmIncomeData = [];
						for (var i = 0; i < result.data.length; i++) {
							var dayRecord = result.data[i];
							$scope.labelsSummary.push(formatDate(new Date(dayRecord.statTime)));
							courseNumData.push(dayRecord.courseNum);
							courseHoursCountData.push(dayRecord.courseHoursCount);
							confirmIncomeData.push(dayRecord.confirmIncome);
						}
						$scope.dataSummary.push(courseNumData);
						$scope.dataSummary.push(courseHoursCountData);
						$scope.dataSummary.push(confirmIncomeData);
					});
				}
			});
		}

		function formatDate(obj) {
			var date = obj;
			var seperator1 = "-";
			var year = date.getFullYear();
			var month = date.getMonth() + 1;
			var strDate = date.getDate();
			if (month >= 1 && month <= 9) {
					month = "0" + month;
			}
			if (strDate >= 0 && strDate <= 9) {
					strDate = "0" + strDate;
			}
			return year + seperator1 + month + seperator1 + strDate;
		}

		/**
		 * 获取区域、城市、事业部确认收入统计数据。
		 */
		function getSchoolIncomeSummary() {
			$scope.searchModel.startTime = $("#startTime").val();
			$scope.searchModel.endTime = $("#endTime").val();
			BiConfirmIncomeService.getAllList($scope.searchModel).then(
				function(result) {
					$scope.statisticsModelsAll = result.data;
					if ($scope.statisticsModelsAll == null || $scope.statisticsModelsAll.length === 0) {
						$scope.summaryModel = null;
						return;
					}

					var obj = new Object();
					obj.courseNum = 0.00;
					obj.courseHoursCount = 0.00;
					obj.confirmIncome = 0.00;
					angular.forEach($scope.statisticsModelsAll, function(data, index, array) {
						if ($scope.searchModel.schoolId != null) {
							obj.schoolType = data.schoolType;
						}
						obj.courseNum = obj.courseNum + data.courseNum;
						obj.courseHoursCount = obj.courseHoursCount + data.courseHoursCount;
						obj.confirmIncome = obj.confirmIncome + data.confirmIncome;
					});
					obj.courseNum = Number(obj.courseNum.toFixed(1));
					obj.courseHoursCount = Number(obj.courseHoursCount.toFixed(1));
					obj.confirmIncome = Number(obj.confirmIncome.toFixed(2));

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
				});
		}

		/**
		 * 拷贝统计结果数据。这个函数目前主要进行浮点数有效数字处理。
		 * @param {*} stats 原始统计结果。
		 */
		function copySchoolIncome(stats) {
			var arrayObj = new Array();
			angular.forEach(stats, function(data, index, array) {
				var obj = new Object();
				obj = angular.copy(data);
				obj.courseNum = Number(obj.courseNum.toFixed(1));
				obj.courseHoursCount = Number(obj.courseHoursCount.toFixed(1));
				obj.confirmIncome = Number(obj.confirmIncome.toFixed(2));
				arrayObj[index] = obj;
			});
			return arrayObj;
		}

		/**
		 * 这个函数用于 ST-PIPE 的自动绑定，用于处理翻页。不要手动直接调用它。
		 *
		 * @param tableState 由 st-pipe 传入的当前表格状态
		 */
		function getStatisticsForST(tableState) {
			$scope.statisticsTableState = tableState;
			$scope.pagination = tableState.pagination;
			$scope.start = $scope.pagination.start || 0;
			$scope.number = $scope.pagination.number || 10;
			$scope.searchModel.start = $scope.start;
			$scope.searchModel.size = $scope.number;
			if ($scope.searchModel.schoolId != undefined) {
				$scope.searchModel.departmentId = $scope.searchModel.schoolId;
			}

			$scope.isLoading = true;
			BiConfirmIncomeService.getConfirmInfos($scope.searchModel).then(
				function(result) {
					$scope.isLoading = false;
					$scope.statisticsModels = result.data.list;
					tableState.pagination.numberOfPages = result.numberOfPages;
					$scope.statisticsModelsNew = copySchoolIncome($scope.statisticsModels);
				});
		}

		/**
		 * 导出校区确认收入数据到excel。
		 */
		function exportSchoolIncome() {
			BiConfirmIncomeService.getAllList($scope.searchModel).then(
				function(result) {
					var statisticsExportTableStyle = {
						sheetid : '校区业绩统计',
						headers : true,
						caption : {
							title : '校区业绩-一对一确认收入明细表统计数据',
						},
						column : {
							style : 'font-size:14px; text-align:left;'
						},
						columns : [ {
							columnid : 'schoolName',
							title : '校区',
							width : '100px'
						}, {
							columnid : 'courseNum',
							title : '消课课时'
						}, {
							columnid : 'courseHoursCount',
							title : '消课时长'
						}, {
							columnid : 'confirmIncome',
							title : '确认收入'
						} ],
						row : {
							style : function(sheet, row, rowidx) {
								return 'background:' + (rowidx % 2 ? '#E1FFFF' : '#F0E68C');
							}
						},
						cells : {
							style : 'font-size:13px; text-align:left;'
						}
					};
					var stats = copySchoolIncome(result.data);
					alasql('SELECT * INTO XLS("校区业绩-一对一确认收入明细表统计数据.xls", ?) FROM ?', [ statisticsExportTableStyle, stats ]);
				}
			);
		}

		/**
		 * 导出区域、城市、事业部确认收入数据到excel。
		 */
		function exportSummary() {
			var summaryExportTableStyle = {
				sheetid : '校区业绩统计',
				headers : true,
				caption : {
					title : '校区业绩-一对一确认收入汇总表统计数据',
				},
				column : {
					style : 'font-size:14px; text-align:left;'
				},
				columns : [ {
					columnid : 'name',
					title : '校区',
					width : '100px'
				}, {
					columnid : 'courseNum',
					title : '消课课时'
				}, {
					columnid : 'courseHoursCount',
					title : '消课时长'
				}, {
					columnid : 'confirmIncome',
					title : '确认收入'
				} ],
				row : {
					style : function(sheet, row, rowidx) {
						return 'background:' + (rowidx % 2 ? '#E1FFFF' : '#F0E68C');
					}
				},
				cells : {
					style : 'font-size:13px; text-align:left;'
				}
			};
			$scope.exportData = [];
			$scope.exportData.push($scope.summaryModel);
			alasql('SELECT * INTO XLS("校区业绩-一对一确认收入汇总表统计数据.xls", ?) FROM ?', [ summaryExportTableStyle, $scope.exportData ]);
		}
        var timers = ''

		/**
		 * 这个函数将会被弹出的校区消课收入明细对话框调用 （partials/stu.detail/main/tpl/bi/order.info.html）.
		 * $scope.normalOrdersModelNew 被用于绑定被调用的数据。
		 */
		$scope.callServerNormalOrderTab = function callServerNormalOrderTab(tableState) {
            clearTimeout(timers)
			timers = setTimeout(function () {
                $scope.normalOrderTabTableState = tableState;
                if ($scope.detail) {
                    $scope.pagination = tableState.pagination;
                    $scope.start = $scope.pagination.start || 0;
                    $scope.number = $scope.pagination.number || 10;
                    $scope.searchModel.start = $scope.start;
                    $scope.searchModel.size = $scope.number;
                    $scope.searchModel.schoolId = $scope.detail.schoolId;
                    $scope.orderSearchModel = angular.copy($scope.searchModel);

                    BiConfirmIncomeService.getPage($scope.start, $scope.number, $scope.searchModel).then(
                        function(result) {
                            $scope.normalOrders = result.data;
                            tableState.pagination.numberOfPages = result.numberOfPages;

                            if ($scope.normalOrders.length === 0) {
                                $scope.normalOrdersModelNew = {};
                                return;
                            }

                            var arrayObj = new Array();
                            angular.forEach($scope.normalOrders, function(data, index, array) {
                                var obj = new Object();
                                obj = angular.copy(data);
                                obj.realIncomeAmount = Number(obj.realIncomeAmount.toFixed(2));
                                obj.actualPrice = Number(obj.actualPrice.toFixed(2));
                                obj.discountPrice = Number(obj.discountPrice.toFixed(2));
                                obj.courseNum = Number(obj.courseNum.toFixed(1));
                                obj.courseHoursCount = Number(obj.courseHoursCount.toFixed(1));
                                obj.confirmIncome = Number(obj.confirmIncome.toFixed(2));
                                obj.cumulativeCourseNum = Number(obj.cumulativeCourseNum.toFixed(1));
                                obj.cumulativeConfirmIncome = Number(obj.cumulativeConfirmIncome.toFixed(2));
                                obj.surplusAmount = Number(obj.surplusAmount.toFixed(2));
                                arrayObj[index] = obj;
                            });
                            $scope.normalOrdersModelNew = arrayObj;
                            $scope.normalOrders = {};
                        });
                    $scope.searchModel.schoolId = null;
                }
            },150)
		};
		/**
		 * 显示某个校区的详细消课收入记录列表。具体实现为弹出对话框然后被调用 callServerNormalOrderTab 函数。
		 */
		$scope.getDetail = function(detail) {
			$scope.detail = detail;
			var __detail = angular.copy(detail);
			var v = '?v=' + Date.now();
			$scope.detail.startTime = $("#startTime").val();
			$scope.detail.endTime = $("#endTime").val();
			$scope.stuTabs = StuDetail.init($scope,
                [ {
                    title : '校区确认收入明细',
                    clickFun : '',
                    url : 'partials/stu.detail/main/tpl/bi/order.info.html' + v
                } ])
			$scope.mtSrc = 'partials/stu.detail/main/index.html?v=1.0'
			$mtModal.moreModalHtml({
				scope : $scope,
				width : '880px',
				hasNext : function() {
				}
			})

		}

		/**
		 * 将校区详细消课收入记录列表导出到  excel。
		 */
		function exportOrderToExcel() {
			var exportOrderToTableStyle = {
				sheetid : '校区确认收入订单课程明细',
				headers : true,
				caption : {
					title : '校区业绩-一对一校区确认收入订单课程明细统计',
				},
				column : {
					style : 'font-size:14px; text-align:left;'
				},
				columns : [ {
					columnid : 'orderNo',
					title : '合同号',
					width : '100px'
				}, {
					columnid : 'studentName',
					title : '姓名'
				}, {
					columnid : 'orderType',
					title : '订单类型'
				}, {
					columnid : 'realIncomeAmount',
					title : '实收金额'
				}, {
					columnid : 'courseName',
					title : '产品名称'
				}, {
					columnid : 'actualPrice',
					title : '课时原单价'
				}, {
					columnid : 'discountPrice',
					title : '折后单价'
				}, {
					columnid : 'courseNum',
					title : '消课课时'
				}, {
					columnid : 'courseHoursCount',
					title : '消课时长'
				}, {
					columnid : 'confirmIncome',
					title : '确认收入'
				}, {
					columnid : 'cumulativeCourseNum',
					title : '累计消课课时'
				}, {
					columnid : 'cumulativeConfirmIncome',
					title : '累计确认收入'
				}, {
					columnid : 'surplusAmount',
					title : '剩余金额'
				}

				],
				row : {
					style : function(sheet, row, rowidx) {
						return 'background:'
								+ (rowidx % 2 ? '#E1FFFF'
										: '#F0E68C');
					}
				},
				cells : {
					style : 'font-size:13px; text-align:left;'
				}
			};

			var arrayObj = new Array();
			angular.forEach($scope.orderToModelsAll, function(data, index, array) {
				data.realIncomeAmount = Number(data.realIncomeAmount.toFixed(2));
				data.actualPrice = Number(data.actualPrice.toFixed(2));
				data.discountPrice = Number(data.discountPrice.toFixed(2));
				data.courseNum = Number(data.courseNum.toFixed(1));
				data.courseHoursCount = Number(data.courseHoursCount.toFixed(1));
				data.confirmIncome = Number(data.confirmIncome.toFixed(2));
				data.cumulativeCourseNum = Number(data.cumulativeCourseNum.toFixed(1));
				data.cumulativeConfirmIncome = Number(data.cumulativeConfirmIncome.toFixed(2));
				data.surplusAmount = Number(data.surplusAmount.toFixed(2));

				var type = data.orderType;
				if (type == 1) {
					data.orderType = '新签';
				} else if (type == 2) {
					data.orderType = '续费';
				} else if (type == 3) {
					data.orderType = '返课';
				} else if (type == 4) {
					data.orderType = '转课';
				} else if (type == 5) {
					data.orderType = '推荐';
				} else if (type == 6) {
					data.orderType = '试听';
				} else if (type == 8) {
					data.orderType = '赠课';
				}
			});
			alasql(
					'SELECT * INTO XLS("校区业绩-一对一校区确认收入订单课程明细统计.xls", ?) FROM ?',
					[ exportOrderToTableStyle,
							$scope.orderToModelsAll ]);
		}

		function getPageAll() {
			$scope.searchModel = $scope.orderSearchModel;
			BiConfirmIncomeService.getPageAllList($scope.searchModel).then(
				function(result) {
					$scope.orderToModelsAll = result.data.list;
					exportOrderToExcel();
				});
		}

		/**
		 * tab切换
		 */
		function getTabIndex(tab) {
			if (tab.title === '校区明细') {
				$scope.channelTab = '0';
			} else if (tab.title === '区域汇总') {
				$scope.channelTab = '1';
			}
		}


	} ]);
