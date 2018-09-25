'use strict';

/**
 * The wagBasicData controller.
 * @version 1.0
 */
angular.module('ywsApp').controller('WagBasicDataController', [
	'$scope', '$modal','$location', '$filter', '$rootScope', 'SweetAlert', 'WagBasicDataService',
	function($scope, $modal,$location, $filter, $rootScope, SweetAlert, WagBasicDataService) {
		$scope.getDepartmentDataList = getDepartmentDataList;
		$scope.getDepartmentDataFilter = {};

		function getDepartmentDataList() {
			$scope.getDepartmentDataFilter.salaryYear = 2017;
			$scope.getDepartmentDataFilter.salaryMonth = 3;
			$scope.getDepartmentDataFilter.pageNum = 1;
			$scope.getDepartmentDataFilter.pageSize = 20;
			var promise = WagBasicDataService.departmentbasiclist($scope.getDepartmentDataFilter);
			promise.then(function(response) {
				if(response.status == "FAILURE"){
					SweetAlert.swal( response.data,"请重试","error");
				}
				else{
					$scope.departmentDataList = response.data.list;
				}
			}, function(error) {
			});
		}

		$scope.detail = function(row) {
			$location.path("/hr-admin/empSalaryBasic/"+row.dept_id);
		}

		$scope.detail1 = function(row) {
			$location.path("/salary-manager/empSalaryBasic/"+row.dept_id);
		}

		//init
		$scope.getDepartmentDataList();
	}
]);