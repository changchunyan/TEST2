'use strict';

/**
 * The BdLeads management controller.
 *
 * @author philliu@youwinedu.com
 * @version 1.0
 */
angular.module('ywsApp').controller('BdLeadController', ['$scope', '$location','$filter','BdLeadsService','CommonService', '$modal', '$rootScope', 'SweetAlert',
  'BdRemindService','BdCommunicationService','BdInvitationService','localStorageService','AuthenticationService',"$routeParams",
  function($scope, $location,$filter,BdLeadsService, CommonService,$modal, $rootScope, SweetAlert,BdRemindService,BdCommunicationService,BdInvitationService,localStorageService,AuthenticationService,$routeParams) {

    $scope.isDetail = true;
	$scope.isUpdate = false;
    $scope.isAllot = false;

    //----------------- detail ----------------//
    $scope.BdLeadsRemindListTableState = {};
    $scope.BdLeadsCommunicationListTableState = {};
    $scope.BdLeadsInvitationListTableState = {};
    $scope.detail = {};
    $scope.transferList = [];
    $scope.leadId = $routeParams.id;
    $scope.viewBdLead = function(){
        $scope.isDetail = true;
        $scope.isUpdate = false;
        $scope.isAllot = false;
        //console.dir(detail);
        BdLeadsService.detail($scope.leadId).then(function(result){
            $scope.detail = result;
        })
    };
    $scope.viewBdLead();

    $scope.viewTransfer = function(){
      BdLeadsService.transList($scope.leadId).then(function(response){
        $scope.transferList = response.data;
      })
    };
    $scope.viewTransfer();

      $scope.showInvitationListView = function() {
          //$scope.BdLeadsRemindListTableState.pagination.start = 0;
          //$scope.getRemindList($scope.BdLeadsRemindListTableState);

          $scope.BdLeadsCommunicationListTableState.pagination.start = 0;
          $scope.getCommunicationList($scope.BdLeadsCommunicationListTableState);

          $scope.BdLeadsInvitationListTableState.pagination.start = 0;
          $scope.getInvitationList($scope.BdLeadsInvitationListTableState);
      }

      $scope.sendApplication = function() {
          console.dir($location);
          var text = "http://"+$location.host()+":"+$location.port()+"/#/application/"+$scope.detail.application_key;
          SweetAlert.swal({
                  title: "加盟申请表地址:",
                  text: text,
                  type: "warning",
                  showCancelButton: false,
                  confirmButtonColor: '#DD6B55',
                  confirmButtonText: '关闭',
                  closeOnConfirm: true
              }, function(confirm) {
                if(confirm) {
                  BdLeadsService.sendApplication($scope.detail.bd_lead_id).then(function(result){
                  });
                }
              }
          );
      }

      $scope.editBdLead = function() {
          $location.path("/bd-admin/lead_edit/"+$scope.detail.bd_lead_id);
      }
      
      $scope.showListView = function(){
    	if($routeParams.bak)
    		$location.path("/bd-admin/leads_list/"+$routeParams.bak);
    	else
    		$location.path("/bd-admin/leads_list");
      }

      $scope.allotBdLeadsFilter = {};
      $scope.showAllot = function() {
          $scope.isAllot = true;
          $scope.allotBdLeadsFilter.user_id = $scope.detail.owner_id;
          BdLeadsService.getBDManagers().then(function (result) {
              $scope.bdManagerList = result.data;
          });
      }

      $scope.BdLeadsListOk = [];
      $scope.saveAllot = function(){
          var AllotBdLeadsVo = {};
          $scope.BdLeadsListOk.push({"bd_lead_id":$scope.detail.bd_lead_id});
          AllotBdLeadsVo.leadsList = $scope.BdLeadsListOk;
          AllotBdLeadsVo.owner_id = $scope.allotBdLeadsFilter.user_id;
          var promise = BdLeadsService.saveAllot(AllotBdLeadsVo);
          promise.then(function(data) {
              $location.path("/bd-admin/leads_list");
          }, function(error) {
              alert("分配招商Leads失败");
          });
      }

      /**
       * 提醒列表
       */
    $scope.BdLeadsRemindList = [];
    $scope.getRemindList = function callServer(tableState) {
      $scope.BdLeadsRemindListTableState = tableState;
      if($scope.detail){
          if(!tableState.search.predicateObject) {
              tableState.search.predicateObject = {};
          }
          tableState.search.predicateObject.bd_lead_id = $scope.leadId;
          $scope.isRemindLoading = true;
          var pagination = tableState.pagination;
          var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
          var number = pagination.number || 10;  // Number of entries showed per page.
          BdRemindService.list(start, number, tableState).then(function (result) {
              $scope.BdLeadsRemindList = result.data;
              tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
              $scope.isRemindLoading = false;
          });
      }
    };

    $scope.BdRemindVoForCreate = {};
    $scope.addRemind = addRemind;
    function addRemind() {
        //console.log('Starting creating new invitationRemind.');
        $scope.BdRemindVoForCreate = {};
        $scope.BdRemindVoForCreate.personId = $scope.leadId;
        $scope.BdRemindVoForCreate.remindTime = new Date().Format("yyyy-MM-dd");
      ;
        console.dir($scope.BdRemindVoForCreate);

        $scope.modalTitle = '添加提醒';
        $scope.modal = $modal({scope: $scope, templateUrl: 'partials/bd/leads/modal.remind.html?'+new Date().getTime(), show: true });
    }

      $scope.saveRemind = saveRemind;
      function saveRemind() {
          $scope.dataLoading = true;
          console.dir($scope.BdRemindVoForCreate);
          if (typeof $scope.BdRemindVoForCreate.id === 'undefined') {
              var promise = BdRemindService.create($scope.BdRemindVoForCreate);
              promise.then(function() {
                  $scope.showInvitationListView();
                  $scope.dataLoading = false;
                  $scope.modal.hide();
              }, function(error) {
                  $scope.dataLoading = false;
              });
          } else {
              var promise = BdRemindService.update($scope.BdRemindVoForCreate);
              promise.then(function() {
                  $scope.showInvitationListView();
                  $scope.dataLoading = false;
                  $scope.modal.hide();
              }, function(error) {
                  $scope.dataLoading = false;
              });
          }

          $scope.showInvitationListView();
      }

    $scope.stringToDate = function(s) {
      var d = new Date();
      d.setYear(parseInt(s.substring(0,4),10));
      d.setMonth(parseInt(s.substring(5,7)-1,10));
      d.setDate(parseInt(s.substring(8,10),10));
      d.setHours(parseInt(s.substring(11,13),10));
      d.setMinutes(parseInt(s.substring(14,16),10));
      d.setSeconds(0);
      return d;
    };



      $scope.editRemind = editRemind;
      function editRemind(row) {
          console.dir(row);
          $scope.BdRemindVoForCreate = angular.copy(row);
          $scope.BdRemindVoForCreate.remindTime = new Date($filter('date')($scope.BdRemindVoForCreate.remindTime,'yyyy-MM-dd'));
          $scope.modalTitle = '更新提醒';
          $scope.modal = $modal({scope: $scope, templateUrl: 'partials/bd/leads/lead_err_model.html?'+new Date().getTime(), show: true });
      }

      $scope.removeRemind = removeRemind;
      function removeRemind(row) {
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
                      var promise = BdRemindService.remove(row);
                      //$rootScope.showLoading();
                      promise.then(function() {
                          $scope.showInvitationListView();
                          //$rootScope.hideLoading();
                      }, function(error) {
                          //$rootScope.hideLoading();
                      });
                  }
              }
          );
      }

    /**
     * 沟通列表
     */
    $scope.BdLeadsCommunicationList =  [];
    $scope.getCommunicationList = function callServer(tableState) {
        $scope.BdLeadsCommunicationListTableState = tableState;
        if($scope.detail) {
            if(!tableState.search.predicateObject) {
                tableState.search.predicateObject = {};
            }
            tableState.search.predicateObject.bd_lead_id = $scope.leadId;
            //console.dir(tableState);
            $scope.isCommunicationLoading = true;
            var pagination = tableState.pagination;
            var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
            var number = pagination.number || 10;  // Number of entries showed per page.
            BdCommunicationService.list(start, number, tableState).then(function (result) {
                $scope.BdLeadsCommunicationList = result.data;
                tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                $scope.isCommunicationLoading = false;
            });
        }
    };

      $scope.BdCommunicationVoForCreate = {};
      $scope.addCommunication = addCommunication;
      function addCommunication() {
          //console.log('Starting creating new invitationRemind.');
          $scope.BdCommunicationVoForCreate = {};
          $scope.BdCommunicationVoForCreate.personId = $scope.leadId;
          $scope.BdCommunicationVoForCreate.communicateTime = new Date();
          console.dir($scope.BdCommunicationVoForCreate);

          $scope.modalTitle = '添加沟通';
          $scope.modal = $modal({scope: $scope, templateUrl: 'partials/bd/leads/modal.communication.html?'+new Date().getTime(),  show: true});
      }

      $scope.saveCommunication = saveCommunication;
      function saveCommunication() {
          $scope.dataLoading = true;
          console.dir($scope.BdCommunicationVoForCreate);
          if (typeof $scope.BdCommunicationVoForCreate.id === 'undefined') {
              var promise = BdCommunicationService.create($scope.BdCommunicationVoForCreate);
              promise.then(function() {
                  $scope.showInvitationListView();
                  $scope.detail.customer_status_name="已联系";
                  $scope.dataLoading = false;
                  $scope.modal.hide();
              }, function(error) {
                  $scope.dataLoading = false;
              });
          } else {
              var promise = BdCommunicationService.update($scope.BdCommunicationVoForCreate);
              promise.then(function() {
                  $scope.showInvitationListView();
                  $scope.detail.customer_status_name="已联系";
                  $scope.dataLoading = false;
                  $scope.modal.hide();
              }, function(error) {
                  $scope.dataLoading = false;
              });
          }

          $scope.showInvitationListView();
      }

      $scope.editCommunication = editCommunication;
      function editCommunication(row) {
          console.dir(row);
          $scope.BdCommunicationVoForCreate = angular.copy(row);
          $scope.BdCommunicationVoForCreate.communicateTime = new Date($filter('date')($scope.BdCommunicationVoForCreate.communicateTime,'yyyy-MM-dd'));
          $scope.modalTitle = '更新沟通';
          $scope.modal = $modal({scope: $scope, templateUrl: 'partials/bd/leads/modal.communication.html?'+new Date().getTime(), show: true });
      }

      $scope.removeCommunication = removeCommunication;
      function removeCommunication(row) {
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
                      var promise = BdCommunicationService.remove(row);
                      //$rootScope.showLoading();
                      promise.then(function() {
                          $scope.showInvitationListView();
                          //$rootScope.hideLoading();
                      }, function(error) {
                          //$rootScope.hideLoading();
                      });
                  }
              }
          );
      }

    /**
     * 邀约列表
     */
    $scope.BdLeadsInvitationList =  [];
    $scope.getInvitationList = function callServer(tableState) {
        $scope.BdLeadsInvitationListTableState = tableState;
        if($scope.detail) {
            if(!tableState.search.predicateObject) {
                tableState.search.predicateObject = {};
            }
            tableState.search.predicateObject.bd_lead_id = $scope.leadId;
            //console.dir(tableState);
            $scope.isInvitationLoading = true;
            var pagination = tableState.pagination;
            var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
            var number = pagination.number || 10;  // Number of entries showed per page.
            BdInvitationService.list(start, number, tableState, tableState.search.predicateObject).then(function (result) {
                $scope.BdLeadsInvitationList = result.data;
                console.dir(result.data);
                tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                $scope.myBdLeadsInvitationListTableState = tableState;
                $scope.isInvitationLoading = false;
            });
        }
    };

      $scope.BdInvitationVoForCreate = {};
      $scope.addInvitation = addInvitation;
      function addInvitation() {
          //console.log('Starting creating new invitationRemind.');
          $scope.BdInvitationVoForCreate = {};
          $scope.BdInvitationVoForCreate.personId = $scope.leadId;
          $scope.BdInvitationVoForCreate.invitateTime = new Date();
          $scope.BdInvitationVoForCreate.receiveTime = new Date().Format("yyyy-MM-dd hh:mm");
          console.dir($scope.BdInvitationVoForCreate);

          $scope.modalTitle = '添加邀约';
          $scope.modal = $modal({scope: $scope, templateUrl: 'partials/bd/leads/modal.invitation.html?'+new Date().getTime(), show: true });
      }

      $scope.saveInvitation = saveInvitation;
      function saveInvitation() {
          $scope.dataLoading = true;
          console.dir($scope.BdInvitationVoForCreate);
        $scope.BdInvitationVoForCreate.receiveTime = $scope.stringToDate($scope.BdInvitationVoForCreate.receiveTime);
        //console.log($scope.stringToDate($scope.BdInvitationVoForCreate.receiveTime));
          if (typeof $scope.BdInvitationVoForCreate.id === 'undefined') {
              var promise = BdInvitationService.create($scope.BdInvitationVoForCreate);
              promise.then(function() {
                  $scope.showInvitationListView();
                  $scope.detail.customer_status_name="已邀约";
                  $scope.dataLoading = false;
                  $scope.modal.hide();
              }, function(error) {
                  $scope.dataLoading = false;
              });
          } else {
              var promise = BdInvitationService.update($scope.BdInvitationVoForCreate);
              promise.then(function() {
                  $scope.showInvitationListView();
                  $scope.detail.customer_status_name="已邀约";
                  $scope.dataLoading = false;
                  $scope.modal.hide();
              }, function(error) {
                  $scope.dataLoading = false;
              });
          }

          $scope.showInvitationListView();
      }

      $scope.editInvitation = editInvitation;
      function editInvitation(row) {
          console.dir(row);
          $scope.BdInvitationVoForCreate = angular.copy(row);
          $scope.BdInvitationVoForCreate.invitateTime = new Date($filter('date')($scope.BdInvitationVoForCreate.invitateTime,'yyyy-MM-dd'));
          $scope.BdInvitationVoForCreate.receiveTime = new Date($scope.BdInvitationVoForCreate.receiveTime).Format("yyyy-MM-dd hh:mm");
          //$scope.BdInvitationVoForCreate.receiveTime = new Date($filter('date')($scope.BdInvitationVoForCreate.receiveTime,'yyyy-MM-dd'));
          $scope.modalTitle = '更新邀约';
          $scope.modal = $modal({scope: $scope, templateUrl: 'partials/bd/leads/modal.invitation.html?'+new Date().getTime(), show: true });
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
                          $scope.showInvitationListView();
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
                          $scope.showInvitationListView();
                          //$rootScope.hideLoading();
                      }, function(error) {
                          //$rootScope.hideLoading();
                      });
                  }
              }
          );
      }

    $scope.gotolist = function() {
      $location.path("/bd-admin/leads_list");
    };

  }
]);
