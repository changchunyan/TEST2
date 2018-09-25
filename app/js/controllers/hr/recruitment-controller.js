'use strict';

/**
 * The recruitment manage controller.
 *
 * @author czq
 * @version 1.0
 */
angular.module('ywsApp').controller('RecruitmentManagementController', [
    '$scope', '$modal', '$rootScope', 'SweetAlert','RecruitmentManagementService','DepartmentService','PositionService','AuthenticationService',
    function($scope,   $modal,   $rootScope,   SweetAlert ,RecruitmentManagementService, DepartmentService,PositionService,AuthenticationService) {

        //function declaration
        $scope.showSelectDepartment = showSelectDepartment;
        $scope.getAllDepartments = getAllDepartments;
        $scope.departmentSelected = departmentSelected;
        $scope.selectDepartment = selectDepartment;
        $scope.getPositions = getPositions;
        $scope.addRecruitment = addRecruitment;
        $scope.saveRecruitment = saveRecruitment;
        $scope.getResponsibleList = getResponsibleList;
        $scope.getExecutorList = getExecutorList;
        $scope.getRecruitmentList = getRecruitmentList;
        $scope.isPause = isPause;
        $scope.isFinish = isFinish;
        $scope.isTimeout = isTimeout;
        $scope.showResumeList = showResumeList;
        $scope.updateRecruitmentStatus = updateRecruitmentStatus;
        $scope.getRecruitmentByFilter = getRecruitmentByFilter;
        $scope.reset = reset;
        $scope.editRecruitment = editRecruitment;
        $scope.updateRecruitment = updateRecruitment;
        $scope.deleteRecruitment = deleteRecruitment;

        //variable definition
        $scope.recruitment = {};
        $scope.sf_recruitment = {};
       // $scope.completeRateGreen = {background-color: 'springgreen',width:'60%'};

        //execute functions at first load
        $scope.getAllDepartments();
        $scope.getExecutorList();
        $scope.getResponsibleList();

        /**
         * 删除招聘需求
         * @param recruitment
         */
        function deleteRecruitment(recruitment){
            SweetAlert.swal({
                title: "确定要删除该招聘需求?",
                type: "info",
                showCancelButton: true,
                confirmButtonColor: '#DD6B55',
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                closeOnConfirm: true
            }, function(confirm) {
                if (confirm){
                    var promise = RecruitmentManagementService.deleteRecruitment(recruitment.id);
                    promise.then(function (response) {
                        if(response.status == "FAILURE"){
                            SweetAlert.swal( response.data,"请重试","error");
                        }
                        else{
                            SweetAlert.swal("删除成功","确定","success");
                            getRecruitmentByFilter();
                        }
                    }, function (error) {
                        SweetAlert.swal("删除失败","请重试","error");
                    });
                }
            });
        }

        /**
         * Gets all departments for the current user's organization and render as a tree.
         */
        function getAllDepartments() {
            var promise = DepartmentService.list(AuthenticationService.currentUser().organization.id);
            promise.then(function (response) {
                if(response.status == "FAILURE"){
                    SweetAlert.swal( response.data,"请重试","error");
                }
                else{
                    $scope.departments = response.data;
                }
            }, function (error) {
            });
        }

        /**
         * Shows select department dialog.
         */
        function showSelectDepartment() {
            $scope.modalTitle = '选择部门';
            $scope.modal = $modal({
                scope: $scope,
                templateUrl: 'partials/hr/recruitment/modal.department.html',
                show: true,
                backdrop: "static"
            });
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
         * Triggered when department is selected.
         */
        function departmentSelected() {
            $scope.recruitment.department = angular.copy($scope.newDepartment);
            $scope.sf_recruitment.department = angular.copy($scope.newDepartment);
            $scope.getPositions($scope.newDepartment.id);
            $scope.modal.hide();
        }

        /**
         * Gets all positions for the given department.
         * @param departmentId the department id
         */
        function getPositions(departmentId) {
            var promise = PositionService.list(departmentId);
            promise.then(
                function (response) {
                    if(response.status == "FAILURE"){
                        SweetAlert.swal( response.data,"请重试","error");
                    }
                    else{
                        $scope.positions = response.data;
                    }
                },
                function (error) {
                }
            );
        }

        function addRecruitment(){
            $scope.recruitment = {};
            $scope.addModalTitle = '新增招聘需求';
            $scope.addModal = $modal({scope: $scope, templateUrl: 'partials/hr/recruitment/modal.recruitment.add.html', show: true });
        }

        function saveRecruitment(){
            $scope.recruitment.startTime = StrToDate($scope.recruitment.startTime);
            $scope.recruitment.deadline = StrToDate($scope.recruitment.deadline);
            var promise = RecruitmentManagementService.addRecruitment($scope.recruitment)
                .then(function(response) {
                    if(response.status == "FAILURE"){
                        SweetAlert.swal( response.data,"请重试","error");
                    }
                    else{
                        SweetAlert.swal('添加成功', 'success');
                        $scope.sf_recruitment = {};
                        getRecruitmentByFilter();
                    }
                    $scope.addModal.hide();
                }, function(error) {
                    SweetAlert.swal('添加失败', '请重试', 'error');
                    $scope.addModal.hide();
                }
            );
        }

        function updateRecruitment(){
            $scope.recruitment.startTime = StrToDate($scope.recruitment.startTime);
            $scope.recruitment.deadline = StrToDate($scope.recruitment.deadline);
            var promise = RecruitmentManagementService.updateRecruitment($scope.recruitment)
                .then(function(response) {
                    if(response.status == "FAILURE"){
                        SweetAlert.swal( response.data,"请重试","error");
                    }
                    else{
                        SweetAlert.swal('修改成功', 'success');
                        $scope.sf_recruitment = {};
                        getRecruitmentByFilter();
                    }
                    $scope.editModal.hide();
                }, function(error) {
                    SweetAlert.swal('修改失败', '请重试', 'error');
                    $scope.editModal.hide();
                }
            );
        }

        /**
         * Get the list of employee which can be responsible for recruitment.
         */
        function getResponsibleList(){
            var promise = RecruitmentManagementService.getResponsibleList()
                .then(function(response) {
                    if(response.status == "FAILURE"){
                        SweetAlert.swal( response.data,"请重试","error");
                    }
                    else{
                        $scope.responsibles = response.data;
                    }
                }, function(error) {
                    SweetAlert.swal('获取可选招聘负责人失败', '请重试', 'error');
                }
            );
        }

        /**
         * Get the list of employee which can executor the recruitment.
         */
        function getExecutorList(){
            var promise = RecruitmentManagementService.getExecutorList()
                .then(function(response) {
                    if(response.status == "FAILURE"){
                        SweetAlert.swal( response.data,"请重试","error");
                    }
                    else{
                        $scope.executors = response.data;
                    }
                }, function(error) {
                    SweetAlert.swal('获取可选招聘执行人失败', '请重试', 'error');
                }
            );
        }

        /**
         *  Get recruitment by filter
         */
        function getRecruitmentByFilter(){
            $scope.isLoading = true;
            $scope.gTableState.pagination.start=0;
            $scope.pagination = $scope.gTableState.pagination;
            $scope.start = $scope.pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
            $scope.number = $scope.pagination.number || 10;  // Number of entries showed per page.
            if($scope.sf_recruitment.startTime != undefined){
                $scope.sf_recruitment.startTime = DateToStr($scope.sf_recruitment.startTime);
                $scope.sf_recruitment.startTime = $scope.sf_recruitment.startTime.substring(0,10);
            }
            if($scope.sf_recruitment.deadline != undefined){
                $scope.sf_recruitment.deadline = DateToStr($scope.sf_recruitment.deadline);
                $scope.sf_recruitment.deadline = $scope.sf_recruitment.deadline.substring(0,10);
            }
            var promise = RecruitmentManagementService.getRecruitmentByFilter($scope.sf_recruitment,$scope.start,$scope.number);
            promise.then(function(response) {
                if(response.status == "FAILURE"){
                    SweetAlert.swal( response.data,"请重试","error");
                }
                else{
                    var result = {};
                    result.data = response.data.list;
                    result.numberOfPages = response.data.pages;
                    $scope.recruitments = result.data;
                    //将时间戳转换为date
                    angular.forEach($scope.recruitments, function(recruitment){
                        if(recruitment.startTime != undefined){
                            recruitment.startTime = DateToStr(recruitment.startTime)
                        }
                        if(recruitment.deadline != undefined){
                            recruitment.deadline = DateToStr(recruitment.deadline)
                        }
                    })
                    $scope.gTableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                    $scope.isLoading = false;
                }
            }, function(error) {
                SweetAlert.swal('获取招聘信息失败', 'error');
            });
        }

        /**
         * Get the list
         */
        function getRecruitmentList(tableState){
            $scope.gTableState = tableState;
            $scope.isLoading = true;
            $scope.pagination = tableState.pagination;
            $scope.start = $scope.pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
            $scope.number = $scope.pagination.number || 10;  // Number of entries showed per page.
            var promise = RecruitmentManagementService.getRecruitmentByFilter($scope.sf_recruitment,$scope.start, $scope.number);
            promise.then(function (response) {
                if(response.status == "FAILURE"){
                    SweetAlert.swal( response.data,"请重试","error");
                }
                else{
                    var result = {};
                    result.data = response.data.list;
                    result.numberOfPages = response.data.pages;
                    $scope.recruitments = result.data;
                    //将时间戳转换为date
                    angular.forEach($scope.recruitments, function(recruitment){
                        if(recruitment.startTime != undefined){
                            recruitment.startTime = DateToStr(recruitment.startTime)
                        }
                        if(recruitment.deadline != undefined){
                            recruitment.deadline = DateToStr(recruitment.deadline);
                        }
                    })
                    tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                    $scope.isLoading = false;
                }
            }, function(error) {
                SweetAlert.swal('获取招聘信息失败', 'error');
            });
        }

        function StrToDate(strDate){
            var date = new Date(strDate);
            return date;
        }

        function DateToStr(date){
            date = new Date(date);
            var year = date.getFullYear();
            var month = pattern(date.getMonth()+1);
            var day = pattern(date.getDate());
            var hour = pattern(date.getHours());
            var min = pattern(date.getMinutes());
            var sec = pattern(date.getSeconds());
            var dateStr = year + "-" + month + "-" + day;
            return dateStr;
        }

        function pattern(str){
            str = new String(str);
            if(str.length < 2)
                return "0" + str;
            else
                return str;
        }

        /**
         * 步骤1：
         * 判断招聘是否已完成，无论是否超过截止日期，都统一设置为 黄色，同时后面操作栏的 暂停/开始按钮 不显示
         * @param recruitment
         */
        function isFinish(recruitment){
            var flag = false;
            if(!recruitment.completedCount){
                recruitment.completedCount = 0;
            }
            if(recruitment.recruitmentCount && recruitment.completedCount){
                if(recruitment.recruitmentCount == recruitment.completedCount){
                    flag = true;
                }
                else{
                    flag = false;
                }
            }
            return flag;
        }

        /**
         * 步骤2：
         * 如果未完成，判断是否是超期，如果超期，那么状态就是超期未完成状态，设置为 红色，同时后面操作栏的 暂停/开始按钮 不显示
         * @param recruitment
         */
        function isTimeout(recruitment){
            //var nowDate = new Date();
            //var deadline = angular.copy(recruitment.deadline);
            //deadline = deadline.replace(/-/g,"/");
            //deadline = new Date(deadline);
            //if(nowDate > deadline){
            //    return true;
            //}
            //else{
            //    return false;
            //}
            var flag = false;
            //招聘状态（招聘中 1/已完成 2/暂停 3/超期 4）
            if(recruitment.recruitmentStatus == 4){
                flag = true;
            }
            return flag;
        }

        /**
         * 步骤3：
         * 如果是未完成并且未超期，判断当前招聘需求是否被暂停了，
         * 如果暂停，设置为灰色，显示开始按钮
         * 如果未暂停，设置为绿色，显示暂停按钮
         * @param recruitment
         */
        function isPause(recruitment){
            var flag = false;
            //招聘状态（招聘中 1/已完成 2/暂停 3/超期 4）
            if(recruitment.recruitmentStatus == 3){
                flag = true;
            }
            return flag;
        }

        /**
         * 查看简历库列表
         * @param recruitment
         */
        function showResumeList(recruitment){

        }

        /**
         * 启动招聘需求
         * @param recruitment
         */
        function updateRecruitmentStatus(recruitment){
            var promise = RecruitmentManagementService.updateRecruitmentStatus(recruitment)
                .then(function(response) {
                    if(response.status == "FAILURE"){
                        SweetAlert.swal( response.data,"请重试","error");
                    }
                    else{
                        $scope.recruitment = response.data;
                        getRecruitmentByFilter();
                    }
                }, function(error) {
                    if(recruitment.recruitmentStatus == 3){
                        SweetAlert.swal('启动招聘需求失败', '请重试', 'error');
                    }
                    else{
                        SweetAlert.swal('暂停招聘需求失败', '请重试', 'error');
                    }
                }
            );
        }

        /**
         * 重置搜索框为空
         */
        function reset(){
            $scope.sf_recruitment = {};
        }

        /**
         * 修改招聘需求
         * @param recruitment
         */
        function editRecruitment(recruitment){
            $scope.recruitment = angular.copy(recruitment);
            deptToPos();
            $scope.editModalTitle = '修改招聘需求';
            $scope.editModal = $modal({scope: $scope, templateUrl: 'partials/hr/recruitment/modal.recruitment.edit.html', show: true });
        }

        /**
         * When show the edit view or detail view , this function will show the positions in the given department.
         */
        function deptToPos(){
            $scope.getPositions($scope.recruitment.department.id);
        }
    }
]);


