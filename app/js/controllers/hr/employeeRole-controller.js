'use strict';

/**
 * The employee role manange controller.
 *
 * @author czq
 * @version 1.0
 */
angular.module('ywsApp').controller('EmployeeRoleController', [
    '$scope', '$modal', '$rootScope', 'SweetAlert','RoleService','DepartmentService','PositionService','EmployeeRoleService','AuthenticationService',
    function($scope,   $modal,   $rootScope,   SweetAlert ,RoleService,DepartmentService, PositionService,EmployeeRoleService,AuthenticationService ) {

        $scope.showSelectDepartment = showSelectDepartment;
        $scope.findSelectedDepartment = findSelectedDepartment;
        $scope.selectDepartment = selectDepartment;
        $scope.getAllDepartments = getAllDepartments;
        $scope.departmentSelected = departmentSelected;
        $scope.reset = reset;
        $scope.getEmployeeRoleByFilters = getEmployeeRoleByFilters;
        $scope.getPositions = getPositions;
        $scope.list = list;
        $scope.edit = edit;
        $scope.getAllRoles = getAllRoles;
        $scope.containsRole = containsRole;
        $scope.toggleRole = toggleRole;
        $scope.save = save;

        $scope.sf_employee = {};

        //Retrieve departments at first loading.
        $scope.getAllDepartments();
        $scope.getAllRoles();
        $('.collapse').collapse();

        /**
         * Gets employees and roles from server side and render them.
         */
        function list(tableState){
            $scope.gTableState = tableState;
            $scope.isLoading = true;
            $scope.pagination = tableState.pagination;
            $scope.start = $scope.pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
            $scope.number = $scope.pagination.number || 10;  // Number of entries showed per page.
            var promise = EmployeeRoleService.getEmployeeRoleByFilters($scope.sf_employee,$scope.start, $scope.number);
            promise.then(function(response) {
                if(response.status == "FAILURE"){
                    SweetAlert.swal( response.data,"请重试","error");
                }
                else{
                    var result = {};
                    result.data = response.data.list;
                    result.numberOfPages = response.data.pages;
                    $scope.employee_roles = result.data;
                    tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                    $scope.isLoading = false;
                }
            }, function(error) {
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
                //console.log(error);
            });
        }

        /**
         * Checks whether the given permission is in the current role's permission list.
         * @param permission the permission to check
         * @return true if it contains, otherwise false
         */
        function containsRole(role) {
            var found = false;
            if ($scope.employee_role.roles) {
                angular.forEach($scope.employee_role.roles, function(p) {
                    if(p != null && p.id === role.id) {
                        found = true;
                    }
                });
            }
            return found;
        }

        /**
         * Toggles role inclusion.
         * @param role the role
         */
        function toggleRole(role) {
            if (containsRole(role)) {
                angular.forEach($scope.employee_role.roles, function (p,index) {
                    if (p!= null && p.id === role.id) {
                    	$scope.employee_role.roles.splice(index, 1);
                        return;
                    }
                });
            }
            else {
            	$scope.employee_role.roles.push(role);
          }
        }

        /**
         * Saves the employee role.
         */
        function save() {
            var promise = EmployeeRoleService.update($scope.employee_role);
            promise.then(function(response) {
                $scope.modal.hide();
                if(response.status == "FAILURE"){
                    $scope.sf_employee = {};
                    getEmployeeRoleByFilters();
                    $scope.roles.names = undefined;
                    $scope.employee_role.roles[0] = undefined;
                    SweetAlert(response.data,"请重试","error");
                }
                else{
                    $scope.sf_employee = {};
                    getEmployeeRoleByFilters();
                    $scope.employee_role.roles[0] = undefined;
                    $scope.roles.names = undefined;
                    SweetAlert.swal("修改成功",'确定','success');
                }
            }, function(error) {
                $scope.modal.hide();
                $scope.sf_employee = {};
                getEmployeeRoleByFilters();
                $scope.roles.names = undefined;
                $scope.employee_role.roles[0] = undefined;
                SweetAlert.swal("修改失败",'请重试','error');
            });
        }

        /**
         * Edit the employee's roles.
         * @param employee_role
         */
        function edit(employee_role) {
            $scope.employee_role = angular.copy(employee_role);
            showModal();
        }

        /**
         * Show the modal of the employee role.
         */
        function showModal(){
            $scope.modalTitle = '修改人员角色';
            $scope.modal = $modal({scope: $scope, templateUrl: 'partials/hr/employee/modal.employee.role.html', show: true });
        }

        /**
         * Gets all positions for the given department.
         * @param departmentId the department id
         */
        function getPositions(departmentId) {
            var promise = PositionService.list(departmentId);
            promise.then(function(response) {
                if(response.status == "FAILURE"){
                    SweetAlert.swal( response.data,"请重试","error");
                }
                else{
                    $scope.positions = response.data;
                }
            }, function(error) {
            });
        }

        /**
         * Gets all departments for the current user's organization and render as a tree.
         */
        function getAllDepartments() {
            var promise = DepartmentService.list(AuthenticationService.currentUser().organization.id);
            promise.then(function(response) {
                if(response.status == "FAILURE"){
                    SweetAlert.swal( response.data,"请重试","error");
                }
                else{
                    $scope.departments = response.data;
                }
            }, function(error) {
            });
        }

        /**
         * Shows select department dialog.
         */
        function showSelectDepartment() {
            $scope.modalTitle = '选择机构';
            $scope.modal = $modal({scope: $scope, templateUrl: 'partials/hr/department/modal.department.html', show: true });
            $scope.modalDepartments = angular.copy($scope.departments);
        }

        /**
         * Triggered when department is selected.
         * @param node node
         */
        function selectDepartment(node) {
            $scope.newDepartment = findSelectedDepartment($scope.departments, node.id);
        }

        /**
         * Recursively find the department with the given id.
         * @param departments the departments to start with
         * @param id the id of department to find
         * @return the department, or false if not found
         */
        function findSelectedDepartment(departments, id) {
            var found = false;
            angular.forEach(departments, function(department) {
                if (found) {
                    return;
                }
                if (department.id == id) {
                    found = department;
                    return;
                }
                found = findSelectedDepartment(department.children, id);
            });
            return found;
        }

        /**
         * Triggered when department is selected.
         */
        function departmentSelected() {
            $scope.sf_employee.department = $scope.newDepartment;
            $scope.getPositions($scope.newDepartment.id);
            $scope.modal.hide();
        }

        /**
         * Reset the search form.
         */
        function reset(){
            $scope.sf_employee = {};
        }

        /**
         * Get the employees list by filters.
         */
        function getEmployeeRoleByFilters(){
            $scope.isLoading = true;
            $scope.gTableState.pagination.start=0;
            $scope.pagination = $scope.gTableState.pagination;
            $scope.start = $scope.pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
            $scope.number = $scope.pagination.number || 10;  // Number of entries showed per page.
            var promise = EmployeeRoleService.getEmployeeRoleByFilters($scope.sf_employee,$scope.start,$scope.number);
            promise.then(function(response) {
                if(response.status == "FAILURE"){
                    SweetAlert.swal( response.data,"请重试","error");
                }
                else{
                    var result = {};
                    result.data = response.data.list;
                    result.numberOfPages = response.data.pages;
                    $scope.employee_roles = result.data;
                    $scope.gTableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                    $scope.isLoading = false;
                }
            }, function(error) {
                SweetAlert.swal('查询人员角色信息失败', 'error');
            });
        }
    }
]);

