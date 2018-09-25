'use strict';
/**
 * The Coupon management controller.
 * @author sunqc
 * @version 1.0
 */
var ywsApp = angular.module('ywsApp');
ywsApp.controller('CouponControllerV2Add',
    ['$scope', '$modal', '$rootScope', 'SweetAlert','O2oCouponManagementService','$location','ProductService','$routeParams','CommonService','FileUploader','$base64','localStorageService','AuthenticationService',
        function($scope, $modal, $rootScope, SweetAlert,O2oCouponManagementService,$location,ProductService,$routeParams,CommonService,FileUploader,$base64,localStorageService,AuthenticationService) {
            var oThis = this;
            var DEFAULT_IMG_URL = Constants.DEFAULT_IMG_URL;//当图片不存在时显示的图片地址

            //=================================***********************************新优惠券
            //$scope.preferentialPolicyList = [{"name":"满减","id":1},{"name":"打折","id":2}];
            //$scope.statusList = [{"name":"上架","id":1},{"name":"下架","id":2},{"name":"失效","id":3}];

            $scope.currentDate = new Date();

            var id = $routeParams.id;
            $scope.coupon ={};
            $scope.district = {};
            //$scope.couponFilter = {};
            //$scope.couponList =  [];
            //$scope.couponListTableState = {};
            //$scope.getCouponList = function callServer(tableState) {
            //    if(!tableState.pagination){
            //        tableState.pagination={};
            //        tableState.search={};
            //        tableState.search={predicateObject:{}};
            //    }
            //    $scope.couponListTableState = tableState;
            //    $scope.isCouponLoading = true;
            //    var pagination = tableState.pagination;
            //    var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
            //    var number = pagination.number || 10;  // Number of entries showed per page.
            //    O2oCouponManagementService.couponListv2(start, number,$scope.couponFilter).then(function (response) {
            //        if(response.status == 'SUCCESS'){
            //            $scope.couponList = response.data.list;
            //            tableState.pagination.numberOfPages = response.data.pages;//set the number of pages so the pagination can update
            //        }else{
            //            $scope.couponList = [];
            //            tableState.pagination.numberOfPages = 0;//set the number of pages so the pagination can update
            //        }
            //        $scope.couponListTableState = tableState;
            //        $scope.isCouponLoading = false;
            //    });
            //};

            //$scope.toAdd = function toAdd() {
            //    $location.path('/o2o-admin/coupon/edit/0');
            //};
            $scope.saveCoupon = function saveCoupon() {
                if( $scope.coupon.preferentialPolicy == 1 && $scope.coupon.couponReduction > $scope.coupon.couponReductionActivation ){
                    SweetAlert.swal('满减金额不可超过订单金额');
                    return false;
                }

                if($scope.coupon.validityendtime < $scope.coupon.validitystarttime){
                    SweetAlert.swal('结束时间不能小于开始时间!');
                    return false;
                }
                if( $scope.coupon.isCourseLimit == 1 && $scope.fullSelectCourseList.length <= 0 ){
                    SweetAlert.swal('未指定课程');
                    return false;
                }
                if( $scope.coupon.isRegionLimit == 1 && $scope.selectRegionList.length <= 0 ){
                    SweetAlert.swal('未指定地区');
                    return false;
                }
                if( $scope.coupon.gainConditionType == 3 && (!($scope.coupon.key) || $scope.coupon.key == '') ){
                    SweetAlert.swal('未指定用户');
                    return false;
                }

                if($scope.coupon.isCourseLimit == 1){
                    $scope.coupon.courses = $scope.fullSelectCourseList;
                }
                if($scope.coupon.isRegionLimit == 1){
                    $scope.coupon.regions = $scope.selectRegionList;
                }

                if( $scope.coupon.id ){
                    $scope.doEditCoupon();
                }else{
                    $scope.doAddCoupon();
                }
            };

            $scope.doAddCoupon = function doAddCoupon() {
                $scope.confirmTitle = '创建优惠券如下：';
                $scope.confirmModal = $modal({scope: $scope, templateUrl: 'partials/o2o/coupon/modal.confirm.html', show: true });
            };

            $scope.doAddCouponStep2 = function doAddCoupon() {
                if( $scope.coupon.preferentialPolicy == 1 ){
                    $scope.coupon.singlePayment = $scope.coupon.couponReductionActivation;
                }else{
                    $scope.coupon.singlePayment = $scope.coupon.couponDiscountActivation;
                }

                if( !($scope.coupon.couponReduction) ){
                    $scope.coupon.couponReduction = 0;
                }

                O2oCouponManagementService.createV2($scope.coupon).then(function (response) {
                    if(response.status == 'SUCCESS'){
                        SweetAlert.swal('创建成功');
                        $scope.confirmModal.hide();
                        $scope.toList();
                    }else{
                        SweetAlert.swal(response.error);
                        $scope.confirmModal.hide();
                    }
                });
            };

            $scope.doEditCoupon = function doEditCoupon() {
                O2oCouponManagementService.updateV2($scope.coupon).then(function (response) {
                    if(response.status == 'SUCCESS'){
                        SweetAlert.swal('更新成功');
                        $scope.toList();
                    }else{
                        SweetAlert.swal(response.error);
                    }
                });
            };

            $scope.toList = function toList() {
                $location.path('/o2o-admin/coupon');
            };

            $scope.shelfStatusList = [{"name":"上架","id":1},{"name":"下架","id":0}];
            $scope.preferentialPolicyList = [{"name":"减","id":1},{"name":"打","id":2}];

            $scope.fullSelectCourseList = [];
            $scope.selectCourseList = [];
            $scope.selectCourseListTableState = {};
            $scope.getSelectCourseList = function getSelectCourseList(tableState) {
                if(!tableState){
                    tableState ={
                        pagination:{},
                        search:{
                            predicateObject:{}
                        }
                    }
                }
                $scope.selectCourseListTableState = tableState;
                var pagination = tableState.pagination;
                var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
                var number = pagination.number || 10;  // Number of entries showed per page.
                $scope.selectCourseList = $scope.fullSelectCourseList.slice(start,start+number);
                tableState.pagination.numberOfPages = Math.ceil($scope.fullSelectCourseList.length/number);
                $scope.selectCourseListTableState = tableState;
            };

            $scope.deleteCourse = function deleteCourse(row) {
                var list = $scope.fullSelectCourseList;
                for(var i=0;i<list.length;i++){
                    if(row.id == list[i].id){
                        Array.prototype.splice.call(list,i,1);
                        if( $scope.selectCourseList.length > 1 ){
                            $scope.getSelectCourseList($scope.selectCourseListTableState);
                        }else{
                            $scope.selectCourseListTableState.pagination.start = 0;
                            $scope.getSelectCourseList($scope.selectCourseListTableState);
                        }

                        return false;
                    }
                }

            };


            $scope.selectRegionList = [];
            //$scope.getSelectRegionList = function getSelectRegionList(tableState) {
            //
            //    var start = 0;
            //    var number = $scope.selectRegionList.length;
            //    $scope.selectCourseList = $scope.fullSelectCourseList.slice(start,start+number);
            //    tableState.pagination.numberOfPages = Math.ceil($scope.selectRegionList/number);
            //    $scope.selectCourseListTableState = tableState;
            //};
            $scope.selectRegion = function selectRegion() {
                if(!($scope.district.provinceCode)){
                    SweetAlert.swal('请指定地区');
                    return false;
                }

                var list = $scope.selectRegionList;
                var level = $scope.district.cityCode?2:1;
                for(var i=0;i<list.length;i++){
                    if( level == 1 ){
                        if( list[i].level == 1 && $scope.district.provinceCode == list[i].provinceCode ){
                            SweetAlert.swal('已存在');
                            return false;
                        }
                    }
                    if( level == 2 ){
                        if( list[i].level == 2 && $scope.district.provinceCode == list[i].provinceCode && $scope.district.cityCode == list[i].cityCode ){
                            SweetAlert.swal('已存在');
                            return false;
                        }
                    }
                }

                var obj = {};
                var list = $scope.provinceList;
                for(var i=0;i<list.length;i++){
                    if( $scope.district.provinceCode == list[i].provinceCode ){
                        obj.provinceCode = $scope.district.provinceCode;
                        obj.provinceName = list[i].provinceName;
                        obj.level = 1;
                        obj.name = list[i].provinceName;
                        break;
                    }
                }

                if($scope.district.cityCode){
                    var list = $scope.cityList;
                    for(var i=0;i<list.length;i++){
                        if( $scope.district.cityCode == list[i].cityCode ){
                            obj.cityCode = $scope.district.cityCode;
                            obj.cityName = list[i].cityName;
                            obj.level = 2;
                            obj.name = obj.name + list[i].cityName;
                            break;
                        }
                    }
                }

                $scope.selectRegionList.push(obj);
                $scope.district.cityCode = '';
                $scope.district.provinceCode = '';
                $scope.cityList = [];
            };

            $scope.deleteRegion = function deleteRegion(row) {
                var list = $scope.selectRegionList;
                for(var i=0;i<list.length;i++){
                    if( row.level == list[i].level ){
                        if( row.level == 1 ){
                            if( row.provinceCode == list[i].provinceCode ){
                                Array.prototype.splice.call(list,i,1);
                                return;
                            }
                        }
                        if( row.level == 2 ){
                            if( row.provinceCode == list[i].provinceCode && row.cityCode == list[i].cityCode ){
                                Array.prototype.splice.call(list,i,1);
                                return;
                            }
                        }
                    }
                }
            };

            $scope.gainConditionTypeList = [{"name":"无限制","id":0},{"name":"新用户注册","id":1},{"name":"推荐好友","id":2},{"name":"指定用户","id":3}];

            $scope.domain = "";
            if($location.host().indexOf("localhost") != -1){//返回大于等于0的整数值，若不包含"localhost"则返回"-1。);
                $scope.domain = "http://" + $location.host() + ":8000/app";
            }else{
                $scope.domain = "http://" + $location.host();
            }
            //=================================***********************************选课程相关

            $scope.selectCourse = function selectCourse() {
                $scope.selectCourseTitle = '已上架产品';
                $scope.selected.courses = $scope.fullSelectCourseList;
                $scope.selectCourseModal = $modal({scope: $scope, templateUrl: 'partials/o2o/coupon/modal.selectCourse.html', show: true });

            };

            $scope.CourseList = [];//课程列表数据
            $scope.CourseListFilter = {};//课程列表过滤条件
            $scope.CourseListTableState = {};//课程列表分页条件
            $scope.getCourseList = function(tableState){
                $scope.CourseListTableState = tableState;
                $scope.isCourseListLoading = true;
                var pagination = tableState.pagination;
                var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
                var number = pagination.number || 10;  // Number of entries showed per page.
                ProductService.getCouponSelectList(start, number,$scope.CourseListFilter).then(function (response) {
                    if(response.status == 'SUCCESS'){
                        $scope.CourseList = response.data.list;
                        tableState.pagination.numberOfPages = response.data.pages;//set the number of pages so the pagination can update
                    }else{
                        $scope.CourseList = [];
                        tableState.pagination.numberOfPages = 0;//set the number of pages so the pagination can update
                    }
                    $scope.CourseListTableState = tableState;
                    $scope.isCourseListLoading = false;
                });
            };

            $scope.gradeList = [
                {"name":"小学一年级","id":1},{"name":"小学二年级","id":2},{"name":"小学三年级","id":3},
                {"name":"小学四年级","id":4},{"name":"小学五年级","id":5},{"name":"小学六年级","id":6},
                {"name":"初中一年级","id":7},{"name":"初中二年级","id":8},{"name":"初中三年级","id":9},
                {"name":"高中一年级","id":10},{"name":"高中二年级","id":11},{"name":"高中三年级","id":12},
                {"name":"全年级","id":18}
            ];
            $scope.subjectList1 = [{"name":"英语","id":1},{"name":"语文","id":2},{"name":"数学","id":3},
                {"name":"物理","id":4},{"name":"化学","id":5},{"name":"历史","id":6},
                {"name":"政治","id":7},{"name":"地理","id":8},{"name":"生物","id":9},
                {"name":"文综","id":10},{"name":"理综","id":11},{"name":"学能","id":12},
                {"name":"超学年语文","id":13},{"name":"超学年数学","id":14},{"name":"超学年英语","id":15},
                {"name":"赠课科目","id":16},{"name":"无","id":17},{"name":"活动","id":18}
            ];
            $scope.subjectList2 = [{"name":"英语","id":1},{"name":"语文","id":2},{"name":"数学","id":3}];
            $scope.subjectList = $scope.subjectList1;
            $scope.onGradeChange = function onGradeChange() {
                if( $scope.CourseListFilter.gradeId == 1 || $scope.CourseListFilter.gradeId == 2 || $scope.CourseListFilter.gradeId == 3 ){
                    $scope.subjectList = $scope.subjectList2;
                }else{
                    $scope.subjectList = $scope.subjectList1;
                }
            };

            $scope.selected = {};
            $scope.selected.courses = [];
            $scope.isCourseSelected = function(row){
                var list = angular.copy($scope.selected.courses);
                for(var i=0;i<list.length;i++){
                    if(row.id == list[i].id){
                        return true;
                    }
                }
                return false;
            };

            $scope.selectOneCourse = function(row,e){
                if($scope.isCourseSelected(row)){
                    $scope.deleteOneCourse(row);
                    return false;
                }
                $scope.addOneCourse(row);
            };

            $scope.addOneCourse = function(row){
                Array.prototype.push.call($scope.selected.courses,row);
            };

            $scope.deleteOneCourse = function(row){
                var list = $scope.selected.courses;
                for(var i=0;i<list.length;i++){
                    if(row.id == list[i].id){
                        Array.prototype.splice.call(list,i,1);
                        return false;
                    }
                }
            };

            $scope.doSelectCourse = function(){
                for(var ind in $scope.selected.courses){
                    var flag = true;
                    for(var index in $scope.fullSelectCourseList){
                        if( $scope.fullSelectCourseList[index].id == $scope.selected.courses[ind].id ){
                            flag = false;
                        }
                    }
                    if(flag){
                        $scope.fullSelectCourseList.push($scope.selected.courses[ind]);
                    }
                }
                $scope.selectCourseModal.hide();
                $scope.CourseList = [];
                $scope.CourseListFilter = {};
                $scope.CourseListTableState = {};
                $scope.selected.courses = [];
                $scope.subjectList = $scope.subjectList1;
                $scope.getSelectCourseList($scope.selectCourseListTableState);
            };

            $scope.selectAllCourseFlag = false;
            $scope.isSelectedAllCourse = function(){
                for(var index in $scope.CourseList){
                    var flag = false;
                    for(var ind in $scope.selected.courses){
                        if( $scope.CourseList[index].id == $scope.selected.courses[ind].id ){
                            flag = true;
                        }
                    }
                    if( !flag ){
                        return false;
                    }
                }
                return true;
            };
            $scope.selectAllCourse = function(){
                $scope.selectAllCourseFlag = !($scope.isSelectedAllCourse());
                if( $scope.selectAllCourseFlag ){
                    for(var index in $scope.CourseList){
                        var flag = true;
                        for(var ind in $scope.selected.courses){
                            if( $scope.CourseList[index].id == $scope.selected.courses[ind].id ){
                                flag = false;
                            }
                        }
                        if( flag ){
                            //$scope.selected.courses.push($scope.CourseList[index]);
                            $scope.addOneCourse($scope.CourseList[index]);
                        }
                    }
                }else{
                    for(var index in $scope.CourseList){
                        var flag = false;
                        for(var ind in $scope.selected.courses){
                            if( $scope.CourseList[index].id == $scope.selected.courses[ind].id ){
                                flag = true;
                            }
                        }
                        if( flag ){
                            //$scope.selected.courses.push($scope.CourseList[index]);
                            $scope.deleteOneCourse($scope.CourseList[index]);
                        }
                    }
                }
                //console.log($scope.selected.courses);
            };

            //========================****************************选地区
            $scope.provinceList = [];
            $scope.cityList = [];
            $scope.provinceChange = function(){
                if($scope.district.provinceCode){
                    CommonService.getCitySelect($scope.district.provinceCode).then(function (result) {
                        $scope.cityList = result.data;
                        if( $scope.district.provinceCode == 110000 ){
                            $scope.district.cityCode = 110200;
                        }
                        if( $scope.district.provinceCode == 120000 ){
                            $scope.district.cityCode = 120200;
                        }
                        if( $scope.district.provinceCode == 310000 ){
                            $scope.district.cityCode = 310200;
                        }
                        if( $scope.district.provinceCode == 500000 ){
                            $scope.district.cityCode = 500200;
                        }
                    });
                }else{
                    $scope.cityList = [];
                }
            };
            //========================****************************传文件
            //上传导入信息
            var uploader = $scope.uploader = new FileUploader({
                //url: config.endpoints.sos.LeadsStudent + '/importLeads',
                url: config.endpoints.o2o.coupon + '/couponuserimport',
                headers:{
                    'Authorization' : 'bearer ' + $base64.encode(localStorageService.get('user').account + ':' + localStorageService.get('token')),
                }
            });

            // FILTERS
            uploader.filters.push({
                name: 'customFilter',
                fn: function(item /*{File|FileLikeObject}*/, options) {
                    if( this.queue.length >=1 ){
                        SweetAlert.swal('只能单个上传');
                        return false;
                    }
                    return this.queue.length < 1;
                }
            });
            //添加一个文件
            uploader.onAfterAddingFile = function(fileItem) {
                //判断后缀
                var fileExtend=fileItem.file.name.substring(fileItem.file.name.lastIndexOf('.')).toLowerCase();

                //console.info(fileExtend);
                if(fileExtend != '.xlsx'){
                    SweetAlert.swal('请选择后缀名为xlsx格式的excel模版文件');
                    fileItem.remove();
                    return false;
                }

                var size = fileItem.file.size;
                if(size > 2*1024*1024){
                    SweetAlert.swal('大小不能超过2MB');
                    fileItem.remove();
                    return false;
                }

            };

            //添加多个文件
            uploader.onAfterAddingAll = function(addedFileItems) {
                //console.info('onAfterAddingAll', addedFileItems);
            };

            uploader.onProgressItem = function(fileItem, progress) {
                //console.info('onProgressItem', fileItem, progress);
                $rootScope.ywsLoading = true;
            };

            uploader.onCompleteItem = function(fileItem, response, status, headers) {
                //console.info(response);
                if(response.status == 'SUCCESS'){
                    $scope.coupon.key = response.data.key;
                    $scope.coupon.limitAmount = response.data.count;
                    SweetAlert.swal("文件上传成功");
                }else{
                    if( response.data != null ){
                        $scope.alertErr =[];
                        $scope.alertErr[0] = {};
                        $scope.alertErr[0].err = response.error + "：";
                        var i = 0;
                        angular.forEach(response.data, function(err) {
                            var msgs = "";
                            msgs += "第" + err.line + "行 ";
                            angular.forEach(err.infos, function(info) {
                                msgs += info + "  ";
                            });
                            $scope.alertErr[i + 1] = {};
                            $scope.alertErr[i + 1].err=msgs;
                            i++;
                        });
                        $scope.errType = 1;
                        $scope.modal = $modal({scope: $scope, templateUrl: 'partials/o2o/coupon/modal.errorInfo.html?'+new Date().getTime(), show: true });
                    }else{
                        SweetAlert.swal(response.error);
                    }
                }
                fileItem.remove();
                $rootScope.ywsLoading = false;
            };
            //=================================================***********************
            $scope.isEdit = false;
            $scope.initLoad = function initLoad() {
                if( id && id == 0 ){//add
                    $scope.coupon.isShelve = 0;
                    $scope.coupon.preferentialPolicy = 1;
                    $scope.coupon.isAmountLimit = 0;
                    $scope.coupon.isCourseLimit = 0;
                    $scope.coupon.isRegionLimit = 0;
                    $scope.coupon.gainConditionType = 0;
                    var begin = new Date();
                    begin.setHours(0,0,0,0);
                    //$scope.coupon.validitystarttime = begin.Format("yyyy-MM-dd hh:mm:ss");
                    $scope.coupon.validitystarttime = begin.Format("yyyy-MM-dd hh:mm:ss");
                    var end = new Date();
                    end.setHours(23,59,59,0);
                    $scope.coupon.validityendtime = end.Format("yyyy-MM-dd hh:mm:ss");
                }else{
                    $scope.coupon.id = id;
                    O2oCouponManagementService.getFullInfo(id).then(function (response) {
                        $scope.coupon = response.data;
                        //var begin = $scope.coupon.validitystarttime;
                        //var end = $scope.coupon.validityendtime;
                        $scope.coupon.validitystarttime = new Date($scope.coupon.validitystarttime).Format("yyyy-MM-dd hh:mm:ss");
                        $scope.coupon.validityendtime = new Date($scope.coupon.validityendtime).Format("yyyy-MM-dd hh:mm:ss");
                          $scope.isEdit = true;
                        if( $scope.coupon.isCourseLimit == 1 ){
                            $scope.fullSelectCourseList = $scope.coupon.courses;
                            $scope.getSelectCourseList();
                        }
                        if( $scope.coupon.isRegionLimit == 1 ){
                            $scope.selectRegionList = $scope.coupon.regions
                        }
                    });
                }

                CommonService.getProvinceSelect().then(function (result) {
                    $scope.provinceList = result.data;
                });
            }();









        }]);