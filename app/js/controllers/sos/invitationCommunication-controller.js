'use strict';

/**
 * The InvitationCommunication management controller.
 *
 * @author wangzhihang@youwinedu.com
 * @version 1.0
 */
angular.module('ywsApp').controller('InvitationCommunicationController', ['$scope', 'InvitationCommunicationService', '$modal', '$rootScope', 'SweetAlert','$sce',
  function($scope, InvitationCommunicationService, $modal, $rootScope, SweetAlert,$sce) {
	$scope.sce = $sce.trustAsResourceUrl;
	$scope.CrmInvitationCommunicationVoForCreate = {};

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
        InvitationCommunicationService.list($scope.start, $scope.number,tableState).then(function (result) {
            $scope.displayed = result.data;
            tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
            $scope.isLoading = false;
        });
    };




    /**
     * Shows the new invitationCommunication dialog.
     */
    function add(personState,personType,personId) {
      console.log('Starting creating new invitationCommunication.');
      $scope.CrmInvitationCommunicationVoForCreate = {};
      $scope.CrmInvitationCommunicationVoForCreate.personState = personState;
      $scope.CrmInvitationCommunicationVoForCreate.personType = personType;
      $scope.CrmInvitationCommunicationVoForCreate.personId = personId;
      showModal();
    }

    /**
     * Shows the invitationCommunication modal.
     * It checks $scope.invitationCommunication for existence. If it exists, it tries to render it.
     * The logic is handled by angular itself.
     */
    function showModal() {
      $scope.modalTitle = typeof $scope.CrmInvitationCommunicationVoForCreate.id === 'undefined' ? '添加沟通记录' : '更新沟通记录';
      $scope.modal = $modal({scope: $scope, templateUrl: 'partials/sos/invitationCommunication/modal.invitationCommunication.html', show: true});
    }



    /**
     * Saves the current invitationCommunication.
     */
    function save() {
      console.log('Saving the invitationCommunication.');
      $scope.dataLoading = true;
      if (typeof $scope.CrmInvitationCommunicationVoForCreate.id === 'undefined') {
        var promise = InvitationCommunicationService.create($scope.CrmInvitationCommunicationVoForCreate);
        promise.then(function(CrmInvitationCommunicationVoForCreate) {
          $scope.dataLoading = false;
          $scope.modal.hide();
        }, function(error) {
          $scope.dataLoading = false;
        });
      } else {
        var promise = InvitationCommunicationService.update($scope.CrmInvitationCommunicationVoForCreate);
        promise.then(function(CrmInvitationCommunicationVoForCreate) {
          $scope.dataLoading = false;
          $scope.modal.hide();
        }, function(error) {
          $scope.dataLoading = false;
        });
      }
    }



    /**
     * Edit InvitationCommunication.
     * @param InvitationCommunication the InvitationCommunication to edit
     */
    function edit(crmInvitationCommunication) {
      console.log('Editing invitationCommunication : ' + JSON.stringify(crmInvitationCommunication));
      $scope.CrmInvitationCommunicationVoForCreate = angular.copy(crmInvitationCommunication);
      showModal();
    }



    /**
     * Delete InvitationCommunication.
     * @param InvitationCommunication the InvitationCommunication to delete
     */
    function remove(crmInvitationCommunication) {
      console.log('Deleting InvitationCommunication : ' + JSON.stringify(crmInvitationCommunication));
      SweetAlert.swal({
         title: "确定要删除吗？",
         type: "warning",
         showCancelButton: true,
         confirmButtonColor: '#fe9900',
         confirmButtonText: '确定',
         cancelButtonText: '取消',
         closeOnConfirm: true
       }, function(confirm) {
         if (confirm) {
           var promise = InvitationCommunicationService.remove(crmInvitationCommunication);
          // $rootScope.showLoading();
           promise.then(function() {
             //$rootScope.hideLoading();
           }, function(error) {
             //$rootScope.hideLoading();
           });
         }
       }
      );
    }



    /**
     * view InvitationCommunication.
     * @param InvitationCommunication the InvitationCommunication to view
     */
    function view(crmInvitationCommunication) {
      console.log('Viewing InvitationCommunication : ' + JSON.stringify(crmInvitationCommunication));
      $scope.CrmInvitationCommunicationVoForCreate = angular.copy(crmInvitationCommunication);

      if($scope.CrmInvitationCommunicationVoForCreate.personState == '2'){
    	  $scope.modalTitle = '查看leads信息';
      }
      if($scope.CrmInvitationCommunicationVoForCreate.personState == '1'){
    	  $scope.modalTitle = '查看客户信息';
      }
      $scope.modal = $modal({scope: $scope, templateUrl: 'partials/sos/invitationCommunication/modal.viewtest.html', show: true});
    }





  }
]);
