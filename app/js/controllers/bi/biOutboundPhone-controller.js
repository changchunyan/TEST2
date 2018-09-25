'use strict';

/**
 * The BiOutboundPhoneController controller.
 * @version 1.0
 */
angular.module('ywsApp').controller('BiOutboundPhoneController', [       
    '$scope', '$sce', '$modal', '$filter', '$rootScope', 'SweetAlert', 'BiOutboundPhoneService','localStorageService','CommonService','BiBaseService',
    function ($scope, $sce, $modal, $filter, $rootScope, SweetAlert, BiOutboundPhoneService,localStorageService,CommonService,
              BiBaseService) {
        $scope.isY=true;
        // 方法声明
        $scope.getDataByFilter = getDataByFilter;
        $scope.getStatistics = getStatistics;
//参数
        $scope.currentTable = '1';
        /**
         * 统计参数
         */


		 /**
         * 根据筛选条件获取统计数据
         */
        function getDataByFilter() {

            
			 $("body").click();
			$scope.searchModel.statTime = new Date($("#statTime").val());
			//设置表格状态和分页信息
			$scope.isLoading = true;
			$scope.statisticsTableState.pagination.start=0;
            $scope.pagination = $scope.statisticsTableState.pagination;
			$scope.start = $scope.pagination.start || 0;
			$scope.number = $scope.pagination.number || 10;
			$scope.searchModel.start = $scope.start;
	        $scope.searchModel.size = $scope.number;
	       

            BiOutboundPhoneService.getPageList($scope.searchModel)
                .then(function (result) {
                    $scope.statisticsModels = result.data.list;

					$scope.statisticsTableState.pagination.numberOfPages = result.numberOfPages;
	                $scope.isLoading = false;
                    
                    
                });

	        BiBaseService.setTimeRange($scope.$parent);

        }

        /***                                                                                        ***/
        /**********************************************统计部分*****************************************/
        /***                                                                                       ***/
        /**
         * 根据列表状态获取统计数据
         */
        function getStatistics(tableState) { 
        	 if($scope.searchModel.schoolId!=undefined){
        		 $scope.searchModel.departmentId=$scope.searchModel.schoolId; 
        	 }

            
            $scope.statisticsTableState = tableState;
			$scope.pagination = tableState.pagination;
            $scope.start = $scope.pagination.start || 0;
            $scope.number = $scope.pagination.number || 10;
            $scope.searchModel.start = $scope.start;
            $scope.searchModel.size = $scope.number;
            //if (!check_null(tableState.search.predicateObject)) {
            //    tableState.search.predicateObject = {};
            //}
            //校区人员判断是不是老师
            if(!$scope.canQueryChildSchools){
                if(localStorageService.get('position_id')===Constants.PositionID.TEACHER
                    || localStorageService.get('position_id')===Constants.PositionID.YSB_TEACHER
                    || localStorageService.get('position_id')===Constants.PositionID.YSP_TEACHER
                    || localStorageService.get('position_id')===Constants.PositionID.YSGJ_TEACHER){
                    $scope.searchModel.teacherId = localStorageService.get('user').id;//教师只能看到自己的
                }
            }
            BiOutboundPhoneService.getPageList($scope.searchModel)
                .then(function (result) {
                    $scope.statisticsModels = result.data.list;
                    tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                });

        }
    }
]);