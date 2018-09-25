'use strict';

/**
 * The change manange controller.
 *
 * @author czq
 * @version 1.0
 */
angular.module('ywsApp').controller('ChangeManagementController', [
    '$scope', '$modal', '$rootScope', 'SweetAlert','EmployeeService','DepartmentService','AuthenticationService','PositionService',
    function($scope,   $modal,   $rootScope,   SweetAlert ,EmployeeService, DepartmentService,AuthenticationService, PositionService) {

    	$scope.getAllDictData = getAllDictData;
    	$scope.getAllDepartments = getAllDepartments;
    	
    	$scope.getAllDictData();
    	$scope.getAllDepartments();
    	
    	$scope.filter = {};

    	$scope.getChangesByFilter = function(){
            $scope.isLoading = true;
            $scope.start = $scope.pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
            $scope.number = $scope.pagination.number || 10;  // Number of entries showed per page.
            var temp = angular.copy($scope.filter);
            $scope.filterLastTime = angular.copy($scope.filter);
            if(temp.departmentBefore){
            	temp.departmentBefore = temp.departmentBefore.id
            }
            if(temp.positionBefore){
            	temp.positionBefore = temp.positionBefore.id
            }
            if(temp.departmentAfter){
            	temp.departmentAfter = temp.departmentAfter.id
            }
            if(temp.positionAfter){
            	temp.positionAfter = temp.positionAfter.id
            }
            var promise = EmployeeService.getEmployeeChanges(temp,$scope.start,$scope.number);
            promise.then(function(response) {
                if(response.status == "FAILURE"){
                    SweetAlert.swal(response.data,"请重试","error");
                }
                else{
                    var data = {};
                    data.data = response.data.list;
                    data.numberOfPages = response.data.pages;
                    $scope.tableState.pagination.numberOfPages = data.numberOfPages;//set the number of pages so the pagination can update
                    $scope.isLoading = false;
                    $scope.changes = data.data;
                    //针对每条记录，都需要去设置其员工姓名，入职日期，部门性质
                    angular.forEach($scope.changes, function(p, index){
                    	var employee = {};
                    	employee.id = p.employeeId;
                        var promise = EmployeeService.getEmployeesByFilters(employee, 0, 10);
                        promise.then(function(response) {
                            if(response.status == "FAILURE"){
                                SweetAlert.swal(response.data,"请重试","error");
                            }
                            else{
                            	if(response.data.list.length > 0){
                                    p.employee = response.data.list[0];
                            	}
                            }
                        });
                    });
                }
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
         * 列表加载
         */
        $scope.getChanges = function(tableState){
            $scope.tableState = tableState;
            $scope.isLoading = true;
            $scope.pagination = tableState.pagination;
            $scope.start = $scope.pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
            $scope.number = $scope.pagination.number || 10;  // Number of entries showed per page.
            var filter2 = {};
            var promise = EmployeeService.getEmployeeChanges(filter2,$scope.start,$scope.number);
            promise.then(function(response) {
                if(response.status == "FAILURE"){
                    SweetAlert.swal(response.data,"请重试","error");
                }
                else{
                    var data = {};
                    data.data = response.data.list;
                    data.numberOfPages = response.data.pages;
                    tableState.pagination.numberOfPages = data.numberOfPages;//set the number of pages so the pagination can update
                    $scope.isLoading = false;
                    $scope.changes = data.data;
                    //针对每条记录，都需要去设置其员工姓名，入职日期，部门性质
                    angular.forEach($scope.changes, function(p, index){
                    	var employee = {};
                    	employee.id = p.employeeId;
                        var promise = EmployeeService.getEmployeesByFilters(employee, 0, 10);
                        promise.then(function(response) {
                            if(response.status == "FAILURE"){
                                SweetAlert.swal(response.data,"请重试","error");
                            }
                            else{
                            	if(response.data.list.length > 0){
                                    p.employee = response.data.list[0];
                            	}
                            }
                        });
                    });
                }
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
        $scope.showSelectDepartment = function(flag) {
        	$scope.dFlag = flag;
            $scope.modalTitle = '选择机构';
            $scope.modal = $modal({scope: $scope, templateUrl: 'partials/hr/department/modal.department.html', show: true,backdrop:'static'});
            //如果是校区或者大区人员，那么要限定部门，校区的部门限定
            $scope.modalDepartments = angular.copy($scope.departments);
        }

        /**
         * Triggered when department is selected.
         * @param node node
         */
        $scope.selectDepartment = function(node) {
            $scope.newDepartment = $scope.findSelectedDepartment($scope.departments, node.id);
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
                	if($scope.dFlag && $scope.dFlag == 1){
                		//before
                		$scope.positionsBefore = response.data;
                	}
                	if($scope.dFlag && $scope.dFlag == 2){
                		//before
                		$scope.positionsAfter = response.data;
                	}
                }
            });
        }
        
        /**
         * Triggered when department is selected.
         */
        $scope.departmentSelected = function(flag) {
//            $scope.employee.department = $scope.newDepartment;
//            $scope.newChange.departmentAfter = $scope.newDepartment;
        	if($scope.dFlag && $scope.dFlag == 1){
        		//before
        		$scope.filter.departmentBefore = $scope.newDepartment;
        	}
        	else if($scope.dFlag && $scope.dFlag == 2){
        		//after
        		$scope.filter.departmentAfter = $scope.newDepartment;
        	}
            $scope.getPositions($scope.newDepartment.id);
            $scope.modal.hide();
        }

        /**
         * Recursively find the department with the given id.
         * @param departments the departments to start with
         * @param id the id of department to find
         * @return the department, or false if not found
         */
        $scope.findSelectedDepartment = function(departments, id) {
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
        
        $scope.reset = function(){
        	$scope.filter = {};
        	$scope.positionsBefore = null;
    		$scope.positionsAfter = null;
    		$scope.dFlag = null;
        }
        
        $scope.exportToExcel = function(){
        	//导出异动的时候，去查询所有符合条件的list
    		var temp = angular.copy($scope.filterLastTime);
    		if(temp == null){
    			temp = {};
    		}
            if(temp.departmentBefore){
            	temp.departmentBefore = temp.departmentBefore.id
            }
            if(temp.positionBefore){
            	temp.positionBefore = temp.positionBefore.id
            }
            if(temp.departmentAfter){
            	temp.departmentAfter = temp.departmentAfter.id
            }
            if(temp.positionAfter){
            	temp.positionAfter = temp.positionAfter.id
            }
            var promise = EmployeeService.getEmployeeChanges(temp, 0, 0);
            promise.then(function(response) {
                if(response.status == "FAILURE"){
                    SweetAlert.swal(response.data,"请重试","error");
                }
                else{
                    $scope.isLoading = false;
                    $scope.listModels = response.data;
                    //针对每条记录，都需要去设置其员工姓名，入职日期，部门性质
                    var size = $scope.listModels.length;
                    if(size == 0){
                    	SweetAlert.swal("无任何结果可以导出", "请重试", "warning");
                    	return false;
                    }
                	angular.forEach($scope.listModels, function(p, index){
                    	var employee = {};
                    	employee.id = p.employeeId;
                        var promise = EmployeeService.getEmployeesByFilters(employee, 0, 10);
                        promise.then(function(response) {
                            if(response.status == "FAILURE"){
                                SweetAlert.swal(response.data,"请重试","error");
                            }
                            else{
                            	if(response.data.list.length > 0){
                                    p.employee = response.data.list[0];
                                    p.index = index+1;
                                    p.name = p.employee.user == null ? "" : p.employee.user.name;
                                    p.departmentBeforeName 	= p.departmentBefore == null ? "" : p.departmentBefore.name;
                                	p.positionBeforeName 	= p.positionBefore == null ? "" : p.positionBefore.name;
                                	p.departmentAfterName 	= p.departmentAfter == null ? "" : p.departmentAfter.name;
                                	p.positionAfterName 	= p.positionAfter == null ? "" : p.positionAfter.name;
                                	p.hiringDateStr 		= p.employee.hiringDate == null ? "" : new Date(p.employee.hiringDate).Format("yyyy-MM-dd");
                                	p.executeDateStr		= p.executeDate == null ? "" : new Date(p.executeDate).Format("yyyy-MM-dd");
                                	p.changeTypeName 		= (p.changeType == null || p.changeType == 0) ? "" : $scope.dictData.changeType[p.changeType-1].name;
                            		p.schoolNatureName 		= (p.employee.department.schoolNature == null || p.employee.department.schoolNature == null) ? "" : $scope.dictData.schoolNature[p.employee.department.schoolNature-1].name;
                                	p.courseLevelBeforeName = (p.courseLevelBefore == null || p.courseLevelBefore == 0)? "" : $scope.dictData.courseType[p.courseLevelBefore-1].name;
                                	p.courseLevelAfterName	= (p.courseLevelAfter == null || p.courseLevelAfter == 0) ? "" : $scope.dictData.courseType[p.courseLevelAfter-1].name;	
                                	p.basicSalaryBefore 	= p.basicSalaryBefore == null ? "" : p.basicSalaryBefore;
                                	p.performanceBefore 	= p.performanceBefore == null ? "" : p.performanceBefore;
                                	p.basicSalaryAfter 		= p.basicSalaryAfter == null ? "" : p.basicSalaryAfter;
                                	p.performanceAfter 		= p.performanceAfter == null ? "" : p.performanceAfter;
                            	}
                            	size = size-1;
                            	if(size == 0){
                            		$scope.doExport(temp);
                            	}
                            }
                        });
                    });
                }
            });
    	}
        
        $scope.doExport = function(temp){
        	var titleName = "查询条件：";
        	var searchCondition = "";
        	if(temp.name){
        		searchCondition = searchCondition + "姓名：" + temp.name + "    ";
        	}
        	if(temp.changeType){
        		searchCondition = searchCondition + "异动类型：" + $scope.dictData.changeType[temp.changeType-1].name + "    ";
        	}
        	if(temp.departmentBefore){
        		searchCondition = searchCondition + "异动前部门：" + temp.departmentBefore.name + "  ";
        		if(temp.positionBefore){
        			searchCondition = searchCondition + "异动前岗位：" + temp.positionBefore.name + "    ";
        		}
        	}
        	if(temp.departmentAfter){
        		searchCondition = searchCondition + "异动后部门：" + temp.departmentAfter.name + "  ";
        		if(temp.positionAfter){
        			searchCondition = searchCondition + "异动后岗位：" + temp.positionAfter.name + "    ";
        		}
        	}
        	if(temp.executeDateBegin || temp.executeDateEnd){
        		searchCondition = searchCondition + "执行日期:";
            	if(temp.executeDateBegin){
            		searchCondition = searchCondition + temp.executeDateBegin;
            	}
            	if(temp.executeDateEnd){
            		searchCondition = searchCondition + " —— " + temp.executeDateEnd;
            	}
        	}
        	if(temp.hiringDateBegin || temp.hiringDateEnd){
        		searchCondition = searchCondition + "入职日期:";
            	if(temp.hiringDateBegin){
            		searchCondition = searchCondition + temp.hiringDateBegin;
            	}
            	if(temp.hiringDateEnd){
            		searchCondition = searchCondition + " —— " + temp.hiringDateEnd;
            	}
        	}
			var exportTableStyle = {
					sheetid: titleName,
					headers: true,
					caption: {title: titleName + searchCondition, style:'height:30px;'},
					column: {style:'font-size:16px; text-align:left;'},
					columns: [
					          {columnid:'index',title: '序号'},
					          {columnid:'name',title: '员工姓名'},
					          {columnid:'hiringDateStr',title: '入职日期'},
					          {columnid:'changeTypeName',title: '异动类型'},
					          {columnid:'schoolNatureName', title: '校区性质'},
					          {columnid:'departmentBeforeName',title: '异动前部门'},
					          {columnid:'positionBeforeName',title: '异动前岗位'},
					          {columnid:'basicSalaryBefore',title: '异动前底薪'},
					          {columnid:'performanceBefore',title: '异动前绩效'},
					          {columnid:'commissionBefore',title: '异动前提成'},
					          {columnid:'courseLevelBeforeName',title: '异动前课补级别'},
					          {columnid:'departmentAfterName',title: '异动后部门'},
					          {columnid:'positionAfterName',title: '异动后岗位'},
					          {columnid:'basicSalaryAfter',title: '异动后底薪'},
					          {columnid:'performanceAfter',title: '异动后绩效'},
					          {columnid:'commissionAfter',title: '异动后提成'},
					          {columnid:'courseLevelAfterName',title: '异动后课补级别'},
					          {columnid:'executeDateStr',title: '执行日期'},
					          {columnid:'remark',title: '备注'},
					         ],
		          row: {
		        	  style: function(sheet, row, rowidx){
		        		  return 'background:'+(rowidx%2?'#FFFFFF':'#A1C1FB');
		        	  }
		          },
		          cells: {
		        	  style: 'font-size:13px; text-align:left;'
		          }
			};
			alasql('SELECT * INTO XLS("异动纪录.xls", ?) FROM ?', [exportTableStyle, $scope.listModels]);
        }
    }
]);

