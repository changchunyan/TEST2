'use strict';

/**
 * The permission management controller.
 *
 * @author chen zhiqing
 * @version 2.0
 */
angular.module('ywsApp').controller('PermissionManagementController', ['$scope', 'PermissionService', '$modal', '$rootScope', 'SweetAlert','$http',
  function($scope, PermissionService, $modal, $rootScope, SweetAlert, $http) {

    //function declaration
    $scope.edit = edit;
    $scope.remove = remove;
    $scope.add = add;
    $scope.save = save;
    $scope.getAllPermissions = getAllPermissions;
    $scope.containsPermission = containsPermission;
    $scope.togglePermission = togglePermission;
    $scope.getPermissionsByFilter = getPermissionsByFilter;
    $scope.list = list;
    $scope.reset = reset;
    $scope.getPermissionTree = getPermissionTree;
    $scope.selectNode = selectNode;
    $scope.findSelectedPermission = findSelectedPermission;

    //variables definition
    $scope.sf_permission = {};

    //Execute function at first load
    $scope.getPermissionTree();

    /**
     * Reset the search form to default.
     */
    function reset(){
      $scope.sf_permission = {};
    }

    /**
     * Gets permissions from server side.
     */
    function list(tableState) {
      $scope.gTableState = tableState;
      $scope.isLoading = true;
      $scope.pagination = tableState.pagination;
      $scope.start = $scope.pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
      $scope.number = $scope.pagination.number || 10;  // Number of entries showed per page.
      //console.log('call server'+tableState);
      var promise = PermissionService.getPermissionsByFilter($scope.sf_permission,$scope.start,$scope.number);
      promise.then(function(response) {
          if(response.status == "FAILURE"){
            SweetAlert.swal( response.data,"请重试","error");
          }
          else{
            var result = {};
            result.data = response.data.list;
            result.numberOfPages = response.data.pages;
            $scope.permissions = result.data;
            tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
            $scope.isLoading = false;
          }
        },
        function(error) {
        });
    }

    /**
     * Get permission by filter.
     */
    function getPermissionsByFilter(){
      $scope.isLoading = true;
      $scope.gTableState.pagination.start=0;
      $scope.pagination = $scope.gTableState.pagination;
      $scope.start = $scope.pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
      $scope.number = $scope.pagination.number || 10;  // Number of entries showed per page.
      var promise = PermissionService.getPermissionsByFilter($scope.sf_permission,$scope.start,$scope.number);
      promise.then(function(response) {
        if(response.status == "FAILURE"){
          SweetAlert.swal( response.data,"请重试","error");
        }
        else{
          var result = {};
          result.data = response.data.list;
          result.numberOfPages = response.data.pages;
          $scope.permissions = result.data;
          $scope.gTableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
          $scope.isLoading = false;
        }
      }, function(error) {
        SweetAlert.swal('查询角色信息失败', 'error');
      });
    }

    /**
     * Gets permissions from server side and render them.
     */
    function getAllPermissions() {
      var promise = PermissionService.list();
      promise.then(function(response) {
          if(response.status == "FAILURE"){
            SweetAlert.swal( response.data,"请重试","error");
          }
          else{
            $scope.permissions = response.data;
          }
      },
      function(error) {
      });
    }

    /**
     * Edit permission.
     * @param permission the permission to edit
     */
    function edit(permission) {
      //console.log('Editing permission : ' + JSON.stringify(permission));
      $scope.permission = angular.copy(permission);
      showModal();
    }

    /**
     * Delete permission.
     * @param permission the permission to delete
     */
    function remove(permission) {
      //console.log('Deleting permission : ' + JSON.stringify(permission));
      SweetAlert.swal({
         title: "确定要删除吗？删除后原先设置该权限的岗位将不再拥有此权限，请谨慎操作！",
         type: "warning",
         showCancelButton: true,
         confirmButtonColor: '#DD6B55',
         confirmButtonText: '确定',
         cancelButtonText: '取消',
         closeOnConfirm: true
       },function(confirm) {
         if (confirm) {
           var promise = PermissionService.remove(permission);
           promise.then(function(response) {
             if(response.status == "FAILURE"){
               SweetAlert.swal( response.data,"请重试","error");
             }
             else{
               SweetAlert.swal('删除成功', 'error');
               getPermissionsByFilter();
               getPermissionTree();
             }
           }, function(error) {
             SweetAlert.swal('删除失败', 'error');
           });
         }
       }
      );
    }

    /**
     * Shows the permission modal.
     * It checks $scope.permission for existence. If it exists, it tries to render it.
     * The logic is handled by angular itself.
     */
    function showModal() {
      $scope.modalTitle = typeof $scope.permission.id === 'undefined' ? '添加权限' : '更新权限';
      $scope.modal = $modal({scope: $scope, templateUrl: 'partials/admin/modal.permission.html', show: true });
    }

    /**
     * Shows the new permission dialog.
     */
    function add() {
      //console.log('Starting creating new permission.');
      $scope.permission = {};
      showModal();
    }

    /**
     * Saves the current permission.
     */
    function save() {
      $scope.dataLoading = true;
      if($scope.selectedPermission != undefined){
        if($scope.permission.parent != undefined && $scope.permission.parent != $scope.selectedPermission){
          //有，但是修改父级
          $scope.permission.parent = $scope.selectedPermission;
        }
        else if($scope.permission.parent == undefined){
          //无父级到有父级
          $scope.permission.parent = $scope.selectedPermission;
        }
      }
      if (typeof $scope.permission.id === 'undefined') {
        var promise = PermissionService.create($scope.permission);
        promise.then(function(response) {
          if(response.status == "FAILURE"){
            SweetAlert.swal( response.data,"请重试","error");
          }
          else{
            $scope.modal.hide();
            getPermissionsByFilter();
            getPermissionTree();
          }
          $scope.dataLoading = false;
        }, function(error) {
          $scope.dataLoading = false;
        });
      } else {
        var promise = PermissionService.update($scope.permission);
        promise.then(function(response) {
          if(response.status == "FAILURE"){
            SweetAlert.swal( response.data,"请重试","error");
          }
          else{
            $scope.modal.hide();
            getPermissionsByFilter();
            getPermissionTree();
          }
          $scope.dataLoading = false;
        }, function(error) {
          $scope.dataLoading = false;
        });
      }
    }

    /**
     * Checks whether the given permission is in the current permission's permission list.
     * @param permission the permission to check
     * @return true if it contains, otherwise false
     */
    function containsPermission(permission) {
      var found = false;
      if ($scope.permission) {
        angular.forEach($scope.permission.permissions, function(p) {
          if (p.id === permission.id) {
            found = true;
          }
        });
      }
      return found;
    }

    /**
     * Toggles permission inclusion.
     * @param permission the permission
     */
    function togglePermission(permission) {
      if (containsPermission(permission)) {
        angular.forEach($scope.permission.permissions, function(p, index) {
          if (p.id === permission.id) {
            $scope.permission.permissions.splice(index, 1);
            return;
          }
        });
      } else {
        if (!$scope.permission.permissions) {
          $scope.permission.permissions = [];
        }
        $scope.permission.permissions.push(permission);
      }
    }

    /**
     * Get the permission tree.
     */
    function getPermissionTree(){
      var promise = PermissionService.getPermissionTree();
      promise.then(function(response){
            if(response.status == "FAILURE"){
              SweetAlert.swal( response.data,"请重试","error");
            }
            else{
              $scope.permissionTree = response.data;
            }
          },
          function(error){
          });
    }

    /**
     * Triggered when a node is selected.
     * @param node the selected node
     */
    function selectNode(node) {
      $scope.selectedNode = node;
      $scope.selectedPermission = findSelectedPermission($scope.permissionTree, node.id);
    }

    /**
     * Find the permission in the permission tree by node id.
     * @param permissionTree the permission tree
     * @param id the node id
     * @returns {boolean} if found, return the permission, else return false.
     */
    function findSelectedPermission(permissionTree, id) {
      var found = false;
      angular.forEach(permissionTree, function (permission) {
        if (found) {
          return;
        }
        if (permission.id == id) {
          found = permission;
          return;
        }
        found = findSelectedPermission(permission.children, id);
      });
      return found;
    }
  }
]);
