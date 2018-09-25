'use strict';
/**
 * The Coupon management controller.
 * @author sunqc
 * @version 1.0
 */
var ywsApp = angular.module('ywsApp');
ywsApp.controller('CouponControllerV2',
    ['$scope', '$modal', '$rootScope', 'SweetAlert','O2oCouponManagementService','$location','ProductService','$routeParams',
        function($scope, $modal, $rootScope, SweetAlert,O2oCouponManagementService,$location,ProductService,$routeParams) {
            var oThis = this;
            var DEFAULT_IMG_URL = Constants.DEFAULT_IMG_URL;//当图片不存在时显示的图片地址

            //=================================***********************************新优惠券
            $scope.preferentialPolicyList = [{"name":"满减","id":1},{"name":"打折","id":2}];
            $scope.statusList = [{"name":"上架","id":1},{"name":"下架","id":2},{"name":"失效","id":3}];

            $scope.currentDate = new Date();

            var id = $routeParams.id;

            $scope.couponFilter = {};
            $scope.couponList =  [];
            $scope.couponListTableState = {};
            $scope.getCouponList = function callServer(tableState) {
                if(!tableState.pagination){
                    tableState.pagination={};
                    tableState.search={};
                    tableState.search={predicateObject:{}};
                }
                $scope.couponListTableState = tableState;
                $scope.isCouponLoading = true;
                var pagination = tableState.pagination;
                var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
                var number = pagination.number || 10;  // Number of entries showed per page.
                O2oCouponManagementService.couponListv2(start, number,$scope.couponFilter).then(function (response) {
                    if(response.status == 'SUCCESS'){
                        $scope.couponList = response.data.list;
                        tableState.pagination.numberOfPages = response.data.pages;//set the number of pages so the pagination can update
                    }else{
                        $scope.couponList = [];
                        tableState.pagination.numberOfPages = 0;//set the number of pages so the pagination can update
                    }
                    $scope.couponListTableState = tableState;
                    $scope.isCouponLoading = false;
                });
            };

            $scope.toAdd = function toAdd() {
                $location.path('/o2o-admin/coupon/edit/0');
            };
            $scope.toList = function toList() {
                $location.path('/o2o-admin/coupon');
            };

            $scope.toView = function toView(row) {
                $location.path('/o2o-admin/coupon/view/' + row.id);
            };
            $scope.test = function test() {
                O2oCouponManagementService.getUrl().then(function (result) {
                    console.log(result);
                });
            };
            $scope.shelfStatusList = [{"name":"上架","id":1},{"name":"下架","id":0}];
            $scope.preferentialPolicyList = [{"name":"满减","id":1},{"name":"打折","id":2}];

            $scope.offShelf = function offShelf(row) {
                var obj = {};
                obj.id = row.id;
                obj.isShelve = 0;
                O2oCouponManagementService.upDownShelveService(obj).then(function (result) {
                    console.log(result);
                    $scope.getCouponList($scope.couponListTableState);
                });
            };

            $scope.onShelf = function onShelf(row) {
                var obj = {};
                obj.id = row.id;
                obj.isShelve = 1;
                O2oCouponManagementService.upDownShelveService(obj).then(function (result) {
                    console.log(result);
                    $scope.getCouponList($scope.couponListTableState);
                });
            };

            $scope.edit = function edit(row) {
                $location.path('/o2o-admin/coupon/edit/' + row.id);
            };

            $scope.deleteCoupon = function deleteCoupon(row) {
                var id = row.id;
                SweetAlert.swal({
                      title: "确定删除该优惠券？",
                      type: "warning",
                      showCancelButton: true,
                      confirmButtonColor: '#DD6B55',
                      confirmButtonText: '确定',
                      cancelButtonText: '取消',
                      closeOnConfirm: true
                  }, function(confirm) {
                      if (confirm) {
                          O2oCouponManagementService.deleteCouponService(id).then(function (result) {
                              SweetAlert.swal('操作成功');
                              $scope.getCouponList($scope.couponListTableState);
                          });
                      }
                  }
                );
            };

//            $scope.selectCourseList = [];
//            $scope.getSelectCourseList = function getSelectCourseList() {
////TODO
//            };

//            $scope.selectCourse = function selectCourse() {
////TODO
//            };

//            $scope.deleteCourse = function deleteCourse(row) {
////TODO
//            };


//            $scope.selectRegionList = [];
//            $scope.getSelectRegionList = function getSelectRegionList() {
////TODO
//            };
//            $scope.selectRegion = function selectRegion() {
////TODO
//            };
//
//            $scope.deleteRegion = function deleteRegion(row) {
////TODO
//            };

            //$scope.gainConditionTypeList = [{"name":"无限制","id":0},{"name":"新用户注册","id":1},{"name":"推荐好友","id":2},{"name":"指定用户","id":3}];

            //$scope.domain = "";
            //if($location.host().indexOf("localhost") != -1){//返回大于等于0的整数值，若不包含"localhost"则返回"-1。);
            //    $scope.domain = "http://" + $location.host() + ":8000/app";
            //}else{
            //    $scope.domain = "http://" + $location.host();
            //}
            //=================================***********************************选课程相关

            //$scope.selectCourse = function selectCourse() {
            //    $scope.selectCourseTitle = '添加';
            //    $scope.selectCourseModal = $modal({scope: $scope, templateUrl: 'partials/o2o/coupon/modal.selectCourse.html', show: true });
            //
            //};

            //$scope.CourseList = [];//课程列表数据
            //$scope.CourseListFilter = {};//课程列表过滤条件
            //$scope.CourseListTableState = {};//课程列表分页条件
            //$scope.getCourseList = function(tableState){
            //    $scope.CourseListTableState = tableState;
            //    $scope.isCourseListLoading = true;
            //    var pagination = tableState.pagination;
            //    var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
            //    var number = pagination.number || 10;  // Number of entries showed per page.
            //    ProductService.getCouponSelectList(start, number,$scope.CourseListFilter).then(function (response) {
            //        if(response.status == 'SUCCESS'){
            //            $scope.CourseList = response.data.list;
            //            tableState.pagination.numberOfPages = response.data.pages;//set the number of pages so the pagination can update
            //        }else{
            //            $scope.CourseList = [];
            //            tableState.pagination.numberOfPages = 0;//set the number of pages so the pagination can update
            //        }
            //        $scope.CourseListTableState = tableState;
            //        $scope.isCourseListLoading = false;
            //    });
            //};

            //$scope.gradeList = [
            //    {"name":"小学一年级","id":1},{"name":"小学二年级","id":2},{"name":"小学三年级","id":3},
            //    {"name":"小学四年级","id":4},{"name":"小学五年级","id":5},{"name":"小学六年级","id":6},
            //    {"name":"初中一年级","id":7},{"name":"初中二年级","id":8},{"name":"初中三年级","id":9},
            //    {"name":"高中一年级","id":10},{"name":"高中二年级","id":11},{"name":"高中三年级","id":12}
            //];
            //$scope.subjectList1 = [{"name":"英语","id":1},{"name":"语文","id":2},{"name":"数学","id":3},
            //    {"name":"物理","id":4},{"name":"化学","id":5},{"name":"历史","id":6},
            //    {"name":"政治","id":7},{"name":"地理","id":8},{"name":"生物","id":9}
            //];
            //$scope.subjectList2 = [{"name":"英语","id":1},{"name":"语文","id":2},{"name":"数学","id":3}];
            //$scope.subjectList = $scope.subjectList1;
            //$scope.onGradeChange = function onGradeChange() {
            //    if( $scope.CourseListFilter.gradeId == 1 || $scope.CourseListFilter.gradeId == 2 || $scope.CourseListFilter.gradeId == 3 ){
            //        $scope.subjectList = $scope.subjectList2;
            //    }else{
            //        $scope.subjectList = $scope.subjectList1;
            //    }
            //};

            //$scope.selected = {};
            //$scope.selected.courses = [];
            //$scope.isCourseSelected = function(row){
            //    var list = angular.copy($scope.selected.courses);
            //    for(var i=0;i<list.length;i++){
            //        if(row.id == list[i].id){
            //            return true;
            //        }
            //    }
            //    return false;
            //};
            //
            //$scope.selectOneCourse = function(row,e){
            //    if($scope.isCourseSelected(row)){
            //        $scope.deleteOneCourse(row);
            //        return false;
            //    }
            //    $scope.addOneCourse(row);
            //};
            //
            //$scope.addOneCourse = function(row){
            //    Array.prototype.push.call($scope.selected.courses,row);
            //};
            //
            //$scope.deleteOneCourse = function(row){
            //    var list = $scope.selected.courses;
            //    for(var i=0;i<list.length;i++){
            //        if(row.id == list[i].id){
            //            Array.prototype.splice.call(list,i,1);
            //            return false;
            //        }
            //    }
            //};
            //
            //$scope.doSelectCourse = function(){
            //    //TODO
            //};
            //=================================***********************************选区域相关









        }]);