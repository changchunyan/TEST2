'use strict';

/**
 * The position management controller.
 *
 * @author czq
 * @version 1.0
 */
angular.module('ywsApp').controller('PositionManagementController', [
    '$scope', '$modal', '$rootScope', 'SweetAlert','PositionManagementService',
    function($scope,   $modal,   $rootScope,   SweetAlert , PositionManagementService ) {

        var ctrl = this;
        $scope.getPositionByFilter = getPositionByFilter;
        $scope.reset = reset;
        $scope.addPosition = addPosition;
        $scope.editPosition = editPosition;
        $scope.removePosition = removePosition;
        $scope.savePosition = savePosition;
        $scope.list = list;
        $scope.getPositionList = getPositionList;

        $scope.sf_position = {};
        $('.collapse').collapse();

        //岗位信息列表
        function getPositionList(tableState) {
            $scope.gTableState = tableState;
            $scope.isLoading = true;
            $scope.pagination = tableState.pagination;
            $scope.start = $scope.pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
            $scope.number = $scope.pagination.number || 10;  // Number of entries showed per page.
            PositionManagementService.getPositionByFilter($scope.sf_position,$scope.start, $scope.number)
                .then(function (response) {
                    if(response.status == "FAILURE"){
                        SweetAlert.swal(response.data,"请重试","error");
                    }
                    else{
                        var result = {};
                        result.data = response.data.list;
                        result.numberOfPages = response.data.pages
                        $scope.positions = result.data;
                        tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                        $scope.isLoading = false;
                    }
                }
            );
        };
        /**
         * Get the positions by filters.
         */
        function getPositionByFilter(){
            $scope.isLoading = true;
            $scope.gTableState.pagination.start=0;
            $scope.pagination = $scope.gTableState.pagination;
            $scope.start = $scope.pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
            $scope.number = $scope.pagination.number || 10;  // Number of entries showed per page.
            var promise = null;
            promise = PositionManagementService.getPositionByFilter($scope.sf_position,$scope.start,$scope.number);
            promise.then(function(response) {
                if(response.status == "FAILURE"){
                    SweetAlert.swal(response.data,"请重试","error");
                }
                else{
                    var result = {};
                    result.data = response.data.list;
                    result.numberOfPages = response.data.pages
                    $scope.positions = result.data;
                    $scope.gTableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                    $scope.isLoading = false;
                }
            }, function(error) {
                SweetAlert.swal('查询岗位信息失败', 'error');
            });
        }

        function list(){
            var promise = null;
            promise = PositionManagementService.list();
            promise.then(function(positions) {
                if(response.status == "FAILURE"){
                    SweetAlert.swal( response.data,"请重试","error");
                }
                else{
                    $scope.positions = response.data;
                }
            }, function(error) {
                SweetAlert.swal('获取岗位信息失败', 'error');
            });
        }

        /**
         * Reset the search form.
         */
        function reset(){
            $scope.sf_position = {};
        }

        /**
         * Add position.
         */
        function addPosition(){
            $scope.modalTitle = '添加岗位';
            $scope.position = {};
            $scope.modal = $modal({scope: $scope, templateUrl: 'partials/hr/position/modal.position.html', show: true });
        }

        /**
         * Edit position.
         * @param position
         */
        function editPosition(position){
            $scope.modalTitle = '修改岗位';
            $scope.position = position;
            $scope.modal = $modal({scope: $scope, templateUrl: 'partials/hr/position/modal.position.html', show: true });
        }

        /**
         * Save position.
         */
        function savePosition(){
            var promise = null;
            var promise2 = null;
            //先判断岗位名是否有重复的，如果有，那么就提示。
            promise = PositionManagementService.list();
            promise.then(function(response) {
                if(response.status == "FAILURE"){
                    SweetAlert.swal( response.data,"请重试","error");
                }
                else{
                    $scope.positionlist = response.data;
                    var isExist = false;
                    if($scope.positionlist){
                        angular.forEach($scope.positionlist,function(p,index){
                            if(!$scope.position.id && $scope.position.name == p.name){
                                SweetAlert.swal('岗位名不允许重复','请重试', 'error');
                                isExist = true;
                                return;
                            }
                            else if($scope.position.name == p.name && $scope.position.id && p.id != $scope.position.id){
                                SweetAlert.swal('岗位名不允许重复','请重试', 'error');
                                isExist = true;
                                return;
                            }
                        });
                    }
                    if(!isExist){
                        if (!$scope.position.id) {
                            //Check if the position name is exist.
                            promise2 = PositionManagementService.add($scope.position);
                        } else {
                            promise2 = PositionManagementService.edit($scope.position);
                        }
                        promise2.then(function(response) {
                            if(response.status == "FAILURE"){
                                SweetAlert.swal( response.data,"请重试","error");
                            }
                            else{
                                SweetAlert.swal('操作成功', 'success');
                            }
                            $scope.modal.hide();
                            reset();
                            getPositionByFilter();
                        }, function(error) {
                            SweetAlert.swal('操作失败', 'error');
                            reset();
                            getPositionByFilter();
                        });
                    }
                }
            }, function(error) {
                SweetAlert.swal('操作失败', 'error');
            });
        }

        /**
         * Remove position.
         * @param position
         */
        function removePosition(position){
            SweetAlert.swal({
                    title: "确定要删除吗？请确保该岗位下没有任何在职员工！",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: '#DD6B55',
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    closeOnConfirm: true
                }, function(confirm) {
                    if (confirm) {
                        var promise = PositionManagementService.remove(position);
                        promise.then(function(response) {
                            reset();
                            getPositionByFilter();
                            if(response.status == "FAILURE"){
                                SweetAlert.swal( response.data,"请重试","error");
                            }
                            else{
                                SweetAlert.swal('删除成功');
                            }
                        }, function(error) {
                            reset();
                            getPositionByFilter();
                            SweetAlert.swal('删除失败，该岗位下还有在职员工!');
                        });
                    }
                }
            );
        }
    }
]);
