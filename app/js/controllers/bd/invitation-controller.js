'use strict';

/**
 * The BdLeads management controller.
 *
 * @author philliu@youwinedu.com
 * @version 1.0
 */
angular.module('ywsApp').controller('BdInvitationController', ['$scope', '$location','BdLeadsService','CommonService', '$modal', '$rootScope', 'SweetAlert',
  'BdRemindService','BdCommunicationService','BdInvitationService','localStorageService','AuthenticationService',
  function($scope, $location,BdLeadsService, CommonService,$modal, $rootScope, SweetAlert,BdRemindService,BdCommunicationService,BdInvitationService,localStorageService,AuthenticationService) {

      $scope.isList = true;

      $scope.bdInvitationFilter = {}; //招商Leads过滤条件
      $scope.bdInvitationList =  [];
      $scope.bdInvitationListTableState = {};
      $scope.getBdInvitationList = function callServer(tableState) {

          if( tableState.search.predicateObject != null && tableState.search.predicateObject.bdInvitationFilter != null ){
              if( tableState.search.predicateObject.bdInvitationFilter.name != null ){
                  if( tableState.search.predicateObject.bdInvitationFilter.name.length > 20 ){
                      return;
                  }
              }
              if( tableState.search.predicateObject.bdInvitationFilter.phone != null ){
                  if( tableState.search.predicateObject.bdInvitationFilter.phone.length > 11 ){
                      return;
                  }
              }
              if( tableState.search.predicateObject.bdInvitationFilter.invitator_name != null ){
                  if( tableState.search.predicateObject.bdInvitationFilter.invitator_name.length > 20 ){
                      return;
                  }
              }
          }

          $scope.bdInvitationListTableState = tableState;
          $scope.isBdInvitationLoading = true;
          var pagination = tableState.pagination;
          var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
          var number = pagination.number || 10;  // Number of entries showed per page.
          $scope.getAllSelected();
          console.dir($scope.bdInvitationFilter);
        //if( $scope.bdInvitationFilter.invitate_time ){
        //  $scope.bdInvitationFilter.invitate_time = new Date($scope.bdInvitationFilter.invitate_time);
        //}
        //if( $scope.bdInvitationFilter.receive_time ){
        //  $scope.bdInvitationFilter.receive_time = new Date($scope.bdInvitationFilter.receive_time);
        //}
          BdInvitationService.list(start, number, tableState,$scope.bdInvitationFilter).then(function (result) {
              $scope.getAllSelected();
              $scope.bdInvitationList = result.data;
              tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
              $scope.bdInvitationListTableState = tableState;
              $scope.isBdInvitationLoading = false;
          });
      };

      $scope.provinceList = [];
      $scope.cityList = [];
      $scope.areaList = [];
      $scope.invitationStateList = [];
      $scope.getAllSelected = function getAllSelected() {
          BdLeadsService.getDictionary("Province").then(function (result) {
              $scope.provinceList = result.data;
          });
         $scope.invitationStateList = [
             {"code":"0", "name":"待确认"},
             {"code":"1", "name":"已到访"},
             {"code":"2", "name":"未到访"}
         ];
      };

      $scope.privinceChangeForFilter = function(){
          if($scope.bdInvitationFilter.province){
              BdLeadsService.getDictionary("City",$scope.bdInvitationFilter.province).then(function (result) {
                  $scope.cityList = result.data;
              });
          }else{
              $scope.cityList = [];
          }
      };

      $scope.cityChangeForFilter = function(){
          if($scope.bdInvitationFilter.city){
              BdLeadsService.getDictionary("Area",$scope.bdInvitationFilter.city).then(function (result) {
                  $scope.areaList = result.data;
              });
          }else{
              $scope.areaList =[];
          }
      };

      $scope.viewBdLead = function(detail){
          $location.path("/bd-admin/lead/"+detail.bd_lead_id);
      }

      $scope.removeInvitation = removeInvitation;
      function removeInvitation(row) {
          SweetAlert.swal({
                  title: "确定要删除吗？",
                  type: "warning",
                  showCancelButton: true,
                  confirmButtonColor: '#DD6B55',
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  closeOnConfirm: true
              }, function(confirm) {
                  if (confirm) {
                      var promise = BdInvitationService.remove(row);
                      //$rootScope.showLoading();
                      promise.then(function() {
                          $scope.bdInvitationListTableState.pagination.start = 0;
                          $scope.getBdInvitationList($scope.bdInvitationListTableState);
                          //$rootScope.hideLoading();
                      }, function(error) {
                          //$rootScope.hideLoading();
                      });
                  }
              }
          );
      }

      $scope.visitInvitation = visitInvitation;
      function visitInvitation(row) {
          SweetAlert.swal({
                  title: "确定已到访了吗？",
                  type: "warning",
                  showCancelButton: true,
                  confirmButtonColor: '#DD6B55',
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  closeOnConfirm: true
              }, function(confirm) {
                  if (confirm) {
                      var promise = BdInvitationService.visit(row);
                      //$rootScope.showLoading();
                      promise.then(function() {
                          $scope.bdInvitationListTableState.pagination.start = 0;
                          $scope.getBdInvitationList($scope.bdInvitationListTableState);
                          //$rootScope.hideLoading();
                      }, function(error) {
                          //$rootScope.hideLoading();
                      });
                  }
              }
          );
      }


      $scope.markVisited = markVisited;
      function markVisited(row) {
          SweetAlert.swal({
                title: "确定已到访了吗？",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: '#DD6B55',
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                closeOnConfirm: true
            }, function(confirm) {
                if (confirm) {
                    var promise = BdInvitationService.visit(row);
                    //$rootScope.showLoading();
                    promise.then(function() {
                        $scope.bdInvitationListTableState.pagination.start = 0;
                        $scope.getBdInvitationList($scope.bdInvitationListTableState);
                        //$rootScope.hideLoading();
                    }, function(error) {
                        //$rootScope.hideLoading();
                    });
                }
            }
          );
      }

      $scope.markUnvisited = markUnvisited;
      function markUnvisited(row) {
          SweetAlert.swal({
                title: "确定未到访了吗？",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: '#DD6B55',
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                closeOnConfirm: true
            }, function(confirm) {
                if (confirm) {
                    var promise = BdInvitationService.unvisit(row);
                    //$rootScope.showLoading();
                    promise.then(function() {
                        $scope.bdInvitationListTableState.pagination.start = 0;
                        $scope.getBdInvitationList($scope.bdInvitationListTableState);
                        //$rootScope.hideLoading();
                    }, function(error) {
                        //$rootScope.hideLoading();
                    });
                }
            }
          );
      }
  }
]);
