'use strict';

/**
 * The training maintenance controller.
 *
 * @author czq
 * @version 1.0
 */
angular.module('ywsApp').controller('TrainingManagementController',
    ['$scope', '$modal', '$rootScope', 'SweetAlert','TrainingManagementService','AuthenticationService','EmployeeService','DepartmentService','PositionService','TalentService',
    function($scope,   $modal,   $rootScope,   SweetAlert , TrainingManagementService, AuthenticationService, EmployeeService,DepartmentService,PositionService,TalentService ) {

        $scope.getAllTrainingTypes = getAllTrainingTypes;
        $scope.selectNode = selectNode;
        $scope.findSelectedTrainingType = findSelectedTrainingType;
        $scope.canManageTrainingType = canManageTrainingType;
        $scope.getSelectedTrainingTypePath = getSelectedTrainingTypePath;
        $scope.save = save;
        $scope.addRoot = addRoot;
        $scope.addChild = addChild;
        $scope.remove = remove;
        $scope.addTraining = addTraining;
        $scope.showTrainingType = showTrainingType;
        $scope.trainingTypeSelected = trainingTypeSelected;
        $scope.saveTraining = saveTraining;
        $scope.getTrainingByFilter = getTrainingByFilter;
        $scope.getTrainingList = getTrainingList;
        $scope.reset = reset;
        $scope.editTraining = editTraining;
        $scope.removeTraining = removeTraining;
        $scope.getAllDictData = getAllDictData;
        $scope.showSelectDepartment = showSelectDepartment;
        $scope.getAllDepartments = getAllDepartments;
        $scope.getAllSubjects = getAllSubjects;
        
        $scope.sf_training = {};
        $scope.training={};
        $scope.training.trainingType={};
        $scope.remindFilter = {};
        
        $scope.selectedUsers = [];
        $scope.selectableUsers = [];
        $scope.existRemindUsers = [];

        $scope.getAllTrainingTypes();
        $scope.getAllDictData();
        $scope.getAllDepartments();
        $scope.getAllSubjects();
        
        /**
         * Gets all subjects from server side.
         */
        function getAllSubjects() {
            var promise = EmployeeService.getAllSubjects();
            promise.then(function(response) {
                    if(response.status == "FAILURE"){
                        SweetAlert.swal( response.data,"请重试","error");
                    }
                    else{
                        $scope.subjects = response.data;
                    }
                },
                function(error) {
                });
        }
        
        /**
         * 获取所有字典数据
         */
        function getAllDictData(){
            var promise = EmployeeService.getAllDictData();
            promise.then(function(response){
                if(response.status == "FAILURE"){
                    SweetAlert.swal( response.data,"请重试","error");
                }
                else{
                    $scope.dictData = response.data;
                }
            },function(error){
                SweetAlert.swal("获取字典数据失败","请重试","error");
            });
        }
        
        /**
         * Shows select department dialog.
         */
        function showSelectDepartment() {
            $scope.modalTitle = '选择机构';
            $scope.modal = $modal({scope: $scope, templateUrl: 'partials/hr/department/modal.department.html', show: true,backdrop:'static'});
            $scope.modalDepartments = angular.copy($scope.departments);
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
         * Triggered when department is selected.
         * @param node node
         */
        $scope.selectDepartment = function(node) {
            $scope.newDepartment = $scope.findSelectedDepartment($scope.departments, node.id);
        }

        /**
         * When show the edit view or detail view , this function will show the positions in the given department.
         */
        $scope.deptToPos = function(){
            if($scope.employee.department){
                $scope.getPositions($scope.employee.department.id);
            }
        }

        /**
         * Triggered when department is selected.
         */
        $scope.departmentSelected = function() {
        	$scope.remindFilter.department = $scope.newDepartment;
            $scope.getPositions($scope.newDepartment.id);
            $scope.modal.hide();
        }

        /**
         * Recursively find the department with the given id.
         * @param departments the departments to start with
         * @param id the id of department to find
         * @return the department, or false if not found
         */
        $scope.findSelectedDepartment= function(departments, id) {
            var found = false;
            angular.forEach(departments, function(department) {
                if (found) {
                    return;
                }
                if (department.id == id) {
                    found = department;
                    return;
                }
                found = $scope.findSelectedDepartment(department.children, id);
            });
            return found;
        }
        
        /**
         * Gets all positions for the given department.
         * @param departmentId the department id
         */
        $scope.getPositions = function(departmentId) {
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
         * Gets all trainings for the current user's organization and render as a tree.
         */
        function getAllTrainingTypes() {
            var promise = TrainingManagementService.getAllTrainingTypes();
            promise.then(function (trainingTypes) {
                $scope.trainingTypes = trainingTypes;
            }, function (error) {
                console.log("获取培训列表失败！");
            });
        }

        /**
         * Triggered when a node is selected.
         * @param node the selected node
         */
        function selectNode(node) {
            $scope.selectedNode = node;
            getSelectedTrainingTypePath(node.id);
            $scope.selectedTrainingType = findSelectedTrainingType($scope.trainingTypes, node.id);
        }

        /**
         * 选中一个节点后，需要确定到达该节点的路径.
         * @param id
         */
        function getSelectedTrainingTypePath(id) {
            var promise = TrainingManagementService.getSelectedTrainingTypePath(id);
            promise.then(function (path) {
                $scope.path = path;
            }, function (error) {
                console.log("获取培训路径失败！");
            });
        }

        /**
         * Recursively find the training with the given id.
         * @param trainings the trainings to start with
         * @param id the id of training to find
         * @return the training, or false if not found
         */
        function findSelectedTrainingType(trainingTypes, id) {
            var found = false;
            angular.forEach(trainingTypes, function (trainingType) {
                if (found) {
                    return;
                }
                if (trainingType.id == id) {
                    found = trainingType;
                    return;
                }
                found = findSelectedTrainingType(trainingType.children, id);
            });
            return found;
        }

        /**
         * Checks whether the current user can manage training.
         */
        function canManageTrainingType() {
            var can = false;
            angular.forEach(AuthenticationService.currentUser().roles, function (role) {
                angular.forEach(role.permissions, function (permission) {
                    if (permission.name === 'TrainingTypeManagement') {
                        can = true;
                    }
                });
            });
            return can;
        }

        /**
         * 如果修改了培训名称，save
         */
        function save() {
        	if($scope.selectedTrainingType.name == null || $scope.selectedTrainingType.name == "" || $scope.selectedTrainingType.name == undefined){
        		SweetAlert.swal('培训名称不能为空');
        		return false;
        	}
        	else if($scope.selectedTrainingType.name.length > 128){
        		SweetAlert.swal('培训名称长度不能超过128');
        		return false;
        	}
        	var regu = "^[ ]+$";
            var re = new RegExp(regu)
            if(re.test($scope.selectedTrainingType.name)){
            	SweetAlert.swal('培训名称不能全部为空格');
                return false;
            }
            var promise = TrainingManagementService.update($scope.selectedTrainingType);
            promise.then(function (trainingTypes) {
                SweetAlert.swal('修改培训名称成功', 'success');
            }, function (error) {
                SweetAlert.swal('修改培训名称失败', 'error');
            });
        }

        /**
         * 添加一级培训
         */
        function addRoot() {
            SweetAlert.swal({
                    title: '添加一级培训类别',
                    text: "请输入培训名称:",
                    type: "input",
                    showCancelButton: true,
                    closeOnConfirm: false,
                    animation: "slide-from-top",
                    cancelButtonText: '取消',
                    confirmButtonText: '添加',
                    showLoaderOnConfirm: true
                },
                function (inputValue) {
                    if (inputValue === false) {
                        return false;
                    }
                    if (inputValue === "") {
                        swal.showInputError("请输入培训名称!");
                        return false;
                    }
                    if (inputValue.length > 128) {
                        swal.showInputError("培训名称长度不能超过128个字符!");
                        return false;
                    }
                    var regu = "^[ ]+$";
                    var re = new RegExp(regu)
                    if(re.test(inputValue)){
                    	swal.showInputError("培训名称不能全部为空格!");
                        return false;
                    }
                    var promise = TrainingManagementService.addRoot({'name': inputValue});
                    promise.then(function (data) {
                        $scope.trainingTypes.push(data);
                        swal.close();
                    }, function (error) {
                        SweetAlert.swal('添加失败', '请重试', 'error');
                    });
                }
            );
        }

        /**
         * 删除培训，如果有子培训，也一并删除
         */
        function remove() {
            SweetAlert.swal({
                    title: "请谨慎操作！",
                    text: '该培训的所有下属子培训都将被删除。',
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: '#DD6B55',
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    closeOnConfirm: true,
                    showLoaderOnConfirm: true
                }, function (confirm) {
                    if (confirm) {
                        var promise = TrainingManagementService.remove($scope.selectedTrainingType);
                        promise.then(function () {
                            $scope.selectedNode = null;
                            $scope.getAllTrainingTypes();
                        }, function (error) {
                            SweetAlert.swal("删除失败!", "error");
                        });
                    }
                }
            );
        }

        /**
         * 添加子培训
         */
        function addChild() {
            SweetAlert.swal({
                title: '添加' + $scope.selectedNode.name + '的子培训',
                text: "请输入子培训名称:",
                type: "input",
                showCancelButton: true,
                closeOnConfirm: false,
                animation: "slide-from-top",
                cancelButtonText: '取消',
                confirmButtonText: '添加',
                showLoaderOnConfirm: true
             },
             function(inputValue){
                if (inputValue === false) {
                    return false;
                }
                if (inputValue === "") {
                    swal.showInputError("请输入子培训名称!");
                    return false;
                }
                if (inputValue.length > 128) {
                    swal.showInputError("培训名称长度不能超过128个字符!");
                    return false;
                }
                var regu = "^[ ]+$";
                var re = new RegExp(regu)
                if(re.test(inputValue)){
                	swal.showInputError("培训名称不能全部为空格!");
                    return false;
                }
                var promise = TrainingManagementService.addChild($scope.selectedTrainingType, {'name': inputValue});
                promise.then(function(data) {
                    if (!$scope.selectedTrainingType.children) {
                        $scope.selectedTrainingType.children = [];
                    }
                    $scope.selectedTrainingType.children.push(data);
                    swal.close();
                }, function(error) {
                    SweetAlert.swal('添加失败', '请重试', 'error');
                });
             }
            );
        }

        /**
         *
         * @param tableState
         */
        function getTrainingList(tableState){
            $scope.gTableState = tableState;
            $scope.isLoading = true;
            $scope.pagination = tableState.pagination;
            $scope.start = $scope.pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
            $scope.number = $scope.pagination.number || 10;  // Number of entries showed per page.
            var promise = TrainingManagementService.getTrainingByFilter($scope.sf_training,$scope.start, $scope.number);
            promise.then(function (result) {
                $scope.trainings = result.data;
                angular.forEach($scope.trainings, function(training){
                	training.trainingDate = training.trainingDate == null ? undefined : new Date(training.trainingDate).Format("yyyy-MM-dd hh:mm:ss");
                    training.trainingDeadline = training.trainingDeadline == null ? undefined : new Date(training.trainingDeadline).Format("yyyy-MM-dd hh:mm:ss");
                    /*if(training.trainingDate != undefined){
                    	training.trainingDate = DateToStr(training.trainingDate)
                        training.trainingDeadline = DateToStr(training.trainingDeadline);
                    }*/
                	//根据trainingId查询所有remindUser
    	        	var temp = {};
    	        	temp.trainingId = training.id;
    	        	var promise = TrainingManagementService.getPersonByFilter(temp, 2, 0, 0);
    	        	promise.then(function(response){
    	        		if(response.status == "FAILURE"){
    	                    SweetAlert.swal( response.data,"请重试","error");
    	                }
    	                else{
    	                	training.signUpUsers = response.data;
    	                	$scope.gTableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
    	                    $scope.isLoading = false;
    	                }
    	        	});
                })
            }, function(error) {
                SweetAlert.swal('获取培训信息失败', 'error');
            });
        }

        /**
         * Get the trainings by filters.
         */
        function getTrainingByFilter(){
            $scope.isLoading = true;
            $scope.gTableState.pagination.start=0;
            $scope.pagination = $scope.gTableState.pagination;
            $scope.start = $scope.pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
            $scope.number = $scope.pagination.number || 10;  // Number of entries showed per page.
            var temp = angular.copy($scope.sf_training);
            if(temp.trainingType != null && temp.trainingType != undefined){
            	temp.trainingTypeId = temp.trainingType.id;
            	temp.trainingType = undefined;
            }
            var promise = TrainingManagementService.getTrainingByFilter(temp,$scope.start,$scope.number);
            promise.then(function(result) {
                $scope.trainings = result.data;
                //将时间戳转换为date
                angular.forEach($scope.trainings, function(training){
                    training.trainingDate = training.trainingDate == null ? undefined : new Date(training.trainingDate).Format("yyyy-MM-dd hh:mm:ss");
                    training.trainingDeadline = training.trainingDeadline == null ? undefined : new Date(training.trainingDeadline).Format("yyyy-MM-dd hh:mm:ss");   
                	//根据trainingId查询所有remindUser
    	        	var temp = {};
    	        	temp.trainingId = training.id;
    	        	var promise = TrainingManagementService.getPersonByFilter(temp, 2, 0 ,0);
    	        	promise.then(function(response){
    	        		if(response.status == "FAILURE"){
    	                    SweetAlert.swal( response.data,"请重试","error");
    	                }
    	                else{
    	                	training.signUpUsers = response.data;
    	                	$scope.gTableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
    	                    $scope.isLoading = false;
    	                }
    	        	});
                })
            }, function(error) {
                SweetAlert.swal('查询培训信息失败', 'error');
            });
        }

        function DateToStr(date){
            date = new Date(date);
            var year = date.getFullYear();
            var month = pattern(date.getMonth()+1);
            var day = pattern(date.getDate());
            var hour = pattern(date.getHours());
            var min = pattern(date.getMinutes());
            var sec = pattern(date.getSeconds());
            var dateStr = year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec;
            return dateStr
        }

        function pattern(str){
            str = new String(str);
            if(str.length < 2)
                return "0" + str;
            else
                return str;
        }

        /**
         * Add new training.
         */
        function addTraining(){
            $scope.addModalTitle = '新增培训';
            $scope.addModal = $modal({scope: $scope, templateUrl: 'partials/hr/training/modal.training.add.html', show: true });
        }

        /**
         * Show all training types when adding training.
         */
        function showTrainingType(){
            $scope.trainingTypeModalTitle = '选择培训类别';
            $scope.trainingTypeModal = $modal({scope: $scope, templateUrl: 'partials/hr/training/modal.trainingType.html', show: true });
            //$scope.modalTrainingypes = angular.copy($scope.trainingTypes);
        }
        
        $scope.showTrainingType2 = function(){
            $scope.trainingTypeModalTitle = '选择培训类别';
            $scope.trainingTypeModal = $modal({scope: $scope, templateUrl: 'partials/hr/training/modal.trainingType2.html', show: true });
            //$scope.modalTrainingypes = angular.copy($scope.trainingTypes);
        }

        /**
         * Triggered when training type is selected when adding a train.
         */
        function trainingTypeSelected() {
        	$scope.sf_training.trainingType = angular.copy($scope.selectedTrainingType);
            //$scope.training.trainingType = angular.copy($scope.selectedTrainingType);
            $scope.trainingTypeModal.hide();
        }
        
        $scope.trainingTypeSelected2 = function(){
        	$scope.training.trainingType = angular.copy($scope.selectedTrainingType);
            $scope.trainingTypeModal.hide();
        }

        /**
         * Save the training
         */
        function saveTraining(){
        	var reg_num = /^\d+(\.\d+)?$/;
        	//$scope.training.trainingDate = $scope.training.trainingDate == null ? undefined : new Date($scope.training.trainingDate);
        	//$scope.training.trainingDeadline = $scope.training.trainingDeadline == null ? undefined : new Date($scope.training.trainingDeadline);
        	$scope.training.remindUsers = $scope.existRemindUsers;
        	var trainingDate = angular.copy($scope.training.trainingDate);
        	var trainingDeadline = angular.copy($scope.training.trainingDeadline);
        	trainingDate = trainingDate == null ? undefined : new Date(trainingDate);
        	trainingDeadline = trainingDeadline == null ? undefined : new Date(trainingDeadline);
        	if(trainingDeadline > trainingDate){
				SweetAlert.swal('报名截止时间不能晚于培训时间', '请重试', 'error');
				return;
        	}
        	if(($scope.training.trainingHour && !reg_num.test($scope.training.trainingHour)) || $scope.training.trainingHour > 100 ){
        		SweetAlert.swal('培训学时只能为数字，且小于100', '请重试', 'error');
				return;
        	}
        	if($scope.training.name.length > 255){
        		SweetAlert.swal('培训名称长度不能超过255个字符', '请重试', 'error');
				return;
        	}
        	if($scope.training.trainingAddress && $scope.training.trainingAddress.length > 255){
        		SweetAlert.swal('培训地址长度不能超过255个字符', '请重试', 'error');
				return;
        	}
        	if($scope.training.trainingDescription && $scope.training.trainingDescription.length > 255){
        		SweetAlert.swal('培训描述长度不能超过255个字符', '请重试', 'error');
				return;
        	}
        	if($scope.training.trainingTeacher && $scope.training.trainingTeacher.length > 255){
        		SweetAlert.swal('培训师长度不能超过255个字符', '请重试', 'error');
				return;
        	}
        	if($scope.training.trainingCost && $scope.training.trainingCost.length > 255){
        		SweetAlert.swal('培训费用长度不能超过255个字符', '请重试', 'error');
				return;
        	}
        	if($scope.training.trainingCrowd && $scope.training.trainingCrowd.length > 255){
        		SweetAlert.swal('适合人群长度不能超过255个字符', '请重试', 'error');
				return;
        	}
        	if($scope.training.id){
        		$scope.training.trainingDate = $scope.training.trainingDate == null ? undefined : new Date($scope.training.trainingDate);
            	$scope.training.trainingDeadline = $scope.training.trainingDeadline == null ? undefined : new Date($scope.training.trainingDeadline);
        		//id存在，是修改的
        		var trainingAppendix = document.getElementById("trainingAppendix").files[0];	
    			if(trainingAppendix != null){
    				$scope.training.trainingAppendix = trainingAppendix.name;
    			}
        		var trainingPaper = document.getElementById("trainingPaper").files[0];
        		if(trainingPaper != null){
    				$scope.training.trainingPaper = trainingPaper.name;
    			}
        		var promise = TrainingManagementService.editTraining($scope.training);
                promise.then(function(response) {
                	if(response.status == "FAILURE"){
                		SweetAlert.swal(response.data);
                	}
                	else{
                		if(response.status == "FAILURE"){
                    		SweetAlert.swal(response.data);
                    	}
                    	else{
                    		if(trainingAppendix != undefined){
                    			fileUpload(trainingAppendix.name, trainingAppendix, response.data);
                    		}
                    		if(trainingPaper != undefined){
                    			fileUpload(trainingPaper.name, trainingPaper, response.data);
                    		}
                    		SweetAlert.swal('修改成功', 'success');
                            getTrainingByFilter();
                    	}
                	}
                });
                $scope.training = {};
            	$scope.addModal.hide();
        	}
        	else{
        		//新增
        		$scope.training.trainingDate = $scope.training.trainingDate == null ? undefined : new Date($scope.training.trainingDate);
            	$scope.training.trainingDeadline = $scope.training.trainingDeadline == null ? undefined : new Date($scope.training.trainingDeadline);
        		var trainingAppendix = document.getElementById("trainingAppendix").files[0];	
    			if(trainingAppendix != null){
    				$scope.training.trainingAppendix = trainingAppendix.name;
    			}
        		var trainingPaper = document.getElementById("trainingPaper").files[0];
        		if(trainingPaper != null){
    				$scope.training.trainingPaper = trainingPaper.name;
    			}
        		var promise = TrainingManagementService.addTraining($scope.training);
                promise.then(function(response) {
                	if(response.status == "FAILURE"){
                		SweetAlert.swal(response.data);
                	}
                	else{
                		if(trainingAppendix != undefined){
                			fileUpload(trainingAppendix.name, trainingAppendix, response.data);
                		}
                		if(trainingPaper != undefined){
                			fileUpload(trainingPaper.name, trainingPaper, response.data);
                		}
                		SweetAlert.swal('添加成功', 'success');
                        getTrainingByFilter();
                	}
                });
                $scope.training = {};
            	$scope.addModal.hide();
        	}
        }

        /**
         * Reset the search conditions.
         */
        function reset(){
            $scope.sf_training = {};
            $scope.selectedTrainingType = null;
        }

        /**
         * Edit the selected training.
         */
        function editTraining(training){
        	$scope.training = angular.copy(training);
        	//根据trainingId查询所有remindUser
        	var temp = {};
        	temp.trainingId = training.id;
        	//pagesize传0，表示不分页
        	var promise = TrainingManagementService.getPersonByFilter(temp, 1, 0, 0);
        	promise.then(function(response){
        		if(response.status == "FAILURE"){
                    SweetAlert.swal( response.data,"请重试","error");
                }
                else{
                	$scope.training.remindUsers = response.data;
                	$scope.existRemindUsers = angular.copy(response.data);
                	$scope.addModalTitle = '修改培训';
                    $scope.addModal = $modal({scope: $scope, templateUrl: 'partials/hr/training/modal.training.add.html', show: true });
                }
        	});
        }

        /**
         * remove the selected training.
         */
        function removeTraining(training){
            SweetAlert.swal({
                    title: "请谨慎操作！",
                    text: '确定要删除该培训吗？',
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: '#DD6B55',
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    closeOnConfirm: true,
                    showLoaderOnConfirm: true
                }, function(confirm) {
                    if (confirm) {
                        var promise = TrainingManagementService.removeTraining(training)
                            .then(function(data){
                                getTrainingByFilter();
                            },function(error){
                                SweetAlert.swal('删除失败！', 'error');
                            }
                        );
                    }
                }
            );
        }
        
        /**
         * select the person to be reminded.
         */
        $scope.selectRemindPerson = function(){
        	$scope.leftIndexPage = 0;
        	$scope.leftIndexNumber = 10;
        	$scope.loadMoreFlag = true;
        	$scope.remindFilter = {};
        	$scope.selectedUsers = angular.copy($scope.existRemindUsers);
        	var ids = "";
        	if($scope.selectedUsers && $scope.selectedUsers.length > 0){
        		angular.forEach($scope.selectedUsers,function(p, index){
        			if(ids == ""){
        				ids = p.id;
        			}
        			else{
        				ids = ids + "," + p.id;
        			}
        		});
        	}
        	var temp = {};
        	temp.ids = ids;
        	var promise = TrainingManagementService.getPersonByFilter(temp, 1, $scope.leftIndexPage, $scope.leftIndexNumber);
        	promise.then(function(response){
        		if(response.status == "FAILURE"){
        			SweetAlert.swal(response.data);
        		}
        		else{
        			$scope.selectableUsers = response.data.list;
            		$scope.selectableSize = response.data.total;
            		if($scope.selectableUsers && $scope.selectableUsers.length == 10){
            			$scope.loadMoreFlag = true;
            		}
            		else{
            			$scope.loadMoreFlag = false;
            		}
        		}
        		//将已存在的从最左侧移除
        		/*var length = $scope.existRemindUsers.length;
        		if(length > 0){
        			var count = 0;
        			angular.forEach($scope.existRemindUsers, function(p2,index2){
        				angular.forEach($scope.selectableUsers, function(p1,index1){
        					if(p1.id == p2.id){
                				$scope.selectableUsers.splice(index1, 1);
                				count = count+1;
                				return;
                			}
                		});
        				if(count == length){
        					return;
        				}
            		});
        		}*/
            	$scope.remindPersonModalTitle = '选择要提醒的员工';
                $scope.remindPersonModal = $modal({scope: $scope, templateUrl: 'partials/hr/training/modal.remindPerson.html', show: true });
        	},function(response){
        		SweetAlert(response.data);
        	});
        }
        
        $scope.loadMore = function(){
        	$scope.leftIndexPage = $scope.selectableUsers.length;//$scope.leftIndexPage + 10;
        	$scope.getToBeRemindedPersonByFilter(2);
        }
        
        /**
         * 选择一个
         */
        $scope.togglePerson = function(person){
        	//更新已选择的用户
        	if($scope.containsPerson($scope.selectedUsers, person)){
        		var keepGoing = true;
        		angular.forEach($scope.selectedUsers,function(p, index){
        			if(keepGoing){
        				if(p.id == person.id){
        					$scope.selectedUsers.splice(index, 1);
                            keepGoing = false;
        				}
        			}
        		});
        	}
        	else{
        		if(!$scope.selectedUsers){
        			$scope.selectedUsers = [];
        		}
        		$scope.selectedUsers.push(person);
        	}
        	//更新可选择用户
        	if($scope.containsPerson($scope.selectableUsers, person)){
        		keepGoing = true;
        		//如果在，那么需要从中移除
        		angular.forEach($scope.selectableUsers, function(p,index){
        			if(keepGoing){
        				if(p.id == person.id){
        					$scope.selectableUsers.splice(index, 1);
        					keepGoing = false;
        					$scope.selectableSize = $scope.selectableSize - 1;//从待选择的移到已选择列表，待选择大小减一
        				}
        			}
        		});
        	}
        	else{
        		//否则，需要往里面添加
        		if(!$scope.selectableUsers){
        			$scope.selectableUsers = [];
        		}
        		$scope.selectableUsers.push(person);
				$scope.selectableSize = $scope.selectableSize + 1;//从已选择的移到带选择列表，待选择大小加一
        	}	
        }
        
        /**
         * 判断是否包含
         */
        $scope.containsPerson = function(persons, person){
        	var found = false;
            if (persons) {
              angular.forEach(persons, function(p) {
                if (p.id === person.id) {
                  found = true;
                }
              });
            }
            return found;
        }
        
        /**
         * 从左侧可选择的添加
         */
        $scope.addPersonToRight = function(addPersons){
        	angular.forEach(addPersons, function(addPerson, index1){
        		angular.forEach($scope.selectableUsers,function(p,index){
            		if(addPerson == p.id){
            			$scope.togglePerson(p);
    	                return;
            		}
            	});
        	});
        }
        
        /**
         * 从右侧已选择的删除
         */
        $scope.removePersonFromRight = function(removePersons){
        	angular.forEach(removePersons, function(removePerson, index1){
        		angular.forEach($scope.selectedUsers,function(p,index){
            		if(removePerson == p.id){
            			$scope.togglePerson(p);
    	                return;
            		}
            	});
        	});
        }
        
        /**
         * 将左侧所有的添加到右侧
         */
        $scope.addAllToRight = function(){
        	var copy = angular.copy($scope.selectableUsers);
        	angular.forEach(copy,function(p){
        		$scope.togglePerson(p);
        	});
        }
        
        /**
         * 将右侧已选择的全部删除
         */
        $scope.removeAllFromRight = function(){
        	var copy = angular.copy($scope.selectedUsers);
        	angular.forEach(copy,function(p,index){
        		$scope.togglePerson(p);
        	});
        }
        
        /**
         * 条件查询可选的员工
         */
        $scope.getToBeRemindedPersonByFilter = function(flag){
        	if(flag == 1){
        		$scope.leftIndexPage = 0;
        	}
        	$scope.loadMoreFlag= true;
        	var temp = angular.copy($scope.remindFilter);
        	temp.name = temp.name == null ? undefined : temp.name;
        	temp.employeeId = temp.employeeId == null ? undefined : temp.employeeId;
        	temp.registeredResidenceType = temp.registeredResidenceType == null ? undefined : temp.registeredResidenceType;
        	temp.department = temp.department == null ? undefined : temp.department;
        	temp.position = temp.position == null ? undefined : temp.position;
        	temp.educationDegree = temp.educationDegree == null ? undefined : temp.educationDegree;
        	temp.subject = temp.subject == null ? undefined : temp.subject;
        	temp.workingYears = temp.workingYears == null ? undefined : temp.workingYears;
        	temp.employmentType = temp.employmentType == null ? undefined : temp.employmentType;
        	temp.employer = temp.employer == null ? undefined : temp.employer;
        	temp.employmentLevel = temp.employmentLevel == null ? undefined : temp.employmentLevel;
        	temp.starLevel = temp.starLevel == null ? undefined : temp.starLevel;
        	temp.contractType = temp.contractType == null ? undefined : temp.contractType;
        	temp.hiringDateBegin = temp.hiringDateBegin == null ? undefined : temp.hiringDateBegin;
        	temp.hiringDateEnd = temp.hiringDateEnd == null ? undefined : temp.hiringDateEnd;
        	
        	if(temp.department && temp.department != ""){
        		temp.departmentId = temp.department.id;
        		temp.department = undefined;
        	}
        	if(temp.position && temp.position != ""){
        		temp.positionId = temp.position.id;
        		temp.position = undefined;
        	}
        	if(temp.subject){
        		temp.subject = temp.subject.id;
            }
        	var ids = "";
        	if($scope.selectedUsers && $scope.selectedUsers.length > 0){
        		angular.forEach($scope.selectedUsers,function(p, index){
        			if(ids == ""){
        				ids = p.id;
        			}
        			else{
        				ids = ids + "," + p.id;
        			}
        		});
        	}
        	temp.ids = ids;
        	var promise = TrainingManagementService.getPersonByFilter(temp, 1,$scope.leftIndexPage,$scope.leftIndexNumber);
        	promise.then(function(response){
        		if(response.status == "FAILURE"){
                    SweetAlert.swal( response.data,"请重试","error");
                }
                else{
            		$scope.selectableSize = response.data.total;
                	if(response.data.list.length == 0 || response.data.list.length < 10){
            			$scope.loadMoreFlag= false;
            		}
            		else{
            			$scope.loadMoreFlag= true;
            		}
                	if(flag == 1){
                		//点击查询触发的查询，整个list替换
                		$scope.selectableUsers = response.data.list;
                	}
                	else if(flag == 2){
                		//点击加载更多按钮触发的查询，在原来list后面拼接上新的结果
                		angular.forEach(response.data.list, function(p, index){
                			$scope.selectableUsers.push(p);
                    	});
                	}
                	//将被选择的的从最左侧移除
            		var length = $scope.selectedUsers.length;
            		if(length > 0){
            			var count = 0;
            			angular.forEach($scope.selectedUsers, function(p2,index2){
            				angular.forEach($scope.selectableUsers, function(p1,index1){
            					if(p1.id == p2.id){
                    				$scope.selectableUsers.splice(index1, 1);
                    				count = count+1;
                    				return;
                    			}
                    		});
            				if(count == length){
            					return;
            				}
                		});
            		}
                }	
        	});
        }
        
        /**
         * reset the remind person modal's select condition.
         */
        $scope.resetRemindFilter = function(){
        	$scope.remindFilter = {};
        }
        
        /**
         * save the selected person to be reminded.
         */
        $scope.saveSelectPerson = function(){
        	$scope.existRemindUsers = $scope.selectedUsers;
        	$scope.remindPersonModal.hide();
        }
                
        /**
		 * 上传文件
		 * @param fileName 文件名称
		 * @param f		文件
		 * @param training	主要是为了获取trainingId
		 */
		function fileUpload(fileName, f, training){
			if(f == null)
				return;
			var r = new FileReader();
			r.onloadend = function(e){
				var data = e.target.result;
				var uploadFileDir = "HR-TRAINING/";
				TalentService.uploadImageToUrl(data, fileName, uploadFileDir);
			}
			r.readAsDataURL(f);
		}
		
		/**
		 * 查看详细
		 */
		$scope.showDetail = function(training){
			$scope.training = training;
			$scope.detailModalTitle = '查看培训详情';
            $scope.detailModal = $modal({scope: $scope, templateUrl: 'partials/hr/training/modal.training.detail.html', show: true });
		}
		
		/**
		 * 下载文件
		 */
		$scope.download = function(training, flag){
			if(flag == 2){
				window.location.href = QINIU_HR_TRAINING_DOMAIN + training.trainingPaper;
			}
			else if(flag == 1){
				window.location.href =QINIU_HR_TRAINING_DOMAIN + training.trainingAppendix;
			}
		}
		
		/**
		 * 超过报名截止时间
		 */
		$scope.isTimeOut = function(training){
			var nowDate = new Date();
            var deadline = new Date(training.trainingDeadline);
            if(nowDate > deadline){
                return true;
            }
            else{
            	return false;
            }
		}
		
		/**
		 * 培训已经结束
		 */
		$scope.isEnd = function (training){
			var nowDate = new Date();
            var trainingDate = new Date(training.trainingDate);
            if(nowDate > trainingDate){
                return true;
            }
            else{
            	return false;
            }
		}
		
		$scope.signUp = function(training){
			SweetAlert.swal({
                title: "报名确认！",
                text: '确定报名【' + training.name + '】这个培训？',
                type: "info",
                showCancelButton: true,
                confirmButtonColor: '#DD6B55',
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                closeOnConfirm: true,
                showLoaderOnConfirm: true
            }, function(confirm) {
                if (confirm) {
                	var promise = TrainingManagementService.signUp(training.id);
        			promise.then(function(response){
        				if(response.status == "FAILURE"){
        					SweetAlert.swal( response.data,"请重试","error");
        				}
        				else{
        					getTrainingByFilter();
        					SweetAlert.swal( "报名成功","确定","success");
        				}
        			});
                }
            });
		}
		
		$scope.showSignUpUserInfo = function(training){
			//to be done
			$scope.training = training;
			$scope.userInfoModalTitle = '查看报名情况';
            $scope.userInfoModal = $modal({scope: $scope, templateUrl: 'partials/hr/training/modal.signUpUsers.html', show: true,backdrop:'static'});
		}
		
		$scope.getSignUpUserList = function(tableState){
			$scope.suTableState = tableState;
            $scope.isLoading = true;
            $scope.pagination = tableState.pagination;
            $scope.suStart = $scope.pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
            $scope.suNumber = $scope.pagination.number || 10;  // Number of entries showed per page.
            var temp = {};
            temp.trainingId = $scope.training.id;
            var promise = TrainingManagementService.getSignUpUserByFilter(temp, $scope.suStart, $scope.suNumber);
            promise.then(function (response) {
            	if(response.status == "FAILURE"){
            		SweetAlert.swal(response.data, 'error');
            	}
            	else{
            		$scope.signUpUserList = response.data.list;
            		$scope.suTableState.pagination.numberOfPages = response.data.pages;//set the number of pages so the pagination can update
                    $scope.isLoading = false;
            	}
            });
		}
		
		$scope.hideAddView = function(){
			$scope.addModal.hide();
			$scope.training = {};
		}
		
    }
]);
