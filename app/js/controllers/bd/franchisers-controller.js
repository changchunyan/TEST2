'use strict';

/**
 * The BdLeads management controller.
 *
 * @author philliu@youwinedu.com
 * @version 1.0
 */
angular.module('ywsApp').controller('BdFranchisersController', ['$scope', '$location','BdFranchisersService','BdLeadsService', 'CommonService', '$modal', '$rootScope', 'SweetAlert',
  'localStorageService','AuthenticationService',
  function($scope, $location,BdFranchisersService,BdLeadsService, CommonService,$modal, $rootScope, SweetAlert,localStorageService,AuthenticationService) {

    $scope.isList = true;
    $scope.isLoading = false;

    $scope.filter = {};
    $scope.bdFranchiserList =  [];
    $scope.bdFranchiserListTableState = {};
    $scope.getList = function callServer(tableState) {
      $scope.bdFranchiserListTableState = tableState;
      //console.dir(tableState);
      $scope.isLoading = true;
      var pagination = tableState.pagination;
      var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
      var number = pagination.number || 10;  // Number of entries showed per page.
      $scope.getAllSelected();
        console.dir($rootScope.currentUser);
      if(!$rootScope.showPermissions("BdLeadsNoticeViewAll") && $rootScope.showPermissions("BdLeadsNoticeViewSelf")) {
        $scope.filter.owner_id = $rootScope.currentUser.id;
      }
      BdFranchisersService.list(start, number, tableState, $scope.filter).then(function (result) {
        $scope.getAllSelected();
        $scope.bdFranchiserList = result.data;
        tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
        $scope.bdFranchiserListTableState = tableState;
        $scope.isLoading = false;
      });
    };

    $scope.contractStatusList = [];
    $scope.projectList = [];
    $scope.projectDetailList = [];
    $scope.getAllSelected = function getAllSelected() {
        BdFranchisersService.getDictionary("ContractStatus").then(function (result) {
           $scope.contractStatusList = result.data;
        });
        BdLeadsService.getDictionary("Project").then(function (result) {
           $scope.projectList = result.data;
        });
    };

    $scope.projectChanged = function() {
        if($scope.filter.project_type) {
            BdFranchisersService.getDictionary("ProjectDetail", $scope.filter.project_type).then(function (result) {
                $scope.projectDetailList = result.data;
            });
        }else{
            $scope.projectDetailList = [];
        }
    };

      $scope.view = function(detail) {
          $location.path("/bd-admin/franchiser/"+detail.id);
      }

      $scope.edit = function(detail) {
          $location.path("/bd-admin/franchiser_edit/"+detail.id);
      }

      $scope.enableEdit = function(detail) {
        if($rootScope.showPermissions('BdLeadsAddDetail') && (detail.contract_status==1 || detail.contract_status==3)) { //BdManager
          return true;
        } else if($rootScope.showPermissions("BdLeadsNoticeViewAll") && detail.contract_status<4) { //BdFinance
          return true;
        }
        return false;
      }
  }
]);
