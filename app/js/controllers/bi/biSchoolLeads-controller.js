'use strict';

/**
 * The biSchoolLeads controller.
 * @version 1.0
 */
angular.module('ywsApp').controller('BiSchoolLeadsController', [
	'$scope','$sce', '$modal', '$filter', '$rootScope', 'SweetAlert', 'BiSchoolLeadsService',
	'AuthenticationService', 'localStorageService', 'BiBaseService',
	function($scope,$sce, $modal, $filter, $rootScope, SweetAlert, BiSchoolLeadsService,
			AuthenticationService, localStorageService, BiBaseService) {
		//方法声明
		$scope.getTabIndex = getTabIndex;
		$scope.exchangeTable = exchangeTable;
		$scope.getStatistics = getStatistics;
		$scope.getSummary = getSummary;
		$scope.getDataByFilter = getDataByFilter;
		$scope.exportAll = exportAll;

		//参数
		$scope.currentTable = '1'; //默认是明细表
		$scope.commonHtmlUrl = 'partials/bi/biSchoolLeads/biSchoolLeads.common.html?'+new Date().getTime();
		$scope.tableHtmlUrl = 'partials/bi/biSchoolLeads/biSchoolLeads.table.html?'+new Date().getTime();

		//方法实现
		/**
		 * 获取页面当前tab页
		 */
		function getTabIndex(obj){
			if(obj.title==='各校区客户信息统计'){
				$scope.currentTable='1';
			}else if(obj.title==='区域客户信息汇总'){
				$scope.currentTable='2';
			}
		}
		/**
		 * 切换汇总和明细
		 */
		function exchangeTable(obj){
			if($scope.currentTable === '1'){
				$scope.currentTable = '2';
			}else{
				$scope.currentTable = '1';
			}
		}
		/**
		 * 获取明细数据
		 */
		function getStatistics(tableState){
			//设置表格状态和分页信息
			$scope.statisticsTableState = tableState;
            $scope.pagination = tableState.pagination;
            $scope.start = $scope.pagination.start || 0;
            $scope.number = $scope.pagination.number || 10;
            $scope.searchModel.start = $scope.start;
            $scope.searchModel.size = $scope.number;
            //查询请求
            var promise=BiSchoolLeadsService.getPageList($scope.searchModel);
	        promise.then(function (result) {
	        	$scope.statisticsList = result.data.list;
	        	tableState.pagination.numberOfPages = result.numberOfPages;
                if($scope.position_idFun()){
                    _getDate()
                    // iframeLoading()
                    loadingPre()
                }
	        });
		}
        $scope.position_idFun = function () {
            return sessionStorage.getItem('com.youwin.yws.position_id')==79?1:0;
        }
		/**
		 * 获取汇总数据
		 */
		function getSummary(tableState){
			//设置表格状态和分页信息
			$scope.summaryTableState = tableState;
            $scope.pagination = tableState.pagination;
            $scope.start = $scope.pagination.start || 0;
            $scope.number = $scope.pagination.number || 10;
            $scope.searchModel.start = $scope.start;
            $scope.searchModel.size = $scope.number;
            //查询请求
            var promise=BiSchoolLeadsService.getSummary($scope.searchModel);
	        promise.then(function (result) {
	        	$scope.summaryResult = result.data;
                if($scope.position_idFun()){
                    _getDate()
                    // iframeLoading()
                    loadingPre()
                }
	        });
		}
        function _getDate() {
            $scope.since = getDateFormat($scope.modelStartTime)
            $scope.until = getDateFormat($scope.modelEndTime||$scope.modelStartTime)
        }
        function loadingPre() {
            if(angular.element('#period').val()==0){
                $scope.iframeList.length = 0
            }else{
                $scope.iframeList = [
                    {
                        title:'校区客户状态分布',
                        url:$sce.trustAsResourceUrl(STATISTICS_1+'/superset/explore/table/'+STATISTICS_SCHOOL_PARAM+'/?viz_type=pie&granularity_sqla=cs_create_at&time_grain_sqla=Time+Column&since='+$scope.since+'&until='+$scope.until+'&metrics=count&groupby=cdsname&limit=50&pie_label_type=key&donut=y&donut=false&show_legend=y&show_legend=false&labels_outside=y&labels_outside=false&having=&flt_col_0=&flt_op_0=in&flt_eq_0=&slice_id=&slice_name=&collapsed_fieldsets=&action=&userid=1&goto_dash=false&datasource_name=view_customer&datasource_id=25&datasource_type=table&previous_viz_type=pie&rdo_save=saveas&new_slice_name=&add_to_dash=false&save_to_dashboard_id=&new_dashboard_name=&where=school_id+%3D'+sessionStorage.getItem('com.youwin.yws.school_id')),
                        top:'-1305px',
                        height:'700px',
                        bgpy:'1300px !important'
                    },
                    {
                        title:'校区年级分布',
                        url:$sce.trustAsResourceUrl(STATISTICS_1+'/superset/explore/table/'+STATISTICS_SCHOOL_PARAM+'/?viz_type=pie&granularity_sqla=cs_create_at&time_grain_sqla=Time+Column&since='+$scope.since+'&until='+$scope.until+'&metrics=count&groupby=cs_stage&limit=50&pie_label_type=key&donut=y&donut=false&show_legend=y&show_legend=false&labels_outside=y&labels_outside=false&having=&flt_col_0=&flt_op_0=in&flt_eq_0=&slice_id=&slice_name=&collapsed_fieldsets=&action=&userid=1&goto_dash=false&datasource_name=view_customer&datasource_id=25&datasource_type=table&previous_viz_type=pie&rdo_save=saveas&new_slice_name=&add_to_dash=false&save_to_dashboard_id=&new_dashboard_name=&where=school_id+%3D'+sessionStorage.getItem('com.youwin.yws.school_id')),
                        top:'-1305px',
                        height:'700px',
                        bgpy:'1300px !important'
                    },
                    {
                        title:'体验客户趋势',
                        url:$sce.trustAsResourceUrl(STATISTICS_1+'/superset/explore/table/'+STATISTICS_SCHOOL_PARAM+'/?viz_type=line&granularity_sqla=cs_create_at&time_grain_sqla=day&since='+$scope.since+'&until='+$scope.until+'&metrics=count&limit=50&timeseries_limit_metric=&show_brush=false&show_legend=y&show_legend=false&rich_tooltip=y&rich_tooltip=false&y_axis_zero=false&y_log_scale=false&contribution=false&show_markers=false&x_axis_showminmax=y&x_axis_showminmax=false&line_interpolation=linear&x_axis_format=%25Y-%25m-%25d&y_axis_format=.3s&x_axis_label=&y_axis_label=&rolling_type=None&rolling_periods=&time_compare=&num_period_compare=&period_ratio_type=growth&resample_how=&resample_rule=&resample_fillmethod=&having=&flt_col_0=&flt_op_0=in&flt_eq_0=&slice_id=&slice_name=&collapsed_fieldsets=&action=&userid=1&goto_dash=false&datasource_name=view_customer&datasource_id=26&datasource_type=table&previous_viz_type=line&rdo_save=saveas&new_slice_name=&add_to_dash=false&save_to_dashboard_id=&new_dashboard_name=&where=+state_id_1+%3D+5+and+school_id+%3D'+sessionStorage.getItem('com.youwin.yws.school_id')),
                        top:'-2022px',
                        bgpy:'1990px !important',
                        height:'700px'
                    }
                ]
            }
        }
		/**
		 * 获取列表数据
		 */
		function getDataByFilter(){
			$("body").click();
			$scope.searchModel.statTime = new Date($("#statTime").val());
			if($scope.currentTable==='2'){
				getSummary($scope.summaryTableState);
			}else if($scope.currentTable==='1'){
				getStatistics($scope.statisticsTableState);
			}
			BiBaseService.setTimeRange($scope.$parent);
		}
		/**
		 * 导出列表
		 */
		function exportAll(){
			if($scope.currentTable==='2'){
				exportSummary();
			}else if($scope.currentTable==='1'){
				exportStatistics();
			}
		}
		/**
		 * 导出汇总
		 */
		function exportSummary(){
			//设置表格状态和分页信息
            $scope.start = 0;
            $scope.number = 0;
            $scope.searchModel.start = $scope.start;
            $scope.searchModel.size = $scope.number;
            //查询请求
            var promise=BiSchoolLeadsService.getSummary($scope.searchModel);
	        promise.then(function (result) {
	        	$scope.summaryResultForExport = result.data;
                //导出
                var titleName = '校区客户信息统计汇总数据';
                var exportTableStyle = {
                		sheetid: titleName,
                		headers: true,
                		caption: {
                			title: titleName,
                		},
                		column: {style:'font-size:16px; text-align:left;'},
                		columns: [
                		          {columnid:'name',title: '区域/校区',width: '100px'},
                		          {columnid:'newLeadsCount',title: '新增意向客户'},
                		          {columnid:'primaryLeadsCount',title: '小学'},
                		          {columnid:'middleLeadsCount',title: '初中'},
                		          {columnid:'highLeadsCount',title: '高中'},
                		          {columnid:'gradeSummaryCount',title: '总计'},
                		          {columnid:'noCallLeadsCount',title: '未联系客户'},
                		          {columnid:'callLeadsCount',title: '已联系客户'},
                		          {columnid:'invitationLeadsCount',title: '已邀约客户'},
                		          {columnid:'visitLeadsCount',title: '已到访客户'},
                		          {columnid:'experienceLeadsCount',title: '已体验客户'},
                		          {columnid:'callLeadsSummaryCount',title: '总计'}
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
                var exportData = [];
                exportData.push($scope.summaryResultForExport);
                alasql('SELECT * INTO XLS("校区客户信息统计汇总数据.xls", ?) FROM ?', [exportTableStyle, exportData]);
	        });

		}
		/**
		 * 导出明细
		 */
		function exportStatistics(){
            $scope.start = 0;
            $scope.number = 0;
            $scope.searchModel.start = $scope.start;
            $scope.searchModel.size = $scope.number;
            //查询请求
            var promise=BiSchoolLeadsService.getPageList($scope.searchModel);
	        promise.then(function (result) {
	        	$scope.statisticsListForExport = result.data.list;
                var titleName = '校区客户信息统计明细数据';
                var exportTableStyle = {
                		sheetid: titleName,
                		headers: true,
                		caption: {
                			title: titleName,
                		},
                		column: {style:'font-size:16px; text-align:left;'},
                		columns: [
                		          {columnid:'schoolName',title: '校区'},
                		          {columnid:'newLeadsCount',title: '新增意向客户'},
                		          {columnid:'primaryLeadsCount',title: '小学'},
                		          {columnid:'middleLeadsCount',title: '初中'},
                		          {columnid:'highLeadsCount',title: '高中'},
                		          {columnid:'gradeSummaryCount',title: '总计'},
                		          {columnid:'noCallLeadsCount',title: '未联系客户'},
                		          {columnid:'callLeadsCount',title: '已联系客户'},
                		          {columnid:'invitationLeadsCount',title: '已邀约客户'},
                		          {columnid:'visitLeadsCount',title: '已到访客户'},
                		          {columnid:'experienceLeadsCount',title: '已体验客户'},
                		          {columnid:'callLeadsSummaryCount',title: '总计'}
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
                alasql('SELECT * INTO XLS("校区客户信息统计明细数据.xls", ?) FROM ?', [exportTableStyle, $scope.statisticsListForExport]);
            });
		}
	}
]);
