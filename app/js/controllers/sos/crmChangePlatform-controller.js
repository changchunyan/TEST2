'use strict';

/**
 * The crmChangePlatform controller.
 * @version 1.0
 */
angular.module('ywsApp').controller('CrmChangePlatformController', [
	'$scope', '$modal', '$filter', '$rootScope', 'SweetAlert', 'CrmChangePlatformService', 'OrderService',
	function ($scope, $modal, $filter, $rootScope, SweetAlert, CrmChangePlatformService, OrderService) {

		$scope.getTabIndex = function (obj) {
			if (obj.title === '转入') {
				$scope.channelTab = '0';
			} else if (obj.title === '转出') {
				$scope.channelTab = '1';
			}
			$scope.platformFilter.channelTab = $scope.channelTab;
			if ($scope.platformTableState != undefined) {
				if ($scope.platformTableState.pagination != undefined) {
					$scope.platformTableState.pagination = {};
					$scope.platformTableState.pagination.start = 0;
					$scope.platformTableState.pagination.number = 10;
					getCrmPlatformList($scope.platformTableState);
				}
			}
		}

		$scope.platformFilter = {}
		$scope.PlatformListTo = []
		$scope.PlatformListFrom = []
		$scope.platformTableState = {}
		$scope.getCrmPlatformList = getCrmPlatformList;

		function getCrmPlatformList(tableState) {
			$scope.platformTableState = tableState;
			$scope.PlatformListTo = []
			$scope.PlatformListFrom = []
			var pagination = tableState.pagination;
			var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
			var number = pagination.number || 10;  // Number of entries showed per page.
			// debugger;
			OrderService.getCrmPlatformList(start, number, tableState, $scope.platformFilter).then(function (result) {
				if ($scope.channelTab == '1') {
					$scope.PlatformListFrom = result.crmPlatformList.list;
				} else if ($scope.channelTab == '0') {
					$scope.PlatformListTo = result.crmPlatformList.list;
				}
				tableState.pagination.numberOfPages = result.crmPlatformList.lastPage;//set the number of pages so the pagination can update
				$scope.platformTableState = tableState;
				$scope.isLoading = false;
			});
		}
		/**
		 * 转平台审核-最终审核操作
		 */
		$scope.auditChangePlatform = function auditChangePlatform() {
			var promise = OrderService.auditChangePlatform($scope.platform);
			promise.then(function (data) {
				SweetAlert.swal('操作成功');
				$scope.modalPlatform.hide();
				getCrmPlatformList($scope.platformTableState);//刷新列表
			}, function (error) {
				SweetAlert.swal('操作失败');
			});
		}

		/**
		 * 待转出审核操作
		 */
		$scope.auditChangePlatformTemp = function auditChangePlatformTemp() {
			var promise = OrderService.auditPlatformRecordTemp($scope.platform);
			promise.then(function (data) {
				//刷新列表,隐藏对话框
				SweetAlert.swal('操作成功');
				$scope.modalPlatform.hide();
				getCrmPlatformList($scope.platformTableState);
			}, function (error) {
				SweetAlert.swal('操作失败');
			});
		}

		/**
		 * 转平台撤销
		 */
		$scope.changePlatformBack = function changePlatformBack(row) {
			$scope.platform = angular.copy(row);
			var promise = OrderService.changePlatformBack($scope.platform);
			promise.then(function (data) {
				//刷新列表,隐藏对话框
				SweetAlert.swal('操作成功');
				getCrmPlatformList($scope.platformTableState);
			}, function (error) {
				SweetAlert.swal('操作失败');
			});
		}

		/**
		 * 获取该学生的审核通过的订单
		 */
		$scope.orderFilter = {};
		$scope.getPlatformOrders = function getPlatformOrders(tableState) {
			$scope.orderFlag = 7;
			$scope.orderFilter.platform = true;
			$scope.orderFilter.crmStudentId = $scope.platform.crmStudentId;
			$scope.orderFilter.changePlatFormStatus = 1;
			$scope.tableState = tableState;
			$scope.pagination = tableState.pagination;
			$scope.predicateObject = tableState.search.predicateObject;
			if (!$scope.pagination) {
				$scope.pagination = {};
			}
			$scope.start = $scope.pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
			$scope.number = $scope.pagination.number || 10;  // Number of entries showed per page.
			OrderService.getPage($scope.start, $scope.number, $scope.orderFlag, $scope.orderFilter).then(function (result) {
				$scope.passOrders = result.data;
				tableState.pagination = tableState.pagination || {}
				tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
			});
		}

        /**
         * 显示转出记录的审核的页面
         */
		$scope.showAuditChangePlatform = function showAuditChangePlatform(row) {
			$scope.platform = angular.copy(row);
			$scope.modalPlatform = $modal({
				scope: $scope,
				templateUrl: 'partials/sos/order/modal.showPlatform.html',
				show: true
			});
		}

		function getcrmChangeplatform(result, CrmPlatList) {
			for (var i = 0; i < CrmPlatList.length; i++) {
				if (result.schoolId == CrmPlatList[i].newPlatformId) {
					$scope.PlatformListTo.push(CrmPlatList[i])
				} else {
					$scope.PlatformListFrom.push(CrmPlatList[i])
				}
			}
		}
	}
]);
