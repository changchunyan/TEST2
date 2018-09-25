'use strict';

/**
 * The wagClassTimeDetail controller.
 * @version 1.0
 */
angular.module('ywsApp').controller('WagClassTimeDetailController', [
    '$scope', '$modal', '$location', '$filter', '$rootScope', 'SweetAlert', 'WagClassTimeDetailService', '$routeParams',
    function ($scope, $modal, $location, $filter, $rootScope, SweetAlert, WagClassTimeDetailService, $routeParams) {

        $scope.getempDataListFilter = {};

        $scope.getempDataList = function getempDataList(tableState) {

            var pagination = tableState.pagination;
            var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
            var number = pagination.number || 10;  // Number of entries showed per page.
            //console.log('call server'+tableState);

            $scope.getempDataListFilter.salaryYear = 2017;
            $scope.getempDataListFilter.salaryMonth = 3;
            $scope.getempDataListFilter.pageNum = start/number+1;
            $scope.getempDataListFilter.departmentId = parseInt($routeParams.departmentId);
            $scope.getempDataListFilter.pageSize = number;
            var promise = WagClassTimeDetailService.empbasiclist($scope.getempDataListFilter);
            promise.then(function (response) {
                if (response.status == "FAILURE") {
                    SweetAlert.swal(response.data, "请重试", "error");
                }
                else {
                    $scope.empDataList = response.data;
                    $scope.num = response.numberOfPages;
                    tableState.pagination.numberOfPages = response.numberOfPages;//set the number of pages so the pagination can update
                }
            }, function (error) {
            });
        }
        
        $scope.jump=function jump() {
            $location.url('partials/salary/wagBasicData/BasicDataCollect.html?'+new Date().getTime());
        }

        $scope.courseTimeDetailFilter = {};
        $scope.courseTimeDetail = function courseTimeDetail(row) {
            $scope.courseTimeDetailFilter.userId = row.userId;
            $scope.courseTimeDetailFilter.salaryYear = 2017;
            $scope.courseTimeDetailFilter.salaryMonth = 3;
            var promise = WagClassTimeDetailService.courseTimeDetail($scope.courseTimeDetailFilter);
            promise.then(function (response) {
                if (response.status == "FAILURE") {
                    SweetAlert.swal(response.data, "请重试", "error");
                }
                else {
                    $scope.courseTimeDetailLIst = response.data;
                    $scope.addModal = $modal({
                        scope: $scope,
                        templateUrl: 'partials/hr/wagBasicData/coursePlanDetail.html?V=' + Date.now(),
                        show: true,
                        backdrop: 'static'
                    });
                }
            }, function (error) {
            });

        }


        $scope.fourHourOrderFilter = {};
        $scope.fourHourOrder = function fourHourOrder(row) {
            $scope.fourHourOrderFilter.userId = row.userId;
            $scope.fourHourOrderFilter.salaryYear = 2017;
            $scope.fourHourOrderFilter.salaryMonth = 3;
            var promise = WagClassTimeDetailService.queryFourHourStudent($scope.fourHourOrderFilter);
            promise.then(function (response) {
                if (response.status == "FAILURE") {
                    SweetAlert.swal(response.data, "请重试", "error");
                }
                else {
                    $scope.fourHourStudentList = response.data;
                    $scope.addModal = $modal({
                        scope: $scope,
                        templateUrl: 'partials/hr/wagBasicData/fourHourStudent.html?V=' + Date.now(),
                        show: true,
                        backdrop: 'static'
                    });
                }
            }, function (error) {
            });

        }

        $scope.xtOrderFilter = {};
        $scope.xtOrder = function xtOrder(row) {
            $scope.xtOrderFilter.userId = row.userId;
            $scope.xtOrderFilter.salaryYear = 2017;
            $scope.xtOrderFilter.salaryMonth = 3;
            var promise = WagClassTimeDetailService.xtOrderList($scope.xtOrderFilter);
            promise.then(function (response) {
                if (response.status == "FAILURE") {
                    SweetAlert.swal(response.data, "请重试", "error");
                }
                else {
                    $scope.xtOrderList = response.data;
                    $scope.addModal = $modal({
                        scope: $scope,
                        templateUrl: 'partials/hr/wagBasicData/xtOrder.html?V=' + Date.now(),
                        show: true,
                        backdrop: 'static'
                    });
                }
            }, function (error) {
            });

        }

        $scope.transferPlatOrderFilter = {};
        $scope.transferPlatOrder = function transferPlatOrder(row) {
            $scope.transferPlatOrderFilter.userId = row.userId;
            $scope.transferPlatOrderFilter.salaryYear = 2017;
            $scope.transferPlatOrderFilter.salaryMonth = 3;
            var promise = WagClassTimeDetailService.queryTransferPlatOrder($scope.transferPlatOrderFilter);
            promise.then(function (response) {
                if (response.status == "FAILURE") {
                    SweetAlert.swal(response.data, "请重试", "error");
                }
                else {
                    $scope.transferPlat = response.data;
                    $scope.addModal = $modal({
                        scope: $scope,
                        templateUrl: 'partials/hr/wagBasicData/zptOrder.html?V=' + Date.now(),
                        show: true,
                        backdrop: 'static'
                    });
                }
            }, function (error) {
            });

        }

        $scope.refundOrderFilter = {};
        $scope.refundOrder = function refundOrder(row) {
            $scope.refundOrderFilter.userId = row.userId;
            $scope.refundOrderFilter.salaryYear = 2017;
            $scope.refundOrderFilter.salaryMonth = 3;
            var promise = WagClassTimeDetailService.queryRefundOrder($scope.refundOrderFilter);
            promise.then(function (response) {
                if (response.status == "FAILURE") {
                    SweetAlert.swal(response.data, "请重试", "error");
                }
                else {
                    $scope.refundOrderList = response.data;
                    $scope.addModal = $modal({
                        scope: $scope,
                        templateUrl: 'partials/hr/wagBasicData/tfOrde.html?V=' + Date.now(),
                        show: true,
                        backdrop: 'static'
                    });
                }
            }, function (error) {
            });

        }

        $scope.queryTeacherOrderOutFilter = {};
        $scope.queryTeacherOrderOut = function queryTeacherOrderOut(row) {
            $scope.rowBak = row;
            $scope.queryTeacherOrderOutFilter.userId = row.userId;
            $scope.queryTeacherOrderOutFilter.salaryYear = 2017;
            $scope.queryTeacherOrderOutFilter.salaryMonth = 3;
            var promise = WagClassTimeDetailService.queryTeacherOrderOut($scope.queryTeacherOrderOutFilter);
            promise.then(function (response) {
                if (response.status == "FAILURE") {
                    SweetAlert.swal(response.data, "请重试", "error");
                }
                else {
                    $scope.OrderoutList = response.data;
                    $scope.addModal = $modal({
                        scope: $scope,
                        templateUrl: 'partials/hr/wagBasicData/zksOrder.html?V=' + Date.now(),
                        show: true,
                        backdrop: 'static'
                    });
                }
            }, function (error) {
            });

        }

        $scope.queryTeacherOrderOutAfterFilter = {};
        $scope.queryTeacherOrderOutAfter = function queryTeacherOrderOutAfter(orderNo) {
            $scope.queryTeacherOrderOutAfterFilter = orderNo;

            var promise = WagClassTimeDetailService.queryTeacherOrderOutAfter($scope.queryTeacherOrderOutAfterFilter);
            promise.then(function (response) {
                if (response.status == "FAILURE") {
                    SweetAlert.swal(response.data, "请重试", "error");
                }
                else {
                    $scope.OrderOutAfterList = response.data;
                    $scope.addModal = $modal({
                        scope: $scope,
                        templateUrl: 'partials/hr/wagBasicData/zksOrderAfter.html?V=' + Date.now(),
                        show: true,
                        backdrop: 'static'
                    });
                }
            }, function (error) {
            });

        }

        $scope.queryTeacherOrderInBeforeFilter = {};
        $scope.queryTeacherOrderInBefore = function queryTeacherOrderInBefore(orderNo) {
            $scope.queryTeacherOrderInBeforeFilter = orderNo;

            var promise = WagClassTimeDetailService.queryTeacherOrderInBefore($scope.queryTeacherOrderInBeforeFilter);
            promise.then(function (response) {
                if (response.status == "FAILURE") {
                    SweetAlert.swal(response.data, "请重试", "error");
                }
                else {
                    $scope.OrderInBefore = response.data;
                    $scope.addModal = $modal({
                        scope: $scope,
                        templateUrl: 'partials/hr/wagBasicData/zksOrderBefore.html?V=' + Date.now(),
                        show: true,
                        backdrop: 'static'
                    });
                }
            }, function (error) {
            });

        }

        $scope.queryTeacherOrderInFilter = {};
        $scope.queryTeacherOrderIn = function queryTeacherOrderIn() {
            $scope.queryTeacherOrderInFilter.userId = $scope.rowBak.userId;
            $scope.queryTeacherOrderInFilter.salaryYear = 2017;
            $scope.queryTeacherOrderInFilter.salaryMonth = 3;
            var promise = WagClassTimeDetailService.queryTeacherOrderIn($scope.queryTeacherOrderInFilter);
            promise.then(function (response) {
                if (response.status == "FAILURE") {
                    SweetAlert.swal(response.data, "请重试", "error");
                }
                else {
                    $scope.OrderInList = response.data;
                    $scope.addModal = $modal({
                        scope: $scope,
                        templateUrl: 'partials/hr/wagBasicData/zksOrder.html?V=' + Date.now(),
                        show: true,
                        backdrop: 'static'
                    });
                }
            }, function (error) {
            });

        }

        //init
        //$scope.getempDataList();

    }
]);