'use strict';

/**
 * The BdLeads management controller.
 *
 * @author philliu@youwinedu.com
 * @version 1.0
 */
angular.module('ywsApp').controller('BdFranchiserController', ['$scope', '$location','BdFranchisersService','CommonService', '$modal', '$rootScope', 'SweetAlert',
  'localStorageService','AuthenticationService','$routeParams',
    function($scope, $location,BdFranchisersService, CommonService,$modal, $rootScope, SweetAlert,localStorageService,AuthenticationService,$routeParams) {
        $scope.isDetail = true;
        $scope.franchiserId = $routeParams.id;


        //----------------- detail ----------------//
        $scope.detail = {};
        $scope.view = function(){
            $scope.isDetail = true;
            //console.dir(detail);
            BdFranchisersService.detail($scope.franchiserId).then(function(result){
                $scope.detail = result;
            })
        }

        $scope.view();

        $scope.viewLead = function() {
            $location.path("/bd-admin/lead/"+$scope.detail.person_id);
        }

        $scope.approve = function() {
            SweetAlert.swal({
                    title: "确定要审核通过吗？",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: '#DD6B55',
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    closeOnConfirm: true
                }, function(confirm) {
                    if (confirm) {
                        var promise = BdFranchisersService.approve($scope.detail.id);
                        promise.then(function() {
                           $scope.view($scope.detail.id);
                        }, function(error) {
                        });
                    }
                }
            );
        }

        $scope.reject = function() {
            SweetAlert.swal({
                    title: "确定要驳回吗？",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: '#DD6B55',
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    closeOnConfirm: true
                }, function(confirm) {
                    if (confirm) {
                        var promise = BdFranchisersService.reject($scope.detail.id);
                        promise.then(function() {
                            $scope.view($scope.detail.id);
                        }, function(error) {
                        });
                    }
                }
            );
        }

        $scope.invalid = function() {
            SweetAlert.swal({
                    title: "确定要作废吗？",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: '#DD6B55',
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    closeOnConfirm: true
                }, function(confirm) {
                    if (confirm) {
                        var promise = BdFranchisersService.invalid($scope.detail.id);
                        promise.then(function() {
                            $scope.view($scope.detail.id);
                        }, function(error) {
                        });
                    }
                }
            );
        }
    }
]);
