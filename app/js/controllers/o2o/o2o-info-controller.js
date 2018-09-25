'use strict';
/**
 * The Coupon management controller.
 * @author sunqc
 * @version 1.0
 */
var ywsApp = angular.module('ywsApp');
ywsApp.controller('InfoController',['$scope', '$modal', '$rootScope', 'SweetAlert','O2OInfoService','fileReader','CommonService',
    function($scope, $modal, $rootScope, SweetAlert,O2OInfoService,fileReader,CommonService) {
     $scope.showListView = showListView;

        /*$scope.isBannerListView = true;
        $scope.isRecommendListView = true;*/
        (function init(){
            //getAllProvince();//
            getAllSelected();
        })();

        //getBannerList
        $scope.bannerListSame=[];
        $scope.bannerList = [];

        $scope.bannerTableState = {};
        $scope.getBannerList = function(tableState){
            $scope.isBannerLoading = true;

            $scope.bannerTableState = tableState;

            O2OInfoService.listBanner(tableState).then(function (result) {
                //console.log(result.data);
                $scope.bannerList = result.data;

                $scope.bannerListSame = result.data;
                $scope.isBannerLoading = false;
            });
        }

         //getTeacherBannerList
        $scope.TeacherBannerListSame=[];
        $scope.TeacherBannerList = [];

        $scope.TeacherbannerTableState = {};
        $scope.getTBannerList = function(tableState){
            $scope.isTBannerLoading = true;
            $scope.TeacherbannerTableState = tableState;

            O2OInfoService.TeacherlistBanner(tableState).then(function (result) {
                //console.log(result.data);
                $scope.TeacherBannerList = result.data;
                $scope.TeacherBannerListSame = result.data;
                $scope.isTBannerLoading = false;
            });
        }



        //create banner
        $scope.create = function(banner){

        }

        //banner modal
        $scope.showBannerUpdateModal = function(banner) {
            $scope.banner = angular.copy(banner);
            //console.log($scope.banner);
            $scope.imageSrc = QINIU_O2O_DOMIAN + banner.picPath + "?d=" + new Date();
            $scope.modalTitleForBanner = "编辑Banner";
            $scope.modalForBanner = $modal({scope: $scope, templateUrl: 'partials/o2o/info/modal.banner.html', show: true });
        }

        //update
        $scope.updateBanner = function(){
            //console.log($scope.banner);
            O2OInfoService.updateBanner($scope.banner).then(function (result) {
                //console.log(result.data);
                if(result.status == "FAILURE"){
                    SweetAlert.swal(result.data); return false;
                }
                O2OInfoService.listBanner($scope.bannerTableState).then(function (result) {
                    $scope.getTBannerList($scope.TeacherbannerTableState);
                    $scope.bannerList = result.data;

                    $scope.isBannerLoading = false;
                    $scope.modalForBanner.hide();
                });
            });
        }

        $scope.getFile = function () {
            fileReader.readAsDataUrl($scope.banner.picPath, $scope)
                .then(function(result) {
                    $scope.imageSrc = result;
                    $scope.banner.picPath=result;
                });
        }

        //更改排序
        $scope.changeSort = function(banner,index){

            if(isNaN(banner.sort)||banner.sort==null|banner.sort==0){
                $scope.getBannerList($scope.bannerTableState);
               SweetAlert.swal('请输入正确数字');
                return false;
            }
            for(var i = 0,max = $scope.bannerList.length ;i<max;i++){
                if(banner.sort == $scope.bannerList[i].sort&&i!=index){
                     $scope.getBannerList($scope.bannerTableState);
                     SweetAlert.swal('序号不可重复');
                     return false;
                }
            }
            //console.log(banner);
            var promise = O2OInfoService.updateBanner(banner);

                  //$rootScope.showLoading();
                  promise.then(function() {
                    $scope.getTBannerList($scope.TeacherbannerTableState);
                    SweetAlert.swal("排序成功");
                  }, function(error) {
                    //$rootScope.hideLoading();
                    banner.state = !banner.state;
                    SweetAlert.swal('排序失败');
                  });
        }
         //更改排序
        $scope.changeSort_teacher = function(banner,index){

            if(isNaN(banner.sort)||banner.sort==null|banner.sort==0){
               $scope.getTBannerList($scope.TeacherbannerTableState);
               SweetAlert.swal('请输入正确数字');
                return false;
            }
            for(var i = 0,max = $scope.TeacherBannerList.length ;i<max;i++){
                if(banner.sort == $scope.TeacherBannerList[i].sort&&i!=index){
                     $scope.getTBannerList($scope.TeacherbannerTableState);
                     SweetAlert.swal('序号不可重复');
                     return false;
                }
            }
            //console.log(banner);
            var promise = O2OInfoService.updateBanner(banner);

                  //$rootScope.showLoading();
                  promise.then(function() {
                    SweetAlert.swal("排序成功");
                  }, function(error) {
                    //$rootScope.hideLoading();
                    banner.state = !banner.state;
                    SweetAlert.swal('排序失败');
                  });
        }

        //更改banner状态
        $scope.changState = function(banner){
            var s = banner.state ? '关闭' : '打开';
            //console.log(s);
            SweetAlert.swal({
                title: "确定要"+s+"这条Banner吗？",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: '#DD6B55',
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                closeOnConfirm: true
              }, function(confirm) {
                if (confirm) {
                    banner.state = !banner.state;
                  var promise = O2OInfoService.updateBanner(banner);
                  //$rootScope.showLoading();
                  promise.then(function() {

                  }, function(error) {
                    //$rootScope.hideLoading();
                    banner.state = !banner.state;
                    SweetAlert.swal('更新失败', 'error');
                  });
                }
              }
          );
        }

        $scope.course = {};
        $scope.provinceList = {};
        function getAllProvince(){//省份
            CommonService.getProvinceSelect().then(function(result) {
                $scope.provinceList = result.data;
            });
        }

        //更改省
        $scope.course.provinceCode = null;
        $scope.changeProvince = function(){
            //console.log($scope.course.provinceCode);
            //$scope.provinceCode = provinceCode;
            if($scope.course.provinceCode){
                CommonService.getCitySelect($scope.course.provinceCode).then(function (result) {
                    $scope.cityList = result.data;
                });
            }else{
                $scope.cityList = [];
            }

        }

        //更改市
        $scope.course.cityCode = null;
        $scope.cityChange = function(){

            if($scope.courseTableState.pagination==undefined){
                $scope.courseTableState.pagination={};
            }
            $scope.courseTableState.pagination.start = 0;

            $scope.getCourseList($scope.courseTableState);

             $scope.aa=$scope.course.cityCode;

            $scope.showListView();
        }
      //自动推荐列表
        $scope.autoRecommend = function autoRecommend(tableState) {

            if($scope.course.cityCode==null){
                $scope.course.cityCode=110200;
                tableState=$scope.course.cityCode;
            }
            if(isNaN(tableState)){
                return false;
            }
            $scope.isLoading = true;

            $scope.myautoRecommendTableState = tableState;

            //var pagination = tableState.pagination;
            $scope.autoRecommendTableState=tableState;

           if($scope.course.cityCode) {
                O2OInfoService.recordlist(tableState).then(function (result) {
                    $scope.displayed = result.data.page.list;
                    $scope.courseType.type= result.data.courseType ;

                    if(result.data.courseType==null||result.data.page.list.length==0){
                        $scope.type=result.data.courseType==null ? 1:result.data.courseType.type;
                    }
                    else{
                        $scope.type=result.data.courseType.type;
                    }
                    if($scope.course.provinceCode==null){
                        $scope.course.provinceCode=110000;
                        $scope.course.cityCode=110200;
                    }

                   // tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                    $scope.isLoading = false;
                });
               }
           else{
               $scope.displayed = null;
               $scope.isLoading = false;
           }
        };

        /**
         * 显示列表页面
         */
        function showListView() {
            //$scope.myCoursePlanRecordTableState.cityCode = $scope.course.cityCode;
            $scope.autoRecommend( $scope.course.cityCode);

        }

        //更改推荐方式 默认最新上架
        $scope.courseType = {"type":1};
        $scope.changeType = function(type){
            $scope.course.cityCode = $scope.course.cityCode||110200
            $scope.course.provinceCode = $scope.course.provinceCode||110200
            var promise = ''
            // $scope.courseType.type = type;

            if($scope.courseType.type!=null){//更新
                 $scope.courseType.type = type;
                 $scope.courseType.cityCode=$scope.course.cityCode;
                var promise = O2OInfoService.updateType($scope.courseType);
                promise.then(function(success) {
                    /*if(success.status == "FAILURE"){
                        SweetAlert.swal(success.data);
                        return;

                    }*/


                    $scope.courseType = success.data;
                    $scope.courseType.cityCode=$scope.course.cityCode;
                     $scope.showListView();


                }, function(error) {
                    //$scope.dataLoadingForCourse = false;
                });

            }else{//保存
                 $scope.courseType.type = type;
                 $scope.courseType.cityCode=$scope.course.cityCode;
                var promise = O2OInfoService.createType($scope.courseType);
                promise.then(function(success) {
                    /*if(success.status == "FAILURE"){
                        SweetAlert.swal(success.data);
                        return;
                    }*/
                    $scope.showListView();
                    $scope.courseType = success.data;
                    $scope.type.type=type;
                }, function(error) {
                    //$scope.dataLoadingForCourse = false;
                });
            }
            SweetAlert.swal("设置成功");
        }


        //获取后台推荐的课程列表
        $scope.courseList = [];
        $scope.courseTableState = {};
        $scope.getCourseList = function(tableState){

            if(!$scope.course.cityCode){

                $scope.course.cityCode=110200;
            }
            tableState.provinceCode = $scope.course.provinceCode;
            tableState.cityCode = $scope.course.cityCode;

            $scope.isCourseLoading = true;
            $scope.courseTableState = tableState;
            var pagination = tableState.pagination;
            var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
            var number = pagination.number || 20;  // Number of entries showed per page.

            if(!$scope.course.cityCode){
                $scope.isCourseLoading = false;
                return;
            }
            O2OInfoService.listCourse(start, number, tableState).then(function (result) {
                //console.log(result.data);
                //$scope.courseType = result.data.courseType == null ? {"type":1} : result.data.courseType;

                $scope.courseList = result.data.list;
                tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                $scope.courseTableState = tableState;
                $scope.isCourseLoading = false;
            });
        }

        //推荐课程modal
        function showCourseModal() {
            if($scope.course.cityCode == null){
                SweetAlert.swal("请先选择地区");
                return;
            }
            $scope.modalTitleForCourse = '添加课程推荐';
            $scope.modalForCourse = $modal({scope: $scope, templateUrl: 'partials/o2o/info/modal.course.html', show: true});
        }

        //根据课程类型过滤课程
        $scope.omsCourseList = [];
        $scope.courseTypeChange = function(){
            O2OInfoService.getCourselistByCourseTypeId($scope.course.courseTypeId).then(function(result){
                //console.log(result.data);
                $scope.omsCourseList = result.data;
            });
        }
        //跳转到推荐课程添加页面
        $scope.showAddCourseView = function(){
            $scope.OnlineCourseListFilter = {};
            $scope.courseListOk = [];//已选择的推荐课程
            showCourseModal();
        }
        //跳转到推荐课程编辑页面
        $scope.deleteCourse = function(course){
            course.updateType = 2;
            SweetAlert.swal({
                title: "确定要删除这条推荐吗？",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: '#DD6B55',
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                closeOnConfirm: true
              }, function(confirm) {
                if (confirm) {
                  var promise = O2OInfoService.updateCourse(course);
                  //$rootScope.showLoading();
                  promise.then(function(success) {
                    if(success.status == "FAILURE"){
                        SweetAlert.swal(success.data);
                        return;
                    }
                    $scope.courseList.splice($scope.courseList.indexOf(course),1);
                  }, function(error) {
                    SweetAlert.swal('删除失败', 'error');
                  });
                }
              }
            );
        }

        //保存课程
        $scope.course = {};
        $scope.saveCourse = function(){
            if($scope.courseListOk.length <= 0){
                SweetAlert.swal("请选择要推荐的课程");
                return;
            }
            //判断是否大于十个
            if(($scope.courseListOk.length + $scope.courseList.length) > 10){
                SweetAlert.swal("一个地区最多推荐10个课程");
                return;
            }
            var promise = O2OInfoService.createCourse($scope.courseListOk);
            promise.then(function(success) {
                if(success.status == "FAILURE"){
                    $scope.courseListOk = [];//已选择的推荐课程
                    SweetAlert.swal(success.data);
                    $scope.dataLoadingForCourse = false;
                    return;
                }
                $scope.dataLoadingForCourse = false;
                $scope.modalForCourse.hide();
                $scope.courseTableState.pagination.start = 0;
                $scope.getCourseList($scope.courseTableState);
                $scope.courseListOk = [];//已选择的推荐课程
            }, function(error) {
                $scope.dataLoadingForCourse = false;
                $scope.courseListOk = [];//已选择的推荐课程
            });

        }

        $scope.courseListOk = [];//已选择的推荐课程
        //是否选中
        $scope.isSelected = function(course){
            //console.log(course);
            for(var index in $scope.courseListOk){
                if($scope.courseListOk[index].octId == course.octId){
                    return true;
                }
            }
            return false;
        }

        //选择
        $scope.selectOne =function($event,course){
            // console.dir($scope.courseListOk.length);
            // console.dir($scope.courseList.length);
            // console.dir($scope.courseListOk.length + $scope.courseList.length);
            //判断是否大于十个
             //console.log($event.target.checked);
             if($event.target.checked){
                if(($scope.courseListOk.length + $scope.courseList.length) >= 10){
                    SweetAlert.swal("一个地区最多推荐10个课程");
                    //console.log($event.target.checked);
                    $event.target.checked = false;
                    return;
                }else{
                    $scope.courseListOk.push(course);
                }
             }else{
                for(var index in $scope.courseListOk){
                 if($scope.courseListOk[index].octId == course.octId){
                     $scope.courseListOk =  removeItemFromArray(course,$scope.courseListOk);
                     return;
                 }
                }
             }
        };


        //从已选定的课程中删除一个
        function removeItemFromArray(item,list){
            //console.dir(list);
            var newList = [];
            for(var tmp in list){
                if(list[tmp].octId != item.octId){
                    newList.push(list[tmp]);
                }
            }
            return newList;
        }



        //修改课程排序
        $scope.changeCourseSort = function(course,index){
            course.updateType = 1;
            //console.log(course);
            var re = /^[0-9]*$/ ;
            //if(isNaN(course.sort)){SweetAlert.swal('请输入整数数字');return;}
            //console.log(!re.test(course.sort));

            if(!course.sort || !re.test(course.sort)){SweetAlert.swal('请输入正整数');return;}
            for(var i = 0,max = $scope.courseList.length ;i<max;i++){
                if(course.sort == $scope.courseList[i].sort&&i!=index){
                     $scope.getCourseList($scope.courseTableState);
                     SweetAlert.swal('序号不可重复');
                     return false;
                }
            }
            var promise = O2OInfoService.updateCourse(course);
                promise.then(function(success) {
                    if(success.status == "FAILURE"){
                        SweetAlert.swal('修改排序失败请重试');
                        return;
                    }
                    SweetAlert.swal("排序成功");
                }, function(error) {
                    SweetAlert.swal("排序失败");
                });
        }

        //修改课程状态
        $scope.changeCourseState = function(course){
            course.updateType = 3;
            var s = course.state ? '关闭' : '打开';
            //console.log(s);
            SweetAlert.swal({
                title: "确定要"+s+"这条推荐吗？",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: '#DD6B55',
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                closeOnConfirm: true
              }, function(confirm) {
                if (confirm) {
                  course.state = !course.state;
                  var promise = O2OInfoService.updateCourse(course);
                  //$rootScope.showLoading();
                  promise.then(function() {

                  }, function(error) {
                    course.state = !course.state;
                    SweetAlert.swal('更新失败', 'error');
                  });
                }
              }
            );
        }

        //获取所有的线上课程
        $scope.OnlineCourseList = [];
        $scope.OnlineCourseListTableState = {};
        $scope.OnlineCourseListFilter = {};
        $scope.getAllOnlineCourse = function(tableState){
            if(!tableState.sort.predicate){
                tableState.sort.predicate = '2';
            }
            if(!tableState.sort.reverse){
                tableState.sort.reverse = true;
            }

            $scope.OnlineCourseListTableState = tableState;
            //console.dir(tableState);
            $scope.isOnlineCourseListLoading = true;
            var pagination = tableState.pagination;
            var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
            var number = pagination.number || 10;  // Number of entries showed per page.

            $scope.OnlineCourseListFilter.provinceCode = $scope.course.provinceCode;;
            $scope.OnlineCourseListFilter.cityCode = $scope.course.cityCode;
            var sortFlag = tableState.sort.predicate;
            //var sortType = !tableState.sort.reverse ? true : tableState.sort.reverse;

            $scope.OnlineCourseListFilter.sortFlag = sortFlag;
            //$scope.OnlineCourseListFilter.sortType = sortType;

            //console.dir($scope.OnlineCourseListFilter);

            O2OInfoService.getAllOnlineCourseList(start, number, tableState,$scope.OnlineCourseListFilter).then(function(result){
                //console.log(result.data);
                //console.log($scope.courseListOk);
                $scope.OnlineCourseList = result.data;
                tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                $scope.OnlineCourseListTableState = tableState;
                $scope.isOnlineCourseListLoading = false;

            });
        }

        //获取某个课程的所有教师
        $scope.AllTeacherOfCourseList = [];
        $scope.getAllTeacherOfCourse = function(){
            O2OInfoService.getAllTeacherOfCourse($scope.course.courseId).then(function(result){
                //console.log(result.data);
                $scope.AllTeacherOfCourseList = result.data;
            });
        }

        /**
         * 获取年级、科目、课程类型下拉菜单
         */
        $scope.subjectIds = [];
        $scope.gradeIds = [];
        $scope.courseTypeIds = Constants.OnlineCourseType;
        function getAllSelected() {
            CommonService.getSubjectIdSelect().then(function (result) {
                $scope.subjectIds = result.data;
            });
            CommonService.getGradeIdSelect().then(function (result) {
                $scope.gradeIds = result.data;
            });
            CommonService.getProvinceSelect().then(function (result) {
                $scope.provinceList = result.data;
            });
        };




}]);

