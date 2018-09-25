'use strict';

/**
 * The userPrize controller.
 * @version 1.0
 */
angular.module('ywsApp').controller('UserPrizeController', [
	'$scope', '$modal', '$filter', '$rootScope', 'SweetAlert', 'UserPrizeService',
	function($scope, $modal, $filter, $rootScope, SweetAlert, UserPrizeService) {
	$scope.searchModel = {}
		/**
		 * 查询分页信息
		 */
		$scope.queryForPage=function (tableState) {
            _setParam()
            tableState = tableState||{}
	      $scope.userPrizeTableState = tableState;
	      $scope.pagination = tableState.pagination||{};
	      $scope.start = $scope.pagination.start || 0;
	      $scope.number = $scope.pagination.number || 10;
	      $scope.searchModel.start = $scope.start;
	      $scope.searchModel.size = $scope.number;
	      var promise = UserPrizeService.queryForPage($scope.searchModel);
	      promise.then(function(response) {
	    	  $scope.userPrizes = [];
	          if(response.status == "FAILURE"){
	            SweetAlert.swal(response.data,"查询失败", response.data);
	            return false;
	          }else{
	            $scope.userPrizes = response.data.list;
	            tableState.pagination.numberOfPages = response.data.pages;
	          }
	      });
	    }
        $scope.nextCourseDatas = [{"name": "今日", "id": 1}, {"name": "明日", "id": 9}, {"name": "本周", "id": 10}, {"name": "下周", "id": 11},{"name": "本月", "id": 13}, {"name": "下月", "id": 15}, {"name": "自定义", "id": 8}];
		function _setParam() {
            var param = angular.element('[ng-model]')
            param.each(function (index,data) {
                data = $(data)
                var value = data.value
                if(value){
                    $scope[data.attr('ng-model')] = value
                }
            })
        }
	}
]);