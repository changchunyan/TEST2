'use strict';

/**
 * The biProductOrder controller.
 * @version 1.0
 */
angular.module('ywsApp').controller('BiProductOrderController', [
	'$scope','$sce', '$modal', '$filter', '$rootScope', 'SweetAlert', 'BiProductOrderService',
	function($scope,$sce, $modal, $filter, $rootScope, SweetAlert, BiProductOrderService) {
		// 初始化统计方法
		$scope.getStatisticsAll = getStatisticsAll;
		$scope.getSummary = getSummary;							// 汇总默认查询
		$scope.getSummaryByFilter = getSummaryByFilter; 		// 汇总条件报表
		$scope.getStatistics = getStatistics;                   // 明细默认查询明细 
		$scope.getDataByFilter = getDataByFilter;	            // 条件查询
		
	    $scope.exportToExcel = exportToExcel;
		$scope.resultList = {};  	//表格数据
		$scope.resultAllList = {};
		
		//*********************************************统计方法************************************/
		function getStatistics(tableState){
			$scope.statisticsTableState = tableState;
			$scope.isLoading = true;
            $scope.pagination = tableState.pagination;
            $scope.start = $scope.pagination.start || 0;
            $scope.number = $scope.pagination.number || 10;
            $scope.searchModel.start = $scope.start;
            $scope.searchModel.size = $scope.number;
			BiProductOrderService.getPageList($scope.searchModel).then(function (result) {
				$scope.resultAllList = result.data.list;
				tableState.pagination.numberOfPages = result.numberOfPages;
				$scope.isLoading = false;
			});
		}
		
		/**
		 * 根据列表状态获取统计数据
		 */
		function getSummary(){
			//设置表格状态和分页信息
			$scope.isLoading = true;
		    BiProductOrderService.getSummaryAllList($scope.searchModel)
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
        $scope.position_idFun = function () {
            return sessionStorage.getItem('com.youwin.yws.position_id')==79?1:0;
        }
        function _getDate() {
            $scope.since = getDateFormat($scope.modelStartTime)
            $scope.until = getDateFormat($scope.modelEndTime||$scope.modelStartTime)
        }
        function loadingPre() {
            /*$scope.iframeList = [
                {
                    title:'签单数',
                    url:$sce.trustAsResourceUrl(STATISTICS_2+'/superset/explore/table/'+STATISTICS_2_PARAM+'/?viz_type=pie&granularity_sqla=contract_start_date&time_grain_sqla=Time+Column&since='+$scope.since+'&until='+$scope.until+'&metrics=count&groupby=oct_name&limit=100&pie_label_type=key&donut=y&donut=false&show_legend=y&show_legend=false&labels_outside=y&labels_outside=false&having=&flt_col_0=&flt_op_0=in&flt_eq_0=&slice_id=&slice_name=&collapsed_fieldsets=&action=&userid=1&goto_dash=false&datasource_name=view_product&datasource_id=23&datasource_type=table&previous_viz_type=pie&rdo_save=saveas&new_slice_name=&add_to_dash=false&save_to_dashboard_id=&new_dashboard_name=&where=+order_status+!%3D5+and+belong_school_id+%3D'+sessionStorage.getItem('com.youwin.yws.school_id')),
                    top:'-1305px',
					height:'700px',
                    bgpy:'1300px !important'
                },
                {
                    title:'签单金额',
                    url:$sce.trustAsResourceUrl(STATISTICS_2+'/superset/explore/table/'+STATISTICS_2_PARAM+'/?viz_type=pie&granularity_sqla=contract_start_date&time_grain_sqla=Time+Column&since='+$scope.since+'&until='+$scope.until+'&metrics=sum__real_total_amount&groupby=oct_name&limit=100&pie_label_type=key&donut=y&donut=false&show_legend=y&show_legend=false&labels_outside=y&labels_outside=false&having=&flt_col_0=&flt_op_0=in&flt_eq_0=&slice_id=&slice_name=&collapsed_fieldsets=&action=&userid=1&goto_dash=false&datasource_name=view_product&datasource_id=23&datasource_type=table&previous_viz_type=pie&rdo_save=saveas&new_slice_name=&add_to_dash=false&save_to_dashboard_id=&new_dashboard_name=&where=+order_status+!%3D5+and+belong_school_id+%3D'+sessionStorage.getItem('com.youwin.yws.school_id')),
                    top:'-1305px',
					height:'700px',
                    bgpy:'1300px !important'
                },
                {
                    title:'平均单底',
                    url:$sce.trustAsResourceUrl(STATISTICS_2+'/superset/explore/table/'+STATISTICS_2_PARAM+'/?viz_type=dist_bar&granularity_sqla=contract_start_date&time_grain_sqla=Time+Column&since='+$scope.since+'&until='+$scope.until+'&groupby=oct_name&metrics=avg__real_total_amount&row_limit=50000&show_legend=y&show_legend=false&show_bar_value=false&bar_stacked=false&y_axis_format=.4r&bottom_margin=auto&x_axis_label=&y_axis_label=&reduce_x_ticks=false&contribution=false&show_controls=false&order_bars=false&having=&flt_col_0=&flt_op_0=in&flt_eq_0=&slice_id=&slice_name=&collapsed_fieldsets=&action=&userid=1&goto_dash=false&datasource_name=view_product&datasource_id=23&datasource_type=table&previous_viz_type=dist_bar&rdo_save=saveas&new_slice_name=&add_to_dash=false&save_to_dashboard_id=&new_dashboard_name=&where=+order_status+!%3D5+and+belong_school_id+%3D'+sessionStorage.getItem('com.youwin.yws.school_id')),
                    top:'-1495px',
                    height:'700px',
                    bgpy:'1490px !important'
                }
            ]*/
        }
		/**
		 * 查询汇总的数据，根据条件
		 */
		function getSummaryByFilter(){
			$scope.isLoading = true;
			BiProductOrderService.getSummaryAllList($scope.searchModel)
				.then(function (result) {
					$scope.resultAllList = result.data.resultList;
	                $scope.entityTotal = result.data.entityTotal;
                    $scope.isLoading = false;
                    if($scope.position_idFun()){
                        _getDate()
                        loadingPre()
                    }
			});
		}
		
		/**
		 * 根据筛选条件获取统计数据
		 */
		function getDataByFilter(){		
			if($scope.mingxiShow){
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
				BiProductOrderService.getPageList($scope.searchModel)
				.then(function (result) {
					$scope.resultAllList = result.data.list;
					$scope.statisticsTableState.pagination.numberOfPages = result.numberOfPages;
					$scope.isLoading = false;
					//再次调用查询全部，用于导出
	                if($scope.position_idFun()){
	                    _getDate()
	                    loadingPre()
	                }
				});
			}else{
				getSummaryByFilter();
			}
		}

		/**
		 * 查询所有统计数据
		 */
		function getStatisticsAll() {
			BiProductOrderService.getAllList($scope.searchModel)
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
				        sheetid: '产品统计',
				        headers: true,
				        caption: {
				        	title:'产品统计报表',
				        },
				        column: {
				        	style:'font-size:16px; text-align:left;'
				        },
				        columns: [
				          {
				        	  columnid:'productName',
				        	  title: '产品类型'
				          },
				          {
				        	  columnid:'orderCount',
				        	  title: '签单数'
				          },
				      	  {
				        	  columnid:'orderAllPrice',
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
				        sheetid: '产品统计',
				        headers: true,
				        caption: {
				        	title:'产品统计报表',
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
				        	  columnid:'orderCountAll',  
				        	  title:'总计-签单量'
				          },
				          {
				        	  columnid:'orderPriceAll',  
				        	  title:'总计-签单金额'
				          },
				      	  {
				        	  columnid:'commonCourseOrderCount',
				        	  title:'常规产品-签单量'
				      	  },
				      	  {
				      		 columnid:'commonCourseOrderPrice',
				      		 title:'常规产品-签单金额'
				      	  },
				      	  {
				        	  columnid:'fullTimeOrderCount',
				        	  title:'全日制-签单量'
				      	  },
				      	  {
				      		 columnid:'fullTimeOrderPrice',
				      		 title:'全日制-签单金额'
				      	  },
				      	  {
				        	  columnid:'smallCourseOrderCount',
				        	  title:'小班课程-签单量'
				      	  },
				      	  {
				      		 columnid:'smallCourseOrderPrice',
				      		 title:'小班课程-签单金额'
				      	  },
				      	  {
				        	  columnid:'lineProductOrderCount',
				        	  title:'线上产品-签单量'
				      	  },
				      	  {
				      		 columnid:'lineProductOrderPrice',
				      		 title:'线上产品-签单金额'
				      	  },
				      	  {
				        	  columnid:'joinSchoolOrderCount',
				        	  title:'加盟校区常规课程-签单量'
				      	  },
				      	  {
				      		 columnid:'joinSchoolOrderPrice',
				      		 title:'加盟校区常规课程-签单金额'
				      	  },
				      	  {
				        	  columnid:'brandCourseOrderCount',
				        	  title:'品牌活动-签单量'
				      	  },
				      	  {
				      		 columnid:'brandCourseOrderPrice',
				      		 title:'品牌活动-签单金额'
				      	  },
				      	  {
				        	  columnid:'freeCourseOrderCount',
				        	  title:'免费学课程-签单量'
				      	  },
				      	  {
				      		 columnid:'freeCourseOrderPrice',
				      		 title:'免费学课程-签单金额'
				      	  },
				      	  {
				        	  columnid:'schoolYearSynOrderCount',
				        	  title:'学年同步课程-签单量'
				      	  },
				      	  {
				      		 columnid:'schoolYearSynOrderPrice',
				      		 title:'学年同步课程-签单金额'
				      	  },
				      	  {
				        	  columnid:'experienceOrderCount',
				        	  title:'线上体验学-签单量'
				      	  },
				      	  {
				      		 columnid:'experienceOrderPrice',
				      		 title:'线上体验学-签单金额'
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
				BiProductOrderService.getAllList($scope.searchModel)
					.then(function (result) {
						$scope.resultAllListNoPage = result.data;
						alasql('SELECT * INTO XLS("产品明细表.xls", ?) FROM ?', [exportTableStyle, $scope.resultAllListNoPage]);	
				});
						 
			}else if(type == 2){
				 alasql('SELECT * INTO XLS("产品汇总表.xls", ?) FROM ?', [exportTableStyle, $scope.resultAllList]);
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