'use strict';

/**
 * The position's role management controller.
 *
 * @author czq
 * @version 1.0
 */
angular.module('ywsApp').controller('PositionRoleController', [
    '$scope', '$modal', '$rootScope', 'SweetAlert','PositionRoleService','RoleService',
    function($scope,   $modal,   $rootScope,   SweetAlert , PositionRoleService, RoleService ) {

        $scope.reset = reset;
        $scope.getPositionRoleByFilter = getPositionRoleByFilter;
        $scope.getAllRoles = getAllRoles;
        $scope.edit = edit;
        $scope.toggleRole = toggleRole;
        $scope.containsRole = containsRole;
        $scope.save = save;
        $scope.remove = remove;

        $scope.sf_position = {};
        $scope.getAllRoles();

        $scope.list = list;
        $('.collapse').collapse();


        //岗位信息列表
        function list(tableState) {
            $scope.gTableState = tableState;
            $scope.isLoading = true;
            $scope.pagination = tableState.pagination;
            $scope.start = $scope.pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
            $scope.number = $scope.pagination.number || 10;  // Number of entries showed per page.
            PositionRoleService.getPositionRoleByFilter($scope.sf_position,$scope.start, $scope.number)
                .then(function (response) {
                    if(response.status == "FAILURE"){
                        SweetAlert.swal( response.data,"请重试","error");
                    }
                    else{
                        var result = {};
                        result.data = response.data.list;
                        result.numberOfPages = response.data.pages;
                        $scope.position_roles = result.data;
                        tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                    }
                    $scope.isLoading = false;
                }
            );
        };

        /**
         * Get position's roles list by filter
         */
        function getPositionRoleByFilter(){

            $scope.isLoading = true;
            $scope.gTableState.pagination.start=0;
            $scope.pagination = $scope.gTableState.pagination;
            $scope.start = $scope.pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
            $scope.number = $scope.pagination.number || 10;  // Number of entries showed per page.
            var promise = null;
            promise = PositionRoleService.getPositionRoleByFilter($scope.sf_position,$scope.start,$scope.number);
            promise.then(function(response) {
                if(response.status == "FAILURE"){
                    SweetAlert.swal( response.data,"请重试","error");
                }
                else{
                    var result = {};
                    result.data = response.data.list;
                    result.numberOfPages = response.data.pages;
                    $scope.position_roles = result.data;
                    $scope.gTableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                }
                $scope.isLoading = false;
            }, function(error) {
                SweetAlert.swal('查询岗位角色信息失败', 'error');
            });
        }

        /**
         * Gets roles from server side and render them.
         */
        function getAllRoles() {
            var promise = RoleService.list();
            promise.then(function(response) {
                if(response.status == "FAILURE"){
                    SweetAlert.swal( response.data,"请重试","error");
                }
                else{
                    $scope.roles = response.data;
                }
            },
            function(error) {
               // console.log(error);
            });
        }

        /**
         * Reset the search form.
         */
        function reset(){
            $scope.sf_position = {};
        }

        /**
         * Edit the position's roles.
         * @param position_role
         */
        function edit(position_role) {
            $scope.position_role = angular.copy(position_role);
            if(position_role.roles[0]){
                $scope.old_position_role = position_role.roles[0];
            }//备份旧数据
            else{
                $scope.old_position_role = {};
            }
            $scope.roles.names = [];
            showModal();
        }

        /**
         * Show the modal of the position role.
         */
        function showModal(){
            $scope.modalTitle = '修改岗位角色';
            $scope.modal = $modal({scope: $scope, templateUrl: 'partials/hr/position/modal.position.role.html', show: true });
        }

        /**
         * Checks whether the given role is in the current position's role list.
         * @param role the role to check
         * @return true if it contains, otherwise false
         */
        function containsRole(role) {
            var found = false;
            if ($scope.position_role.roles[0]) {
                var nameAll = $scope.position_role.roles[0].name;
                if(nameAll != undefined){
                    $scope.roles.names = nameAll.split(",");
                    angular.forEach($scope.roles.names, function(p) {
                        if (p === role.name) {
                            found = true;
                        }
                    });
                }
            }
            return found;
        }

        /**
         * Toggles role inclusion.
         * @param role the role
         */
        function toggleRole(role) {
            if (containsRole(role)) {
                angular.forEach($scope.roles.names, function (p,index) {
                    if (p === role.name) {
                        $scope.roles.names.splice(index, 1);
                        return;
                    }
                });
            }
            else {
                if (!$scope.roles.names) {
                    $scope.roles.names = [];
                }
                $scope.roles.names.push(role.name);
            }
            $scope.position_role.roles[0] = {};
            if($scope.roles.names.length != 0){
                $scope.position_role.roles[0].name = $scope.roles.names.join(",");
            }
        }

        /**
         * Saves the position role.
         */
        function save() {
            $scope.dataLoading = true;
            if(!$scope.position_role.roles[0]){
                $scope.position_role.roles[0] = {};
            }
            $scope.position_role.roles[1] = $scope.old_position_role;
            var promise = PositionRoleService.update($scope.position_role);
            promise.then(function(response) {
                if(response.status == "FAILURE"){
                    SweetAlert.swal( response.data,"请重试","error");
                }
                else{
                    $scope.modal.hide();
                    $scope.sf_position = {};
                    $scope.getPositionRoleByFilter();
                    SweetAlert.swal("修改成功","确定","success");
                }
                $scope.dataLoading = false;
            }, function(error) {
                $scope.dataLoading = false;
                SweetAlert.swal("修改失败","请重试","error");
            });
        }

        /**
         * Remove the position's role
         */
        function remove(position_role){
            SweetAlert.swal({
                    title: "确定要删除该岗位的角色吗？",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: '#DD6B55',
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    closeOnConfirm: true
                }, function(confirm) {
                    if (confirm) {
                        if(position_role.roles[0]){
                            $scope.old_position_role = position_role.roles[0];
                        }
                        else{
                            $scope.old_position_role = {};
                        }
                        $scope.position_role = angular.copy(position_role);
                        $scope.position_role.roles[0]={};
                        $scope.position_role.roles[1] = $scope.old_position_role;
                        var promise = PositionRoleService.update($scope.position_role);
                        promise.then(function(response) {
                            if(response.status == "FAILURE"){
                                SweetAlert.swal( response.data,"请重试","error");
                            }
                            else{
                                SweetAlert.swal('删除成功', '确定','success');
                                $scope.sf_position = {};
                                $scope.getPositionRoleByFilter();
                            }
                        }, function(error) {
                            SweetAlert.swal('删除失败', '请重试', 'error');
                        });
                    }
                }
            );
        }

    }
]);
