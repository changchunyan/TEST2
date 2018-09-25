'use strict';

/**
 * The BdLeads management controller.
 *
 * @author philliu@youwinedu.com
 * @version 1.0
 */
angular.module('ywsApp').controller('BdFranchiserEditController', ['$scope', '$location','$filter','BdFranchisersService','BdLeadsService','CommonService', '$modal', '$rootScope', 'SweetAlert',
  'localStorageService','AuthenticationService','$routeParams',
    function($scope, $location,$filter,BdFranchisersService, BdLeadsService, CommonService,$modal, $rootScope, SweetAlert,localStorageService,AuthenticationService,$routeParams) {
        $scope.isAdding = false;
        $scope.frachiserId = $routeParams.id;
        $scope.detail = {};
        $scope.view = function() {
            BdLeadsService.getDictionary("Province").then(function (result) {
                $scope.provinceList = result.data;
                console.dir($scope.provinceList);
            });
            BdFranchisersService.getDictionary("FranchiseJoinForm").then(function (result) {
                $scope.joinFormList = result.data;
            });
            BdFranchisersService.getDictionary("FranchiseType").then(function (result) {
                $scope.isFirstList = result.data;
            });
            BdFranchisersService.getDictionary("StockPartnership").then(function (result) {
                $scope.isStockPartnershipList = result.data;
            });
            BdFranchisersService.getDictionary("PostponeTime").then(function (result) {
                $scope.postponeTimeList = result.data;
            });
            BdFranchisersService.getDictionary("CityLevel").then(function (result) {
                $scope.cityLevelList = result.data;
            });
            BdFranchisersService.getDictionary("CctvPeriod").then(function (result) {
               $scope.cctvPeriodList = result.data;
            });
            BdLeadsService.getDictionary("Project").then(function (result) {
                $scope.projectTypeList = result.data;
            });

            if($scope.frachiserId && $scope.frachiserId>0) {
                BdFranchisersService.detail($scope.frachiserId).then(function(result){
                    $scope.detail = result;
                    console.dir(result);
                    var enableEdit = false;
                    if($rootScope.showPermissions('BdLeadsAddDetail') && ($scope.detail.contract_status==1 || $scope.detail.contract_status==3)) { //BdManager
                      enableEdit = true;
                    } 
                    if($rootScope.showPermissions("BdLeadsNoticeViewAll") && $scope.detail.contract_status<4) { //BdFinance
                      enableEdit = true;
                    }
                    if(!enableEdit) {
                        $location.path("/bd-admin/franchiser/"+$scope.detail.id);
                        return;
                    }
                    $scope.detail.contract_starttime=new Date($filter('date')($scope.detail.contract_starttime,'yyyy-MM-dd'));
                    $scope.detail.contract_endtime=new Date($filter('date')($scope.detail.contract_endtime,'yyyy-MM-dd'));
                    if($scope.detail.project_type) {
                        $scope.projectChanged();
                    }
                    if($scope.detail.province) {
                        $scope.provinceChanged();
                    }
                    if($scope.detail.city) {
                        $scope.cityChanged();
                    }
                })
            } else {
                $scope.isAdding = true;
                $scope.detail.contract_status=1;
                $scope.detail.person_id=localStorageService.get("BdLeadId");
                BdLeadsService.detail($scope.detail.person_id).then(function(result){
                  $scope.detail.name = result.name;
                });
                console.dir($scope.detail.person_id);
            }
        }
        $scope.view();

        $scope.save = function save(){
            var promise = BdFranchisersService.save($scope.detail);
            promise.then(function(data) {
                if(data.status == 'FAILURE'){
                    SweetAlert.swal(data.data);
                    return false;
                }
                $scope.detail = {};
                $scope.showList();
            }, function(error) {
                alert("创建加盟商失败");
            });
        }

        $scope.showList = function() {
            $location.path("/bd-admin/franchiser_list");
        }

        $scope.provinceChanged = function(){
            if($scope.detail.province){
                BdLeadsService.getDictionary("City",$scope.detail.province).then(function (result) {
                    $scope.cityList = result.data;
                });
            }else{
                $scope.cityList = [];
            }
        };

        $scope.cityChanged = function(){
            if($scope.detail.city){
                BdLeadsService.getDictionary("Area",$scope.detail.city).then(function (result) {
                    $scope.areaList = result.data;
                });
            }else{
                $scope.areaList =[];
            }
        };

        $scope.projectChanged = function() {
            if($scope.detail.project_type) {
                BdFranchisersService.getDictionary("ProjectDetail", $scope.detail.project_type).then(function (result) {
                    $scope.projectDetailList = result.data;
                });
            }else{
                $scope.projectDetailList = [];
            }
        };
    }
]);
