'use strict';

/**
 * The role management controller.
 *
 * @author ywu
 * @version 1.0
 */
angular.module('ywsApp').controller('RoleManagementController', ['$scope', 'RoleService', '$modal', 'PermissionService', '$rootScope', 'SweetAlert',
  function($scope, RoleService, $modal, PermissionService, $rootScope, SweetAlert) {

    $scope.getAllRoles = getAllRoles;
    $scope.edit = edit;
    $scope.remove = remove;
    $scope.add = add;
    $scope.save = save;
    $scope.getAllPermissions = getAllPermissions;
    $scope.containsPermission = containsPermission;
    $scope.togglePermission = togglePermission;
    $scope.getRolesByFilter = getRolesByFilter;
    $scope.reset = reset;
    $scope.list = list;
    $scope.hide = hide;
    $scope.checkChild = checkChild;
    $scope.generatePermissionParentId = generatePermissionParentId;
    $scope.checkParent = checkParent;
    $scope.uncheckChild = uncheckChild;

    $scope.sf_role = {};
    $scope.getAllPermissions();

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
      });
    }

    /**
     * Gets permissions from server side.
     */
    function getAllPermissions() {
      var promise = PermissionService.list();
      promise.then(function(response) {
          if(response.status == "FAILURE"){
              SweetAlert.swal( response.data,"请重试","error");
          }
          else{
              $scope.permissions = response.data;
              angular.forEach($scope.permissions, function(p,index){
                  generatePermissionParentId(p.children, p.id);
              });
              $scope.permissionsBak = angular.copy($scope.permissions);
          }
      },
      function(error) {
        //console.log(error);
      });
    }

      /**
       * 生成pid
       * @param permissions
       * @param pid
       */
    function generatePermissionParentId(permissions, pid){
        angular.forEach(permissions, function(p,index){
            p.pid = pid;
            generatePermissionParentId(p.children, p.id);
        });
    }

    /**
     * Edit role.
     * @param role the role to edit
     */
    function edit(role) {
      $scope.role = angular.copy(role);
      showModal();
    }

    /**
     * Delete role.
     * @param role the role to delete
     */
    function remove(role) {
     // console.log('Deleting role : ' + JSON.stringify(role));
      SweetAlert.swal({
          title: "确定要删除吗？删除后原先设置本角色的岗位和员工将不再有本角色对应的权限，请谨慎操作！",
         type: "warning",
         showCancelButton: true,
         confirmButtonColor: '#DD6B55',
         confirmButtonText: '确定',
         cancelButtonText: '取消',
         closeOnConfirm: true
       }, function(confirm) {
         if (confirm) {
           var promise = RoleService.remove(role);
           promise.then(function(response) {
               if(response.status == "FAILURE"){
                   SweetAlert.swal( response.data,"请重试","error");
               }
               else{
                   getRolesByFilter();
                   SweetAlert.swal('删除角色成功','确定', 'success');
               }
           }, function(error) {
             SweetAlert.swal('删除角色失败', '请重试','error');
           });
         }
       }
      );
    }

    /**
     * Shows the role modal.
     * It checks $scope.role for existence. If it exists, it tries to render it.
     * The logic is handled by angular itself.
     */
    function showModal() {
      $scope.permissions.id = undefined;
      $scope.modalTitle = typeof $scope.role.id === 'undefined' ? '添加角色' : '更新角色';
      $scope.modal = $modal({scope: $scope, templateUrl: 'partials/admin/modal.role.html', show: true });
    }

    /**
     * Shows the new role dialog.
     */
    function add() {
      //console.log('Starting creating new role.');
      $scope.permissions.id = [];
      $scope.role = {};
        $scope.role.permissions = [];
      showModal();
    }

    /**
     * Saves the current role.
     */
    function save() {
        if (typeof $scope.role.id === 'undefined') {
            //检查角色名是否重复
            var promise1 = RoleService.checkExist($scope.role);
            promise1.then(function(response){
                if(response.status == "FAILURE"){
                    SweetAlert.swal( response.data,"请重试","error");
                }
                else{
                    if(response.data.length > 0){
                        //新增情况下，只要按名字查询能查出来，就是有重复
                        SweetAlert.swal("角色名称和显示名称不允许重复","请重试","error");
                        return false;
                    }
                    else{
                        //没有重复名字的情况
                        var promise = RoleService.create($scope.role);
                        promise.then(function(response) {
                            if(response.status == "FAILURE"){
                                SweetAlert.swal( response.data,"请重试","error");
                            }
                            else{
                                $scope.modal.hide();
                                getRolesByFilter();
                                SweetAlert.swal('添加成功','确定','success');
                            }
                            $scope.permissions = angular.copy($scope.permissionsBak);
                        }, function(error) {
                            SweetAlert.swal('添加失败','请重试','error');
                            $scope.permissions = angular.copy($scope.permissionsBak);
                        });
                    }
                }
            })
        }
        else {
            var promise1 = RoleService.checkExist($scope.role);
            promise1.then(function(response){
                if(response.status == "FAILURE"){
                    SweetAlert.swal( response.data,"请重试","error");
                }
                else{
                    var result = response.data;
                    var exist = false;
                    angular.forEach(result,function(p,index){
                        if(p.id != $scope.role.id){
                            exist = true;
                            return;
                        }
                    });
                    if(exist == false){
                        //不重复
                        var promise = RoleService.update($scope.role);
                        promise.then(function(response1) {
                            if(response1.status == "FAILURE"){
                                SweetAlert.swal( response1.data,"请重试","error");
                            }
                            else{
                                $scope.modal.hide();
                                getRolesByFilter();
                                SweetAlert.swal('修改成功','success');
                            }
                            $scope.permissions = angular.copy($scope.permissionsBak);
                        }, function(error) {
                            SweetAlert.swal('修改失败','请重试','error');
                            $scope.permissions = angular.copy($scope.permissionsBak);
                        });
                    }
                    else{
                        //新增情况下，只要按名字查询能查出来，就是有重复
                        SweetAlert.swal("角色名称和显示名称不允许重复","请重试","error");
                        return false;
                    }
                }
            },function(error){
                SweetAlert.swal("角色名称和显示名称不允许重复","请重试","error");
                return false;
            });
        }

    }

      function hide(){
          $scope.modal.hide();
          $scope.permissions = angular.copy($scope.permissionsBak);
      }

    /**
     * Checks whether the given permission is in the current role's permission list.
     * @param permission the permission to check
     * @return true if it contains, otherwise false
     */
    function containsPermission(permission) {
      var found = false;
      if ($scope.role.permissions) {
        angular.forEach($scope.role.permissions,function(p,index){
            if(permission.id == p.id){
                found = true;
                return;
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
        if(containsPermission(permission)){
            angular.forEach($scope.role.permissions,function(p,index){
                if(permission.id == p.id){
                    $scope.role.permissions.splice(index,1);
                    uncheckChild(permission.children);
                    return;
                }
            });
        }
        else{
            checkChild(permission);
            checkParent($scope.permissions, permission);
        }
    }

    /**
     * 勾选某一节点后，将其所有子节点也全部选中
     * @param permission
    */
    function checkChild(permission){
        if(containsPermission(permission)){
            angular.forEach($scope.role.permissions,function(p,index){
                if(permission.id == p.id){
                    $scope.role.permissions.splice(index,1);
                    uncheckChild(permission.children);
                    return;
                }
            });
        }
        else{
            $scope.role.permissions.push(permission);
            angular.forEach(permission.children, function(p,index){
                checkChild(p);
            });
        }
    }

      /**
       * 勾选某一节点，则选中其上层父辈节点
       * @param permissions the permission tree
       * @param permission  the selected permission
       */
    function checkParent(permissions, permission){
        angular.forEach(permissions, function(p,index1){
            if(p.id == permission.pid){
                //定位到当前节点的父级节点
                if(!containsPermission(p)){
                    $scope.role.permissions.push(p);
                }
                checkParent($scope.permissions, p);
                return;
            }
            else{
                checkParent(p.children,permission);
            }
        });
    }

      /**
       * 取消选中某一节点时，需要将其子孙节点都取消
       */

      function uncheckChild(permissions){
          angular.forEach(permissions, function(p,index1){
              if(containsPermission(p)){
                  angular.forEach($scope.role.permissions,function(q,index){
                      if(p.id == q.id){
                          $scope.role.permissions.splice(index,1);
                          uncheckChild(p.children);
                          return;
                      }
                  });
              }
          });
      }

    /**
     * Get the role list for page.
     * @param tableState
     */
    function list(tableState) {
      $scope.gTableState = tableState;
      $scope.isLoading = true;
      $scope.pagination = tableState.pagination;
      $scope.start = $scope.pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
      $scope.number = $scope.pagination.number || 10;  // Number of entries showed per page.
      var promise = RoleService.getRolesByFilter($scope.sf_role,$scope.start,$scope.number);
      promise.then(function(response) {
          if(response.status == "FAILURE"){
              SweetAlert.swal( response.data,"请重试","error");
          }
          else{
              var result = {};
              result.data = response.data.list;
              result.numberOfPages = response.data.pages;
              $scope.roles = result.data;
              tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
              $scope.isLoading = false;
          }
      },
      function(error) {
        //console.log(error);
      });
    }

    /**
     * get the list of roles by filter
     * @param role
     */
    function getRolesByFilter(){
      $scope.isLoading = true;
      $scope.gTableState.pagination.start=0;
      $scope.pagination = $scope.gTableState.pagination;
      $scope.start = $scope.pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
      $scope.number = $scope.pagination.number || 10;  // Number of entries showed per page.
      //特殊处理一下加号，因为urlEncode在编码时会将加号转为空格
      if($scope.sf_role.name != null && $scope.sf_role.name.indexOf("+") != -1){
    	  $scope.sf_role.name = $scope.sf_role.name.replace("+", "%2B")
      }
      var promise = RoleService.getRolesByFilter($scope.sf_role,$scope.start,$scope.number);
      promise.then(function(response) {
          if(response.status == "FAILURE"){
              SweetAlert.swal( response.data,"请重试","error");
          }
          else{
              var result = {};
              result.data = response.data.list;
              result.numberOfPages = response.data.pages;
              $scope.roles = result.data;
              $scope.gTableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
              $scope.isLoading = false;
          }
      }, function(error) {
        SweetAlert.swal('查询角色信息失败', 'error');
      });
    }

    function reset(){
      $scope.sf_role = {};
    }
  }
]);
