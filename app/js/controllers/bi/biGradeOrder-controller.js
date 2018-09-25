'use strict';

/**
 * The biGradeOrder controller.
 * @version 1.0
 */
angular.module('ywsApp').controller('BiGradeOrderController', [
	'$scope','$sce', '$modal', '$filter', '$rootScope', 'SweetAlert', 'BiGradeOrderService', 'DepartmentService',
	'AuthenticationService','localStorageService','CommonService',
	function($scope,$sce, $modal, $filter, $rootScope, SweetAlert, BiGradeOrderService, DepartmentService,
			AuthenticationService,localStorageService,CommonService) {

		// 初始化统计方法
		$scope.getSummary = getSummary;							// 默认查询
		$scope.getDataByFilter = getDataByFilter; 		        // 汇总报表
		$scope.getStatistics = getStatistics;                   // 默认查询明细
		$scope.getStatisticsByFilter = getStatisticsByFilter;	// 统计报表
		$scope.getStatisticsAll = getStatisticsAll;
	    $scope.exportToExcel = exportToExcel;

        // 参数设置
		$scope.resultList = {};

		//*********************************************统计方法************************************/

		function getStatistics(tableState){
			$scope.statisticsTableState = tableState;
			$scope.isLoading = true;
            $scope.pagination = tableState.pagination;
            $scope.start = $scope.pagination.start || 0;
            $scope.number = $scope.pagination.number || 10;
            $scope.searchModel.start = $scope.start;
            $scope.searchModel.size = $scope.number;
			BiGradeOrderService.getPageList($scope.searchModel).then(function (result) {
				$scope.resultAllList = result.data.list;
				tableState.pagination.numberOfPages = result.numberOfPages;
				$scope.isLoading = false;
			});
		}
        $scope.position_idFun = function () {
            return sessionStorage.getItem('com.youwin.yws.position_id')==79?1:0;
        }

		/**
		 * 根据列表状态获取统计数据
		 */
		function getSummary(){
			//设置表格状态和分页信息
			$scope.isLoading = true;
			BiGradeOrderService.getSummaryAllList($scope.searchModel)
            	.then(function (result) {
                    $scope.resultAllList = result.data.resultList;
                    $scope.entityTotal = result.data.entityTotal;
                    $scope.isLoading = false;
                }
            );
            if($scope.position_idFun()){
                _getDate()
                loadingPre()
            }
		}
        function _getDate() {
            $scope.since = getDateFormat($scope.modelStartTime)
            $scope.until = getDateFormat($scope.modelEndTime||$scope.modelStartTime)
        }
        function loadingPre() {
            $scope.iframeList = [
                {
                    title:'年级签单分布',
                    url:$sce.trustAsResourceUrl(STATISTICS_1+'/superset/explore/table/'+STATISTICS_1_PARAM+'/?viz_type=pie&granularity_sqla=contract_start_date&time_grain_sqla=Time+Column&since='+$scope.since+'&until='+$scope.until+'&metrics=count&groupby=grade_name&limit=50&pie_label_type=key&donut=y&donut=false&show_legend=y&show_legend=false&labels_outside=y&labels_outside=false&having=&flt_col_0=&flt_op_0=in&flt_eq_0=&slice_id=&slice_name=&collapsed_fieldsets=&action=&userid=1&goto_dash=false&datasource_name=view_students&datasource_id=17&datasource_type=table&previous_viz_type=pie&rdo_save=saveas&new_slice_name=&add_to_dash=false&save_to_dashboard_id=&new_dashboard_name=&where=is_deleted%3D0+++and+order_category+in+(1%2C2%2C3)++and+order_type+%3D1+and+order_category+%3D+1+and+belong_school_id+%3D'+sessionStorage.getItem('com.youwin.yws.school_id')),
                    top:'-1305px',
					bgpy:'1300px !important'
                },
                {
                    title:'年级金额分布',
                    url:$sce.trustAsResourceUrl(STATISTICS_1+'/superset/explore/table/'+STATISTICS_1_PARAM+'/?viz_type=pie&granularity_sqla=contract_start_date&time_grain_sqla=Time+Column&since='+$scope.since+'&until='+$scope.until+'&metrics=sum__real_total_amount&groupby=grade_name&limit=50&pie_label_type=key&donut=y&donut=false&show_legend=y&show_legend=false&labels_outside=y&labels_outside=false&having=&flt_col_0=&flt_op_0=in&flt_eq_0=&slice_id=&slice_name=&collapsed_fieldsets=&action=&userid=1&goto_dash=false&datasource_name=view_students&datasource_id=17&datasource_type=table&previous_viz_type=pie&rdo_save=saveas&new_slice_name=&add_to_dash=false&save_to_dashboard_id=&new_dashboard_name=&where=is_deleted%3D0+++and+order_category+in+(1%2C2%2C3)++and+order_type+%3D1+and+order_category+%3D+1+and+belong_school_id+%3D'+sessionStorage.getItem('com.youwin.yws.school_id')),
                    top:'-1305px',
                    bgpy:'1300px !important'
                }
            ]
        }
		/**
		 * 查询汇总的数据，根据条件
		 */
		function getDataByFilter(){
			//调用汇总报表查询方法
			if($scope.huizongShow){
				BiGradeOrderService.getSummaryAllList($scope.searchModel)
					.then(function (result) {
						$scope.resultAllList = result.data.resultList;
		                $scope.entityTotal = result.data.entityTotal;
	                    $scope.isLoading = false;
	                    if($scope.position_idFun()){
	                        _getDate()
	                        loadingPre()
	                    }
				});
			}else if($scope.mingxiShow){
				getStatisticsByFilter();
			}
		}

		/**
		 * 根据筛选条件获取统计数据
		 */
		function getStatisticsByFilter(){
			//设置表格状态和分页信息
			$scope.isLoading = true;
			if($scope.statisticsTableState == undefined){
				$scope.start=0;
				$scope.number=10;
			}else{
				$scope.statisticsTableState.pagination.start=0;
				$scope.pagination=$scope.statisticsTableState.pagination;
				$scope.start=$scope.pagination.start || 0;
				$scope.number=$scope.pagination.number || 10;
			}
			$scope.searchModel.start = $scope.start;
			$scope.searchModel.size = $scope.number;
			BiGradeOrderService.getPageList($scope.searchModel)
			.then(function (result) {
				$scope.resultAllList = result.data.list;
				$scope.statisticsTableState.pagination.numberOfPages = result.numberOfPages;
				$scope.isLoading = false;
                if($scope.position_idFun()){
                    _getDate()
                    loadingPre()
                }
			});

		}

		/**
		 * 查询所有统计数据
		 */
		function getStatisticsAll() {
			BiGradeOrderService.getAllList($scope.searchModel)
				.then(function (result) {
					$scope.resultAllListNoPage = result.data;
			});
		}

		/**
		 * 导出excel文件 type 1:统计 2：汇总
		 */
		function exportToExcel(type){
			var exportTableStyle;
			if(type == 2){
				exportTableStyle = {
			        sheetid: '年级统计',
			        headers: true,
			        caption: {
			        	title:'年级统计报表',
			        },
			        column: {
			        	style:'font-size:16px; text-align:left;'
			        },
			        columns: [
			          {
			        	  columnid:'gradeType',
			        	  title: '年级段'
			          },
			          {
			        	  columnid:'orderCount',
			        	  title: '签单数'
			          },
			      	  {
			        	  columnid:'orderPaymentAmount',
			        	  title:'签单金额'
			      	  },
			      	  {
			      		 columnid:'avgOrderPrice',
			      		 title:'平均单底'
			      	  }
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
			}else if(type == 1){
				exportTableStyle = {
				        sheetid: '年级统计',
				        headers: true,
				        caption: {
				        	title:'年级统计报表',
				        },
				        column: {
				        	style:'font-size:16px; text-align:left;'
				        },
				        columns: [
				          {
				        	  columnid:'schoolName',
				        	  title: '校区'
				          },
				          {
				        	  columnid:'totalOrderCount',
				        	  title: '总计-签单数'
				          },
				          {
				        	  columnid:'totalOrderPaymentAmount',
				        	  title: '总计-签单金额'
				          },
				          {
				        	  columnid:'primarySchoolFrom1To3OrderCount',
				        	  title: '小一-小三-签单数'
				          },
				          {
				        	  columnid:'primarySchoolFrom1To3OrderPaymentAmount',
				        	  title: '小一-小三-签单金额'
				          },
				          {
				        	  columnid:'primarySchoolFrom4To6OrderCount',
				        	  title: '小四-小六-签单数'
				          },
				          {
				        	  columnid:'primarySchoolFrom4To6OrderPaymentAmount',
				        	  title: '小四-小六-签单金额'
				          },
				          {
				        	  columnid:'middleSchoolOneOrderCount',
				        	  title: '初一-签单数'
				          },
				          {
				        	  columnid:'middleSchoolOneOrderPaymentAmount',
				        	  title: '初一-签单金额'
				          },
				          {
				        	  columnid:'middleSchoolTwoOrderCount',
				        	  title: '初二-签单数'
				          },
				          {
				        	  columnid:'middleSchoolTwoOrderPaymentAmount',
				        	  title: '初二-签单金额'
				          },
				          {
				        	  columnid:'middleSchoolThreeOrderCount',
				        	  title: '初三-签单数'
				          },
				          {
				        	  columnid:'middleSchoolThreeOrderPaymentAmount',
				        	  title: '初三-签单金额'
				          },
				          {
				        	  columnid:'highSchoolOneOrderCount',
				        	  title: '高一-签单数'
				          },
				          {
				        	  columnid:'highSchoolOneOrderPaymentAmount',
				        	  title: '高一-签单金额'
				          },
				          {
				        	  columnid:'highSchoolTwoOrderCount',
				        	  title: '高二-签单数'
				          },
				          {
				        	  columnid:'highSchoolTwoOrderPaymentAmount',
				        	  title: '高二-签单金额'
				          },
				          {
				        	  columnid:'highSchoolThreeOrderCount',
				        	  title: '高三-签单数'
				          },
				          {
				        	  columnid:'highSchoolThreeOrderPaymentAmount',
				        	  title: '高三-签单金额'
				          },
				          {
				        	  columnid:'smallSchoolOrderCount',
				        	  title: '小学-签单数'
				          },
				          {
				        	  columnid:'smallSchoolOrderPrice',
				        	  title: '小学-签单金额'
				          },
				          {
				        	  columnid:'middleSchoolOrderCount',
				        	  title: '初中-签单数'
				          },
				          {
				        	  columnid:'middleSchoolOrderPrice',
				        	  title: '初中-签单金额'
				          },
				          {
				        	  columnid:'highSchoolOrderCount',
				        	  title: '高中-签单数'
				          },
				          {
				        	  columnid:'highchoolOrderPrice',
				        	  title: '高中-签单金额'
				          }
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

			// 1 代表统计报表 2 代表汇总报表
			if(type == 1){
				BiGradeOrderService.getAllList($scope.searchModel)
					.then(function (result) {
						$scope.resultAllListNoPage = result.data;
						alasql('SELECT * INTO XLS("年级统计明细表.xls", ?) FROM ?', [exportTableStyle, $scope.resultAllListNoPage]);
				});
			}else if(type == 2){
				 alasql('SELECT * INTO XLS("年级统计汇总表.xls", ?) FROM ?', [exportTableStyle, $scope.resultAllList]);
			}
		}

		// 用于页面的数据明细、数据汇总的切换
		$scope.showTab = function(type){
			if(1 == type){
				$scope.huizongShow = true;
				$scope.mingxiShow = false;
			}else{
				$scope.huizongShow = false;
				$scope.mingxiShow = true;
			}
		};
		/**
		 * 初始化
		 */
		(function init(){
			$scope.huizongShow = true;
			$scope.mingxiShow = false;
		})();
	}
]);
