'use strict';

/**
 * The crmChargingScheme controller.
 * @version 1.0
 */
angular.module('ywsApp').controller('CrmChargingSchemeController', [
    '$scope', '$modal', '$mtModal', '$filter', '$rootScope', 'SweetAlert', 'CrmChargingSchemeService', 
    'DepartmentService', 'AuthenticationService', 'CommonService', 'localStorageService',
    function ($scope, $modal, $mtModal, $filter, $rootScope, SweetAlert, CrmChargingSchemeService, 
    		DepartmentService, AuthenticationService, commonService, localStorageService) {
        //方法声明
        $scope.getPageList = getPageList;
        $scope.showAddOrEditModal = showAddOrEditModal;
        $scope.closeAddOrEditModal = closeAddOrEditModal;
        $scope.showSelectDepartment = showSelectDepartment;
        $scope.selectDepartment = selectDepartment;
        var mtCrmModalPrice = function (url) {
            return $modal({
                scope: $scope,
                templateUrl: url + '?' + new Date().getTime(),
                show: true,
                backdrop: "static"
            });
        }
        $scope.createOrUpdate = createOrUpdate;
        $scope.deleteChargingScheme = deleteChargingScheme;
        $scope.getChargingScheme = getChargingScheme;
        $scope.getPageList = getPageList;
        $scope.__look = false

        /**
         * 添加计费方案弹窗
         */
        function showAddOrEditModal(row) {
            var _len = arguments.length
            var promise = DepartmentService.list(AuthenticationService.currentUser().organization.id);
            promise.then(
                function (response) {
                    if (response.status == "FAILURE") {
                        SweetAlert.swal(response.data, "请重试", "error");
                    } else {
                        $scope.departments = response.data;
                        if (row) {
                            var obj = angular.copy(row)
                            $scope.sutCount = row.studentCount
                            _preUpdate(obj, _len)
                        } else {
                            $scope.chargingScheme = {};
                            $scope.selectDpartment = {};
                            $scope.chargingScheme.schemeStatus = 0
                            $scope.addOrEditModalTitle = '添加计费方案';
                            $scope.chargeRule(1)
                        }
                        $scope.addOrEditModal = mtCrmModalPrice('partials/sos/crmChargingScheme/modal.addOrEdit.html')
                        scrollWidth()
                    }
                }
            );
        }

        /**
         * 准备修改计费方案
         * @param row
         * @private
         */
        function _preUpdate(row) {
            $scope.chargingScheme = row;
            $scope.schemeJson = JSON.parse($scope.chargingScheme.schemeJson)
            $scope.priceUpdate = true
            if (arguments[1] == 2) {
                $scope.__look = true
            }
            $scope.addOrEditModalTitle = '修改计费方案';
            var selectedflag = findDepartment($scope.departments, $scope.chargingScheme.authorizationDepartmentId);
            if(!selectedflag){
            	$scope.selectDpartment={};
            	$scope.selectDpartment.name=row.departmentName;
            }
        }
        
        /**
         * 查找是否有所在部门
         */
        function findDepartment(departments, departmentId){
        	var selectedflag = false;
            angular.forEach(departments, function (data, index, array) {
            	if (selectedflag == false) {
            		if (departmentId == data.id) {
            			$scope.selectDpartment = data;
            			selectedflag = true;
            			return selectedflag;
            		}
            		if (data.children != null) {
            			selectedflag = findDepartment(data.children, departmentId);
            			if (selectedflag == true) {
            				return selectedflag;
            			}
            		}
            	}
            });
            return selectedflag;
        }

        /**
         * 关闭计费方案弹窗
         */
        function closeAddOrEditModal() {
            $scope.chargingScheme = {};
            $scope.selectDpartment = {};
            $scope.schemeJson = []
            $scope.priceUpdate = false
            $scope.__look = false
            $scope.mtRefresh = null
            $scope.hasNext = false
            _closeModal()
        }
        function _closeModal() {
            try {
                $scope.mtResultModal.hide()
            } catch (e) {
                console.log('没有而级弹出层')
            } finally {
                $scope.addOrEditModal.hide();
            }
        }
        /**
         * 选择机构
         */
        function showSelectDepartment() {
            $scope.modalTitle = '选择机构';
            $scope.selectDepartmentModal = mtCrmModalPrice('partials/hr/department/modal.department.html')
            //如果是校区或者大区人员，那么要限定部门，校区的部门限定
            $scope.modalDepartments = angular.copy($scope.departments);
        }

        /**
         * 选择节点
         */
        function selectDepartment(node) {
            $scope.selectDpartment = findSelectedDepartment($scope.departments, node.id);
            $scope.selectDepartmentModal.hide();
        }

        /**
         * 查找所选机构
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
         * 增加或更新计费方案
         */
        var detail = ''

        function createOrUpdate(model) {
        	//判断是否存在相同方案名称
            var searchModel = {};
            searchModel.start = 1;
            searchModel.size = 1;
            searchModel.isDeleted = 0;
            searchModel.schemeName = $scope.chargingScheme.schemeName;
            if(model.id!=null){
            	searchModel.customCondition = ' AND a.id <> ' + model.id + '';
            }
            var promise = CrmChargingSchemeService.getPageList(searchModel);
            promise.then(
                function (response) {
                    if(response.data.total>0){
                    	$mtModal.moreModal({
                			scope:$scope,
                			status: 0,
                			text:'已存在相同计费方案名称'
                		});
                		return;
                    }else{
                    	model.schemeJson = JSON.stringify(angular.copy($scope.schemeJson))
                    	model.authorizationDepartmentId = $scope.selectDpartment.id
                    	if (model.id == undefined) {
                    		_callBack(CrmChargingSchemeService.create(model), '添加');
                    	} else {
                    		var content = '对于价格的修改将影响到使用本计费方案的' + $scope.sutCount + '名学员的订单和排课信息，是否确认修改？'
                    		detail = model
                    		_mtResultModal(0, content, function () {
                    			_callBack(CrmChargingSchemeService.updateBySelective(detail),'更新')
                    		})
                    	}
                    }
                }
            );
        }

        /**
         * 添加或修改统一回调
         * @param data
         * @param title
         * @private
         */
        function _callBack(data, title) {
            _closeModal()
            data.then(function (response) {
                if (response.status === "FAILURE") {
                    _mtResultModal(0, title + "失败，请重试")
                } else {
                    closeAddOrEditModal();
                    _mtResultModal(1, title + "成功")
                }
            })
        }

        /**
         * 警告框和成功提示框使用说明:
         * 最多接受3个参数:
         * @param status
         *  第一个为状态参数1:成功，0：失败;
         * @param content
         *  第二个参数为提示内容,默认为成功;
         *  第三个为回调函数(有且仅有二级提示框时使用,接受一个函数,为可选参数)
         * _mtResultModal(status,content,[function])
         * @private
         */
        function _mtResultModal(status, content) {
            $scope.mtImg = status ? mtResultIcon.success : mtResultIcon.warning
            $scope.mtContent = content ? content : '成功'
            if (arguments.length == 3 && typeof arguments[2] == 'function') {
                $scope.hasNext = arguments[2]
            }else{
                try{
                    $scope.mtResultModal.hide()
                }catch (e){}
                setTimeout(function () {
                    getPageList($scope.chargingSchemeTableState)
                },100)
                $scope.hasNext = null
            }
            $scope.mtResultModal = mtCrmModalPrice(mtResultIcon.html)
        }

        /**
         * 查询计费方案明细
         */
        function getChargingScheme(model) {
            var promise = CrmChargingSchemeService.detail(model);
            promise.then(
                function (response) {
                    if (response.status === "FAILURE") {
                        SweetAlert.swal(response.data, "请重试", "error");
                    } else {
                        $scope.chargingScheme = response.data;
                    }
                }
            );
        }

        /**
         * 删除计费方案明细
         */
        function deleteChargingScheme(model) {
            detail = angular.copy(model)
            _mtResultModal(0, '确定要删除此方案', function () {
                _mtResultModal(CrmChargingSchemeService.remove(model),'删除成功')
            })
        }
        /**
         * 获取计费方案列表
         */
        function getPageList(tableState) {
            $scope.chargingSchemeTableState = tableState;
            //分页信息
            $scope.pagination = tableState.pagination;
            $scope.start = $scope.pagination.start || 0;
            $scope.number = $scope.pagination.number || 10;
            //查询参数
            var searchModel = {};
            searchModel.start = $scope.start;
            searchModel.size = $scope.number;
            searchModel.authorizationDepartmentId = localStorageService.get('department_id');
            searchModel.isDeleted = 0;
            var promise = CrmChargingSchemeService.getPageList(searchModel);
            promise.then(
                function (response) {
                    if (response.status === "FAILURE") {
                        SweetAlert.swal(response.data, "请重试", "error");
                    } else {
                        $scope.chargingSchemeList = response.data.list;
                        //传分页参数
                        $scope.chargingSchemeTableState.pagination.numberOfPages = response.numberOfPages;
                    }
                }
            );
        }

        function getGrade() {
            commonService.getGradeIdSelect({forChargingScheme: true}).then(function (result) {
                $scope.grades = result.data;
            });

        }

        getGrade()
        $scope.schemeJson = []
        /**
         * 计费操作
         * @param arg
         * 1：新增课程
         * 2：删除课程
         */
        $scope.chargeRule = function (arg) {
            if ($scope.priceUpdate) {
                return false
            }
            var data = {
                title: '',
                prices: []
            }
            switch (arg) {
                case 1:
                    for (var i = 0, len = $scope.grades.length; i < len; i++) {
                        data.id = new Date().getTime()
                        data.prices.push({price: '', gradeId: $scope.grades[i].id})
                    }
                    $scope.schemeJson.push(data)
                    break;
                case -1:
                    if($scope.schemeJson.length>1){
                        $scope.schemeJson.pop()
                    }
                    break;
            }
            scrollWidth()
        }
        function scrollWidth() {
            window._len_ = $scope.schemeJson.length
            $('#scroll_1').css({'width': $scope.schemeJson.length * 200})
        }
        $scope.cancelModal = function () {
            $scope.mtResultModal.hide()
        }
    }
]);