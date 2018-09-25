'use strict';

/**
 * The CoursePlan management controller.
 *
 * @author wangzhihang@youwinedu.com
 * @version 1.0
 */
angular.module('ywsApp').controller('O2oCoursePlanController', ['$scope', 'O2oCoursePlanService', '$modal', '$rootScope', 'SweetAlert',
  function($scope, O2oCoursePlanService, $modal, $rootScope, SweetAlert) {

	$scope.OmsCoursePlanVoForCreate = {};
      $scope.record = {};

    $scope.remove = remove;
    $scope.view = view;


    $scope.consume = consume;
    $scope.showListView = showListView;


    $scope.addUnsatisfied = addUnsatisfied;
    $scope.showModal = showModal;
    $scope.saveUnsatisfied = saveUnsatisfied;

    /**
     * 未消课列表
     */
    $scope.callServer = function callServer(tableState) {

        $scope.isLoading = true;

        $scope.myCoursePlanTableState = tableState;

        var pagination = tableState.pagination;
        $scope.CoursePlanTableState=tableState;
        var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
        var  number = pagination.number || 10;  // Number of entries showed per page.
        O2oCoursePlanService.list(start, number,tableState).then(function (result) {
            $scope.displayed = result.data;
            tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
            $scope.isLoading = false;
        });
    };

    /**
     * 已消课列表
     */
    $scope.callServerrecord = function callServerrecord(tableState) {

        $scope.isrendLoading = true;

        $scope.myCoursePlanRecordTableState = tableState;

        var pagination = tableState.pagination;
        var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
        var number =  10;  // Number of entries showed per page.
        O2oCoursePlanService.recordlist(start, number,tableState).then(function (result) {
            $scope.displayedrecord = result.data;
            tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
            $scope.isrendLoading = false;
        });
    };




    /**
     * 显示不满意弹窗
     */
    function addUnsatisfied(omsCoursePlan) {
      $scope.OmsCoursePlanVoForCreate = {};
      $scope.OmsCoursePlanVoForCreate.id = omsCoursePlan.id;
        $scope.record.id = omsCoursePlan.id;
      showModal();
    }

    /**
     * 不满意弹窗
     */
    function showModal() {
    	$scope.modalTitle = '不满意取消消课';
        $scope.modalCourseType = $modal({scope: $scope, templateUrl: 'partials/sos/coursePlan/modal.record.html', show: true});
    }


    function saveUnsatisfied() {
        // console.log('Saving the unsatisfied.');
           var promise = O2oCoursePlanService.consume($scope.record);
           promise.then(function(OmsCoursePlanVoForCreate) {
             $scope.dataLoading = false;
             $scope.showListView();
             $scope.modalCourseType.hide();
           }, function(error) {
             $scope.dataLoading = false;
               SweetAlert.swal("失败");
           });

          

       }

    $scope.auditPass = function auditPass(id,audit_pass) {
        //console.log(id);console.log(audit_pass);
           var OmsCoursePlan = {};
           OmsCoursePlan.id = id;
           OmsCoursePlan.auditPass = audit_pass;
           var promise = O2oCoursePlanService.auditPass(OmsCoursePlan);
           promise.then(function(result) {
            SweetAlert.swal(result);
             //$scope.dataLoading = false;
             //$scope.modal.hide();
            $scope.showListView();
           }, function(error) {
             //$scope.dataLoading = false;
             SweetAlert.swal("审核失败");
           });

           

       }


    /**
     * Saves the current invitationCommunication.
     */
    function save() {
     // console.log('Saving the unsatisfied.');

        var promise = O2oCoursePlanService.update($scope.OmsCoursePlanVoForCreate);
        promise.then(function(OmsCoursePlanVoForCreate) {
          $scope.dataLoading = false;
          $scope.modal.hide();
        }, function(error) {
          $scope.dataLoading = false;
        });

    }







    /**
     * Delete InvitationCommunication.
     * @param InvitationCommunication the InvitationCommunication to delete
     */
    function remove(omsCoursePlan) {
      //console.log('Deleting InvitationCommunication : ' + JSON.stringify(OmsCoursePlan));
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
           var promise = O2oCoursePlanService.remove(omsCoursePlan);
           //$rootScope.showLoading();
           promise.then(function() {
             //$rootScope.hideLoading();
               $scope.showListView();
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
    function view(OmsCoursePlan) {
      $scope.CrmInvitationCommunicationVoForCreate = angular.copy(crmInvitationCommunication);

      if($scope.CrmInvitationCommunicationVoForCreate.personState == '2'){
    	  $scope.modalTitle = '查看leads信息';
      }
      if($scope.CrmInvitationCommunicationVoForCreate.personState == '1'){
    	  $scope.modalTitle = '查看客户信息';
      }
      $scope.modal = $modal({scope: $scope, templateUrl: 'partials/sos/invitationCommunication/modal.viewtest.html', show: true});
    }





    /**
     * 消课和取消
     */
    function consume(omsCoursePlan,isPast) {
    	omsCoursePlan.isPast = isPast;
    	omsCoursePlan.remark = '无';
      var promise = O2oCoursePlanService.consume(omsCoursePlan);
      //$rootScope.showLoading();
      promise.then(function() {
        //$rootScope.hideLoading();
      }, function(error) {
        //$rootScope.hideLoading();
      });

      $scope.showListView();

    }


    /**
     * 显示列表页面
     */
    function showListView() {

    	//$scope.myCoursePlanTableState.pagination.start = 0;
        $scope.callServer($scope.myCoursePlanTableState);

        //$scope.myCoursePlanRecordTableState.pagination.start = 0;
        $scope.callServerrecord($scope.myCoursePlanRecordTableState);



    }










  }
]);
