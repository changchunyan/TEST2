'use strict';

/**
 * The SupplementCourseManagementController.
 *
 * @author hw
 * @version 1.0
 */
angular.module('ywsApp').controller('SupplementCourseManagementController', ['$scope','$q','SweetAlert','CommonService','SupplementCourseManagementService','$mtModal','ClassManagementService','CoursePlanService','AuthenticationService','CrmStudentCourseAttendenceSupplementService','TeacherService',
    function ($scope,$q,SweetAlert,CommonService,SupplementCourseManagementService,$mtModal,ClassManagementService,CoursePlanService,AuthenticationService,CrmStudentCourseAttendenceSupplementService,TeacherService) {

    $scope.mySupplementListFilter = {};
    $scope.MySupplementList = [];
    $scope.searchModel = {};
    $scope.mySearchModel = {};

        CommonService.getGradeIdSelect().then(function (result) {
            $scope.gradeIds = result.data;
        });


    CommonService.getGradeIdSelect().then(function (result) {
        $scope.gradeIds = result.data;
    });

    $scope.getSupplementList = function(tableState){

        $scope.isLoading = true;
        $scope.mySupplementListTableState = tableState;
        var pagination = tableState.pagination;
        var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
        var number = pagination.number || 10;
        var date1 = $("input[name='bkStartTime']").val();
        if(date1 != null&&date1 != ""){
            $scope.mySupplementListFilter.start_Time = new Date(date1).getTime();
        }else
        {
            delete $scope.mySupplementListFilter.start_Time;
        }
        var date2 = $("input[name='bkEndTime']").val();
        if(date1 != null&&date1 != ""){
            $scope.mySupplementListFilter.end_Time = new Date(date1).getTime();
        }
        else
        {
            delete $scope.mySupplementListFilter.end_Time;
        }
        SupplementCourseManagementService.list(start, number, tableState, $scope.mySupplementListFilter).then(function (result) {
            $scope.MySupplementList = result.data;
            for(var i = 0;i < $scope.MySupplementList.length;i++){
                $scope.MySupplementList[i].endTime = ($scope.MySupplementList[i].endTime- $scope.MySupplementList[i].startTime)/3600000;
            }
            tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
            $scope.isLoading = false;
        });
    }

    $scope.supplementUpdateFilter = {};
    $scope.supplementShowFilter = {};
    $scope.showDetial = function showDetial(row,type){
        switch(type){
            case 0:
                $scope.supplementUpdateFilter = angular.copy(row);
                $scope.activeModal = $mtModal.modal('partials/active/modal/courser-gb-buke.html',$scope);
                break;
            case 1:
                $scope.supplementUpdateFilter = angular.copy(row);
                $scope.getTeacher();
                $scope.activeModal = $mtModal.modal('partials/active/modal/courser-alone-buke.html',$scope);
                break;
            case 2:
                var filter = {};
                $scope.supplementShowFilter = {};
                filter.id = row.id;
                $scope.supplementShowFilter = angular.copy(row);
                $scope.supplementShowFilter.ks = (row.supplementEndTime- row.supplementStartTime)/3600000;
                $scope.isLoading = false;
                $scope.bkDetial = $mtModal.modal('partials/active/modal/bk-detail.html',$scope);
               /* SupplementCourseManagementService.one( $scope.mySupplementListFilter).then(function (result) {
                    $scope.supplementShowFilter = angular.copy(result.data[0]);
                    $scope.supplementShowFilter.ks = ($scope.supplementShowFilter.supplementEndTime- $scope.supplementShowFilter.supplementStartTime)/3600000;
                    $scope.isLoading = false;
                    $scope.bkDetial = $mtModal.modal('partials/active/modal/bk-detail.html',$scope);
                });*/
                break;
            case 3:
                var filter = {};
                $scope.supplementUpdateFilter = {};
                filter.id = row.id;
                SupplementCourseManagementService.one( $scope.mySupplementListFilter).then(function (result) {
                    $scope.supplementUpdateFilter = angular.copy(result.data[0]);
                    $scope.supplementUpdateFilter.ks = ($scope.supplementShowFilter.supplementEndTime- $scope.supplementShowFilter.supplementStartTime)/3600000;
                    $scope.isLoading = false;
                    $scope.supplementUpdateFilter.supplementCrmStudentClassId =  $scope.supplementUpdateFilter.supplement_crm_student_class_id;
                    $scope.activeModal = $mtModal.modal('partials/active/modal/bj-gb-buke.html',$scope);
                    $scope.getClassCoursePlans($scope.classCoursePlanTableState);
                    $scope.getClasses()
                });
                break;
            case 4:
                $scope.selectClassModal = $mtModal.modal('partials/sos/class/experience/modal.selectClass.html',$scope);
                break;
        }
    }


    $scope.getTeacher = function(){
        var filter = {};
        filter.subjectId =  $scope.supplementUpdateFilter.subjectId;
        TeacherService.getTeachersGroupBySubject(filter).then(function (response) {
            $scope.subjectTeacherGroup = response.data.data[0].teachers;
            //因为按钮长度限制4个汉字，所以在这里需要处理一下名字超过4个汉字的
        })
    }

    $scope.submitAlone = function(){
        if(!$scope.supplementUpdateFilter.supplementTeacherId){
            SweetAlert.swal('请选择老师');
            return;
        }
        var c = $("input[name='chargeIng']:checked").val()
        var date = $("input[name='supplementDate']").val()
        var student = {};
        student.id=$scope.supplementUpdateFilter.id;
        student.absenceCrmStudentClassId=$scope.supplementUpdateFilter.absence_crm_student_class_id;
        student.absenceCoursePlanId=$scope.supplementUpdateFilter.absence_course_plan_id;
        student.crmStudentId=$scope.supplementUpdateFilter.crm_student_id;
        student.state = 2;
        student.type = 2;
        student.supplementTeacherId = $scope.supplementUpdateFilter.supplementTeacherId;
        student.supplementDate = new Date(date);
        if(c == 1)
            student.isCharging = 1;
        else
            student.isCharging = 0;
        var promise=SupplementCourseManagementService.save(student);
        promise.then(function(response){
            if(response.status==='SUCCESS'){
                $scope.activeModal.hide();
                SweetAlert.swal('操作成功', 'success');
                $scope.getSupplementList($scope.mySupplementListTableState);
            }else if(response.status==='FAILURE'){
                SweetAlert.swal('操作失败，请重试！', 'error');
                return;
            }
        });
    }


    $scope.getClasses=function(tableState){
        $scope.pagination=tableState.pagination;
        $scope.start=$scope.pagination.start || 1;
        $scope.number=$scope.pagination.number || 10;
        var searchModel={};
        searchModel.start=$scope.start;
        searchModel.size=$scope.number;
        searchModel.schoolId=AuthenticationService.currentUser().school_id;
        searchModel.status=0;
        searchModel.courseId = $scope.supplementUpdateFilter.courseId;
        searchModel.isDeleted=0;
        searchModel.customCondition=" and csc.class_type != 2 and csc.id != "+$scope.supplementUpdateFilter.absence_crm_student_class_id+" ORDER BY csc.start_time ASC ";
        var promise=ClassManagementService.getClassesByFilter(searchModel);
        promise.then(function(response){
            $scope.classesList=response.data.list;
            if($scope.supplementUpdateFilter.supplement_crm_student_class_id){
                angular.forEach($scope.classesList, function(data, index, array){
                    if(data.id===$scope.supplementUpdateFilter.supplement_crm_student_class_id){
                        data.selectTrue=true;
                    }
                });
            }
            tableState.pagination.numberOfPages=response.data.pages;
        });
    }

    $scope.backExperience=function(){
        //得到班级的id
        var index=''
        if(arguments.length==2){
            index=arguments[1]
            for (var i=0,max=$scope[arguments[0]].length;i<max;i++){
                $scope[arguments[0]][i].selectTrue = i==index?true:false
            }
        }else{
            index=$("input[name='classRadio']:checked").val();
        }
        if (index==undefined) {
            SweetAlert.swal('请选择要补课的班级');
            return;
        }
        //选择的学生或客户
        $scope.supplementUpdateFilter.supplementCrmStudentClassId=$scope.classesList[index].id;
        $scope.supplementUpdateFilter.supplementClassName = $scope.classesList[index].name;
    }

    $scope.submitSelectedClass=function(){
        if (!$scope.supplementUpdateFilter.supplementCrmStudentClassId) {
            SweetAlert.swal('请选择要补课的班级');
            return;
        }
        $scope.selectClassModal.hide();
        $scope.getClassCoursePlans($scope.classCoursePlanTableState);
    }

    $scope.getClassCoursePlans=function(tableState){
        $scope.classCoursePlanTableState=tableState;
        var start=tableState.pagination.start || 0;
        var number=tableState.pagination.number || 10;
        if($scope.supplementUpdateFilter.supplementCrmStudentClassId){
            if(!tableState.search.predicateObject){
                tableState.search.predicateObject={};
            }
            if(!tableState.search.predicateObject){
                tableState.search.predicateObject={};
            }
            tableState.search.predicateObject.class_id=$scope.supplementUpdateFilter.supplementCrmStudentClassId;
            var startTime = $("input[name='bk_start_time']").val()
            var endTime = $("input[name='bk_end_time']").val()
            if(startTime != null && startTime != ""){
                tableState.search.predicateObject.start_time= startTime;
            }else{
                delete tableState.search.predicateObject.start_time
            }
            if(endTime != null && endTime != ""){
                tableState.search.predicateObject.end_time= endTime;
            }else{
                delete tableState.search.predicateObject.end_time;
            }
            var promise=CoursePlanService.Classrecordlist(start, number, tableState);
            promise.then(function(response){
                $scope.classCoursePlans=response.data;
                if($scope.supplementUpdateFilter.supplement_course_plan_id){
                    angular.forEach($scope.classCoursePlans, function(data, index, array){
                        if(data.id===$scope.supplementUpdateFilter.supplement_course_plan_id){
                            data.selectTrue=true;
                        }
                    });
                }
                tableState.pagination.numberOfPages=response.numberOfPages;
            });
        }else{
            $scope.classCoursePlans=[];
        }
    }

    $scope.selectClassCoursePlan=function(){
        //得到班级的id
        var index=''
        if(arguments.length==2){
            index=arguments[1]
            for (var i=0,max=$scope[arguments[0]].length;i<max;i++){
                $scope[arguments[0]][i].selectTrue = i==index?true:false
            }
        }else{
            index=$("input[name='classCoursePlanRadio']:checked").val();
        }
        if (index==undefined) {
            SweetAlert.swal('请选择要的班级排课记录');
            return;
        }
        //选择的排课记录
        $scope.supplementUpdateFilter.supplementCoursePlanId=$scope.classCoursePlans[index].id;
    }

    $scope.resetSelect = function(){
        $scope.mySupplementListFilter = {};
        $scope.getSupplementList($scope.mySupplementListTableState);
    }

    $scope.editClassExperience=function(){
        if(!$scope.supplementUpdateFilter.supplementCoursePlanId){
            SweetAlert.swal('请选择要的班级排课记录');
            return;
        }
        var student = {};
        student.supplementCrmStudentClassId=$scope.supplementUpdateFilter.supplementCrmStudentClassId;
        student.supplementCoursePlanId=$scope.supplementUpdateFilter.supplementCoursePlanId;
        student.crmStudentId=$scope.supplementUpdateFilter.crm_student_id;
        student.id=$scope.supplementUpdateFilter.id;
        student.state = 1;
        student.type = 1;
        student.isAttendence = 0;
        var promise=CrmStudentCourseAttendenceSupplementService.update(student);
        promise.then(function(response){
            if(response.status==='SUCCESS'){
                $scope.activeModal.hide();
                SweetAlert.swal('操作成功', 'success');
                $scope.getSupplementList($scope.mySupplementListTableState);
            }else if(response.status==='FAILURE'){
                SweetAlert.swal('操作失败，请重试！', response.data);
                return;
            }
        });
    }
    /**
     * 改变查询更多按钮
     */
    $scope.selectMoreText = '更多查询条件'
    $scope.changeSelectMore = function(flag) {
        if(arguments[1]){
            $scope.selectMore = !$scope.selectMore
            $scope.selectMoreText = $scope.selectMore?'收起查询条件':'更多查询条件'
        }else {
            $scope.selectMore = flag
            $scope.selectMoreText = flag?'收起查询条件':'更多查询条件'
        }
        // angular.element('#body').scroll()
        setTimeout(function () {
            resatList()
        },100)
    }

}
])



