'use strict';

/**
 * The InvitationRemind management controller.
 *
 * @author wangzhihang@youwinedu.com
 * @version 1.0
 */
angular.module('ywsApp').controller('InvitationRemindController', ['$scope', 'InvitationRemindService', '$modal', '$rootScope', 'SweetAlert',
  function($scope, InvitationRemindService, $modal, $rootScope, SweetAlert) {

	$scope.CrmInvitationRemindVoForCreate = {};

    $scope.add = add;
    $scope.save = save;
    $scope.edit = edit;
    $scope.remove = remove;
    $scope.view = view;

    /**
     * 列表
     */
    $scope.callServer = function callServer(tableState) {
        ;
        $scope.isLoading = true;
        $scope.pagination = tableState.pagination;
        $scope.start = $scope.pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
        $scope.number = $scope.pagination.number || 10;  // Number of entries showed per page.
        console.log('call server'+tableState);
        InvitationRemindService.list($scope.start, $scope.number,tableState).then(function (result) {
            $scope.displayed = result.data;
            tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
            $scope.isLoading = false;
        });
    };




    /**
     * Shows the new invitationRemind dialog.
     */
    function add(personState,personType,personId) {
      console.log('Starting creating new invitationRemind.');
      $scope.CrmInvitationRemindVoForCreate = {};
      $scope.CrmInvitationRemindVoForCreate.personState = personState;
      $scope.CrmInvitationRemindVoForCreate.personType = personType;
      $scope.CrmInvitationRemindVoForCreate.personId = personId;
      showModal();
    }

    /**
     * Shows the invitationRemind modal.
     * It checks $scope.invitationRemind for existence. If it exists, it tries to render it.
     * The logic is handled by angular itself.
     */
    function showModal() {
      $scope.modalTitle = typeof $scope.CrmInvitationRemindVoForCreate.id === 'undefined' ? '添加邀约提醒' : '更新邀约提醒';
      $scope.modal = $modal({scope: $scope, templateUrl: 'partials/sos/invitationRemind/modal.invitationRemind.html', show: true});
    }



    /**
     * Saves the current invitationRemind.
     */
    function save() {
      console.log('Saving the invitationRemind.');
      $scope.dataLoading = true;
      if (typeof $scope.CrmInvitationRemindVoForCreate.id === 'undefined') {
        var promise = InvitationRemindService.create($scope.CrmInvitationRemindVoForCreate);
        promise.then(function(CrmInvitationRemindVoForCreate) {
          $scope.dataLoading = false;
          $scope.modal.hide();
        }, function(error) {
          $scope.dataLoading = false;
        });
      } else {
        var promise = InvitationRemindService.update($scope.CrmInvitationRemindVoForCreate);
        promise.then(function(CrmInvitationRemindVoForCreate) {
          $scope.dataLoading = false;
          $scope.modal.hide();
        }, function(error) {
          $scope.dataLoading = false;
        });
      }
    }



    /**
     * Edit InvitationRemind.
     * @param InvitationRemind the InvitationRemind to edit
     */
    function edit(crmInvitationRemind) {
      console.log('Editing invitationRemind : ' + JSON.stringify(crmInvitationRemind));
      $scope.CrmInvitationRemindVoForCreate = angular.copy(crmInvitationRemind);
      showModal();
    }



    /**
     * Delete InvitationRemind.
     * @param InvitationRemind the InvitationRemind to delete
     */
    function remove(crmInvitationRemind) {
      console.log('Deleting InvitationRemind : ' + JSON.stringify(crmInvitationRemind));
      SweetAlert.swal({
         title: "确定要删除吗？",
         type: "warning",
         showCancelButton: true,
         confirmButtonColor: '#fe9900 ',
         confirmButtonText: '确定',
         cancelButtonText: '取消',
         closeOnConfirm: true
       }, function(confirm) {
         if (confirm) {
           var promise = InvitationRemindService.remove(crmInvitationRemind);
           //$rootScope.showLoading();
           promise.then(function() {
             $rootScope.hideLoading();
           }, function(error) {
             $rootScope.hideLoading();
           });
         }
       }
      );
    }



    /**
     * view InvitationRemind.
     * @param InvitationRemind the InvitationRemind to view
     */
    function view(crmInvitationRemind) {
      console.log('Viewing InvitationRemind : ' + JSON.stringify(crmInvitationRemind));
      $scope.CrmInvitationRemindVoForCreate = angular.copy(crmInvitationRemind);

      if($scope.CrmInvitationRemindVoForCreate.personState == '2'){
    	  $scope.modalTitle = '查看leads信息';
      }
      if($scope.CrmInvitationRemindVoForCreate.personState == '1'){
    	  $scope.modalTitle = '查看客户信息';
      }
      $scope.modal = $modal({scope: $scope, templateUrl: 'partials/sos/invitationRemind/modal.viewtest.html', show: true});
    }





  }
]);
