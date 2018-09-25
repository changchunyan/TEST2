'use strict';

/**
 * The department management controller.
 *
 * @author ywu
 * @version 1.0
 */
angular.module('ywsApp').controller('DepartmentManagementController',
    ['$scope', '$modal', '$rootScope', 'SweetAlert', 'DepartmentService', 'PositionService', 'PositionManagementService', 'PositionMaintenanceService', 'AuthenticationService', 'EmployeeService', 'ProjectSettingService',
        function ($scope, $modal, $rootScope, SweetAlert, DepartmentService, PositionService, PositionManagementService, PositionMaintenanceService, AuthenticationService, EmployeeService, ProjectSettingService) {

            $scope.getAllDepartments = getAllDepartments;
            $scope.selectNode = selectNode;
            $scope.addRoot = addRoot;
            $scope.addChild = addChild;
            $scope.remove = remove;
            $scope.edit = edit;
            $scope.save = save;
            $scope.changeParent = changeParent;
            $scope.selectParent = selectParent;
            $scope.saveNewParent = saveNewParent;
            $scope.setAsRoot = setAsRoot;
            $scope.canManageDepartment = canManageDepartment;

            $scope.getSelectablePositions = getSelectablePositions;
            $scope.getAllPositions = getAllPositions;
            $scope.containsPosition = containsPosition;
            $scope.togglePosition = togglePosition;
            $scope.addPosition = addPosition;
            $scope.savePosition = savePosition;
            $scope.getPositions = getPositions;
            $scope.editPosition = editPosition;
            $scope.removePosition = removePosition;
            $scope.addPosToDept = addPosToDept;
            $scope.removePosFromDept = removePosFromDept;
            $scope.saveDepartment = saveDepartment;
            $scope.getAllProvince = getAllProvince;
            $scope.getCityByProvince = getCityByProvince;
            $scope.getAreaByCity = getAreaByCity;
            $scope.getAllDictData = getAllDictData;
            $scope.updateDepartment = updateDepartment;
            $scope.showType = showType;
            $scope.getAllDistrict = getAllDistrict;
            $scope.addSchoolPosToDept = addSchoolPosToDept;
            $scope.getAllProjectSetting = getAllProjectSetting; //选择项目机构的所属项目
            $scope.changeProjectSetting = changeProjectSetting; //改变部门的所属项目id

            $scope.getAllPositions();
            $scope.getAllDepartments();
            $scope.getAllProvince();
            $scope.getAllDictData();
            $scope.getAllDistrict();
            $scope.getAllProjectSetting(); // 获取所有的项目参数列表信息

            $scope.selectedNode = null;
            $('.collapse').collapse();

            /**
             * 判断是否可更改
             */
            function changeProjectSetting(depart) {
                var department = AuthenticationService.currentUser().department;
                console.log(department);
                // 如果有id，部门编辑操作，若没则为添加操作
                if (!depart.id) {
                    // 若department 为null 则为admin管理员
                    if (department != null) {
                        var promise = DepartmentService.getParentDepartmentProjectSetting(department.parentId);
                    } else {
                        // 如果不为null，则为添加二级部门
                        if ($scope.selectedDepartment != undefined) {
                            var promise = DepartmentService.getParentDepartmentProjectSetting($scope.selectedDepartment.id);
                        } else {
                            // 不进行处理
                        }
                    }

                } else {
                    var promise = DepartmentService.getParentDepartmentProjectSetting(depart.id);
                }
                // 若admin，添加一级部门，则不需要进行判断
                if (promise != undefined) {
                    promise.then(function (response) {
                        if (response.status == "SUCCESS") {
                            if (response.data != null) {
                                SweetAlert.swal("上级部门存在所属项目，不允许更改");
                                if ($scope.departmentOld != undefined) {
                                    if ($scope.department != undefined) {
                                        $scope.department.projectSettingId = $scope.departmentOld.projectSettingId;
                                    }
                                    if ($scope.newDepartment != undefined) {
                                        $scope.newDepartment.projectSettingId = $scope.departmentOld.projectSettingId;
                                    }
                                }
                                return;
                            }
                        }
                    }, function (error) {
                        SweetAlert.swal("获取上级部门所属项目失败", "请重试", "error");
                    })
                }

            }

            /**
             * 获取所有的项目参数列表信息
             */
            function getAllProjectSetting() {
                var searchModal = {};
                searchModal.isDeleted = 0;
                var promise = ProjectSettingService.getProjectSettingList(searchModal);
                promise.then(function (response) {
                    if (response.status == "FAILURE") {
                        SweetAlert.swal(response.data, "请重试", "error");
                    } else {
                        $scope.projectSettings = response.data;
                    }

                }, function (error) {
                    SweetAlert.swal("获取项目列表失败", "请重试", "error");
                });
            }

            /**
             *
             */
            function getAllDistrict() {
                var promise = DepartmentService.getAllDistrict();
                promise.then(function (response) {
                    if (response.status == "FAILURE") {
                        SweetAlert.swal(response.data, "请重试", "error");
                    }
                    else {
                        $scope.districts = response.data;
                    }
                }, function (error) {
                    SweetAlert.swal("获取大区列表失败", "请重试", "error");
                });
            }

            /**
             * 显示部门信息还是校区信息
             * @returns {boolean}
             */
            function showType() {
                if ($scope.selectedNode && $scope.selectedNode.isSchool) {
                    if ($scope.selectedNode.isSchool == 1) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
                else {
                    return false;
                }
            }

            /**
             * 获取所有字典数据
             */
            function getAllDictData() {
                var promise = EmployeeService.getAllDictData();
                promise.then(function (response) {
                    if (response.status == "FAILURE") {
                        SweetAlert.swal(response.data, "请重试", "error");
                    }
                    else {
                        $scope.dictData = response.data;
                    }
                }, function (error) {
                    SweetAlert.swal("获取字典数据失败", "请重试", "error");
                });
            }

            function getAllProvince() {
                var promise = DepartmentService.getAllProvince();
                promise.then(function (response) {
                    if (response.status == "FAILURE") {
                        SweetAlert.swal(response.data, "请重试", "error");
                    }
                    else {
                        $scope.provinces = response.data;
                    }
                }, function (error) {
                    SweetAlert("获取省列表失败", "请重试", "error");
                });
            }

            function getCityByProvince(pcode) {
                if (pcode == null) {
                    $scope.cities = null;
                }
                else {
                    var promise = DepartmentService.getCityByProvince(pcode);
                    promise.then(function (response) {
                        if (response.status == "FAILURE") {
                            SweetAlert.swal(response.data, "请重试", "error");
                            return false;
                        }
                        else {
                            $scope.cities = response.data;
                        }
                    }, function (error) {
                        SweetAlert("获取市列表失败", "请重试", "error");
                    });
                }
            }

            function getAreaByCity(ccode) {
                if (ccode == null) {
                    $scope.areas = null;
                }
                else {
                    var promise = DepartmentService.getAreaByCity(ccode);
                    promise.then(function (response) {
                        if (response.status == "FAILURE") {
                            SweetAlert.swal(response.data, "请重试", "error");
                        }
                        else {
                            $scope.areas = response.data;
                        }
                    }, function (error) {
                        SweetAlert("获取地区列表失败", "请重试", "error");
                    });
                }
            }

            /**
             * Get all the positions in system.
             */
            function getAllPositions() {
                var promise = PositionManagementService.list();
                promise.then(
                    function (response) {
                        if (response.status == "FAILURE") {
                            SweetAlert.swal(response.data, "请重试", "error");
                        }
                        else {
                            $scope.allPositions = response.data;
                        }
                    },
                    function (error) {
                    }
                );
            }

            /**
             * 校区标配岗位添加
             */
            function addSchoolPosToDept() {
                addPosToDept(Constants.schoolPositions);
            }

            /**
             * 优胜派标配岗位添加
             */
            $scope.addYSPPosToDept = function () {
                addPosToDept(Constants.YSPPositions);
            }

            /**
             * 优胜班标配岗位添加
             */
            $scope.addYSBPosToDept = function () {
                addPosToDept(Constants.YSBPositions);
            }

            /**
             * 优胜国际标配岗位添加
             */
            $scope.addYSGJPosToDept = function () {
                addPosToDept(Constants.YSGJPositions);
            }


            /**
             * add positions to the selected department
             * @param position the positions to be add
             */
            function addPosToDept(positions) {
                //根据当前选中的要添加的岗位，去维护selectable 和  selected positions
                angular.forEach(positions, function (p) {
                    var resultStr = p.replace(/[\r\n]/g, "");
                    resultStr = resultStr.replace(/[ ]/g, "");
                    angular.forEach($scope.allPositions, function (p1, index) {
                        if (p1.name == resultStr) {
                            //如果不包含，就添加，如果包含，不做处理
                            if (!containsPosition($scope.selectedPositions, p1)) {
                                togglePosition(p1);
                            }
                            return;
                        }
                    });
                });
            }

            /**
             * Remove positions from the selected department.
             * @param position the positions to be remove
             */
            function removePosFromDept(positions) {
                //根据当前选中的要删除的岗位，去维护selectable 和  selected positions
                angular.forEach(positions, function (p) {
                    var resultStr = p.replace(/[\r\n]/g, "");
                    resultStr = resultStr.replace(/[ ]/g, "");
                    angular.forEach($scope.allPositions, function (p1, index) {
                        if (p1.name == resultStr) {
                            //如果包含，就删除，如果不包含，不做处理
                            if (containsPosition($scope.selectedPositions, p1)) {
                                togglePosition(p1);
                            }
                            return;
                        }
                    });
                });
            }

            $scope.clearDeptPos = function () {
                $scope.selectedPositions = [];
            }

            /**
             * Checks whether the given position is in the positions list.
             * @param position the position to check
             * @return true if it contains, otherwise false
             */
            function containsPosition(positions, position) {
                var found = false;
                if (positions) {
                    angular.forEach(positions, function (p) {
                        if (p.id === position.id) {
                            found = true;
                        }
                    });
                }
                return found;
            }

            /**
             * Saves positions.
             */
            function save() {
                //需要将$scope.selectedPositions 更新到$scope.positions
                //console.log("Saving the department's positions.");
                var promise = PositionMaintenanceService.update($scope.selectedDepartment, $scope.selectedPositions);
                promise.then(function (response) {
                    if (response.status == "FAILURE") {
                        SweetAlert.swal(response.data, "请重试", "error");
                    }
                    else {
                        angular.copy($scope.selectedPositions, $scope.positions);
                    }
                    $scope.modal.hide();
                }, function (error) {
                    $scope.modal.hide();
                });
            }

            /**
             * Set the selectable positions when choose one department.
             */
            function getSelectablePositions() {
                $scope.selectablePositions = [];
                if ($scope.selectedPositions == undefined) {
                    angular.copy($scope.allPositions, $scope.selectablePositions);
                }
                else if ($scope.allPositions == $scope.positions) {
                    $scope.selectablePositions = {};
                }
                else {
                    angular.forEach($scope.allPositions, function (p, index) {
                        var keepGoing = true;
                        angular.forEach($scope.selectedPositions, function (p1, index1) {
                            if (keepGoing) {
                                if (p.id == p1.id) {
                                    keepGoing = false;
                                }
                            }
                        });
                        if (keepGoing == true) {
                            //如果当前部门不包含该岗位，则将该岗位放入selectablePositions
                            $scope.selectablePositions.push(p);
                        }
                    });
                }
                /*socket.on();*/
            }

            /**
             * Toggles role inclusion.
             * @param role the role
             */
            function togglePosition(position) {
                //更新已选择岗位栏
                if (containsPosition($scope.selectedPositions, position)) {
                    var keepGoing = true;
                    angular.forEach($scope.selectedPositions, function (p, index) {
                        if (keepGoing) {
                            if (p.id === position.id) {
                                $scope.selectedPositions.splice(index, 1);
                                keepGoing = false;;
                            }
                        }
                    });
                }
                else {
                    if (!$scope.selectedPositions) {
                        $scope.selectedPositions = [];
                    }
                    $scope.selectedPositions.push(position);
                }
                //更新可选择岗位
                //判断当前点击的岗位是否在selectablePositions中
                if (containsPosition($scope.selectablePositions, position)) {
                    keepGoing = true;
                    //如果在，那么需要从中移除
                    angular.forEach($scope.selectablePositions, function (p, index) {
                        if (keepGoing) {
                            if (p.id == position.id) {
                                $scope.selectablePositions.splice(index, 1);
                            }
                        }
                    });
                }
                else {
                    //否则，需要往里面添加
                    if (!$scope.selectablePositions) {
                        $scope.selectablePositions = [];
                    }
                    $scope.selectablePositions.push(position);
                }
            }


            /** department management **/
            /**
             * Checks whether the current user can manage department.
             */
            function canManageDepartment() {
                var can = false;
                //AuthenticationService.currentUser()
                //$rootScope.currentUser.roles
                angular.forEach(AuthenticationService.currentUser().roles, function (role) {
                    angular.forEach(role.permissions, function (permission) {
                        if (permission.name === 'DepartmentManagement') {
                            can = true;
                        }
                    });
                });
                return can;
            }

            /**
             * Triggered when a node is selected.
             * @param node the selected node
             */
            function selectNode(node) {
                $scope.selectedNode = node;
                $scope.selectedDepartment = findSelectedDepartment($scope.departments, node.id);
                $scope.getPositions($scope.selectedDepartment.id, $scope.getSelectablePositions);
                //获取所属大区
                if ($scope.selectedNode.district) {
                    $scope.belongDistrict = "";
                    angular.forEach($scope.districts, function (p, index) {
                        if (p.departmentId == $scope.selectedNode.district) {
                            $scope.belongDistrict = p.name;
                            return;
                        }
                    });
                }
                //获取所属区域（如果是校区）
                if ($scope.selectedNode.isSchool == 1) {
                    var filter = {};
                    filter.childId = $scope.selectedNode.id;
                    var promise = DepartmentService.getDepartmentByFilter(filter);
                    promise.then(function (response) {
                        if (response.status == "FAILURE") {
                            SweetAlert.swal(response.data, "请重试", "error");
                            return false;
                        }
                        else {
                            var list = response.data;
                            if (list != null) {
                                $scope.selectedNode.region = list[0];
                            }
                        }
                    });
                }
                //获取地址（如果是校区）
                if ($scope.selectedNode.isSchool == 1) {
                    $scope.schoolAddress = "";
                    if ($scope.selectedNode.provinceCode != undefined) {
                        //拼接省份
                        angular.forEach($scope.provinces, function (p, index) {
                            if (p.provinceCode == $scope.selectedNode.provinceCode) {
                                $scope.schoolAddress += p.provinceName;
                                return;
                            }
                        });
                        var promise = DepartmentService.getCityByProvince($scope.selectedNode.provinceCode);
                        promise.then(function (response) {
                            //获取城市列表成功后，再去获取县列表
                            if (response.status == "FAILURE") {
                                SweetAlert.swal(response.data, "请重试", "error");
                                return false;
                            }
                            else {
                                $scope.cities = response.data;
                            }
                            if ($scope.selectedNode.cityCode != undefined) {
                                angular.forEach($scope.cities, function (p, index) {
                                    if (p.cityCode == $scope.selectedNode.cityCode) {
                                        $scope.schoolAddress += p.cityName;
                                        return;
                                    }
                                });
                                var promise = DepartmentService.getAreaByCity($scope.selectedNode.cityCode);
                                promise.then(function (response) {
                                    if (response.status == "FAILURE") {
                                        SweetAlert.swal(response.data, "请重试", "error");
                                        return false;
                                    }
                                    else {
                                        $scope.areas = response.data;
                                    }
                                    if ($scope.selectedNode.areaCode) {
                                        angular.forEach($scope.areas, function (p, index) {
                                            if (p.areaCode == $scope.selectedNode.areaCode) {
                                                $scope.schoolAddress += p.areaName;
                                                return;
                                            }
                                        });
                                    }
                                }, function (error) {
                                });
                            }
                        }, function (error) {
                        });
                    }
                }
            }

            /**
             * Recursively find the department with the given id.
             * @param departments the departments to start with
             * @param id the id of department to find
             * @return the department, or false if not found
             */
            function findSelectedDepartment(departments, id) {
                var found = false;
                angular.forEach(departments, function (department) {
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
             * Save department.
             */
            function saveDepartment() {
                if ($scope.newDepartment.name === undefined) {
                    SweetAlert.swal('请输入部门名称', '请重试', 'error');
                }
                if ($scope.newDepartment.contractCompany && $scope.newDepartment.contractCompany.length > 128) {
                    SweetAlert.swal("合同签署单位最长不超过128个字符", '请重试', 'error');
                    return false;
                }
                if ($scope.newDepartment.schoolCompanyName && $scope.newDepartment.schoolCompanyName.length > 128) {
                    SweetAlert.swal("校区公司名称最长不超过128个字符", '请重试', 'error');
                    return false;
                }
                if ($scope.newDepartment.schoolCompanyAddress && $scope.newDepartment.schoolCompanyAddress.length > 128) {
                    SweetAlert.swal("校区公司详细地址最长不超过128个字符", '请重试', 'error');
                    return false;
                }
                if ($scope.newDepartment.schoolCompanyPhone && $scope.newDepartment.schoolCompanyPhone.length > 32) {
                    SweetAlert.swal("校区公司电话最长不超过32个字符", '请重试', 'error');
                    return false;
                }
                if ($scope.newDepartment.isSchool == undefined) {
                    $scope.newDepartment.isSchool = 0;
                }
                else {
                    $scope.newDepartment.isSchool = 1;
                }
                var promise = DepartmentService.addChild($scope.selectedDepartment,
                    {
                        'name': $scope.newDepartment.name, 'isSchool': $scope.newDepartment.isSchool, 'provinceCode': $scope.newDepartment.provinceCode, 'isDistrict': $scope.newDepartment.isDistrict, 'isRegion': $scope.newDepartment.isRegion,isBranch:$scope.newDepartment.isBranch,isO2o:$scope.newDepartment.isO2o,
                        'cityCode': $scope.newDepartment.cityCode, 'areaCode': $scope.newDepartment.areaCode, 'district': $scope.newDepartment.district, 'schoolNature': $scope.newDepartment.schoolNature, 'contractCompany': $scope.newDepartment.contractCompany,
                        'schoolCompanyAddress': $scope.newDepartment.schoolCompanyAddress, 'schoolCompanyName': $scope.newDepartment.schoolCompanyName, 'schoolCompanyPhone': $scope.newDepartment.schoolCompanyPhone, 'projectSettingId': $scope.newDepartment.projectSettingId
                    });
                promise.then(function (response) {
                    if (response.status == "FAILURE") {
                        SweetAlert.swal(response.data, "请重试", "error");
                        return false;
                    }
                    else {
                        if (!$scope.selectedDepartment.children) {
                            $scope.selectedDepartment.children = [];
                        }
                        $scope.selectedDepartment.children.push(response.data);
                        $scope.modal.hide();
                        if ($scope.newDepartment.isDistrict) {
                            var promise2 = DepartmentService.getAllDistrict();
                            promise2.then(function (response2) {
                                if (response2.status == "FAILURE") {
                                    SweetAlert.swal(response2.data, "请重试", "error");
                                }
                                else {
                                    $scope.districts = response2.data;
                                }
                            }, function (error) {
                            });
                        }
                        SweetAlert.swal('添加成功', '确定', 'success');
                    }
                }, function (error) {
                    SweetAlert.swal('添加失败', '请重试', 'error');
                });
            }

            /**
             * Adds child for the currently selected node.
             */
            function addChild() {
                $scope.isAdd = true;
                $scope.modalTitle = '添加部门';
                $scope.newDepartment = {};
                $scope.departmentOld = {};
                var department = AuthenticationService.currentUser().department;
                if (department != null) {
                    var promiseTemp = DepartmentService.getParentDepartmentProjectSetting(department.id);
                    promiseTemp.then(function (response) {
                        if (response.status == "SUCCESS") {
                            if (response.data != null) {
                                $scope.newDepartment.projectSettingId = Number(response.data);
                                $scope.departmentOld.projectSettingId = Number(response.data);
                            }
                        }
                    }, function (error) {
                        SweetAlert.swal("添加部门的过程中查询本部门所属项目id失败", "请重试", "error");
                    })
                } else {
                    // 管理员,没有部门id
                    if ($scope.selectedDepartment) {
                        $scope.newDepartment.projectSettingId = $scope.selectedDepartment.projectSettingId;
                        $scope.departmentOld.projectSettingId = $scope.selectedDepartment.projectSettingId;
                    }
                }

                if ($scope.selectedNode.isDistrict) {
                    //如果当前所选节点是大区，那么在它的孩子节点中，所属大区属性确定并且不可编辑
                    angular.forEach($scope.districts, function (p, index) {
                        if (p.departmentId == $scope.selectedNode.id) {
                            $scope.newDepartment.district = p.departmentId;
                            return;
                        }
                    });
                };
                if ($scope.selectedNode.isRegion) {
                    //当前所选节点是区域
                    $scope.newDepartment.region = $scope.selectedNode;
                    var department = $scope.findConfirmedDepartment($scope.departments, $scope.selectedNode, 1)
                    angular.forEach($scope.districts, function (p, index) {
                        if (p.departmentId == department.id) {
                            $scope.newDepartment.district = p.departmentId;
                            return;
                        }
                    });
                }
                $scope.modal = $modal({ scope: $scope, templateUrl: 'partials/hr/department/modal.department.add.html', show: true, backdrop: 'static' });
            }


            $scope.findConfirmedDepartment = function (departments, selectedNode, type) {
                var found = false;
                angular.forEach(departments, function (p, index) {
                    if (found) {
                        return;
                    }
                    if (type == 1) {//查找的是大区
                        if (p.id == selectedNode.district) {
                            found = p;
                            return;
                        }
                    }
                    else if (type == 2) {//查找的是区域
                        if (p.id == selectedNode.parentId) {
                            found = department;
                            return;
                        }
                    }
                    found = $scope.findConfirmedDepartment(p.children, selectedNode, type);
                });
                return found;
            }

            function updateDepartment() {
                if ($scope.department.name === undefined) {
                    SweetAlert.swal('请输入部门名称', '请重试', 'error');
                }
                if ($scope.department.contractCompany && $scope.department.contractCompany.length > 128) {
                    SweetAlert.swal("合同签署单位最长不超过128个字符", '请重试', 'error');
                    return false;
                }
                if ($scope.department.schoolCompanyName && $scope.department.schoolCompanyName.length > 128) {
                    SweetAlert.swal("校区公司名称最长不超过128个字符", '请重试', 'error');
                    return false;
                }
                if ($scope.department.schoolCompanyAddress && $scope.department.schoolCompanyAddress.length > 128) {
                    SweetAlert.swal("校区公司详细地址最长不超过128个字符", '请重试', 'error');
                    return false;
                }
                if ($scope.department.schoolCompanyPhone && $scope.department.schoolCompanyPhone.length > 32) {
                    SweetAlert.swal("校区公司电话最长不超过32个字符", '请重试', 'error');
                    return false;
                }
                if ($scope.department.isSchool == false) {
                    $scope.department.provinceCode = undefined;
                    $scope.department.cityCode = undefined;
                    $scope.department.areaCode = undefined;
                    $scope.department.schoolNature = undefined;
                }
                $scope.selectedNode = $scope.department;
                if ($scope.selectedNode.isSchool == undefined || $scope.selectedNode.isSchool == false) {
                    $scope.selectedNode.isSchool = 0;
                } else {
                    $scope.selectedNode.isSchool = 1;
                }

                if ($scope.selectedNode.isUseEContract == undefined || $scope.selectedNode.isUseEContract == false) {
                    $scope.selectedNode.isUseEContract = 0;
                } else {
                    $scope.selectedNode.isUseEContract = 1;
                }

                var promise = DepartmentService.edit($scope.selectedNode);
                promise.then(function (response) {
                    if (response.status == "FAILURE") {
                        SweetAlert.swal(response.data, "请重试", "error");
                        $scope.modal.hide();
                        return false;
                    }
                    else {
                        if ($scope.department.isDistrict) {
                            //如果添加的是大区，还需要重新加载大区列表。
                            var promise2 = EmployeeService.getAllDictData();
                            promise.then(function (response) {
                                if (response.status == "FAILURE") {
                                    SweetAlert.swal(response.data, "请重试", "error");
                                    return false;
                                }
                                else {
                                    $scope.dictData = response.data;
                                }
                            }, function (error) {
                            });
                        }
                        //获取地址（如果是校区）
                        if ($scope.selectedNode.isSchool == 1) {
                            $scope.schoolAddress = "";
                            if ($scope.selectedNode.provinceCode != undefined) {
                                //拼接省份
                                angular.forEach($scope.provinces, function (p, index) {
                                    if (p.provinceCode == $scope.selectedNode.provinceCode) {
                                        $scope.schoolAddress += p.provinceName;
                                        return;
                                    }
                                });
                            }
                            if ($scope.selectedNode.cityCode != undefined) {
                                angular.forEach($scope.cities, function (p, index) {
                                    if (p.cityCode == $scope.selectedNode.cityCode) {
                                        $scope.schoolAddress += p.cityName;
                                        return;
                                    }
                                });
                                if ($scope.selectedNode.areaCode) {
                                    angular.forEach($scope.areas, function (p, index) {
                                        if (p.areaCode == $scope.selectedNode.areaCode) {
                                            $scope.schoolAddress += p.areaName;
                                            return;
                                        }
                                    });
                                }
                            }
                        }
                        $scope.modal.hide();
                        $scope.selectedNode = response.data;
                        $scope.getAllDepartments();
                        SweetAlert.swal('修改成功', '确定', 'success');
                    }
                }, function (error) {
                    $scope.modal.hide();
                    SweetAlert.swal('修改失败', '请重试', 'error');
                });
            }

            /**
             * Edits the name of the selected department.
             */
            function edit() {
                $scope.isEdit = true;
                $scope.modalTitle = '修改部门';
                // console.log($scope.selectedNode);
                $scope.department = angular.copy($scope.selectedNode);
                $scope.departmentOld = angular.copy($scope.selectedNode);
                // 判断是否是校区
                if ($scope.department.isSchool && $scope.department.isSchool == 1) {
                    $scope.department.isSchool = true;
                } else {
                    $scope.department.isSchool = false;
                }
                // 校区详细信息
                if ($scope.selectedNode.provinceCode != undefined) {
                    var promise = DepartmentService.getCityByProvince($scope.selectedNode.provinceCode);
                    promise.then(function (response) {
                        if (response.status == "FAILURE") {
                            SweetAlert.swal(response.data, "请重试", "error");
                            return false;
                        } else {
                            // console.log(response);
                            $scope.cities = response.data;
                        }
                    }, function (error) {
                    });
                }
                if ($scope.selectedNode.cityCode != undefined) {
                    var promise = DepartmentService.getAreaByCity($scope.selectedNode.cityCode);
                    promise.then(function (response) {
                        if (response.status == "FAILURE") {
                            SweetAlert.swal(response.data, "请重试", "error");
                            return false;
                        }
                        else {
                            $scope.areas = response.data;
                        }
                    }, function (error) {
                    });
                }

                // 判断是否使用电子合同
                if ($scope.selectedNode.isUseEContract == true) {
                    // 使用电子合同，不允许添加或修改合同编号
                    $scope.department.isUseEContract = true;
                } else {
                    $scope.department.isUseEContract = false;
                }

				// 判断是否使用外呼功能
                if ($scope.selectedNode.isOutbound == true) {
                    // 使用外呼功能
                    $scope.department.isOutbound = true;
                } else {
                    $scope.department.isOutbound = false;
                }

                //修改校区时，所属大区是不允许修改的。
                $scope.modal = $modal({ scope: $scope, templateUrl: 'partials/hr/department/modal.department.edit.html', show: true, backdrop: 'static' });
            }

            /**
             * Adds root department for the current organization.
             */
            function addRoot() {
                $scope.isAdd = true;
                $scope.modalTitle = '添加部门';
                $scope.newDepartment = {};
                $scope.departmentOld = {};
                // 获取上级部门的所属项目id，添加时默认设置
                var department = AuthenticationService.currentUser().department;
                if (department != null) {
                    var promise = DepartmentService.getParentDepartmentProjectSetting(department.id);
                    promise.then(function (response) {
                        if (response.status == "SUCCESS") {
                            if (response.data != null) {
                                $scope.newDepartment.projectSettingId = Number(response.data);
                                $scope.departmentOld.projectSettingId = Number(response.data);
                                $scope.modal = $modal({ scope: $scope, templateUrl: 'partials/hr/department/modal.rootDepartment.add.html', show: true, backdrop: 'static' });
                            }
                        }
                    }, function (error) {
                        SweetAlert.swal("添加部门的过程中查询本部门所属项目id失败", "请重试", "error");
                    })
                } else {
                    $scope.modal = $modal({ scope: $scope, templateUrl: 'partials/hr/department/modal.rootDepartment.add.html', show: true, backdrop: 'static' });
                }

            }

            $scope.saveRoot = function () {
                if ($scope.newDepartment.contractCompany && $scope.newDepartment.contractCompany.length > 128) {
                    SweetAlert.swal("合同签署单位最长不超过128个字符", '请重试', 'error');
                    return false;
                }
                var promise = DepartmentService.addRoot($scope.newDepartment);
                promise.then(function (response) {
                    if (response.status == "FAILURE") {
                        SweetAlert.swal(response.data, "请重试", "error");
                    }
                    else {
                        $scope.departments.push(response.data);
                    }
                    $scope.modal.hide();
                }
                );
            }

            /**
             * Gets all departments for the current user's organization and render as a tree.
             */
            function getAllDepartments() {
                var promise = DepartmentService.list(AuthenticationService.currentUser().organization.id);
                promise.then(function (response) {
                    if (response.status == "FAILURE") {
                        SweetAlert.swal(response.data, "请重试", "error");
                    }
                    else {
                        $scope.departments = response.data;
                        console.log(response.data)
                    }
                }, function (error) {
                });
            }

            /**
             * Removes the selected department.
             */
            function remove() {
                SweetAlert.swal({
                    title: "请谨慎操作！",
                    text: '该机构的所有下属子机构都将被删除。删除前请确保该部门及其下级部门都没有在职员工。',
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: '#DD6B55',
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    closeOnConfirm: true,
                    showLoaderOnConfirm: true
                }, function (confirm) {
                    if (confirm) {
                        var promise = DepartmentService.remove($scope.selectedDepartment);
                        promise.then(function (response) {
                            if (response.status == "FAILURE") {
                                SweetAlert.swal(response.data, "请重试", "error");
                            }
                            else {
                                $scope.getAllDepartments();
                            }
                        }, function (error) {
                            SweetAlert.swal("删除失败!", "error");
                        });
                    }
                }
                );
            }

            /**
             * Deletes department in backend.
             */
            function deleteDepartment(departments, id) {
                var found = false;
                angular.forEach(departments, function (department, index) {
                    if (department.id === id) {
                        departments.splice(index, 1);
                        found = true;
                    }
                });
                if (found) {
                    return;
                }
                angular.forEach(departments, function (department, index) {
                    if (department.children && department.children.length > 0) {
                        deleteDepartment(department.children, id);
                    }
                });
            }

            /**
             * Starts changing parent.
             */
            function changeParent() {
                //console.log('Start changing parent for ' + $scope.selectedDepartment.name);
                $scope.newParentId = -1;
                $scope.modalTitle = '修改' + $scope.selectedDepartment.name + '的所属机构';
                $scope.modal = $modal({ scope: $scope, templateUrl: 'partials/hr/department/modal.organization.html', show: true, backdrop: 'static' });
                $scope.modalDepartments = angular.copy($scope.departments);
                deleteDepartment($scope.modalDepartments, $scope.selectedDepartment.id);
            }

            /**
             * Triggered when a new node is selected for parent.
             * @param node the selected node
             */
            function selectParent(node) {
                //console.log('Selected parent ' + JSON.stringify(node));
                $scope.newParentId = node.id;
            }

            /**
             * Sets the selected department as root.
             */
            function setAsRoot() {
                //console.log('Set ' + $scope.selectedDepartment.name + ' as root');
                $scope.newParentId = -1;
            }

            /**
             * Finds parent in the given departments.
             * @param departments the departments to find
             * @param id the id of department to find its parent
             */
            function findParent(departments, id) {
                var found = null;
                angular.forEach(departments, function (department) {
                    if (department.children && department.children.length > 0) {
                        angular.forEach(department.children, function (child) {
                            if (child.id === id) {
                                found = department;
                            }
                        });
                        if (!found) {
                            var parent = findParent(department.children, id);
                            if (parent != null) {
                                found = parent;
                            }
                        }
                    }
                });
                return found;
            }

            /**
             * Saves the new parent to backend.
             */
            function saveNewParent() {
                var department = angular.copy($scope.selectedDepartment);
                var parent = null;
                var previousParent = findParent($scope.departments, $scope.selectedDepartment.id);

                if ($scope.newParentId !== -1) {
                    parent = findSelectedDepartment($scope.departments, $scope.newParentId);
                } else {
                    parent = { 'id': -1 };
                }
                department.parent = parent;

                var promise = DepartmentService.edit(department);
                promise.then(function (response) {
                    if (response.status == "FAILURE") {
                        SweetAlert.swal(response.data, "请重试", "error");
                        $scope.modal.hide();
                        return false;
                    }
                    else {
                        if (previousParent !== null) {
                            angular.forEach(previousParent.children, function (child, index) {
                                if (child.id === department.id) {
                                    previousParent.children.splice(index, 1);
                                }
                            });
                        } else {
                            angular.forEach($scope.departments, function (child, index) {
                                if (child.id === department.id) {
                                    $scope.departments.splice(index, 1);
                                }
                            });
                        }
                        if ($scope.newParentId !== -1) {
                            if (!parent.children) {
                                parent.children = [];
                            }
                            parent.children.push($scope.selectedDepartment);
                        } else {
                            $scope.departments.push($scope.selectedDepartment);
                        }
                        $scope.modal.hide();
                    }
                }, function (error) {
                    SweetAlert.swal('更新失败', '请重试', 'error');
                });
            }


            /** department management end **/

            /** position management **/

            /**
             * Shows the add position dialog.
             */
            function addPosition() {
                //console.log('Start adding position for ' + $scope.selectedDepartment.name);
                $scope.modalTitle = '添加岗位';
                $scope.position = {};
                $scope.modal = $modal({ scope: $scope, templateUrl: 'partials/hr/department/modal.addPositiontoDepartment.html', show: true, backdrop: 'static' });
            }

            /**
             * Saves position to backend.
             */
            function savePosition() {
                //console.log('Saving position : ' + JSON.stringify($scope.position));
                $scope.position.department = $scope.selectedDepartment;
                var promise = null;
                if (!$scope.position.id) {
                    promise = PositionService.add($scope.position);
                } else {
                    promise = PositionService.edit($scope.position);
                }
                promise.then(function (response) {
                    if (response.status == "FAILURE") {
                        SweetAlert.swal(response.data, "请重试", "error");
                    }
                    else {
                        $scope.getPositions($scope.selectedDepartment.id);
                        $scope.modal.hide();
                    }
                }, function (error) {

                });
            }

            /**
             * Gets positions for the given department.
             * @param departmentId the department id to get positions for
             */
            function getPositions(departmentId, getSelectablePositions) {
                var promise = PositionService.list(departmentId);
                promise.then(function (response) {
                    if (response.status == "FAILURE") {
                        SweetAlert.swal(response.data, "请重试", "error");
                    }
                    else {
                        $scope.positions = response.data;
                        $scope.selectedPositions = [];
                        angular.copy($scope.positions, $scope.selectedPositions);
                        getSelectablePositions();
                    }
                }, function (error) {

                });
            }

            /**
             * Shows the edit position dialog.
             * @param position the position to edit
             */
            function editPosition(position) {
                //console.log('Start editing position ' + position);
                $scope.modalTitle = '修改岗位';
                $scope.position = position;
                $scope.modal = $modal({ scope: $scope, templateUrl: 'partials/hr/position/modal.position.html', show: true, backdrop: 'static' });
            }

            /**
             * Shows the remove position dialog.
             * @param position the position to remove
             */
            function removePosition(position) {
                //console.log('Deleting position : ' + JSON.stringify(position));
                SweetAlert.swal({
                    title: "确定要删除吗？",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: '#DD6B55',
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    closeOnConfirm: true
                }, function (confirm) {
                    if (confirm) {
                        var promise = PositionService.remove(position);
                        promise.then(function (response) {
                            if (response.status == "FAILURE") {
                                SweetAlert.swal(response.data, "请重试", "error");
                            }
                            else {
                                SweetAlert("删除成功", "确定", "success");
                                $scope.getPositions($scope.selectedDepartment.id);
                            }
                        }, function (error) {
                            SweetAlert("删除失败", "请重试", "error");
                        });
                    }
                }
                );
            }

            /**
             * 选择机构对应的所属项目
             */
            function selectProjectSetting() {
                //弹出项目参数设置的列表
                $scope.modalTitle = '添加项目';
                $scope.projectSettingModal = $modal({
                    scope: $scope,
                    templateUrl: 'partials/admin/modal.projectSetting.html',
                    show: true,
                    backdrop: "static"
                });
            }
            /** position management end **/

            // configure the tree
            $scope.treeOptions = {
                nodeChildren: 'children',
                dirSelectable: true,
                allowDeselect: false
            }
        }
    ]);
