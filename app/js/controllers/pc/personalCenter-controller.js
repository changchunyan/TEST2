'use strict';

/**
 * The personal center controller.
 *
 * @author czq
 * @version 1.0
 */
angular.module('ywsApp').controller('PersonalCenterController',
    ['$scope', '$modal', '$rootScope', 'SweetAlert','PersonalCenterService','AuthenticationService', 'CommonService',
    function($scope,   $modal,   $rootScope,   SweetAlert , PersonalCenterService, AuthenticationService, CommonService) {

    	/**	function declarion	*/
    	$scope.getAllSelected = getAllSelected;
    	
    	/**	variables declarion**/
        $scope.subjectIds = [];
        $scope.gradeIds = [];
    	$scope.handoutsFilter = {};
    	$scope.homeworkFilter = {};
    	
    	$scope.getAllSelected();
    	
    	/**
    	 *	Get the pesonal handouts table. 
    	 */
        $scope.getHandoutsPackList = function(tableState){
        	$scope.handoutsTableState = tableState;
            $scope.isLoading = true;
            var pagination = tableState.pagination;
            var start = pagination.start || 0;
            var number = pagination.number || 10;
            $scope.handoutsFilter.type = [3];//备课笔记type
            PersonalCenterService.getPackList(start, number, $scope.handoutsTableState, $scope.handoutsFilter).then(function (result) {
            	$scope.handoutsPackList = result.data;
            	angular.forEach($scope.handoutsPackList, function(p, index){
                	p.downloadPath = QINIU_TR_DOMIN + p.url;
                	if(p.downloadPath.endsWith("pdf")  == false){
                		p.viewPath = p.downloadPath + "?odconv/pdf";
                	}
                	else{
                		p.viewPath = p.downloadPath;
                	}
                	var str = decodeURI(angular.copy(p.url));
                	var offset = -1;
                	var count = 0;
                	while ((offset = str.indexOf("/")) != -1) {
                		count++;
                		str = str.substring(offset + 1);
                		if (count == 3) {
                			p.filename = str;
                			break;
                		}
                	}
                });
                tableState.pagination = tableState.pagination || {};
                tableState.pagination.numberOfPages = result.numberOfPages;
                $scope.isLoading = false;
            });
        }
        
        /**
    	 *	Get the pesonal homework table. 
    	 */
        $scope.getHomeworkPackList = function(tableState){
        	$scope.homeworkTableState = tableState;
            $scope.isLoading = true;
            var pagination = tableState.pagination;
            var start = pagination.start || 0;
            var number = pagination.number || 10;
            $scope.homeworkFilter.type = [1,4];//备课笔记type
            PersonalCenterService.getPackList(start, number, $scope.homeworkTableState, $scope.homeworkFilter).then(function (result) {
            	$scope.homeworkPackList = result.data;
            	angular.forEach($scope.homeworkPackList, function(p, index){
                	p.downloadPath = QINIU_TR_DOMIN + p.url;
                	if(p.downloadPath.endsWith("pdf")  == false){
                		p.viewPath = p.downloadPath + "?odconv/pdf";
                	}
                	else{
                		p.viewPath = p.downloadPath;
                	}
                	var str = decodeURI(angular.copy(p.url));
                	var offset = -1;
                	var count = 0;
                	while ((offset = str.indexOf("/")) != -1) {
                		count++;
                		str = str.substring(offset + 1);
                		if (count == 3) {
                			p.filename = str;
                			break;
                		}
                	}
                });
                tableState.pagination = tableState.pagination || {};
                tableState.pagination.numberOfPages = result.numberOfPages;
                $scope.isLoading = false;
            });
        }
        
        /**
         * 查询
         */
    	$scope.getPackByFilter = function(type){
    		var pagination = null;
            var start = null;
            var number = null;
            var tablestate = null;
            var filter = {};
    		if(type == 3){
    			$scope.handoutsFilter.type = [3];
    			tablestate = $scope.handoutsTableState;
    			pagination = $scope.handoutsTableState.pagination;
    			start = $scope.handoutsTableState.start || 0; 
                number = $scope.handoutsTableState.number || 10;
                filter = $scope.handoutsFilter;
    		}
    		else if(type == 4){
    			$scope.homeworkFilter.type = [1,4];
    			tablestate = $scope.homeworkTableState;
    			pagination = $scope.homeworkTableState.pagination;
    			start = $scope.homeworkTableState.start || 0; 
                number = $scope.homeworkTableState.number || 10;
                filter = $scope.homeworkFilter;
    		}
            $scope.isLoading = true;
            PersonalCenterService.getPackList(start, number, tablestate, filter).then(function (result) {
            	if(type == 3){
            		$scope.handoutsPackList = result.data;
                	angular.forEach($scope.handoutsPackList, function(p, index){
                    	p.downloadPath = QINIU_TR_DOMIN + p.url;
                    	if(p.downloadPath.endsWith("pdf")  == false){
                    		p.viewPath = p.downloadPath + "?odconv/pdf";
                    	}
                    	else{
                    		p.viewPath = p.downloadPath;
                    	}
                    	var str = decodeURI(angular.copy(p.url));
                    	var offset = -1;
                    	var count = 0;
                    	while ((offset = str.indexOf("/")) != -1) {
                    		count++;
                    		str = str.substring(offset + 1);
                    		if (count == 3) {
                    			p.filename = str;
                    			break;
                    		}
                    	}
                    });
                	$scope.handoutsTableState.pagination = $scope.handoutsTableState.pagination || {};
                	$scope.handoutsTableState.pagination.numberOfPages = result.numberOfPages;
                    $scope.isLoading = false;
            	}
            	else if(type == 4){
            		$scope.homeworkPackList = result.data;
                	angular.forEach($scope.homeworkPackList, function(p, index){
                    	p.downloadPath = QINIU_TR_DOMIN + p.url;
                    	if(p.downloadPath.endsWith("pdf")  == false){
                    		p.viewPath = p.downloadPath + "?odconv/pdf";
                    	}
                    	else{
                    		p.viewPath = p.downloadPath;
                    	}
                    	var str = decodeURI(angular.copy(p.url));
                    	var offset = -1;
                    	var count = 0;
                    	while ((offset = str.indexOf("/")) != -1) {
                    		count++;
                    		str = str.substring(offset + 1);
                    		if (count == 3) {
                    			p.filename = str;
                    			break;
                    		}
                    	}
                    });
                	$scope.homeworkTableState.pagination = $scope.homeworkTableState.pagination || {};
                	$scope.homeworkTableState.pagination.numberOfPages = result.numberOfPages;
                    $scope.isLoading = false;
            	}
            	
            });
    	}
    	
    	/**
         * 获取年级、科目、省、一级客户状态、一级渠道来源下拉菜单
         */
        function getAllSelected() {
            CommonService.getSubjectIdSelect().then(function (result) {
                $scope.subjectIds = result.data;
            });
            CommonService.getGradeIdSelect().then(function (result) {
                $scope.gradeIds = result.data;
            });
        };
        
        /**
         * 重置查询条件
         */
        $scope.reset = function(){
        	$scope.homeworkFilter = {};
        	$scope.handoutsFilter = {};
        }
        
        /**
         * 删除资料包
         */
        $scope.deletePack = function(row, type){
        	SweetAlert.swal({
                title: "确定要删除该资源吗？",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: '#DD6B55',
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                closeOnConfirm: true
              },function(confirm) {
            	  if (confirm) {
            		  PersonalCenterService.deletePack(row).then(function (result) {
            			  if(type == 3){
            				  $scope.getHandoutsPackList($scope.handoutsTableState);
            			  }
            			  else if(type == 4){
            				  $scope.getHomeworkPackList($scope.homeworkTableState);
            			  }
            			  SweetAlert.swal("删除成功", "succes");
                      });
            	  }
              });
        }
    }
]);
