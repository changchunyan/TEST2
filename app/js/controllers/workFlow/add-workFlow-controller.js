/**
 * Created by 毅 on 2016/3/20.
 */
var ywsApp = angular.module('ywsApp');
ywsApp.controller('addWorkFlowCtl',
    ['$scope', '$modal', '$rootScope', '$location','$routeParams','SweetAlert','WorkFlowService',
        function($scope, $modal, $rootScope,$location,$routeParams, SweetAlert,WorkFlowService) {
            var oThis = this;
            $scope.getFlowAddDesc = getFlowAddDesc;
            $scope.startFlow = startFlow;
            $scope.selectedFlow = selectedFlow;


            $scope.showFlowList = {};

            /**
             *
             * @param data
             * @private
             */
            function _dealData(data){
                $scope.flowLists = [];
                if(data){
                    $scope.flowLists = data;
                    $scope.showFlowList = $scope.flowLists[0];
                }else{
                    SweetAlert.swal('可操作流程为空');
                }
            }

            function getFlowAddDesc(){
                WorkFlowService.getFlowAddDesc().then(function (result) {
                    console.log(result.data);
                    _dealData(result.data);
                });
            }
            function startFlow(){
                var key = $scope.showFlowList.key;
                SweetAlert.swal({
                        title: "此操作将启动工作流，流程在'我发起的'列表显示？",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: ' #fe9900 ',
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        closeOnConfirm: true
                    }, function(confirm) {
                        if (confirm) {
                            WorkFlowService.getFlowAddSubmit(key).then(function (result) {
                                console.log(result);
                                var id = result.data.taskId;
                                if(check_null(id)){
                                    $location.path('/workflowManager-admin/detail_workflow/'+id);
                                }

                            });
                        }
                    }
                );

            }
            function selectedFlow(row){
                $scope.showFlowList = row;
            }

            (function init(angular){
                $scope.data = {};
                $scope.getFlowAddDesc();
            })(angular);


        }]);
