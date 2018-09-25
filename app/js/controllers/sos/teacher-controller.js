'use strict';
/**
 * The Teacher management controller.
 * @author sunqc
 * @version 1.0
 */
angular.module('ywsApp')
    .controller('TeacherManagementController', ['$scope', '$modal', '$rootScope', '$location','SweetAlert','CommonService','EmployeeService','TeacherService',
    function($scope, $modal, $rootScope,$location, SweetAlert,CommonService,EmployeeService,TeacherService) {

        var oThis = this;
        oThis.isLoadingTeachersList = true;
        //--------------------------------------------初始化加载---------------------------------------------------------------------
        $scope.getTeachersListController = getTeachersListController;

        //--------------------------------------------教师列表增删改查---------------------------------------------------------------------
        $scope.showDetailCourseView = showDetailCourseView;
        $scope.showEditCourseView = showEditCourseView;
        $scope.showAddCourseView = showAddCourseView;
        $scope.removeTeacher = removeTeacher;

        //--------------------------------------------其它功能---------------------------------------------------------------------
        $scope.showTeacherCourseView = showTeacherCourseView;

        //--------------------------------------------初始化加载---------------------------------------------------------------------
        /*教师列表*/
        function getTeachersListController(tableState) {
            var pagination = tableState.pagination;
            var search = tableState.search;

            var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
            var number = pagination.number || 10;  // Number of entries showed per page.

            TeacherService.getTeachersListService(start, number,search).then(function (result) {
                $scope.teachersList = result.data;
                tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                oThis.isLoadingTeachersList = false;
            });
        }

        //--------------------------------------------教师列表增删改查---------------------------------------------------------------------
        function showAddCourseView(obj){
            $scope.showType = 2;//1 表示修改  2 表示添加  0 表示显示
            $scope.isShowSubmit = {display:''};

            $scope.checkedTeacher = angular.copy(obj);
            $scope.modalAdd = $modal({title: '添加',scope: $scope, templateUrl: 'partials/sos/teacher/modal.teacherCourse.html', show: true });
        }
        function showDetailCourseView(obj){
            $scope.showType = 0;//1 表示修改  2 表示添加  0 表示显示
            $scope.isShowSubmit = {display:'none'};

            $scope.checkedTeacher = angular.copy(obj);
            //$scope.modalTitle = '查看';
            $scope.modalDetail = $modal({title: '查看',scope: $scope, templateUrl: 'partials/sos/teacher/modal.teacherCourse.html', show: true });
        }
        function showEditCourseView(obj){
            $scope.showType = 1;//1 表示修改  2 表示添加  0 表示显示
            $scope.isShowSubmit = {display:''};

            $scope.checkedTeacher = angular.copy(obj);
            $location.path('/sos-admin/teacher/edit/'+obj.user_id);
            /*$scope.modalEdit = $modal({title: '编辑',scope: $scope, templateUrl: 'partials/sos/teacher/modal.teacherCourse.html', show: true });*/
        }
        function removeTeacher(obj){
            TeacherService.deleteTeacherService($scope.start, $scope.number).then(function (result) {
                $scope.teachersList = result.data;
                tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                oThis.isLoadingTeachersList = false;
            });
        }

        //--------------------------------------------其它功能---------------------------------------------------------------------
        function showTeacherCourseView(obj){
            oThis.checkedTeacher = angular.copy(obj);
            coursePlanParams = {//传到排课页面的参数  这样使window 全局变量
               /* "teacherID": $scope.checkedTeacher.teacherId,
                "type":$scope.checkedTeacher.type,
                "teacherName":$scope.checkedTeacher.teacherName,
                "schoolID":$scope.checkedTeacher.schoolId,
                "subjectID":$scope.checkedTeacher.courseId,
                "gradeID":'',
                "studentID":$scope.checkedTeacher.crmStudentId,
                "studentName":$scope.checkedTeacher.name,
                "groupID":'',
                "classTime":$scope.checkedTeacher.originalNum,
                "destroyTime":$scope.checkedTeacher.courseNum,
                "ordcourseID":$scope.checkedTeacher.checkedTeacherCourseId,//当前为传来
                "course_num":$scope.checkedTeacher.originalNum,
                "plan_available_num":$scope.checkedTeacher.planAvailableNum,
                "isListening":isListening*/
                "teacherID": oThis.checkedTeacher.user_id,//必填
                "teacherName":oThis.checkedTeacher.name,
                'isInTeacher':true,
                "isNotEditCourse":true
            };
            $scope.modalTitle = '教师课程表';
            $scope.teacherCourseModal = $modal({scope: $scope, templateUrl: 'partials/o2o/order/modal.planCourses.html', show: true });
        }
    }
])
    .controller('TeacherCoursesController',['$scope', '$modal', '$rootScope','$routeParams', 'SweetAlert','CommonService','EmployeeService','TeacherService',
    function($scope, $modal, $rootScope, $routeParams,SweetAlert,CommonService,EmployeeService,TeacherService) {
        var oThis = this;
        oThis.checkedTeacher = {};
        oThis.isLoadingTeacherCourseList = true;
        oThis.ifEdit = ifEidt;
        oThis.isEdit = false;
        oThis.view = {
            checkPrice:''
        };

        (function init(angular){
            if($scope.checkedTeacher){
                oThis.checkedTeacher = angular.copy($scope.checkedTeacher);
            }else{
                $scope.checkedTeacher = {};
                oThis.checkedTeacher = {};
                $scope.checkedTeacher.user_id = $routeParams.teacherId;
                oThis.checkedTeacher.user_id = $routeParams.teacherId;
            }
            oThis.isLoadingTeacherCourseList = true;
            oThis.showType = $scope.showType;//1 表示修改  2 表示添加  0 表示显示
            oThis.ifEdit();
            $scope.teacherCoutseTableState = {};


        })(angular);

        //--------------------------------------------初始化教师课程列表---------------------------------------------------------------------
        $scope.callTeacherCoursesController = callTeacherCoursesController;
        //view
        oThis.view.checkPrice = checkPrice;


        //--------------------------------------------其它功能---------------------------------------------------------------------
        oThis.showAddTeacherCourseView = showAddTeacherCourseView;
        oThis.showDetailTeacherCourseView = showDetailTeacherCourseView;
        oThis.showEidtTeacherCourseView = showEidtTeacherCourseView;
        oThis.deleteTeacherCourseController = deleteTeacherCourseController;
        oThis.upDownCourseController = upDownCourseController;

        oThis.showSelectedTeacherCourseView = showSelectedTeacherCourseView;
        oThis.showTimeTeacherCourseView = showTimeTeacherCourseView;
        oThis.upDownCourse = upDownCourse;


        //--------------------------------------------util---------------------------------------------------------------------
        oThis.getTeacherCoursesController = getTeacherCoursesController;


        //--------------------------------------------初始化教师课程列表---------------------------------------------------------------------
        function callTeacherCoursesController(tableState){
            oThis.ifEdit();
            $scope.teacherCoutseTableState = tableState;
            oThis.getTeacherCoursesController(tableState);

        }
        //view
        /**
         * 检查 （校区上课定价&&教师上门定价）是否为空
         * @param course
         */
        function checkPrice(course){//
            if(check_null(course)){
                if(check_null(course.studentToCampusPrice) && check_null(course.teacherToHomePrice)){
                    return true;
                }
            }
            return false;
        }


        //--------------------------------------------其它功能---------------------------------------------------------------------
        function showAddTeacherCourseView(tableState){
            $scope.showType = 2;//1 表示修改  2 表示添加  0 表示显示
            $scope.isCourseSubmit = {display:''};
            $scope.Course = {};
            /*$scope.Course.omsProductTypeId = config.flag.onLineCourseFlag;
            $scope.omsProductTypeIdChange();*/
            $scope.modalTeacherCourseAdd = $modal({title: '添加',scope: $scope, templateUrl: 'partials/sos/teacher/modal.addTeacherCourse.html', show: true });

          //  $scope.selectedProducted().then(function(result){
          //
          //  });
        }
        function showDetailTeacherCourseView(course){
            $scope.showType = 0;//1 表示修改  2 表示添加  0 表示显示
            $scope.isCourseSubmit = {display:'disabled'};
            //$scope.modalTitle = null;
            $scope.Course = angular.copy(course);
            $scope.modalTeacherCourseDetail = $modal({title: '显示',scope: $scope, templateUrl: 'partials/sos/teacher/modal.addTeacherCourse.html', show: true });
        }
        function showEidtTeacherCourseView(course){
            $scope.showType = 1;//1 表示修改  2 表示添加  0 表示显示
            $scope.isCourseSubmit = {display:''};
            //$scope.modalTitle = null;
            //$scope.checkedTeacherCourse = angular.copy(course);
            $scope.Course = angular.copy(course);
            $scope.CourseOld = angular.copy(course);
            $scope.modalTeacherCourseEdit = $modal({title: '修改',scope: $scope, templateUrl: 'partials/sos/teacher/modal.addTeacherCourse.html', show: true });

        }
        function deleteTeacherCourseController(course){

            SweetAlert.swal({
                    title: "确定要删除吗？",
                    type: "warning",
                    showCancelButton: true,
                   /* confirmButtonColor: '#fe9900',*/
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    closeOnConfirm: true
                }, function(confirm) {
                    if (confirm) {
                        TeacherService.deleteTeacherCourseService(course.courseTeacherId).then(function (result) {
                            $scope.teachersList = result.data;
                            oThis.isLoadingTeachersList = false;
                            //oThis.getTeacherCoursesController($scope.teacherCoutseTableState);
                            $scope.callTeacherCoursesController($scope.teacherCoutseTableState);

                        });
                    }
                }
            );

        }
        function showSelectedTeacherCourseView(tableState){

            $scope.modalSearchProduct = $modal({title: '选择课程',scope: $scope, templateUrl: 'partials/common/product/modal.searchProduct.html', show: true });

        }
        function showTimeTeacherCourseView(tableState){
            coursePlanParams.teacherID =  $routeParams.teacherId;
            $scope.modalAdd = $modal({title: '可上课时间',scope: $scope, templateUrl: 'partials/sos/teacher/modal.amPmSelectableCourses.html', show: true });
        }
        function upDownCourse(course){
            var params = {
                id:course.courseTeacherId,
                isShelve:''
            };
            if(course.isShelve == 1){
                params.isShelve = 0
            }else{
                params.isShelve = 1
            }
            oThis.upDownCourseController(params);
        }
        function upDownCourseController(params){
            TeacherService.upDownCourseService( params).then(function (result) {
                $scope.callTeacherCoursesController($scope.teacherCoutseTableState);
            });
        }

        //--------------------------------------------基础方法---------------------------------------------------------------------
        function ifEidt() {
           /* if ($scope.showType == 0) {//1 表示修改  2 表示添加  0 表示显示
                $('.js-edit-bottom').hide();
                oThis.isEdit = false;
            }else if($scope.showType==1 || $scope.showType==2){
                oThis.isEdit = true;
            }*/
            oThis.isEdit = true;//当前只有编辑 没有查看
        }
        function getTeacherCoursesController(tableState){
            var pagination = tableState.pagination;
            var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
            var number = pagination.number || 10;  // Number of entries showed per page.
            var params = {
                teacherId : $routeParams.teacherId
            };

            TeacherService.getTeachersCourseListService(start, number, params).then(function (result) {
                $scope.teacherCoursesList = result.data;
                tableState.pagination.numberOfPages = result.numberOfPages || 0;//set the number of pages so the pagination can update
                oThis.isLoadingTeacherCourseList = false;
            });
        }
       /* function getTeacherCoursesService(tableState){

            var pagination = tableState.pagination;
            var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
            var number = pagination.number || 10;  // Number of entries showed per page.
            var params = {
                teacherId : oThis.checkedTeacher.user_id
            };

            TeacherService.getTeachersCourseListService(start, number, params).then(function (result) {
                $scope.teacherCoursesList = result.data;
                tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                oThis.isLoadingTeacherCourseList = false;
            });
        }*/

    }
])
    .controller('AddTeacherCoursesController',['$scope', '$modal', '$rootScope','$timeout','$routeParams', 'SweetAlert','CommonService','EmployeeService','TeacherService','ProductService','fileReader',
    function($scope, $modal, $rootScope, $timeout,$routeParams,SweetAlert,CommonService,EmployeeService,TeacherService,ProductService,fileReader) {
        var oThis = this;

        /*
         * 页面显隐藏控制有isEdit and view.isOwnCourse 来控制
         */
        oThis.isEdit = false;//頁面是否可以編輯
        $scope.courseIntroList = [];
        oThis.ifEditShow = ifEditShow;
        oThis.CourseOnlineform = $scope.CourseOnlineform;
        oThis.view = {
            isOwnCourse:false,
            isTeacherToHomePrice:false,
            isStudentToCampusPrice:false
        };
        oThis.view.ifInLowBetweenHigh = ifInLowBetweenHigh;

        oThis.ifEdit = false;
        oThis.courseIntroListFalse = false;

        $scope.ProductTypeListFilter = {};//产品类型列表过滤条件
        $scope.CourseTypeListFilter = {};

        $scope.getAllSelected = getAllSelected;

        (function init($scope,oThis){
            _initData();
            ifEditShow();

            callCourseOnlineform();

            $scope.courseIntroList.isNotFirst = true;
         /*   $scope.Course.omsProductTypeId = 8;
            omsProductTypeIdChange();*/

        })($scope,oThis);

        function _initData(){
            if(!check_null($scope.Course.isShelve)){
                $scope.Course.isShelve = 0;
            }
            oThis.checkedTeacher = angular.copy($scope.checkedTeacher);
            oThis.Teacher = {
                id:$routeParams.teacherId,
                name:''
            };
            oThis.teacherCoutseTableState = $scope.teacherCoutseTableState;
            oThis.showType = $scope.showType;//
            if($scope.showType == 2){
                $scope.Course.omsProductTypeId = config.flag.onLineCourseFlag;
                omsProductTypeIdChange();
            }else if($scope.showType == 1 || $scope.showType == 0){
                omsProductTypeIdChange();
            }


        }
        /**
         * filter 处理产品类型 分为线上ProductTypeList 和线下产品 ProductTypeOfflineList
         */
        function setProductTypeOnlineAndOffline(){
            var del = 0;
            var offlineList = [];
            var onlineList = [];
            for(var i=0;i<$scope.ProductTypeOfflineList.length;i++){
                if($scope.ProductTypeOfflineList[i].id != config.flag.onLineCourseFlag){
                    offlineList.push($scope.ProductTypeOfflineList[i]);
                }
                if($scope.ProductTypeOfflineList[i].id == config.flag.onLineCourseFlag){
                    onlineList.push($scope.ProductTypeOfflineList[i]);
                }
            }
            $scope.ProductTypeOfflineList = offlineList;
            $scope.ProductTypeList = onlineList;
        }
        /*********************************************************view******************************************************************/
        function ifInLowBetweenHigh(price,input){
            if(check_null($scope.Course.minPrice) && check_null($scope.Course.maxPrice)){
                if($scope.Course.minPrice > price || price>$scope.Course.maxPrice){
                    input.$invalid = true;
                    $scope.addTeacherCourseForm.$invalid = true;
                }else if($scope.showType == 2){
                    //$scope.addTeacherCourseForm.$invalid = false;
                }
            }
        }


        /***********************************ctrl**************************************************************************************/
        oThis.submitController = submitController;
        oThis.callCourseOnlineform = callCourseOnlineform;
        oThis.getCoursesTypeListController = getCoursesTypeListController;
        oThis.getProductsTypeListController  = getProductsTypeListController;



        /***********************************service**************************************************************************************/
        /*
         产品类型
         产品类型-->>>课程类型
         */
        $scope.CourseTypeListByFilter = [];
        $scope.omsProductTypeIdChange = omsProductTypeIdChange;
        //课程类型变化
        $scope.courseTypeIdAndGradeIdChange = courseTypeIdAndGradeIdChange;

        oThis.addSubmit = addSubmit;
        oThis.editSubmit = editSubmit;

        /***********************************util**************************************************************************************/

        oThis.addCourseIntro = addCourseIntro;
        oThis.clearCourseIntro = clearCourseIntro;



/*******************************************************************************************
 * ***************************ctrl*****************************************************
 * *****************************************************************************************/
        function submitController(){
            if(oThis.showType == 1){//1 表示修改  2 表示添加  0 表示显示
                oThis.editSubmit();
            }else if(oThis.showType == 2){//1 表示修改  2 表示添加  0 表示显示
                oThis.addSubmit();
            }
        }
        function callCourseOnlineform(){
            var tableState = {
                pagination:'',
                search:{}
            };
            var tableState ={'pagination':{},'search':{'predicateObject':{}}};
            getCoursesTypeListController(tableState);
            getProductsTypeListController(tableState);
            if(oThis.showType==1 || oThis.showType==0) {//1 表示修改  2 表示添加  0 表示显示
                getDetailedCourse();
            }
            if(oThis.showType==2){//2 表示添加
                $timeout(function(){
                    addCourseIntro();//添加一条 课程介绍
                },1000);
            }



        }

        function getCoursesTypeListController(tableState){
            var pagination = tableState.pagination;
            var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
            var number = pagination.number || 10;  // Number of entries showed per page.

            ProductService.getCourseTypeList(start, number,tableState,$scope.CourseTypeListFilter).then(function (result) {
                //console.dir(result.data);
                $scope.getAllSelected();
                $scope.CourseTypeList = result.data;

            });

        }
        function getProductsTypeListController(tableState){
            var pagination = tableState.pagination;
            var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
            var number = pagination.number || 10;  // Number of entries showed per page.
            ProductService.getProductTypeList(start, number,tableState, $scope.ProductTypeListFilter).then(function (result) {
                //console.dir(result.data);
                $scope.getAllSelected();
                $scope.ProductTypeList = result.data;
            });
        }
        function getAllSelected() {
            CommonService.getGradeIdSelect().then(function (result) {
                $scope.gradeIds = result.data;
            });
            CommonService.getCourseTypeIdSelectOfOne2One().then(function (result) {
                $scope.courseTypeIdsOfOne2One = result.data;
            });
            CommonService.getCourseTypeIdSelectOfShaoNianPai().then(function (result) {
                $scope.courseTypeIdsOfShaoNianPai = result.data;
            });

        }
        function getDetailedCourse(){
            //获取产品详情todo
            ProductService.getCourse($scope.Course.courseId).then(function(result){
                $scope.Course.courseImage = {};
                $scope.imageSrc = url_timestamp(QINIU_O2O_DOMIAN+result.data.courseImage);
                $scope.Course.courseImage = result.data.courseImage;
                $scope.courseIntroList = result.data.courseIntroList;
            });
        }


        /***********************************service**************************************************************************************/

        function omsProductTypeIdChange(){
            //console.log($scope.Course);
            ProductService.getCourseTypeByFilter($scope.Course).then(function(result){
                //console.log(result.data);
                $scope.CourseTypeListByFilter = result.data;
            });
        }

        //课程类型变化
        function courseTypeIdAndGradeIdChange(){
            if($scope.Course.gradeId && $scope.Course.courseTypeId){
                var courseTypeName = null;
                var gradeName = null;
                for(var index1 in $scope.gradeIds){
                    if($scope.Course.gradeId == $scope.gradeIds[index1].id){
                        gradeName = $scope.gradeIds[index1].name;
                    }
                }
                for(var index2 in $scope.CourseTypeListByFilter){
                    if($scope.Course.courseTypeId == $scope.CourseTypeListByFilter[index2].id){
                        courseTypeName = $scope.CourseTypeListByFilter[index2].name;
                    }
                }
                $scope.Course.name = gradeName + courseTypeName;
            }else{
                $scope.Course.name = null;
            }
        }
        function addSubmit(){
            var params = $scope.Course;
            params.teacherId = $routeParams.teacherId;
            params.courseIntroList = $scope.courseIntroList;
            TeacherService.addTeacherCourseService(params).then(function(result){
                if(result.status == "FAILURE"){
                    SweetAlert.swal(result.data);
                    //$scope.dataLoadingForCourse = false;
                    return;
                }
                SweetAlert.swal('修改成功');
                $scope.modalTeacherCourseAdd.hide();
                $scope.callTeacherCoursesController(oThis.teacherCoutseTableState);
            },function(result){
                SweetAlert.swal('失败'+ result.data);
            })
        }
        function editSubmit(){
            var params = $scope.Course;
            params.teacherId = $routeParams.teacherId;
            params.courseIntroList = $scope.courseIntroList;
            TeacherService.updateTeacherCourse(params).then(function(result){
                SweetAlert.swal('修改成功');
                $scope.modalTeacherCourseEdit.hide();
                $scope.callTeacherCoursesController(oThis.teacherCoutseTableState);
            },function(result){
                SweetAlert.swal('失败'+ result.data);
            })
        }
        $scope.getSubjectIdSelect = function getProductIdSelect() {
            CommonService.getSubjectIdSelect().then(function (result) {
                $scope.subjectIds = result.data;
            });
        }();

        /***********************************util**************************************************************************************/
        function ifEditShow(){
            if (oThis.showType == 0) {//1 表示修改  2 表示添加  0 表示显示
                //$('.js-edit-bottom').hide();
                oThis.isEdit = false;
            }
            if (oThis.showType==1 || oThis.showType==2) {//1 表示修改  2 表示添加  0 表示显示
                oThis.isEdit = true;//頁面是否可以編輯
                if(check_null($scope.Course.privateFlag) ||  oThis.showType==2){
                    oThis.view.isOwnCourse = true;
                }
            }

        }

        /** 添加线上课程介绍 */
        function saveOrUpdateOnlineCourse(){
            $scope.Course.courseIntroList = $scope.courseIntroList;
            if (typeof $scope.Course.id === 'undefined') {
                var promise = ProductService.createCourse($scope.Course);
                promise.then(function(success) {
                    if(success.status == "FAILURE"){
                        SweetAlert.swal(success.data);
                        $scope.dataLoadingForCourse = false;
                        return;
                    }
                    $scope.dataLoadingForCourse = false;
                    $scope.modalForCourse.hide();
                    $scope.CourseListTableState.pagination.start = 0;
                    $scope.getCourseList($scope.CourseListTableState);
                }, function(error) {
                    $scope.dataLoadingForCourse = false;
                });
            } else {
                /* delete by sunqc@youwinedu.com at 2015-12-01
                 if($scope.CourseOld.gradeId == $scope.Course.gradeId && $scope.CourseOld.courseTypeId == $scope.Course.courseTypeId
                 && $scope.CourseOld.standardPrice == $scope.Course.standardPrice && $scope.CourseOld.name == $scope.Course.name){
                 $scope.dataLoadingForCourse = false;
                 $scope.modalForCourse.hide();
                 return;
                 }*/
                var promise = ProductService.updateCourse($scope.Course);
                promise.then(function(success) {
                    if(success.status == "FAILURE"){
                        SweetAlert.swal(success.data);
                        $scope.dataLoadingForCourse = false;
                        return;
                    }
                    $scope.dataLoadingForCourse = false;
                    $scope.modalForCourse.hide();
                    $scope.CourseListTableState.pagination.start = 0;
                    $scope.getCourseList($scope.CourseListTableState);
                }, function(error) {
                    $scope.dataLoadingForCourse = false;
                });
            }
        }
        /** 添加课程介绍 */
        function addCourseIntro(){
            var courseIntro ={'courseNumSeq':($scope.courseIntroList.length+1),'courseContent':$("#courseContent").val(),'courseMaterial':$("#courseMaterial").val(),'isNotFirst':false};
            $scope.courseIntroList.push(courseIntro);
            $scope.courseIntroList[0].isNotFirst = true;
            //$scope.courseNumSeq=null;
            //$scope.courseContent=null;
            //$scope.courseMaterial=null;
            $("#courseNumSeq").val('');
            $("#courseContent").val('');
            $("#courseMaterial").val('');
        }
        /** 清空课程介绍 */
        function clearCourseIntro(){
            $scope.courseIntroList = [];
        }


        /** 添加线上产品相关 */
        $scope.courseIntroList=[];
        $scope.expiredDaysSelect = [
            {name:'一个月',id:1},{name:'两个月',id:2},{name:'三个月',id:3},
            {name:'四个月',id:4},{name:'五个月',id:5},{name:'六个月',id:6},
            {name:'七个月',id:7},{name:'八个月',id:8},{name:'九个月',id:9},
            {name:'十个月',id:10},{name:'十一个月',id:11},{name:'十二个月',id:12},
            {name:'十三个月',id:13},{name:'十四个月',id:14},{name:'十五个月',id:15},
            {name:'十六个月',id:16},{name:'十七个月',id:17},{name:'十八个月',id:18},
            {name:'十九个月',id:1},{name:'二十个月',id:20},{name:'二十一个月',id:21},
            {name:'二十二个月',id:22}, {name:'二十个三月',id:23},{name:'二十四个月',id:24}
        ];
        $scope.isShelveSelect = [{name:'上架',id:1},{name:'下架',id:0}];
        $scope.courseIntro={};
        $scope.courseNumSeq=null;
        $scope.courseContent=null;
        $scope.courseMaterial=null;

        $scope.getFile = function () {
            fileReader.readAsDataUrl($scope.Course.courseImage, $scope)
                .then(function(result) {
                    $scope.imageSrc = result;
                    $scope.Course.courseImage=result;
                });
        };
        $scope.deleteCourIntro = function(id){
            $scope.courseIntroList.splice(id-1,1);
            for(var i=(id-1);i<$scope.courseIntroList.length;i++){
                $scope.courseIntroList[i].courseNumSeq -= 1;
            }
        };


    }])
    .controller('SearchProductController',['$scope', '$modal', '$rootScope', 'SweetAlert','CommonService','ProductService','TeacherService','OrderService',
    function($scope, $modal, $rootScope, SweetAlert,CommonService,ProductService,TeacherService,OrderService) {
        var oThis = this;


        /**
         * 产品类型列表
         */
        $scope.ProductTypeList = [];//产品类型列表数据
        $scope.ProductTypeListFilter = {};//产品类型列表过滤条件
        $scope.ProductTypeListTableState = {};//产品类型列表分页条件
        $scope.getProductTypeList = function(tableState){
            var start =  0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
            var number = 10;  // Number of entries showed per page.
            var params = {
                'search':{
                    'predicateObject':{
                        'pageNum':0,
                        'pageSize':10
                    }
                }
            };
            var filter = {
                'pageNum':0,
                'pageSize':10,
                'productTypeId':config.flag.onLineCourseFlag  //只查线上的
            };
            ProductService.getProductTypeList(start, number,params,filter).then(function (result) {

                $scope.ProductTypeList = result.data;
                $scope.CourseListFilter.productTypeId = config.flag.onLineCourseFlag;//产品类型只选线上产品
                $scope.onProductIdSelect();
            });
        };

        (function init(angular){
            oThis.checkedTeacher = {};
            $scope.CourseListFilter = {};//课程列表过滤条件
            oThis.checkedProductList = [];
            oThis.productList = [];


            oThis.isproductListLoading = true;
            oThis.checkedTeacher = angular.copy($scope.checkedTeacher);
            $scope.getProductTypeList();
            $scope.CourseListFilter.productTypeId = config.flag.onLineCourseFlag;


        })(angular);

        oThis.checkedProduct = checkedProduct;
        oThis.submitTeacherProductsController = submitTeacherProductsController;

        $scope.callSearchProductListController = callSearchProductListController;

        $scope.isSelected = isSelected;

        //-----------------------------------------------------------------------------------------------------------------------------------------

        //是否选中
        function isSelected(product){
            for(var index in oThis.checkedProductList){
                if(oThis.checkedProductList[index].id == product.id){
                    return true;
                }
            }
            return false;
        };

        function callSearchProductListController(tableState){

            oThis.CourseListTableState = tableState;
            //console.dir($scope.one2OneCourseListFilter);

            var pagination = tableState.pagination;
            var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
            var number = pagination.number || 10;  // Number of entries showed per page.
            $scope.CourseListFilter.productTypeId = config.flag.onLineCourseFlag;//添加查询过滤条件 线上课程
            $scope.CourseListFilter.isShelve = 1;//添加查询过滤条件 上架
            ProductService.getOnLineCourseList(start, number, tableState,$scope.CourseListFilter).then(function (result) {
                //console.dir(result.data);
                oThis.getAllSelected();
                $scope.CourseList = result.data;
                tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                $scope.CourseListTableState = tableState;
                oThis.isproductListLoading = false;
            });
        }

        //-----------------------------------------------------------------------------------------------------------------------------------------
        /**
         * 课程列表
         */
        $scope.CourseList = [];//课程列表数据
        $scope.CourseListFilter = {};//课程列表过滤条件
        $scope.CourseListTableState = {};//课程列表分页条件
        $scope.getCourseList = function(tableState){
            $scope.CourseListTableState = tableState;
            $scope.isCourseListLoading = true;
            var pagination = tableState.pagination;
            var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
            var number = pagination.number || 10;  // Number of entries showed per page.
            ProductService.getOnLineCourseList(start, number, tableState,$scope.CourseListFilter).then(function (result) {
                //console.dir(result.data);
                $scope.getAllSelected();
                $scope.CourseList = result.data;
                tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                $scope.CourseListTableState = tableState;
                $scope.isCourseListLoading = false;
            });
        };

        /**************************************product list change*********************************************/
        $scope.onProductIdSelect = function onProductIdSelect() {
            $scope.gradeIdSelectes = [];
            $scope.courseTypeIds = [];
            var params = {};
            params.productId = $scope.CourseListFilter.productTypeId;//CourseListFilter.productTypeId
            //CommonService.getCourseTypeIdSelect(params).then(function (result) {
            //    $scope.courseTypeIds = result.data;
            //});
            $scope.CourseListFilter.productTypeId = config.flag.onLineCourseFlag;//产品类型只选线上产品
            OrderService.getCourseTypeIdSelect(params).then(function (result) {
                $scope.courseTypeIds = result.data;
            });
        };
        $scope.onCourseTypeIdSelect = function onCourseTypeIdSelect() {
            $scope.gradeIdSelectes = [];
            var params = {};
            params.courseTypeId = $scope.CourseListFilter.course_type_id;
            //CommonService.getGradeIdSelect(params).then(function (result) {
            //    $scope.gradeIds = result.data;
            //});
            $scope.CourseListFilter.productTypeId = config.flag.onLineCourseFlag;//产品类型只选线上产品
            OrderService.getGradeIdSelect(params).then(function (result) {
                $scope.gradeIdSelectes = result.data;
                $scope.CourseListFilter.productTypeId = config.flag.onLineCourseFlag;//产品类型只选线上产品
                console.log($scope.CourseListFilter.productTypeId);
            });


        };


        /**
         * 课程类型列表
         */
        $scope.CourseTypeList = [];//课程类型列表数据
        $scope.CourseTypeListFilter = {};//课程类型列表过滤条件
        $scope.CourseTypeListTableState = {};//课程类型列表分页条件
        $scope.getCourseTypeList = function(tableState){
            $scope.CourseTypeListTableState = tableState;
            //console.dir(tableState);
            $scope.isCourseTypeListLoading = true;
            var pagination = tableState.pagination;
            var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
            var number = pagination.number || 10;  // Number of entries showed per page.
            ProductService.getCourseTypeList(start, number, tableState,$scope.CourseTypeListFilter).then(function (result) {
                //console.dir(result.data);
                $scope.getAllSelected();
                $scope.CourseTypeList = result.data;
                tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                $scope.CourseTypeListTableState = tableState;
                $scope.isCourseTypeListLoading = false;
            });
        };
        /**
         * 获取年级、课程类型下拉菜单
         */
        $scope.gradeIds = [];
        $scope.courseTypeIdsOfOne2One = [];
        $scope.courseTypeIdsOfShaoNianPai = [];
        oThis.getAllSelected = function getAllSelected() {
            CommonService.getGradeIdSelect().then(function (result) {
                $scope.gradeIds = result.data;
            });
            CommonService.getCourseTypeIdSelectOfOne2One().then(function (result) {
                $scope.courseTypeIdsOfOne2One = result.data;
            });
            CommonService.getCourseTypeIdSelectOfShaoNianPai().then(function (result) {
                $scope.courseTypeIdsOfShaoNianPai = result.data;
            });

        };

        function checkedProduct(product){
            console.log(product);
            var numDelete = examineIsCheckedProductById(product);

            if(numDelete==-1){
                oThis.checkedProductList.push(product);
            }else{
                oThis.checkedProductList.splice(oThis.checkedProductList.indexOf(product), 1);//dom中删除当前行
            }

        }
        function submitTeacherProductsController(){
            if(oThis.checkedProductList.length > 0) {
                TeacherService.setTeacherToProductsService(oThis.checkedTeacher, oThis.checkedProductList).then(function (result) {
                    SweetAlert.swal('操作成功');
                    $scope.modalSearchProduct.hide();
                    $scope.callTeacherCoursesController($scope.teacherCoutseTableState);
                }, function (error) {
                    SweetAlert.swal('操作失败');
                })
            }else{
                SweetAlert.swal('请选择课程');
            }
        }

        //-----------------------------------------------------------------------------------------------------------------------------------------
        function examineIsCheckedProductById(product){
            for(var i=0;i<oThis.checkedProductList.length;i++){
                if(oThis.checkedProductList[i].id == product.id){
                    return i;
                }
            }
            return -1;
        }

    }]);
