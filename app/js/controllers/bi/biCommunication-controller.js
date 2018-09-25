'use strict';

/**
 * The biCommunication controller.
 * @version 1.0
 */
angular.module('ywsApp').controller('BiCommunicationController', [
	'$scope', '$modal', '$filter', '$rootScope', 'SweetAlert', 'BiCommunicationService', 
	'DepartmentService', 'AuthenticationService', 'localStorageService', 'CommonService', 'BiBaseService',
	function($scope, $modal, $filter, $rootScope, SweetAlert, BiCommunicationService, 
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
		$scope.getStatisticsTabIndex = getStatisticsTabIndex;
		/*
		 * 汇总方法
		 */
		$scope.getSummary = getSummary;
		$scope.exportSummaryToExcel = exportSummaryToExcel;
		$scope.getSummaryTabIndex = getSummaryTabIndex;
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
		 * 获取页面当前tab页
		 */
		function getTabIndex(obj){
			if(obj.title==='数据明细表'){
				$scope.channelTab='1';
			}else if(obj.title==='数据汇总表'){
				$scope.channelTab='2';
			}
		}
		function getStatisticsTabIndex(tab){
			$scope.statisticsActiveTab = tab;
		}
		function getSummaryTabIndex(tab){
			$scope.summaryActiveTab = tab;
		}
		/**
		 * 统计和汇总tab页
		 */
		$scope.showStatisticsTabs = [
			{id:2, title:'营销类', template:'partials/bi/biCommunication/biCommunication.statistics.market.html'},
			{id:1, title:'运营类', template:'partials/bi/biCommunication/biCommunication.statistics.operation.html'}
		];
		$scope.showSummaryTabs = [
	        {id:2, title:'营销类', template:'partials/bi/biCommunication/biCommunication.summary.market.html'},
	        {id:1, title:'运营类', template:'partials/bi/biCommunication/biCommunication.summary.operation.html'}
        ];
		/**
		 * 秒转时分秒
		 */
		function formatSeconds(value) { 
			var theTime = parseInt(value);// 秒 
			var theTime1 = 0;// 分 
			var theTime2 = 0;// 小时 
			if(theTime > 60) { 
				theTime1 = parseInt(theTime/60); 
				theTime = parseInt(theTime%60); 
				if(theTime1 > 60) { 
					theTime2 = parseInt(theTime1/60); 
					theTime1 = parseInt(theTime1%60); 
				} 
			} 
			var result = ""+parseInt(theTime)+"秒"; 
			if(theTime1 > 0) { 
				result = ""+parseInt(theTime1)+"分"+result; 
			} 
			if(theTime2 > 0) { 
				result = ""+parseInt(theTime2)+"小时"+result; 
			} 
			return result; 
		}
		/*
		 * 计算平均时长
		 */
		function calculateAverageTimeCount(obj){
			if (obj == undefined || obj.length == 0){
				obj.communicationTimeAverage = 0;
			}else{
				if(obj.communicationSuccessCount == 0){
					obj.communicationTimeAverage = 0;
				}else{
					obj.communicationTimeAverage = obj.communicationTimeCount/obj.communicationSuccessCount;
				}
			}
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
            
            if ($scope.statisticsActiveTab != null) {
            	$scope.searchModel.statModel = $scope.statisticsActiveTab;
            }
            
            BiCommunicationService.getPageList($scope.searchModel)
	        	.then(function (result) {
	                $scope.statisticsModels = result.data.list;
	                angular.forEach($scope.statisticsModels, function(data, index){
						data = calculateAverageTimeCount(data);
						data.communicationTimeCount = formatSeconds(data.communicationTimeCount);
						data.communicationTimeAverage = formatSeconds(data.communicationTimeAverage);
						data.communicationSuccessRatio = '0.00%';
						if(data.communicationCount>0){
							data.communicationSuccessRatio = data.communicationSuccessCount/data.communicationCount;
							data.communicationSuccessRatio = '' + (data.communicationSuccessRatio*100).toFixed(2) + '%';
						}
						data.leadsExceptionRatio = '0.00%';
						if(data.statusNum>0){
							data.leadsExceptionRatio = data.statusNum/data.communicationCount;
							data.leadsExceptionRatio = '' + (data.leadsExceptionRatio*100).toFixed(2) + '%';
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
			if($scope.channelTab==='1'){
				//设置表格状态和分页信息
				$scope.isLoading = true;
				$scope.statisticsTableState.pagination.start=0;
	            $scope.pagination = $scope.statisticsTableState.pagination;
				$scope.start = $scope.pagination.start || 0;
				$scope.number = $scope.pagination.number || 10;
				$scope.searchModel.start = $scope.start;
		        $scope.searchModel.size = $scope.number;
		        
		        if ($scope.statisticsActiveTab != null) {
	            	$scope.searchModel.statModel = $scope.statisticsActiveTab;
	            }
		        
		        BiCommunicationService.getPageList($scope.searchModel)
		        	.then(function (result) {
		                $scope.statisticsModels = result.data.list;
		                angular.forEach($scope.statisticsModels, function(data, index){
							data = calculateAverageTimeCount(data);
							data.communicationTimeCount = formatSeconds(data.communicationTimeCount);
							data.communicationTimeAverage = formatSeconds(data.communicationTimeAverage);
							data.communicationSuccessRatio = '0.00%';
							if(data.communicationCount>0){
								data.communicationSuccessRatio = data.communicationSuccessCount/data.communicationCount;
								data.communicationSuccessRatio = '' + (data.communicationSuccessRatio*100).toFixed(2) + '%';
							}
							data.leadsExceptionRatio = '0.00%';
							if(data.statusNum>0){
								data.leadsExceptionRatio = data.statusNum/data.communicationCount;
								data.leadsExceptionRatio = '' + (data.leadsExceptionRatio*100).toFixed(2) + '%';
							}
						});
		                $scope.statisticsTableState.pagination.numberOfPages = result.numberOfPages;
		                $scope.isLoading = false;
		            });
			}else if($scope.channelTab==='2'){
				getSummary();
			}
	        BiBaseService.setTimeRange($scope.$parent);
		}
		/**
		 * 查询所有统计数据
		 */
		function getStatisticsAll() {
			if ($scope.statisticsActiveTab != null) {
            	$scope.searchModel.statModel = $scope.statisticsActiveTab;
            }
			
			BiCommunicationService.getAllList($scope.searchModel)
				.then(function (result) {
					$scope.statisticsModelsAll = result.data;
					angular.forEach($scope.statisticsModelsAll, function(data, index){
						data = calculateAverageTimeCount(data);
						data.communicationTimeCountFormmat = formatSeconds(data.communicationTimeCount);
						data.communicationTimeAverage = formatSeconds(data.communicationTimeAverage);
						data.communicationSuccessRatio = '0.00%';
						if(data.communicationCount>0){
							data.communicationSuccessRatio = data.communicationSuccessCount/data.communicationCount;
							data.communicationSuccessRatio = '' + (data.communicationSuccessRatio*100).toFixed(2) + '%';
						}
						data.leadsExceptionRatio = '0.00%';
						if(data.statusNum!=undefined && data.statusNum>0){
							data.leadsExceptionRatio = data.statusNum/data.communicationCount;
							data.leadsExceptionRatio = '' + (data.leadsExceptionRatio*100).toFixed(2) + '%';
						}
					});
					exportStatisticsToExcel();
				});
		}
		/**
		 * 导出excel
		 */
		function exportStatisticsToExcel(){
			var statisticsExportTableStyle;
			if ($scope.isSchoolUser == true){
				statisticsExportTableStyle = {
						sheetid: '外呼统计',
						headers: true,
						caption: {
							title:'外呼-统计数据',
						},
						column: {style:'font-size:14px; text-align:left;'},
						columns: [{columnid:'userName',title:'员工'},
						          {columnid:'positionName',title:'岗位信息'},
						          {columnid:'schoolName',title:'校区',width:'100px'},
						          {columnid:'communicationCount',title: '外呼量'},
						          {columnid:'communicationSuccessCount',title: '接听量'},
						          {columnid:'communicationSuccessRatio',title: '接听率'},
						          {columnid:'statusNum',title: 'leads异常量'},
						          {columnid:'leadsExceptionRatio',title: 'leads异常率'},
						          {columnid:'communicationTimeCountFormmat',title: '接听总时长'},
						          {columnid:'communicationTimeAverage',title: '接听平均时长'},
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
			}else{
				statisticsExportTableStyle = {
						sheetid: '外呼统计',
						headers: true,
						caption: {
							title:'外呼-统计数据',
						},
						column: {style:'font-size:14px; text-align:left;'},
						columns: [{columnid:'schoolName',title:'校区',width:'100px'},
						          {columnid:'communicationCount',title: '外呼量'},
						          {columnid:'communicationSuccessCount',title: '接听量'},
						          {columnid:'communicationSuccessRatio',title: '接听率'},
						          {columnid:'statusNum',title: 'leads异常量'},
						          {columnid:'leadsExceptionRatio',title: 'leads异常率'},
						          {columnid:'communicationTimeCountFormmat',title: '接听总时长'},
						          {columnid:'communicationTimeAverage',title: '接听平均时长'},
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
			}
		    alasql('SELECT * INTO XLS("外呼-统计数据.xls", ?) FROM ?', [statisticsExportTableStyle, $scope.statisticsModelsAll]);
		}
		
		/***                                                                                        ***/
		/**********************************************汇总部分*****************************************/
		/***                                                                                        ***/
		/**
		 * 得到汇总的数据
		 */
		function getSummary(){
			if ($scope.statisticsActiveTab != null) {
            	$scope.searchModel.statModel = $scope.statisticsActiveTab;
            }
			
			BiCommunicationService.getAllList($scope.searchModel)
				.then(function (result) {
					$scope.statisticsModelsAll = result.data;
					angular.forEach($scope.statisticsModelsAll, function(data, index){
						data = calculateAverageTimeCount(data);
						data.communicationTimeCountFormmat = formatSeconds(data.communicationTimeCount);
						data.communicationTimeAverage = formatSeconds(data.communicationTimeAverage);
					});
					var obj = new Object();
					obj.communicationCount = 0;
					obj.communicationSuccessCount = 0;
					obj.communicationSuccessRatio = '0.00%';
					obj.communicationTimeCount = 0;
					obj.statusNum = 0;
					obj.leadsExceptionRatio = '0.00%';
					
					if($scope.statisticsActiveTab != $scope.summaryActiveTab){
						$scope.searchModel.statModel = $scope.summaryActiveTab;
						
						BiCommunicationService.getAllList($scope.searchModel)
							.then(function (result) {
								var summaryResult = result.data;
								angular.forEach(summaryResult, function(data, index, array) {
									obj.communicationCount = obj.communicationCount + data.communicationCount;
									obj.communicationSuccessCount = obj.communicationSuccessCount + data.communicationSuccessCount;
									obj.communicationTimeCount = obj.communicationTimeCount + data.communicationTimeCount;
									obj.statusNum = obj.statusNum + data.statusNum;
								});
								if(obj.communicationCount>0){
									obj.communicationSuccessRatio = obj.communicationSuccessCount/obj.communicationCount;
									obj.communicationSuccessRatio = '' + (obj.communicationSuccessRatio*100).toFixed(2) + '%';
								}
								if(obj.statusNum>0){
									obj.leadsExceptionRatio=obj.statusNum/obj.communicationCount;
									obj.leadsExceptionRatio = '' + (obj.leadsExceptionRatio*100).toFixed(2) + '%';
								}
								obj = calculateAverageTimeCount(obj);
								obj.communicationTimeCount = formatSeconds(obj.communicationTimeCount);
								obj.communicationTimeAverage = formatSeconds(obj.communicationTimeAverage);
							});
					}else{
						angular.forEach($scope.statisticsModelsAll, function(data, index, array) {
							obj.communicationCount = obj.communicationCount + data.communicationCount;
							obj.communicationSuccessCount = obj.communicationSuccessCount + data.communicationSuccessCount;
							obj.communicationTimeCount = obj.communicationTimeCount + data.communicationTimeCount;
							obj.statusNum = obj.statusNum + data.statusNum;
						});
						if(obj.communicationCount>0){
							obj.communicationSuccessRatio = obj.communicationSuccessCount/obj.communicationCount;
							obj.communicationSuccessRatio = '' + (obj.communicationSuccessRatio*100).toFixed(2) + '%';
						}
						if(obj.statusNum>0){
							obj.leadsExceptionRatio=obj.statusNum/obj.communicationCount;
							obj.leadsExceptionRatio = '' + (obj.leadsExceptionRatio*100).toFixed(2) + '%';
						}
						obj = calculateAverageTimeCount(obj);
						obj.communicationTimeCount = formatSeconds(obj.communicationTimeCount);
						obj.communicationTimeAverage = formatSeconds(obj.communicationTimeAverage);
					}
					$scope.summaryModel = obj;
					$scope.summaryModel.name=$scope.selectdDepartment.name;
				});
		}
		/**
		 * 导出excel
		 */
		function exportSummaryToExcel(){
			var summaryExportTableStyle = {
		        sheetid: '外呼汇总',
		        headers: true,
		        caption: {
		        	title:'外呼-汇总数据',
		        },
		        column: {style:'font-size:14px; text-align:left;'},
		        columns: [{columnid:'name',title: '区域/校区',width: '100px'},
				          {columnid:'communicationCount',title: '外呼量'},
				          {columnid:'communicationSuccessCount',title: '接听量'},
				          {columnid:'communicationSuccessRatio',title: '接听率'},
				          {columnid:'statusNum',title: 'leads异常量'},
				          {columnid:'leadsExceptionRatio',title: 'leads异常率'},
				          {columnid:'communicationTimeCount',title: '接听总时长'},
				          {columnid:'communicationTimeAverage',title: '接听平均时长'},
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
		    alasql('SELECT * INTO XLS("外呼-汇总数据.xls", ?) FROM ?', [summaryExportTableStyle, $scope.exportData]);
		}
	}
]);